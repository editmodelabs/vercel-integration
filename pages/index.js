import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import Layout from "components/layout";
import Loader from "components/loader";

export default function CallbackPage() {
  const router = useRouter();
  const [data, setData] = useState({});
  const [project, setProject] = useState();
  const [vercelProject, setVercelProject] = useState();

  useEffect(() => {
    const fetchAccessToken = async (code) => {
      const res = await fetch(`/api/get-access-token?code=${code}`);
      const json = await res.json();
      if (json) alert("!!!");

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

  const isBrowser = () => typeof window !== "undefined";

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

  const addProject = () => {
    const writeENV = async (accessToken, editmode_project_id) => {
      const res = await fetch(
        `https://api.vercel.com/v8/projects/${vercelProject}/env?type=plain&key=NEXT_PUBLIC_PROJECT_ID&value=${editmode_project_id}&target=production`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );
      const json = await res.json();
      if (json) router.push(router.query.next);
    };
    return writeENV(data.accessToken, project);
    // const { accessToken } = data;
  };

  // useEffect(() => {
  //   const writeENV = async (accessToken, editmode_project_id) => {
  //     const res = await fetch(
  //       `https://api.vercel.com/v8/projects/${vercelProject}/env?type=plain&key=NEXT_PUBLIC_PROJECT_ID&value=${editmode_project_id}&target=production`,
  //       {
  //         method: "POST",
  //         headers: {
  //           Authorization: `Bearer ${accessToken}`,
  //         },
  //       }
  //     );
  //     const json = await res.json();
  //     router.push(router.query.next);
  //   };
  //   const { accessToken } = data;
  //   if (accessToken && project) writeENV();
  // }, [project]);

  return (
    <Layout>
      <div className="w-full max-w-2xl divide-y">
        <section className="py-4 flex items-center space-x-2 justify-center">
          <h1 className="text-lg font-medium">Integration is installed on a</h1>

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
            onClick={addProject}
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
    </Layout>
  );
}
