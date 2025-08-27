/**
 * plugins/index.js
 *
 * Automatically included in `./src/main.js`
 */

// Plugins
import { loadFonts } from './webfontloader'
import pinia from '../store'
import router from '../router'

export function registerPlugins (app) {
  loadFonts()
  app
    .use(router)
    .use(pinia)
}
