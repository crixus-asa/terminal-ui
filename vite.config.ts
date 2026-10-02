import tailwindcss from "@tailwindcss/vite"
import react from "@vitejs/plugin-react-swc"
import { resolve } from "node:path"
import { fileURLToPath } from "node:url"
import { defineConfig } from "vite"

const packageRoot = fileURLToPath(new URL(".", import.meta.url))

const externalPackages = [
  /^react(?:\/.*)?$/,
  /^react-dom(?:\/.*)?$/,
  /^@radix-ui\//,
  /^@phosphor-icons\//,
  /^class-variance-authority$/,
  /^clsx$/,
  /^lucide-react(?:\/.*)?$/,
  /^react-hook-form$/,
  /^sonner$/,
  /^tailwind-merge$/,
]

export default defineConfig({
  root: packageRoot,
  plugins: [react(), tailwindcss()],
  build: {
    emptyOutDir: true,
    cssCodeSplit: true,
    lib: {
      entry: {
        index: resolve(packageRoot, "src/index.ts"),
        "terminal-ui": resolve(packageRoot, "src/styles.ts"),
      },
      formats: ["es"],
      fileName: (_format, entryName) => entryName,
      cssFileName: "terminal-ui",
    },
    rollupOptions: {
      external: (id) => externalPackages.some((pattern) => pattern.test(id)),
      output: {
        preserveModules: true,
        preserveModulesRoot: resolve(packageRoot, "src"),
        entryFileNames: "[name].js",
      },
    },
  },
})
