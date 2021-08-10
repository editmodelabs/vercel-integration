import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import Layout from "components/layout";
// import Loader from "components/loader";
import { getTimedCachedData } from "utilities";

export default function CallbackPage() {
  const router = useRouter();
  const [data, setData] = useState({});
  const [project, setProject] = useState();
  const [vercelProject, setVercelProject] = useState();

  const isBrowser = () => typeof window !== "undefined";
  if (isBrowser() && !localStorage.getItem("user_token")) {
    router.push("/authentication");
    return null;
  }

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
    if (isBrowser()) token = localStorage.getItem("user_token");
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

  return (
    <Layout>
      {isBrowser() && localStorage.getItem("user_token") && (
        <div className="w-full max-w-2xl divide-y">
          <section className="py-4 flex items-center space-x-2 justify-center">
            <h1 className="text-lg font-medium">
              Integration is installed on a
            </h1>

            {data.accessToken && (
              <div className="rounded-md bg-blue-500 text-white text-sm px-2.5 py-0.5">
                {data.userId && data.teamId ? "team" : "personal account"}
              </div>
            )}
          </section>

          <section className="py-4">
            <button
              className="bg-black hover:bg-gray-900 text-white px-6 py-1 rounded-md"
              onClick={handleProjectGeneration}
            >
              Create Project
            </button>
            <button
              className="bg-black hover:bg-gray-900 text-white px-6 py-1 rounded-md"
              // onClick={addProject}
            >
              Add
            </button>
          </section>

          <section className="py-4 flex justify-center">
            {/* This redirect should happen programmatically if you're done with everything on your side */}
            <button
              className="bg-black hover:bg-gray-900 text-white px-6 py-1 rounded-md"
              onClick={() => {
                router.push(router.query.next);
              }}
            >
              Redirect me back to Vercel
            </button>
          </section>
        </div>
      )}
    </Layout>
  );
}
