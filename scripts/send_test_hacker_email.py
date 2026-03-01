#!/usr/bin/env python3
"""
Send HackAI emails from Firestore using Gmail SMTP.

Safety defaults:
- DRY_RUN defaults to true (no real send).
- TARGET_ACCESS_CODE defaults to "100000" (only this code is processed).

Expected Firestore:
- Collection: hackers
- Recipient field priority: email, school_email, personal_email

Required env vars:
- SMTP_EMAIL
- SMTP_APP_PASSWORD

Optional env vars:
- FIREBASE_SERVICE_ACCOUNT_PATH (default: serviceAccountKey.json)
- FIREBASE_PROJECT_ID
- FIREBASE_CLIENT_EMAIL
- FIREBASE_PRIVATE_KEY
- FIRESTORE_COLLECTION (default: hackers)
- TARGET_ACCESS_CODE (default: 100000)
- EMAIL_FOOTER_IMAGE_PATH (default: public/Email/emailImage.png)
- EMAIL_FOOTER_IMAGE_URL (fallback if file missing)
- DRY_RUN (default: true)
- COUNT_ONLY (default: false) prints counts and exits
- TEST_RECEIVER_EMAIL (used when DRY_RUN is false and TEST_MODE is true)
- TEST_MODE (default: false)
- SEND_DELAY_SECONDS (default: 2.0)
- BATCH_SIZE (default: 50)
- BATCH_PAUSE_SECONDS (default: 20)
"""

from __future__ import annotations

import os
import smtplib
import time
from email.message import EmailMessage
from pathlib import Path
from typing import Any, Dict, List

import firebase_admin
from firebase_admin import credentials, firestore
from google.api_core.exceptions import DeadlineExceeded

REQUIRED_SENDER_EMAIL = "anveetha.suresh@aisociety.io"


def to_str(value: Any) -> str:
    return value if isinstance(value, str) else ""


def load_env_local_file(env_file: str = ".env.local") -> None:
    env_path = Path(env_file)
    if not env_path.exists():
        return

    for raw_line in env_path.read_text(encoding="utf-8").splitlines():
        line = raw_line.strip()
        if not line or line.startswith("#") or "=" not in line:
            continue
        key, value = line.split("=", 1)
        key = key.strip()
        value = value.strip()
        if (
            (value.startswith('"') and value.endswith('"')) or
            (value.startswith("'") and value.endswith("'"))
        ):
            value = value[1:-1]
        if key and key not in os.environ:
            os.environ[key] = value


def get_by_keys(data: Dict[str, Any], keys: List[str]) -> str:
    normalized = {k.lower().replace("_", ""): v for k, v in data.items()}
    for key in keys:
        value = normalized.get(key.lower().replace("_", ""))
        if isinstance(value, str) and value.strip():
            return value.strip()
    return ""


def get_access_code(data: Dict[str, Any]) -> str:
    raw = data.get("access_code", data.get("accessCode", ""))
    return str(raw).strip()


def get_first_name(data: Dict[str, Any]) -> str:
    first = get_by_keys(data, ["fname", "firstName", "first_name", "firstname"])
    if first:
        return first
    full_name = get_by_keys(data, ["name", "fullName", "full_name", "displayName"])
    return full_name.split(" ")[0] if full_name else "Hacker"


def get_last_name(data: Dict[str, Any]) -> str:
    last = get_by_keys(data, ["lname", "lastName", "last_name", "lastname"])
    if last:
        return last
    full_name = get_by_keys(data, ["name", "fullName", "full_name", "displayName"])
    parts = [p for p in full_name.split(" ") if p] if full_name else []
    return parts[-1] if len(parts) > 1 else ""


def get_recipients(data: Dict[str, Any]) -> List[str]:
    emails = [
        get_by_keys(data, ["email"]),
        get_by_keys(data, ["school_email", "schoolEmail"]),
        get_by_keys(data, ["personal_email", "personalEmail"]),
    ]
    deduped: List[str] = []
    seen = set()
    for item in emails:
        lowered = item.lower()
        if item and lowered not in seen:
            seen.add(lowered)
            deduped.append(item)
    return deduped


def load_config() -> Dict[str, Any]:
    cfg = {
        "smtp_email": os.getenv("SMTP_EMAIL", REQUIRED_SENDER_EMAIL).strip(),
        "smtp_password": os.getenv("SMTP_APP_PASSWORD", "").strip(),
        "service_account_path": os.getenv("FIREBASE_SERVICE_ACCOUNT_PATH", "serviceAccountKey.json").strip(),
        "firebase_project_id": os.getenv("FIREBASE_PROJECT_ID", "").strip(),
        "firebase_client_email": os.getenv("FIREBASE_CLIENT_EMAIL", "").strip(),
        "firebase_private_key": os.getenv("FIREBASE_PRIVATE_KEY", "").strip(),
        "collection_name": os.getenv("FIRESTORE_COLLECTION", "hackers").strip(),
        "target_access_code": os.getenv("TARGET_ACCESS_CODE", "100000").strip(),
        "email_footer_image_path": os.getenv(
            "EMAIL_FOOTER_IMAGE_PATH", "public/Email/emailImage.png"
        ).strip(),
        "email_footer_image_url": os.getenv(
            "EMAIL_FOOTER_IMAGE_URL", "https://www.hackai.org/Home/hackAiLogoColor.webp"
        ).strip(),
        "dry_run": os.getenv("DRY_RUN", "true").strip().lower() != "false",
        "count_only": os.getenv("COUNT_ONLY", "false").strip().lower() == "true",
        "test_mode": os.getenv("TEST_MODE", "false").strip().lower() == "true",
        "test_receiver": os.getenv("TEST_RECEIVER_EMAIL", "").strip(),
        "delay_seconds": float(os.getenv("SEND_DELAY_SECONDS", "2.0")),
        "batch_size": int(os.getenv("BATCH_SIZE", "50")),
        "batch_pause_seconds": float(os.getenv("BATCH_PAUSE_SECONDS", "20")),
    }

    if not cfg["service_account_path"] and not (
        cfg["firebase_project_id"] and cfg["firebase_client_email"] and cfg["firebase_private_key"]
    ):
        raise ValueError(
            "Provide FIREBASE_SERVICE_ACCOUNT_PATH or all of FIREBASE_PROJECT_ID, FIREBASE_CLIENT_EMAIL, FIREBASE_PRIVATE_KEY."
        )
    if not cfg["collection_name"]:
        raise ValueError("FIRESTORE_COLLECTION is required.")
    if not cfg["target_access_code"]:
        raise ValueError("TARGET_ACCESS_CODE is required.")
    if cfg["smtp_email"].lower() != REQUIRED_SENDER_EMAIL:
        raise ValueError(
            f"SMTP_EMAIL must be {REQUIRED_SENDER_EMAIL}. Current value: {cfg['smtp_email']}"
        )
    if not cfg["dry_run"] and (not cfg["smtp_email"] or not cfg["smtp_password"]):
        raise ValueError("SMTP_EMAIL and SMTP_APP_PASSWORD are required when DRY_RUN=false.")
    if cfg["test_mode"] and not cfg["test_receiver"]:
        raise ValueError("TEST_RECEIVER_EMAIL is required when TEST_MODE=true.")
    if cfg["batch_size"] <= 0:
        raise ValueError("BATCH_SIZE must be > 0.")
    if cfg["batch_pause_seconds"] < 0:
        raise ValueError("BATCH_PAUSE_SECONDS must be >= 0.")

    return cfg


def init_firestore(service_account_path: str):
    if not firebase_admin._apps:
        if os.path.exists(service_account_path):
            cred = credentials.Certificate(service_account_path)
        else:
            project_id = os.getenv("FIREBASE_PROJECT_ID", "").strip()
            client_email = os.getenv("FIREBASE_CLIENT_EMAIL", "").strip()
            private_key = os.getenv("FIREBASE_PRIVATE_KEY", "").replace("\\n", "\n").strip()
            if not (project_id and client_email and private_key):
                raise FileNotFoundError(
                    f"Service account file not found at '{service_account_path}', and FIREBASE_PROJECT_ID / "
                    "FIREBASE_CLIENT_EMAIL / FIREBASE_PRIVATE_KEY are not fully set."
                )
            cred = credentials.Certificate(
                {
                    "type": "service_account",
                    "project_id": project_id,
                    "client_email": client_email,
                    "private_key": private_key,
                    "token_uri": "https://oauth2.googleapis.com/token",
                }
            )
        firebase_admin.initialize_app(cred)
    return firestore.client()


def build_email(
    first_name: str,
    last_name: str,
    access_code: str,
    status: str,
    footer_image_path: str,
    footer_image_url: str,
) -> EmailMessage:
    msg = EmailMessage()
    msg["Subject"] = "🛹 HackAI 2026: Your Application Status & Event Details"

    full_name = f"{first_name} {last_name}".strip()
    if not full_name:
        full_name = "Hacker"
    footer_path = Path(footer_image_path)
    footer_cid = "hackai-footer-image"
    footer_img_src = f"cid:{footer_cid}" if footer_path.exists() else footer_image_url

    text_body = f"""Hello {full_name}!

The wait is over. We received an incredible volume of applications this year, and we are so excited to finally welcome you to HackAI 2026: Make Your Mark. 🔍
Please read this email in full to ensure you don't miss any information!

🏁 Check Your Status:
To see if you have been accepted, please make an account on the HackAI portal and enter your unique 6-digit code.
Your Unique Code: {access_code}
Website Link: https://www.hackai.org/
Note: This code is unique to your email. Please do not share it with anyone.

🕒 Check-In Logistics
We want to make sure the morning goes smoothly. Please follow the timing for your specific status:
If You Are ACCEPTED:
- Check-In Window: 7:30 AM - 9:30 AM.
- Requirements: Please bring a valid form of ID (Government ID or Comet Card) so we can verify your identity at the door.
- If you are traveling far and will not be able to arrive on time, please let us know in advance so we can ensure space for you.

If You Are REJECTED:
- This is NOT a reflection of your qualifications or abilities, it is simply due to the number of hackers we can accommodate this weekend.
- If you are still excited to participate, don't worry - you can join our waitlist to compete in HackAI.
- Arrival: You may begin lining up at 7:00 AM.
- Process: Once we have checked in our accepted hackers, we will begin admitting waitlisted individuals based on remaining space availability. While we can't guarantee a spot for everyone, we will do our best to get as many of you in as possible!

🍕 Food & Dietary Notes
We want everyone to enjoy their meal! We'll do our best to provide options for various diets, but since we can't guarantee every restriction can be catered to, please feel free to bring along any personal favorites or essentials you might need.

🤝 Teams & Community
Need a Team? Don't worry! We are hosting an in-person team-building event immediately after the opening ceremony, and you are welcome to change and alter your teams up until midnight of March 7th.
Join the Discord: https://discord.gg/pxs9TtVV6v
Follow us on Instagram: https://www.instagram.com/utdais/
All communication during the event will be on Discord. If you are not on Discord throughout the duration of HackAI, we are not responsible for missed communications.

Questions? Reach out anytime at utd.ais@aisociety.io.

— Artificial Intelligence Society: The HackAI Team
"""

    html_body = f"""
<html>
  <body>
    <p>Hello {full_name}!</p>
    <p>
      The wait is over. We received an incredible volume of applications this year, and we are so excited
      to bring you HackAI 2026: Make Your Mark. 🔍
      Please read this email in full to ensure you don&apos;t miss any information!
    </p>

    <h3>🏁 Check Your Status</h3>
    <p>
      To see if you have been accepted, please make an account on the HackAI portal and enter your unique 6-digit code.
      <br />
      <strong>Your Unique Code:</strong> {access_code}
      <br />
      <strong>Website Link:</strong> <a href="https://www.hackai.org/">https://www.hackai.org/</a>
      <br />
      <em>Note: This code is unique to your email. Please do not share it with anyone.</em>
    </p>

    <h3>🕒 Check-In Logistics</h3>
    <p>We want to make sure the morning goes smoothly. Please follow the timing for your specific status:</p>
    <p><strong>If You Are <span style="color:#22c55e;">ACCEPTED</span>:</strong></p>
    <ul>
      <li>Check-In Window: 7:30 AM - 9:30 AM.</li>
      <li>Bring a valid form of ID (Government ID or Comet Card) for identity verification.</li>
      <li>If you are traveling far and may arrive late, please let us know in advance.</li>
    </ul>

    <p><strong>If You Are <span style="color:#facc15;">REJECTED</span>:</strong></p>
    <ul>
      <li>This is not a reflection of your qualifications or abilities; capacity is limited.</li>
      <li>You can still join our waitlist to compete in HackAI.</li>
      <li>Arrival: You may begin lining up at 7:00 AM.</li>
      <li>
        Admission from waitlist begins after accepted hackers are checked in and as space allows. While we
        can&apos;t guarantee a spot for everyone, we will do our best to get as many of you in as possible!
      </li>
    </ul>

    <h3>🍕 Food &amp; Dietary Notes</h3>
    <p>
      We want everyone to enjoy their meal! We&apos;ll do our best to provide options for various diets, but since
      we can&apos;t guarantee every restriction can be catered to, please feel free to bring along any personal
      favorites or essentials you might need.
    </p>

    <h3>🤝 Teams &amp; Community</h3>
    <p>
      Need a Team? Don&apos;t worry! We are hosting an in-person team-building event immediately after the opening ceremony,
      and you are welcome to change and alter your teams up until midnight of March 7th.
    </p>
    <p>
      Join the Discord:
      <a href="https://discord.gg/pxs9TtVV6v">https://discord.gg/pxs9TtVV6v</a>
      - Connect with sponsors and other participants.
      <br />
      Follow us on Instagram:
      <a href="https://www.instagram.com/utdais/">https://www.instagram.com/utdais/</a>
      - Stay in the loop with all AIS activities, and any extra information we may share!
    </p>
    <p>
      All communication during the event will be on Discord. If you are not on the Discord throughout the duration
      of HackAI, we are not responsible for missed communications.
    </p>

    <p>Questions? Reach out anytime at <a href="mailto:utd.ais@aisociety.io">utd.ais@aisociety.io</a>.</p>
    <p>&mdash; Artificial Intelligence Society: The HackAI Team</p>
    <div style="margin-top:24px;">
      <img
        src="{footer_img_src}"
        alt="HackAI 2026"
        style="display:block; width:100%; max-width:280px; height:auto; border:0; outline:none; text-decoration:none;"
      />
    </div>
  </body>
</html>
"""
    msg.set_content(text_body)
    msg.add_alternative(html_body, subtype="html")
    if footer_path.exists():
        html_part = msg.get_body(preferencelist=("html",))
        if html_part is not None:
            suffix = footer_path.suffix.lower().lstrip(".") or "png"
            if suffix == "jpg":
                suffix = "jpeg"
            html_part.add_related(
                footer_path.read_bytes(),
                maintype="image",
                subtype=suffix,
                cid=f"<{footer_cid}>",
                filename=footer_path.name,
            )
    return msg


def send_message(smtp_email: str, smtp_password: str, msg: EmailMessage) -> None:
    with smtplib.SMTP_SSL("smtp.gmail.com", 465) as smtp:
        smtp.login(smtp_email, smtp_password)
        smtp.send_message(msg)


def main() -> None:
    load_env_local_file()
    cfg = load_config()
    db = init_firestore(cfg["service_account_path"])

    users_ref = db.collection(cfg["collection_name"])
    try:
        docs = list(users_ref.stream(timeout=60))
    except DeadlineExceeded:
        print("Initial fetch timed out. Retrying once more...")
        time.sleep(2)
        docs = list(users_ref.stream(timeout=60))

    print(f"Total rows loaded from {cfg['collection_name']}: {len(docs)}")

    eligible_docs = []
    for doc in docs:
        user = doc.to_dict() or {}
        access_code = get_access_code(user)
        if access_code != cfg["target_access_code"]:
            continue

        recipients = get_recipients(user)
        if not recipients:
            continue

        status = to_str(user.get("status", "")).strip().lower()
        if status not in {"accepted", "waitlist", "rejected"}:
            continue

        eligible_docs.append((doc, user, recipients, status, access_code))

    print(
        f"Eligible rows (code={cfg['target_access_code']} and valid status+recipient): {len(eligible_docs)}"
    )

    if cfg["count_only"]:
        print("COUNT_ONLY=true, exiting without sending.")
        return

    total = 0
    sent = 0
    failed = 0

    for idx, (doc, user, recipients, status, access_code) in enumerate(eligible_docs, start=1):
        if idx > 1 and (idx - 1) % cfg["batch_size"] == 0:
            print(
                f"Batch pause: processed {idx - 1} emails. Sleeping {cfg['batch_pause_seconds']}s..."
            )
            time.sleep(cfg["batch_pause_seconds"])

        first_name = get_first_name(user)
        last_name = get_last_name(user)
        msg = build_email(
            first_name,
            last_name,
            access_code,
            status,
            cfg["email_footer_image_path"],
            cfg["email_footer_image_url"],
        )
        msg["From"] = REQUIRED_SENDER_EMAIL

        if cfg["test_mode"]:
            msg["To"] = cfg["test_receiver"]
            print(
                f"[TEST_MODE] Would send to {recipients} (doc={doc.id}, name={first_name}) -> {cfg['test_receiver']}"
            )
        else:
            msg["To"] = ", ".join(recipients)
            print(f"Prepared email for doc={doc.id} -> {recipients}")

        total += 1

        if cfg["dry_run"]:
            print("[DRY_RUN] Skipping actual send.")
            continue

        try:
            send_message(cfg["smtp_email"], cfg["smtp_password"], msg)
            sent += 1
            print("Email sent.")
        except Exception as exc:
            failed += 1
            print(f"Failed for doc={doc.id}: {exc}")

        time.sleep(cfg["delay_seconds"])

    print(
        f"Done. Matched={total}, Sent={sent}, Failed={failed}, "
        f"Collection={cfg['collection_name']}, AccessCode={cfg['target_access_code']}, "
        f"DRY_RUN={cfg['dry_run']}, BatchSize={cfg['batch_size']}"
    )


if __name__ == "__main__":
    main()
