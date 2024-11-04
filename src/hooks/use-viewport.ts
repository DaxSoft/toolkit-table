// hooks/useViewportDimensions.ts
import { useState, useEffect } from "react";

export function useViewportDimensions() {
  // Initialize state with default values to avoid errors during SSR
  const [viewportSize, setViewportSize] = useState<{
    width: number;
    height: number;
  }>({
    width: 0,
    height: 0,
  });

  useEffect(() => {
    // Check if window is defined (to prevent errors during SSR)
    if (typeof window !== "undefined") {
      // Handler to call on window resize
      const handleResize = () => {
        // Update state with the new window dimensions
        setViewportSize({
          width: window.innerWidth,
          height: window.innerHeight,
        });
      };

      // Add event listener for window resize
      window.addEventListener("resize", handleResize);

      // Call handler right away to set initial dimensions
      handleResize();

      // Cleanup event listener on component unmount
      return () => window.removeEventListener("resize", handleResize);
    }
  }, []); // Empty dependency array ensures this runs once on mount

  return viewportSize;
}
