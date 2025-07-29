<!-- TaskTypeConfirmation.vue -->
<template>
  <v-card
    class="task-type-confirmation mx-auto"
    variant="outlined"
    :color="getTypeColor(type.id)"
  >
    <v-card-text class="pa-3">
      <div class="d-flex align-start">
        <v-avatar
          size="36"
          class="me-3 mt-1"
          :color="getTypeColor(type.id) + '20'"
          variant="tonal"
        >
          <v-icon :color="getTypeColor(type.id)">
            {{ type.id === 'Tarea' ? 'mdi-clipboard-task' : 'mdi-flag-checkered' }}
          </v-icon>
        </v-avatar>

        <div>
          <div class="text-subtitle-2 font-weight-medium mb-1">
            Tipo: {{ type.name }}
          </div>
          <div class="text-body-2 text-medium-emphasis">
            {{ type.description }}
          </div>
        </div>
      </div>
    </v-card-text>
  </v-card>
</template>

<script>
export default {
  name: 'TaskTypeConfirmation',
  props: {
    type: {
      type: Object,
      required: true,
      validator: (value) => value.id && value.name,
    },
  },
  methods: {
    getTypeColor(id) {
      const colors = {
        Tarea: '#f57c00',    // 🟠 Naranja oscuro para Tarea
        Meta: '#1976d2',     // 🔵 Azul para Meta
      };
      return colors[id] || '#9e9e9e';
    },
  },
};
</script>

<style scoped>
.task-type-confirmation {
  max-width: 100%;
  width: 100%;
  border-radius: 12px;
  border-width: 1px;
  transition: all 0.2s ease;
}

.task-type-confirmation:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}
</style>