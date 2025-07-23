<template>
  <div>
    <div class="text-body-2 font-weight-medium mb-2">
      {{ title || $t('common.suggestions') }}
    </div>

    <v-row>
      <v-col>
        <v-card
          v-for="(item, index) in items"
          :key="index"
          class="mb-3 rounded-lg"
          elevation="2"
          :class="{ 'smooth-hover': true }"
        >
          <v-row no-gutters class="ma-0">
            <!-- Fecha -->
            <v-col cols="auto" class="pa-4 d-flex flex-column align-center">
              <div class="date">{{ formatDate(item.start_date) }}</div>
            </v-col>

            <!-- Contenido principal -->
            <v-col cols="8" class="d-flex align-center pe-4 gap-2">
              <v-row align="center" no-gutters>
                <v-icon
                  class="me-2"
                  :color="item.source === 'ia' ? 'deep-purple' : 'blue'"
                  size="24"
                >
                  {{ item.source === "ia" ? "mdi-brain" : icon || 'mdi-lightbulb-on' }}
                </v-icon>
                <div>
                  <div class="font-weight-semibold text-body-1">
                    {{ item.title }}
                  </div>
                  <div class="text-caption text-grey-darken-1">
                    {{ item.description }}
                  </div>
                </div>
              </v-row>
            </v-col>

            <!-- Estado -->
            <v-col cols="auto" class="d-flex align-center justify-end pe-4">
              <v-chip
                :color="getStatusColor(item.status)"
                size="small"
                variant="tonal"
              >
                {{ getTranslatedStatusName(item.status) }}
              </v-chip>
            </v-col>

            <v-col cols="auto" class="d-flex align-center justify-end pe-4 gap-2">
              <div>
                <v-btn
                  variant="text"
                  size="small"
                  color="primary"
                  @click="handleSeeMore(item)"
                >
                  {{ $t("buttons.seeMore") }}
                </v-btn>
              </div>
            </v-col>
          </v-row>
        </v-card>
      </v-col>
    </v-row>

    <v-dialog v-model="dialogOpen" fullscreen transition="dialog-bottom-transition">
      <v-card>
        <v-card-text>
          <!-- Pasamos el método closeDialog como parte del scope del slot -->
          <slot name="detail" :taskData="currentItem" :onClose="closeDialog"></slot>
        </v-card-text>
        <v-divider></v-divider>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn text @click="closeDialog">{{ $t("buttons.close") }}</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
export default {
  name: 'SuggestionsList',
  props: {
    items: {
      type: Array,
      required: true,
      default: () => []
    },
    title: {
      type: String,
      default: ''
    },
    icon: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      dialogOpen: false,
      currentItem: null
    }
  },
  methods: {
    formatDate(dateStr) {
      if (!dateStr) return '';
      
      const [year, month, day] = dateStr.split('-');
      const date = new Date(year, month - 1, day);
      
      const options = { 
        day: '2-digit', 
        month: 'short',
        year: 'numeric',
        timeZone: 'UTC'
      };
      
      return date.toLocaleDateString('es-CL', options);
    },
    
    getStatusColor(status) {
      switch (status) {
        case "Pendiente":
          return "orange";
        case "Revisado":
          return "blue";
        case "Completado":
          return "green";
        default:
          return "grey";
      }
    },
    
    getTranslatedStatusName(status) {
      const match = this.items.find((s) => s.id === status);
      return match ? match.name : status;
    },
    
    handleSeeMore(item) {
      this.currentItem = typeof item.taskData === 'string' 
        ? JSON.parse(item.taskData) 
        : item.taskData || item; // Fallback al item completo
      
      this.dialogOpen = true;
    },
    
    closeDialog() {
      this.dialogOpen = false;
      this.currentItem = null;
      this.$emit('close-dialog');
    }
  }
}
</script>

<style scoped>
.smooth-hover {
  transition: transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out;
}

.smooth-hover:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1) !important;
}

.date {
  font-size: 0.875rem;
  font-weight: 500;
  color: #616161;
}
</style>