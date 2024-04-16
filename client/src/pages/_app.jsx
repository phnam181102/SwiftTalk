import ToasterContext from '@/context/ToasterContext';
import { Providers } from '@/Provider';
import { SessionProvider } from 'next-auth/react';
import '@/styles/globals.css';

export default function App({ Component, pageProps: { session, ...pageProps } }) {
    return (
        <Providers>
            <SessionProvider>
                <ToasterContext />
                <Component {...pageProps} />
            </SessionProvider>
        </Providers>
    );
}
