module.exports = {
  content: [
    "./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}",
    "./src/components/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}",
    "./src/pages/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}",
    "./src/layouts/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}"
  ],
  theme: {
    extend: {
      colors: {
        musical: {
          primary: '#4FC3F7',     // Sky Blue
          secondary: '#FFEB3B',   // Sun Yellow
          purple: '#BA68C8',      // Melodic Purple
          coral: '#FF8A65',       // Coral Pink
          cream: '#FFF8E1',       // Light Cream (Background)
          graphite: '#333333',    // Graphite Gray (Dark Text)
          white: '#FFFFFF',       // White (Light Text)
          success: '#81C784',     // Mint Green (Progress)
          error: '#E57373',       // Cherry Red (Error/Stop)
        }
      }
    }
  }
} 