<!-- TaskTypeOptions.vue -->
<template>
  <div class="task-type-options-container">
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
              :color="getTypeColor(option.id, 'light')"
              variant="tonal"
            >
              <v-icon :color="getTypeColor(option.id, 'dark')">
                {{ option.id === 'Tarea' ? 'mdi-clipboard-task' : 'mdi-flag-checkered' }}
              </v-icon>
            </v-avatar>
            <div>
              <div class="text-body-1 font-weight-medium">
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
  name: 'TaskTypeOptions',
  props: {
    options: {
      type: Array,
      required: true,
      validator: (value) =>
        value.every((opt) => opt.id && opt.name),
    },
    selectedId: {
      type: String,
      default: null,
    },
  },
  methods: {
    selectType(option) {
      this.$emit('type-selected', option);
    },
    getTypeColor(id, tone) {
      const colors = {
        Tarea: { light: 'deep-orange-lighten-4', dark: 'deep-orange' },   // 🟠 Tarea = Naranja
        Meta: { light: 'blue-lighten-4', dark: 'blue' },                  // 🔵 Meta = Azul
      };
      return colors[id]?.[tone] || (tone === 'light' ? 'grey-lighten-3' : 'grey');
    },
  },
};
</script>

<style scoped>
.task-type-options-container {
  margin-top: 12px;
  margin-bottom: 8px;
}

.v-slide-group__content {
  padding: 4px 0;
}
</style>