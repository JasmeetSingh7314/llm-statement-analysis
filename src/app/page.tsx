import LandingForm from "@/components/Form";

import Image from "next/image";

export default function Home() {
  return (
    <main className="flex flex-col  items-center gap-y-20 p-24">
      <h1 className="text-red-500 italic font-extrabold text-7xl">Statement Analysis </h1>
      <h2 className="text-red-400 text-3xl italic -mt-8">..coupled with ocr</h2>
      <LandingForm />
    </main>
  );
}
