<template>
  <div class="priority-options-container">
    <v-slide-group show-arrows class="px-0">
      <v-slide-group-item v-for="option in options" :key="option.id">
        <div class="me-2" style="margin-bottom: 1px">
          <v-card
            class="pa-2 d-flex align-center"
            elevation="2"
            rounded="lg"
            :class="{
              'bg-primary text-white': option.id === selectedId,
              'bg-grey-lighten-3': option.id !== selectedId,
            }"
            style="min-width: 150px; cursor: pointer"
            @click="selectPriority(option)"
          >
            <v-avatar
              size="32"
              class="me-2"
              :color="option.id === selectedId ? 'white' : '#' + option.colorPriority + '20'"
              variant="tonal"
            >
              <v-icon :color="option.id === selectedId ? '#' + option.colorPriority : '#' + option.colorPriority">
                mdi-priority-high
              </v-icon>
            </v-avatar>
            <div>
              <div class="text-body-2 font-weight-medium">
                {{ option.namePriority }}
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
    selectPriority(option) {
      this.$emit('priority-selected', option);
    },
  },
};
</script>

<style scoped>
.priority-options-container {
  margin: 8px 0;
}

.v-slide-group__content {
  padding: 4px 0;
  align-items: center;
}

/* Ajustar el padding de los contenedores de flechas */
.v-slide-group__prev, .v-slide-group__next {
  padding: 0 4px;
}
</style>