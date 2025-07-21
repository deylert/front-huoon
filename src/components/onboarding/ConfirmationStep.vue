<template>
  <div class="onboarding-card">
    <v-icon size="64" color="success" class="mb-4">mdi-check-circle</v-icon>
    <h3 class="text-h5 mb-4">¡Todo listo!</h3>

    <p class="mb-4">
      {{ personName }}, acabas de <strong>{{ actionText }}</strong> el hogar <strong>{{ homeName }}</strong>.
    </p>

    <p v-if="isAdmin" class="mb-4">
      Como administrador, puedes gestionar los miembros y configuraciones del hogar.
    </p>
    <p v-else class="mb-4">
      Ahora puedes comenzar a organizar tus tareas, finanzas y más.
    </p>

    <v-btn
      color="primary"
      block
      @click="handleComplete"
      :loading="loading"
    >
      Ir al inicio
    </v-btn>
  </div>
</template>

<script>
export default {
  props: {
    homeName: {
      type: String,
      required: true
    },
    personName: {
      type: String,
      required: true
    },
    isAdmin: {
      type: Boolean,
      default: false
    },
    action: {
      type: String,
      required: true,
      validator: value => ['crear', 'unirse'].includes(value)
    }
  },
  emits: ['complete'],
  data: () => ({
    loading: false
  }),
  computed: {
    actionText() {
      return this.action === 'crear' ? 'crear' : 'unirte a';
    }
  },
  methods: {
    handleComplete() {
      this.loading = true;
      this.$emit('complete');
    }
  }
};
</script>