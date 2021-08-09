import axios from "axios";
const isBrowser = () => typeof window !== "undefined";

export const api = axios.create({
  baseURL: "http://api.editmode.com",
  headers: {
    "Content-Type": "application/json",
    referrer: isBrowser() ? window.location.href : "",
    "Access-Control-Allow-Origin": "*",
  },
});
