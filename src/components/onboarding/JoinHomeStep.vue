<template>
  <div class="onboarding-card rounded-lg">
    <h3 class="text-body-2 mb-4">Unirme a un hogar existente</h3>
    
    <v-form @submit.prevent="submitForm">
      <v-text-field
        v-model="code"
        label="Código del hogar"
        placeholder="Ingresa el código proporcionado"
        required
        variant="underlined"
        class="mb-4"
        :rules="[v => !!v || 'El código es requerido']"
      ></v-text-field>
      
      <div class="d-flex justify-space-between">
        <v-btn 
          variant="tonal"
                class="text-grey-darken-1"
          @click="$emit('go-back')"
        >
          Volver
        </v-btn>
        
        <v-btn 
          variant="tonal"
                class="text-deep-purple-accent-3 ml-1"
          type="submit"
          :loading="loading"
        >
          Unirme
        </v-btn>
      </div>
    </v-form>
  </div>
</template>

<script>
export default {
  data() {
    return {
      code: "",
      loading: false
    };
  },
  methods: {
    submitForm() {
      if (!this.code) {
        this.$emit('error', 'Por favor ingresa un código');
        return;
      }
      
      this.$emit('home-joined', { code: this.code });
    }
  },
  emits: ['home-joined', 'go-back', 'error']
};
</script>