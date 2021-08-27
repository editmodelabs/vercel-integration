import { isBrowser, useCookie } from "../utilities";
import { useState } from "react";
import { Formik, Form, Field } from "formik";

const initialFormState = {
  email: "",
  password: "",
  firstName: "",
  lastName: "",
  passwordConfirmation: "",
};

const UserCredentials = ({ setView, setToken }) => {
  const [_, updateCookie] = useCookie("concessio_pref_per");
  const [authType, setAuthType] = useState("login");
  const [credentials, setCredentials] = useState(initialFormState);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoginValid, setIsLoginValid] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");
  const handleFormChange = (e) => {
    setCredentials({ ...credentials, [e.target.name]: e.target.value });
  };

  const handleLogIn = async (e) => {
    e.preventDefault();
    const url = `https://api.editmode.com/login?email=${credentials.email}&password=${credentials.password}`;
    setIsLoading(true);
    const res = await fetch(url, { method: "POST" });
    const data = await res.json();
    if (data.errors && data.errors[0].includes("does not match")) {
      setIsLoading(false);
      setIsLoginValid(false);
    }
    const token = data.authentication_token;
    if (isBrowser() && token) localStorage.setItem("concessio_pref_per", token);
    if (token) {
      setIsLoading(false);
      setToken(token);
    }
    if (token && isBrowser()) {
      setIsLoginValid(true);
      localStorage.setItem("em_user_email", credentials.email);
      setView("dash");
    }
  };

  const handleSignUp = async (values) => {
    const url = `https://api.editmode.com/users/sign_up?email=${values.email}&password=${values.password}&first_name=${values.firstName}&last_name=${values.lastName}&password_confirmation=${values.passwordConfirmation}&api_key=z9JrfCcPz3KmjnSMxNKfggKT`;
    setIsLoading(true);
    const res = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
    });
    const data = await res.json();
    if (data.errors) {
      setIsLoading(false);
      setErrorMessage(data.errors[0]);
    }
    const token = data.authentication_token;
    if (isBrowser()) localStorage.setItem("concessio_pref_per", token);
    if (token) {
      setIsLoading(false);
      setErrorMessage("");
      setToken(token);
    }
    if (isBrowser() && token) {
      localStorage.setItem("em_user_email", values.email);
    }
    if (token) setView("dash");
  };

  const handleAuthTypeSwitch = (e) => {
    if (authType === "login") setAuthType("signup");
    else setAuthType("login");
  };

  return (
    <div className=" min-h-screen bg-gray-100 flex items-center flex flex-col justify-center">
      {authType === "login" && (
        <>
          <div className="sm:mx-auto sm:w-full sm:max-w-md">
            <a href={""}>
              {" "}
              <img
                style={{ height: "40px" }}
                src={
                  "https://app.editmode.com/assets/logo-v2-55f5bda132dae21e6d29b252dc327778343a5462953bfc702210b9bebaf687ef.png"
                }
                className="mx-auto w-auto"
              />
            </a>
            <h2 className="mt-6 text-center text-3xl leading-9 font-extrabold text-gray-900 f-f-averta font-semibold">
              Sign in to your account
            </h2>
            <p className="mt-2 text-center text-sm leading-5 m-8">
              or
              <span
                className="font-medium text-indigo-600 hover:text-indigo-500 focus:outline-none focus:underline transition ease-in-out duration-150"
                style={{ cursor: "pointer" }}
                onClick={handleAuthTypeSwitch}
              >
                {" "}
                create a new account
              </span>
            </p>
          </div>
          <div className="container mx-auto max-w-md shadow-md hover:shadow-lg transition duration-300">
            <form
              className="py-12 p-10 bg-white rounded-xl"
              onSubmit={handleLogIn}
            >
              <div
                class={`rounded-md bg-red-100 p-4 mb-6 ${
                  isLoginValid ? "hidden" : ""
                }`}
              >
                <div class="flex">
                  <div class="flex-shrink-0">
                    <svg
                      fill="currentColor"
                      viewBox="0 0 20 20"
                      width="24"
                      height="24"
                      class="text-red-600"
                    >
                      <path
                        clip-rule="evenodd"
                        d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                        fill-rule="evenodd"
                      ></path>
                    </svg>
                  </div>
                  <div class="ml-3 text-sm leading-5 font-medium text-red-800">
                    Invalid email or password.
                  </div>
                </div>
              </div>

              <div className="mb-6">
                <label
                  className="mr-4 text-gray-700 text-sm font-medium inline-block mb-2"
                  htmlFor="name"
                >
                  Email
                </label>
                <input
                  type="text"
                  className="border bg-gray-100 py-2 px-4 w-96 outline-none focus:ring-2 focus:ring-indigo-400 rounded"
                  placeholder="you@example.com"
                  name="email"
                  value={credentials.email}
                  onChange={handleFormChange}
                />
              </div>
              <div className="">
                <label
                  className="mr-4 text-gray-700 text-sm font-medium inline-block mb-2"
                  htmlFor="name"
                >
                  Password
                </label>
                <input
                  type="password"
                  className="border bg-gray-100 py-2 px-4 w-96 outline-none focus:ring-2 focus:ring-indigo-400 rounded"
                  placeholder=""
                  name="password"
                  value={credentials.password}
                  onChange={handleFormChange}
                />
              </div>
              <button
                className={`flex justify-center w-full mt-6 text-indigo-50 font-medium py-2 leading-6 px-4 rounded-md hover:bg-indigo-400 transition duration-300 button ${
                  isLoading
                    ? `cursor-not-allowed bg-indigo-400`
                    : `bg-indigo-500`
                }`}
                type="submit"
                disabled={isLoading ? true : false}
              >
                <svg
                  class="animate-spin -ml-1 mr-3 h-5 w-5 text-white mt-0.5"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  style={{ display: isLoading ? "block" : "none" }}
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
                {isLoading ? "Logging In" : "Log In"}
              </button>
            </form>
          </div>
        </>
      )}
      {authType === "signup" && (
        <>
          <div className="sm:mx-auto sm:w-full sm:max-w-md">
            <a href={""}>
              {" "}
              <img
                style={{ height: "40px" }}
                src={
                  "https://app.editmode.com/assets/logo-v2-55f5bda132dae21e6d29b252dc327778343a5462953bfc702210b9bebaf687ef.png"
                }
                className="mx-auto w-auto"
              />
            </a>
            <h2 className="mt-6 text-center text-3xl leading-9 font-extrabold text-gray-900 f-f-averta font-semibold">
              Get started with Editmode
            </h2>
            <p className="mt-2 text-center text-sm leading-5 m-8">
              or
              <span
                className="font-medium text-indigo-600 hover:text-indigo-500 focus:outline-none focus:underline transition ease-in-out duration-150"
                style={{ cursor: "pointer" }}
                onClick={handleAuthTypeSwitch}
              >
                {" "}
                sign in
              </span>
            </p>
          </div>
          <div className="container mx-auto max-w-md shadow-md hover:shadow-lg transition duration-300">
            <Formik
              initialValues={{
                email: "",
                password: "",
                passwordConfirmation: "",
              }}
              validate={(values) => {
                const errors = {};
                if (!values.email) {
                  errors.email = "Your email is equired";
                } else if (
                  !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(values.email)
                ) {
                  errors.email = "Invalid email address";
                } else if (!values.password) {
                  errors.password = "A password is required";
                } else if (values.password.length < 8) {
                  errors.password =
                    "Password must be at least 8 characters long";
                } else if (!values.passwordConfirmation) {
                  errors.passwordConfirmation =
                    "You need to confirm your password";
                } else if (
                  values.passwordConfirmation &&
                  values.password !== values.passwordConfirmation
                ) {
                  errors.passwordConfirmation = "Your passwords do not match";
                }
                return errors;
              }}
              onSubmit={(values) => {
                handleSignUp(values);
              }}
            >
              {({ values, errors, touched, handleChange, handleSubmit }) => (
                <form
                  className="py-12 p-10 bg-white rounded-xl"
                  onSubmit={handleSubmit}
                >
                  {" "}
                  <div
                    class={`rounded-md bg-red-100 p-4 mb-6 ${
                      !errorMessage.length ? "hidden" : ""
                    }`}
                  >
                    <div class="flex">
                      <div class="flex-shrink-0">
                        <svg
                          fill="currentColor"
                          viewBox="0 0 20 20"
                          width="24"
                          height="24"
                          class="text-red-600"
                        >
                          <path
                            clip-rule="evenodd"
                            d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                            fill-rule="evenodd"
                          ></path>
                        </svg>
                      </div>
                      <div class="ml-3 text-sm leading-5 font-medium text-red-800">
                        {errorMessage}
                      </div>
                    </div>
                  </div>
                  <div className="mb-6">
                    <label
                      className="mr-4 text-gray-700 text-sm font-medium inline-block mb-2"
                      htmlFor="firstName"
                    >
                      First Name
                    </label>
                    <input
                      type="text"
                      className="border bg-gray-100 py-2 px-4 w-96 outline-none focus:ring-2 focus:ring-indigo-400 rounded"
                      placeholder="John"
                      name="firstName"
                      value={values.firstName}
                      onChange={handleChange}
                    />
                  </div>
                  <div className="mb-6">
                    <label
                      className="mr-4 text-gray-700 text-sm font-medium inline-block mb-2"
                      htmlFor="lastName"
                    >
                      Last Name
                    </label>
                    <input
                      type="text"
                      className="border bg-gray-100 py-2 px-4 w-96 outline-none focus:ring-2 focus:ring-indigo-400 rounded"
                      placeholder="Doe"
                      name="lastName"
                      value={values.lastName}
                      onChange={handleChange}
                    />
                  </div>
                  <div className="mb-6">
                    <label
                      className="mr-4 text-gray-700 text-sm font-medium inline-block mb-2"
                      htmlFor="email"
                    >
                      Email
                    </label>
                    <input
                      type="text"
                      className={`border bg-gray-100 py-2 px-4 w-96 outline-none focus:ring-1  rounded ${
                        errors.email && touched.email
                          ? "border-red-400 focus:ring-red-500"
                          : "focus:ring-indigo-400"
                      }`}
                      placeholder="you@example.com"
                      name="email"
                      value={values.email}
                      onChange={handleChange}
                    />
                    <div
                      className={`text-sm text-red-400 -mb-3 ${
                        errors.email && touched.email ? "" : "invisible"
                      }`}
                    >
                      {errors.email && touched.email && errors.email
                        ? errors.email
                        : "&nbsp"}
                    </div>
                  </div>
                  <div className="mb-6">
                    <label
                      className="mr-4 text-gray-700 text-sm font-medium inline-block mb-2"
                      htmlFor="password"
                    >
                      Password
                    </label>
                    <input
                      type="password"
                      className={`border bg-gray-100 py-2 px-4 w-96 outline-none focus:ring-1 rounded ${
                        errors.password && touched.password
                          ? "border-red-400 focus:ring-red-500"
                          : "focus:ring-indigo-400"
                      }`}
                      placeholder=""
                      name="password"
                      value={values.password}
                      onChange={handleChange}
                    />
                    <div
                      className={`text-sm text-red-400 -mb-3 ${
                        errors.password && touched.password ? "" : "invisible"
                      }`}
                    >
                      {errors.password && touched.password && errors.password
                        ? errors.password
                        : "&nbsp"}
                    </div>
                  </div>
                  <div className="mb-6">
                    <label
                      className="mr-4 text-gray-700 text-sm font-medium inline-block mb-2"
                      htmlFor="passwordConfirmation"
                    >
                      Password confirmation
                    </label>
                    <input
                      type="password"
                      className={`border bg-gray-100 py-2 px-4 w-96 outline-none focus:ring-1 rounded ${
                        errors.passwordConfirmation &&
                        touched.passwordConfirmation
                          ? "border-red-400 focus:ring-red-500"
                          : "focus:ring-indigo-400"
                      }`}
                      placeholder=""
                      name="passwordConfirmation"
                      value={values.passwordConfirmation}
                      onChange={handleChange}
                    />
                    <div
                      className={`text-sm text-red-400 -mb-3  ${
                        errors.passwordConfirmation &&
                        touched.passwordConfirmation
                          ? ""
                          : "invisible"
                      }`}
                    >
                      {errors.passwordConfirmation &&
                      touched.passwordConfirmation &&
                      errors.passwordConfirmation
                        ? errors.passwordConfirmation
                        : "&nbsp"}
                    </div>
                  </div>
                  <button
                    className={`flex justify-center w-full mt-6 text-indigo-50 font-medium py-2 leading-6 px-4 rounded-md hover:bg-indigo-400 transition duration-300 button ${
                      isLoading
                        ? `cursor-not-allowed bg-indigo-400`
                        : `bg-indigo-500`
                    }`}
                    type="submit"
                    disabled={isLoading ? true : false}
                  >
                    <svg
                      class="animate-spin -ml-1 mr-3 h-5 w-5 text-white mt-0.5"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      style={{ display: isLoading ? "block" : "none" }}
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
                    {isLoading ? "Signing Up" : "Sign Up"}
                  </button>
                </form>
              )}
            </Formik>
          </div>
        </>
      )}
    </div>
  );
};

export default UserCredentials;
