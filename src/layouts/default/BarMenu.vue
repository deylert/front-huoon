<template>
    <v-card class="pa-4" max-width="500">
      <!-- Header del Card -->
      <v-card-title class="d-flex justify-space-between align-center">
        <!-- Avatar con menú -->
        <v-menu activator="parent" offset-y>
          <template v-slot:activator="{ props }">
            <v-avatar v-bind="props" class="cursor-pointer">
              <v-img src="https://via.placeholder.com/40" alt="Avatar" />
            </v-avatar>
          </template>
          <v-list>
            <v-list-item title="Perfil" />
            <v-list-item title="Configuración" />
            <v-list-item title="Cerrar sesión" />
          </v-list>
        </v-menu>
  
        <!-- Campanita de notificaciones -->
      c
      </v-card-title>
  
      <!-- Campo de búsqueda -->
      <v-card-text>
        <div class="d-flex align-center">
          <!-- Ícono de búsqueda -->
          <v-btn icon @click="toggleSearch">
            <v-icon>mdi-magnify</v-icon>
          </v-btn>
  
          <!-- Campo de búsqueda -->
          <v-text-field
            v-if="showSearch"
            v-model="searchQuery"
            class="ml-2"
            placeholder="Buscar..."
            hide-details
            dense
            solo
          />
        </div>
      </v-card-text>
    </v-card>
  </template>
  
  <script>
  export default {
    data() {
      return {
        searchQuery: "",
        showSearch: false,
      };
    },
    methods: {
      toggleSearch() {
        this.showSearch = true;
        this.$nextTick(() => {
          const input = this.$refs.searchInput;
          if (input) {
            input.focus();
          }
        });
      },
    },
  };
  </script>
  
  <style scoped>
  .cursor-pointer {
    cursor: pointer;
  }
  </style>
  