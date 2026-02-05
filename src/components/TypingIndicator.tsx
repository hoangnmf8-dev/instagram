export default function TypingIndicator() {
  return (
    <div className="flex space-x-1 items-center bg-gray-100 px-3 py-1 rounded-2xl w-fit h-6 ml-10 mt-2">
      <div className="h-[5px] w-[5px] bg-gray-500 rounded-full animate-subtle" style={{ animationDelay: '-0.32s' }}></div>
      <div className="h-[5px] w-[5px] bg-gray-500 rounded-full animate-subtle" style={{ animationDelay: '-0.16s' }}></div>
      <div className="h-[5px] w-[5px] bg-gray-500 rounded-full animate-subtle"></div>
    </div>
  );
};