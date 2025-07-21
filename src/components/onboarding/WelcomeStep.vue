<template>
  <div class="ww-100 rounded-lg onboarding-card">
    <h3 class="text-body-2 mb-2">¡Bienvenido a nuestra App!</h3>
    <p class="mb-4 text-caption">
      Esta app te ayuda a gestionar tu hogar de forma sencilla.
      Antes de comenzar, necesitamos saber a qué hogar perteneces.
    </p>
    <v-btn 
     variant="tonal" 
                class="text-deep-purple-accent-3"
      @click="handleNextStep"
    >
      Comenzar
    </v-btn>
  </div>
</template>

<script>
export default {
  emits: ['next-step'], // Declara explícitamente el evento
  methods: {
    handleNextStep() {
      this.$emit('next-step'); // Emite el evento claramente
    }
  }
};
</script>

<style scoped>
:deep(.onboarding-card) {
  width: 100%;
  max-width: 100%;
  background-color: #f5f5f5;
}
</style>