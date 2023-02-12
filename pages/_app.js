import '../styles/globals.css'
import "slick-carousel/slick/slick.css"; 
import "slick-carousel/slick/slick-theme.css";
import { useEffect } from 'react';
import { Analytics } from '@vercel/analytics/react';

function MyApp({ Component, pageProps }) {


  return (
      <>
      <Component {...pageProps} />
      <Analytics />
      </>
  )
}

export default MyApp
