<template>
  <div class="recurrence-options-container">
    <v-slide-group show-arrows class="px-0" style="overflow: visible">
      <v-slide-group-item v-for="option in options" :key="option.id" style="overflow: visible">
        <div class="me-2" style="margin-bottom: 1px">
          <v-card
            class="pa-2 d-flex align-center"
            elevation="2"
            rounded="lg"
            :class="{
              'bg-primary text-white': option.id === selectedId,
              'bg-grey-lighten-3': option.id !== selectedId,
            }"
            style="min-width: 150px; cursor: pointer; overflow: visible"
            @click="selectRecurrence(option)"
          >
            <v-avatar
              size="32"
              class="me-2"
              color="blue-lighten-4"
              variant="tonal"
            >
             <v-icon :color="option.id === selectedId ? 'white' : 'blue'">
  {{ getRecurrenceIcon(option.id) }}
</v-icon>
            </v-avatar>
            <div>
              <div class="text-body-2 font-weight-medium">
                {{ option.name }}
              </div>
              <div class="text-caption text-grey-darken-1">
                {{ option.description }}
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
      type: [String, Number],
      default: null
    }
  },
  methods: {
    selectRecurrence(option) {
      this.$emit('recurrence-selected', option);
    },
     getRecurrenceIcon(id) {
      const icons = {
        'Diaria': 'mdi-calendar-today',
        'Semanal': 'mdi-calendar-week',
        'Mensual': 'mdi-calendar-month',
        'Anual': 'mdi-calendar-star',
        'No se repite': 'mdi-calendar-remove'
      };
      return icons[id] || 'mdi-calendar-question';
    }
  }
}
</script>

<style scoped>
.recurrence-options-container {
  margin-top: 12px;
  margin-bottom: 8px;
}

.v-slide-group__content {
  padding: 4px 0;
}
</style>