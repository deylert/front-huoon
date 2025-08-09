<!-- TaskTypeOptions.vue -->
<template>
  <div class="task-type-options-container">
    <v-slide-group show-arrows class="px-0">
      <v-slide-group-item v-for="option in options" :key="option.id">
        <div class="me-2" style="margin-bottom: 1px">
          <v-card
            class="pa-2 d-flex align-center"
            elevation="2"
            rounded="lg"
            :class="{
              'bg-primary': option.id === selectedId,
              'bg-grey-lighten-3': option.id !== selectedId,
            }"
            style="min-width: 150px; cursor: pointer"
            @click="selectType(option)"
          >
            <v-avatar
              size="32"
              class="me-2"
              :color="option.id === selectedId ? 'white' : getTypeColor(option.id, 'light')"
              variant="tonal"
            >
              <v-icon :color="option.id === selectedId ? getTypeColor(option.id, 'dark') : getTypeColor(option.id, 'dark')">
                {{ option.id === 'Tarea' ? 'mdi-clipboard-text-outline' : 'mdi-flag-checkered' }}
              </v-icon>
            </v-avatar>
            <div>
              <div class="text-body-2 font-weight-medium" :class="{ 'text-white': option.id === selectedId }">
                {{ option.name }}
              </div>
              <div class="text-caption" :class="option.id === selectedId ? 'text-white' : 'text-grey-darken-1'">
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
        Tarea: { light: 'purple-lighten-4', dark: 'purple' },   // 🟠 Tarea = Naranja
        Meta: { light: 'blue-lighten-4', dark: 'blue' },                  // 🔵 Meta = Azul
      };
      return colors[id]?.[tone] || (tone === 'light' ? 'grey-lighten-3' : 'grey');
    },
  },
};
</script>

<style scoped>
.task-type-options-container {
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