import { computed } from 'vue';
import { useI18n } from 'vue-i18n';

export default function useCustomI18n() {
  const { locale } = useI18n();

  // Función para obtener el idioma inicial
  const getInitialLocale = () => {
    const savedLocale = localStorage.getItem('userLocale');
    const browserLang = navigator.language.split('-')[0];
    
    if (savedLocale && ['es', 'en', 'pt'].includes(savedLocale)) {
      return savedLocale;
    } else if (['es', 'en', 'pt'].includes(browserLang)) {
      return browserLang;
    } else {
      return 'es'; // Default español
    }
  };

  // Función para cambiar idioma
  const setLocale = (newLocale) => {
    if (['es', 'en', 'pt'].includes(newLocale)) {
      locale.value = newLocale;
      localStorage.setItem('userLocale', newLocale);
      document.documentElement.lang = newLocale;
    }
  };

  return {
    setLocale,
    currentLocale: computed(() => locale.value),
  };
}