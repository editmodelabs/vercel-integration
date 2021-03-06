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
  count,
  isConfiguration,
}) {
  const { editmode, vercel } = field;

  function classNames(...classes) {
    return classes.filter(Boolean).join(" ");
  }

  return (
    <>
      {count < 1 && (
        <div className="grid grid-cols-2 px-2 mt-5 sm:hidden">
          <div className=" text-sm font-medium text-gray-700 mb-1 font-semibold">
            VERCEL
          </div>
          <div
            className={classNames(
              `text-sm font-medium text-gray-700 mb-1 font-semibold justify-self-start ml-2`,
              fields.length === 1 && `ml-6 pl-0.5`
            )}
          >
            EDITMODE
          </div>
        </div>
      )}
      <div className="flex flex-row justify-center w-full space-x-4 sm:space-x-0 sm:flex-col sm:mt-3 sm:border rounded-sm sm:p-3 p-2">
        <div className="vercel w-full ">
          <div className="hidden text-sm font-medium text-gray-700 mb-2 font-semibold sm:flex">
            VERCEL
          </div>
          <VercelSelect
            options={vercel_options}
            removeField={removeField}
            project={vercel}
            fields={fields}
            setFields={setFields}
            field={field}
            count={count}
            isConfiguration={isConfiguration}
          />
        </div>

        <div
          className={`flex flex-col justify-center sm:self-center sm:transform sm:rotate-90 sm:m-2`}
        >
          <ArrowRightIcon className={`h-5 w-5 text-gray-400 sm:mt-1`} />
        </div>

        <div className="editmode w-full ">
          <div className="hidden text-sm font-medium text-gray-700 mb-2 font-semibold sm:flex">
            EDITMODE
          </div>
          <EditmodeSelect
            options={editmode_options}
            removeField={removeField}
            project={editmode}
            fields={fields}
            setFields={setFields}
            field={field}
            count={count}
            isConfiguration={isConfiguration}
          />
        </div>
        {fields.length > 1 && (
          <div
            className={`flex flex-col justify-center text-gray-500 
        }`}
          >
            <TrashIcon
              onClick={() => removeField(field.id)}
              className={`w-5 h-5  sm:hidden cursor-pointer`}
            />
            <p
              onClick={() => removeField(field.id)}
              className="text-sm text-red-500 mt-1 self-center cursor-pointer hidden sm:flex"
            >
              Unlink
            </p>
          </div>
        )}
      </div>
    </>
  );
}
