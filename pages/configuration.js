import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import Dashboard from "components/dashboard";
import uuid from "react-uuid";

const Configuration = () => {
  const router = useRouter();
  const hasConfigId = router.asPath.includes("configurationId=icfg");
  const [vercelProjects, setVercelProjects] = useState();
  const [editmodeProjects, setEditmodeProjcts] = useState();
  const [token, setToken] = useState();
  const [userSlug, setUserSlug] = useState();
  const [connections, setConnections] = useState();
  const [isInstalling, setIsInstalling] = useState(false);
  const [toDelete, setToDelete] = useState();
  const configId = hasConfigId ? router.query.configurationId : "";
  console.log(configId);

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

  const saveChanges = async (fields) => {
    const fieldsToUpdate = fields?.filter((field) => {
      const existingConnection = connections.find(
        (connection) =>
          field.id === connection.id &&
          connection.vercel.id === field.vercel.id &&
          connection.editmode.id === field.editmode.id
      );
      if (existingConnection) return false;
      else return true;
    });
    const url = `http://localhost:5000/api/projects/new?configurationId=${configId}&userSlug=${userSlug}`;
    console.log(url);

    const reqObj = { connections: fieldsToUpdate };
    console.log(JSON.stringify(reqObj));
    // try {
    //   const res = await fetch(url, {
    //     method: "POST",
    //     headers: { "Content-Type": "application/json" },
    //     body: JSON.stringify(reqObj),
    //   });
    //   const data = await res.json();
    //   if (data?.projects) setVercelProjects(data.projects);
    //   return data;
    // } catch (err) {
    //   console.log(err);
    // }
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
    const emToken = localStorage.getItem("concessio_pref_per");
    const user = localStorage.getItem("em_vercel_config_session_slug");
    if (emToken && user) {
      setToken(emToken);
      setUserSlug(user);
    }
  }, []);

  useEffect(() => {
    if ((configId, userSlug, token)) {
      const fetchAllProjects = () => {
        const fetchConfigProjects = async () => {
          const user_slug = localStorage.getItem(
            "em_vercel_config_session_slug"
          );
          const url = `http://localhost:5000/api/projects?configurationId=${configId}&userSlug=${user_slug}`;

          try {
            const res = await fetch(url, {
              method: "GET",
              headers: { "Content-Type": "application/json" },
            });
            const data = await res.json();
            if (data?.projects) setVercelProjects(data.projects);
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
  }, [router, token, userSlug]);

  useEffect(() => {
    if (editmodeProjects && vercelProjects) {
      const fields = constructInitialFields(vercelProjects, editmodeProjects);
      if (fields) setConnections(fields);
    }
  }, [editmodeProjects, vercelProjects]);

  return (
    <div>
      {connections && (
        <Dashboard
          connections={connections}
          isConfiguration={true}
          isInstalling={isInstalling}
          editmodeProjects={editmodeProjects}
          vercelProjects={vercelProjects}
          dashboardView={null}
          saveChanges={saveChanges}
        />
      )}
    </div>
  );
};

export default Configuration;
