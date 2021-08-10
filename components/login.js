import { api } from "../utilities";
import { useState } from "react";
import { useRouter } from "next/router";

const initialFormState = {
  email: "",
  password: "",
  firstName: "",
  lastName: "",
  passwordConfirmation: "",
};

const Login = () => {
  const [authType, setAuthType] = useState("login");
  const [credentials, setCredentials] = useState(initialFormState);
  const router = useRouter();
  const handleChange = (e) => {
    setCredentials({ ...credentials, [e.target.name]: e.target.value });
  };

  const onLogin = async (e) => {
    e.preventDefault();
    if (authType === "login") {
      const url = `https://api.editmode.com/login?email=${credentials.email}&password=${credentials.password}`;
      const res = await fetch(url, { method: "POST" });
      const data = await res.json();
      const token = data.authentication_token;
      localStorage.setItem("user_token", token);
      router.push("/");
    } else {
      const url = `https://api.editmode.com/users/sign_up?email=${credentials.email}&password=${credentials.password}&first_name=${credentials.firstName}&last_name=${credentials.lastName}&password_confirmation=${credentials.passwordConfirmation}&api_key=z9JrfCcPz3KmjnSMxNKfggKT`;
      console.log(url);
      const res = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
      });
      const data = await res.json();
      console.log(data);
      const token = data.authentication_token;
      localStorage.setItem("user_token", token);
      if (data.authentication_token) router.push("/");
    }
  };

  const handleAuthTypeSwitch = (e) => {
    if (authType === "login") setAuthType("signup");
    else setAuthType("login");
  };

  return (
    <div className=" min-h-screen bg-gray-100 flex items-center flex flex-col justify-center">
      {authType === "login" && (
        <>
          <div class="sm:mx-auto sm:w-full sm:max-w-md">
            <a href={""}>
              {" "}
              <img
                style={{ height: "40px" }}
                src={
                  "https://app.editmode.com/assets/logo-v2-55f5bda132dae21e6d29b252dc327778343a5462953bfc702210b9bebaf687ef.png"
                }
                class="mx-auto w-auto"
              />
            </a>
            <h2 class="mt-6 text-center text-3xl leading-9 font-extrabold text-gray-900 f-f-averta font-semibold">
              Sign in to your account
            </h2>
            <p class="mt-2 text-center text-sm leading-5 m-8">
              or
              <span
                class="font-medium text-indigo-600 hover:text-indigo-500 focus:outline-none focus:underline transition ease-in-out duration-150"
                style={{ cursor: "pointer" }}
                onClick={handleAuthTypeSwitch}
              >
                {" "}
                create a new account
              </span>
            </p>
          </div>
          <div className="container mx-auto max-w-md shadow-md hover:shadow-lg transition duration-300">
            <form className="py-12 p-10 bg-white rounded-xl" onSubmit={onLogin}>
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
                  onChange={handleChange}
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
                  onChange={handleChange}
                />
              </div>
              <button
                className="w-full mt-6 text-indigo-50 font-medium bg-indigo-500 py-3 rounded-md hover:bg-indigo-400 transition duration-300 button "
                type="submit"
              >
                Log In
              </button>
            </form>
          </div>
        </>
      )}
      {authType === "signup" && (
        <>
          <div class="sm:mx-auto sm:w-full sm:max-w-md">
            <a href={""}>
              {" "}
              <img
                style={{ height: "40px" }}
                src={
                  "https://app.editmode.com/assets/logo-v2-55f5bda132dae21e6d29b252dc327778343a5462953bfc702210b9bebaf687ef.png"
                }
                class="mx-auto w-auto"
              />
            </a>
            <h2 class="mt-6 text-center text-3xl leading-9 font-extrabold text-gray-900 f-f-averta font-semibold">
              Get started with Editmode
            </h2>
            <p class="mt-2 text-center text-sm leading-5 m-8">
              or
              <span
                class="font-medium text-indigo-600 hover:text-indigo-500 focus:outline-none focus:underline transition ease-in-out duration-150"
                style={{ cursor: "pointer" }}
                onClick={handleAuthTypeSwitch}
              >
                {" "}
                sign in
              </span>
            </p>
          </div>
          <div className="container mx-auto max-w-md shadow-md hover:shadow-lg transition duration-300">
            <form className="py-12 p-10 bg-white rounded-xl" onSubmit={onLogin}>
              {" "}
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
                  value={credentials.firstName}
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
                  value={credentials.lastName}
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
                  className="border bg-gray-100 py-2 px-4 w-96 outline-none focus:ring-2 focus:ring-indigo-400 rounded"
                  placeholder="you@example.com"
                  name="email"
                  value={credentials.email}
                  onChange={handleChange}
                />
              </div>
              <div className="">
                <label
                  className="mr-4 text-gray-700 text-sm font-medium inline-block mb-2"
                  htmlFor="password"
                >
                  Password
                </label>
                <input
                  type="password"
                  className="border bg-gray-100 py-2 px-4 w-96 outline-none focus:ring-2 focus:ring-indigo-400 rounded"
                  placeholder=""
                  name="password"
                  value={credentials.password}
                  onChange={handleChange}
                />
              </div>
              <div className="">
                <label
                  className="mr-4 text-gray-700 text-sm font-medium inline-block mb-2"
                  htmlFor="passwordConfirmation"
                >
                  Password confirmation
                </label>
                <input
                  type="password"
                  className="border bg-gray-100 py-2 px-4 w-96 outline-none focus:ring-2 focus:ring-indigo-400 rounded"
                  placeholder=""
                  name="passwordConfirmation"
                  value={credentials.passwordConfirmation}
                  onChange={handleChange}
                />
              </div>
              <button
                className="w-full mt-6 text-indigo-50 font-medium bg-indigo-500 py-3 rounded-md hover:bg-indigo-400 transition duration-300 button "
                type="submit"
              >
                Sign Up
              </button>
            </form>
          </div>
        </>
      )}
    </div>
  );
};

export default Login;
