<template>
  <div class="recurrence-confirmation">
    <v-alert type="success" variant="tonal" class="mb-2">
      Recurrencia seleccionada: <strong>{{ recurrence.recurrenceName }}</strong>
    </v-alert>
    <div class="d-flex align-center">
      <v-avatar
        size="30"
        class="me-2"
        :color="'#' + recurrence.colorRecurrence + '20'"
        variant="tonal"
      >
        <v-icon small :color="'#' + recurrence.colorRecurrence">mdi-calendar-repeat</v-icon>
      </v-avatar>
      <span>{{ recurrence.descriptionRecurrence }}</span>
    </div>
  </div>
</template>

<script>
export default {
  name: 'RecurrenceConfirmation',
  props: {
    recurrence: {
      type: Object,
      required: true
    }
  }
}
</script>

<style scoped>
.recurrence-confirmation {
  margin-top: 8px;
  padding: 8px;
  border-radius: 8px;
  background-color: rgba(0, 150, 136, 0.1);
}
</style>