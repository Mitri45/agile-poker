// Component show version in the right bottom corner

export default function Version() {
  return (
    <div className="fixed bottom-5 right-5 text-white">
      <p className="text-sm text-red-700">v{import.meta.env.VITE_VERSION}</p>
    </div>
  );
}
