import { StateProvider } from "@/context/StateContext";
import reducer, { initialState } from "@/context/StateReducers";
import "@/styles/globals.css";
import Head from "next/head";
import { useEffect } from "react";
import { reducerCases } from "@/context/constants";
import { Poppins } from 'next/font/google';

const poppins = Poppins({ subsets: ['latin'], weight: ['400', '600', '700'] });

export default function App({ Component, pageProps }) {
  useEffect(() => {
    // Load user info from localStorage on app start
    const userInfo = localStorage.getItem("userInfo");
    if (userInfo) {
      const user = JSON.parse(userInfo);
      initialState.userInfo = user;
    }
  }, []);

  return (
    <StateProvider initialState={initialState} reducer={reducer}>
      <Head>
        <title>PocketCV Chat</title>
        <link rel="shortcut icon" href="/favicon.png" />
      </Head>
      <main className={poppins.className}>
        <Component {...pageProps} />
      </main>
    </StateProvider>
  );
}
