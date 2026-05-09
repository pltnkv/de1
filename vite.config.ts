import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// Repo is published at https://pltnkv.github.io/de1/, so production assets
// must resolve under `/de1/`. Dev server stays at `/` so `npm run dev` works
// unchanged.
export default defineConfig(({ command }) => ({
  plugins: [react()],
  base: command === 'build' ? '/de1/' : '/',
}))
