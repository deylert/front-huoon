<template>
  <v-layout class="rounded rounded-md" style="height: 100vh; flex-direction: row; background-color: #03626C;">   
     
    <!---<AppBarView app style="flex-shrink: 0;"></AppBarView>-->
    <NavigationDrawerView app style="flex-shrink: 0;"></NavigationDrawerView>
    <!-- Sizes your content based upon application components -->
 
    <v-main class="mt-1" style="flex-grow: 1; overflow-y: auto; ">
      <v-container style="background-color: #fff; border-radius: 4px; min-width: 98%; min-height: 100%;" class="mt-3">
        <AppBarView app style="flex-shrink: 0;"></AppBarView>
      <router-view />
    </v-container>
    </v-main>
  
    <v-footer app style="background-color: #03626C;">
      <!-- -->
    </v-footer>
  </v-layout>
  </template>

<script>

import BarMenu from '@/layouts/default/BarMenu.vue';
import AppBarView from '@/layouts/default/AppBar.vue';
import NavigationDrawerView from './NavigationDrawerView.vue';



export default {
components: {
  NavigationDrawerView,
  BarMenu,
  AppBarView   
},
}
</script>
<style scoped>
/* Ajuste para ocultar scroll en la vista principal si es necesario */
.v-main {
  scrollbar-width: thin;
}
</style>