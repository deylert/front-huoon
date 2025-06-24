/**
 * main.js
 *
 * Bootstraps Vuetify and other plugins then mounts the App`
 */

// Components
import App from "./App.vue";
import { createVuetify } from 'vuetify';
import { createI18n } from "vue-i18n";
import { en, es, pt } from 'vuetify/locale'
// Composables
import { createApp } from "vue";
import snotify from "vue3-snotify";
import "vue3-snotify/style";
import axios from './axios'; // Importa la instancia configurada
import LocalStorageService from "@/LocalStorageService";



// Plugins
import { registerPlugins } from "@/plugins";
import spanish from "./langs/spanish";
import english from "./langs/english";
import portuguese from "./langs/portuguese";
// Función para obtener el locale inicial
const getInitialLocale = () => {
  let savedLocale = LocalStorageService.getItem('userLocale');
  const browserLang = navigator.language.split('-')[0];

  if (savedLocale) {
    savedLocale = savedLocale.toString().trim().replace(/^"(.*)"$/, '$1');
  }
  
  if (savedLocale && ['es', 'en', 'pt'].includes(savedLocale)) {
    return savedLocale;
  } else if (['es', 'en', 'pt'].includes(browserLang)) {
    return browserLang;
  } else {
    return 'es'; // Default español
  }
};

const userLocale = getInitialLocale();

// Configura i18n con el idioma inicial dinámico
const i18n = createI18n({
  legacy: false,
  locale: userLocale,
  fallbackLocale: "es",
  messages: {
    es: spanish.messages,
    en: english.messages,
    pt: portuguese.messages,
  },
});

const vuetify = createVuetify({
  locale: {
    locale: userLocale, // Sincronizado con i18n
    fallback: 'es',
    messages: { en, es, pt }, // Importa los locales de Vuetify
  },
});
const app = createApp(App);

// Agregar axios a la instancia global de Vue
app.config.globalProperties.$axios = axios;

app.use(snotify);

registerPlugins(app);
app.use(vuetify)  // Usa la instancia de Vuetify
app.use(i18n);
app.mount("#app");
