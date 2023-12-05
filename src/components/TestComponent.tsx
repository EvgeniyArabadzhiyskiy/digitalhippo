"use client";

import { useEffect, useRef } from "react";

export default function TestComponent() {
  const divRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const listener = (event: any) => {
      const parentElement = divRef.current;
      const target = event.target;

      if (!parentElement || parentElement.contains(target)) {
        console.log("Мы кликнули в цель");
      } else {
        console.log("Мы кликнули за пределами цели");
      }
    };

    document.addEventListener("click", listener);

    return () => document.removeEventListener("click", listener);
  }, []);
  return (
    <>
      <div className="w-80 h-56 bg-red-400" ref={divRef}>
        <div className="w-40 h-40 bg-green-300 absolute top-0 left-0"></div>
      </div>
      <div className="w-40 h-40 bg-blue-400"></div>
    </>
  );
}
