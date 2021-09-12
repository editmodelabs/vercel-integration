import Layout from "./layout";
import SelectGroup from "./selectGroup";
import Loader from "react-loader-spinner";
import uuid from "react-uuid";
import Cards from "./cards";
import { useEffect, useState } from "react";
import { ArrowDownIcon, PlusCircleIcon } from "@heroicons/react/solid";

const editmode_options = [
  { id: 1, name: "EM 1" },
  { id: 2, name: "EM 2" },
  { id: 3, name: "EM 3" },
  { id: 4, name: "EM 4" },
];

const vercel_options = [
  { id: 1, name: "Vercel 1" },
  { id: 2, name: "Vercel 2" },
  { id: 3, name: "Vercel 3" },
  { id: 4, name: "Vercel 4" },
];

export default function Dashboard({
  userEditmodeProjects,
  isFetchingEditmodeProjects,
  setProjectToInstall,
  isInstalling,
  handleInstall,
  vercelProjects,
  setVercelProjects,
  dashboardView,
  hasCloned,
}) {
  const [eligibleVercelOptions, setEligibleVercelOptions] =
    useState(vercel_options);
  const [fields, setFields] = useState([]);
  const hanleAddNewField = () => {
    constructField();
  };

  useEffect(() => {
    if (!fields.length) constructField();
  }, []);

  const removeField = (id) => {
    const new_fields = fields.filter((field) => field.id !== id);
    console.log("OOP", new_fields);
    console.log(id);
    setFields(new_fields);
  };

  const constructField = () => {
    const findUnusedOption = () => {
      const obj = vercel_options.find((option) =>
        fields.every((field) => field.vercel.id !== option.id)
      );
      console.log(obj);
      return obj;
    };

    let obj;

    if (!fields) {
      obj = {
        id: vercel_options[0].id,
        name: vercel_options[0].name,
      };
    }
    if (fields) obj = findUnusedOption();
    console.log("inside_construct", obj);

    const field = {
      id: uuid(),
      editmode: {
        id: editmode_options[0].id,
        name: editmode_options[0].name,
      },
      vercel: {
        id: obj.id,
        name: obj.name,
      },
    };
    setFields([...fields, field]);
  };

  return (
    <Layout>
      <div className="w-full max-w-2xl divide-y">
        {dashboardView === "deploy" && !hasCloned && (
          <div className="py-4 flex flex-col items-center justify-center align-center">
            <div className="text-lg text-gray-700">
              Generating a new Editmode Project for your theme...
            </div>
            <Loader
              type={dashboardView !== "deploy" ? "Oval" : "TailSpin"}
              color="#616AE9"
              height={70}
              width={70}
              className="mt-6"
            />
          </div>
        )}
        <div>
          {fields.map((field, idx) => {
            return (
              <SelectGroup
                editmode_options={editmode_options}
                key={idx}
                vercel_options={eligibleVercelOptions}
                removeField={removeField}
                field={field}
                fields={fields}
                setFields={setFields}
              />
            );
          })}
          <div
            className="flex flex-row mt-5 justify-center cursor-pointer"
            onClick={hanleAddNewField}
          >
            <PlusCircleIcon className="text-indigo-400 w-6 h-6" />
            <p className="text-sm text-indigo-400 ml-2 mt-0.5">
              Link another Vercel project
            </p>
          </div>
        </div>
      </div>
    </Layout>
  );
}
