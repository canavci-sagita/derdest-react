"use client";

import React, { useEffect, useState } from "react";
import "react-quill-new/dist/quill.snow.css";
import { twMerge } from "tailwind-merge";
import { Spin } from "antd";
import dynamic from "next/dynamic";

const ReactQuill = dynamic(() => import("react-quill-new"), {
  ssr: false,
  loading: () => (
    <div className="flex items-center justify-center h-full min-h-[200px] border border-slate-300 rounded-lg">
      <Spin />
    </div>
  ),
});

interface FormTextEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  rootClassName?: string;
}

const FormTextEditor: React.FC<FormTextEditorProps> = ({
  value,
  onChange,
  placeholder,
  rootClassName,
}) => {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient) {
    return (
      <div
        className={twMerge(
          "flex items-center justify-center h-full min-h-[180px] border border-slate-300 rounded-lg",
          rootClassName
        )}
      >
        <Spin />
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col">
      <ReactQuill
        theme="snow"
        value={value}
        onChange={onChange}
        placeholder={placeholder || "Start writing..."}
        modules={{
          toolbar: [
            [{ header: [1, 2, 3, false] }],
            ["bold", "italic", "underline", "strike"],
            [{ list: "ordered" }, { list: "bullet" }],
            ["link"],
            ["clean"],
          ],
        }}
        className={twMerge(["flex flex-col h-full rounded-lg", rootClassName])}
      />
    </div>
  );
};

export default FormTextEditor;
