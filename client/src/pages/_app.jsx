import ToasterContext from "@/context/ToasterContext";
import { Providers } from "@/Provider";
import "@/styles/globals.css";

export default function App({ Component, pageProps }) {
  return (
    <Providers>
      <ToasterContext />
      <Component {...pageProps} />
    </Providers>
  );
}
