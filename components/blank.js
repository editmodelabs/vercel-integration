export default function Blank({ value, setAuthenticated }) {
  if (value) setAuthenticated("dash");
  else setAuthenticated("auth");
  return <></>;
}
