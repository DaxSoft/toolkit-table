import { useState, useEffect } from "react";

function useMediaQuery(query: string) {
  const [matches, setMatches] = useState<boolean>(false);

  useEffect(() => {
    // Ensure the hook only runs on the client side
    if (typeof window === "undefined") return;

    const mediaQueryList = window.matchMedia(query);

    // Set initial state
    const handleChange = () => setMatches(mediaQueryList.matches);
    handleChange();

    // Listen for changes
    mediaQueryList.addEventListener("change", handleChange);

    // Clean up the listener on unmount
    return () => {
      mediaQueryList.removeEventListener("change", handleChange);
    };
  }, [query]);

  return matches;
}

export default useMediaQuery;
