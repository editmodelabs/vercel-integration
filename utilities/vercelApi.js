const vercelEnvReq = async (
  accessToken,
  em_project_to_use,
  currentProjectId
) => {
  const res = await fetch(
    `https://api.vercel.com/v8/projects/${currentProjectId}/env${
      data.teamId ? `?teamId=${data.teamId}` : ""
    }`,
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
  return json;
};

export const writeSingleEnv = async (accessToken, em_project_to_use) => {
  const { currentProjectId } = router.query;
  const json = await vercelEnvReq(
    accessToken,
    em_project_to_use,
    currentProjectId
  );
  setIsInstalling(false);
  if (json.value) {
    setHasCloned(true);
    setOpen(true);
  }
  if (json.error) {
    setIsInstalling(false);
    if (json.error.message) alert(json.error.message);
  }
};
