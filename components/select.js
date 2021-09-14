import { Fragment, useEffect, useState, useRef } from "react";
import { Listbox, Transition } from "@headlessui/react";
import { CheckIcon, SelectorIcon } from "@heroicons/react/solid";
import { Field } from "formik";

function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

export default function Select({
  options,
  isEditmode,
  fields,
  field,
  setFields,
  count,
}) {
  const type = isEditmode ? "editmode" : "vercel";
  const [selected, setSelected] = useState(field[type]);

  const useDidMountEffect = (func, deps) => {
    const didMount = useRef(false);

    useEffect(() => {
      if (didMount.current) func();
      else didMount.current = true;
    }, deps);
  };

  const computeDisableSelectedOptions = (option) => {
    if (!isEditmode) {
      const match = fields.find((field) => field.vercel.id === option.id);
      if (match) return true;
      else return false;
    } else return false;
  };

  const handleSelect = (item) => {
    setSelected(item);
  };

  useDidMountEffect(() => {
    const type = isEditmode ? "editmode" : "vercel";
    const updated_field = { ...field, [type]: selected };
    const index = fields.findIndex((item) => item.id === field.id);
    const new_fields = [
      ...fields.slice(0, index),
      updated_field,
      ...fields.slice(index + 1),
    ];
    setFields(new_fields);
  }, [selected]);

  return (
    <Listbox value={selected} onChange={(item) => handleSelect(item)}>
      {({ open }) => (
        <>
          <Listbox.Label
            className={`block text-sm font-medium text-gray-700 sm:flex ${
              count > 0 ? "hidden" : "auto"
            }`}
          >
            {isEditmode ? "EDITMODE" : "VERCEL"}
          </Listbox.Label>
          <div className="mt-1 relative">
            <Listbox.Button className="bg-white relative w-full border sm:border-gray-200 border-gray-300 rounded-sm shadow-sm pl-3 pr-10 py-2 text-left cursor-default focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 text-sm">
              <span className="block truncate">{selected.name}</span>
              <span className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
                <SelectorIcon
                  className="h-5 w-5 text-gray-400"
                  aria-hidden="true"
                />
              </span>
            </Listbox.Button>

            <Transition
              show={open}
              as={Fragment}
              leave="transition ease-in duration-100"
              leaveFrom="opacity-100"
              leaveTo="opacity-0"
            >
              <Listbox.Options className="absolute z-10 mt-1 w-full bg-white shadow-lg max-h-60 rounded-sm py-1 text-base ring-1 ring-black ring-opacity-5 overflow-auto focus:outline-none text-sm">
                {options.map((option) => (
                  <Listbox.Option
                    key={option[isEditmode ? "identifier" : "id"]}
                    disabled={computeDisableSelectedOptions(option)}
                    className={({ active }) =>
                      classNames(
                        active ? "text-white bg-indigo-600" : "text-gray-900",
                        "cursor-default select-none relative py-2 pl-3 pr-9",
                        "text-sm"
                      )
                    }
                    value={option}
                  >
                    {({ selected, active }) => (
                      <>
                        <span
                          className={classNames(
                            selected ? "font-semibold" : "font-normal",
                            "block truncate"
                          )}
                        >
                          {option.name}
                        </span>

                        {selected ? (
                          <span
                            className={classNames(
                              active ? "text-white" : "text-indigo-600",
                              "absolute inset-y-0 right-0 flex items-center pr-4"
                            )}
                          >
                            <CheckIcon className="h-5 w-5" aria-hidden="true" />
                          </span>
                        ) : null}
                      </>
                    )}
                  </Listbox.Option>
                ))}
              </Listbox.Options>
            </Transition>
          </div>
        </>
      )}
    </Listbox>
  );
}
