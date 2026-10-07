import { useState, useEffect, useRef } from 'react';

export type ScrollDirection = 'up' | 'down' | 'idle';

export interface UseScrollNavigationOptions {
  /** Scroll distance downward before hiding bottom nav (default: 4px) */
  downThreshold?: number;
  /** Scroll distance upward before showing bottom nav (default: 2px) */
  upThreshold?: number;
  /** Distance from top considered "at top" (default: 20px) */
  topThreshold?: number;
  /** Distance from bottom considered "at bottom" (default: 40px) */
  bottomThreshold?: number;
  /** Any state change (e.g. active tab change) that should reset the navigation to visible */
  resetTrigger?: unknown;
  /** Initial visibility of the bottom nav (default: true) */
  initialBottomNavVisible?: boolean;
}

export interface UseScrollNavigationReturn {
  /** Current scroll direction */
  scrollDirection: ScrollDirection;
  /** Current vertical scroll position in pixels */
  scrollY: number;
  /** Whether the user is at or near the top of the viewport */
  isAtTop: boolean;
  /** Whether the user is at or near the bottom of the page */
  isAtBottom: boolean;
  /** Whether the top header is pinned and elevated */
  isHeaderPinned: boolean;
  /** Whether the bottom navigation bar is visible (shown on scroll-up or top, hidden on scroll-down) */
  isBottomNavVisible: boolean;
  /** Alias for backward compatibility */
  isFooterVisible: boolean;
  /** Dynamically generated CSS classes for the top header */
  headerClasses: string;
  /** Dynamically generated CSS classes for the bottom navigation */
  bottomNavClasses: string;
  /** Manually show the bottom navigation */
  showBottomNav: () => void;
  /** Manually hide the bottom navigation */
  hideBottomNav: () => void;
  /** Toggle bottom navigation */
  toggleBottomNav: () => void;
}

/**
 * useScrollNavigation
 * 
 * Tracks window scroll position and scroll direction with high performance
 * (passive listeners + requestAnimationFrame) to power the Blinkit-style
 * interaction pattern:
 * 1. Top Header & Search Bar remains pinned (`sticky top-0 z-40`) at all times.
 *    Gains dynamic elevation/shadow classes as user scrolls away from top.
 * 2. Bottom Navigation hides on downward scroll to maximize screen real-estate.
 * 3. Bottom Navigation immediately reappears on upward scroll or when reaching
 *    the top or bottom of the screen.
 */
export function useScrollNavigation(
  options: UseScrollNavigationOptions = {}
): UseScrollNavigationReturn {
  const {
    downThreshold = 4,
    upThreshold = 2,
    topThreshold = 20,
    bottomThreshold = 40,
    resetTrigger,
    initialBottomNavVisible = true,
  } = options;

  const [scrollDirection, setScrollDirection] = useState<ScrollDirection>('idle');
  const [scrollY, setScrollY] = useState(0);
  const [isAtTop, setIsAtTop] = useState(true);
  const [isAtBottom, setIsAtBottom] = useState(false);
  const [isBottomNavVisible, setIsBottomNavVisible] = useState(initialBottomNavVisible);

  const lastScrollYRef = useRef(0);
  const isTickingRef = useRef(false);

  useEffect(() => {
    // Initialize current scroll position
    const initialScrollY = Math.max(0, window.pageYOffset || document.documentElement.scrollTop || 0);
    lastScrollYRef.current = initialScrollY;
    setScrollY(initialScrollY);
    setIsAtTop(initialScrollY <= topThreshold);

    const handleScroll = () => {
      if (isTickingRef.current) return;
      isTickingRef.current = true;

      window.requestAnimationFrame(() => {
        const currentScrollY = Math.max(0, window.pageYOffset || document.documentElement.scrollTop || 0);
        const lastScrollY = lastScrollYRef.current;
        const delta = currentScrollY - lastScrollY;

        const windowHeight = window.innerHeight || document.documentElement.clientHeight || 0;
        const fullHeight = Math.max(
          document.body.scrollHeight,
          document.documentElement.scrollHeight,
          document.body.offsetHeight,
          document.documentElement.offsetHeight
        );

        const maxScroll = Math.max(0, fullHeight - windowHeight);
        const distanceFromBottom = maxScroll - currentScrollY;
        const atBottom = distanceFromBottom <= bottomThreshold;
        const atTop = currentScrollY <= topThreshold;

        setScrollY(currentScrollY);
        setIsAtTop(atTop);
        setIsAtBottom(atBottom);

        // Determine scroll direction & bottom nav visibility (Blinkit interaction pattern)
        if (atTop) {
          // 1. Reaching the top of the page -> Always reveal bottom nav
          setScrollDirection('idle');
          setIsBottomNavVisible(true);
        } else if (atBottom) {
          // 2. Reaching the bottom boundary -> Always reveal bottom nav
          setIsBottomNavVisible(true);
        } else if (delta < -upThreshold) {
          // 3. Upward scroll -> Reveal immediately
          setScrollDirection('up');
          setIsBottomNavVisible(true);
        } else if (delta > downThreshold) {
          // 4. Downward scroll -> Hide bottom navigation
          setScrollDirection('down');
          setIsBottomNavVisible(false);
        }

        lastScrollYRef.current = currentScrollY;
        isTickingRef.current = false;
      });
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('touchmove', handleScroll, { passive: true });

    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('touchmove', handleScroll);
    };
  }, [downThreshold, upThreshold, topThreshold, bottomThreshold]);

  // Reset to visible whenever resetTrigger (e.g. tab change or route change) changes
  useEffect(() => {
    setIsBottomNavVisible(true);
    setScrollDirection('idle');
    const currentScrollY = Math.max(0, window.pageYOffset || document.documentElement.scrollTop || 0);
    lastScrollYRef.current = currentScrollY;
    setScrollY(currentScrollY);
    setIsAtTop(currentScrollY <= topThreshold);
  }, [resetTrigger, topThreshold]);

  // Derived CSS classes
  const isHeaderPinned = true; // Header remains pinned across all scroll depths

  const headerClasses = `sticky top-0 z-40 bg-white/95 backdrop-blur-md transition-shadow duration-200 ${
    isAtTop
      ? 'border-b border-neutral-200/80 shadow-2xs'
      : 'border-b border-neutral-200 shadow-md'
  }`;

  const bottomNavClasses = `md:hidden fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-neutral-200/90 shadow-2xl pt-2 pb-1.5 px-3 transition-transform duration-300 ease-in-out ${
    isBottomNavVisible
      ? 'translate-y-0 opacity-100 pointer-events-auto'
      : 'translate-y-full opacity-0 pointer-events-none'
  }`;

  return {
    scrollDirection,
    scrollY,
    isAtTop,
    isAtBottom,
    isHeaderPinned,
    isBottomNavVisible,
    isFooterVisible: isBottomNavVisible, // backward-compatible alias
    headerClasses,
    bottomNavClasses,
    showBottomNav: () => setIsBottomNavVisible(true),
    hideBottomNav: () => setIsBottomNavVisible(false),
    toggleBottomNav: () => setIsBottomNavVisible((prev) => !prev),
  };
}

export default useScrollNavigation;
