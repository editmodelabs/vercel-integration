const Login = () => {
  return (
    <div class="min-h-screen bg-gray-100 flex items-center">
      <div class="container mx-auto max-w-md shadow-md hover:shadow-lg transition duration-300">
        <div class="py-12 p-10 bg-white rounded-xl">
          <div class="mb-6">
            <label
              class="mr-4 text-gray-700 text-sm font-medium inline-block mb-2"
              for="name"
            >
              Email
            </label>
            <input
              type="text"
              class="border bg-gray-100 py-2 px-4 w-96 outline-none focus:ring-2 focus:ring-indigo-400 rounded"
              placeholder="you@example.com"
            />
          </div>
          <div class="">
            <label
              class="mr-4 text-gray-700 text-sm font-medium inline-block mb-2"
              for="name"
            >
              Password
            </label>
            <input
              type="text"
              class="border bg-gray-100 py-2 px-4 w-96 outline-none focus:ring-2 focus:ring-indigo-400 rounded"
              placeholder=""
            />
          </div>
          <button class="w-full mt-6 text-indigo-50 font-medium bg-indigo-500 py-3 rounded-md hover:bg-indigo-400 transition duration-300 button">
            Log In
          </button>
        </div>
      </div>
    </div>
  );
};

export default Login;
