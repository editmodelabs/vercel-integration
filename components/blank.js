import { isBrowser } from "utilities";

export default function Blank({ user, setView, setToken, token }) {
  if ((isBrowser() && localStorage.getItem("concessio_pref_per")) || user) {
    setToken(localStorage.getItem("concessio_pref_per"));
    token && setView("dash");
  } else setView("auth");
  return <></>;
}
