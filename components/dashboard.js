import Layout from "./layout";
import SelectGroup from "./selectGroup";
import Loader from "react-loader-spinner";
import uuid from "react-uuid";
import Cards from "./cards";
import { useEffect, useState } from "react";
import { ArrowDownIcon, PlusCircleIcon } from "@heroicons/react/solid";

export default function Dashboard({
  userEditmodeProjects,
  isFetchingEditmodeProjects,
  setProjectToInstall,
  isInstalling,
  handleInstall,
  vercelProjects,
  dashboardView,
  hasCloned,
  handleLinking,
}) {
  const [fields, setFields] = useState([]);
  const hanleAddNewField = () => {
    constructField();
  };

  const hasUsedAllVercelProjects =
    vercelProjects?.length - fields?.length === 0 ? true : false;

  useEffect(() => {
    if (
      !fields.length &&
      vercelProjects?.length &&
      userEditmodeProjects?.length
    )
      constructField();
  }, [vercelProjects, userEditmodeProjects]);

  const removeField = (id) => {
    const new_fields = fields.filter((field) => field.id !== id);
    setFields(new_fields);
  };

  const constructField = () => {
    if (hasUsedAllVercelProjects) return;
    const findUnusedOption = () => {
      const obj = vercelProjects.find((option) =>
        fields.every((field) => field.vercel.id !== option.id)
      );
      return obj;
    };

    let obj;

    if (!fields) {
      obj = {
        id: vercelProjects[0].id,
        name: vercelProjects[0].name,
      };
    }
    if (fields) obj = findUnusedOption();

    const field = {
      id: uuid(),
      editmode: {
        id: userEditmodeProjects[0].identifier,
        name: userEditmodeProjects[0].name,
      },
      vercel: {
        id: obj.id,
        name: obj.name,
      },
    };
    setFields([...fields, field]);
  };

  let loaderTyper;

  if (dashboardView !== "deploy") {
    if (!userEditmodeProjects?.length || !vercelProjects?.length) {
      loaderTyper = (
        <div className="py-4 flex flex-col items-center justify-center align-center">
          <Loader
            type={dashboardView !== "deploy" ? "Oval" : "TailSpin"}
            color="#616AE9"
            height={100}
            width={100}
            className="mt-6"
          />
        </div>
      );
    } else loaderTyper = "";
  }

  if (dashboardView === "deploy") {
    if (!hasCloned) {
      loaderTyper = (
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
      );
    } else loaderTyper = "";
  }

  return (
    <Layout>
      <div className="w-full max-w-2xl">
        {loaderTyper}
        <div className="">
          <h2 className="mb-4 text-md text-gray-700 flex justify-center">
            Link your Vercel projects to your Editmode projects:
          </h2>
        </div>
        {vercelProjects?.length && userEditmodeProjects?.length && (
          <div>
            {fields.map((field) => {
              return (
                <SelectGroup
                  editmode_options={userEditmodeProjects}
                  key={field.id}
                  vercel_options={vercelProjects}
                  removeField={removeField}
                  field={field}
                  fields={fields}
                  setFields={setFields}
                />
              );
            })}
            {vercelProjects?.length && userEditmodeProjects?.length && (
              <div className={`flex flex-row mt-5 justify-center `}>
                <p
                  className={`flex flex-row ${
                    !hasUsedAllVercelProjects ? "cursor-pointer" : ""
                  }`}
                  onClick={hanleAddNewField}
                >
                  <span className="flex-row">
                    {!hasUsedAllVercelProjects && (
                      <PlusCircleIcon className="text-indigo-400 w-6 h-6" />
                    )}
                  </span>

                  <span className="text-sm text-indigo-400 ml-2 mt-0.5">
                    {hasUsedAllVercelProjects
                      ? "All Vercel projects linked"
                      : `Link another Vercel project (${
                          vercelProjects.length - fields.length
                        } left)`}
                  </span>
                </p>
              </div>
            )}
          </div>
        )}
        {vercelProjects?.length && userEditmodeProjects?.length && (
          <section className="py-4">
            <button
              className={`flex justify-center w-full mt-6 text-white font-medium py-3 leading-6 px-4 rounded-md hover:bg-indigo-400 transition duration-200 button ${
                isInstalling ||
                (dashboardView !== "deploy" && !vercelProjects.length)
                  ? `cursor-not-allowed bg-indigo-300`
                  : `bg-indigo-500`
              } `}
              onClick={() => handleLinking(fields)}
              disabled={
                (dashboardView !== "deploy" && !vercelProjects.length) ||
                isInstalling
                  ? true
                  : false
              }
            >
              <svg
                class="animate-spin -ml-1 mr-3 h-5 w-5 text-white mt-0.5"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                style={{ display: isInstalling ? "block" : "none" }}
              >
                <circle
                  class="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  stroke-width="4"
                ></circle>
                <path
                  class="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                ></path>
              </svg>
              {isInstalling
                ? "ADDING INTEGRATION"
                : dashboardView === "deploy"
                ? "ADD INTEGRATION TO NEW TEMPLATE"
                : "ADD INTEGRATION"}
            </button>
          </section>
        )}
      </div>
    </Layout>
  );
}
