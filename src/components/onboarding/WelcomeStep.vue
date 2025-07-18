<template>
  <div class="onboarding-card">
    <h3 class="text-h6 mb-4">¡Bienvenido a nuestra App!</h3>
    <p class="mb-4">
      Esta app te ayuda a gestionar tu hogar de forma sencilla.
      Antes de comenzar, necesitamos saber a qué hogar perteneces.
    </p>
    <v-btn 
      color="primary" 
      class="onboarding-button"
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
.onboarding-card {
  background-color: #f5f5f5;
  border-radius: 12px;
  padding: 16px;
  margin: 8px 0;
}
</style>