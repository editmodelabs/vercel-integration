import { ArrowRightIcon, TrashIcon } from "@heroicons/react/solid";
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
  const { editmode, vercel } = field;

  return (
    <div className="flex flex-row justify-center w-full lg:space-x-4 sm:flex-col sm:mt-3 sm:border sm:p-3">
      <div className="vercel w-full">
        <VercelSelect
          options={vercel_options}
          removeField={removeField}
          project={vercel}
          fields={fields}
          setFields={setFields}
          field={field}
        />
      </div>

      <div className="flex flex-col justify-center sm:self-center sm:transform sm:rotate-90 sm:m-2">
        <ArrowRightIcon className="h-5 w-5 text-gray-400" />
      </div>

      <div className="editmode w-full">
        <EditmodeSelect
          options={editmode_options}
          removeField={removeField}
          project={editmode}
          fields={fields}
          setFields={setFields}
          field={field}
        />
      </div>
      <div className="flex flex-col justify-center text-gray-500">
        <TrashIcon
          onClick={() => removeField(field.id)}
          className="w-5 h-5 sm:hidden"
        />
        <p
          onClick={() => removeField(field.id)}
          className="text-sm text-red-500 mt-1 self-center cursor-pointer"
        >
          Unlink
        </p>
      </div>
    </div>
  );
}
