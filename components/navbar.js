import { LogoutIcon } from "@heroicons/react/outline";
import { isBrowser } from "utilities";
// import logo from "../public/editmode.png";

export default function NavBar({ isConfiguration, setConfigView, mutate }) {
  const handleSignOut = () => {
    if (isBrowser()) {
      const user = localStorage.getItem("concessio_pref_per");
      if (user) {
        localStorage.removeItem("concessio_pref_per");
        localStorage.removeItem("em_user_email");
        mutate();
      }
      !isConfiguration && window.close();
      isConfiguration && setConfigView("auth");
    }
  };

  return (
    <nav className="bg-white shadow">
      <>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex">
              <div className="flex-shrink-0 flex items-center">
                <img
                  className="sm:block hidden h-8 w-auto"
                  src="/logo.png"
                  alt="editmode-logo"
                />
                <img
                  className="sm:hidden lg:block h-8 w-auto"
                  src="/editmode.png"
                  alt="editmode"
                />
              </div>
            </div>
            <div className="flex items-center">
              <div className="hidden md:ml-4 md:flex-shrink-0 md:flex md:items-center mr-5 text-sm text-gray-600">
                <p>
                  {isBrowser() && localStorage.getItem("em_user_email")
                    ? localStorage.getItem("em_user_email")
                    : ""}
                </p>
              </div>
              <div className="flex-shrink-0">
                <button
                  type="button"
                  className="relative inline-flex items-center px-4 py-2 border border-indigo-400 text-sm text-indigo-500 rounded-md text-white bg-white shadow-sm hover:border-indigo-600 hover:text-indigo-600 focus:outline-none "
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
    </nav>
  );
}
