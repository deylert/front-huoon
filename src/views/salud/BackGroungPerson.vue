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
      <v-card class="pa-4" elevation="4" rounded="lg">
      <!-- Encabezado con foto y datos -->
      <v-card-text>
    <!-- Encabezado -->
    <v-row justify="space-between" align="center" class="mb-6">
      <h2 class="text-body-2 font-weight-bold">{{ $t("viewTitles.personalBackground") }}</h2>
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
    <template v-if="backgroundPersons.length > 0">
      <!-- Tarjetas de antecedentes personales -->
      <v-card
        v-for="(background, index) in backgroundPersons"
        :key="index"
        class="mb-3 rounded-lg pa-2"
        elevation="2"
      >
        <v-row>
          <!-- Barra lateral con fecha -->
           <v-col cols="1" class="d-flex align-center justify-center">
            <div class="icono-concavo d-flex flex-column justify-center justify-start"
              :class="`bg-${getTypeColor(background.typeName)}`">
              <div class="date-display">
                {{ formatIntuitiveDate(background.startDate) }}
              </div>
            </div>
          </v-col>
          <v-col cols="4" class="d-flex align-center pe-4 gap-2">
           <v-row align="center" class="gap-3">
              <div>
                <div class="text-body-2 font-weight-bold">
                  <span>
                    {{ background.typeName }}
                  </span>
                  <v-tooltip activator="parent" location="bottom" max-width="350px">
                    <span style="white-space: normal; word-break: break-word">{{ $t('personalBackground.fields.type') }}: {{
                      background.typeName }}</span>
                  </v-tooltip>
                </div>
                <div class="text-caption d-flex align-center text-grey-darken-1">
                  <span>
                    {{ background.description }}
                  </span>
                  <v-tooltip activator="parent" location="bottom" max-width="350px">
                    <span style="white-space: normal; word-break: break-word">{{ $t('personalBackground.fields.description') }}: {{ background.description }}</span>
                  </v-tooltip>
                </div>
              </div>
              </v-row>
              </v-col>
          <v-col cols="1" class="d-flex align-center pe-4 gap-2">
                <div class="text-body-2">
                  <span>
                    {{ background.status}}
                  </span>
                  <v-tooltip activator="parent" location="bottom" max-width="350px">
                    <span style="white-space: normal; word-break: break-word">{{ $t("personalBackground.fields.status") }}:
                      {{ background.status}}</span>
                  </v-tooltip>
                </div>
              </v-col>
          <v-col cols="1" class="d-flex align-center pe-4 gap-2">
                <div class="text-body-2">
                  <span>
                    {{ background.severity}}
                  </span>
                  <v-tooltip activator="parent" location="bottom" max-width="350px">
                    <span style="white-space: normal; word-break: break-word">{{ $t("personalBackground.fields.severity") }}:
                      {{ background.severity}}</span>
                  </v-tooltip>
                </div>
              </v-col>
           <v-col cols="4" class="d-flex align-center pe-4 gap-2">
                <div class="text-body-2">
                  <span>
                    {{ background.details}}
                  </span>
                  <v-tooltip activator="parent" location="bottom" max-width="350px">
                    <span style="white-space: normal; word-break: break-word">{{ $t("personalBackground.fields.details") }}:
                      {{ background.details}}</span>
                  </v-tooltip>
                </div>
              </v-col>

          <!-- Acciones -->
         <v-col cols="1" class="d-flex align-center ml-auto pe-4">
                <div class="d-flex">
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
              <v-icon>mdi-delete</v-icon>
            </v-btn>
            </div>
          </v-col>
        </v-row>
      </v-card>
    </template>
    <template v-else>
      <v-col cols="12" class="text-center py-8 pa-0">
        <v-icon size="64" color="grey-lighten-1">mdi-clipboard-text-off</v-icon>
        <div class="text-h6 text-grey mt-4">
          {{ $t("personalBackground.noRecords") }}
        </div>
      </v-col>
    </template>
    </v-card-text>
    </v-card>
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
            {{ $t("personalBackground.formInstructions") }}
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
                        $t(`personalBackground.steps.${s.title}.title`)
                      }}</strong>
                      <div class="text-caption text-grey">
                        {{ $t(`personalBackground.steps.${s.title}.subtitle`) }}
                      </div>
                    </div>
                  </template>
                </v-timeline-item>
              </v-timeline>
            </v-col>

            <!-- Contenido dinámico según paso -->
            <v-col cols="9">
              <h3 class="text-deep-purple-accent-3 mb-8">
                {{ $t(`personalBackground.steps.${steps[step].title}.title`) }}
              </h3>

              <!-- Paso 1: Detalles -->
              <v-row dense v-if="step === 0">
                <v-col cols="12" sm="6">
                  <v-autocomplete 
                  v-model="editedItem.type_id"
                  :items="backgroundTypes" 
                  :label="$t('personalBackground.fields.type')" 
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
                  <v-select v-model="editedItem.status" :items="status" item-title="name" item-value="id"
                    :label="$t('personalBackground.fields.status')" variant="underlined" :rules="selectRules">
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
                    v-model="editedItem.description"
                    :label="$t('personalBackground.fields.description')"
                    variant="underlined"
                    :rules="descriptionRules"
                  />
                </v-col>
              </v-row>

              <!-- Step 2: Información adicional -->
              <v-row dense v-if="step === 1">
                <v-col cols="12">
                  <v-textarea
                    v-model="editedItem.details"
                    :label="$t('personalBackground.fields.details')"
                    variant="underlined"
                    rows="3"
                    auto-grow
                  />
                </v-col>

                <v-col cols="12" sm="6">
                  <v-select v-model="editedItem.severity" :items="severity" item-title="name" item-value="id"
                    :label="$t('personalBackground.fields.severity')" variant="underlined" :rules="selectRules">
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
              </v-row>

              <!-- Step 3: Fechas -->
              <v-row dense v-if="step === 2">
                <v-col cols="12" md="6">
                  <v-menu
                    v-model="startDateMenu"
                    :close-on-content-click="false"
                    :nudge-right="40"
                    transition="scale-transition"
                    offset-y
                    min-width="290px"
                  >
                    <template v-slot:activator="{ props }">
                      <v-text-field
                        v-bind="props"
                        :modelValue="startDateFormatted"
                        variant="underlined"
                        :label="$t('personalBackground.fields.startDate')"
                        :rules="dateRules"
                      ></v-text-field>
                    </template>
                    <v-locale-provider>
                      <v-date-picker
                        color="#03626C"
                        :modelValue="startDateInput"
                        @update:model-value="updateStartDate"
                        format="yyyy-MM-dd"
                      ></v-date-picker>
                    </v-locale-provider>
                  </v-menu>
                </v-col>

                <v-col cols="12" md="6">
                  <v-menu
                    v-model="endDateMenu"
                    :close-on-content-click="false"
                    :nudge-right="40"
                    transition="scale-transition"
                    offset-y
                    min-width="290px"
                  >
                    <template v-slot:activator="{ props }">
                      <v-text-field
                        v-bind="props"
                        :modelValue="endDateFormatted"
                        variant="underlined"
                        :label="$t('personalBackground.fields.endDate')"
                        :rules="dateRules"
                      ></v-text-field>
                    </template>
                    <v-locale-provider>
                      <v-date-picker
                        color="#03626C"
                        :modelValue="endDateInput"
                        @update:model-value="updateEndDate"
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
            $t("deleteDialog.title", { item: $t(`deleteDialog.items.personalBackground`) })
          }}</span
        >
      </v-toolbar>
      <v-card-text class="mt-2 mb-2"> {{ $t("deleteDialog.message") }}</v-card-text>
      <v-divider></v-divider>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn color="grey" variant="flat" @click="closeDelete">{{
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
import { handleRequest } from "@/utils/api"; // Ruta al archivo
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
        subtitle: "background_information",
      },
      {
        title: "additional",
        subtitle: "clinical_details",
      },
      {
        title: "dates",
        subtitle: "timeline",
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
    backgroundPersons: [],
    tittlePerson: -1,
    selectedItems: {}, // Almacena las selecciones por rol
    backgroundTypes: [],
    status: [],
    severity: [],
    home_id: "",
    data: {},
    dialogAddPeople: false,
    person_id: "",
    editedItem: {
      id: "",
      type_id: null,
      description: "",
      details: "",
      startDate: null,
      endDate: null,
      status: null,
      severity: null,
    },

    defaultItem: {
      id: "",
      type_id: null,
      description: "",
      details: "",
      startDate: null,
      endDate: null,
      status:null,
      severity: null,
    },
    optionalItem: {
      id: "",
      type_id: null,
      description: "",
      details: "",
      startDate: null,
      endDate: null,
      status: null,
      severity: null,
    },

    startDateMenu: false,
    endDateMenu: false,
    startDateInput: null,
    endDateInput: null,
    editedIndex: -1,
    search: "",
    nameRules: [
      (v) => !!v || "El campo es requerido",
      (v) => (v && v.length <= 50) || "El campo debe tener menos de 51 caracteres",
      (v) => (v && v.length >= 3) || "El campo debe tener al menos de 3 caracteres",
    ],
    selectRules: [(v) => !!v || "Seleccionar al menos un elemento"],
    // Reglas de validación

    descriptionRules: [
      (v) =>
        !v ||
        v.length <= 200 ||
        this.$t("personalBackground.validationMessages.description.maxLength"),
    ],
    dateRules: [
      (v) =>
        !v ||
        !isNaN(Date.parse(v)) ||
        this.$t("personalBackground.validationMessages.date.invalid"),
    ],
    title: "",
    description: "",
    date: "",
    module: "",
  }),
  computed: {
    typeRules() {
      return [
        v => !!v || this.$t('personalBackground.validationMessages.type.required')
      ];
    },
    formTitle() {
      return this.editedIndex === -1
        ? this.$t("treatment.titles.new")
        : this.$t("treatment.titles.edit");
    },
    startDateFormatted() {
      const date = this.startDateInput ? new Date(this.startDateInput) : new Date();
      const day = date.getDate().toString().padStart(2, "0");
      const month = (date.getMonth() + 1).toString().padStart(2, "0");
      const year = date.getFullYear();
      return `${year}-${month}-${day}`;
    },
    endDateFormatted() {
      const date = this.endDateInput ? new Date(this.endDateInput) : new Date();
      const day = date.getDate().toString().padStart(2, "0");
      const month = (date.getMonth() + 1).toString().padStart(2, "0");
      const year = date.getFullYear();
      return `${year}-${month}-${day}`;
    },
    getStartDate() {
      return this.startDateInput ? new Date(this.startDateInput) : new Date();
    },
    getEndDate() {
      return this.endDateInput ? new Date(this.endDateInput) : new Date();
    },
    paginatedTasks() {
      if (!Array.isArray(this.tasks)) return []; // Verifica que tasks sea un array
      const start = (this.currentPage - 1) * this.itemsPerPage;
      const end = start + this.itemsPerPage;
      return this.tasks.slice(start, end);
    },
    pageCount() {
      return this.tasks?.length ? Math.ceil(this.tasks.length / this.itemsPerPage) : 0;
    },
    translatedSteps() {
      // Fallback en caso de que la traducción no esté disponible
      const defaultSteps = [
        { title: "Medicación", subtitle: "Detalles de la medicación" },
        { title: "Detalles", subtitle: "Instrucciones y propósito" },
        { title: "Fechas", subtitle: "Período del tratamiento" },
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
        Meta: "purple",
        // Agrega más tipos si es necesario
      };
      return colorMap[type] || "grey-lighten-1"; // Color por defecto
    },
    formatDate(dateString) {
      const [year, month, day] = dateString.split("-");
      return `${day}-${month}-${year}`;
    },
    // Filtra las personas para mostrar en cada card según el rol
    updateStartDate(val) {
      this.startDateInput = val;
      this.editedItem.startDate = this.startDateFormatted;
      this.startDateMenu = false;
    },
    updateEndDate(val) {
      this.endDateInput = val;
      this.editedItem.endDate = this.endDateFormatted;
      this.endDateMenu = false;
    },
    async showAdd() {
      this.editedIndex = -1;
      this.data = {},
      this.data.type = "Personal";
            try {
                const result = await handleRequest({
                    endpoint: 'get-type-state-severity',
                    method: 'POST',
                    data: this.data
                });

                if (result.success) {
                    // Si la solicitud es exitosa, asignamos las sucursales
                    this.backgroundTypes = result.data?.types || [];
                    this.status = result.data?.status || [];
                    this.severity = result.data?.severity || [];
                } else {
                    // Si no hay datos, asignamos un array vacío
                    this.backgroundTypes = [];
                    this.status = [];
                    this.severity = [];
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
      this.file = null;
      this.imgMiniatura = "";
      this.editedIndex = -1;
    },
    async initialize() {
      this.data = {};
      this.data.home_id = this.home_id;
      try {
        this.loading = true;
        const result = await handleRequest({
          endpoint: "get-background-person",
          method: "POST",
          //data: this.data,
        });

        if (result.success) {
          // Si la solicitud es exitosa, asignamos las sucursales
          this.backgroundPersons = result.data?.backgrounds || []; // Si no hay roles, asigna un arreglo vacío
        } else {
          // Si no hay datos, asignamos un array vacío
          this.backgroundPersons = [];
          //this.showAlert('success', result.message || 'No hay tareas disponibles.', 3000);
        }
      } catch (error) {
        this.loading = false;
        // Captura de errores no controlados
        this.showAlert(
          "error",
          "Ocurrió un error inesperado al cargar las tareas.",
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
        // Crear nuevo antecedente
        const fieldsToUpdate = [
          "type_id",
          "description",
          "details",
          "startDate",
          "endDate",
          "status",
          "severity",
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
              endpoint: "personal-background",
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
            this.showAlert("error", "Ocurrió un error al guardar el antecedente", 3000);
          }
        }
      } else {
        // Actualizar antecedente existente
        const fieldsToUpdate = [
          "type_id",
          "description",
          "details",
          "startDate",
          "endDate",
          "status",
          "severity",
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
              endpoint: "personal-background-update",
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
              "Ocurrió un error al actualizar el antecedente",
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
      // Filtrar las personas que tengan 'select' igual a 1
      //const selectedPeople = item.people.filter(person => person.select === 1);

      // Asignar a originalItem y editedItem solo las personas seleccionadas
      this.originalItem = Object.assign({}, item);
      this.editedItem = Object.assign({}, item);
      this.data = {},
      this.data.type = "Personal";
            try {
                const result = await handleRequest({
                    endpoint: 'get-type-state-severity',
                    method: 'POST',
                    data: this.data
                });

                if (result.success) {
                    // Si la solicitud es exitosa, asignamos las sucursales
                    this.backgroundTypes = result.data?.types || [];
                    this.status = result.data?.status || [];
                    this.severity = result.data?.severity || [];
                } else {
                    // Si no hay datos, asignamos un array vacío
                    this.backgroundTypes = [];
                    this.status = [];
                    this.severity = [];
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
          endpoint: "physical-exams-delete",
          method: "POST",
          data: request,
        });

        // Manejo de la respuesta según el resultado
        if (result.success) {
          this.showAlert("success", result.message, 3000);
          this.initialize();
        } else {
          this.showAlert("warning", result.message, 3000);
        }
      } catch (error) {
        // Este bloque captura errores inesperados fuera del manejo estándar
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
    /*compactBackgroundData(background) {
      return [
        {
          label: this.$t("personalBackground.fields.type"),
          value: background.type || "N/R",
          fullLabel: this.$t("personalBackground.fields.type"),
          fullValue: background.type || this.$t("personalBackground.notRecorded"),
          icon: "mdi-clipboard-pulse",
          color: "indigo-darken-2",
        },
        {
          label: this.$t("personalBackground.fields.status"),
          value: background.status || "N/R",
          fullLabel: this.$t("personalBackground.fields.status"),
          fullValue: background.status || this.$t("personalBackground.notRecorded"),
          icon: "mdi-heart-pulse",
          color: "red-darken-2",
        },
        {
          label: this.$t("personalBackground.fields.severity"),
          value: background.severity || "N/R",
          fullLabel: this.$t("personalBackground.fields.severity"),
          fullValue: background.severity || this.$t("personalBackground.notRecorded"),
          icon: "mdi-alert-circle",
          color: "orange-darken-2",
        },
      ].filter((item) => item.value !== "N/R");
    },*/
    compactDetails(background) {
      return [
        {
          label: this.$t("personalBackground.fields.description"),
          text: this.truncateText(background.description) || "-",
          fullLabel: this.$t("personalBackground.fields.description"),
          fullText: background.description || this.$t("personalBackground.notRecorded"),
          icon: "mdi-text-box-search",
          color: "blue-darken-1",
        },
        {
          label: this.$t("personalBackground.fields.details"),
          text: this.truncateText(background.details) || "-",
          fullLabel: this.$t("personalBackground.fields.details"),
          fullText: background.details || this.$t("personalBackground.notRecorded"),
          icon: "mdi-information",
          color: "teal-darken-1",
        },
      ].filter((detail) => detail.text !== "-");
    },
    truncateText(text, length = 15) {
      if (!text) return null;
      return text.length > length ? text.substring(0, length) + "..." : text;
    },
    calculateBMI() {
      if (this.editedItem.weight && this.editedItem.height) {
        const weight = parseFloat(this.editedItem.weight);
        const height = parseFloat(this.editedItem.height);
        this.editedItem.bmi = (weight / (height * height)).toFixed(2);
      } else {
        this.editedItem.bmi = "";
      }
    },

    getBMICategory(bmi) {
      if (!bmi) return "";
      const num = parseFloat(bmi);
      if (num < 18.5) return "Bajo peso";
      if (num < 25) return "Normal";
      if (num < 30) return "Sobrepeso";
      return "Obesidad";
    },

    getBMIColor(bmi) {
      if (!bmi) return "grey";
      const num = parseFloat(bmi);
      if (num < 18.5) return "blue";
      if (num < 25) return "green";
      if (num < 30) return "orange";
      return "red";
    },
  },
};
</script>
<style scoped>
.icono-concavo {
  width: 50px;
  height: 50px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 10px;
  color: white;
  /* Mantenemos solo el efecto cóncavo en el ícono 
  box-shadow: inset;*/
  position: relative;
  overflow: hidden;
}

.icono-concavo::after {
  content: "";
  position: absolute;
  top: 2px;
  left: 2px;
  right: 2px;
  bottom: 2px;
  border-radius: 8px;
  background: transparent;
}

.date-display {
  font-size: 0.75rem; /* Equivale a text-caption */
  font-weight: 500;
  text-align: center;
  word-break: break-word;
  white-space: normal;
}
.date-time-display .date {
  font-size: 0.9rem;
  font-weight: 500; /* medium */
  color: inherit; /* usa el color por defecto del tema */
}

.date-time-display .time {
  font-size: 0.9rem;
  font-weight: 400; /* regular */
  color: rgba(0, 0, 0, 0.6); /* gris medio */
  margin-top: 8px;
}
.smooth-hover {
  transition: all 0.5s ease;
}

.smooth-hover:hover {
  transform: translateY(-1px);
  box-shadow: 0 3px 6px rgba(0, 0, 0, 0.12) !important;
}
.fullscreen-dialog {
  height: 100vh !important;
  max-height: 100vh !important;
  min-width: 100vh;
  margin: 0 !important;
  padding: 0 !important;
}
.avatar-border {
  border: 2px solid #000;
  /* Aquí se define el borde */
}

.avatar-row {
  display: flex;
  flex-wrap: nowrap;
  justify-content: start;
}

.avatar-col {
  margin-right: -10px;
  /* Reduce the space between avatars */
}

.avatar-item {
  margin-right: -5px;
  /* Cambia el color del borde según desees */
  border-radius: 50%;
  transition: transform 0.2s ease, box-shadow 0.2s ease;
  /* Para que siga siendo redondo */
  box-sizing: border-box;
  /* Asegura que el borde no afecte el tamaño del avatar */
  /* Optional: reduce the space even further between avatars */
  /* Optional: reduce the space even further between avatars */
}

.text-secondary {
  color: #6c757d;
  /* Color gris claro */
  font-size: 0.85rem;
  /* Tamaño de texto más pequeño */
}

.custom-tooltip {
  background-color: #f5f5f5 !important;
  /* Fondo claro */
  color: #e5e5e5 !important;
  /* Texto oscuro */
  border-radius: 8px;
  /* Bordes redondeados */
  padding: 8px;
  /* Espaciado interno */
  box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.1);
  /* Sombra suave */
}

.avatar-item.hover-expand:hover {
  transform: scale(1.5);
  box-shadow: 0 0 0 rgba(0, 0, 0, 0.3);
}

.selected-tab {
  background-color: #03626c;
  /* Fondo del tab seleccionado */
  color: white;
  /* Texto blanco */
  border-radius: 4px;
  /* Esquinas redondeadas, opcional */
}

.people-scroll-container {
  width: 100%;
  overflow-x: auto;
  padding-bottom: 12px;
  /* Más espacio para el scroll */
  scrollbar-width: thin;
  /* Para navegadores modernos */
}

/* Estilo para la barra de scroll en WebKit */
.people-scroll-container::-webkit-scrollbar {
  height: 6px;
}

.people-scroll-container::-webkit-scrollbar-thumb {
  background-color: rgba(0, 0, 0, 0.2);
  border-radius: 3px;
}

.people-scroll-wrapper {
  display: inline-flex;
  gap: 12px;
  /* Más espacio entre cards */
  padding: 4px 8px;
  /* Padding para que no peguen a los bordes */
}

.person-card {
  cursor: pointer;
  transition: all 0.3s ease;
  width: 220px;
  /* Ancho fijo */
  flex-shrink: 0;
  /* Evita que se reduzcan */
  border-radius: 8px !important;
  /* Bordes más redondeados */
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05) !important;
  /* Sombra sutil por defecto */
}

.person-card:hover {
  transform: translateY(-3px);
  box-shadow: 0 6px 12px rgba(0, 0, 0, 0.1) !important;
}

.selected-person {
  border: 2px solid #03626c;
  background-color: rgba(3, 98, 108, 0.08) !important;
  /* Color más suave */
}

.current-user {
  border-left: 3px solid #1976d2;
  /* Indicador lateral para el usuario actual */
}

.person-info {
  max-width: calc(220px - 60px);
  /* 220px (card) - 40px (avatar) - 20px (márgenes) */
  overflow: hidden;
}

.text-truncate {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  display: block;
}

/* Mejor contraste para los subtítulos */
.v-card-subtitle {
  color: rgba(0, 0, 0, 0.7) !important;
}
.v-select input {
  color: #7e57c2;
  /* purple text input */
}

/* Estilo base para la tarjeta */
.v-card {
  transition: all 0.2s ease;
  position: relative;
  overflow: hidden;
}

/* Efecto hover más pronunciado */
.v-card:hover {
  transform: translateY(-3px);
  box-shadow: 0 6px 16px rgba(0, 0, 0, 0.1) !important;
}

/* Estilo para el tiempo de la reunión */
.meeting-time {
  min-width: 60px;
  padding-top: 2px; /* Alineación vertical */
}

/* Estilo para la sección de próximas tareas */
.next-meetings {
  background-color: rgba(245, 245, 245, 0.7);
  border-radius: 8px;
  padding: 8px;
  transition: background-color 0.3s ease;
}

.next-meetings:hover {
  background-color: rgba(245, 245, 245, 1);
}

/* Estilo para los avatares de participantes */
.v-avatar {
  transition: transform 0.2s ease;
}

.v-avatar:hover {
  transform: scale(1.1);
  z-index: 2;
}
</style>
