const BouncingBallsLoader = () => {
  return (
    <div className="flex space-x-2">
      <div
        className="w-3 h-3 bg-white rounded-full animate-bounce"
        style={{ animationDelay: "0s" }}
      ></div>
      <div
        className="w-3 h-3 bg-white rounded-full animate-bounce"
        style={{ animationDelay: "0.3s" }}
      ></div>
      <div
        className="w-3 h-3 bg-white rounded-full animate-bounce"
        style={{ animationDelay: "0.6s" }}
      ></div>
    </div>
  );
};

export default BouncingBallsLoader;
