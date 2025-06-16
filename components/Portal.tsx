"use client";
import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";

const Portal = ({ children }: { children: React.ReactNode }) => {
  const [mounted, setMounted] = useState(false);
  const ref = useRef<HTMLElement | null>(null);

  useEffect(() => {
    ref.current = document.body;
    setMounted(true);
  }, []);

  return mounted && ref.current ? createPortal(children, ref.current) : null;
};

export default Portal;
