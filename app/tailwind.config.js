/** @type {import('tailwindcss').Config} */
const plugin = require("tailwindcss/plugin");

export default {
	content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
	theme: {
		fontFamily: {
			smooch: ["Smooch", "cursive"],
			kanit: ["Kanit", "sans-serif"],
		},
		extend: {
			boxShadow: {
				card: "rgba(0, 0, 0, 0.3) 0px 19px 38px, rgba(0, 0, 0, 0.22) 0px 15px 12px;",
			},
		},
	},
	plugins: [
		plugin(({ addUtilities }) => {
			addUtilities({
				".backface-visible": {
					"backface-visibility": "visible",
				},
				".backface-hidden": {
					"backface-visibility": "hidden",
				},
			});
		}),
	],
};
