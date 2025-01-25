import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    host: '0.0.0.0', // Allow access from Docker or external devices
    port: 5173, // Explicitly set the port
    strictPort: true, // Ensure the port remains 5173
  },
});
