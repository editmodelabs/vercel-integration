import { ArrowRightIcon } from "@heroicons/react/solid";
import EditmodeSelect from "./emSelect";
import VercelSelect from "./vercelSelect";
export default function SelectGroup({
  aliens,
  people,
  fieldIndex,
  setEligiblePeople,
}) {
  return (
    <div className="flex justify-center w-full space-x-4">
      <div className="vercel w-full">
        <VercelSelect options={people} fieldIndex={fieldIndex} />
      </div>

      <div className="flex flex-col justify-center">
        {" "}
        <ArrowRightIcon className="h-5 w-5 text-gray-400" />{" "}
      </div>

      <div className="editmode w-full">
        <EditmodeSelect options={aliens} />
      </div>
    </div>
  );
}
