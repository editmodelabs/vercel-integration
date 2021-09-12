import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import Dashboard from "components/dashboard";
import {
  defaultOption,
  updateVercelEnv,
  checkVercelEnv,
  vercelEnvReq,
} from "../utilities";
import Auth from "components/credentials";
import Blank from "components/blank";
import Modal from "components/modal";

export default function CallbackPage() {
  const router = useRouter();
  const [data, setData] = useState({});
  const [userEditmodeProjects, setUserEditmodeProjects] = useState([
    defaultOption,
  ]);
  const [vercelProjects, setVercelProjects] = useState(undefined);
  const [projectToInstall, setProjectToInstall] = useState({});
  const [isInstalling, setIsInstalling] = useState(false);
  const [isFetchingEditmodeProjects, setIsFetchingEditmodeProjects] =
    useState(false);
  const [view, setView] = useState();
  const [token, setToken] = useState();
  const [open, setOpen] = useState(false);
  const [dashboardView, setDashboardView] = useState("");
  const [hasCloned, setHasCloned] = useState(false);

  const handleInstall = async () => {
    alert(token);
    const isDeployFlow = dashboardView === "deploy";
    !isDeployFlow && setIsInstalling(true);
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

    let em_project_to_use;
    if (isDeployFlow) {
      em_project_to_use = await cloneProject(token);
    }

    const writeSingleEnv = async (accessToken, em_project_to_use) => {
      const { currentProjectId } = router.query;
      const json = await vercelEnvReq(
        accessToken,
        em_project_to_use,
        currentProjectId
      );
      if (json.value) {
        setHasCloned(true);
        setOpen(true);
      }
      if (json.error) {
        if (json.error.message) alert(json.error.message);
      }
    };

    const writeMultiEnv = async (accessToken, em_project_to_use) => {
      let hasError = false;
      const requests = vercelProjects.map(async (vercelProject) => {
        const current_id = vercelProject.id;
        const existing_env = await checkVercelEnv(
          accessToken,
          current_id,
          "NEXT_PUBLIC_PROJECT_ID",
          data.teamId
        );
        if (existing_env) {
          const patch_res = await updateVercelEnv(
            accessToken,
            current_id,
            existing_env,
            em_project_to_use,
            data.teamId
          );
          return patch_res;
        } else {
          const lone_request = await vercelEnvReq(
            accessToken,
            em_project_to_use,
            current_id
          );
          return lone_request;
        }
      });
      const multi_res = await Promise.all(requests);
      setIsInstalling(false);
      if (multi_res) {
        multi_res.forEach((json, idx) => {
          if (json.error && json.error.message) {
            alert(json.error.message);
            hasError = true;
          } else if (
            json.value &&
            idx === vercelProjects.length - 1 &&
            !hasError
          ) {
            router.push(router.query.next);
          }
        });
      }
    };

    if (data.accessToken && em_project_to_use && isDeployFlow) {
      writeSingleEnv(data.accessToken, em_project_to_use);
    } else if (data.accessToken && em_project_to_use && !isDeployFlow) {
      writeMultiEnv(data.accessToken, em_project_to_use, vercelProjects);
    }
  };

  useEffect(() => {
    if (router.query.currentProjectId) setDashboardView("deploy");
    else setDashboardView("add");
    const fetchAccessToken = async (code) => {
      const details = {
        client_id: "oac_KxaKzLl1KakFnclDJURDmQtI",
        client_secret: "9d72agydqs5x5YHX3wTNP8Iv",
        code: code,
        redirect_uri: "http://localhost:8000",
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

    if (router.isReady && !data.accessToken) {
      const { code } = router.query;
      fetchAccessToken(code);
    }
  }, [router]);

  useEffect(() => {
    const fetchVercelProjects = async (accessToken, teamId) => {
      if (accessToken) {
        const res = await fetch(
          `https://api.vercel.com/v8/projects${
            teamId ? `?teamId=${teamId}` : ""
          }`,
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          }
        );
        const json = await res.json();
        if (!json.error && json && !json.projects) setVercelProjects([]);
        else if (json && json.projects) setVercelProjects(json.projects);
        else if (json.error) {
          if (json.error.message) alert(json.error.message);
        }
      }
    };

    const { accessToken, teamId } = data;
    if (dashboardView === "deploy") setVercelProjects([]);
    if (data.accessToken && dashboardView !== "deploy") {
      fetchVercelProjects(accessToken, teamId);
    }
  }, [data]);

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
        } catch (err) {
          console.log(err);
        }
      }
    };

    const processAction = async () => {
      if (token) {
        if (false) fetchEditmodeProjects(token);
        else await handleInstall();
      }
      return;
    };
    processAction();
  }, [token]);

  useEffect(() => {
    let interval;
    if (hasCloned) {
      interval = setTimeout(() => reroute(), 10000);
    }
    return () => clearInterval(interval);
  }, [hasCloned]);

  const reroute = () => {
    setOpen(false);
    router.push(router.query.next);
  };

  return (
    <>
      {!view && <Blank setView={setView} user={token} setToken={setToken} token={token} />}
      {view === "auth" && <Auth setView={setView} setToken={setToken} />}
      {view === "dash" && (
        <Dashboard
          userEditmodeProjects={userEditmodeProjects}
          handleInstall={handleInstall}
          isFetchingEditmodeProjects={isFetchingEditmodeProjects}
          isInstalling={isInstalling}
          setProjectToInstall={setProjectToInstall}
          setView={setView}
          dashboardView={dashboardView}
          vercelProjects={vercelProjects}
          setVercelProjects={setVercelProjects}
        />
      )}
      {open && <Modal setOpen={setOpen} open={open} reroute={reroute} />}
    </>
  );
}
