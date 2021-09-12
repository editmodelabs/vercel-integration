import { useEffect } from "react";

export default function Blank({ user, setView, setToken, token }) {
  useEffect(() => {
    if (localStorage.getItem("concessio_pref_per") || user) {
      setToken(localStorage.getItem("concessio_pref_per"));
      setView("dash");
    } else setView("auth");
  }, []);
  return <></>;
}
