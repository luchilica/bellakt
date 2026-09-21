import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

/**
 * Ensures that whenever the route or search query changes,
 * the window and document scroll position is immediately reset to the very top.
 */
export function ScrollToTop() {
  const { pathname, search } = useLocation();

  useEffect(() => {
    // Immediate reset without animation to avoid flash or bottom jump
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: 'instant' as ScrollBehavior,
    });

    if (document.documentElement) {
      document.documentElement.scrollTop = 0;
    }
    if (document.body) {
      document.body.scrollTop = 0;
    }
  }, [pathname, search]);

  return null;
}
