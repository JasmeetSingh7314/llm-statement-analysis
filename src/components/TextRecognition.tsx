import React from "react";

export default function TextRecognition({
  isLoading,
  ocrText,
}: {
  isLoading: boolean;
  ocrText: string;
}) {
  

  return (
    <section className="h-full w-full flex-1 flex flex-col justify-center items-center gap-y-10">
      <h2 className="text-5xl text-red-400  ">Recognized Text:</h2>
      <textarea
        value={ocrText}
        placeholder={
          isLoading ? "Processing!! Please Wait...." : "Enter a Doc to OCR"
        }
        readOnly
        className="w-[800px] h-[500px] p-6 text-[rgba(255,255,255,0.5)] bg-[rgba(255,255,255,0.09)] rounded-lg font-mono"
      ></textarea>
    </section>
  );
}
