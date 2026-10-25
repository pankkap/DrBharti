import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

/**
 * ScrollToTop ensures that whenever the route / pathname changes,
 * the browser window immediately scrolls to the top of the page.
 */
const ScrollToTop = () => {
  const { pathname, search, hash } = useLocation();

  useEffect(() => {
    if (!hash) {
      window.scrollTo({
        top: 0,
        left: 0,
        behavior: 'instant',
      });
    } else {
      const element = document.getElementById(hash.replace('#', ''));
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      } else {
        window.scrollTo({
          top: 0,
          left: 0,
          behavior: 'instant',
        });
      }
    }
  }, [pathname, search, hash]);

  return null;
};

export default ScrollToTop;
