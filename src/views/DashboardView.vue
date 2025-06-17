<template>
  <v-layout class="rounded rounded-md" style="height: 100%; flex-direction: row; ">
    <!--<NavigationDrawerView app style="flex-shrink: 0;"></NavigationDrawerView>background-color: #03626C;-->

    <v-main style="flex-grow: 1; overflow-y: auto;">
      <v-container class="pa-0" style="background-color: #fff; border-radius: 4px; min-width: 100%; min-height: 100%;">
        <AppBarView app style="flex-shrink: 0;"></AppBarView>
        <router-view />
      </v-container>
    </v-main>

     <!--<v-footer app style="background-color: #03626C;">
      
    </v-footer>-->
  </v-layout>
</template>

<script>
import AppBarView from '@/layouts/default/AppBar.vue';
//import NavigationDrawerView from './NavigationDrawerView.vue';

export default {
  components: {
    //NavigationDrawerView,
    AppBarView
  }
}
</script>

<style scoped>
/* Ajustes para el contenedor principal */
.v-main {
  overflow-y: auto; /* Asegura que el contenido sea desplazable */
  -webkit-overflow-scrolling: touch; /* Mejora el desplazamiento en dispositivos móviles */
}

/* Ajustes para el contenedor del contenido */
.v-container {
  padding: 16px; /* Añade un padding para evitar que el contenido toque los bordes */
  box-sizing: border-box; /* Asegura que el padding no afecte el ancho total */
}

/* Ajustes para dispositivos móviles */
@media (max-width: 768px) {
  .v-main {
    height: calc(100vh - 56px); /* Ajusta la altura para considerar la barra de navegación */
  }

  .v-container {
    min-width: 100%; /* Asegura que el contenedor ocupe todo el ancho disponible */
    border-radius: 0; /* Elimina el borde redondeado en móviles para mejor uso del espacio */
  }
}
</style>