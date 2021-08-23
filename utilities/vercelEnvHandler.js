export const checkVercelEnv = async (
  accessToken,
  currentProjectId,
  key,
  teamId
) => {
  const res = await fetch(
    `https://api.vercel.com/v8/projects/${currentProjectId}/env${
      teamId ? `?teamId=${teamId}` : ""
    }`,
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
    }
  );
  const json = await res.json();
  let existing_env;
  if (!json || !json.envs) return "";
  else {
    const env_variables = json.envs;
    existing_env = env_variables.find((env_variable) => {
      env_variable.key === key;
    });
  }
  existing_env ? existing_env.id : "";
};

export const updateVercelEnv = async (
  accessToken,
  currentProjectId,
  envId,
  em_project_to_use,
  teamId
) => {
  const res = await fetch(
    `https://api.vercel.com/v8/projects/${currentProjectId}/env/${envId}${
      teamId ? `?teamId=${teamId}` : ""
    }`,
    {
      method: "PATCH",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        value: em_project_to_use,
      }),
    }
  );
  if (json) alert("YESSSSSS");
  const json = await res.json();
  return json;
};
