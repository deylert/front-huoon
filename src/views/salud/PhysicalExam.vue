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
      <h2 class="text-body-2 font-weight-bold">{{ $t('viewTitles.physicalExams') }}</h2>
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
    <template v-if="physicalExams.length > 0">
      <!-- Tarjetas de reuniones -->
      <v-card
        v-for="(exam, index) in physicalExams"
        :key="index"
        class="mb-3 rounded-lg pa-2"
        elevation="2"
      >
        <v-row>
          <!-- Barra lateral con fecha -->
          <v-col cols="1" class="d-flex align-center justify-center">
            <div class="icono-concavo d-flex flex-column justify-center justify-start"
              :class="`bg-${getTypeColor(exam.pulse)}`">
              <div class="date-display">
                {{ formatIntuitiveDate(exam.exam_date) }}
              </div>
            </div>
          </v-col>

          <!-- Contenido principal -->
          <v-col cols="10" class="d-flex align-center pe-2 gap-2 py-2">
            <v-row align="center" justify="space-between" no-gutters>
              <div>
                <!-- Datos principales -->
                <div class="d-flex flex-wrap align-center gap-2 mb-2">
                  <v-tooltip v-for="(item, i) in compactExamData(exam)" :key="i" bottom>
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

                <!-- Sección de Observaciones (manteniendo tu formato actual) -->
                <div class="mt-2">
                  <div class="text-caption font-weight-bold text-grey-darken-2 mb-1">
                    OBSERVACIONES:
                  </div>
                  <div class="d-flex flex-wrap gap-1">
                    <v-tooltip
                      v-for="(obs, i) in compactObservations(exam)"
                      :key="'obs' + i"
                      bottom
                    >
                      <template v-slot:activator="{ props }">
                        <v-chip
                          v-bind="props"
                          size="small"
                          variant="outlined"
                          :color="obs.color"
                          class="mr-1"
                        >
                          <v-icon left size="small" :icon="obs.icon"></v-icon>
                          <span class="text-body-2">{{ obs.label }}</span>
                          <span class="ml-1 text-body-2">- {{ obs.text }}</span>
                        </v-chip>
                      </template>
                      <span>{{ obs.fullLabel }}: {{ obs.fullText }}</span>
                    </v-tooltip>
                  </div>
                </div>
              </div>
            </v-row>
          </v-col>

          <!-- Acciones -->
           <v-col cols="1" class="d-flex align-center ml-auto pe-4">
                <div class="d-flex">
            <v-btn
              icon
              variant="text"
              color="green-darken-2"
              size="small"
              @click="editItem(exam)"
            >
              <v-icon>mdi-pencil</v-icon>
            </v-btn>
            <v-btn
              icon
              variant="text"
              color="red-darken-2"
              size="small"
              @click="deleteItem(exam)"
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
        <v-icon size="64" color="grey-lighten-1">mdi-check-circle-outline</v-icon>
        <div class="text-h6 text-grey mt-4">
          No ha actualizado la información de exámenes físicos
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
          <p class="text-grey-lighten-1">{{ $t("physicalExam.formInstructions") }}</p>

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
                      <strong>{{ $t(`physicalExam.steps.${s.title}.title`) }}</strong>
                      <div class="text-caption text-grey">
                        {{ $t(`physicalExam.steps.${s.title}.subtitle`) }}
                      </div>
                    </div>
                  </template>
                </v-timeline-item>
              </v-timeline>
            </v-col>

            <!-- Contenido dinámico según paso -->
            <v-col cols="9">
              <h3 class="text-deep-purple-accent-3 mb-8">
                {{ $t(`physicalExam.steps.${steps[step].title}.title`) }}
              </h3>

              <!-- Paso 1: Signos Vitales -->
              <v-row dense v-if="step === 0">
                <v-col cols="12" sm="6">
                  <v-text-field
                    v-model="editedItem.blood_pressure"
                    :label="$t('physicalExam.fields.blood_pressure')"
                    variant="underlined"
                    :rules="bloodPressureRules"
                    hint="120/80"
                    persistent-hint
                  />
                </v-col>

                <v-col cols="12" sm="6">
                  <v-text-field
                    v-model="editedItem.pulse"
                    :label="$t('physicalExam.fields.pulse')"
                    variant="underlined"
                    type="number"
                    :rules="pulseRules"
                  />
                </v-col>

                <v-col cols="12" sm="6">
                  <v-text-field
                    v-model="editedItem.temperature"
                    :label="$t('physicalExam.fields.temperature')"
                    variant="underlined"
                    type="number"
                    step="0.1"
                    :rules="temperatureRules"
                  />
                </v-col>

                <v-col cols="12" sm="6">
                  <v-text-field
                    v-model="editedItem.respiratory_rate"
                    :label="$t('physicalExam.fields.respiratory_rate')"
                    variant="underlined"
                    type="number"
                    :rules="respiratoryRateRules"
                  />
                </v-col>

                <v-col cols="12" md="6">
                  <v-menu
                    v-model="menu"
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
                        :label="$t('taskForm.today')"
                      ></v-text-field>
                    </template>
                    <v-locale-provider>
                      <v-date-picker
                        color="#03626C"
                        :modelValue="input"
                        @update:model-value="updateDate"
                        format="yyyy-MM-dd"
                      ></v-date-picker>
                    </v-locale-provider>
                  </v-menu>
                </v-col>
              </v-row>

              <!-- Step 1: Body Measurements -->

              <v-row dense v-if="step === 1">
                <v-col cols="12" sm="6">
                  <v-text-field
                    v-model="editedItem.weight"
                    :label="$t('physicalExam.fields.weight')"
                    variant="underlined"
                    type="number"
                    step="0.1"
                    :rules="weightRules"
                    @update:model-value="calculateBMI"
                  />
                </v-col>

                <v-col cols="12" sm="6">
                  <v-text-field
                    v-model="editedItem.height"
                    :label="$t('physicalExam.fields.height')"
                    variant="underlined"
                    type="number"
                    step="0.01"
                    :rules="heightRules"
                    @update:model-value="calculateBMI"
                  />
                </v-col>

                <v-col cols="12" sm="6">
                  <v-text-field
                    v-model="editedItem.bmi"
                    :label="$t('physicalExam.fields.bmi')"
                    variant="underlined"
                    readonly
                    :rules="bmiRules"
                  >
                    <template v-slot:append>
                      <v-chip
                        small
                        :color="getBMIColor(editedItem.bmi)"
                        text-color="white"
                      >
                        {{ getBMICategory(editedItem.bmi) }}
                      </v-chip>
                    </template>
                  </v-text-field>
                </v-col>
              </v-row>

              <!-- Step 2: Observations -->
              <v-row dense v-if="step === 2">
                <v-col cols="12" md="6">
                  <v-textarea
                    v-model="editedItem.neurological_observations"
                    :label="$t('physicalExam.fields.neurological_observations')"
                    variant="underlined"
                    rows="2"
                    auto-grow
                  />
                </v-col>

                <v-col cols="12" md="6">
                  <v-textarea
                    v-model="editedItem.cardiovascular_observations"
                    :label="$t('physicalExam.fields.cardiovascular_observations')"
                    variant="underlined"
                    rows="2"
                    auto-grow
                  />
                </v-col>

                <v-col cols="12" md="6">
                  <v-textarea
                    v-model="editedItem.respiratory_observations"
                    :label="$t('physicalExam.fields.respiratory_observations')"
                    variant="underlined"
                    rows="2"
                    auto-grow
                  />
                </v-col>

                <v-col cols="12" md="6">
                  <v-textarea
                    v-model="editedItem.digestive_observations"
                    :label="$t('physicalExam.fields.digestive_observations')"
                    variant="underlined"
                    rows="2"
                    auto-grow
                  />
                </v-col>

                <v-col cols="12" md="6">
                  <v-textarea
                    v-model="editedItem.urinary_observations"
                    :label="$t('physicalExam.fields.urinary_observations')"
                    variant="underlined"
                    rows="2"
                    auto-grow
                  />
                </v-col>

                <v-col cols="12" md="6">
                  <v-textarea
                    v-model="editedItem.other_findings"
                    :label="$t('physicalExam.fields.other_findings')"
                    variant="underlined"
                    rows="2"
                    auto-grow
                  />
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
          {{ $t("deleteDialog.title", { item: $t(`deleteDialog.items.physicalExam`) }) }}</span
        >
      </v-toolbar>
      <v-card-text class="mt-2 mb-2"> ¿{{ $t("deleteDialog.message") }}</v-card-text>
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
import { ref } from 'vue';
import LocalStorageService from "@/LocalStorageService";
import { handleRequest } from "@/utils/api"; // Ruta al archivo
import _ from "lodash";
import { shallowRef } from 'vue';


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
        title: 'vital_signs',
        subtitle: 'basic_patient_data'
      },
      {
        title: 'body_measurements',
        subtitle: 'weight_height_bmi'
      },
      {
        title: 'observations',
        subtitle: 'system_examination'
      }
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
    physicalExams: [],
    tittlePerson: -1,
    selectedItems: {}, // Almacena las selecciones por rol
    typetasks: [],
    home_id: "",
    data: {},
    dialogAddPeople: false,
    person_id: "",
    role_id: "",
    task_id: "",
    editedItem: {
      id: "",
      medical_consultation_id: null,
      blood_pressure: "",
      pulse: "",
      exam_date: null, // Fecha actual por defecto
      respiratory_rate: "",
      temperature: "",
      weight: "",
      height: "",
      bmi: "",
      neurological_observations: "",
      cardiovascular_observations: "",
      respiratory_observations: "",
      digestive_observations: "",
      urinary_observations: "",
      other_findings: ""
    },

    defaultItem: {
      id: "",
      medical_consultation_id: null,
      blood_pressure: "",
      pulse: "",
      exam_date: null, // Fecha actual por defecto
      respiratory_rate: "",
      temperature: "",
      weight: "",
      height: "",
      bmi: "",
      neurological_observations: "",
      cardiovascular_observations: "",
      respiratory_observations: "",
      digestive_observations: "",
      urinary_observations: "",
      other_findings: ""
    },

    originalItem: {
      id: "",
      medical_consultation_id: null,
      blood_pressure: "",
      pulse: "",
      exam_date: null, // Fecha actual por defecto
      respiratory_rate: "",
      temperature: "",
      weight: "",
      height: "",
      bmi: "",
      neurological_observations: "",
      cardiovascular_observations: "",
      respiratory_observations: "",
      digestive_observations: "",
      urinary_observations: "",
      other_findings: ""
    },

    menu: false,
    menu2: false,
    input: null,
    input2: null,
    editedIndex: -1,
    search: "",
    nameRules: [
      (v) => !!v || "El campo es requerido",
      (v) => (v && v.length <= 50) || "El campo debe tener menos de 51 caracteres",
      (v) => (v && v.length >= 3) || "El campo debe tener al menos de 3 caracteres",
    ],
    selectRules: [(v) => !!v || "Seleccionar al menos un elemento"],
     bloodPressureRules: [
      v => !v || /^\d{2,3}\/\d{2,3}$/.test(v) || 'Formato debe ser XXX/XX (ej. 120/80)'
    ],
    pulseRules: [
      v => !v || (v >= 30 && v <= 250) || 'Frecuencia debe estar entre 30-250 lpm'
    ],
    temperatureRules: [
      v => !v || (v >= 30 && v <= 45) || 'Temperatura debe estar entre 30-45°C'
    ],
    respiratoryRateRules: [
      v => !v || (v >= 10 && v <= 60) || 'Frecuencia debe estar entre 10-60 rpm'
    ],
    dateRules: [
      v => !v || !isNaN(Date.parse(v)) || 'Fecha inválida'
    ],
    weightRules: [
      v => !v || (v > 0 && v < 300) || 'Peso debe ser entre 0-300 kg'
    ],
    heightRules: [
      v => !v || (v > 0 && v < 3) || 'Altura debe ser entre 0-3 m'
    ],
    bmiRules: [
      v => !v || (v > 10 && v < 60) || 'IMC debe ser entre 10-60'
    ],

    title: '',
    description: '',
    date: '',
    module: '',
  }),
  computed: {
   formTitle() {
  return this.editedIndex === -1 
    ? this.$t('physicalExam.titles.new') 
    : this.$t('physicalExam.titles.edit');
},
    dateFormatted() {
      const date = this.input ? new Date(this.input) : new Date();
      const day = date.getDate().toString().padStart(2, "0");
      const month = (date.getMonth() + 1).toString().padStart(2, "0");
      const year = date.getFullYear();
      return `${year}-${month}-${day}`;
    },
    dateFormatted2() {
      const date = this.input2 ? new Date(this.input2) : new Date();
      const day = date.getDate().toString().padStart(2, "0");
      const month = (date.getMonth() + 1).toString().padStart(2, "0");
      const year = date.getFullYear();
      return `${year}-${month}-${day}`;
    },
    getDate() {
      return this.input ? new Date(this.input) : new Date();
    },
    getDate2() {
      return this.input2 ? new Date(this.input2) : new Date();
    },
    paginatedTasks() {
    if (!Array.isArray(this.tasks)) return []; // Verifica que tasks sea un array
    const start = (this.currentPage - 1) * this.itemsPerPage;
    const end = start + this.itemsPerPage;
    return this.tasks.slice(start, end);
  },
  pageCount() {
    return this.tasks?.length
      ? Math.ceil(this.tasks.length / this.itemsPerPage)
      : 0;
  },
  translatedSteps() {
      // Fallback en caso de que la traducción no esté disponible
      const defaultSteps = [
        { title: 'Información Básica', subtitle: 'Ingresa el título y descripción' },
        { title: 'Asignación', subtitle: 'Selecciona responsables y participantes' },
        { title: 'Programación', subtitle: 'Elige fecha y hora de la tarea' }
      ]

      return this.$t('steps') || defaultSteps
    }
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
    const [year, month, day] = dateString.split('-');
    return `${day}-${month}-${year}`;
  },
    getStatusById(statusId) {
      return this.status.find(status => status.id === statusId);
    },
    // Filtra las personas para mostrar en cada card según el rol
    updateDate(val) {
      this.input = val;
      this.editedItem.exam_date = this.dateFormatted;
      this.menu = false;
    },
    updateDate1(val) {
      this.input2 = val;
      this.editedItem.end_date = this.dateFormatted2;
      this.menu2 = false;
    },
    async showAdd() {
      this.editedIndex = -1;
      /*(this.file = null),
        (this.imgMiniatura = ""),
        (this.showDetails = false),
        (this.data = {});
      this.editedItem.home_id = this.home_id;
      this.data.home_id = this.editedItem.home_id;

      try {
        const result = await handleRequest({
          endpoint: "category-status-priority-apk",
          method: "POST",
          data: this.data,
        });

        if (result.success) {
          // Si la solicitud es exitosa, asignamos las sucursales
          this.categories = result.data?.taskcategories || [];
          this.status = result.data?.taskstatus || [];
          this.priorities = result.data?.taskpriorities || [];
          const normalPriority = this.priorities.find(
            (priority) => priority.name === "Normal"
          );
          if (normalPriority) {
            this.editedItem.priority_id = normalPriority.id;
          }
          this.recurrences = result.data?.taskrecurrences || [];
          const diaryRecurrence = this.recurrences.find(
            (recurrence) => recurrence.recurrenceName === "Diaria"
          );
          if (diaryRecurrence) {
            this.editedItem.recurrence = diaryRecurrence.name;
          }
          this.people = result.data?.taskpeople || [];
          this.roles = result.data?.taskroles || [];
          this.typetasks = result.data?.tasktype || [];
          console.log("typetasks:", this.typetasks);
          //
        } else {
          // Si no hay datos, asignamos un array vacío
          this.categories = [];
          this.status = [];
          this.priorities = [];
          this.recurrences = [];
          this.people = [];
          this.roles = [];
          this.typetasks = [];
          this.showAlert("info", result.message || "No hay datos disponibles.", 3000);
        }
      } catch (error) {
        this.showAlert("error", "Ocurrió un error inesperado al cargar los datos.", 3000);
      } finally {
        this.dialog = true;
      }*/
     this.dialog = true;
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
      const today = new Date();
      const year = today.getFullYear();
      const month = String(today.getMonth() + 1).padStart(2, "0"); // Meses son 0-11
      const day = String(today.getDate()).padStart(2, "0");

      const formattedDate = `${year}-${month}-${day}`; // Formato "YYYY-MM-DD"
      this.data.start_date = formattedDate;
      try {
        this.loading = true;
        const result = await handleRequest({
          endpoint: "physical-exams-person",
          method: "POST",
          //data: this.data,
        });

        if (result.success) {
          // Si la solicitud es exitosa, asignamos las sucursales
          this.physicalExams = result.data?.physicalExams || []; // Si no hay roles, asigna un arreglo vacío
        } else {
          // Si no hay datos, asignamos un array vacío
          this.physicalExams = [];
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
        this.step++
      } else {
        this.dialog = false
        this.step = 0
        this.save();
      }
    },
    async save() {
      this.loading = true;
      if (this.editedIndex === -1) {
        this.valid = false;
        const fieldsToUpdate = [
          "medical_consultation_id",

          // Signos vitales
          "blood_pressure",
          "pulse",
          "respiratory_rate",
          "temperature",

          // Fecha del examen
          "exam_date",

          // Medidas corporales
          "weight",
          "height",
          "bmi",

          // Observaciones por sistemas
          "neurological_observations",
          "cardiovascular_observations",
          "respiratory_observations",
          "digestive_observations",
          "urinary_observations",

          // Otros hallazgos
          "other_findings"
        ];
        let updatedFields = Object.keys(this.editedItem)
          .filter((key) => fieldsToUpdate.includes(key) && this.editedItem[key] !== this.originalItem[key])
          .reduce((obj, key) => {
            obj[key] = this.editedItem[key];
            return obj;
          }, {});

        // Agregar campos adicionales si es necesario
        if (Object.keys(updatedFields).length > 0) {
          updatedFields.exam_date = this.editedItem.exam_date
            ? this.editedItem.exam_date
            : `${new Date().getFullYear()}-${String(new Date().getMonth() + 1).padStart(
              2,
              "0"
            )}-${String(new Date().getDate()).padStart(2, "0")}`;
           try {
            const result = await handleRequest({
              endpoint: "physical-exams",
              method: "POST",
              data: updatedFields,
            });

            // Manejo de la respuesta según el resultado
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
            // Este bloque captura errores inesperados fuera del manejo estándar
            this.showAlert(
              "error",
              "Ocurrió un error inesperado al procesar la solicitud.",
              3000
            );
          }
        } else {
          this.loading = false;
          this.showAlert("success", "Debe completar los datos de la tarea.", 3000);
        }
      } else {
        this.valid = false;
        const fieldsToUpdate = [
          "medical_consultation_id",

          // Signos vitales
          "blood_pressure",
          "pulse",
          "respiratory_rate",
          "temperature",

          // Fecha del examen
          "exam_date",

          // Medidas corporales
          "weight",
          "height",
          "bmi",

          // Observaciones por sistemas
          "neurological_observations",
          "cardiovascular_observations",
          "respiratory_observations",
          "digestive_observations",
          "urinary_observations",

          // Otros hallazgos
          "other_findings"
        ];

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
              endpoint: "physical-exams-update",
              method: "POST",
              data: updatedFields,
            });

            // Manejo de la respuesta según el resultado
            if (result.success) {
              this.loading = false;
              this.showAlert("success", result.message, 3000);
              this.initialize();
            } else {
              this.loading = false;
              this.editedIndex = -1;
              this.showAlert("warning", result.message, 3000);
            }
          } catch (error) {
            this.loading = false;
            this.editedIndex = -1;
            // Este bloque captura errores inesperados fuera del manejo estándar
            this.showAlert(
              "error",
              "Ocurrió un error inesperado al procesar la solicitud.",
              3000
            );
          }
        } else {
          this.editedIndex = -1;
          this.loading = false;
          this.showAlert("success", "No se realizaron cambios.", 3000);
        }
      }
      this.close();
    },
    async editItem(item) {
      this.editedIndex = 1;
      // Filtrar las personas que tengan 'select' igual a 1
      //const selectedPeople = item.people.filter(person => person.select === 1);

      // Asignar a originalItem y editedItem solo las personas seleccionadas
      this.originalItem = Object.assign({}, item);
      this.editedItem = Object.assign({}, item);
      this.input = new Date(item.exam_date);
      /*this.data = {};
      try {
        const result = await handleRequest({
          endpoint: "category-status-priority-apk",
          method: "POST",
          data: this.data,
        });

        if (result.success) {
          // Si la solicitud es exitosa, asignamos las sucursales
          this.categories = result.data?.taskcategories || [];
          this.status = result.data?.taskstatus || [];
          this.priorities = result.data?.taskpriorities || [];
          this.recurrences = result.data?.taskrecurrences || [];
          this.people = result.data?.taskpeople || [];
          this.roles = result.data?.taskroles || [];
        } else {
          // Si no hay datos, asignamos un array vacío
          this.categories = [];
          this.status = [];
          this.priorities = [];
          this.recurrences = [];
          this.people = [];
          this.roles = [];
          this.showAlert("info", result.message || "No hay datos disponibles.", 3000);
        }
      } catch (error) {
        this.showAlert("error", "Ocurrió un error inesperado al cargar los datos.", 3000);
      } finally {
        this.dialog = true;
      }*/
     this.dialog = true;
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
    compactExamData(exam) {
    return [
      {
        label: 'P.A.',
        value: exam.blood_pressure || 'N/R',
        fullLabel: 'Presión Arterial',
        fullValue: exam.blood_pressure ? `${exam.blood_pressure} mmHg` : 'No registrada',
        icon: 'mdi-heart-pulse',
        color: 'blue-darken-2'
      },
      {
        label: 'Pulso',
        value: exam.pulse || 'N/R',
        fullLabel: 'Frecuencia Cardíaca',
        fullValue: exam.pulse ? `${exam.pulse} ppm` : 'No registrado',
        icon: 'mdi-heart',
        color: 'red-darken-2'
      },
      {
        label: 'Temp',
        value: exam.temperature ? `${exam.temperature}°C` : 'N/R',
        fullLabel: 'Temperatura',
        fullValue: exam.temperature ? `${exam.temperature} °C` : 'No registrada',
        icon: 'mdi-thermometer',
        color: 'orange-darken-2'
      },
      {
        label: 'Peso',
        value: exam.weight ? `${exam.weight} kg` : 'N/R',
        fullLabel: 'Peso',
        fullValue: exam.weight ? `${exam.weight} kilogramos` : 'No registrado',
        icon: 'mdi-scale',
        color: 'green-darken-2'
      },
      {
        label: 'Altura',
        value: exam.height ? `${exam.height} m` : 'N/R',
        fullLabel: 'Altura',
        fullValue: exam.height ? `${exam.height} metros` : 'No registrada',
        icon: 'mdi-human-male-height',
        color: 'purple-darken-2'
      },
      {
        label: 'IMC',
        value: exam.bmi || 'N/R',
        fullLabel: 'Índice de Masa Corporal',
        fullValue: exam.bmi ? `${exam.bmi}` : 'No registado',
        icon: 'mdi-human',
        color: 'cyan-darken-2'
      },
      {
        label: 'Resp',
        value: exam.respiratory_rate || 'N/R',
        fullLabel: 'Frecuencia Respiratoria',
        fullValue: exam.respiratory_rate ? `${exam.respiratory_rate} rpm` : 'No registrada',
        icon: 'mdi-lungs',
        color: 'teal-darken-2'
      }
    ].filter(item => item.value !== 'N/R');
  },
  compactObservations(exam) {
    return [
      {
        label: 'Neuro',
        text: this.truncateText(exam.neurological_observations) || '-',
        fullLabel: 'Neurológicas',
        icon: 'mdi-brain',
        color: 'blue',
        fullText: exam.neurological_observations || 'No registrado'
      },
      {
        label: 'Cardio',
        text: this.truncateText(exam.cardiovascular_observations) || '-',
        fullLabel: 'Cardiovasculares',
        icon: 'mdi-heart',
        color: 'red',
        fullText: exam.cardiovascular_observations || 'No registrado'
      },
      {
        label: 'Resp',
        text: this.truncateText(exam.respiratory_observations) || '-',
        fullLabel: 'Respiratorias',
        icon: 'mdi-lungs',
        color: 'green',
        fullText: exam.respiratory_observations || 'No registrado'
      },
      {
        label: 'Dig',
        text: this.truncateText(exam.digestive_observations) || '-',
        fullLabel: 'Digestivas',
        icon: 'mdi-stomach',
        color: 'orange',
        fullText: exam.digestive_observations || 'No registrado'
      },
      {
        label: 'Urin',
        text: this.truncateText(exam.urinary_observations) || '-',
        fullLabel: 'Urinarias',
        icon: 'mdi-kidney',
        color: 'purple',
        fullText: exam.urinary_observations || 'No registrado'
      },
      {
        label: 'Hallazgos',
        text: this.truncateText(exam.other_findings) || '-',
        fullLabel: 'Otros Hallazgos',
        icon: 'mdi-clipboard-text',
        color: 'cyan',
        fullText: exam.other_findings || 'No registrado'
      },
      {
        label: 'P.A.',
        text: exam.blood_pressure || '-',
        fullLabel: 'Presión Arterial',
        icon: 'mdi-heart-pulse',
        color: 'blue-darken-2',
        fullText: `Presión arterial: ${exam.blood_pressure || 'No registrada'}`
      },
      {
        label: 'Temp',
        text: exam.temperature ? `${exam.temperature}°C` : '-',
        fullLabel: 'Temperatura',
        icon: 'mdi-thermometer',
        color: 'red-darken-2',
        fullText: `Temperatura: ${exam.temperature || 'No registrada'}°C`
      },
      {
        label: 'Pulso',
        text: exam.pulse || '-',
        fullLabel: 'Frecuencia Cardíaca',
        icon: 'mdi-heart-flash',
        color: 'pink-darken-1',
        fullText: `Frecuencia cardíaca: ${exam.pulse || 'No registrada'} ppm`
      },
      {
        label: 'Resp',
        text: exam.respiratory_rate || '-',
        fullLabel: 'Frecuencia Respiratoria',
        icon: 'mdi-lungs',
        color: 'teal-darken-1',
        fullText: `Frecuencia respiratoria: ${exam.respiratory_rate || 'No registrada'} rpm`
      }
    ].filter(obs => obs.text !== '-');
  },
  truncateText(text, length = 15) {
    if (!text) return null;
    return text.length > length ? text.substring(0, length) + '...' : text;
  },
   calculateBMI() {
    if (this.editedItem.weight && this.editedItem.height) {
      const weight = parseFloat(this.editedItem.weight);
      const height = parseFloat(this.editedItem.height);
      this.editedItem.bmi = (weight / (height * height)).toFixed(2);
    } else {
      this.editedItem.bmi = '';
    }
  },

  getBMICategory(bmi) {
    if (!bmi) return '';
    const num = parseFloat(bmi);
    if (num < 18.5) return 'Bajo peso';
    if (num < 25) return 'Normal';
    if (num < 30) return 'Sobrepeso';
    return 'Obesidad';
  },

  getBMIColor(bmi) {
    if (!bmi) return 'grey';
    const num = parseFloat(bmi);
    if (num < 18.5) return 'blue';
    if (num < 25) return 'green';
    if (num < 30) return 'orange';
    return 'red';
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
