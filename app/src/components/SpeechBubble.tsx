export default function SpeechBubble({ text }: { text: string }) {
  return (
    <div className="my-4 relative min-w-[300px] max-w-[400px] max-h-[500px] p-4 bg-blue-200 text-black rounded-lg">
      <div className="absolute -left-3 top-1/2 transform -translate-y-1/2 w-3 h-3 bg-blue-200 rotate-45" />
      <div className="flex justify-between items-center mb-2">
        <h2 className="text-lg font-bold">Voting for...</h2>
        <div className="group">
          <div className="text-black hover:text-blue-500 transition-colors duration-200 cursor-pointer">
            <FileEditIcon />
          </div>
          <span className="hidden group-hover:block text-xs text-black absolute bg-white p-1 rounded-md -top-8 -right-4">
            Edit theme
          </span>
        </div>
      </div>
      <p>{text}</p>
    </div>
  );
}

function FileEditIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M4 13.5V4a2 2 0 0 1 2-2h8.5L20 7.5V20a2 2 0 0 1-2 2h-5.5" />
      <polyline points="14 2 14 8 20 8" />
      <path d="M10.42 12.61a2.1 2.1 0 1 1 2.97 2.97L7.95 21 4 22l.99-3.95 5.43-5.44Z" />
    </svg>
  );
}
