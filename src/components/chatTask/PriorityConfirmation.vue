<template>
  <div class="priority-confirmation">
    <v-alert type="success" variant="tonal" class="mb-2">
      Prioridad seleccionada: <strong>{{ priority.namePriority }}</strong>
    </v-alert>
    <div class="d-flex align-center">
      <v-avatar
        size="30"
        class="me-2"
        :color="'#' + priority.colorPriority + '20'"
        variant="tonal"
      >
        <v-icon small :color="'#' + priority.colorPriority">mdi-priority-high</v-icon>
      </v-avatar>
      <span>{{ priority.descriptionPriority }}</span>
    </div>
  </div>
</template>

<script>
export default {
  name: 'PriorityConfirmation',
  props: {
    priority: {
      type: Object,
      required: true
    }
  }
}
</script>

<style scoped>
.priority-confirmation {
  margin-top: 8px;
  padding: 8px;
  border-radius: 8px;
  background-color: rgba(0, 150, 136, 0.1);
}
</style>