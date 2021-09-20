import { isBrowser } from "utilities";
import useSWR from "swr";

export const useAuth = () => {
  const userFetcher = async () => {
    const token = isBrowser() && localStorage.getItem("concessio_pref_per");
    if (token) {
      const url = `https://api.editmode.com/users/vercel_config/verify?session_token=${token}`;
      try {
        const res = await fetch(url);
        const data = await res.json();
        if (data?.id) return data;
        else return null;
      } catch (err) {
        console.log(err);
      }
    } else setUser(null);
  };

  const { data, mutate, error } = useSWR("editmode_user", userFetcher);

  const loading = !data && !error;
  const loggedOut = error && error.status === 401;

  return {
    loading,
    loggedOut,
    user: data,
    mutate,
  };
};
