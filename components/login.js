import { api } from "../utilities";
import { useState } from "react";
import { useRouter } from "next/router";

const initialFormState = {
  email: "",
  password: "",
};

const Login = () => {
  const [credentials, setCredentials] = useState(initialFormState);
  const router = useRouter();
  const handleChange = (e) => {
    setCredentials({ ...credentials, [e.target.name]: e.target.value });
  };

  const onLogin = async (e) => {
    e.preventDefault();
    const url = `https://api.editmode.com/login?email=${credentials.email}&password=${credentials.password}`;
    const res = await fetch(url, { method: "POST" });
    const data = await res.json();
    const token = data.authentication_token;
    localStorage.setItem("user_token", token);
    router.push("/callback");
  };

  return (
    <div className=" min-h-screen bg-gray-100 flex items-center flex flex-col justify-center">
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
          Or
          <a
            class="font-medium text-indigo-600 hover:text-indigo-500 focus:outline-none focus:underline transition ease-in-out duration-150"
            href="/users/sign_up?redirect_url="
          >
            <span> create a new account</span>
          </a>
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
    </div>
  );
};

export default Login;
