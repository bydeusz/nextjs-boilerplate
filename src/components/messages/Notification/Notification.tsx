import { Fragment, useState, useEffect, useRef } from "react";
import { Transition } from "@headlessui/react";
import {
  CheckCircleIcon,
  XCircleIcon,
  ExclamationTriangleIcon,
  InformationCircleIcon,
} from "@heroicons/react/24/outline";
import { XMarkIcon } from "@heroicons/react/20/solid";

// Input type
export interface NotificationProps {
  id: string;
  type: "success" | "error" | "warning" | "info";
  title: string;
  description: string;
  onRemove: (id: string) => void;
}

export const Notification = ({
  id,
  type,
  title,
  description,
  onRemove,
}: NotificationProps) => {
  const [show, setShow] = useState(true);
  const [isHovered, setIsHovered] = useState(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (show && !isHovered) {
      timerRef.current = setTimeout(() => {
        setShow(false);
        setTimeout(() => onRemove(id), 300);
      }, 3000);
    }

    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
    };
  }, [show, isHovered, id, onRemove]);

  return (
    <Transition
      show={show}
      as={Fragment}
      enter="transform ease-out duration-300 transition"
      enterFrom="translate-y-2 opacity-0 sm:translate-y-0 sm:translate-x-2"
      enterTo="translate-y-0 opacity-100 sm:translate-x-0"
      leave="transition ease-in duration-100"
      leaveFrom="opacity-100"
      leaveTo="opacity-0">
      <div
        className="pointer-events-auto w-full max-w-sm overflow-hidden rounded-lg bg-white shadow-lg ring-1 ring-black ring-opacity-5"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}>
        <div className="p-4">
          <div className="flex items-start">
            <div className="flex-shrink-0">
              {(type === "success" && (
                <CheckCircleIcon
                  className="h-6 w-6 text-green-400"
                  aria-hidden="true"
                />
              )) ||
                (type === "error" && (
                  <XCircleIcon
                    className="h-6 w-6 text-red-400"
                    aria-hidden="true"
                  />
                )) ||
                (type === "warning" && (
                  <ExclamationTriangleIcon
                    className="h-6 w-6 text-orange-400"
                    aria-hidden="true"
                  />
                )) ||
                (type === "info" && (
                  <InformationCircleIcon
                    className="h-6 w-6 text-blue-400"
                    aria-hidden="true"
                  />
                ))}
            </div>
            <div className="ml-3 w-0 flex-1 pt-0.5">
              <p className="text-sm font-medium text-gray-900">{title}</p>
              <p className="mt-1 text-sm text-gray-500">{description}</p>
            </div>
            <div className="ml-4 flex flex-shrink-0">
              <button
                type="button"
                className="inline-flex rounded-md bg-white text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                onClick={() => {
                  setShow(false);
                }}>
                <span className="sr-only">Close</span>
                <XMarkIcon className="h-5 w-5" aria-hidden="true" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </Transition>
  );
};
