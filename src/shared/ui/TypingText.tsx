import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

interface TypingTextProps {
  text: string;
  className?: string;
  delay?: number;
  staggerChildren?: number;
}

/** 타이핑되는 듯한 효과를 주는 텍스트 컴포넌트 */
export const TypingText = ({
  text,
  className,
  delay = 0,
  staggerChildren = 0.03,
}: TypingTextProps) => {
  return (
    <AnimatePresence mode="wait">
      <motion.span
        key={text}
        className={cn("inline-block", className)}
        initial="hidden"
        animate="visible"
        variants={{
          hidden: {},
          visible: {
            transition: {
              staggerChildren,
              delayChildren: delay,
            },
          },
        }}
      >
        {text.split("").map((char, index) => (
          <motion.span
            key={index}
            className="inline-block"
            variants={{
              hidden: {
                opacity: 0,
                y: 20,
              },
              visible: {
                opacity: 1,
                y: 0,
              },
            }}
            transition={{
              duration: 0.3,
              ease: "easeOut",
            }}
          >
            {char === " " ? "\u00A0" : char}
          </motion.span>
        ))}
      </motion.span>
    </AnimatePresence>
  );
};
