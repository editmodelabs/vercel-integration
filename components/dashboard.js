import Layout from "./layout";
import Selection from "./select";
import Loader from "react-loader-spinner";
import Cards from "./cards";
import { useState } from "react";

export default function Dashboard({
  userEditmodeProjects,
  isFetchingEditmodeProjects,
  setProjectToInstall,
  isInstalling,
  handleInstall,
  vercelProjects,
}) {
  return (
    <Layout>
      <div className="w-full max-w-2xl divide-y">
        {isFetchingEditmodeProjects && (
          <div className="py-4 flex justify-center align-center">
            <Loader type="TailSpin" color="#616AE9" height={100} width={100} />
          </div>
        )}
        {userEditmodeProjects[0] && !isFetchingEditmodeProjects && (
          <>
            <section>
              <Selection
                projectOptions={userEditmodeProjects}
                setProjectToInstall={setProjectToInstall}
              />
            </section>
            <section>To: </section>
            <section>
              <Cards projects={vercelProjects} />
            </section>
            <section className="py-4">
              <button
                className={`flex justify-center w-full mt-6 text-white font-medium py-3 leading-6 px-4 rounded-md hover:bg-indigo-400 transition duration-200 button ${
                  isInstalling
                    ? `cursor-not-allowed bg-indigo-300`
                    : `bg-indigo-500`
                }`}
                onClick={handleInstall}
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
                {isInstalling ? "ADDING INTEGRATION" : "ADD INTEGRATION"}
              </button>
            </section>
          </>
        )}
      </div>
    </Layout>
  );
}
