const {nextui} = require("@nextui-org/react");
/** @type {import('tailwindcss').Config} */
export default {
	content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}',
		"./node_modules/@nextui-org/theme/dist/**/*.{js,ts,jsx,tsx}"
	],
	theme: {
		extend: {
			container: {
				center: true,
				padding: '1rem',
			},

			fontFamily: {
				montserrat: ['Montserrat', 'sans-serif'],
			  },
			  animation: {
				'pulse-spin': 'pulse 1s infinite, spin 1s linear infinite',
			  },
			  keyframes: {
				pulse: {
				  '0%, 100%': { opacity: '1' },
				  '50%': { opacity: '0.5' },
				},
				spin: {
				  '0%': { transform: 'rotate(0deg)' },
				  '100%': { transform: 'rotate(360deg)' },
				},
			  },
			},
		  },
		  darkMode: "class",
  		  plugins: [nextui()],
		};
