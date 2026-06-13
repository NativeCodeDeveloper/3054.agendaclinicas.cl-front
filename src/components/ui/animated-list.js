import * as React from "react"
import { motion, AnimatePresence } from "framer-motion"

export const AnimatedList = React.forwardRef(
  (
    { className, delay = 100, children, ...props },
    ref
  ) => {
    return (
      <div ref={ref} className={className} {...props}>
        <AnimatePresence>
          {React.Children.map(children, (child, i) => (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              transition={{
                duration: 0.5,
                delay: i * (delay / 1000),
                type: "spring",
                stiffness: 50,
              }}
              style={{ willChange: "opacity, transform" }}
              key={child.key || i}
            >
              {child}
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    )
  }
)
AnimatedList.displayName = "AnimatedList"
