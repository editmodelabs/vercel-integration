import { ArrowRightIcon } from "@heroicons/react/solid";

import Select from "./select";
export default function SelectGroup() {
  return (
    <div className="flex justify-center w-full space-x-4">
      <div className="vercel w-full">
        <Select />
      </div>

      <div className="flex flex-col justify-center">
        {" "}
        <ArrowRightIcon className="h-5 w-5 text-gray-400" />{" "}
      </div>

      <div className="editmode w-full">
        <Select />
      </div>
    </div>
  );
}
