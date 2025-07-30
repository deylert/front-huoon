<template>
  <div class="period-confirmation">
    <v-alert type="success" variant="tonal" class="mb-2">
      Periodo seleccionado: <strong>{{ period.nameTranslated || period.name }}</strong>
    </v-alert>
    <div class="d-flex align-center">
      <v-avatar
        size="30"
        class="me-2"
        color="primary-lighten-4"
        variant="tonal"
      >
        <v-icon small color="primary">mdi-calendar</v-icon>
      </v-avatar>
      <span>{{ period.descriptionTranslated || period.description }}</span>
    </div>
  </div>
</template>

<script>
export default {
  name: 'PeriodConfirmation',
  props: {
    period: {
      type: Object,
      required: true
    }
  }
}
</script>

<style scoped>
.period-confirmation {
  margin-top: 8px;
  padding: 8px;
  border-radius: 8px;
  background-color: rgba(0, 150, 136, 0.1);
}
</style>