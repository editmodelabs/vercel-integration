import { ArrowRightIcon, TrashIcon } from "@heroicons/react/solid";
import EditmodeSelect from "./emSelect";
import VercelSelect from "./vercelSelect";
export default function SelectGroup({
  editmode_options,
  vercel_options,
  fieldIndex,
  connections,
  setConnections,
  remove,
  field,
}) {
  return (
    <div className="flex justify-center w-full space-x-4">
      <div className="vercel w-full">
        <VercelSelect
          options={vercel_options}
          fieldIndex={fieldIndex}
          connections={connections}
          setConnections={setConnections}
          fieldId = {field.id}
          project={{ ...field.vercel, parent: field.id }}
        />
      </div>

      <div className="flex flex-col justify-center">
        {" "}
        <ArrowRightIcon className="h-5 w-5 text-gray-400" />{" "}
      </div>

      <div className="editmode w-full">
        <EditmodeSelect
          options={editmode_options}
          connections={connections}
          setConnections={setConnections}
          fieldIndex={fieldIndex}
          fieldId = {field.id}
          project={{ ...field.editmode, parent: field.id }}
        />
      </div>
      <div className="flex flex-col justify-center text-gray-500">
        <TrashIcon onClick={remove} className="w-5 h-5" />
      </div>
    </div>
  );
}
