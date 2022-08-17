import { defineConfig } from 'vite';
export default defineConfig({
  build: {
    lib: {
        entry: './src/phaser.ts',
        fileName: 'phaser',
        formats: ['iife', 'es', 'umd'],
        name: 'Phaser',
    },
    sourcemap: true
  }
})
