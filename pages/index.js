import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import Layout from "components/layout";
import { useCookie } from "utilities";
import Selection from "components/select";
import Loader from "react-loader-spinner";
import { defaultOption } from "../utilities";

export default function CallbackPage() {
  const router = useRouter();
  const [value] = useCookie("em_user_key");
  const [data, setData] = useState({});
  const [vercelProject, setVercelProject] = useState();
  const [editmodeToken, setEditmodeToken] = useState();
  const [userEditmodeProjects, setUserEditmodeProjects] = useState([
    defaultOption,
  ]);
  const [projectToInstall, setProjectToInstall] = useState({});
  const [isInstalling, setIsInstalling] = useState(false);
  const [isFetchingEditmodeProjects, setIsFetchingEditmodeProjects] =
    useState(false);

  useEffect(() => {
    if (!value) {
      router.push("/authentication");
    } else setEditmodeToken(value);
  }, [router, value]);

  useEffect(() => {
    const fetchAccessToken = async (code) => {
      const details = {
        client_id: "oac_KxaKzLl1KakFnclDJURDmQtI",
        client_secret: "9d72agydqs5x5YHX3wTNP8Iv",
        code: code,
        redirect_uri: "http://localhost:3000",
      };
      var formBody = [];
      for (var property in details) {
        var encodedKey = encodeURIComponent(property);
        var encodedValue = encodeURIComponent(details[property]);
        formBody.push(encodedKey + "=" + encodedValue);
      }
      formBody = formBody.join("&");

      const res = await fetch("https://api.vercel.com/v2/oauth/access_token", {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: formBody,
      });
      const json = await res.json();

      setData({
        accessToken: json.access_token,
        userId: json.user_id,
        teamId: json.team_id,
      });
    };

    const { currentProjectId } = router.query;
    setVercelProject(currentProjectId);

    if (router.isReady && !data.accessToken) {
      const { code } = router.query;
      fetchAccessToken(code);
    }
  }, [router]);

  useEffect(() => {
    const fetchEditmodeProjects = async (token) => {
      if (token) {
        setIsFetchingEditmodeProjects(true);
        const url = `https://api.editmode.com/projects?api_key=${token}`;
        try {
          const res = await fetch(url, {
            method: "GET",
            headers: { "Content-Type": "application/json" },
          });
          const data = await res.json();
          if (data) setUserEditmodeProjects([...userEditmodeProjects, ...data]);
          setIsFetchingEditmodeProjects(false);
          return id;
        } catch (err) {
          console.log(err);
        }
      }
    };
    fetchEditmodeProjects(value);
  }, [router]);

  const handleInstall = async (e) => {
    alert(data.accessToken);
    e.preventDefault();
    setIsInstalling(true);
    const cloneProject = async (token) => {
      if (token) {
        const url = `https://api.editmode.com/clone/prj_Y5HfCBS4rqZg?api_key=${token}`;
        try {
          const res = await fetch(url, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
          });
          const data = await res.json();
          const id = data["id"];
          return id;
        } catch (err) {
          console.log(err);
        }
      }
    };
    let token, em_project_to_use;
    if (editmodeToken) token = editmodeToken;

    if (projectToInstall.default) {
      em_project_to_use = await cloneProject(token);
    } else {
      em_project_to_use = projectToInstall.identifier;
    }

    const writeENV = async (accessToken, em_project_to_use) => {
      alert(accessToken);
      const res = await fetch(
        `https://api.vercel.com/v8/projects/${vercelProject}/env`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${accessToken}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            type: "encrypted",
            key: "NEXT_PUBLIC_PROJECT_ID",
            value: em_project_to_use,
            target: ["production", "preview"],
          }),
        }
      );
      const json = await res.json();
      alert(JSON.stringify(json));
      setIsInstalling(false);
      if (json.value) router.push(router.query.next);
    };
    if (data.accessToken && em_project_to_use) {
      writeENV(data.accessToken, em_project_to_use);
    }
  };

  if (!value) return null;

  return (
    <Layout>
      <div className="w-full max-w-2xl divide-y">
        {isFetchingEditmodeProjects && (
          <div className="py-4 flex justify-center align-center">
            <Loader type="TailSpin" color="#616AE9" height={100} width={100} />
          </div>
        )}
        {userEditmodeProjects[0] && !isFetchingEditmodeProjects && (
          <>
            <section>
              <Selection
                projectOptions={userEditmodeProjects}
                setProjectToInstall={setProjectToInstall}
              />
            </section>
            <section className="py-4">
              <button
                className={`flex justify-center w-full mt-6 text-white font-medium py-3 leading-6 px-4 rounded-md hover:bg-indigo-400 transition duration-200 button ${
                  isInstalling
                    ? `cursor-not-allowed bg-indigo-300`
                    : `bg-indigo-500`
                }`}
                onClick={handleInstall}
              >
                <svg
                  class="animate-spin -ml-1 mr-3 h-5 w-5 text-white mt-0.5"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  style={{ display: isInstalling ? "block" : "none" }}
                >
                  <circle
                    class="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    stroke-width="4"
                  ></circle>
                  <path
                    class="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
                {isInstalling ? "ADDING INTEGRATION" : "ADD INTEGRATION"}
              </button>
            </section>
          </>
        )}
      </div>
    </Layout>
  );
}
