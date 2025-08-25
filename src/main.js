/**
 * main.js
 *
 * Bootstraps Vuetify and other plugins then mounts the App
 */

// Components
import App from "./App.vue";
<<<<<<< Updated upstream
// Composables
=======
import vuetify from './plugins/vuetify'  // ✅ Usa la instancia ya configurada

import { createI18n } from "vue-i18n";
>>>>>>> Stashed changes
import { createApp } from "vue";
import snotify from "vue3-snotify";
import "vue3-snotify/style";
import axios from './axios' // Importa la instancia configurada

// Plugins
import { registerPlugins } from "@/plugins";
<<<<<<< Updated upstream

=======
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

>>>>>>> Stashed changes
const app = createApp(App);

// Agregar axios a la instancia global de Vue
app.config.globalProperties.$axios = axios;

// Configuración de plugins
app.use(snotify);
registerPlugins(app);
<<<<<<< Updated upstream
=======
app.use(vuetify);  // ✅ Usa la instancia desde plugins/vuetify.js
app.use(i18n);
>>>>>>> Stashed changes

app.mount("#app");
