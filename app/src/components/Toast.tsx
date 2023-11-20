import { useEffect } from 'react';

interface ToastProps {
  message: string;
  showToast: boolean;
  setShowToast: (showToast: boolean) => void;
}

export default function Toast({
  message,
  showToast,
  setShowToast,
}: ToastProps) {
  useEffect(() => {
    if (showToast) {
      const timeout = setTimeout(() => {
        setShowToast(false);
      }, 3000);

      return () => clearTimeout(timeout);
    }
  }, [showToast, setShowToast]);

  return (
    <div
      className={`fixed bottom-5 right-5 bg-green-500 text-white px-4 py-2 rounded-md ${
        showToast ? 'visible' : 'invisible'
      }`}
    >
      {message}
    </div>
  );
}
