import Layout from "./layout";
import SelectGroup from "./selectGroup";
import Loader from "react-loader-spinner";
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
  const [unselected, setUnselected] = useState(vercel_options);

  const [selectGroupCount, setSelectGroupCount] = useState(1);
  const hanleAddNewField = () => {
    const count = selectGroupCount;
    setSelectGroupCount(count + 1);
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
          {[...Array(selectGroupCount)].map((r, idx) => {
            return (
              <SelectGroup
                editmode_options={editmode_options}
                key={idx}
                vercel_options={unselected}
                fieldIndex={idx}
                setUnselected={setUnselected}
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
