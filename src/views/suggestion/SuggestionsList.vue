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
          class="mb-3 rounded-lg pa-1"
          elevation="2"
          :class="{ 'smooth-hover': true }"
        >
          <v-row >
            <!-- Fecha -->
            <v-col cols="1" class="pa-4 d-flex flex-column align-center">
            <div
                  class="icono-concavo d-flex flex-column justify-center align-center mr-2"
                  :class="`bg-${getTypeColor(item.type)}`"
                  style="min-height: 48px; min-width: 48px"
                >
              <div class="text-body-2 font-weight-medium">
                    {{ formatIntuitiveDate(item.start_date) }}
                  </div>
              </div>
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
                  <div class="font-weight-semibold text-body-2">
                    {{ item.title }}
                  </div>
                  <div class="text-caption text-grey-darken-1">
                    {{ item.description }}
                  </div>
                </div>
              </v-row>
            </v-col>

            <!-- Estado -->
            <v-col cols="2" class="d-flex align-center justify-end pe-4">
              <v-chip
                :color="getStatusColor(item.status)"
                size="small"
                variant="tonal"
              >
                {{ getTranslatedStatusName(item.status) }}
              </v-chip>
            </v-col>

            <v-col cols="1" class="d-flex align-center justify-end pe-4 gap-2">
              <div>
                <v-btn
                  variant="text"
                  size="small"
                  color="primary"
                  class="font-weight-semibold text-body-2"
                  @click="handleSeeMore(item)"
                  style="text-transform: none;"
                >
                  {{ $t("buttons.seeMore") }}
                </v-btn>
              </div>
            </v-col>
          </v-row>
        </v-card>
      </v-col>
    </v-row>

    <!--<v-dialog v-model="dialogOpen" fullscreen transition="dialog-bottom-transition">
      <v-card>
        <v-card-text>
          <slot name="detail" :taskData="currentItem" :onClose="closeDialog"></slot>
        </v-card-text>
        <v-divider></v-divider>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn text @click="closeDialog">{{ $t("buttons.close") }}</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>-->
    <v-dialog v-model="dialogOpen" fullscreen transition="dialog-bottom-transition">
    <v-card>
      <v-card-text>
        <!-- Pasamos los parámetros al componente ChatTask -->
        <ChatTask :taskData="currentItem" @close-dialog="closeDialgChat()"   @close-all-dialogs="closeAllDialogs($event)"/>
      </v-card-text>
      <v-divider></v-divider>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn text @click="closeDialgChat()">Cerrar</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
  </div>
</template>

<script>
import _ from "lodash";
import ChatTask from "../chat/ChatTask.vue";
export default {
  components: {
    ChatTask,
  },
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
    closeAllDialogs(sourceComponent) {
    console.log(`Cerrando todo desde: ${sourceComponent}`);
    this.dialogChatTask = false;
    this.dialogChatFinance = false;
    this.dialogChatBudget = false;
    this.dialogOpen = false;
    this.currentItem = false;
    this.texto = "";
    this.textoTemporal = "";
    this.currentTask = null;
    this.currentFinance = null;
    this.currentBudget = null;
  },
    handleCloseDialog() {
      // Lógica adicional al cerrar el diálogo si es necesaria
      console.log("Diálogo cerrado");
      this.closeDialgChat();
    },
    closeDialgChat() {
      this.dialogOpen = false;
      this.currentItem = null; // Limpia la tarea actual
      this.dialogChatTask = false;
      this.dialogChatFinance = false;
      this.dialogChatBudget = false;
      this.texto = "";
      this.textoTemporal = "";
      this.currentTask = null;
      this.currentFinance = null;
      this.currentBudget = null;
      //this.initialize();
    },
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

    formatIntuitiveDate(dateString) {
      if (!dateString) return "Sin fecha";

      // 1. Parsear la fecha de entrada (formato YYYY-MM-DD)
      const [year, month, day] = dateString.split("-");
      const inputDate = new Date(year, month - 1, day); // Mes es 0-based

      // 2. Obtener fecha actual (sin horas/minutos/segundos)
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      // 3. Normalizar ambas fechas a UTC para evitar problemas de zona horaria
      const inputUTC = Date.UTC(
        inputDate.getFullYear(),
        inputDate.getMonth(),
        inputDate.getDate()
      );
      const todayUTC = Date.UTC(today.getFullYear(), today.getMonth(), today.getDate());

      // 4. Calcular diferencia en días
      const diffDays = Math.floor((inputUTC - todayUTC) / (1000 * 60 * 60 * 24));

      // 5. Determinar el texto a mostrar
      switch (diffDays) {
        case 0:
          return "Hoy";
        case 1:
          return "Mañana";
        case 2:
          return "Pasado mañana";
        case -1:
          return "Ayer";
        case -2:
          return "Anteayer";
        default:
          return inputDate
            .toLocaleDateString("es-ES", {
              weekday: "short",
              day: "numeric",
              month: "short",
            })
            .replace(/\./g, "");
      }
    },
    
    getTypeColor(type) {
      const colorMap = {
        Tarea: "warning",
        Evento: "teal-lighten-2",
        // Agrega más tipos si es necesario
      };
      return colorMap[type] || "grey-lighten-1"; // Color por defecto
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
      /*this.currentItem = typeof item.taskData === 'string' 
        ? JSON.parse(item.taskData) 
        : item.taskData || item; // Fallback al item completo
      
      this.dialogOpen = true;*/
      this.currentItem = null;
      this.$nextTick(() => {
        const taskData =
          typeof item.taskData === "string" ? JSON.parse(item.taskData) : item.taskData;

        this.currentItem = _.cloneDeep(taskData);
        this.dialogOpen = true;
      });
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

.icono-concavo {
  width: 48px;
  height: 48px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 10px;
  margin-right: 5px;
  color: white;
  /* Mantenemos solo el efecto cóncavo en el ícono 
  box-shadow: inset;*/
  position: relative;
  overflow: hidden;
}
.smooth-hover {
  transition: transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out;
}

.smooth-hover:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1) !important;
}

.date {
  color: #616161;
}
</style>