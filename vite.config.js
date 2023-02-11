import { defineConfig } from 'vite';
export default defineConfig({
  resolve: {
    alias: {
      '@thaser': './src/',
      '@utils': './src/utils/'
    }
  },
  build: {
    lib: {
      entry: './src/phaser.ts',
      fileName: 'phaser',
      formats: ['iife', 'es', 'umd'],
      name: 'Phaser'
    },
    sourcemap: true
  }
});
