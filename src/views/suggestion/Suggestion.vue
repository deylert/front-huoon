<template>
  <v-snackbar
    class="mt-12"
    location="right top"
    :timeout="sb_timeout"
    :color="sb_type"
    elevation="24"
    :multi-line="true"
    vertical
    v-model="snackbar"
  >
    <v-row>
      <v-col md="2">
        <v-avatar :icon="sb_icon" color="sb_type" size="40"></v-avatar>
      </v-col>
      <v-col md="10">
        <h4>{{ sb_title }}</h4>
        {{ sb_message }}
      </v-col>
    </v-row>
  </v-snackbar>
  
  <v-container>
    <v-card class="pa-4" elevation="4" rounded="lg">
      <!-- Encabezado con foto y datos -->
      <v-card-text>
    <!-- Encabezado -->
    <v-row justify="space-between" align="center" class="mb-6">
      <h2 class="text-body-2 font-weight-bold">{{ $t("viewTitles.suggestions") }}</h2>
      <v-btn
        icon
        color="deep-purple-accent-4"
        variant="flat"
        class="elevation-3"
        @click="showAdd"
      >
        <v-icon>mdi-plus</v-icon>
      </v-btn>
    </v-row>

    <template v-if="filteredSuggestions.length > 0">
      <v-card
        v-for="(suggestion, index) in filteredSuggestions"
        :key="index"
        class="mb-3 rounded-lg pa-1"
        elevation="2"
      >
        <v-row>
          <!-- Columna 1: Fecha -->
              <v-col cols="1" class="pa-4 d-flex flex-column align-center">
            <div
                  class="icono-concavo d-flex flex-column justify-center align-center mr-2"
                  :class="`bg-${getTypeColor(suggestion.taskData.type)}`"
                  style="min-height: 48px; min-width: 48px"
                >
              <div class="text-body-2 font-weight-medium">
                    {{ formatIntuitiveDate(suggestion.date) }}
                  </div>
              </div>
            </v-col>

          <!-- Columna 2: Título y Tipo -->
          <v-col cols="7" class="d-flex align-center pe-4 gap-2">
              <v-row align="center" no-gutters>
                 <div>
                  <div class="font-weight-semibold text-body-2">
                    {{ suggestion.title }}
                  </div>
                  <div class="text-caption text-grey-darken-1">
                    {{ suggestion.description }}
                  </div>
                </div>
              </v-row>
            </v-col>
            <v-col cols="1" class="d-flex align-center pe-4 gap-2">
                <div>
                  <v-icon
                    :color="getTypeColor(suggestion.taskData.type)"
                    style="font-size: 10px; filter: drop-shadow(0 0 2px currentColor)"
                    icon="mdi-circle"
                    class="mr-0"
                  ></v-icon>
                  <span class="text-grey-darken-1 text-body-2">{{
                    suggestion.taskData.type
                  }}</span>
                </div>
              </v-col>
          <!-- Columna 4: Tipo -->
          <v-col cols="1" class="d-flex align-center pe-4 gap-2">
            <v-row align="center" no-gutters>
              <div class="text-body-2 text-grey-darken-3">
                {{ suggestion.type || $t("suggestions.notRecorded") }}
              </div>
            </v-row>
          </v-col>
          <v-col cols="1" class="d-flex align-center pe-4 gap-2">           
           <v-row align="center">
              <v-chip size="small" :color="getStatusColor(suggestion.status)">
                {{ suggestion.status }}
              </v-chip>
           </v-row>
          </v-col>
          <v-col cols="1" class="d-flex align-center justify-end pe-4 gap-2">
              <div>
                <v-btn
                  variant="text"
                  size="small"
                  color="primary"
                  class="font-weight-semibold text-body-2"
                  @click="handleSeeMore(suggestion)"
                  style="text-transform: none;"
                >
                  {{ $t("buttons.seeMore") }}
                </v-btn>
              </div>
            </v-col>

          <!-- Columna 5: Acciones 
          <v-col cols="auto" class="px-2 py-3 d-flex justify-end align-center">

            <div class="d-flex">
              <v-btn
                icon
                variant="text"
                color="green-darken-2"
                size="small"
                @click="editItem(suggestion)"
                class="mx-1"
              >
                <v-icon>mdi-pencil</v-icon>
              </v-btn>
              <v-btn
                icon
                variant="text"
                color="red-darken-2"
                size="small"
                @click="deleteItem(suggestion)"
                class="mx-1"
              >
                <v-icon>mdi-close</v-icon>
              </v-btn>
            </div>
          </v-col>-->
        </v-row>
      </v-card>
    </template>
    
    <template v-else>
      <v-col cols="12" class="text-center py-8 pa-0">
        <v-icon size="64" color="grey-lighten-1">mdi-lightbulb-outline</v-icon>
        <div class="text-h6 text-grey mt-4">
          {{ $t("suggestions.noRecords") }}
        </div>
      </v-col>
    </template>
     </v-card-text>
    </v-card>
  </v-container>

  <!-- Diálogo para agregar/editar sugerencias -->
  <v-dialog
    v-model="dialog"
    fullscreen
    persistent
    transition="dialog-bottom-transition"
    content-class="fullscreen-dialog"
  >
    <v-form ref="form" v-model="valid" class="h-100">
      <v-card class="pa-10">
        <v-card-text class="pt-12">
          <p class="text-grey-lighten-1">
            {{ $t("suggestions.formInstructions.suggestion") }}
          </p>

          <v-row class="mt-12">
            <!-- Side steps -->
            <v-col cols="3">
              <v-timeline align="start" side="end" dense>
                <v-timeline-item
                  v-for="(s, index) in steps"
                  :key="index"
                  :dot-color="
                    step > index
                      ? 'green'
                      : step === index
                      ? 'deep-purple'
                      : 'grey-lighten-1'
                  "
                  :icon="
                    step >= index
                      ? step === index
                        ? `mdi-numeric-${index + 1}`
                        : 'mdi-check'
                      : null
                  "
                  size="large"
                >
                  <template #opposite>
                    <div class="text-end">
                      <strong>{{ $t(`suggestions.steps.${s.title}.title`) }}</strong>
                      <div class="text-caption text-grey">
                        {{ $t(`suggestions.steps.${s.title}.subtitle`) }}
                      </div>
                    </div>
                  </template>
                </v-timeline-item>
              </v-timeline>
            </v-col>

            <!-- Contenido dinámico según paso -->
            <v-col cols="9">
              <h3 class="text-deep-purple-accent-3 mb-8">
                {{ $t(`suggestions.steps.${steps[step].title}.title`) }}
              </h3>

              <!-- Paso 1: Detalles de la sugerencia -->
              <v-row dense v-if="step === 0">
                <v-col cols="12" sm="6">
                  <v-text-field
                    v-model="editedItem.title"
                    :label="$t('suggestions.fields.title')"
                    variant="underlined"
                    :rules="titleRules"
                  />
                </v-col>

                <v-col cols="12" sm="6">
                  <v-select
                    v-model="editedItem.type"
                    :items="types"
                    :label="$t('suggestions.fields.type')"
                    variant="underlined"
                    :rules="typeRules"
                  />
                </v-col>

                <v-col cols="12" sm="6">
                  <v-select
                    v-model="editedItem.status"
                    :items="statuses"
                    :label="$t('suggestions.fields.status')"
                    variant="underlined"
                    :rules="statusRules"
                    item-title="text"
                    item-value="value"
                  />
                </v-col>
              </v-row>

              <!-- Step 2: Descripción y contenido -->
              <v-row dense v-if="step === 1">
                <v-col cols="12">
                  <v-textarea
                    v-model="editedItem.description"
                    :label="$t('suggestions.fields.description')"
                    variant="underlined"
                    rows="3"
                    auto-grow
                    :rules="descriptionRules"
                  />
                </v-col>

                <v-col cols="12">
                  <v-textarea
                    v-model="editedItem.content"
                    :label="$t('suggestions.fields.content')"
                    variant="underlined"
                    rows="5"
                    auto-grow
                    :rules="contentRules"
                  />
                </v-col>

                <v-col cols="12">
                  <v-menu
                    v-model="dateMenu"
                    :close-on-content-click="false"
                    transition="scale-transition"
                    offset-y
                    min-width="auto"
                  >
                    <template v-slot:activator="{ props }">
                      <v-text-field
                        v-bind="props"
                        :model-value="dateInput" 
                        :label="$t('suggestions.fields.date')"
                        variant="underlined"
                        readonly
                        :rules="dateRules"
                      ></v-text-field>
                    </template>
                    <v-date-picker
                      color="#03626C"
                      :model-value="parseDateString(dateInput)" 
                      @update:model-value="updateDate"
                    ></v-date-picker>
                  </v-menu>
                </v-col>
              </v-row>

              <!-- Navegación -->
              <div class="d-flex justify-space-between mt-8">
                <v-btn
                  variant="text"
                  class="text-grey-darken-1"
                  @click="step > 0 ? step-- : this.close()"
                >
                  {{ step === 0 ? $t("buttons.close") : $t("buttons.previous") }}
                </v-btn>

                <v-btn
                  variant="text"
                  class="text-deep-purple-accent-3"
                  @click="nextStep"
                  :disabled="!valid"
                >
                  {{
                    step === steps.length - 1
                      ? $t("buttons.saveAndClose")
                      : $t("buttons.next")
                  }}
                </v-btn>
              </div>
            </v-col>
          </v-row>
        </v-card-text>
      </v-card>
    </v-form>
  </v-dialog>

  <!-- Diálogo de confirmación para eliminar -->
  <v-dialog v-model="dialogDelete" max-width="500px">
    <v-card>
      <v-toolbar color="#DA7171">
        <span class="text-subtitle-2 ml-4">
          {{
            $t("deleteDialog.title", { item: $t(`deleteDialog.items.suggestion`) })
          }}</span
        >
      </v-toolbar>
      <v-card-text class="mt-2 mb-2"> {{ $t("deleteDialog.message") }}</v-card-text>
      <v-divider></v-divider>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn color="#DA7171" variant="flat" @click="closeDelete">{{
          $t("taskForm.buttons.cancel")
        }}</v-btn>
        <v-btn
          color="#03626C"
          variant="flat"
          :loading="loading"
          @click="deleteItemConfirm"
        >
          {{ $t("taskForm.buttons.confirmDelete") }}</v-btn
        >
        </v-card-actions>
    </v-card>
  </v-dialog>

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
</template>

<script>
import { ref } from "vue";
import LocalStorageService from "@/LocalStorageService";
import { handleRequest } from "@/utils/api";
import _ from "lodash";
import { shallowRef } from "vue";
import ChatTask from "../chat/ChatTask.vue";

export default {
  components: {
    ChatTask,
  },
  data: () => ({
    dialogOpen: false,
      currentItem: null,
    selected: shallowRef([2]),
    selected2: null,
    step: 0,
    time: null,
    modal2: false,
    timePickerDialog: false,
    steps: [
      {
        title: "suggestionDetails",
        subtitle: "basic_information",
      },
      {
        title: "content",
        subtitle: "additional_details",
      },
    ],
    itemsPerPage: 6,
    currentPage: 1,
    snackbar: false,
    sb_type: "",
    sb_message: "",
    sb_timeout: 2000,
    sb_title: "",
    sb_icon: "",
    valid: true,
    loading: false,
    dialog: false,
    dialogDelete: false,
    suggestions: [],
    dateMenu: false,
    dateInput: null,
    home_id: "",
    person_id: "",
    editedItem: {
      id: "",
      title: "",
      description: "",
      content: "",
      date: null,
      status: "pending",
      type: "",
    },
    defaultItem: {
      id: "",
      title: "",
      description: "",
      content: "",
      date: null,
      status: "pending",
      type: "",
    },
    originalItem: {
      id: "",
      title: "",
      description: "",
      content: "",
      date: null,
      status: "pending",
      type: "",
    },
    editedIndex: -1,
    search: "",
    types: [],
    statuses: [
      { text: "Pending", value: "pending" },
      { text: "Reviewed", value: "reviewed" },
      { text: "Approved", value: "approved" },
      { text: "Rejected", value: "rejected" },
    ],
  }),

  computed: {
    filteredSuggestions() {
      return this.suggestions;
    },
    titleRules() {
      return [
        v => !v || v.length <= 255 || this.$t('suggestions.validationMessages.title.maxLength')
      ];
    },
    descriptionRules() {
      return [
        v => !v || v.length <= 500 || this.$t('suggestions.validationMessages.description.maxLength')
      ];
    },
    contentRules() {
      return [
        v => !v || v.length <= 1000 || this.$t('suggestions.validationMessages.content.maxLength')
      ];
    },
    statusRules() {
      return [
        v => !v || ['pending', 'reviewed', 'approved', 'rejected'].includes(v) || 
             this.$t('suggestions.validationMessages.status.invalid')
      ];
    },
    typeRules() {
      return [
        v => !v || this.types.map(t => t.value).includes(v) || 'Tipo inválido'
      ];
    },
    dateRules() {
      return [v => !!v || this.$t("suggestions.validationMessages.date.required")];
    },
    formTitle() {
      return this.editedIndex === -1
        ? this.$t("suggestions.titles.new")
        : this.$t("suggestions.titles.edit");
    },
    dateFormatted() {
      const date = this.dateInput ? new Date(this.dateInput) : new Date();
      const day = date.getDate().toString().padStart(2, "0");
      const month = (date.getMonth() + 1).toString().padStart(2, "0");
      const year = date.getFullYear();
      return `${year}-${month}-${day}`;
    },
    getDate() {
      return this.dateInput ? new Date(this.dateInput) : new Date();
    },
  },

  mounted() {
    this.home_id = JSON.parse(LocalStorageService.getItem("home_id"));
    this.person_id = JSON.parse(LocalStorageService.getItem("person_id"));
    this.initialize();
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
        case -1:
          return "Ayer";
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
      switch(status) {
        case 'Pendiente': return 'orange';
        case 'Revisado': return 'blue';
        case 'Completado': return 'green';
        case 'rejected': return 'red';
        default: return 'grey';
      }
    },
    updateDate(value) {
      const year = value.getFullYear();
      const month = String(value.getMonth() + 1).padStart(2, '0');
      const day = String(value.getDate()).padStart(2, '0');
      this.dateInput = `${year}-${month}-${day}`;
      this.editedItem.date = this.dateInput;
      this.dateMenu = false;
    },
    
    parseDateString(dateString) {
      if (!dateString) return null;
      const [year, month, day] = dateString.split('-');
      return new Date(year, month - 1, day);
    },
    
    formatDate(dateString) {
      if (!dateString) return "N/R";
      const [year, month, day] = dateString.split("-");
      return `${day}-${month}-${year}`;
    },

    async showAdd() {
      this.editedIndex = -1;
      this.editedItem = Object.assign({}, this.defaultItem);
      this.originalItem = Object.assign({}, this.defaultItem);
      this.dateInput = null;
      try {
        const result = await handleRequest({
          endpoint: 'get-suggestions-data',
          method: 'POST',
        });

        if (result.success) {
          this.types = result.data?.types || [];
        } else {
          this.types = [];
        }
      } catch (error) {
        this.showAlert('error', 'Ocurrió un error inesperado al cargar los tipos de sugerencias.', 3000);
      } finally {
        this.dialog = true;
      }
    },

    close() {
      this.dialog = false;
      this.$nextTick(() => {
        this.editedItem = Object.assign({}, this.defaultItem);
        this.originalItem = Object.assign({}, this.defaultItem);
      });
      this.editedIndex = -1;
    },

    async initialize() {
      this.data = {};
      this.data.home_id = this.home_id;
      try {
        this.loading = true;
        const result = await handleRequest({
          endpoint: "get-suggestion-person",
          method: "POST",
          data: this.data
        });

        if (result.success) {
          this.suggestions = result.data?.suggestions || [];
        } else {
          this.suggestions = [];
        }
      } catch (error) {
        this.loading = false;
        this.showAlert("error", "Ocurrió un error al cargar las sugerencias.", 3000);
      } finally {
        this.loading = false;
      }
    },

    nextStep() {
      if (this.step < this.steps.length - 1) {
        this.step++;
      } else {
        this.dialog = false;
        this.step = 0;
        this.save();
      }
    },

    async save() {
      this.loading = true;
      if (this.editedIndex === -1) {
        this.valid = false;
        const fieldsToUpdate = ['home_id', 'person_id', 'title', 'description', 'content', 'date', 'status', 'type'];

        let updatedFields = Object.keys(this.editedItem)
          .filter((key) => fieldsToUpdate.includes(key) && this.editedItem[key] !== this.originalItem[key])
          .reduce((obj, key) => {
            obj[key] = this.editedItem[key];
            return obj;
          }, {});

        if (Object.keys(updatedFields).length > 0) {
          updatedFields.date = this.editedItem.date ? this.editedItem.date : new Date();
          updatedFields.home_id = Number(this.home_id);
          updatedFields.person_id = Number(this.person_id);

          try {
            const result = await handleRequest({
              endpoint: 'suggestion',
              method: 'POST',
              data: updatedFields
            });

            if (result.success) {
              this.loading = false;
              this.showAlert("success", result.message, 3000);
              this.initialize();
            } else {
              this.loading = false;
              this.showAlert("warning", result.message, 3000);
            }
          } catch (error) {
            this.loading = false;
            this.showAlert("error", "Ocurrió un error inesperado al procesar la solicitud.", 3000);
          }
        } else {
          this.loading = false;
          this.showAlert("success", "Debe completar los datos de la sugerencia.", 3000);
        }
      } else {
        this.valid = false;
        const fieldsToUpdate = ['home_id', 'person_id', 'title', 'description', 'content', 'date', 'status', 'type'];
        let updatedFields = Object.keys(this.editedItem)
          .filter((key) => fieldsToUpdate.includes(key) && this.editedItem[key] !== this.originalItem[key])
          .reduce((obj, key) => {
            obj[key] = this.editedItem[key];
            return obj;
          }, {});

        if (Object.keys(updatedFields).length > 0) {
          updatedFields.id = this.editedItem.id;
          
          try {
            const result = await handleRequest({
              endpoint: 'suggestion-update',
              method: 'POST',
              data: updatedFields
            });

            if (result.success) {
              this.loading = false;
              this.showAlert("success", result.message, 3000);
              this.initialize();
            } else {
              this.loading = false;
              this.showAlert("warning", result.message, 3000);
            }
          } catch (error) {
            this.loading = false;
            this.showAlert("error", "Ocurrió un error inesperado al procesar la solicitud.", 3000);
          }
        } else {
          this.loading = false;
          this.showAlert("success", "No se realizaron cambios.", 3000);
        }
      }
      this.close();
    },

    async editItem(item) {
      this.editedIndex = 1;
      this.originalItem = Object.assign({}, item);
      this.editedItem = Object.assign({}, item);
      this.dateInput = item.date || null;
      
      try {
        const result = await handleRequest({
          endpoint: 'get-suggestions-data',
          method: 'POST',
        });

        if (result.success) {
          this.types = result.data?.types || [];
        } else {
          this.types = [];
        }
      } catch (error) {
        this.showAlert('error', 'Ocurrió un error inesperado al cargar los tipos de sugerencias.', 3000);
      } finally {
        this.dialog = true;
      }
    },

    deleteItem(item) {
      this.editedIndex = 1;
      this.editedItem.id = item.id;
      this.dialogDelete = true;
    },

    closeDelete() {
      this.dialogDelete = false;
      this.$nextTick(() => {
        this.editedItem = Object.assign({}, this.defaultItem);
      });
    },

    async deleteItemConfirm() {
      this.loading = true;
      try {
        const result = await handleRequest({
          endpoint: "delete-suggestion",
          method: "POST",
          data: { id: this.editedItem.id },
        });

        if (result.success) {
          this.showAlert("success", result.message, 3000);
          this.initialize();
        } else {
          this.showAlert("warning", result.message, 3000);
        }
      } catch (error) {
        this.showAlert("error", "Ocurrió un error al eliminar la sugerencia.", 3000);
      } finally {
        this.loading = false;
        this.closeDelete();
      }
    },

    showAlert(sb_type, sb_message, sb_timeout) {
      this.sb_type = sb_type;

      if (sb_type == "success") {
        this.sb_title = "Éxito";
        this.sb_icon = "mdi-check-circle";
      }

      if (sb_type == "error") {
        this.sb_title = "Error";
        this.sb_icon = "mdi-alert-circle";
      }

      if (sb_type == "warning") {
        this.sb_title = "Advertencia";
        this.sb_icon = "mdi-alert-circle";
      }
      this.sb_message = sb_message;
      this.sb_timeout = sb_timeout;
      this.snackbar = true;
    },
  },
};
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
.text-truncate-3-lines {
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
  text-overflow: ellipsis;
  line-height: 1.4;
  max-height: 4.2em;
}

.v-tooltip__content {
  font-size: 0.875rem;
  line-height: 1.5;
  padding: 8px 12px;
  background-color: rgba(97, 97, 97, 0.9);
}

.v-card {
  transition: all 0.2s ease;
}

.v-card:hover {
  transform: translateY(-3px);
  box-shadow: 0 6px 16px rgba(0, 0, 0, 0.1) !important;
}

.fullscreen-dialog {
  height: 100vh !important;
  max-height: 100vh !important;
  min-width: 100vh;
  margin: 0 !important;
  padding: 0 !important;
}

.v-chip {
  margin-right: 4px;
  margin-bottom: 4px;
}

.v-timeline-item {
  padding-bottom: 16px;
}

.v-text-field,
.v-select,
.v-textarea {
  margin-bottom: 12px;
}

.v-btn--icon {
  transition: all 0.2s ease;
}

.v-btn--icon:hover {
  transform: scale(1.1);
}
</style>