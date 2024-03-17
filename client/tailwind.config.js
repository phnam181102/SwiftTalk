/** @type {import('tailwindcss').Config} */
module.exports = {
    content: ['./src/**/*.{js,jsx,ts,tsx}'],
    theme: {
        extend: {
            colors: {
                dark: '#202022',
                primary: '#7678ed',
                secondary: '#ff7a55',
                light: '#f9fafc',
            },
            gridTemplateColumns: {
                main: '1fr 2.4fr',
            },
        },
    },
    plugins: [],
};
