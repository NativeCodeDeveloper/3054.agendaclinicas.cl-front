import { motion, AnimatePresence } from "framer-motion";

export function AnimatedList({ children }) {
  return (
    <div className="flex flex-col gap-4">
      <AnimatePresence>
        {Array.isArray(children)
          ? children.map((child, idx) => (
              <motion.div
                key={child.key || idx}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 20 }}
                transition={{ duration: 0.4, delay: idx * 0.08 }}
              >
                {child}
              </motion.div>
            ))
          : children}
      </AnimatePresence>
    </div>
  );
}
