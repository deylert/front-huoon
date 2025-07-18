<template>
  <div class="recurrence-options-container">
    <v-slide-group show-arrows class="pa-2">
      <v-slide-group-item v-for="option in options" :key="option.id">
        <div class="me-3">
          <v-card
            class="pa-3 d-flex align-center"
            elevation="2"
            rounded="lg"
            :class="{
              'bg-primary text-white': option.id === selectedId,
              'bg-grey-lighten-3': option.id !== selectedId,
            }"
            style="min-width: 250px; cursor: pointer"
            @click="$emit('recurrence-selected', option)"
          >
            <v-avatar
              size="40"
              class="me-3"
              color="blue-lighten-4"
              variant="tonal"
            >
              <v-icon color="blue">mdi-calendar-repeat</v-icon>
            </v-avatar>
            <div>
              <div class="text-body-1 font-weight-medium">
                {{ option.name }}
              </div>
              <div class="text-caption text-grey-darken-1">
                {{ option.recurrenceName }}
              </div>
            </div>
          </v-card>
        </div>
      </v-slide-group-item>
    </v-slide-group>
  </div>
</template>

<script>
export default {
  name: 'RecurrenceOptions',
  props: {
    options: {
      type: Array,
      required: true
    },
    selectedId: {
      type: [String],
      default: null
    }
  }
}
</script>

<style scoped>
.recurrence-options-container {
  margin-top: 12px;
  margin-bottom: 8px;
}
</style>