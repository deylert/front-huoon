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
      <h2 class="text-h5 font-weight-bold">{{ $t("viewTitles.diagnosis") }}</h2>
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
    <template v-if="diagnoses.length > 0">
  <!-- Tarjetas de diagnósticos -->
  <v-card
    v-for="(diagnosis, index) in diagnoses"
    :key="index"
    class="mb-3 rounded-lg"
    elevation="2"
  >
    <v-row no-gutters class="ma-0">
      <!-- Barra lateral con fecha (sin fondo verde) -->
      <v-col cols="1" class="py-2 d-flex flex-column align-center justify-center">
        <div class="font-weight-bold text-body-2 text-center text-grey-darken-2">
          {{ formatDate(diagnosis.date) }}
        </div>
      </v-col>

      <!-- Contenido principal en columnas -->
      <v-col cols="10" class="d-flex align-start pe-2 gap-2 py-2">
        <v-row no-gutters>
          <!-- Primera columna: Tipo y CIE10 -->
          <v-col cols="12" md="4" class="pa-2">
            <div class="d-flex flex-column gap-1">
              <!-- Tipo de diagnóstico -->
              <div>
                <div class="text-caption font-weight-bold text-grey-darken-2">
                  {{ $t("diagnoses.fields.type") }}:
                </div>
                <div class="text-body-2">
                  {{ diagnosis.typeName || 'N/A' }}
                </div>
              </div>
              
              <!-- Código CIE10 -->
              <div class="mt-2">
                <div class="text-caption font-weight-bold text-grey-darken-2">
                  {{ $t("diagnoses.fields.cie10_code") }}:
                </div>
                <div class="text-body-2">
                  {{ diagnosis.cie10_code || 'N/A' }}
                </div>
              </div>
            </div>
          </v-col>

          <!-- Segunda columna: Descripción -->
          <v-col cols="12" md="4" class="pa-2">
            <div>
              <div class="text-caption font-weight-bold text-grey-darken-2">
                {{ $t("diagnoses.fields.description") }}:
              </div>
              <div class="text-body-2 text-pre-wrap">
                {{ diagnosis.description || 'N/A' }}
              </div>
            </div>
          </v-col>

          <!-- Tercera columna: Notas -->
          <v-col cols="12" md="4" class="pa-2">
            <div>
              <div class="text-caption font-weight-bold text-grey-darken-2 mb-1">
                {{ $t("diagnoses.fields.notes") }}:
              </div>
              <div v-if="diagnosis.notes" class="text-body-2 text-pre-wrap">
                {{ diagnosis.notes }}
              </div>
              <div v-else class="text-body-2 text-grey">
                {{ $t("diagnoses.noNotes") }}
              </div>
            </div>
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
          @click="editItem(diagnosis)"
        >
          <v-icon>mdi-pencil</v-icon>
        </v-btn>
        <v-btn
          icon
          variant="text"
          color="red-darken-2"
          size="small"
          @click="deleteItem(diagnosis)"
        >
          <v-icon>mdi-close</v-icon>
        </v-btn>
      </v-col>
    </v-row>
  </v-card>
</template>
    <template v-else>
      <v-col cols="12" class="text-center py-8 pa-0">
        <v-icon size="64" color="grey-lighten-1">mdi-clipboard-text-off</v-icon>
        <div class="text-h6 text-grey mt-4">
          {{ $t("diagnoses.noRecords") }}
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
            {{ $t("diagnoses.formInstructions") }}
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
                      <strong>{{
                        $t(`diagnoses.steps.${s.title}.title`)
                      }}</strong>
                      <div class="text-caption text-grey">
                        {{ $t(`diagnoses.steps.${s.title}.subtitle`) }}
                      </div>
                    </div>
                  </template>
                </v-timeline-item>
              </v-timeline>
            </v-col>

            <!-- Contenido dinámico según paso -->
            <v-col cols="9">
              <h3 class="text-deep-purple-accent-3 mb-8">
                {{ $t(`diagnoses.steps.${steps[step].title}.title`) }}
              </h3>

              <!-- Paso 1: Detalles del diagnóstico -->
              <v-row dense v-if="step === 0">
                <v-col cols="12" sm="6">
                  <v-autocomplete 
                    v-model="editedItem.type_id"
                    :items="diagnosisTypes" 
                    :label="$t('diagnoses.fields.type')" 
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
                    v-model="editedItem.cie10_code"
                    :label="$t('diagnoses.fields.cie10_code')"
                    variant="underlined"
                    :rules="cie10Rules"
                  />
                </v-col>

                <v-col cols="12">
                  <v-textarea
                    v-model="editedItem.description"
                    :label="$t('diagnoses.fields.description')"
                    variant="underlined"
                    rows="3"
                    auto-grow
                    :rules="descriptionRules"
                  />
                </v-col>
              </v-row>

              <!-- Step 2: Información adicional -->
              <v-row dense v-if="step === 1">
                <v-col cols="12">
                  <v-textarea
                    v-model="editedItem.notes"
                    :label="$t('diagnoses.fields.notes')"
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
                        :label="$t('diagnoses.fields.date')"
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
            $t("deleteDialog.title", { item: $t(`deleteDialog.items.diagnosis`) })
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
        subtitle: "diagnosis_information",
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
    diagnoses: [],
    diagnosisTypes: [],
    dateMenu: false,
    dateInput: null,
    home_id: "",
    person_id: "",
    editedItem: {
      id: "",
      type_id: null,
      description: "",
      cie10_code: "",
      notes: "",
      date: null,
    },

    defaultItem: {
      id: "",
      type_id: null,
      description: "",
      cie10_code: "",
      notes: "",
      date: null,
    },

    editedIndex: -1,
    search: "",
    descriptionRules: [
      (v) => !!v || "La descripción es requerida",
      (v) => (v && v.length <= 500) || "La descripción debe tener menos de 500 caracteres",
    ],
    cie10Rules: [
      (v) => !v || (v && v.length <= 20) || "El código CIE-10 no debe exceder los 20 caracteres"
    ],
    typeRules: [
      (v) => !!v || "El tipo de diagnóstico es requerido"
    ],
  }),

  computed: {
    formTitle() {
      return this.editedIndex === -1
        ? this.$t("diagnoses.titles.new")
        : this.$t("diagnoses.titles.edit");
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
      this.data.type = 'Diagnostico';
      try {
        const result = await handleRequest({
          endpoint: 'get-type-diagnoses',
          method: 'POST',
          data: this.data
        });

        if (result.success) {
          this.diagnosisTypes = result.data?.types || [];
        } else {
          this.diagnosisTypes = [];
        }
      } catch (error) {
        this.showAlert('error', 'Ocurrió un error inesperado al cargar los tipos de diagnóstico.', 3000);
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
          endpoint: "diagnoses-person",
          method: "POST",
        });

        if (result.success) {
          this.diagnoses = result.data?.diagnoses || [];
        } else {
          this.diagnoses = [];
        }
      } catch (error) {
        this.loading = false;
        this.showAlert(
          "error",
          "Ocurrió un error inesperado al cargar los diagnósticos.",
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

    async save() {
      this.loading = true;
      if (this.editedIndex === -1) {
        // Crear nuevo diagnóstico
        const fieldsToUpdate = [
          "type_id",
          "description",
          "cie10_code",
          "notes",
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

        try {
          const result = await handleRequest({
            endpoint: "diagnosis",
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
          this.showAlert("error", "Ocurrió un error al guardar el diagnóstico", 3000);
        }
      } else {
        // Actualizar diagnóstico existente
        const fieldsToUpdate = [
          "type_id",
          "description",
          "cie10_code",
          "notes",
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
              endpoint: "diagnosis-update",
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
              "Ocurrió un error al actualizar el diagnóstico",
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
      // Inicializa dateInput con la fecha del item
        this.dateInput = item.date || null;  // <-- Esta es la línea clave
      this.data = {};
      this.data.type = 'Diagnostico';
      try {
        const result = await handleRequest({
          endpoint: 'get-type-diagnoses',
          method: 'POST',
          data: this.data
        });

        if (result.success) {
          this.diagnosisTypes = result.data?.types || [];
        } else {
          this.diagnosisTypes = [];
        }
      } catch (error) {
        this.showAlert('error', 'Ocurrió un error inesperado al cargar los tipos de diagnóstico.', 3000);
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
          endpoint: "diagnoss-delete",
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

    compactDiagnosisData(diagnosis) {
      return [
        {
          label: this.$t("diagnoses.fields.type"),
          value: diagnosis.type_name || "N/R",
          fullLabel: this.$t("diagnoses.fields.type"),
          fullValue: diagnosis.type_name || this.$t("diagnoses.notRecorded"),
          icon: "mdi-heart-pulse",
          color: "indigo-darken-2",
        },
        {
          label: this.$t("diagnoses.fields.cie10_code"),
          value: diagnosis.cie10_code || "N/R",
          fullLabel: this.$t("diagnoses.fields.cie10_code"),
          fullValue: diagnosis.cie10_code || this.$t("diagnoses.notRecorded"),
          icon: "mdi-barcode",
          color: "green-darken-2",
        },
        {
          label: this.$t("diagnoses.fields.description"),
          value: this.truncateText(diagnosis.description) || "N/R",
          fullLabel: this.$t("diagnoses.fields.description"),
          fullValue: diagnosis.description || this.$t("diagnoses.notRecorded"),
          icon: "mdi-text",
          color: "red-darken-2",
        },
      ].filter((item) => item.value !== "N/R");
    },

    compactNotes(diagnosis) {
      return [
        {
          label: this.$t("diagnoses.fields.notes"),
          text: this.truncateText(diagnosis.notes) || "-",
          fullLabel: this.$t("diagnoses.fields.notes"),
          fullText: diagnosis.notes || this.$t("diagnoses.notRecorded"),
          icon: "mdi-information",
          color: "teal-darken-1",
        },
      ].filter((note) => note.text !== "-");
    },

    truncateText(text, length = 15) {
      if (!text) return null;
      return text.length > length ? text.substring(0, length) + "..." : text;
    },
  },
};
</script>

<style scoped>
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