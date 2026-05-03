import { motion } from "framer-motion";
import { useEffect, useState, type ReactNode } from "react";

export function PageTransition({ children }: { children: ReactNode }) {
  // Avoid SSR hydration mismatch: render a static wrapper on server / first paint,
  // then enable framer-motion animations on the client.
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  if (!mounted) {
    return <div className="relative z-10 min-h-screen">{children}</div>;
  }

  return (
    <motion.div
      initial={{ opacity: 0, x: 12 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -8 }}
      transition={{ duration: 0.22, ease: [0.22, 0.61, 0.36, 1] }}
      className="relative z-10 min-h-screen"
    >
      {children}
    </motion.div>
  );
}