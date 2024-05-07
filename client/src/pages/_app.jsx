import ToasterContext from '@/context/ToasterContext';
import { Providers } from '@/Provider';
import '@/styles/globals.css';
import { SessionProvider } from 'next-auth/react';

export default function App({ Component, pageProps }) {
    return (
        <Providers>
            <SessionProvider>
                <ToasterContext />
                <Component {...pageProps} />
            </SessionProvider>
        </Providers>
    );
}
