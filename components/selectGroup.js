import { ArrowRightIcon, TrashIcon } from "@heroicons/react/solid";
import { useEffect } from "react";
import EditmodeSelect from "./emSelect";
import VercelSelect from "./vercelSelect";
export default function SelectGroup({
  editmode_options,
  vercel_options,
  removeField,
  field,
  fields,
  setFields,
}) {
  useEffect(() => {
    console.log("j");
  }, [fields]);
  console.log(field);
  return (
    <div className="flex justify-center w-full space-x-4">
      <div className="vercel w-full">
        <VercelSelect
          options={vercel_options}
          removeField={removeField}
          project={field.vercel}
          fields={fields}
          setFields={setFields}
          field={field}
        />
      </div>

      <div className="flex flex-col justify-center">
        {" "}
        <ArrowRightIcon className="h-5 w-5 text-gray-400" />{" "}
      </div>

      <div className="editmode w-full">
        <EditmodeSelect
          options={editmode_options}
          removeField={removeField}
          project={field.editmode}
          fields={fields}
          setFields={setFields}
          field={field}
        />
      </div>
      <div className="flex flex-col justify-center text-gray-500">
        <TrashIcon onClick={() => removeField(field.id)} className="w-5 h-5" />
      </div>
    </div>
  );
}
