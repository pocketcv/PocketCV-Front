import { StateProvider } from "@/context/StateContext";
import reducer, { initialState } from "@/context/StateReducers";
import "@/styles/globals.css";
import Head from "next/head";
import { useEffect } from "react";
import { reducerCases } from "@/context/constants";
import { Poppins } from 'next/font/google';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const poppins = Poppins({ subsets: ['latin'], weight: ['400', '600', '700'] });

export default function App({ Component, pageProps }) {
  useEffect(() => {
    try {
      const userInfo = localStorage.getItem("userInfo");
      if (userInfo && userInfo !== "undefined" && userInfo !== "null") {
        const user = JSON.parse(userInfo);
        if (user && typeof user === 'object') {
          initialState.userInfo = user;
        } else {
          localStorage.removeItem('userInfo'); // Remove invalid data
        }
      }
    } catch (error) {
      console.error('Error loading user info:', error);
      localStorage.removeItem('userInfo'); // Clear invalid data
    }
  }, []);

  return (
    <StateProvider initialState={initialState} reducer={reducer}>
      <Head>
        <title>PocketCV Chat</title>
        <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
        <link rel="apple-touch-icon" href="/favicon.svg" />
        <meta name="theme-color" content="#1a73e8" />
      </Head>
      <main className={poppins.className}>
        <Component {...pageProps} />
        <ToastContainer
          position="top-right"
          autoClose={3000}
          hideProgressBar={false}
          newestOnTop
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="light"
        />
      </main>
    </StateProvider>
  );
}
