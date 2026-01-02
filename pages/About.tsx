import React from 'react'

const About = () => {
  return (
    <section className="w-full py-24 px-6">
      <div className="mx-auto max-w-6xl grid grid-cols-1 md:grid-cols-2 gap-16">
        {/* LEFT */}
        <div>
          <h2
            className="text-white text-4xl md:text-5xl tracking-widest uppercase drop-shadow-[0_4px_0_rgba(0,0,0,0.9)]"
            style={{ fontFamily: "Street Flow NYC" }}
          >
            WHAT IS HACKAI?
          </h2>

          <p
            className="mt-6 text-white/90 text-lg md:text-xl leading-relaxed drop-shadow-[0_3px_0_rgba(0,0,0,0.9)]"
            style={{ fontFamily: "Octin Spraypaint" }}
          >
            HackAI is a student-run hackathon hosted by the Artificial Intelligence
            Society at UTD. We bring together curious builders, designers, and
            engineers to learn, collaborate, and ship real projects with AI. In
            just 24 hours, teams go from idea to demo through workshops, mentorship,
            and hands-on building.
          </p>

          <p
            className="mt-4 text-[#ff2fb2] text-2xl md:text-3xl tracking-wide uppercase drop-shadow-[0_4px_0_rgba(0,0,0,0.9)]"
            style={{ fontFamily: "Octin Spraypaint" }}
          >
            BUILD ARTIFICIAL INTELLIGENCE PROJECTS IN 24 HOURS.
          </p>
        </div>

        {/* RIGHT */}
        <div className="md:pt-24">
          <h2
            className="text-white text-4xl md:text-5xl tracking-widest uppercase drop-shadow-[0_4px_0_rgba(0,0,0,0.9)]"
            style={{ fontFamily: "Street Flow NYC" }}
          >
            WHY SPONSOR HACKAI?
          </h2>

          <p
            className="mt-6 text-white/90 text-lg md:text-xl leading-relaxed drop-shadow-[0_3px_0_rgba(0,0,0,0.9)]"
            style={{ fontFamily: "Octin Spraypaint" }}
          >
            Sponsoring HackAI is a win-win opportunity. Your support helps students
            learn and build, while giving your company direct access to high-signal
            talent and meaningful brand visibility. Sponsors can engage with
            participants through tech talks, workshops, mentorship, and challenge
            prompts — and walk away with strong recruiting leads and fresh ideas.
          </p>

          <p
            className="mt-4 text-[#5aa9ff] text-2xl md:text-3xl tracking-wide uppercase drop-shadow-[0_4px_0_rgba(0,0,0,0.9)]"
            style={{ fontFamily: "Octin Spraypaint" }}
          >
            TOP TECH TALENT, BRANDING, PRODUCT SHOWCASE, AND REAL CHALLENGE
            SOLUTIONS.
          </p>
        </div>
      </div>
    </section>
  )
}

export default About
