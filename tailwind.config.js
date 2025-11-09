/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{vue,js,ts,jsx,tsx}"],
  theme: {
    extend: {
      // Tokens de Color
      colors: {
        'background-primary': '#0E0E0E', // Charcoal Black
        'accent-primary': '#C7A64F',     // Matte Gold (Renombrado desde 'primary')
        'text-primary': '#FFFFFF',         // White
        'text-secondary': '#5A5A5A',      // Steel Gray
        'feedback-positive': '#C7A64F',    // Matte Gold
        'feedback-negative': '#B94E4E',    // Faint Red
      },
      // Tokens de Tipografía
      fontSize: {
        'display': ['clamp(48px, 10vw, 72px)', { lineHeight: '1' }],     // 48px - 72px
        'heading-lg': ['32px', { lineHeight: '1.2' }], // 32px
        'heading-md': ['24px', { lineHeight: '1.3' }], // 24px
        'body-lg': ['18px', { lineHeight: '1.5' }],    // 18px
        'body-md': ['16px', { lineHeight: '1.6' }],    // 16px (Default body)
        'caption': ['14px', { lineHeight: '1.4' }],   // 14px
      },
      fontFamily: {
        sans: ["Montserrat", "sans-serif"], // Ya estaba configurado correctamente
      },
      // Tokens de Espaciado (se añaden al sistema de espaciado por defecto)
      spacing: {
        'xs': '4px',
        'sm': '8px',
        'md': '16px',
        'lg': '24px',
        'xl': '32px',
        'xxl': '48px',
      },
      // Tokens de Componentes y Efectos
      borderRadius: {
        'button': '12px', // Usamos el valor más grande para un look más suave
        'card': '16px',
      },
      borderWidth: {
        'card': '2px',
      },
      boxShadow: {
        'button-glow': '0 0 15px rgba(199, 166, 79, 0.4)',
      },
      // Tokens de Movimiento y Animación
      transitionDuration: {
        'slow': '500ms',
      },
      transitionTimingFunction: {
        'standard': 'ease-in-out',
      },
    },
  },
  plugins: [],
};
