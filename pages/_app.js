import '../styles/globals.css'
import "slick-carousel/slick/slick.css"; 
import "slick-carousel/slick/slick-theme.css";
import reactGA from 'react-ga';
import { useEffect } from 'react';

function MyApp({ Component, pageProps }) {

  useEffect(() => {
    reactGA.initialize('G-ZH0SDK5GDJ');
    reactGA.pageview(window.location.pathname);
  },[])

  return <Component {...pageProps} />
}

export default MyApp
