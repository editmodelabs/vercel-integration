import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import Dashboard from "components/dashboard";
import { useCookie } from "utilities";
import { defaultOption } from "../utilities";
import Auth from "components/credentials";

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
  const [authenticated, setAuthenticated] = useState("auth");

  useEffect(() => {
    if (value) {
      setEditmodeToken(value);
      setAuthenticated("dash");
    }
  }, []);

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

  return (
    <>
      {authenticated === "auth" && <Auth setAuthenticated={setAuthenticated} />}
      {authenticated === "dash" && (
        <Dashboard
          userEditmodeProjects={userEditmodeProjects}
          handleInstall={handleInstall}
          isFetchingEditmodeProjects={isFetchingEditmodeProjects}
          isInstalling={isInstalling}
          setProjectToInstall={setProjectToInstall}
          setAuthenticated={setAuthenticated}
        />
      )}
    </>
  );
}
