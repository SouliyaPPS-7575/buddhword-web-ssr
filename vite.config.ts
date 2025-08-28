import { tanstackStart } from '@tanstack/react-start/plugin/vite'
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tsConfigPaths from 'vite-tsconfig-paths'

export default defineConfig({
  // Reduce noise by hiding warnings during build
  logLevel: 'error',
  server: {
    port: 3000,
  },
  css: {
    // Ensure PostCSS does not try to emit sourcemaps
    postcss: {
      map: false,
    },
  },
  build: {
    // Disable sourcemaps in prod to avoid css-post sourcemap noise
    sourcemap: false,
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
        // Silence sourcemap warning from vite:css-post
        if (
          warning.code === 'PLUGIN_WARNING' &&
          (warning as any).plugin === 'vite:css-post'
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
