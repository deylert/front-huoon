<template>
  <div class="onboarding-card rounded-lg">
    <h3 class="text-body-2 mb-4">¿Quieres crear un hogar o unirte a uno existente?</h3>

    <v-row class="mb-4">
      <v-col cols="12" md="6">
        <v-card
          class="mx-auto d-flex align-center rounded-lg"
          @click="$emit('create-home')"
        >
          <template v-slot:prepend>
            <v-icon size="48" color="primary" class="ml-1 mr-1">mdi-home-plus</v-icon>
          </template>

          <div class="flex-grow-1">
            <div class="text-body-2">Crear un nuevo hogar</div>
            <div class="text-caption text-wrap">
              Ideal si eres el primero en usar la app en tu casa.
            </div>
          </div>
        </v-card>
      </v-col>

      <v-col cols="12" md="6">
        <v-card
          class="mx-auto d-flex align-center rounded-lg"
          @click="$emit('join-home')"
        >
          <template v-slot:prepend>
            <v-icon size="48" color="primary" class="ml-1 mr-1">mdi-key</v-icon>
          </template>

          <div class="flex-grow-1">
            <div class="text-body-2">Unirme a un hogar existente</div>
            <div class="text-caption text-wrap">
              Si alguien ya creó tu hogar en la app, puedes unirte con un código.
            </div>
          </div>
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