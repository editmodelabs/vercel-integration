import axios from "axios";
const isBrowser = () => typeof window !== "undefined";
export function api() {
  const instance = axios.create({
    baseURL: "http://api.editmode.com",
    headers: {
      "Content-Type": "application/json",
      referrer: isBrowser() ? window.location.href : "",
    },
  });

  return instance;
}
