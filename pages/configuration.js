import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import Dashboard from "components/dashboard";
import uuid from "react-uuid";
import useAuth from "hooks/useAuth";
import Auth from "components/credentials";
import NoConfiguration from "components/noConfiguration";

const Configuration = () => {
  const router = useRouter();
  const { user, mutate } = useAuth();
  const [vercelProjects, setVercelProjects] = useState();
  const [editmodeProjects, setEditmodeProjcts] = useState();
  const [token, setToken] = useState();
  const [connections, setConnections] = useState();
  const [toDelete, setToDelete] = useState([]);
  const [showMessage, setShowMessage] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [config, setConfig] = useState("");
  const [view, setView] = useState("");
  const [noConfig, setNoConfig] = useState(false);

  const fetchEditmodeProjects = async (token) => {
    const url = `https://api.editmode.com/projects?api_key=${token}`;
    try {
      const res = await fetch(url, {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      });
      const data = await res.json();
      if (data) setEditmodeProjcts(data);
      else setEditmodeProjcts([]);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    let timer;
    if (showMessage) {
      timer = setTimeout(() => {
        setShowMessage(false);
      }, 2000);
    }
    return () => clearTimeout(timer);
  }, [showMessage]);

  const saveChanges = async (fields) => {
    if (!fields && !toDelete) {
      setIsSaving(false);
      setShowMessage(true);
    }
    const fieldsToUpdate = fields?.filter((field) => {
      setIsSaving(true);
      const existingConnection = connections.find(
        (connection) =>
          field.id === connection.id &&
          connection.vercel.id === field.vercel.id &&
          connection.editmode.id === field.editmode.id
      );
      if (existingConnection) return false;
      else return true;
    });
    const url = `https://editmode-vercel-configuration.herokuapp.com/api/projects/new?configurationId=${config}&session_token=${token}`;

    const reqObj = { connections: fieldsToUpdate, deletions: toDelete };
    try {
      const res = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(reqObj),
      });
      const data = await res.json();
      console.log(data);
      if (data) {
        setIsSaving(false);
        setShowMessage(true);
      }
      return data;
    } catch (err) {
      console.log(err);
    }
  };

  const constructInitialFields = (vercelProjects, editmodeProjects) => {
    let fields = [];
    vercelProjects.forEach((vercelProject) =>
      editmodeProjects.forEach((editmodeProject) => {
        if (editmodeProject.identifier === vercelProject.env?.value) {
          fields = [
            ...fields,
            {
              id: uuid(),
              isCurrentlyLinked: true,
              editmode: {
                id: editmodeProject.identifier,
                name: editmodeProject.name,
              },
              vercel: {
                id: vercelProject.id,
                name: vercelProject.name,
                envId: vercelProject.env.id,
              },
            },
          ];
        }
      })
    );
    return fields;
  };

  useEffect(() => {
    if (router.isReady) {
      if (!router?.asPath?.includes("?configurationId=")) {
        router?.push("https://vercel.com/integrations/editmode");
      }
    }
    const emToken = localStorage.getItem("concessio_pref_per");
    if (router.isReady && user === null) {
      setView("auth");
    } else if (router.isReady && user?.id) setView("dash");
    if (emToken && user) {
      setToken(emToken);
    }
  }, [user, router]);

  useEffect(() => {
    router.isReady && setConfig(router.query.configurationId);
    if (config && user && token) {
      const fetchAllProjects = () => {
        const fetchConfigProjects = async () => {
          const url = `https://editmode-vercel-configuration.herokuapp.com/api/projects?configurationId=${config}&session_token=${user.token}`;
          try {
            const res = await fetch(url, {
              method: "GET",
              headers: { "Content-Type": "application/json" },
            });
            const data = await res.json();
            if (data?.projects) setVercelProjects(data.projects);
            if (data?.errors?.includes("not")) setNoConfig(true);
            return data;
          } catch (err) {
            console.log(err);
          }
        };

        fetchConfigProjects();
        fetchEditmodeProjects(token);
      };
      fetchAllProjects();
    }
  }, [router, token, config, user]);

  useEffect(() => {
    if (editmodeProjects && vercelProjects) {
      const fields = constructInitialFields(vercelProjects, editmodeProjects);
      if (fields) setConnections(fields);
    }
  }, [editmodeProjects, vercelProjects]);

  return (
    <>
      {view === "auth" &&
        router?.asPath?.includes("?configurationId=") &&
        !noConfig && (
          <Auth
            setConfigView={setView}
            isConfiguration={true}
            setToken={setToken}
          />
        )}
      {view === "dash" &&
        !noConfig &&
        router?.asPath?.includes("?configurationId=") && (
          <Dashboard
            connections={connections}
            isConfiguration={true}
            editmodeProjects={editmodeProjects}
            vercelProjects={vercelProjects}
            dashboardView={null}
            saveChanges={saveChanges}
            toDelete={toDelete}
            setToDelete={setToDelete}
            showMessage={showMessage}
            isSaving={isSaving}
            setConfigView={setView}
            mutate={mutate}
          />
        )}
      {noConfig && <NoConfiguration />}
    </>
  );
};

export default Configuration;
