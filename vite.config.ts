import { tanstackStart } from '@tanstack/react-start/plugin/vite'
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tsConfigPaths from 'vite-tsconfig-paths'

export default defineConfig({
  server: {
    port: 3000,
  },
  css: {
    // Ensure PostCSS does not try to emit sourcemaps
    postcss: {
      map: { inline: false, annotation: false },
    },
  },
  build: {
    // Enable sourcemaps so CSS transforms can chain maps correctly
    sourcemap: true,
    rollupOptions: {
      onwarn(warning, defaultHandler) {
        // Silence unused external imports coming from TanStack/H3 bundles
        if (
          warning.code === 'UNUSED_EXTERNAL_IMPORT' &&
          typeof (warning as any).message === 'string' &&
          ((warning as any).message.includes('@tanstack/router-core/ssr/server') ||
            (warning as any).message.includes('@tanstack/router-core/ssr/client') ||
            (warning as any).message.includes('h3'))
        ) {
          return
        }
        defaultHandler(warning)
      },
    },
  },
  plugins: [
    tsConfigPaths({
      projects: ['./tsconfig.json'],
    }),
    tanstackStart({
      target: 'node-server',
      customViteReactPlugin: true,
    }),
    react(),
  ],
})
