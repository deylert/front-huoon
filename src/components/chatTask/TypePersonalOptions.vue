<template>
  <div class="type-options-container">
    <v-slide-group show-arrows class="pa-2">
      <v-slide-group-item v-for="option in filteredOptions" :key="option.id">
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
              :color="avatarColor(option)"
              variant="tonal"
            >
              <v-icon :color="iconColor(option)">
                {{ option.icon || defaultIcon(option) }}
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
      validator: (value) => {
        return value.every(option => 
          option.id && option.name && option.description
        )
      }
    },
    selectedId: {
      type: [String, Number],
      default: null
    },
    excludeTypes: {
      type: Array,
      default: () => []
    }
  },
  computed: {
    filteredOptions() {
      return this.options.filter(option => 
        !this.excludeTypes.includes(option.id)
      )
    }
  },
  methods: {
    selectType(option) {
      this.$emit('type-selected', option);
    },
    defaultIcon(option) {
      // Iconos por defecto basados en el tipo de opción
      const iconMap = {
        'Personal': 'mdi-account',
        'Profesional': 'mdi-briefcase',
        'Home': 'mdi-home',
        'Business': 'mdi-office-building'
      }
      return iconMap[option.id] || 'mdi-checkbox-marked-circle-outline'
    },
    avatarColor(option) {
      // Colores de avatar por defecto
      const colorMap = {
        'Personal': 'deep-purple-lighten-1',
        'Profesional': 'blue-lighten-1',
        'Home': 'teal-lighten-1',
        'Business': 'indigo-lighten-1'
      }
      return option.avatarColor || colorMap[option.id] || 'primary-lighten-1'
    },
    iconColor(option) {
      // Colores de icono por defecto
      const colorMap = {
        'Personal': 'deep-purple-darken-2',
        'Profesional': 'blue-darken-2',
        'Home': 'teal-darken-2',
        'Business': 'indigo-darken-2'
      }
      return option.iconColor || colorMap[option.id] || 'primary-darken-2'
    }
  }
}
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