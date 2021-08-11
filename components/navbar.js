/* This example requires Tailwind CSS v2.0+ */
import { Disclosure } from "@headlessui/react";
import { LogoutIcon } from "@heroicons/react/outline";
import Cookies from "js-cookie";
import router, { useRouter } from "next/router";

function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
  const router = useRouter();
}

const handleSignOut = () => {
  Cookies.remove("em_user_key");
  router.push("/authentication");
};

export default function Example() {
  return (
    <Disclosure as="nav" className="bg-white shadow">
      {({ open }) => (
        <>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between h-16">
              <div className="flex">
                <div className="flex-shrink-0 flex items-center">
                  <img
                    className="block lg:hidden h-8 w-auto"
                    src="https://app.editmode.com/favicon.ico"
                    alt="Workflow"
                  />
                  <img
                    className="hidden lg:block h-8 w-auto"
                    src="https://app.editmode.com/assets/logo-v2-55f5bda132dae21e6d29b252dc327778343a5462953bfc702210b9bebaf687ef.png"
                    alt="Workflow"
                  />
                </div>
              </div>
              <div className="flex items-center">
                <div className="hidden md:ml-4 md:flex-shrink-0 md:flex md:items-center mr-5 text-sm text-gray-600">
                  {/* Profile dropdown */}
                  <p>
                    {Cookies.get("em_user_email")
                      ? Cookies.get("em_user_email")
                      : ""}
                  </p>
                </div>
                <div className="flex-shrink-0">
                  <button
                    type="button"
                    className="relative inline-flex items-center px-4 py-2 border border-indigo-400 text-sm text-indigo-500 rounded-md text-white bg-white shadow-sm hover:border-indigo-600 hover:text-indigo-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                    onClick={() => handleSignOut()}
                  >
                    <LogoutIcon
                      className="-ml-1 mr-2 h-5 w-5"
                      aria-hidden="true"
                    />
                    <span>Sign Out</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </Disclosure>
  );
}