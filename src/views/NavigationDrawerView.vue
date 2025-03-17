<template>
  <v-card>
    <v-layout>
      <v-navigation-drawer permanent color="#03626C" class="pt-4" style="height: 100vh;">
        <template v-slot:prepend>
          <v-list-item color="#03626C" class="text-subtitle-1" lines="two" variant="flat"
            prepend-avatar="@/assets/logo-blanco.png" :style="{ backgroundColor: '#03626C' }">
            <template v-slot:title>
              <span style="font-size: 1.25rem; font-weight: bold; color: white;">
                huoon
              </span>
            </template>
          </v-list-item>
        </template>


        <v-list density="compact" nav class="mt-12">
          <v-list-item prepend-icon="mdi-view-dashboard-outline" title="Dashboard" to="home" value="home"
            class="list-item"></v-list-item>
          <v-list-item prepend-icon="mdi-creation" title="Deseos" to="desire" value="desire"
            class="list-item"></v-list-item>
          <v-list-item prepend-icon="mdi-finance" title="Finanzas" to="finance" value="finance"
            class="list-item"></v-list-item>
            <v-list-group value="Salud">
            <template v-slot:activator="{ props }">
              <v-list-item v-bind="props" prepend-icon="mdi-hospital-box-outline" title="Salud"></v-list-item>
            </template>


            <v-list-item v-for="([title, icon, to], i) in salud" :key="i" :title="title" :prepend-icon="icon"
              :value="title" :to="to" style="padding-left: 20px !important"></v-list-item>
          </v-list-group>
          <v-list-item prepend-icon="mdi-calendar-weekend-outline" title="Tareas" to="task" value="task"
            class="list-item"></v-list-item>
          <v-list-item prepend-icon="mdi-store-outline" title="Almacenes" to="personwarehouse" value="personwarehouse"
            class="list-item"></v-list-item>
          <v-list-item prepend-icon="mdi-package-variant" title="Productos" to="product" value="product"
            class="list-item"></v-list-item>
          <v-list-item prepend-icon="mdi-folder-star-outline" title="Archivos" to="file" value="file"
            class="list-item"></v-list-item>
          <v-list-item prepend-icon="mdi-chat" title="Chat" to="chat" value="chat" class="list-item"></v-list-item>
          <v-list-item prepend-icon="mdi-home" title="Hogar" to="homes" value="homes" class="list-item"></v-list-item>

          <v-list-group value="Mantenedores">
            <template v-slot:activator="{ props }">
              <v-list-item v-bind="props" prepend-icon="mdi-progress-wrench" title="Mantenedores"></v-list-item>
            </template>


            <v-list-item v-for="([title, icon, to], i) in mainteiners" :key="i" :title="title" :prepend-icon="icon"
              :value="title" :to="to" style="padding-left: 20px !important"></v-list-item>
          </v-list-group>
        </v-list>

        <!-- Espaciador -->
        <v-spacer></v-spacer>
        <template v-slot:append>

          <!-- Opciones en la parte inferior -->
          <v-list density="compact" nav>
            <v-list-item prepend-icon="mdi-cog-outline" title="Configuración" to="/settings" value="settings"
              class="list-item"></v-list-item>
            <v-list-item prepend-icon="mdi-earth" title="Idioma" to="/language" value="language"
              class="list-item"></v-list-item>
          </v-list>
        </template>
      </v-navigation-drawer>
      <v-main style="height: 100vh;"></v-main>
    </v-layout>
  </v-card>
</template>

<script>

export default {
  data: () => ({
    open: ['Users'],
    isMobile: false,
    mainteiners: [
      ['Categorías', 'mdi-text-box-outline', '/category'],
      ['Almacénes', 'mdi-warehouse', '/warehouse'],
      ['Prioridades', 'mdi-star-circle-outline', '/priority'],
      ['Roles', 'mdi-account-cog-outline', '/role'],
      ['Estados', 'mdi-check-circle-outline', '/status'],
      ['Tipos de Hogar', 'mdi-home-group', '/hometype'],
      ['Tipos de Salud', 'mdi-heart-pulse', '/type'],
    ],

    salud : [
      ['Historias Clínicas', 'mdi-clipboard-text-outline', '/history'],
      ['Consultas Médicas', 'mdi-stethoscope', '/consultation'],
      ['Exámenes Médicos', 'mdi-microscope', '/exam'],
      ['Emergencias Médicas', 'mdi-alert-circle-outline', '/emergency'],
    ]

  }),
  watch: {
    $vuetify: {
      // Detectar cambios en el tamaño de la pantalla
      breakpoint() {
        this.isMobile = this.$vuetify.breakpoint.xs || this.$vuetify.breakpoint.sm; // Detectar pantallas pequeñas
      },
    },
  },
}
</script>
<style>
.list-item {
  padding: 2px 4px !important;
  /* Reduce el padding vertical y horizontal */
}

.maintainer-item {
  padding-left: 10px !important;
  /* Indentación menor para subelementos */
}

.v-navigation-drawer {
  height: 100vh !important;
  /* Asegura que el drawer ocupe toda la altura de la pantalla */
}
</style>
