<template>
  <div class="priority-options-container">
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
            @click="$emit('priority-selected', option)"
          >
            <v-avatar
              size="40"
              class="me-3"
              :color="'#' + option.colorPriority + '20'"
              variant="tonal"
            >
              <v-icon :color="'#' + option.colorPriority">mdi-priority-high</v-icon>
            </v-avatar>
            <div>
              <div class="text-body-1 font-weight-medium">
                {{ option.namePriority }}
              </div>
              <div class="text-caption text-grey-darken-1">
                {{ option.descriptionPriority }}
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
  name: 'PriorityOptions',
  props: {
    options: {
      type: Array,
      required: true
    },
    selectedId: {
      type: [Number, String],
      default: null
    }
  }
}
</script>

<style scoped>
.priority-options-container {
  margin-top: 12px;
  margin-bottom: 8px;
}
</style>