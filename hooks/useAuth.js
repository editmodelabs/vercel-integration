import { isBrowser } from "utilities";
import useSWR from "swr";

const useAuth = () => {
  const userFetcher = async () => {
    const token = isBrowser() && localStorage.getItem("concessio_pref_per");
    if (token) {
      const url = `https://api.editmode.com/users/vercel_config/verify?session_token=${token}`;
      try {
        const res = await fetch(url);
        const data = await res.json();
        if (data?.id) return data;
        else {
          const error = new Error("Not authorized!");
          error.status = 403;
          throw error;
        }
      } catch (err) {
        console.log(err);
      }
    } else return null;
  };

  const { data, mutate } = useSWR("user", userFetcher);
  return {
    user: data,
    mutate,
  };
};

export default useAuth;
