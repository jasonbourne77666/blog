const config = {
  plugins: ["@tailwindcss/postcss"],
  autoprefixer: {
    flexbox: "no-2009",
  },
  cssnano: {
    preset: "default",
  },
};

export default config;
