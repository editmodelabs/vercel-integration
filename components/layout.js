import Head from "next/head";
import NavBar from "./navbar";

export default function Layout(props) {
  return (
    <div className="flex flex-col max-h-screen">
      <Head>
        <title>Editmode Vercel Integration</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <NavBar
        isConfiguration={props.isConfiguration}
        setConfigView={props.setConfigView}
        mutate={props.mutate}
      />
      <div className="flex-1 flex items-center justify-center mb-64 p-8">
        {props.children}
      </div>
    </div>
  );
}
