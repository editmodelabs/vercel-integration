import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import Layout from "components/layout";
import { useCookie, isBrowser } from "utilities";
import Selection from "components/select";
import Nav from "components/navbar";

export default function CallbackPage() {
  const router = useRouter();
  const [value] = useCookie("em_user_key");
  const [data, setData] = useState({});
  const [project, setProject] = useState();
  const [vercelProject, setVercelProject] = useState();
  const [editmodeToken, setEditmodeToken] = useState();
  const [userEditmodeProjects, setUserEditmodeProjects] = useState([]);

  useEffect(() => {
    if (!value) {
      router.push("/authentication");
    } else setEditmodeToken(value);
  }, [router]);

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
        const url = `https://api.editmode.com/projects?api_key=${token}`;
        try {
          const res = await fetch(url, {
            method: "GET",
            headers: { "Content-Type": "application/json" },
          });
          const data = await res.json();
          setUserEditmodeProjects(data);
          return id;
        } catch (err) {
          console.log(err);
        }
      }
    };
    fetchEditmodeProjects(value);
  }, []);

  const handleProjectGeneration = async (e) => {
    e.preventDefault();
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
    let token;
    if (editmodeToken) token = editmodeToken;
    const edit_mode_project = await cloneProject(token);
    setProject(edit_mode_project);
  };

  useEffect(() => {
    const writeENV = async (accessToken, editmode_project_id) => {
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
            value: editmode_project_id,
            target: ["production", "preview"],
          }),
        }
      );
      const json = await res.json();
      if (json.value) router.push(router.query.next);
    };
    if (data.accessToken && project) {
      writeENV(data.accessToken, project);
    }
  }, [project]);

  if (!value) return null;

  return (
    <Layout>
      <div className="w-full max-w-2xl divide-y">
        {userEditmodeProjects[0] && (
          <Selection projects={userEditmodeProjects} setProject={setProject} />
        )}
        <section className="py-4">
          <button
            // className="bg-indigo hover:bg-gray-900 text-white px-6 py-1 rounded-md"
            className={`flex justify-center w-full mt-6 text-white font-medium py-3 leading-6 px-4 rounded-md hover:bg-indigo-400 transition duration-200 button bg-indigo-500`}
            onClick={handleProjectGeneration}
          >
            INSTALL
          </button>
        </section>
      </div>
    </Layout>
  );
}
