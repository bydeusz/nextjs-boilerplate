"use client";
import { useState, useEffect, useRef } from "react";
import { MagnifyingGlassIcon } from "@heroicons/react/20/solid";

// Input type
export interface SearchProps {
  name: string;
  id: string;
  placeholder: string;
  disabled?: boolean;
  className?: string;
  value?: string;
  onChange: React.ChangeEventHandler<HTMLInputElement>;
}

export const SearchInput = ({
  name,
  id,
  placeholder,
  disabled,
  onChange,
  className = "rounded-md border-0 py-1.5 px-8 sm:text-sm sm:leading-6 text-gray-900 shadow-sm ring-1 ring-gray-300 placeholder:text-gray-400 focus:ring-gray-700",
}: SearchProps) => {
  const [value, setValue] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const keyHandler = (event: KeyboardEvent) => {
      if (event.key === "/" && event.ctrlKey) {
        event.preventDefault();
        inputRef.current?.focus();
      }
    };

    document.addEventListener("keydown", keyHandler);
    return () => document.removeEventListener("keydown", keyHandler);
  }, []);

  const inputHandler: React.ChangeEventHandler<HTMLInputElement> = (event) => {
    setValue(event.target.value);
    onChange(event);
  };

  return (
    <div className="relative flex items-center w-full">
      <MagnifyingGlassIcon className="absolute h-[18px] w-[18px] text-gray-400 ml-2" />
      <div className="absolute top-1/2 -translate-y-1/2 right-0 text-xs mr-2 bg-white border border-gray-200 px-[5px] py-[2px] rounded-sm text-gray-900">
        /
      </div>
      <input
        ref={inputRef}
        type="text"
        name={name}
        id={id}
        placeholder={placeholder}
        disabled={disabled}
        value={value}
        onChange={inputHandler}
        className={`block w-full disabled:cursor-not-allowed disabled:bg-gray-50 disabled:text-gray-500 disabled:ring-gray-200 focus:outline-none ${className}`}
      />
    </div>
  );
};
