/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: true,
    env: {
        NEXT_PUBLIC_ZEGO_APP_ID: 690196897,
        NEXT_PUBLIC_ZEGO_SERVER_ID: 'a8c6e7bae776d220cb9036189bdffab0',
    },
    images: {
        domains: ['localhost'],
    },
};

module.exports = nextConfig;
