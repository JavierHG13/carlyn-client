
import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react-swc";
import { VitePWA } from "vite-plugin-pwa";

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "");
  
  const apiUrl = (env.VITE_API_URL || "http://localhost:4000").replace(/\/$/, "");

  const apiOriginPattern = new URL(apiUrl).origin.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

  return {
    plugins: [
      react(),

      VitePWA({
        registerType: "autoUpdate",

        manifest: {
          name: "Barbería Carlyn VIP",
          short_name: "Carlyn",
          description:
            "Sistema web de gestión de citas para Barbería Carlyn",
          theme_color: "#0A1F44",
          background_color: "#061431",
          display: "standalone",
          start_url: "/",
          icons: [
            {
              src: "/icons/icon-192.png",
              sizes: "192x192",
              type: "image/png",
            },
            {
              src: "/icons/icon-512.png",
              sizes: "512x512",
              type: "image/png",
            },
          ],
        },

        workbox: {
          // Precarga las rutas legales: estarán disponibles desde la primera
          // instalación, aun cuando la aplicación se abra sin conexión.
          additionalManifestEntries: [
            { url: "/politica-de-privacidad", revision: null },
            { url: "/terminos-y-condiciones", revision: null },
          ],

          globPatterns: [
            "**/*.{js,css,html,ico,png,svg,woff2}",
          ],

          cleanupOutdatedCaches: true,

          runtimeCaching: [
            {
              // Navegación y documentos HTML
              urlPattern: ({ request }) =>
                request.mode === "navigate",

              handler: "NetworkFirst",

              options: {
                cacheName: "paginas-html",
                networkTimeoutSeconds: 3,
                expiration: {
                  maxEntries: 20,
                  maxAgeSeconds: 24 * 60 * 60,
                },
              },
            },

            {
              // Catálogo público de servicios
              // Un RegExp se serializa dentro del Service Worker; una función
              // no puede cerrar sobre variables de esta configuración.
              urlPattern: new RegExp(
                `^${apiOriginPattern}/api/servicios/activos(?:\\?.*)?$`,
              ),

              handler: "NetworkFirst",

              options: {
                cacheName: "catalogo-servicios",
                networkTimeoutSeconds: 3,

                expiration: {
                  maxEntries: 1,
                  maxAgeSeconds: 5 * 60,
                },

                cacheableResponse: {
                  statuses: [200],
                },
              },
            },

            {
              // Imágenes alojadas en el mismo dominio
              urlPattern: ({ request, sameOrigin }) =>
                sameOrigin &&
                request.destination === "image",

              handler: "CacheFirst",

              options: {
                cacheName: "imagenes-carlyn",

                expiration: {
                  maxEntries: 100,
                  maxAgeSeconds: 30 * 24 * 60 * 60,
                },
              },
            },
          ],
        },
      }),
    ],
  };
});
