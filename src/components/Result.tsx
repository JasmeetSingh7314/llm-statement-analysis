import {
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
} from "@nextui-org/react";
import React from "react";

export default function Result({ response }: any, name: string) {
  const [selectedColor, setSelectedColor] = React.useState("default");
  return (
    <div className="flex flex-col gap-8 mt-24 cursor-pointer">
      <h1 className="text-violet-300 text-xl ">Results are as follows :</h1>
      {response?.bankstatement.map((statement, id: number) => (
        <section key={id} className="w-full flex flex-col">
          <Table
            color="success"
            key={id}
            selectionMode="single"
            aria-label="Example static collection table"
          >
            <TableHeader>
              <TableColumn>NAME</TableColumn>
              <TableColumn>DESCRIPTION</TableColumn>
            </TableHeader>
            <TableBody>
              <TableRow key="1">
                <TableCell className="text-md font-bold">Date</TableCell>
                <TableCell className="text-md ">{statement?.date}</TableCell>
              </TableRow>
              <TableRow key="2">
                <TableCell className="text-md font-bold">Amount</TableCell>
                <TableCell className="text-md ">
                  {Math.abs(parseInt(statement?.amount))}
                </TableCell>
              </TableRow>
              <TableRow key="3">
                <TableCell className="text-md font-bold">Vendor Name</TableCell>
                <TableCell className="text-md ">
                  {statement?.vendor_name}
                </TableCell>
              </TableRow>
              <TableRow key="4">
                <TableCell className="text-md font-bold">Statement</TableCell>
                <TableCell className="text-md ">
                  {statement?.description}
                </TableCell>
              </TableRow>
              <TableRow key="5">
                <TableCell className="text-md font-bold">
                  Transaction description
                </TableCell>
                <TableCell className="text-md ">
                  {statement?.transaction_description}
                </TableCell>
              </TableRow>
              <TableRow key="6">
                <TableCell className="text-md font-bold">Card type</TableCell>
                <TableCell className="text-md ">
                  {statement?.credit_or_debit}
                </TableCell>
              </TableRow>
              <TableRow key="7">
                <TableCell className="text-md font-bold">
                  Type of payment
                </TableCell>
                <TableCell className="text-md ">
                  {statement?.description_label}
                </TableCell>
              </TableRow>
              <TableRow key="8">
                <TableCell className="text-md font-bold">Position</TableCell>
                <TableCell className="text-md ">
                  {statement?.statement_No}
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>

          {/* {response?.citations[id].answer.length !== 0 ? (
            <h1 className="text-md flex gap-x-4 text-white  tracking-wide leading-8 mt-4">
              <span className="text-violet-400 text-xl flex gap-x-1 ml-5">
                <SearchCheck className="text-green-300 font-semibold" />
                Citation:
              </span>
              {response?.citations[id].answer[0].fact}
            </h1>
          ) : (
            <div></div>
          )} */}
        </section>
      ))}
    </div>
  );
}
{
  /* <section className="flex flex-col flex-1 gap-y-8 py-24  mt-24 justify-between items-start px-40 rounded-xl bg-[rgba(255,255,255,0.09)] ">
      <h2 className="text-violet-400 font-extrabold -px-22">
        The Requested Information is:
      </h2>
      <p className=" flex text-left  gap-x-3 text-violet-400 font-semibold">
        <span className="text-left">The date is:</span>
        <span className="text-white text-md">{response?.date}</span>
      </p>
      <p className=" flex text-left  gap-x-3 text-violet-400 font-semibold">
        <span className="text-left">Amount is:</span>
        <span className="text-white text-md">{response?.amount}</span>
      </p>
      <p className="  flex text-left gap-x-3 text-violet-400 font-semibold">
        <span> Statement description is:</span>
        <span className="text-white text-md">{response?.description}</span>
      </p>
      <p className=" flex text-left  gap-x-3 text-violet-400 font-semibold">
        <span className="text-left">Vendor name is:</span>
        <span className="text-white text-md"> {response?.vendor_name}</span>
      </p>
      <p className=" flex text-left  gap-x-3 text-violet-400 font-semibold">
        <span className="text-left">Transaction Description is:</span>
        <span className="text-white text-md">
          {response?.transaction_description}
        </span>
      </p>
      <p className=" flex text-left  gap-x-3 text-violet-400 font-semibold">
        <span className="text-left">Card Type is:</span>
        <span className="text-white text-md">{response?.credit_or_debit}</span>
      </p>
      <p className=" flex text-left  gap-x-3 text-violet-400 font-semibold">
        <span className="text-left">Description label is:</span>
        <span className="text-white text-md">
          {response?.description_label}
        </span>
      </p>

      <p className=" flex text-left  gap-x-3 text-violet-400 font-semibold">
        <span className="text-left">Line number is:</span>
        <span className="text-white text-md">{response?.statement_No}</span>
      </p>
    </section> */
}
