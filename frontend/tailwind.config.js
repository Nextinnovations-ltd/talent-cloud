/** @type {import('tailwindcss').Config} */
export default {
  darkMode: ["class"],
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      padding: {
        mobile: "20px",
      },
      flexBox: {
        center: "flex items-center justify-center",
      },
      margin: {
        mobile: "20px",
      },
      fontWeight: {
        thin: 100,
        light: 300,
        normal: 400,
        medium: 500,
        semibold: 600,
        bold: 700,
        extrabold: 800,
        black: 900,
      },
      fontSize: {
        xs: "10px",
        sm: "14px",
        base: "16px",
        lg: "18px",
        xl: "28px",
        error: "12px",
        otp: "20px",
        "2xl": "1.5rem",
        "3xl": "1.875rem",
        "4xl": "2.25rem",
        "5xl": "3rem",
        "6xl": "4rem",
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      colors: {
        error: "#fc5c65",
        border: "hsl(var(--border))",
        placeholder: {
          primary: "#CFD1D4",
        },
        text: {
          primary: "#05060F",
          secondary: "#FFFFFF",
          lightblue: "#0389FF",
          light: "#878B94",
          semilight: "#686C73",
          error: "#fc5c65",
          disabled: "#B9BABC",
          hoverskyblue: "#0261B5",
          hoverdark: "#37383F",
        },
        bg: {
          primary: "#0389FF",
          error: "#fc5c65",
          hr: "#CBD5E1",
          hrsecondary: "#878B94",
          disabled: "#F2F2F3",
          hoverblue: "#037DE8",
          activeblue: "#0261B5",
          hoverwhite: "#F8F8F8",
          activewhite: "#E8E8E8",
          toastSuccess: "#227A2C",
        },
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        chart: {
          1: "hsl(var(--chart-1))",
          2: "hsl(var(--chart-2))",
          3: "hsl(var(--chart-3))",
          4: "hsl(var(--chart-4))",
          5: "hsl(var(--chart-5))",
        },
        sidebar: {
          DEFAULT: "hsl(var(--sidebar-background))",
          foreground: "hsl(var(--sidebar-foreground))",
          primary: "hsl(var(--sidebar-primary))",
          "primary-foreground": "hsl(var(--sidebar-primary-foreground))",
          accent: "hsl(var(--sidebar-accent))",
          "accent-foreground": "hsl(var(--sidebar-accent-foreground))",
          border: "hsl(var(--sidebar-border))",
          ring: "hsl(var(--sidebar-ring))",
        },
      },
      keyframes: {
        shine: {
          "0%": { "background-position": "100%" },
          "100%": { "background-position": "-100%" },
        },
        "caret-blink": {
          "0%,70%,100%": {
            opacity: "1",
          },
          "20%,50%": {
            opacity: "0",
          },
        },
        popUpFade: {
          "0%": {
            opacity: 0,
            transform: "scale(0.75)",
          },
          "100%": {
            opacity: 1,
            transform: "scale(2)",
          },
        },
        fade: {
          "0%": {
            opacity: 0.8,
            transform: "scale(1)",
          },
          "30%": {
            opacity: 1,
            transform: "scale(1.05)",
          },
          "70%": {
            opacity: 1,
            transform: "scale(1)",
          },
          "100%": {
            opacity: 0.8,
            transform: "scale(1)",
          },
        },
        "accordion-down": {
          from: {
            height: "0",
          },
          to: {
            height: "var(--radix-accordion-content-height)",
          },
        },
        "accordion-up": {
          from: {
            height: "var(--radix-accordion-content-height)",
          },
          to: {
            height: "0",
          },
        },
        "star-movement-bottom": {
          "0%": { transform: "translate(0%, 0%)", opacity: "1" },
          "100%": { transform: "translate(-100%, 0%)", opacity: "0" },
        },
        "star-movement-top": {
          "0%": { transform: "translate(0%, 0%)", opacity: "1" },
          "100%": { transform: "translate(100%, 0%)", opacity: "0" },
        },
        "drop-bounce": {
          "0%": { transform: "translateY(-100%) scaleY(0.5)", opacity: "0" },
          "60%": { transform: "translateY(10%) scaleY(1.05)", opacity: "1" },
          "80%": { transform: "translateY(-4%) scaleY(0.98)" },
          "100%": { transform: "translateY(0) scaleY(1)" },
        },
        "close-bounce": {
          "0%": { transform: "translateY(0) scaleY(1)", opacity: "1" },
          "20%": { transform: "translateY(-10%) scaleY(0.95)" },
          "100%": { transform: "translateY(-100%) scaleY(0.5)", opacity: "0" },
        },
      },
      animation: {
        "caret-blink": "caret-blink 1.25s ease-out infinite",
        popUpFade: "popUpFade 0.3s ",
        fade: "fade 1s linear infinite ",
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        shine: "shine 5s linear infinite",
        "star-movement-bottom":
          "star-movement-bottom linear infinite alternate",
        "star-movement-top": "star-movement-top linear infinite alternate",
        "bouncy-drop": "drop-bounce 0.6s ease-out forwards",
        "bouncy-close": "close-bounce 0.5s ease-in forwards",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
};
