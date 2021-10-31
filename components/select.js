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
  isConfiguration,
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
      if (option.id === selected.id) return false;
      const match = fields.find((field) => field.vercel.id === option.id);
      if (match) return true;
      else return false;
    } else return false;
  };

  const handleSelect = (item) => {
    setSelected(item);
  };

  const truncate = (str, limit) =>
    str.length > limit ? str.substr(0, limit - 1) + "..." : str;

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

  const selectorInteractivity = () => {
    if (isConfiguration && !isEditmode && field.isCurrentlyLinked) {
      return false;
    }
    return true;
  };

  const current = selected;

  return (
    <Listbox
      value={selected}
      onChange={(item) => handleSelect(item)}
      disabled={!selectorInteractivity() ? true : false}
    >
      {({ open }) => (
        <>
          {/* <Listbox.Label
            className={`block text-sm font-medium text-gray-700 sm:flex mb-2 font-semibold ${
              count > 0 ? "hidden" : "auto"
            }`}
          >
            {isEditmode ? "EDITMODE" : "VERCEL"}
          </Listbox.Label> */}
          <div className="relative w-full">
            <Listbox.Button as={Fragment}>
              <button
                className={classNames(
                  "bg-white relative w-full border sm:border-gray-200 border-gray-300 rounded-sm shadow-sm pl-3 pr-10 py-2 text-left cursor-default focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 text-sm"
                )}
              >
                <span className="block truncate">
                  {truncate(selected.name, 25)}
                </span>
                {selectorInteractivity() && (
                  <span className="absolute inset-y-0 right-0 flex items-center pr-2">
                    <SelectorIcon
                      className="h-5 w-5 text-gray-400"
                      aria-hidden="true"
                    />
                  </span>
                )}
              </button>
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
                    key={option.id}
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
                    {({ _, active }) => (
                      <>
                        <span
                          className={classNames(
                            current.id === option.id
                              ? "font-semibold"
                              : "font-normal",
                            "block truncate",
                            current.id !== option.id &&
                              computeDisableSelectedOptions(option)
                              ? "text-gray-400"
                              : ""
                          )}
                        >
                          {option.name}
                        </span>

                        {current.id === option.id ? (
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
