<template>
  <div class="period-options-container">
    <v-slide-group show-arrows class="pa-2">
      <v-slide-group-item v-for="period in options" :key="period.id">
        <div class="me-3">
          <v-card
            class="pa-3 d-flex align-center"
            elevation="2"
            rounded="lg"
            :class="{
              'bg-primary text-white': period.id === selectedId,
              'bg-grey-lighten-3': period.id !== selectedId,
            }"
            style="min-width: 180px; cursor: pointer"
            @click="selectPeriod(period)"
          >
            <v-avatar
              size="40"
              class="me-3"
              color="primary-lighten-4"
              variant="tonal"
            >
              <v-icon color="primary">mdi-calendar</v-icon>
            </v-avatar>
            <div>
              <div class="text-body-1 font-weight-medium">
                {{ period.nameTranslated || period.name }}
              </div>
              <div class="text-caption font-weight-medium">
                {{ period.descriptionTranslated || period.description }}
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
  props: {
    options: {
      type: Array,
      required: true,
    },
    selectedId: {
      type: [Number, String],
      default: null,
    },
  },
  methods: {
    selectPeriod(period) {
      this.$emit('period-selected', period);
    },
  },
};
</script>

<style scoped>
.period-options-container {
  margin-top: 12px;
  max-width: 100%;
  overflow-x: auto;
}

.v-slide-group__content {
  padding: 4px 0;
}
</style>