/** @type {import('tailwindcss').Config} */
export default {
	darkMode: ["class"],
	content: [
		"./index.html",
		"./src/**/*.{js,ts,jsx,tsx}", // <-- this includes all your components
	],
	theme: {
		extend: {
			borderRadius: {
				lg: 'var(--radius)',
				md: 'calc(var(--radius) - 2px)',
				sm: 'calc(var(--radius) - 4px)'
			},
			colors: {
				background: 'hsl(var(--background))',
				foreground: 'hsl(var(--foreground))',
				card: {
					DEFAULT: 'hsl(var(--card))',
					foreground: 'hsl(var(--card-foreground))'
				},
				popover: {
					DEFAULT: 'hsl(var(--popover))',
					foreground: 'hsl(var(--popover-foreground))'
				},
				primary: {
					DEFAULT: 'hsl(var(--primary))',
					foreground: 'hsl(var(--primary-foreground))',
					50: '250 250 250',
					100: 'hsl(180, 45%, 96.1%)',
					200: 'hsl(180, 45%, 89.8%)',
					300: 'hsl(180, 45%, 83.1%)',
					400: 'hsl(180, 45%, 63.9%)',
					500: 'hsl(180, 45%, 45.1%)',  // Primary-500
					600: 'hsl(180, 45%, 32.2%)',
					700: 'hsl(180, 45%, 25.1%)',
					800: 'hsl(180, 45%, 14.9%)',
					900: 'hsl(180, 45%, 9%)',
				},
				secondary: {
					DEFAULT: 'hsl(var(--secondary))',
					foreground: 'hsl(var(--secondary-foreground))'
				},
				muted: {
					DEFAULT: 'hsl(var(--muted))',
					foreground: 'hsl(var(--muted-foreground))'
				},
				accent: {
					DEFAULT: 'hsl(var(--accent))',
					foreground: 'hsl(var(--accent-foreground))'
				},
				destructive: {
					DEFAULT: 'hsl(var(--destructive))',
					foreground: 'hsl(var(--destructive-foreground))'
				},
				border: 'hsl(var(--border))',
				input: 'hsl(var(--input))',
				ring: 'hsl(var(--ring))',
				chart: {
					'1': 'hsl(var(--chart-1))',
					'2': 'hsl(var(--chart-2))',
					'3': 'hsl(var(--chart-3))',
					'4': 'hsl(var(--chart-4))',
					'5': 'hsl(var(--chart-5))'
				}
			},
			keyframes: {
				fadeInDown: {
					'0%': { opacity: '0', transform: 'translateY(-20px)' },
					'100%': { opacity: '1', transform: 'translateY(0)' },
				},
				float: {
					'0%, 100%': { transform: 'translateY(0)' },
					'50%': { transform: 'translateY(-10px)' },
				},
				pulse: {
					'0%': { boxShadow: '0 0 0 0 rgba(171, 139, 255, 0.4)' },
					'70%': { boxShadow: '0 0 0 10px rgba(171, 139, 255, 0)' },
					'100%': { boxShadow: '0 0 0 0 rgba(171, 139, 255, 0)' },
				},
				slideInLeft: {
					'0%': { opacity: '0', transform: 'translateX(-20px)' },
					'100%': { opacity: '1', transform: 'translateX(0)' },
				},
				slideInRight: {
					'0%': { opacity: '0', transform: 'translateX(20px)' },
					'100%': { opacity: '1', transform: 'translateX(0)' },
				},
				bounce: {
					'0%, 20%, 50%, 80%, 100%': { transform: 'translateY(0)' },
					'40%': { transform: 'translateY(-10px)' },
					'60%': { transform: 'translateY(-5px)' },
				},
				cardAppear: {
					'0%': { opacity: '0', transform: 'translateY(20px) scale(0.95)' },
					'100%': { opacity: '1', transform: 'translateY(0) scale(1)' },
				},
			},
			animation: {
				fadeInDown: 'fadeInDown 0.8s ease-out',
				float: 'float 3s ease-in-out infinite',
				pulse: 'pulse 2s infinite',
				slideInLeft: 'slideInLeft 0.5s ease-out',
				slideInRight: 'slideInRight 0.5s ease-out',
				bounce: 'bounce 2s infinite',
				cardAppear: 'cardAppear 0.5s ease-out forwards',
			},
		}
	},
	plugins: [
		require("tailwindcss-animate"), // ⬅️ Required for dropdown/menu animations
	],
}
