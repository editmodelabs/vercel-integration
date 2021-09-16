import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import Dashboard from "components/dashboard";
import uuid from "react-uuid";

export default () => {
  const router = useRouter();
  const hasConfigId = router.asPath.includes("configurationId=icfg");
  const [vercelProjects, setVercelProjects] = useState();
  const [editmodeProjects, setEditmodeProjcts] = useState();
  const [token, setToken] = useState();
  const [userSlug, setUserSlug] = useState();
  const [connections, setConnections] = useState();
  const configId = hasConfigId ? router.query.configurationId : "";

  console.log(connections);
  if (vercelProjects) console.log(vercelProjects);

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
              edimode: {
                id: editmodeProject.identifier,
                name: editmodeProject.name,
              },
              vercel: {
                id: vercelProject.id,
                name: vercelProject.name,
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
      <p>okay</p>
    </div>
  );
};
