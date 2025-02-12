// useDrawerStore.js
import { ref } from "vue";

export const useDrawerStore = () => {
  const drawer = ref(false);

  const toggleDrawer = () => {
    drawer.value = !drawer.value;
    console.log("Drawer state:", drawer.value); // Debug
  };

  return { drawer, toggleDrawer };
};
