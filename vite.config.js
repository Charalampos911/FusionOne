import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'; // <-- ADD THIS IMPORT
export default defineConfig(({ command }) =>{
  // Build configuration

  
  // base: '/FusionOne/', //Server

  
  return {


  // base: command === 'serve' ? '/' : '/FusionOne/', //Local - server 

  base: '/', //Clouflare

  build: {
    sourcemap: true,
    minify: 'esbuild',
    cssCodeSplit: true,
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom', '@vitejs/plugin-react']
        }
      },
      external: ["fsevents"]
    }
  },
  // Development server configuration
  server: {   
    watch: {
      usePolling: true,
    },
    hmr: true,
    cors: true,
    open: true,
    proxy: {
      '/api': {
        target: 'http://localhost:3000',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, '')
      }
    },
    port: 5173, //Viva
    host: true, //Viva
    allowedHosts: ['fusionone.com']  //Viva
  },  //C:\\Windows\\System32\\drivers\\etc\\hosts



  // CSS configuration
  css: {
    devSourcemap: true,
    modules: {
      generateScopedName: '[local]_[hash:base64:5]',
      hashPrefix: 'prefix'
    },
    preprocessorOptions: {
      scss: {
        additionalData: `$injectedColor: orange;`,
      includePaths: [path.resolve(__dirname, 'src/Styling')],
      }
    }
  },

  // Path aliases for cleaner imports
  resolve: {
    alias: {
      '@': '/src',
      components: '/src/components',
      assets: '/src/assets',
      lib: '/src/lib',
      hooks: '/src/hooks',
      utils: '/src/utils'
    }
  },

  // Environment variables
  define: {
    __APP_VERSION__: JSON.stringify(process.env.npm_package_version),
    __BUILD_TIME__: JSON.stringify(new Date().toISOString())
  },

  // Plugins
  plugins: [react()]
}})