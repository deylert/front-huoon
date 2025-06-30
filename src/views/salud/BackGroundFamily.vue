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
      <h2 class="text-h5 font-weight-bold">{{ $t("viewTitles.familyBackground") }}</h2>
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
    <template v-if="backgroundFamilies.length > 0">
      <!-- Tarjetas de antecedentes familiares -->
      <v-card
        v-for="(background, index) in backgroundFamilies"
        :key="index"
        class="mb-3 rounded-lg"
        elevation="2"
      >
        <v-row no-gutters class="ma-0">
          <!-- Barra lateral con fecha -->
          <v-col cols="1" class="py-2 d-flex flex-column align-center justify-center">
            <div class="date white--text font-weight-bold text-body-2 text-center">
              {{ formatDate(background.date) }}
            </div>
          </v-col>

          <!-- Contenido principal -->
          <v-col cols="10" class="d-flex align-center pe-2 gap-2 py-2">
            <v-row align="center" justify="space-between" no-gutters>
              <div>
                <!-- Datos principales -->
                <div class="d-flex flex-wrap align-center gap-2 mb-2">
                  <v-tooltip
                    v-for="(item, i) in compactBackgroundData(background)"
                    :key="i"
                    bottom
                  >
                    <template v-slot:activator="{ props }">
                      <v-chip
                        v-bind="props"
                        size="small"
                        :color="item.color"
                        class="mr-1"
                        text-color="white"
                      >
                        <v-icon
                          start
                          size="small"
                          :icon="item.icon"
                          color="white"
                        ></v-icon>
                        <span class="text-body-2"
                          >{{ item.label }}: {{ item.value }}</span
                        >
                      </v-chip>
                    </template>
                    <span
                      >{{ item.fullLabel || item.label }}:
                      {{ item.fullValue || item.value }}</span
                    >
                  </v-tooltip>
                </div>

                <!-- Sección de Detalles -->
                <div class="mt-2">
                  <div class="text-caption font-weight-bold text-grey-darken-2 mb-1">
                    {{ $t("familyBackground.fields.details") }}:
                  </div>
                  <div class="d-flex flex-wrap gap-1">
                    <v-tooltip
                      v-for="(detail, i) in compactDetails(background)"
                      :key="'detail' + i"
                      bottom
                    >
                      <template v-slot:activator="{ props }">
                        <v-chip
                          v-bind="props"
                          size="small"
                          variant="outlined"
                          :color="detail.color"
                          class="mr-1"
                        >
                          <v-icon left size="small" :icon="detail.icon"></v-icon>
                          <span class="text-body-2">{{ detail.label }}</span>
                          <span class="ml-1 text-body-2">- {{ detail.text }}</span>
                        </v-chip>
                      </template>
                      <span>{{ detail.fullLabel }}: {{ detail.fullText }}</span>
                    </v-tooltip>
                  </div>
                </div>
              </div>
            </v-row>
          </v-col>

          <!-- Acciones -->
          <v-col cols="1" class="d-flex align-center pe-4 gap-2">
            <v-btn
              icon
              variant="text"
              color="green-darken-2"
              size="small"
              @click="editItem(background)"
            >
              <v-icon>mdi-pencil</v-icon>
            </v-btn>
            <v-btn
              icon
              variant="text"
              color="red-darken-2"
              size="small"
              @click="deleteItem(background)"
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
          {{ $t("familyBackground.noRecords") }}
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
            {{ $t("familyBackground.formInstructions") }}
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
                        $t(`familyBackground.steps.${s.title}.title`)
                      }}</strong>
                      <div class="text-caption text-grey">
                        {{ $t(`familyBackground.steps.${s.title}.subtitle`) }}
                      </div>
                    </div>
                  </template>
                </v-timeline-item>
              </v-timeline>
            </v-col>

            <!-- Contenido dinámico según paso -->
            <v-col cols="9">
              <h3 class="text-deep-purple-accent-3 mb-8">
                {{ $t(`familyBackground.steps.${steps[step].title}.title`) }}
              </h3>

              <!-- Paso 1: Detalles -->
              <v-row dense v-if="step === 0">
                <v-col cols="12" sm="6">
                  <v-autocomplete 
                    v-model="editedItem.type_id"
                    :items="backgroundTypes" 
                    :label="$t('familyBackground.fields.type')" 
                    item-title="nameTranslated"
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
                                {{ item.raw.descriptionTranslated }}
                              </div>
                            </template>
                            <span>{{ item.raw.descriptionTranslated }}</span>
                          </v-tooltip>
                        </v-list-item-subtitle>
                      </v-list-item>
                    </template>
                  </v-autocomplete>
                </v-col>

                <v-col cols="12" sm="6">
                  <v-select v-model="editedItem.relationship" :items="relationships" item-title="name" item-value="id"
                    :label="$t('familyBackground.fields.relationship')" variant="underlined" :rules="selectRules">
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
                  </v-select>
                </v-col>

                <v-col cols="12">
                  <v-text-field
                    v-model="editedItem.disease"
                    :label="$t('familyBackground.fields.disease')"
                    variant="underlined"
                    :rules="diseaseRules"
                  />
                </v-col>
              </v-row>

              <!-- Step 2: Información adicional -->
              <v-row dense v-if="step === 1">
                <v-col cols="12" >
                  <v-textarea
                    v-model="editedItem.details"
                    :label="$t('familyBackground.fields.details')"
                    variant="underlined"
                    rows="3"
                    auto-grow
                  />
                </v-col>

                <v-col cols="12" sm="6">
                  <v-text-field
                    v-model="editedItem.diagnosis_age"
                    :label="$t('familyBackground.fields.diagnosis_age')"
                    variant="underlined"
                    type="number"
                    min="0"
                    max="120"
                    :rules="diagnosisAgeRules"
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
                        :label="$t('familyBackground.fields.date')"
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

              <!-- Step 3: Fechas -->
              <v-row dense v-if="step === 2">
                <v-col cols="12">
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
                        :label="$t('familyBackground.fields.date')"
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
            $t("deleteDialog.title", { item: $t(`deleteDialog.items.familyBackground`) })
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
        subtitle: "family_information",
      },
      {
        title: "additional",
        subtitle: "medical_details",
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
    backgroundFamilies: [],
    tittlePerson: -1,
    selectedItems: {},
    backgroundTypes: [],
    relationships: [],
    dateMenu: false,
    dateInput: null,
    home_id: "",
    data: {},
    dialogAddPeople: false,
    person_id: "",
    editedItem: {
      id: "",
      type_id: null,
      relationship: null,
      disease: "",
      details: "",
      date: null,
      diagnosis_age: null,
    },

    defaultItem: {
      id: "",
      type_id: null,
      relationship: null,
      disease: "",
      details: "",
      date: null,
      diagnosis_age: null,
    },

    optionalItem: {
      id: "",
      type_id: null,
      relationship: null,
      disease: "",
      details: "",
      date: null,
      diagnosis_age: null,
    },

    editedIndex: -1,
    search: "",
    nameRules: [
      (v) => !!v || "El campo es requerido",
      (v) => (v && v.length <= 50) || "El campo debe tener menos de 51 caracteres",
      (v) => (v && v.length >= 3) || "El campo debe tener al menos de 3 caracteres",
    ],
    selectRules: [(v) => !!v || "Seleccionar al menos un elemento"],
    descriptionRules: [
      (v) =>
        !v ||
        v.length <= 200 ||
        this.$t("familyBackground.validationMessages.description.maxLength"),
    ],
    ageRules: [
      (v) => !v || (v >= 0 && v <= 120) || "La edad debe estar entre 0 y 120 años"
    ],
    title: "",
    description: "",
    date: "",
    module: "",
  }),

  computed: {
    typeRules() {
      return [
        v => !!v || this.$t('familyBackground.validationMessages.type.required')
      ];
    },
    relationshipRules() {
      return [
        v => !!v || this.$t('familyBackground.validationMessages.relationship.required')
      ];
    },
    formTitle() {
      return this.editedIndex === -1
        ? this.$t("treatment.titles.new")
        : this.$t("treatment.titles.edit");
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
    translatedSteps() {
      const defaultSteps = [
        { title: "Información Familiar", subtitle: "Detalles del familiar" },
        { title: "Detalles Médicos", subtitle: "Información médica" },
      ];
      return this.$t("steps") || defaultSteps;
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
      this.data.type = "Salud";
      try {
        const result = await handleRequest({
          endpoint: 'get-type-relationship',
          method: 'POST',
          data: this.data
        });

        if (result.success) {
          this.backgroundTypes = result.data?.types || [];
          this.relationships  = result.data?.relationships || [];
        } else {
          this.backgroundTypes = [];
          this.relationships = [];
        }
      } catch (error) {
        this.showAlert('error', 'Ocurrió un error inesperado al cargar los datos.', 3000);
      } finally {
        this.dialog = true;
      }
    },

    close() {
      this.step = 0;
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
          endpoint: "get-family-background-person",
          method: "POST",
        });

        if (result.success) {
          this.backgroundFamilies = result.data?.backgrounds || [];
        } else {
          this.backgroundFamilies = [];
        }
      } catch (error) {
        this.loading = false;
        this.showAlert(
          "error",
          "Ocurrió un error inesperado al cargar los antecedentes familiares.",
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
        // Crear nuevo antecedente familiar
        const fieldsToUpdate = [
          "type_id",
          "relationship",
          "disease",
          "details",
          "date",
          "diagnosis_age"
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

        if (Object.keys(updatedFields).length > 0) {
          try {
            const result = await handleRequest({
              endpoint: "family-background",
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
            this.showAlert("error", "Ocurrió un error al guardar el antecedente familiar", 3000);
          }
        }
      } else {
        // Actualizar antecedente familiar existente
        const fieldsToUpdate = [
          "type_id",
          "relationship",
          "disease",
          "details",
          "date",
          "diagnosis_age"
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
              endpoint: "family-background-update",
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
              "Ocurrió un error al actualizar el antecedente familiar",
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
      this.data = {};
      this.data.type = "Salud";
      try {
        const result = await handleRequest({
          endpoint: 'get-type-relationship',
          method: 'POST',
          data: this.data
        });

        if (result.success) {
          this.backgroundTypes = result.data?.types || [];
          this.relationships = result.data?.relationships || [];
        } else {
          this.backgroundTypes = [];
          this.relationships = [];
        }
      } catch (error) {
        this.showAlert('error', 'Ocurrió un error inesperado al cargar los datos.', 3000);
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
        this.originalItem = Object.assign({}, this.defaultItem);
      });
    },

    async deleteItemConfirm() {
      this.loading = true;
      try {
        let request = {
          id: this.editedItem.id,
        };
        const result = await handleRequest({
          endpoint: "family-background-delete",
          method: "POST",
          data: request,
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

    compactBackgroundData(background) {
      return [
        {
          label: this.$t("familyBackground.fields.type"),
          value: background.type || "N/R",
          fullLabel: this.$t("familyBackground.fields.type"),
          fullValue: background.type || this.$t("familyBackground.notRecorded"),
          icon: "mdi-account-group",
          color: "indigo-darken-2",
        },
        {
          label: this.$t("familyBackground.fields.relationship"),
          value: background.relationship || "N/R",
          fullLabel: this.$t("familyBackground.fields.relationship"),
          fullValue: background.relationship || this.$t("familyBackground.notRecorded"),
          icon: "mdi-family-tree",
          color: "green-darken-2",
        },
        {
          label: this.$t("familyBackground.fields.disease"),
          value: this.truncateText(background.disease) || "N/R",
          fullLabel: this.$t("familyBackground.fields.disease"),
          fullValue: background.disease || this.$t("familyBackground.notRecorded"),
          icon: "mdi-heart-pulse",
          color: "red-darken-2",
        },
        {
          label: this.$t("familyBackground.fields.diagnosis_age"),
          value: background.diagnosis_age ? `${background.diagnosis_age} años` : "N/R",
          fullLabel: this.$t("familyBackground.fields.diagnosis_age"),
          fullValue: background.diagnosis_age ? `${background.diagnosis_age} años` : this.$t("familyBackground.notRecorded"),
          icon: "mdi-numeric",
          color: "orange-darken-2",
        },
      ].filter((item) => item.value !== "N/R");
    },

    compactDetails(background) {
      return [
        {
          label: this.$t("familyBackground.fields.details"),
          text: this.truncateText(background.details) || "-",
          fullLabel: this.$t("familyBackground.fields.details"),
          fullText: background.details || this.$t("familyBackground.notRecorded"),
          icon: "mdi-information",
          color: "teal-darken-1",
        },
      ].filter((detail) => detail.text !== "-");
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
</style>
