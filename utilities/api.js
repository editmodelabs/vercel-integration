export default function axiosWithAuth() {
  const instance = axios.create({
    baseURL: "http://api.editmode.com",
    headers: {
      "Content-Type": "application/json",
    },
  });

  return instance;
}
