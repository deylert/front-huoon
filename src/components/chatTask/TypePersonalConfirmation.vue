<template>
  <div class="type-confirmation">
    <v-alert type="success" variant="tonal" class="mb-2">
      Tipo seleccionado: <strong>{{ type.name }}</strong>
    </v-alert>
    <div class="d-flex align-center">
      <v-avatar
        size="30"
        class="me-2"
        :color="type.id === 'Personal' ? 'deep-purple-lighten-1' : 'teal-lighten-1'"
        variant="tonal"
      >
        <v-icon small :color="type.id === 'Personal' ? 'deep-purple-darken-2' : 'teal-darken-2'">
          {{ type.id === 'Personal' ? 'mdi-account' : 'mdi-home' }}
        </v-icon>
      </v-avatar>
      <span>{{ type.description }}</span>
    </div>
  </div>
</template>

<script>
export default {
  name: 'TypeConfirmation',
  props: {
    type: {
      type: Object,
      required: true
    }
  }
}
</script>

<style scoped>
.type-confirmation {
  margin-top: 8px;
  padding: 8px;
  border-radius: 8px;
  background-color: rgba(0, 150, 136, 0.1);
}
</style>