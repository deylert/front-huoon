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
        <v-row dense>
          <!-- Foto del usuario -->
          <v-col cols="auto">
            <v-avatar size="80" class="me-4">
              <v-img
                :src="`${this.$axios.defaults.baseURL}images/${imageUrl}`"
                alt="Foto del paciente"
              />
            </v-avatar>
          </v-col>

          <!-- Datos del paciente -->
          <v-col>
            <div class="text-h6 font-weight-bold mb-1">{{ person.name }}</div>
            <div class="text-body-2 text-grey-darken-1">
              {{
                person.age !== null
                  ? $t("personDetails.age.withValue", { age: person.age })
                  : $t("personDetails.age.withoutValue")
              }}
            </div>

            <div class="text-body-2 text-grey-darken-1">
              {{
                person.documentType
                  ? $t("personDetails.documentType.withValue", {
                      type: person.documentType,
                    })
                  : $t("personDetails.documentType.withoutValue")
              }}
            </div>

            <div class="text-body-2 text-grey-darken-1">
              {{
                person.documentNumber !== null
                  ? $t("personDetails.documentNumber.withValue", {
                      number: person.documentNumber,
                    })
                  : $t("personDetails.documentNumber.withoutValue")
              }}
            </div>
          </v-col>

          <v-col cols="12" sm="6" md="3">
            <v-card
              class="pa-2 d-flex align-center signo-card"
              elevation="1"
              rounded="lg"
              @click="dialogAlerta = true"
              style="cursor: pointer"
            >
              <!-- Ícono -->
              <v-avatar size="40" class="me-3" color="purple-lighten-4" variant="tonal">
                <v-icon color="warning">mdi-lightbulb-on-outline</v-icon>
              </v-avatar>

              <!-- Texto -->
              <div>
                <div class="text-body-2 font-weight-medium">Alertas</div>
                <div class="text-caption text-grey-darken-1">
                  Tienes {{ alertasHoy }} alerta<span v-if="alertasHoy !== 1">s</span>
                  para hoy
                </div>
              </div>
            </v-card>
          </v-col>
        </v-row>
        <!-- Fila completa para herramientas -->
        <v-row no-gutters class="mt-2">
          <v-col cols="12">
            <div class="d-flex flex-wrap gap-1">
              <v-btn
                v-for="tool in tools"
                :key="tool.name"
                @click="tool.action"
                size="small"
                color="primary"
                variant="text"
                prepend-icon="mdi-plus"
                class="text-capitalize"
              >
                {{ tool.name }}
              </v-btn>
            </div>
          </v-col>
        </v-row>
        <v-divider class="my-4" />
        <div class="text-body-2 font-weight-medium mb-2">{{ $t("vitalSigns") }}</div>
        <v-row dense>
          <template v-if="signosVitalesTransformados.length > 0">
            <v-col
              v-for="(signo, index) in signosVitalesTransformados"
              :key="index"
              cols="12"
              sm="6"
              md="3"
            >
              <v-card
                class="pa-2 d-flex align-center signo-card"
                elevation="1"
                rounded="lg"
                @click="abrirModal(signo)"
                style="cursor: pointer"
              >
                <v-avatar
                  size="40"
                  class="me-3"
                  :color="signo.color + ' lighten-4'"
                  variant="tonal"
                >
                  <v-icon :color="signo.color">{{ signo.icon }}</v-icon>
                </v-avatar>

                <div style="min-width: 0; flex: 1">
                  <!-- Contenedor con overflow oculto -->
                  <div class="text-body-2 font-weight-medium text-truncate">
                    {{ signo.nombre }}
                  </div>

                  <v-tooltip location="bottom">
                    <template v-slot:activator="{ props }">
                      <div
                        v-bind="props"
                        class="text-caption text-grey-darken-1 text-truncate"
                      >
                        {{ signo.valor }} {{ signo.unidad }}
                      </div>
                    </template>
                    <span>{{ signo.valor }} {{ signo.unidad }}</span>
                  </v-tooltip>

                  <div class="text-caption text-grey-lighten-1 mt-1">
                    {{ formatoFecha(signo.fecha) }}
                  </div>
                </div>
              </v-card>
            </v-col>
          </template>
          <template v-else>
            <v-col cols="12">
              <v-alert type="info" variant="tonal">
                {{ $t("vitalSignsnoData") }}
              </v-alert>
            </v-col>
          </template>
        </v-row>

        <v-divider class="my-4" />
        <div class="text-body-2 font-weight-medium mb-2">
          {{ $t("medicalInformation") }}
        </div>
        <v-row dense>
          <template v-if="informacionMedica.length > 0">
            <v-col
              v-for="(info, index) in informacionMedicaTransformada"
              :key="index"
              cols="12"
              sm="6"
              md="3"
            >
              <v-card
                class="pa-2 d-flex align-center signo-card"
                elevation="1"
                rounded="lg"
                @click="abrirModal(info)"
                style="cursor: pointer"
              >
                <!-- Ícono a la izquierda -->
                <v-avatar
                  size="40"
                  class="me-3"
                  :color="info.color + ' lighten-4'"
                  variant="tonal"
                >
                  <v-icon :color="info.color">{{ info.icon }}</v-icon>
                </v-avatar>

                <!-- Texto a la derecha -->
                <div style="min-width: 0; flex: 1">
                  <div class="text-body-2 font-weight-medium text-truncate">
                    {{ info.nombre }}
                  </div>

                  <v-tooltip location="bottom">
                    <template v-slot:activator="{ props }">
                      <div
                        v-bind="props"
                        class="text-caption text-grey-darken-1 text-truncate"
                      >
                        {{ info.valor }} {{ info.unidad }}
                      </div>
                    </template>
                    <span>{{ info.valor }} {{ info.unidad }}</span>
                  </v-tooltip>

                  <div class="text-caption text-grey-lighten-1 mt-1">
                    {{ formatoFecha(info.fecha) }}
                  </div>
                </div>
              </v-card>
            </v-col>
          </template>
          <template v-else>
            <v-col cols="12">
              <v-alert type="info" variant="tonal">
                {{ $t("medicalInfonoData") }}
              </v-alert>
            </v-col>
          </template>
        </v-row>

        <v-divider class="my-4" />
        <div class="text-body-2 font-weight-medium mb-2">
          {{ $t("complementaryData") }}
        </div>
        <v-row dense>
          <template v-if="datosComplementariosTransformados.length > 0">
            <v-col
              v-for="(info, index) in datosComplementariosTransformados"
              :key="index"
              cols="12"
              sm="6"
              md="3"
            >
              <v-card
                class="pa-2 d-flex align-center signo-card"
                elevation="1"
                rounded="lg"
                @click="abrirModal(info)"
                style="cursor: pointer"
              >
                <!-- Ícono -->
                <v-avatar
                  size="40"
                  class="me-3"
                  :color="info.color + ' lighten-4'"
                  variant="tonal"
                >
                  <v-icon :color="info.color">{{ info.icon }}</v-icon>
                </v-avatar>

                <!-- Contenido con tooltip -->
                <div style="min-width: 0; flex: 1">
                  <div class="text-body-2 font-weight-medium text-truncate">
                    {{ info.nombre }}
                  </div>

                  <v-tooltip location="bottom">
                    <template v-slot:activator="{ props }">
                      <div
                        v-bind="props"
                        class="text-caption text-grey-darken-1 text-truncate"
                      >
                        {{ info.valor }} {{ info.unidad }}
                      </div>
                    </template>
                    <span>{{ info.valor }} {{ info.unidad }}</span>
                  </v-tooltip>

                  <div class="text-caption text-grey-lighten-1 mt-1">
                    {{ formatoFecha(info.fecha) }}
                  </div>
                </div>
              </v-card>
            </v-col>
          </template>
          <template v-else>
            <v-col cols="12">
              <v-alert type="info" variant="tonal">
                {{ $t("complementaryDatanoData") }}
              </v-alert>
            </v-col>
          </template>
        </v-row>
        <v-divider class="my-4" />
        <SuggestionsList
    :items="suggestions"
    :title="$t('finances.sections.suggestions')"
    icon="mdi-finance"
  >
    <template #detail="{ taskData, onClose }">
      <ChatTaskSalud
        :taskData="taskData"
        @close-dialog="onClose"  
      />
    </template>
  </SuggestionsList>
      </v-card-text>
    </v-card>

    <!-- Modal para editar signo vital -->
    <v-dialog v-model="dialog" max-width="400">
      <v-card>
        <v-card-title class="text-h6"
          >Editar {{ signoSeleccionado?.nombre }}</v-card-title
        >
        <v-card-text>
          <v-text-field
            v-model="nuevoValor"
            label="Nuevo valor"
            type="number"
            append-inner-icon="mdi-pencil"
          />
        </v-card-text>
        <v-card-actions>
          <v-spacer />
          <v-btn text @click="dialog = false">Cancelar</v-btn>
          <v-btn color="primary" @click="guardarValor">Guardar</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-container>
  <!-- Modal para ver las alertas -->
  <v-dialog v-model="dialogAlerta" max-width="500">
    <v-card rounded-lg>
      <v-card-title class="text-body-2">Alertas para Hoy</v-card-title>
      <v-card-text>
        <v-list v-if="suggestions.length">
        <v-list-item v-for="(alerta, i) in suggestions" :key="i">
          <template v-slot:prepend>
            <v-icon color="deep-orange" icon="mdi-alert"></v-icon>
          </template>
          
          <v-list-item-title class="text-subtitle-2">
            {{ alerta.title }}
          </v-list-item-title>
                   <v-list-item-subtitle class="text-caption text-truncate">
  {{ alerta.description }}
  <v-tooltip
    activator="parent"
    location="bottom"
    max-width="350px"
    class="custom-tooltip"
  >
    <span style="white-space: normal; word-break: break-word">
      {{ alerta.description }}
    </span>
  </v-tooltip>
</v-list-item-subtitle>
        </v-list-item>
      </v-list>
        <div v-else class="text-caption text-grey">No hay alertas para hoy.</div>
      </v-card-text>
      <v-card-actions>
        <v-spacer />
        <v-btn text @click="dialogAlerta = false">Cerrar</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>

  <!--Datos del exmen físico-->
  <v-dialog v-model="dialogPhysicalExam" fullscreen transition="dialog-bottom-transition">
    <v-card>
      <v-card-text>
        <!-- Aquí pasamos el 'selectedWorker' al componente dentro del diálogo -->
        <PhysicalExam />
      </v-card-text>
      <v-divider></v-divider>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn text @click="closeDialogPhysicalExam"
          >Cerrar</v-btn
        >
      </v-card-actions>
    </v-card>
  </v-dialog>

  <!--Datos de los tratamientos-->
  <v-dialog v-model="dialogTreatment" fullscreen transition="dialog-bottom-transition">
    <v-card>
      <v-card-text>
        <!-- Aquí pasamos el 'selectedWorker' al componente dentro del diálogo -->
        <Treatment />
      </v-card-text>
      <v-divider></v-divider>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn text @click="closeDialogTreatment"
          >Cerrar</v-btn
        >
      </v-card-actions>
    </v-card>
  </v-dialog>

  <!--Datos de los antecedentes personales-->
  <v-dialog v-model="dialogPerson" fullscreen transition="dialog-bottom-transition">
    <v-card>
      <v-card-text>
        <!-- Aquí pasamos el 'selectedWorker' al componente dentro del diálogo -->
        <BackGroungPerson />
      </v-card-text>
      <v-divider></v-divider>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn text @click="closeDialogPerson"
          >Cerrar</v-btn
        >
      </v-card-actions>
    </v-card>
  </v-dialog>

  <!--Datos de los antecedentes familiares-->
  <v-dialog v-model="dialogFamily" fullscreen transition="dialog-bottom-transition">
    <v-card>
      <v-card-text>
        <!-- Aquí pasamos el 'selectedWorker' al componente dentro del diálogo -->
        <BackGroundFamily />
      </v-card-text>
      <v-divider></v-divider>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn text @click="closeDialogFamily"
          >Cerrar</v-btn
        >
      </v-card-actions>
    </v-card>
  </v-dialog>

  <!--Datos de los examenes medicos-->
  <v-dialog v-model="dialogExams" fullscreen transition="dialog-bottom-transition">
    <v-card>
      <v-card-text>
        <!-- Aquí pasamos el 'selectedWorker' al componente dentro del diálogo -->
        <MedicalExam />
      </v-card-text>
      <v-divider></v-divider>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn text @click="closeDialogExadialogExams"
          >Cerrar</v-btn
        >
      </v-card-actions>
    </v-card>
  </v-dialog>

  <!--Datos de los diagnosticos-->
  <v-dialog v-model="dialogDiagnosis" fullscreen transition="dialog-bottom-transition">
    <v-card>
      <v-card-text>
        <!-- Aquí pasamos el 'selectedWorker' al componente dentro del diálogo -->
        <Diagnosis />
      </v-card-text>
      <v-divider></v-divider>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn text @click="closeDialogDiagnosis"
          >Cerrar</v-btn
        >
      </v-card-actions>
    </v-card>
  </v-dialog>

  <!--Datos de las consultas-->
  <v-dialog
    v-model="dialogConsultations"
    fullscreen
    transition="dialog-bottom-transition"
  >
    <v-card>
      <v-card-text>
        <!-- Aquí pasamos el 'selectedWorker' al componente dentro del diálogo -->
        <MedicalConsultation />
      </v-card-text>
      <v-divider></v-divider>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn variant="flat" color="grey-lighten-1" @click="closeDialogConsultations"
          >Cerrar</v-btn
        >
      </v-card-actions>
    </v-card>
  </v-dialog>

  <v-dialog v-model="dialogChatTask" fullscreen transition="dialog-bottom-transition">
    <v-card>
      <v-card-text>
        <!-- Pasamos los parámetros al componente ChatTask -->
        <ChatTaskSalud :taskData="currentTask" @close-dialog="closeDialgChat()"  />
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
import LocalStorageService from "@/LocalStorageService";
import { handleRequest } from "@/utils/api"; // Ruta al archivo
import _ from "lodash";
import PhysicalExam from "./PhysicalExam.vue";
import Treatment from "./Treatment.vue";
import BackGroungPerson from "./BackGroungPerson.vue";
import BackGroundFamily from "./BackGroundFamily.vue";
import MedicalExam from "./MedicalExam.vue";
import Diagnosis from "./Diagnosis.vue";
import MedicalConsultation from "./MedicalConsultation.vue";

import SuggestionsList from "../suggestion/SuggestionsList.vue";
import ChatTaskSalud from "../chat/ChatTaskSalud.vue";
export default {
  components: {
    PhysicalExam,
    Treatment,
    BackGroungPerson,
    BackGroundFamily,
    MedicalExam,
    Diagnosis,
    MedicalConsultation,
    ChatTaskSalud,
    SuggestionsList,
  },
  data: () => ({
    dialogPhysicalExam: false,
    dialogTreatment: false,
    dialogPerson: false,
    dialogFamily: false,
    dialogExams: false,
    dialogDiagnosis: false,
    dialogAlerta: false,
    dialogConsultations: false,
    dialogChatTask: false,
      currentTask: null,
    listaAlertas: [
      {
        titulo: "Cita médica en 1 hora",
        descripcion: "Revisión nutricional con Dra. Gómez.",
      },
      {
        titulo: "Posible omisión de medicación",
        descripcion: "No se ha registrado dosis matutina.",
      },
      {
        titulo: "Síntoma fuera de rango",
        descripcion: "Temperatura detectada superior a 38.5 °C.",
      },
    ],
    dialog: false,
    nuevoValor: "",
    signoSeleccionado: null,

    signosVitales: [
      {
        nombre: "Presión Arterial",
        valor: "120/80",
        unidad: "mmHg",
        icon: "mdi-heart-pulse",
        color: "indigo-darken-2",
        fecha: "2025-06-25",
      },
      {
        nombre: "Pulso",
        valor: 72,
        unidad: "bpm",
        icon: "mdi-heart",
        color: "indigo-darken-2",
        fecha: "2025-06-25",
      },
      {
        nombre: "Temperatura",
        valor: 36.5,
        unidad: "°C",
        icon: "mdi-thermometer",
        color: "indigo-darken-2",
        fecha: "2025-06-25",
      },
      {
        nombre: "Oxigenación",
        valor: 98,
        unidad: "%",
        icon: "mdi-air-filter",
        color: "indigo-darken-2",
        fecha: "2025-06-25",
      },
      {
        nombre: "Peso",
        valor: 74,
        unidad: "kg",
        icon: "mdi-scale-bathroom",
        color: "indigo-darken-2",
        fecha: "2025-06-25",
      },
      {
        nombre: "Medicamentos Actuales",
        valor: "Losartán, Metformina",
        unidad: "",
        icon: "mdi-pill",
        color: "purple",
        fecha: "2025-06-24",
      },
    ],

    informacionMedica: [
      {
        nombre: "Grupo Sanguíneo",
        valor: "O+",
        unidad: "",
        icon: "mdi-water",
        color: "grey-darken-1",
        fecha: "2020-01-01",
      },
      {
        nombre: "Alergias",
        valor: "Penicilina, Mariscos",
        unidad: "",
        icon: "mdi-alert-circle",
        color: "deep-orange",
        fecha: "2023-05-12",
      },
      {
        nombre: "Antecedentes Personales",
        valor: "Diabetes tipo 2, Hipertensión",
        unidad: "",
        icon: "mdi-file-document-outline",
        color: "deep-orange",
        fecha: "2025-01-01",
      },
      {
        nombre: "Antecedentes Familiares",
        valor: "Infarto en padre",
        unidad: "",
        icon: "mdi-family-tree",
        color: "deep-orange",
        fecha: "2025-01-01",
      },
    ],

    datosComplementarios: [
      {
        nombre: "Plan de Vacunación",
        valor: "Influenza 2024, COVID bivalente",
        unidad: "",
        icon: "mdi-needle",
        color: "green-darken-1",
        fecha: "2024-04-01",
      },
      {
        nombre: "Talla",
        valor: 1.68,
        unidad: "m",
        icon: "mdi-human-male-height",
        color: "grey-darken-1",
        fecha: "2025-06-01",
      },
      {
        nombre: "IMC",
        valor: 26.2,
        unidad: "",
        icon: "mdi-calculator-variant-outline",
        color: "grey-darken-1",
        fecha: "2025-06-25",
      },
    ],

    examenesMedicos: [
      {
        nombre: "Hemograma",
        fecha: "2025-06-15",
        resultado: "Anemia leve detectada",
        icon: "mdi-flask",
        color: "blue-darken-1",
        archivo: null, // puedes usar esto si luego quieres subir PDF
      },
      {
        nombre: "Radiografía de Tórax",
        fecha: "2025-05-30",
        resultado: "Sin hallazgos patológicos",
        icon: "mdi-x-ray",
        color: "blue-grey-darken-1",
        archivo: null,
      },
      {
        nombre: "Examen de Orina",
        fecha: "2025-06-01",
        resultado: "Proteínas elevadas",
        icon: "mdi-flask-outline",
        color: "blue-darken-2",
        archivo: null,
      },
    ],
    snackbar: false,
    sb_type: "",
    sb_message: "",
    sb_timeout: 2000,
    sb_title: "",
    sb_icon: "",
    valid: true,
    home_id: '',
    tab: null,
    loading: false,
    dialogDelete: false,
    medicalhistories: [],
    person: {},
    physicalExam: {},
    medicalExam: [],
    treatment: {},
    diagnosis: {},
    consultation: {},
    backgroundPerson: [],
    backgroundFamily: [],
    suggestions: [],
    statusuggestions: [],
    data: {},
    page: 1, // Página actual
    itemsPerPage: 5, // Elementos por página
    totalItems: 0, // Total de elementos disponibles
    headers: [
      { title: "Antecedentes Familiares", value: "familyBackground" },
      { title: "Antecedentes Personales", value: "personalBackground" },
      { title: "Grupo Sanguíneo", value: "bloodType" },
      { title: "Vacunaciones", value: "vaccines" },
      { title: "Medicamentos Actuales", value: "currentMedications" },
      { title: "Acciones", value: "actions", sortable: false, width: "10%" },
    ],

    editedItem: {
      id: "",
      familyBackground: "",
      personalBackground: "",
      vaccines: [],
      bloodType: "",
      currentMedications: [],
    },
    defaultItem: {
      id: "",
      familyBackground: "",
      personalBackground: "",
      vaccines: [],
      bloodType: "",
      currentMedications: [],
    },
    originalItem: {
      id: "",
      familyBackground: "",
      personalBackground: "",
      vaccines: [],
      bloodType: "",
      currentMedications: [],
    },
    vaccineHeaders: [
      { title: "Nombre", value: "name" },
      { title: "Fecha", value: "date" },
      { title: "Lote", value: "lot" },
      { title: "Acciones", value: "actions", sortable: false },
    ],
    medicationHeaders: [
      { title: "Nombre", value: "name" },
      { title: "Dosis", value: "dose" },
      { title: "Frecuencia", value: "frequency" },
      { title: "Acciones", value: "actions", sortable: false },
    ],
    vaccineDialog: false, // Controla el diálogo de vacunas
    medicationDialog: false, // Controla el diálogo de medicamentos
    editedVaccine: { id: null, name: "", date: "", lot: "" }, // Vacuna en edición
    editedMedication: { id: null, name: "", dose: "", frequency: "" }, // Medicamento en edición
    vaccineFormTitle: "Agregar Vacuna", // Título del diálogo de vacunas
    medicationFormTitle: "Agregar Medicamento", // Título del diálogo de medicamentos
    editedIndex: -1,
    search: "",
    menu: false,
    input: null,
    imageUrl: "",
    name: "",
    nameRules: [
      (v) => !!v || "El campo es requerido",
      (v) => (v && v.length <= 50) || "El campo debe tener menos de 51 caracteres",
      (v) => (v && v.length >= 2) || "El campo debe tener al menos de 2 caracteres",
    ],
    selectRules: [(v) => !!v || "Seleccionar al menos un elemento"],
  }),
  computed: {
    formTitle() {
      return this.editedIndex === -1
        ? "Agregar Historia Clínica"
        : "Editar Historia Clínica";
    },
    alertasHoy() {
      return this.listaAlertas.length;
    },

    dateFormatted() {
      const date = this.input ? new Date(this.input) : new Date();
      const day = date.getDate().toString().padStart(2, "0");
      const month = (date.getMonth() + 1).toString().padStart(2, "0");
      const year = date.getFullYear();
      return `${year}-${month}-${day}`;
    },
    getDate() {
      return this.input ? new Date(this.input) : new Date();
    },
    tools() {
      return [
        // 1. Diagnósticos (lo primero que se suele registrar)
        {
          name: this.$t("viewTitles.diagnosis"),
          action: () => this.showAddDiagnosis(),
        },

        // 2. Antecedentes personales (historia clínica)
        {
          name: this.$t("viewTitles.personalBackground"),
          action: () => this.showAddPerson(),
        },

        // 3. Antecedentes familiares (importantes para diagnóstico)
        {
          name: this.$t("viewTitles.familyBackground"),
          action: () => this.showAddFamily(),
        },

        // 4. Exámenes físicos (evaluación inicial)
        {
          name: this.$t("viewTitles.physicalExams"),
          action: () => this.showAddPhysicalExam(),
        },

        // 5. Exámenes médicos (complementarios)
        {
          name: this.$t("viewTitles.medicalExams"),
          action: () => this.showAddExam(),
        },

        // 6. Tratamientos (lo último, después de tener diagnóstico)
        {
          name: this.$t("viewTitles.treatments"),
          action: () => this.showAddTreatment(),
        },

        // 7. Consultas médicas (nuevo elemento)
        {
          name: this.$t("viewTitles.consultations"), // Asegúrate de añadir la traducción
          action: () => this.showAddConsultations(),
        },
      ];
    },
    //card de signos vitales
    signosVitalesTransformados() {
    const signosConfig = {
      bloodPressure: {
        nombre: this.$t("physicalExam.fields.blood_pressure"),
        unidad: "mmHg",
        icon: "mdi-heart-pulse",
        color: "indigo-darken-2",
        type: "physicalExam",
      },
      pulse: {
        nombre: this.$t("physicalExam.fields.pulse"),
        unidad: "bpm",
        icon: "mdi-heart",
        color: "indigo-darken-2",
        type: "physicalExam",
      },
      temperature: {
        nombre: this.$t("physicalExam.fields.temperature"),
        unidad: "°C",
        icon: "mdi-thermometer",
        color: "indigo-darken-2",
        type: "physicalExam",
      },
      respiratoryRate: {
        nombre: this.$t("physicalExam.fields.respiratory_rate"),
        unidad: "rpm",
        icon: "mdi-lungs",
        color: "indigo-darken-2",
        type: "physicalExam",
      },
      weight: {
        nombre: this.$t("physicalExam.fields.weight"),
        unidad: "kg",
        icon: "mdi-scale-bathroom",
        color: "indigo-darken-2",
        type: "physicalExam",
      },
    };

  const result = [];
  const examData = this.physicalExam || {};

  // Transformar cada propiedad relevante, mostrando "No definido" si no hay valor
  Object.keys(signosConfig).forEach((key) => {
   const valor = examData[key];
    const tieneValor = valor !== null && valor !== undefined && valor !== '';
    
    result.push({
      ...signosConfig[key],
      valor: tieneValor ? valor : this.$t("no_definido"),
      unidad: tieneValor ? signosConfig[key].unidad : "", // No mostrar unidad si no hay valor
      fecha: (examData.examDate || examData.exam_date) || new Date().toISOString().split("T")[0],
      originalKey: key,
    });
  });

  // Añadir medicamentos si existen
  /*if (this.treatment && this.treatment.medication) {
    const medInfo = [
      this.treatment.medication,
      this.treatment.dosage,
      this.treatment.frequency,
    ]
      .filter(Boolean)
      .join(" - ");

    result.push({
      nombre: this.$t("cardMedicamento"),
      valor: medInfo || this.$t("no_definido"),
      unidad: "",
      icon: "mdi-pill",
      color: "purple",
      fecha: this.treatment.startDate || new Date().toISOString().split("T")[0],
      originalKey: "medication",
      type: "treatment",
    });
  }*/
 // Añadir medicamentos SIEMPRE, incluso si está vacío
 // 1. Normalizar los tratamientos (asegurar que siempre sea un array)
const treatments = Array.isArray(this.treatment) ? this.treatment : [this.treatment || {}];

// 2. Obtener el primer tratamiento para mostrar en la card
const firstTreatment = treatments[0] || {};

// 3. Construir la información médica (medicamento, dosis, tipo)
const medInfo = [
  firstTreatment.medication,
  firstTreatment.dosage,
  firstTreatment.typeName
].filter(Boolean).join(" - ");

const tieneInfoMedicamento = medInfo.trim() !== '';
const isSingleTreatment = treatments.length <= 1;

// 4. Agregar al resultado final
result.push({
  nombre: isSingleTreatment 
    ? this.$t("treatment.cardMedicamento") 
    : this.$t("treatment.cardMedicamentosPlural", { count: treatments.length }),
  valor: isSingleTreatment 
    ? (tieneInfoMedicamento ? medInfo : this.$t("treatment.no_definido"))
    : this.$t("treatment.medicamentosActivos", { count: treatments.length }),
  unidad: "",
  icon: "mdi-pill",
  color: "purple",
  fecha: firstTreatment.startDate || new Date().toISOString().split('T')[0],
  originalKey: "medication",
  type: "treatment",
});


  return result;
},
    examenesMedicosTransformados() {
      // Mapeo de tipos a iconos (case insensitive)
      const iconMapping = {
        radiografia: { icon: "mdi-x-ray", color: "blue-grey-darken-1" },
        hemograma: { icon: "mdi-flask", color: "blue-darken-1" },
        "examen de orina": { icon: "mdi-flask-outline", color: "blue-darken-2" },
        ultrasonido: { icon: "mdi-ultrasound", color: "green-darken-1" },
        tomografia: { icon: "mdi-scanner", color: "deep-purple-darken-1" },
        default: { icon: "mdi-file-document-outline", color: "grey-darken-1" },
      };

      return this.medicalExam.map((exam) => {
        // Normalizamos el tipo a minúsculas y sin espacios extras
        const examType = exam.type.toString().toLowerCase().trim();

        // Buscamos coincidencia ignorando mayúsculas/minúsculas
        const matchedType = Object.keys(iconMapping).find((key) =>
          examType.includes(key.toLowerCase())
        );

        const iconInfo = matchedType ? iconMapping[matchedType] : iconMapping.default;

        return {
          id: exam.id,
          nombre: exam.typeName || exam.examName || "Examen médico",
          fecha: exam.date,
          valor: exam.typeName,
          unidad: "",
          resultado: exam.results,
          observaciones: exam.observations,
          archivo: exam.archive,
          ...iconInfo,
        };
      });
    },
    informacionMedicaTransformada() {
      const informacionMedica = [];
      const { person, backgroundPerson, backgroundFamily } = this;

      // 1. Grupo sanguíneo - Mostrar siempre
      const bloodType = person?.bloodType || person?.blood_type;
      informacionMedica.push({
        nombre: this.$t("personManagement.fields.blood_type"),
        valor: bloodType || this.$t("no_definido"),
        unidad: "",
        icon: "mdi-water",
        color: "grey-darken-1",
        fecha: (person?.date) || new Date().toISOString().split("T")[0],
      });

      // 2. Alergias - Mostrar siempre
      const alergias =
        backgroundPerson?.filter(
          (item) => item?.type && item.type.toLowerCase().includes("alergia")
        ) || [];

      const alergiasText = alergias.length > 0 
        ? alergias.map((a) => a.description).join(", ")
        : "";

      informacionMedica.push({
        nombre: this.$t("cardAlergias"),
        valor: alergiasText || this.$t("no_definido"),
        unidad: "",
        icon: "mdi-alert-circle",
        color: "deep-orange",
        fecha: (alergias[0]?.startDate) || new Date().toISOString().split("T")[0],
        type: "backgroundPerson",
      });

      // 3. Antecedentes personales (excluyendo alergias) - Mostrar siempre
      const antecedentesPersonales =
        backgroundPerson?.filter(
          (item) => !item?.type || !item.type.toLowerCase().includes("alergia")
        ) || [];

      const antecedentesText = antecedentesPersonales.length > 0
        ? antecedentesPersonales.map((a) => a.description).join(", ")
        : "";

      informacionMedica.push({
        nombre: this.$t("cardAntecedentesPersonales"),
        valor: antecedentesText || this.$t("no_definido"),
        unidad: "",
        icon: "mdi-file-document-outline",
        color: "deep-orange",
        fecha: (antecedentesPersonales[0]?.startDate) || new Date().toISOString().split("T")[0],
        type: "backgroundPerson",
      });

      // 4. Antecedentes familiares - Mostrar siempre
      const familiaresText = backgroundFamily?.length > 0
        ? backgroundFamily.map((f) => `${f.relationship}: ${f.disease}`).join("; ")
        : "";

      informacionMedica.push({
        nombre: this.$t("cardAntecedentesFamiliares"),
        valor: familiaresText || this.$t("no_definido"),
        unidad: "",
        icon: "mdi-family-tree",
        color: "deep-orange",
        fecha: (backgroundFamily?.[0]?.date) || new Date().toISOString().split("T")[0],
        type: "backgroundFamily",
      });

      return informacionMedica;
    },
    datosComplementariosTransformados() {
      const complementarios = [];
      const { physicalExam, backgroundPerson, diagnosis, consultation } = this;

      // 3. Talla - Mostrar siempre
      const height = physicalExam?.height;
      const tieneHeight = height !== null && height !== undefined && height !== '';
      
      complementarios.push({
        nombre: this.$t("physicalExam.fields.height"),
        valor: tieneHeight ? parseFloat(height).toFixed(2) : this.$t("no_definido"),
        unidad: tieneHeight ? "m" : "",
        icon: "mdi-human-male-height",
        color: "grey-darken-1",
        fecha: (physicalExam?.exam_date) || new Date().toISOString().split("T")[0],
        type: "physicalExam",
      });

      // 4. IMC - Mostrar siempre
      let imc = null;
      if (physicalExam?.height) {
        imc = physicalExam.bmi ||
          (physicalExam.weight
            ? (parseFloat(physicalExam.weight) /
              (parseFloat(physicalExam.height) * parseFloat(physicalExam.height))).toFixed(2)
            : null);
      }
      
      const tieneImc = imc !== null && imc !== undefined && imc !== '';
      
      complementarios.push({
        nombre: this.$t("physicalExam.fields.bmi"),
        valor: tieneImc ? imc : this.$t("no_definido"),
        unidad: "",
        icon: "mdi-calculator-variant-outline",
        color: tieneImc ? this.getImcColor(imc) : "grey-darken-1",
        fecha: (physicalExam?.exam_date) || new Date().toISOString().split("T")[0],
        type: "physicalExam",
      });

      // 2. Plan de Vacunación - Mostrar siempre
      const vacunas = backgroundPerson?.filter(
        (item) => item?.type && item.type.toLowerCase().includes("vacunación")
      ) || [];

      const vacunasText = vacunas.length > 0 
        ? vacunas.map((v) => v.description).join(", ")
        : "";

      complementarios.push({
        nombre: this.$t("cardPlanVacunacion"),
        valor: vacunasText || this.$t("no_definido"),
        unidad: "",
        icon: "mdi-needle",
        color: "green-darken-1",
        fecha: (vacunas[0]?.startDate || physicalExam?.exam_date) || new Date().toISOString().split("T")[0],
        type: "backgroundPerson",
      });

      // 1. Diagnóstico Principal - Mostrar siempre
      const diagnosisInfo = diagnosis?.typeName 
        ? `${diagnosis.typeName} (${diagnosis.cie10Code || "Sin código"})`
        : "";

      complementarios.push({
        nombre: this.$t("cardDiagnostico"),
        valor: diagnosisInfo || this.$t("no_definido"),
        detalle: diagnosis?.description || "",
        unidad: "",
        icon: "mdi-heart-pulse",
        color: diagnosisInfo ? "red-darken-1" : "grey-darken-1",
        fecha: (diagnosis?.date) || new Date().toISOString().split("T")[0],
        type: "diagnosis",
      });

      // 5. Consulta Médica - Mostrar siempre
      const consultaInfo = consultation?.typeName || "Consulta médica";
      const motivoConsulta = consultation?.reason || "Sin motivo especificado";
      const profesionalInfo = consultation?.professional
        ? `Profesional: ${consultation.professional}`
        : "";

      complementarios.push({
        nombre: this.$t("cardConsultaMedica"),
        valor: consultaInfo,
        detalle: motivoConsulta,
        unidad: profesionalInfo,
        icon: "mdi-stethoscope",
        color: "blue-darken-2",
        fecha: (consultation?.date) || new Date().toISOString().split("T")[0],
        type: "consultation",
      });

      return complementarios;
    },
  },
  mounted() {
    this.name = JSON.parse(LocalStorageService.getItem("name"));
    this.imageUrl = LocalStorageService.getItem("image").replace(/['"]+/g, "");
    this.home_id = JSON.parse(LocalStorageService.getItem("home_id"));
    this.initialize();
  },
  methods: {
     handleCloseDialog() {
      // Lógica adicional al cerrar el diálogo si es necesaria
      console.log("Diálogo cerrado");
      this.closeDialgChat();
    },
    closeDialgChat() {
      this.dialogChatTask = false;
      this.currentTask = null; // Limpia la tarea actual
      this.initialize();
    },
    getImcColor(imc) {
      const value = parseFloat(imc);
      if (value < 18.5) return "blue"; // Bajo peso
      if (value >= 18.5 && value < 25) return "green"; // Normal
      if (value >= 25 && value < 30) return "orange"; // Sobrepeso
      return "red"; // Obesidad
    },
    formatoFecha(fecha) {
      if (!fecha) return "";

      const d = new Date(fecha);
      const locale = this.$i18n.locale;
      const options = {
        year: "numeric",
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
        timeZone: "UTC", // Forzar UTC
      };

      return d.toLocaleDateString(locale, options);
    },
    abrirModal(item) {
      switch (item.type) {
        case "physicalExam":
          this.showAddPhysicalExam();
          break;
        case "treatment":
          this.showAddTreatment();
          break;
        case "backgroundPerson":
          this.showAddPerson();
          break;
        case "backgroundFamily":
          this.showAddFamily();
          break;
        case "medicalExam":
          this.showAddExam();
          break;
        case "diagnosis":
          this.showAddDiagnosis();
          break;
        case "consultation":
          this.showAddConsultations();
          break;
        default:
          break;
      }
    },
    guardarValor() {
      if (this.signoSeleccionado) {
        this.signoSeleccionado.valor = this.nuevoValor;
        this.signoSeleccionado.fecha = new Date().toISOString().slice(0, 10);
      }
      this.dialog = false;
    },
    // Método para manejar la paginación
    updatePage(page) {
      this.page = page;
      this.initialize(); // Recarga los almacenes con la nueva página
    },

    /*formatoFecha(fecha) {
      const d = new Date(fecha)
      return d.toLocaleDateString('es-CL', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      })
    },*/

    updateDate(val) {
      this.input = val;
      this.editedVaccine.date = this.dateFormatted;
      this.menu = false;
    },
    // Método para manejar el cambio de elementos por página
    updateItemsPerPage(itemsPerPage) {
      this.itemsPerPage = itemsPerPage;
      this.initialize(); // Recarga los almacenes con el nuevo número de elementos por página
    },
    showAdd() {
      this.dialog = true;
    },
    close() {
      this.dialog = false;
      this.loading = false;
      this.$nextTick(() => {
        this.editedItem = Object.assign({}, this.defaultItem);
        this.originalItem = Object.assign({}, this.defaultItem);
      });
      this.editedIndex = -1;
    },
    /*addVaccine() {
      this.editedVaccine = { id: null, name: "", date: "", lot: "" };
      this.vaccineFormTitle = "Agregar Vacuna";
      this.vaccineDialog = true;
    },
    editVaccine(vaccine) {
      this.editedVaccine = { ...vaccine };
      this.vaccineFormTitle = "Editar Vacuna";
      this.vaccineDialog = true;
    },
    deleteVaccine(vaccine) {
      this.editedItem.vaccines = this.editedItem.vaccines.filter(
        (v) => v.id !== vaccine.id
      );
    },*/
    /*saveVaccine() {
      if (this.editedVaccine.id === null) {
        this.editedVaccine.id = this.editedItem.vaccines.length + 1;
        this.editedVaccine.date = this.editedVaccine.date
          ? this.editedVaccine.date
          : new Date().toISOString().split("T")[0];
        this.editedItem.vaccines.push(this.editedVaccine);
      } else {
        const index = this.editedItem.vaccines.findIndex(
          (v) => v.id === this.editedVaccine.id
        );
        this.editedItem.vaccines.splice(index, 1, this.editedVaccine);
      }
      this.closeVaccineDialog();
    },
    closeVaccineDialog() {
      this.vaccineDialog = false;
    },*/

    // Métodos para medicamentos
    /*addMedication() {
      this.editedMedication = { id: null, name: "", dose: "", frequency: "" };
      this.medicationFormTitle = "Agregar Medicamento";
      this.medicationDialog = true;
    },
    editMedication(medication) {
      this.editedMedication = { ...medication };
      this.medicationFormTitle = "Editar Medicamento";
      this.medicationDialog = true;
    },
    deleteMedication(medication) {
      this.editedItem.currentMedications = this.editedItem.currentMedications.filter(
        (m) => m.id !== medication.id
      );
    },
    saveMedication() {
      if (this.editedMedication.id === null) {
        this.editedMedication.id = this.editedItem.currentMedications.length + 1;
        this.editedItem.currentMedications.push(this.editedMedication);
      } else {
        const index = this.editedItem.currentMedications.findIndex(
          (m) => m.id === this.editedMedication.id
        );
        this.editedItem.currentMedications.splice(index, 1, this.editedMedication);
      }
      this.closeMedicationDialog();
    },
    closeMedicationDialog() {
      this.medicationDialog = false;
    },*/
    async initialize() {
      this.data = {};
      this.data.home_id = this.home_id;
      try {
        this.loading = true;
        const result = await handleRequest({
          endpoint: "person-profile",
          method: "POST",
          data: this.data,
        });

        if (result.success) {
          // Si la solicitud es exitosa, asignamos las sucursales
          this.person = result.data?.person || {};
          this.physicalExam = result.data?.physicalExam || {};
          this.treatment = result.data?.treatment || {};
          this.medicalExam = result.data?.medicalExam || [];
          this.backgroundPerson = result.data?.backgroundPerson || [];
          this.backgroundFamily = result.data?.backgroundFamily || [];
          this.diagnosis = result.data?.diagnosis || {};
          this.consultation = result.data?.consultation || {};
          this.suggestions = result.data?.suggestions || [];
          this.statusuggestions = result.data?.statusuggestions || [];
        } else {
          // Si no hay datos, asignamos un array vacío
          this.person = {};
          this.physicalExam = {};
          this.treatment = {};
          this.diagnosis = {};
          this.consultation = {};
          this.medicalExam = [];
          this.backgroundPerson = [];
          this.backgroundFamily = [];
          this.suggestions = [];
          this.statusuggestions = [];
        }
      } catch (error) {
        this.loading = false;
        // Captura de errores no controlados
        this.showAlert("error", "Ocurrió un error inesperado al cargar los roles.", 3000);
      } finally {
        this.loading = false;
      }
    },
    async save() {
      this.data = {};
      this.loading = true;
      if (this.editedIndex === -1) {
        this.valid = false;
        this.data.familyBackground = this.editedItem.familyBackground;
        this.data.personalBackground = this.editedItem.personalBackground;
        this.data.bloodType = this.editedItem.bloodType;
        this.data.vaccines = this.editedItem.vaccines;
        this.data.currentMedications = this.editedItem.currentMedications;
        try {
          const result = await handleRequest({
            endpoint: "history-medical",
            method: "POST",
            data: this.data,
          });

          // Manejo de la respuesta según el resultado
          if (result.success) {
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
        } finally {
          this.loading = false;
        }
      } else {
        const fieldsToUpdate = [
          "id",
          "familyBackground",
          "personalBackground",
          "bloodType",
          "vaccines",
          "currentMedications",
        ];
        let updatedFields = Object.keys(this.editedItem)
          .filter(
            (key) =>
              fieldsToUpdate.includes(key) &&
              (key !== "vaccines" && key !== "currentMedications" // Si no es un array, comparar directamente
                ? this.editedItem[key] !== this.originalItem[key]
                : this.areArraysDifferent(this.originalItem[key], this.editedItem[key])) // Comparar arrays
          )
          .reduce((obj, key) => {
            obj[key] = this.editedItem[key]; // Agregar el campo al objeto de campos actualizados
            return obj;
          }, {});
        if (Object.keys(updatedFields).length > 0) {
          updatedFields.id = this.editedItem.id;
          this.loading = true;
          try {
            const result = await handleRequest({
              endpoint: "history-medical",
              method: "PUT",
              data: updatedFields,
            });

            // Manejo de la respuesta según el resultado
            if (result.success) {
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
          this.showAlert("success", "No se realizaron cambios.", 3000);
        }
      }
      this.close();
    },
    editItem(item) {
      this.editedIndex = 1;
      this.originalItem = _.cloneDeep(item);
      this.editedItem = _.cloneDeep(item);
      this.dialog = true;
    },
    // Función para comparar arrays de objetos
    areArraysDifferent(originalArray, editedArray) {
      // Ordenar ambos arrays por un campo único (por ejemplo, `id`)
      const sortedOriginal = [...originalArray].sort((a, b) => a.id - b.id);
      const sortedEdited = [...editedArray].sort((a, b) => a.id - b.id);

      // Comparar las cadenas generadas
      return JSON.stringify(sortedOriginal) !== JSON.stringify(sortedEdited);
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
        let request = {
          id: this.editedItem.id,
        };
        const result = await handleRequest({
          endpoint: "history-medical-destroy",
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

    //Exámenes Físicos
    showAddPhysicalExam() {
      this.dialogPhysicalExam = true; // Abrimos el diálogo
    },
    closeDialogPhysicalExam() {
      this.dialogPhysicalExam = false; // Cerramos el diálogo
      this.initialize();
    },
    //Tratamientos
    showAddTreatment() {
      this.dialogTreatment = true; // Abrimos el diálogo
    },
    closeDialogTreatment() {
      this.dialogTreatment = false; // Cerramos el diálogo
      this.initialize();
    },
    //Antecedentes personales
    showAddPerson() {
      this.dialogPerson = true; // Abrimos el diálogo
    },
    closeDialogPerson() {
      this.dialogPerson = false; // Cerramos el diálogo
      this.initialize();
    },
    //Antecedentes personales
    showAddFamily() {
      this.dialogFamily = true; // Abrimos el diálogo
    },
    closeDialogFamily() {
      this.dialogFamily = false; // Cerramos el diálogo
      this.initialize();
    },
    //Examenes medicos
    showAddExam() {
      this.dialogExams = true; // Abrimos el diálogo
    },
    closeDialogExadialogExams() {
      this.dialogExams = false; // Cerramos el diálogo
      this.initialize();
    },
    //Diagnosticos
    showAddDiagnosis() {
      this.dialogDiagnosis = true; // Abrimos el diálogo
    },
    closeDialogDiagnosis() {
      this.dialogDiagnosis = false; // Cerramos el diálogo
      this.initialize();
    },
    //Diagnosticos
    showAddConsultations() {
      this.dialogConsultations = true; // Abrimos el diálogo
    },
    closeDialogConsultations() {
      this.dialogConsultations = false; // Cerramos el diálogo
      this.initialize();
    },
  },
};
</script>
<style scoped>
.v-btn {
  flex-shrink: 0;
}

/* Espaciado entre elementos */
.gap-1 {
  gap: 4px;
}
.tools-bar {
  overflow-x: auto;
  white-space: nowrap;
  gap: 8px;
}
/* Estilos para personalizar el scroll */
.v-list {
  scrollbar-width: thin;
  /* Para navegadores que soportan scrollbar-width */
  scrollbar-color: #888 #f1f1f1;
  /* Color del scroll */
}

.selected-tab {
  background-color: #03626c;
  /* Fondo del tab seleccionado */
  color: white;
  /* Texto blanco */
  border-radius: 4px;
  /* Esquinas redondeadas, opcional */
}

.v-list::-webkit-scrollbar {
  width: 6px;
  /* Ancho del scroll */
}

.v-list::-webkit-scrollbar-thumb {
  background-color: #888;
  /* Color del thumb */
  border-radius: 3px;
  /* Bordes redondeados */
}

.v-list::-webkit-scrollbar-track {
  background-color: #f1f1f1;
  /* Color del track */
}

.text-h6 {
  font-size: 1.2rem;
}

.signo-card {
  transition: 0.2s ease-in-out;
}

.signo-card .text-truncate {
  display: block;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  width: 100%;
}

.signo-card:hover {
  transform: scale(1.01);
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.06);
}
</style>
