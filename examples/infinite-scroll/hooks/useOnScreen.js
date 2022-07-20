import { useState, useEffect } from "react";

export default function useOnscreen(ref) {
  const [isIntersecting, setIntersecting] = useState(false);

  useEffect(() => {
    if (!ref.current) return;

    const observer = new IntersectionObserver(([entry]) => {
      // console.log("entrys", entrys);
      // let entry = entrys[0];
      // console.log("isIntersecting", entry.isIntersecting);
      return setIntersecting(entry.isIntersecting);
    });

    observer.observe(ref.current);

    return () => {
      observer.disconnect();
    };
  }, []);

  return isIntersecting;
}
