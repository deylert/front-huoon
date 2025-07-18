<template>
  <div class="onboarding-card">
    <h3 class="text-h6 mb-4">¿Quieres crear un hogar o unirte a uno existente?</h3>
    
    <v-row class="mb-4">
      <v-col cols="12" md="6">
        <v-card 
          class="onboarding-option pa-4"
          @click="$emit('create-home')"
        >
          <v-icon size="48" color="primary" class="mb-2">mdi-home-plus</v-icon>
          <h4 class="text-h6 mb-2">Crear un nuevo hogar</h4>
          <p class="text-caption">
            Ideal si eres el primero en usar la app en tu casa.
          </p>
        </v-card>
      </v-col>
      
      <v-col cols="12" md="6">
        <v-card 
          class="onboarding-option pa-4"
          @click="$emit('join-home')"
        >
          <v-icon size="48" color="primary" class="mb-2">mdi-key</v-icon>
          <h4 class="text-h6 mb-2">Unirme a un hogar existente</h4>
          <p class="text-caption">
            Si alguien ya creó tu hogar en la app, puedes unirte con un código.
          </p>
        </v-card>
      </v-col>
    </v-row>
  </div>
</template>

<script>
export default {
  emits: ['create-home', 'join-home']
};
</script>