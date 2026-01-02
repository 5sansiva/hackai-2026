import type { AppProps } from 'next/app';
import Head from 'next/head';
import localFont from 'next/font/local';
import '../globals.css';


const octin = localFont({
  src: [{ path: "../public/fonts/OctinSpraypaint.otf" }],
  variable: "--font-octin",
  display: "swap",
});

const streetFlow = localFont({
  src: [{ path: "../public/fonts/StreetFlowNYC.otf" }],
  variable: "--font-streetflow",
  display: "swap",
});

export default function MyApp({ Component, pageProps }: AppProps) {
  
  return (
     <div className={`${octin.variable} ${streetFlow.variable}`}>
      <Component {...pageProps} />
     </div> 
  );
}