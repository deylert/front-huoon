<template>
  <div class="type-options-container">
    <v-slide-group show-arrows class="pa-2">
      <v-slide-group-item v-for="option in privacyOptions" :key="option.id">
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
            @click="selectPrivacy(option)"
          >
            <v-avatar
              size="40"
              class="me-3"
              :color="option.id === 0 ? 'deep-purple-lighten-1' : 'teal-lighten-1'"
              variant="tonal"
            >
              <v-icon :color="option.id === 0 ? 'deep-purple-darken-2' : 'teal-darken-2'">
                {{ option.id === 0 ? 'mdi-lock' : 'mdi-earth' }}
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
    selectedId: {
      type: Number,
      default: null,
    },
  },
  data() {
    return {
      privacyOptions: [
        { id: 0, name: 'Privado', description: 'Solo visible para ti' },
        { id: 1, name: 'Público', description: 'Visible para todos' }
      ]
    }
  },
  methods: {
    selectPrivacy(option) {
      this.$emit('privacy-selected', option.id);
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