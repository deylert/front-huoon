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
  <v-container class="pa-4">
    <!-- Encabezado -->
    <v-row justify="space-between" align="center" class="mb-6">
      <h2 class="text-h5 font-weight-bold">{{ $t("viewTitles.consultations") }}</h2>
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
    <template v-if="consultations.length > 0">
      <!-- Tarjetas de consultas -->
      <v-card
        v-for="(consultation, index) in consultations"
        :key="index"
        class="mb-3 rounded-lg"
        elevation="2"
      >
        <v-row no-gutters class="ma-0">
          <!-- Barra lateral con fecha -->
          <v-col cols="1" class="py-2 d-flex flex-column align-center justify-center">
            <div class="font-weight-bold text-body-2 text-center text-grey-darken-2">
              {{ formatDate(consultation.date) }}
            </div>
          </v-col>

          <!-- Contenido principal en columnas -->
          <v-col cols="10" class="d-flex align-start pe-2 gap-2 py-2">
            <v-row no-gutters>
              <!-- Primera columna: Tipo y Profesional -->
              <v-col cols="12" md="4" class="pa-2">
                <div class="d-flex flex-column gap-1">
                  <!-- Tipo de consulta -->
                  <div>
                    <div class="text-caption font-weight-bold text-grey-darken-2">
                      {{ $t("consultations.fields.type") }}:
                    </div>
                    <div class="text-body-2">
                      {{ consultation.typeName || 'N/A' }}
                    </div>
                  </div>
                  
                  <!-- Profesional -->
                  <div class="mt-2">
                    <div class="text-caption font-weight-bold text-grey-darken-2">
                      {{ $t("consultations.fields.profesional") }}:
                    </div>
                    <div class="text-body-2">
                      {{ consultation.professional || 'N/A' }}
                    </div>
                  </div>
                </div>
              </v-col>

              <!-- Segunda columna: Motivo -->
              <v-col cols="12" md="4" class="pa-2">
                <div>
                  <div class="text-caption font-weight-bold text-grey-darken-2">
                    {{ $t("consultations.fields.reason") }}:
                  </div>
                  <div class="text-body-2 text-pre-wrap">
                    {{ consultation.reason || 'N/A' }}
                  </div>
                </div>
              </v-col>

              <!-- Tercera columna: Notas médicas -->
              <v-col cols="12" md="4" class="pa-2">
                <div class="text-caption font-weight-bold text-grey-darken-2 mb-1">
                  {{ $t('consultations.fields.medicalNotes') }}:
                </div>

                <v-tooltip location="bottom" max-width="400px">
                  <template v-slot:activator="{ props }">
                    <div 
                      v-bind="props"
                      class="text-body-2 text-truncate"
                      style="max-width: 300px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;"
                    >
                      {{ consultation.medicalNotes || $t('consultations.notRecorded') }}
                    </div>
                  </template>
                  <span>{{ consultation.medicalNotes || $t('consultations.notRecorded') }}</span>
                </v-tooltip>
              </v-col>
            </v-row>
          </v-col>

          <!-- Acciones -->
          <v-col cols="1" class="d-flex align-center justify-center pe-4 gap-2">
            <v-btn
              icon
              variant="text"
              color="green-darken-2"
              size="small"
              @click="editItem(consultation)"
            >
              <v-icon>mdi-pencil</v-icon>
            </v-btn>
            <v-btn
              icon
              variant="text"
              color="red-darken-2"
              size="small"
              @click="deleteItem(consultation)"
            >
              <v-icon>mdi-close</v-icon>
            </v-btn>
          </v-col>
        </v-row>
      </v-card>
    </template>
    <template v-else>
      <v-col cols="12" class="text-center py-8 pa-0">
        <v-icon size="64" color="grey-lighten-1">mdi-stethoscope</v-icon>
        <div class="text-h6 text-grey mt-4">
          {{ $t("consultations.noRecords") }}
        </div>
      </v-col>
    </template>
  </v-container>
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
          <h5 class="text-grey-darken-2 font-weight-medium">{{ formTitle }}</h5>
          <p class="text-grey-lighten-1">
            {{ $t("consultations.formInstructions") }}
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
                      <strong>{{ $t(`consultations.steps.${s.title}.title`) }}</strong>
                      <div class="text-caption text-grey">
                        {{ $t(`consultations.steps.${s.title}.subtitle`) }}
                      </div>
                    </div>
                  </template>
                </v-timeline-item>
              </v-timeline>
            </v-col>

            <!-- Contenido dinámico según paso -->
            <v-col cols="9">
              <h3 class="text-deep-purple-accent-3 mb-8">
                {{ $t(`consultations.steps.${steps[step].title}.title`) }}
              </h3>

              <!-- Paso 1: Detalles de la consulta -->
              <v-row dense v-if="step === 0">
                <v-col cols="12" sm="6">
                  <v-autocomplete 
                    v-model="editedItem.type_id"
                    :items="consultationTypes" 
                    :label="$t('consultations.fields.type')" 
                    item-title="name"
                    item-value="id" 
                    variant="underlined" 
                    :rules="typeRules"
                  >
                    <template v-slot:item="{ props, item }">
                      <v-list-item v-bind="props">
                        <v-list-item-subtitle class="d-flex flex-column">
                          <v-tooltip bottom>
                            <template v-slot:activator="{ props: tooltipProps }">
                              <div 
                                class="truncate" 
                                v-bind="tooltipProps"
                                style="white-space: nowrap; overflow: hidden; text-overflow: ellipsis;"
                              >
                                {{ item.raw.description }}
                              </div>
                            </template>
                            <span>{{ item.raw.description }}</span>
                          </v-tooltip>
                        </v-list-item-subtitle>
                      </v-list-item>
                    </template>
                  </v-autocomplete>
                </v-col>

                <v-col cols="12" sm="6">
                  <v-text-field
                    v-model="editedItem.professional"
                    :label="$t('consultations.fields.profesional')"
                    variant="underlined"
                    :rules="profesionalRules"
                  />
                </v-col>

                <v-col cols="12">
                  <v-textarea
                    v-model="editedItem.reason"
                    :label="$t('consultations.fields.reason')"
                    variant="underlined"
                    rows="3"
                    auto-grow
                    :rules="reasonRules"
                  />
                </v-col>
              </v-row>

              <!-- Step 2: Información adicional -->
              <v-row dense v-if="step === 1">
                <v-col cols="12">
                  <v-textarea
                    v-model="editedItem.medicalNotes"
                    :label="$t('consultations.fields.medicalNotes')"
                    variant="underlined"
                    rows="3"
                    auto-grow
                  />
                </v-col>

                <v-col cols="12" sm="6">
                  <v-menu
                    v-model="dateMenu"
                    :close-on-content-click="false"
                    :nudge-right="40"
                    transition="scale-transition"
                    offset-y
                    min-width="290px"
                  >
                    <template v-slot:activator="{ props }">
                      <v-text-field
                        v-bind="props"
                        :modelValue="dateFormatted"
                        variant="underlined"
                        :label="$t('consultations.fields.date')"
                        :rules="dateRules"
                      ></v-text-field>
                    </template>
                    <v-locale-provider>
                      <v-date-picker
                        color="#03626C"
                        :modelValue="dateInput"
                        @update:model-value="updateDate"
                        format="yyyy-MM-dd"
                      ></v-date-picker>
                    </v-locale-provider>
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
  <v-dialog v-model="dialogDelete" max-width="500px">
    <v-card>
      <v-toolbar color="#DA7171">
        <span class="text-subtitle-2 ml-4">
          {{
            $t("deleteDialog.title", { item: $t(`deleteDialog.items.consultation`) })
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
</template>

<script>
import { ref } from "vue";
import LocalStorageService from "@/LocalStorageService";
import { handleRequest } from "@/utils/api";
import _ from "lodash";
import { shallowRef } from "vue";

export default {
  data: () => ({
    selected: shallowRef([2]),
    selected2: null,
    step: 0,
    time: null,
    modal2: false,
    timePickerDialog: false,
    steps: [
      {
        title: "details",
        subtitle: "consultation_information",
      },
      {
        title: "additional",
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
    showDetails: false,
    dialog: false,
    dialogDelete: false,
    consultations: [],
    consultationTypes: [],
    dateMenu: false,
    dateInput: null,
    home_id: "",
    person_id: "",
    editedItem: {
      id: "",
      type_id: null,
      reason: "",
      professional: "",
      medicalNotes: "",
      date: null,
    },

    defaultItem: {
      id: "",
      type_id: null,
      reason: "",
      professional: "",
      medicalNotes: "",
      date: null,
    },

    editedIndex: -1,
    search: "",
    reasonRules: [
      (v) => !!v || "El motivo es requerido",
      (v) => (v && v.length <= 500) || "El motivo debe tener menos de 500 caracteres",
    ],
    profesionalRules: [
      (v) => !!v || "El profesional es requerido",
      (v) => (v && v.length <= 100) || "El nombre no debe exceder los 100 caracteres"
    ],
    typeRules: [
      (v) => !!v || "El tipo de consulta es requerido"
    ],
    dateRules: [
      (v) => !!v || "La fecha es requerida"
    ],
  }),

  computed: {
    formTitle() {
      return this.editedIndex === -1
        ? this.$t("consultations.titles.new")
        : this.$t("consultations.titles.edit");
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
    paginatedTasks() {
      if (!Array.isArray(this.tasks)) return [];
      const start = (this.currentPage - 1) * this.itemsPerPage;
      const end = start + this.itemsPerPage;
      return this.tasks.slice(start, end);
    },
    pageCount() {
      return this.tasks?.length ? Math.ceil(this.tasks.length / this.itemsPerPage) : 0;
    },
  },

  mounted() {
    this.home_id = JSON.parse(LocalStorageService.getItem("home_id"));
    this.person_id = JSON.parse(LocalStorageService.getItem("person_id"));
    this.initialize();
  },

  methods: {
    formatDate(dateString) {
      if (!dateString) return "N/R";
      const [year, month, day] = dateString.split("-");
      return `${day}-${month}-${year}`;
    },

    updateDate(val) {
      this.dateInput = val;
      this.editedItem.date = this.dateFormatted;
      this.dateMenu = false;
    },

    async showAdd() {
      this.editedIndex = -1;
      this.data = {};
      this.data.type = 'Consulta';
      try {
        const result = await handleRequest({
          endpoint: 'get-type-consultations',
          method: 'POST',
          data: this.data
        });

        if (result.success) {
          this.consultationTypes = result.data?.types || [];
        } else {
          this.consultationTypes = [];
        }
      } catch (error) {
        this.showAlert('error', 'Ocurrió un error inesperado al cargar los tipos de consulta.', 3000);
      } finally {
        this.dialog = true;
      }
    },

    close() {
      this.step = 0;
      this.dialog = false;
      this.$nextTick(() => {
        this.editedItem = Object.assign({}, this.defaultItem);
      });
      this.editedIndex = -1;
    },

    async initialize() {
      try {
        this.loading = true;
        const result = await handleRequest({
          endpoint: "get-medical-consultations",
          method: "POST",
        });

        if (result.success) {
          this.consultations = result.data?.consultations || [];
        } else {
          this.consultations = [];
        }
      } catch (error) {
        this.loading = false;
        this.showAlert(
          "error",
          "Ocurrió un error inesperado al cargar las consultas.",
          3000
        );
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
     formatDateForBackend(date) {
    const d = new Date(date);
    return d.toISOString().split('T')[0]; // Formato YYYY-MM-DD
    // O alternativamente:
    // return format(d, 'yyyy-MM-dd HH:mm:ss'); // Si usas date-fns
  },
    async save() {
      this.loading = true;
      if (this.editedIndex === -1) {
        // Crear nueva consulta
        const fieldsToUpdate = [
          "type_id",
          "reason",
          "professional",
          "medicalNotes",
          "date"
        ];

        let updatedFields = Object.keys(this.editedItem)
          .filter(
            (key) =>
              fieldsToUpdate.includes(key) &&
              this.editedItem[key] !== this.defaultItem[key]
          )
          .reduce((obj, key) => {
            obj[key] = this.editedItem[key];
            return obj;
          }, {});

        updatedFields.date = this.editedItem.date ? this.editedItem.date :this.formatDateForBackend(new Date());

        try {
          const result = await handleRequest({
            endpoint: "consultation-medical",
            method: "POST",
            data: updatedFields,
          });

          if (result.success) {
            this.showAlert("success", result.message, 3000);
            this.initialize();
          } else {
            this.showAlert("warning", result.message, 3000);
          }
        } catch (error) {
          this.showAlert("error", "Ocurrió un error al guardar la consulta", 3000);
        }
      } else {
        // Actualizar consulta existente
        const fieldsToUpdate = [
          "type_id",
          "reason",
          "professional",
          "medicalNotes",
          "date"
        ];

        let updatedFields = Object.keys(this.editedItem)
          .filter(
            (key) =>
              fieldsToUpdate.includes(key) &&
              this.editedItem[key] !== this.originalItem[key]
          )
          .reduce((obj, key) => {
            obj[key] = this.editedItem[key];
            return obj;
          }, {});

        if (Object.keys(updatedFields).length > 0) {
          updatedFields.id = this.editedItem.id;
          try {
            const result = await handleRequest({
              endpoint: "consultation-medical-update",
              method: "POST",
              data: updatedFields,
            });

            if (result.success) {
              this.showAlert("success", result.message, 3000);
              this.initialize();
            } else {
              this.showAlert("warning", result.message, 3000);
            }
          } catch (error) {
            this.showAlert(
              "error",
              "Ocurrió un error al actualizar la consulta",
              3000
            );
          }
        }
      }
      this.loading = false;
      this.close();
    },

    async editItem(item) {
      this.editedIndex = 1;
      this.originalItem = Object.assign({}, item);
      this.editedItem = Object.assign({}, item);
      this.dateInput = item.date || null;
      this.data = {};
      this.data.type = 'Consulta';
      try {
        const result = await handleRequest({
          endpoint: 'get-type-consultations',
          method: 'POST',
          data: this.data
        });

        if (result.success) {
          this.consultationTypes = result.data?.types || [];
        } else {
          this.consultationTypes = [];
        }
      } catch (error) {
        this.showAlert('error', 'Ocurrió un error inesperado al cargar los tipos de consulta.', 3000);
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
      this.data = {};
      this.data.id = this.editedItem.id;
      try {
        const result = await handleRequest({
          endpoint: "consultation-medical-delete",
          method: "POST",
          data: this.data,
        });

        if (result.success) {
          this.showAlert("success", result.message, 3000);
          this.initialize();
        } else {
          this.showAlert("warning", result.message, 3000);
        }
      } catch (error) {
        this.showAlert(
          "error",
          "Ocurrió un error inesperado al procesar la solicitud.",
          3000
        );
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
        this.sb_icon = "mdi-check-circle";
      }

      if (sb_type == "warning") {
        this.sb_title = "Advertencia";
        this.sb_icon = "mdi-alert-circle";
      }
      this.sb_message = sb_message;
      this.sb_timeout = sb_timeout;
      this.snackbar = true;
    },

    compactConsultationData(consultation) {
      return [
        {
          label: this.$t("consultations.fields.type"),
          value: consultation.type_name || "N/R",
          fullLabel: this.$t("consultations.fields.type"),
          fullValue: consultation.type_name || this.$t("consultations.notRecorded"),
          icon: "mdi-stethoscope",
          color: "indigo-darken-2",
        },
        {
          label: this.$t("consultations.fields.profesional"),
          value: consultation.professional || "N/R",
          fullLabel: this.$t("consultations.fields.profesional"),
          fullValue: consultation.professional || this.$t("consultations.notRecorded"),
          icon: "mdi-account-tie",
          color: "green-darken-2",
        },
        {
          label: this.$t("consultations.fields.reason"),
          value: this.truncateText(consultation.reason) || "N/R",
          fullLabel: this.$t("consultations.fields.reason"),
          fullValue: consultation.reason || this.$t("consultations.notRecorded"),
          icon: "mdi-text",
          color: "red-darken-2",
        },
      ].filter((item) => item.value !== "N/R");
    },

    truncateText(text, length = 15) {
      if (!text) return null;
      return text.length > length ? text.substring(0, length) + "..." : text;
    },
  },
};
</script>

<style scoped>
/* Mantener los mismos estilos que en Diagnosis.vue */
.date {
  padding: 4px 8px;
  border-radius: 4px;
  background-color: #03626C;
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

.text-truncate {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

/* Estilos para los chips */
.v-chip {
  margin-right: 4px;
  margin-bottom: 4px;
}

/* Estilos para la línea de tiempo */
.v-timeline-item {
  padding-bottom: 16px;
}

/* Estilos para los campos del formulario */
.v-text-field, .v-select, .v-textarea {
  margin-bottom: 12px;
}

/* Estilos para los botones de acción */
.v-btn--icon {
  transition: all 0.2s ease;
}

.v-btn--icon:hover {
  transform: scale(1.1);
}

/* Para mantener los saltos de línea en los textos */
.text-pre-wrap {
  white-space: pre-wrap;
}

/* Espaciado entre elementos */
.gap-1 {
  gap: 4px;
}

/* Ajustes para la fecha */
.date-column {
  border-right: 1px solid rgba(0, 0, 0, 0.12);
}
</style>