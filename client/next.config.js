/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: true,
    env: {
        NEXT_PUBLIC_ZEGO_APP_ID: '773934684',
        NEXT_PUBLIC_ZEGO_SERVER_ID: '1a756dc6e6633a225079fe9d338807d7',
    },
    images: {
        domains: ['localhost'],
    },
};

module.exports = nextConfig;
