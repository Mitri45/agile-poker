import { Fragment, useRef, useState } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { ClipboardDocumentListIcon } from '@heroicons/react/24/solid';

export default function CopyLink({
  isOpen,
  setShowToast,
}: {
  isOpen: boolean;
  setShowToast: (showToast: boolean) => void;
}) {
  const [open, setOpen] = useState(isOpen);
  const [copied, setCopied] = useState(false);
  const nameInput = useRef(null);
  const location = window.location.href;

  const copyToClipboard = async () => {
    setCopied(true);
    try {
      await navigator.clipboard.writeText(location);
      setOpen(false);
      setShowToast(true);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <Transition.Root show={open} as={Fragment}>
      <Dialog
        as="div"
        className="relative z-10"
        initialFocus={nameInput}
        onClose={setOpen}
      >
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
        </Transition.Child>

        <div className="fixed inset-0 z-10 w-screen overflow-y-auto">
          <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
              enterTo="opacity-100 translate-y-0 sm:scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 translate-y-0 sm:scale-100"
              leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
            >
              <Dialog.Panel className="p-4 relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all sm:my-8 max-w-[800px] mx-6">
                <Dialog.Title
                  as="h3"
                  className="text-base text-center font-semibold leading-6 text-gray-900"
                >
                  Share the link with your team
                </Dialog.Title>
                <div className="flex items-center justify-center">
                  <p
                    className={`text-sm p-2 border rounded border-gray-400 ${
                      copied ? 'bg-green-500' : 'bg-white'
                    } p-4 transition-colors ease-in-out duration-500`}
                  >
                    {location}
                  </p>
                  <div className="bg-gray-300 mx-3 cursor-pointer hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded inline-flex items-center">
                    <ClipboardDocumentListIcon
                      className="h-8 w-8 text-gray-900 "
                      onClick={copyToClipboard}
                    />
                  </div>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition.Root>
  );
}
