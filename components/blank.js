import { isBrowser } from "utilities";

export default function Blank({ user, setView, setToken }) {
  if ((isBrowser() && localStorage.getItem("concessio_pref_per")) || user) {
    setToken(localStorage.getItem("concessio_pref_per"));
    setView("dash");
  } else setView("auth");
  return <></>;
}
