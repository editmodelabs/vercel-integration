export default function Blank({ user, setView }) {
  if (user) setView("dash");
  else setView("auth");
  return <></>;
}
