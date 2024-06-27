"use client";
import axios from "axios";
import { useForm } from "react-hook-form";
import { Button } from "@nextui-org/react";
import { GlobalWorkerOptions, getDocument } from "pdfjs-dist/legacy/build/pdf";
import { useEffect, useState } from "react";
import Tesseract from "tesseract.js";
import Result from "./Result";
import TextRecognition from "./TextRecognition";


GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/3.4.120/pdf.worker.js`;

type Inputs = {
  file: string;
  name: string;
  data_type: string;
  description: string;
};

export interface response {
  date: number;
  amount: number;
  description: string;
  vendor_name: string;
  transaction_description: string;
  credit_or_debit: string;
  description_label: string;
  statement_No: number;
}

export default function LandingForm() {
  const [ocrText, setOcrText] = useState("");
  const [citation, setCitations] = useState();
  const [isLoading, setIsLoading] = useState(false);
  const [response, setResponse] = useState<response>();
  const [questions, setQuestions] = useState();

  const form = useForm<Inputs>({
    defaultValues: {
      file: "",
      name: "",
      data_type: "",
      description: "",
    },
  });

  const { register, handleSubmit } = form;
  const handleFileChange = async (event: any) => {
    setIsLoading(true);
    const file = event.target.files[0];
    const pdf = await getDocument(URL.createObjectURL(file)).promise;
    console.log(pdf);
    let allText = "";

    for (let pageNum = 1; pageNum <= pdf.numPages; pageNum++) {
      const page = await pdf.getPage(pageNum);
      const viewport = page.getViewport({ scale: 2 });
      const canvas = document.createElement("canvas");
      const context = canvas.getContext("2d");
      canvas.height = viewport.height;
      canvas.width = viewport.width;

      await page.render({ canvasContext: context, viewport }).promise;
      const text = await Tesseract.recognize(canvas, "eng").then(
        ({ data: { text } }) => text
      );

      allText += text + "\n\n";
    }
    setOcrText(allText);

    setIsLoading(false);
    console.log("The text is:", allText);
  };
  const instance = axios.create({});
  const maxRetries = 3; // Maximum number of retries
  const retryDelay = 1000; // Retry delay in milliseconds (1 second in this example)

  const fetchDataWithRetry = async (url, data, options = {}, retries = 0) => {
    try {
      const response = await instance.post(url, data, options);
      return response.data; // Return the data if request succeeds
    } catch (error) {
      if (retries < maxRetries) {
        // Retry on timeout or other specific errors
        if (error.code === "ECONNABORTED") {
          await new Promise((resolve) => setTimeout(resolve, retryDelay));
          console.log(`Retrying request (${retries + 1}/${maxRetries})...`);
          return fetchDataWithRetry(url, data, options, retries + 1);
        }
      }
      throw error; // Throw error if retries are exhausted or error is not retryable
    }
  };

  useEffect(() => {
    const get_citations = async () => {
      if (response !== undefined) {
        try {
          const citations = await fetchDataWithRetry(
            "/citations",
            JSON.stringify({
              data: response,
              text: ocrText,
            }),
            {
              headers: {
                "Access-Control-Allow-Origin": "*",
                "Content-Type": "application/json",
              },
            }
          );
          const response_json = await citations?.data;
          const llm_result = await JSON.parse(response_json);
          setCitations(llm_result);
          console.log(citation);
        } catch (err) {
          console.log(err);
        }
      }
    };
    get_citations();
  }, [response]);

  const onSubmit = async (data: any) => {
    console.log(data);
    if (!isLoading && ocrText !== "") {
      form.setValue("file", ocrText);

      try {
        const response_llm = await instance.post("/ocr", JSON.stringify(data), {
          headers: {
            "Access-Control-Allow-Origin": "*",
            "Content-Type": "application/json",
          },
        });
        console.log(response_llm);
        const response_json = await response_llm?.data;
        const llm_result = JSON.parse(response_json);
        console.log(llm_result);
        setResponse(llm_result);
      } catch (err: any) {
        console.log(err);
      }
    }

    handleSubmit(data);
  };

  return (
    <section className="w-full h-full">
      <div className="w-full flex  gap-x-24 justify-center items-center px-12 pl-24">
        <form
          className="flex flex-col flex-1 gap-y-8 py-24  mt-24 justify-center items-center rounded-xl bg-[rgba(255,255,255,0.09)] "
          onSubmit={handleSubmit(onSubmit)}
        >
          <div className="flex items-center justify-center  ">
            <label className="text-xl flex-1 text-violet-300">
              Enter the Doc!
            </label>
            <input
              type="file"
              className="flex flex-1   h-10 rounded-md border border-[rgba(255,255,255,0.2)] bg-transparent px-3 py-2 text-sm placeholder:text-gray-400  disabled:cursor-not-allowed disabled:opacity-50 focus:bg-transparent input:bg-transparent"
              placeholder="Please input your file"
              {...register("file", {
                onChange: handleFileChange,
              })}
            ></input>
          </div>
          <div className="flex items-center justify-center gap-x-3">
            <label className="text-xl flex-1 text-violet-300 ">
              Enter the name :
            </label>
            <input
              type="text"
              className="flex flex-1  w-full h-10 rounded-md border border-[rgba(255,255,255,0.2)] bg-transparent px-3 py-2 text-sm placeholder:text-gray-400  disabled:cursor-not-allowed disabled:opacity-50 focus:bg-transparent input:bg-transparent"
              placeholder="Please input the name"
              {...register("name")}
            ></input>
          </div>
          <div className="flex items-center justify-between gap-x-3">
            <label className="text-xl flex-1 text-violet-300 ">
              Enter data_type:
            </label>
            <input
              type="text"
              className="flex flex-1  w-full h-10 rounded-md border border-[rgba(255,255,255,0.2)] bg-transparent px-3 py-2 text-sm placeholder:text-gray-400  disabled:cursor-not-allowed disabled:opacity-50 focus:bg-transparent input:bg-transparent"
              placeholder="Please input the data_type"
              {...register("data_type")}
            ></input>
          </div>
          <div className="flex items-center justify-center gap-x-3">
            <label className="text-xl flex text-left flex-1 text-violet-300 ">
              Enter description:
            </label>
            <input
              type="text"
              className="flex flex-1  w-full h-10 rounded-md border border-[rgba(255,255,255,0.2)] bg-transparent px-3 py-2 text-sm placeholder:text-gray-400  disabled:cursor-not-allowed disabled:opacity-50 focus:bg-transparent input:bg-transparent"
              placeholder="Enter the description"
              {...register("description")}
            ></input>
          </div>

          <Button type="submit" className="p-4 font-bold text-xl">
            Submit for Analysis!
          </Button>
        </form>
        <TextRecognition isLoading={isLoading} ocrText={ocrText} />
      </div>

      <div className="px-24 mx-40  items-center">
        {response === undefined ? (
          <div></div>
        ) : (
          <Result response={response} name={form.getValues("description")} />
        )}
      </div>
    </section>
  );
}
