/** @type {import('tailwindcss').Config} */
module.exports = {
    content: ['./src/**/*.{js,jsx,ts,tsx}'],
    theme: {
        extend: {
            colors: {
                dark: '#202022',
                gray: '#7c7a7a',
                'primary-300': '#7678ed',
                'primary-200': '#dbdcff',
                'primary-100': '#eeeef8',
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
