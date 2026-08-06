function LoadingSpinner({ size = "medium" }) {
  return (
    <div
      className={`
        animate-spin
        rounded-full
        border-4
        border-gray-300
        border-t-teal-500
        ${
          size === "small"
            ? "w-6 h-6"
            : size === "large"
              ? "w-16 h-16"
              : "w-10 h-10"
        }
      `}
    ></div>
  );
}

export default LoadingSpinner;
