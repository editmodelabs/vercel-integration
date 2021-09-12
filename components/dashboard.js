import Layout from "./layout";
import Selection from "./select";
import Loader from "react-loader-spinner";
import Cards from "./cards";
import { useState } from "react";
import { ArrowDownIcon } from "@heroicons/react/outline";

export default function Dashboard({
  userEditmodeProjects,
  isFetchingEditmodeProjects,
  setProjectToInstall,
  isInstalling,
  handleInstall,
  vercelProjects,
  setVercelProjects,
  dashboardView,
}) {
  return (
    <Layout>
      <div className="w-full max-w-2xl divide-y">
        {dashboardView === "deploy" && (
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
        {/* {userEditmodeProjects[0] &&
          !isFetchingEditmodeProjects &&
          vercelProjects !== undefined && (
            <>
              <section>
                <Selection
                  projectOptions={userEditmodeProjects}
                  setProjectToInstall={setProjectToInstall}
                  dashboardView={dashboardView}
                />
                <div className="text-xs text-gray-500 mt-2 mb-2">
                  {dashboardView !== "deploy"
                    ? "The Editmode project ID will be stored in the NEXT_PUBLIC_PROJECT_ID environment variable."
                    : "Generating a starter will create a new Editmode project and store its ID in the NEXT_PUBLIC_PROJECT_ID environment variable of your new template."}
                </div>
              </section>

              {dashboardView !== "deploy" && (
                <>
                  <div className="w-full flex items-center justify-center p-6">
                    <ArrowDownIcon className="w-10 h-12 text-gray-400" />
                  </div>
                  {vercelProjects.length && (
                    <section>
                      <Cards
                        projects={vercelProjects}
                        setProjects={setVercelProjects}
                      />
                    </section>
                  )}
                  {vercelProjects.length == 0 && (
                    <div className="text-sm text-center text-gray-500">
                      No Vercel projects to link to.
                    </div>
                  )}
                </>
              )}
              <section className="py-4">
                <button
                  className={`flex justify-center w-full mt-6 text-white font-medium py-3 leading-6 px-4 rounded-md hover:bg-indigo-400 transition duration-200 button ${
                    isInstalling ||
                    (dashboardView !== "deploy" && !vercelProjects.length)
                      ? `cursor-not-allowed bg-indigo-300`
                      : `bg-indigo-500`
                  } `}
                  onClick={handleInstall}
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
            </>
          )} */}
      </div>
    </Layout>
  );
}
