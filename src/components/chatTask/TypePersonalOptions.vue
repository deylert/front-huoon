<template>
  <div class="type-options-container">
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
            style="min-width: 180px; cursor: pointer"
            @click="selectType(option)"
          >
            <v-avatar
              size="40"
              class="me-3"
              :color="option.id === 'Personal' ? 'deep-purple-lighten-1' : 'teal-lighten-1'"
              variant="tonal"
            >
              <v-icon :color="option.id === 'Personal' ? 'deep-purple-darken-2' : 'teal-darken-2'">
                {{ option.id === 'Personal' ? 'mdi-account' : 'mdi-home' }}
              </v-icon>
            </v-avatar>
            <div>
              <div class="text-body-1 font-weight-medium">
                {{ option.name }}
              </div>
              <div class="text-caption font-weight-medium">
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
  props: {
    options: {
      type: Array,
      required: true,
    },
    selectedId: {
      type: [String],
      default: null,
    },
  },
  methods: {
    selectType(option) {
      this.$emit('type-selected', option);
    },
  },
};
</script>

<style scoped>
.type-options-container {
  margin-top: 12px;
  max-width: 100%;
  overflow-x: auto;
}

.v-slide-group__content {
  padding: 4px 0;
}
</style>