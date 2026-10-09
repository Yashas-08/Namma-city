import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        civic: {
          primary: '#176B68',
          'primary-dark': '#125452',
          'primary-light': '#E8F3F1',
          'primary-hover': '#155e5b',
          bg: '#F7F9F8',
          surface: '#FFFFFF',
          text: '#172322',
          'text-muted': '#687674',
          border: '#DCE4E2',
          'border-light': '#E8EFEB',
          success: '#287A50',
          'success-light': '#EAF5EF',
          warning: '#A66A25',
          'warning-light': '#FDF5EC',
          error: '#C4473F',
          'error-light': '#FCEEED',
          info: '#356F8A',
          'info-light': '#EEF5F8',
        },
      },
      borderRadius: {
        sm: '8px',
        DEFAULT: '10px',
        md: '10px',
        lg: '12px',
        xl: '16px',
        '2xl': '20px',
      },
      boxShadow: {
        civic: '0 1px 3px rgba(15, 35, 32, 0.05)',
        'civic-elevated': '0 4px 12px rgba(15, 35, 32, 0.07)',
        'civic-card': '0 2px 6px rgba(15, 35, 32, 0.04)',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
      },
    },
  },
  plugins: [],
};

export default config;
