import Layout from "./layout";
import SelectGroup from "./selectGroup";
import Loader from "react-loader-spinner";
import uuid from "react-uuid";
import Cards from "./cards";
import { useEffect, useState } from "react";
import { PlusCircleIcon } from "@heroicons/react/solid";
import NoProjects from "./noProjects";

export default function Dashboard({
  editmodeProjects,
  isInstalling,
  vercelProjects,
  dashboardView,
  hasCloned,
  handleLinking,
  isConfiguration,
  connections,
  saveChanges,
  toDelete,
  setToDelete,
  showMessage,
  isSaving,
  setConfigView,
}) {
  const [newEmProjects, setNewEmProjects] = useState();
  const [fields, setFields] = useState([]);

  const hanleAddNewField = () => {
    constructField();
  };

  const handleClick = (fields) => {
    if (isConfiguration) {
      saveChanges(fields);
    } else {
      handleLinking(fields);
    }
  };

  const isDeploy = dashboardView === "deploy";

  const hasUsedAllVercelProjects =
    vercelProjects?.length - fields?.length === 0 ? true : false;

  const standardizeIdenfier = (em_projects) => {
    const standardized = em_projects.map((project) => {
      const id = project.identifier;
      const name = project.name;
      return { id, name };
    });

    return standardized;
  };

  useEffect(() => {
    if (editmodeProjects) {
      const new_em_projects = standardizeIdenfier(editmodeProjects);
      setNewEmProjects(new_em_projects);
    }
  }, [editmodeProjects]);

  useEffect(() => {
    if (isConfiguration) {
      if (vercelProjects) setFields(connections ? connections : []);
    } else if (
      !fields.length &&
      vercelProjects?.length &&
      newEmProjects?.length
    ) {
      constructField();
    }
  }, [vercelProjects, newEmProjects, connections]);

  const removeField = (id) => {
    let item;
    const new_fields = fields.filter((field) => field.id !== id);
    if (isConfiguration) {
      item = fields.find((field) => field.id === id);
    }
    if (item && item.isCurrentlyLinked && isConfiguration) {
      if (item.vercel.envId) {
        setToDelete([
          ...toDelete,
          { projectId: item.vercel.id, env: { id: item.vercel.envId } },
        ]);
      }
    }
    setFields(new_fields);
  };

  const constructField = () => {
    const findUnusedOption = () => {
      const obj = vercelProjects.find((option) =>
        fields.every((field) => field.vercel.id !== option.id)
      );
      return obj;
    };

    let obj;

    if (!fields?.length) {
      obj = {
        id: vercelProjects[0].id,
        name: vercelProjects[0].name,
      };
    } else obj = findUnusedOption();

    const field = {
      id: uuid(),
      editmode: {
        id: newEmProjects[0].id,
        name: newEmProjects[0].name,
      },
      vercel: {
        id: obj.id,
        name: obj.name,
      },
    };
    setFields([...fields, field]);
  };

  let loaderTyper;

  let isReady;

  if (isConfiguration) {
    isReady =
      connections?.length > 0 &&
      fields?.length > 0 &&
      vercelProjects?.length &&
      newEmProjects?.length;
  } else isReady = !isDeploy && vercelProjects?.length && newEmProjects?.length;

  if (!isDeploy) {
    if (!editmodeProjects?.length || !vercelProjects?.length) {
      loaderTyper = (
        <div className="py-4 flex flex-col items-center justify-center align-center">
          <Loader
            type={"Oval"}
            color="#616AE9"
            height={70}
            width={70}
            className="mt-8"
          />
        </div>
      );
    } else loaderTyper = "";
  }

  if (isConfiguration) {
    if (!fields?.length) {
      loaderTyper = (
        <div className="py-4 flex flex-col items-center justify-center align-center">
          <Loader
            type={"Oval"}
            color="#616AE9"
            height={100}
            width={100}
            className="mt-6"
          />
        </div>
      );
    } else loaderTyper = "";
  }

  if (isDeploy) {
    if (!hasCloned) {
      loaderTyper = (
        <div className="py-4 flex flex-col items-center justify-center align-center">
          <div className="text-lg text-gray-700">
            Generating a new Editmode Project for your theme...
          </div>
          <Loader
            type={"TailSpin"}
            color="#616AE9"
            height={70}
            width={70}
            className="mt-6"
          />
        </div>
      );
    } else loaderTyper = <></>;
  }

  if (!isDeploy && editmodeProjects?.length === 0) {
    return (
      <Layout>
        <div className="w-full max-w-2xl">
          <div className="py-20">
            <div className="text-center">
              <p className="text-sm font-semibold text-indigo-600 uppercase tracking-wide">
                Oops
              </p>
              <h1 className="mt-2 text-3xl font-extrabold text-gray-900 tracking-tight sm:text-2xl">
                You don't yet own any Editmode projects to link.
              </h1>
              <p className="mt-2 text-base text-gray-500">
                But you can easily create one by visiting the app and logging
                into your account.
              </p>
              <div className="mt-6">
                <a
                  href="https://app.editmode.com"
                  className="text-base font-medium text-indigo-600 hover:text-indigo-500"
                  target="_blank"
                >
                  Go to Editmode<span aria-hidden="true"> &rarr;</span>
                </a>
              </div>
            </div>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout isConfiguration={isConfiguration} setConfigView={setConfigView}>
      <div className="w-full max-w-2xl">
        {loaderTyper}
        {isReady && (
          <div className="">
            <h2 className="mb-4 text-md text-gray-700 flex justify-center text-center">
              {isConfiguration
                ? "Remove/update pre-existing links or link your unlinked Vercel projects to your Editmode projects:"
                : "Link your Vercel projects to your Editmode projects:"}
            </h2>
          </div>
        )}
        {isReady && (
          <div>
            {fields.map((field, index) => {
              return (
                <SelectGroup
                  editmode_options={newEmProjects}
                  key={field.id}
                  vercel_options={vercelProjects}
                  removeField={removeField}
                  field={field}
                  fields={fields}
                  setFields={setFields}
                  count={index}
                  isConfiguration={isConfiguration}
                />
              );
            })}
            {isReady && (
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
                    {vercelProjects.length === 1
                      ? ""
                      : hasUsedAllVercelProjects
                      ? "No Vercel project left to link"
                      : `Link another Vercel project (${
                          vercelProjects.length - fields.length
                        } left)`}
                  </span>
                </p>
              </div>
            )}
          </div>
        )}
        {isReady && (
          <section className="py-4">
            <button
              className={`flex justify-center w-full mt-6 text-white font-medium py-3 leading-6 px-4 rounded-md hover:bg-indigo-400 transition duration-200 button ${
                isSaving ||
                showMessage ||
                isInstalling ||
                (dashboardView !== "deploy" && !vercelProjects.length)
                  ? `cursor-not-allowed bg-indigo-300`
                  : `bg-indigo-500`
              } `}
              onClick={() => handleClick(fields)}
              disabled={
                (dashboardView !== "deploy" && !vercelProjects.length) ||
                isInstalling ||
                isSaving ||
                showMessage
                  ? true
                  : false
              }
            >
              <svg
                class="animate-spin -ml-1 mr-3 h-5 w-5 text-white mt-0.5"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                style={{ display: isInstalling || isSaving ? "block" : "none" }}
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
              {!isConfiguration
                ? isInstalling
                  ? "ADDING INTEGRATION"
                  : dashboardView === "deploy"
                  ? "ADD INTEGRATION TO NEW TEMPLATE"
                  : "ADD INTEGRATION"
                : isSaving
                ? "SAVING CHANGES"
                : showMessage
                ? "CHANGES SAVED"
                : "SAVE CHANGES"}
            </button>
          </section>
        )}
      </div>
    </Layout>
  );
}
