import { motion } from "framer-motion";

interface LoadingProps {
  text?: string;
  color?: string;
  className?: string;
  size?: "small" | "medium" | "large";
}

const Loading: React.FC<LoadingProps> = ({
  text = "Loading...",
  color = "",
  className = "",
  size = "medium",
}) => {
  const sizeClasses = {
    small: "h-8 w-8 border-2",
    medium: "h-12 w-12 border-t-2 border-b-2",
    large: "h-16 w-16 border-t-3 border-b-3",
  };

  console.log(color);

  return (
    <div className={`flex items-center justify-center ${className}`}>
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="flex flex-col items-center gap-4"
      >
        <div
          className={`animate-spin rounded-full ${sizeClasses[size]}`}
          style={{ borderColor: color }}
        />
        {text && (
          <div className={`text-black animate-pulse ${className}`}>{text}</div>
        )}
      </motion.div>
    </div>
  );
};

export default Loading;
