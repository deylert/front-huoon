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
        <v-card-text>
        <v-row justify="space-between" align="center" class="mb-6">
        <v-col cols="12" class="d-flex justify-space-between align-center">
           <h2 class="text-body-2 font-weight-bold">{{ $t("vet_visits.listing.title") }}</h2>
          <v-btn icon color="deep-purple-accent-4" variant="flat" class="elevation-3" @click="showAdd" :title=" this.$t('vet_visits.listing.addButton')">
            <v-icon>mdi-plus</v-icon>
          </v-btn>
          </v-col>
        </v-row>
      <template v-if="visits.length > 0">
  <v-card
    v-for="(visit, index) in visits"
    :key="index"
    class="mb-4 rounded-lg pa-2"
    density="comfortable"
    elevation="2"
  >
    <v-row>
      <!-- Barra lateral de color e info (fecha actual) -->
      <v-col cols="1" class="d-flex justify-start">
        <div
          class="icono-concavo d-flex flex-column justify-center justify-start"
          :class="`bg-${getTypeColor('vet_name')}`"
        >
          <div class="date-display">
            {{ formatIntuitiveDate(visit.date) }}
          </div>
        </div>
      </v-col>

      <v-col cols="3" class="d-flex align-center justify-start">
        <v-row align="center" class="gap-3">
          <div>
            <div class="font-weight-bold text-body-2">
              <span>{{ visit.reason }}</span>
              <v-tooltip activator="parent" location="bottom" max-width="350px">
            <span style="white-space: normal; word-break: break-word">
              {{ $t("vet_visits.fields.reason") }}: {{ visit.reason }}
            </span>
          </v-tooltip>
            </div>
            <div class="text-caption text-grey">
              <span>{{ visit.diagnosis }}</span>
              <v-tooltip activator="parent" location="bottom" max-width="350px">
            <span style="white-space: normal; word-break: break-word">
              {{ $t("vet_visits.fields.diagnosis") }}: {{ visit.diagnosis }}
            </span>
          </v-tooltip>
            </div>
          </div>
        </v-row>
      </v-col>
      <v-col cols="1" class="d-flex align-center justify-start text-truncate">
        <div>
          <span class="text-body-2">{{ truncate(visit.vet_name, 15) }}</span>
          <v-tooltip activator="parent" location="bottom" max-width="350px">
            <span style="white-space: normal; word-break: break-word">
              {{ $t("vet_visits.fields.vet_name") }}: {{ visit.vet_name }}
            </span>
          </v-tooltip>
        </div>
      </v-col>

      <!-- Diagnóstico (mantiene posición) -->
      <v-col cols="1" class="d-flex align-center justify-start text-truncate">
        <div>
          <span class="text-body-2">{{ visit.clinic }}</span>
          <v-tooltip activator="parent" location="bottom" max-width="350px">
            <span style="white-space: normal; word-break: break-word">
              {{ $t("vet_visits.fields.clinic") }}: {{ visit.clinic }}
            </span>
          </v-tooltip>
        </div>
      </v-col>

      <!-- Recomendaciones (mantiene posición) -->
      <v-col cols="2" class="d-flex align-center justify-start">
        <div class="text-truncate" style="max-width: 100%">
          <span class="text-body-2 text-truncate d-inline-block" style="max-width: 100%">
            {{ visit.recommendations || '—' }}
          </span>
          <v-tooltip activator="parent" location="bottom" max-width="350px">
            <span style="white-space: normal; word-break: break-word">
              {{ $t("vet_visits.fields.recommendations") }}: {{ visit.recommendations || 'Ninguna' }}
            </span>
          </v-tooltip>
        </div>
      </v-col>

      <!-- Próxima cita (mantiene posición) -->
      <v-col cols="2" class="d-flex align-center justify-start text-truncate">
        <div>
          <span class="text-body-2">
            {{ visit.next_visit ? formatIntuitiveDate(visit.next_visit) : '—' }}
          </span>
          <v-tooltip activator="parent" location="bottom" max-width="350px">
            <span style="white-space: normal; word-break: break-word">
              {{ $t("vet_visits.fields.next_visit") }}: {{ visit.next_visit || 'No programada' }}
            </span>
          </v-tooltip>
        </div>
      </v-col>
      <v-col cols="1" class="d-flex align-center justify-start text-truncate">
                    <v-btn
                      density="comfortable"
                      :icon="getFileIcon(visit)"
                      :color="getFileColor(visit)"
                      :title="getTooltip(visit)"
                      variant="tonal"
                      elevation="1"
                      class="mr-1 mt-1 mb-1"
                      @click="handleFileClick(visit)"
                    ></v-btn>
                  </v-col>
      <!-- Botones de acción -->
      <v-col cols="1" class="d-flex align-center ml-auto pe-4" style="margin-left: auto !important">
        <v-btn icon variant="text" color="green-darken-2" size="small" @click="editItem(visit)">
          <v-icon>mdi-pencil</v-icon>
        </v-btn>
        <v-btn icon variant="text" color="red-darken-2" size="small" @click="deleteItem(visit)">
          <v-icon>mdi-delete</v-icon>
        </v-btn>
      </v-col>
    </v-row>
  </v-card>
</template>
            <template v-else>
              <v-col cols="12" class="text-center py-8">
                {{ $t("vet_visits.listing.noData") }}
              </v-col>
            </template>
     </v-card-text>
    </v-card>
 </v-container>
  <v-dialog v-model="dialog" fullscreen persistent transition="dialog-bottom-transition" content-class="fullscreen-dialog">
  <v-form ref="form" v-model="valid" class="h-100">
    <v-card class="pa-10">
      <v-card-text class="pt-12">
        <!-- Encabezado -->
        <h5 class="text-grey-darken-2 font-weight-medium">
          {{ $t(`vet_visits.formTitle.${editedIndex === -1 ? 'create' : 'edit'}`) }}
        </h5>
        <p class="text-grey-lighten-1">{{ $t("vet_visits.formInstructions") }}</p>

        <v-row class="mt-12">
          <!-- Pasos laterales -->
          <v-col cols="3">
            <v-timeline align="start" side="end" density>
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
                    <strong>{{ $t(`vet_visits.steps.${s.key}.title`) }}</strong>
                    <div class="text-caption text-grey">
                      {{ $t(`vet_visits.steps.${s.key}.subtitle`) }}
                    </div>
                  </div>
                </template>
              </v-timeline-item>
            </v-timeline>
          </v-col>

          <!-- Contenido dinámico según paso -->
          <v-col cols="9">
            <h3 class="text-deep-purple-accent-3 mb-8">
              {{ $t(`vet_visits.steps.${steps[step].key}.title`) }}
            </h3>

            <!-- Paso 1: Información básica -->
            <v-row dense v-if="step === 0">
            <v-col cols="12" md="6">
                <v-text-field
                  v-model="editedItem.reason"
                  :label="$t('vet_visits.fields.reason')"
                  variant="underlined"
                  :rules="[
                    (v) => !!v || $t('vet_visits.validation.required', { field: $t('vet_visits.fields.reason') }),
                    (v) => v.length >= 3 || $t('vet_visits.validation.min_length_reason'),
                  ]"
                ></v-text-field>
              </v-col>

              <v-col cols="12" md="6">
                <v-locale-provider>
                  <v-menu v-model="menu" :close-on-content-click="false" offset-y min-width="auto" transition="scale-transition" location="end">
                    <template v-slot:activator="{ props }">
                      <v-text-field
                        v-bind="props"
                        :modelValue="editedItem.date"
                        variant="underlined"
                        :rules="[
                          (v) => !!v || $t('vet_visits.validation.required', { field: $t('vet_visits.fields.date') }),
                        ]"
                        :label="$t('vet_visits.fields.date')"
                        readonly
                      ></v-text-field>
                    </template>
                    <v-date-picker
                      color="#03626C"
                      :modelValue="parseDateString(editedItem.date)"
                      @update:model-value="updateDate"
                      format="yyyy-MM-dd"
                    ></v-date-picker>
                  </v-menu>
                </v-locale-provider>
              </v-col>
              <v-col cols="12" md="6">
                <v-text-field
                  v-model="editedItem.vet_name"
                  :label="$t('vet_visits.fields.vet_name')"
                  variant="underlined"
                  :rules="[
                    (v) => !!v || $t('vet_visits.validation.required', { field: $t('vet_visits.fields.vet_name') }),
                  ]"
                ></v-text-field>
              </v-col>

              <v-col cols="12" md="6">
                <v-text-field
                  v-model="editedItem.clinic"
                  :label="$t('vet_visits.fields.clinic')"
                  variant="underlined"
                  :rules="[
                    (v) => !!v || $t('vet_visits.validation.required', { field: $t('vet_visits.fields.clinic') }),
                  ]"
                ></v-text-field>
              </v-col>
            </v-row>

            <!-- Paso 2: Diagnóstico y tratamiento -->
            <v-row dense v-if="step === 1">
              <v-col cols="12">
                <v-textarea
                  v-model="editedItem.diagnosis"
                  :label="$t('vet_visits.fields.diagnosis')"
                  variant="underlined"
                  rows="4"
                  :rules="[
                    (v) => !v || v.length <= 500 || $t('vet_visits.validation.max_length_diagnosis'),
                  ]"
                ></v-textarea>
              </v-col>

              <v-col cols="12">
                <v-textarea
                  v-model="editedItem.treatment_given"
                  :label="$t('vet_visits.fields.treatment_given')"
                  variant="underlined"
                  rows="3"
                ></v-textarea>
              </v-col>

              <v-col cols="12">
                <v-textarea
                  v-model="editedItem.recommendations"
                  :label="$t('vet_visits.fields.recommendations')"
                  variant="underlined"
                  rows="3"
                ></v-textarea>
              </v-col>
            </v-row>

            <!-- Paso 3: Siguiente cita y documento -->
            <v-row dense v-if="step === 2">
              <v-col cols="12">
                <v-locale-provider>
                  <v-menu v-model="menu2" :close-on-content-click="false" offset-y min-width="auto" transition="scale-transition" location="end">
                    <template v-slot:activator="{ props }">
                      <v-text-field
                        v-bind="props"
                        :model-value="editedItem.next_visit"
                        :label="$t('vet_visits.fields.next_visit')"
                        variant="underlined"
                        readonly
                      ></v-text-field>
                    </template>
                    <v-date-picker
                      :modelValue="parseDateString(editedItem.next_visit)"
                      @update:model-value="updateDate1"
                      format="yyyy-MM-dd"
                      color="#03626C"
                      :min="editedItem.date"
                    ></v-date-picker>
                  </v-menu>
                </v-locale-provider>
              </v-col>

              <v-col cols="12" md="6">
              <v-file-input
                    v-model="file"
                    ref="fileInput"
                    :label="$t('vet_visits.fields.image')"
                    variant="underlined"
                    name="file"
                    accept="image/*, .pdf, .doc, .docx"
                    prepend-icon=""
                    @change="onFileSelected"
                  ></v-file-input>
                </v-col>
                <v-col cols="12" md="6">
                  <v-card elevation="6" class="mx-auto" max-width="210" max-height="120">
                    <img
                      v-if="imagenDisponible() && showImage"
                      :src="imgedit"
                      height="120"
                      width="210"
                    />
                    <v-icon
                      v-else
                      class="d-flex align-center justify-center"
                      style="height: 120px; width: 210px; font-size: 120px"
                    >
                      {{ icono }}
                    </v-icon>
                    <v-card-subtitle class="text-center">{{
                      $t("files.fields.preview")
                    }}</v-card-subtitle>
                  </v-card>
                </v-col>
                <!--<v-file-input
                  v-model="editedItem.image"
                  :label="$t('vet_visits.fields.image')"
                  variant="underlined"
                  accept="image/*, .pdf, .doc, .docx"
                  show-size
                  :rules="[
                    (file) => !file || file.size < 5242880 || $t('vet_visits.validation.max_file_size'),
                  ]"
                ></v-file-input>
              </v-col>-->
            </v-row>

            <!-- Navegación -->
            <div class="d-flex justify-space-between mt-8">
              <v-btn
                variant="text"
                class="text-grey-darken-1"
                @click="step > 0 ? step-- : close()"
              >
                {{ step === 0 ? $t("buttons.close") : $t("buttons.previous") }}
              </v-btn>

              <v-btn
                variant="text"
                class="text-deep-purple-accent-3"
                @click="nextStep"
                :disabled="!validStep"
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
          {{ $t("deleteDialog.title", { item: $t(`deleteDialog.items.wish`) }) }}</span
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
  <v-dialog v-model="dialogPhoto" max-width="500" @click:outside="closeModal">
    <v-card>
      <v-toolbar color="#03626C" dark>
        <v-toolbar-title class="text-body-2 font-weight-bold">{{
          fileTitle
        }}</v-toolbar-title>
        <v-spacer></v-spacer>
        <v-btn icon @click="downloadFile" v-if="selectedFile">
          <v-icon>mdi-download</v-icon>
        </v-btn>
        <v-btn icon @click="closeModal">
          <v-icon>mdi-close</v-icon>
        </v-btn>
      </v-toolbar>

      <v-card-text class="text-center pa-6">
        <!-- Cargando -->
        <v-skeleton-loader
          v-if="loadingImage"
          type="image"
          height="500"
        ></v-skeleton-loader>

        <!-- Imagen -->
        <v-img
          v-else-if="isImage"
          :src="selectedImageUrl"
          alt="Imagen"
          max-height="700"
          contain
          class="ma-auto"
        ></v-img>

        <!-- Vista para archivos no imágenes -->
        <div v-else-if="selectedFile && !isImage" class="pa-8">
          <v-icon size="100" color="#03626C" class="mb-4">
            {{ getFileIcon }}
          </v-icon>
          <div class="text-body-1 mb-4">
            {{ selectedFile.name }} ({{ formatFileSize(selectedFile.size) }})
          </div>
          <v-btn color="#03626C" @click="downloadFile" :loading="this.dowloading">
            <v-icon start class="text-body-2 font-weight-bold">mdi-download</v-icon>
            {{ $t("files.listing.actions.download") }}
          </v-btn>
        </div>

        <!-- Error -->
        <div v-else class="pa-8 text-red">
          <v-icon size="80" color="red">mdi-alert-circle</v-icon>
          <div class="text-h6 mt-2">No se pudo cargar el archivo</div>
        </div>
      </v-card-text>
    </v-card>
  </v-dialog>
</template>

<script>
import LocalStorageService from "@/LocalStorageService";
import { handleRequest } from "@/utils/api"; // Ruta al archivo
import { format } from "date-fns";
export default {
     props: {
    pet: {
      type: Object,
      required: true
    },
  },
  data: () => ({
     steps: [
      { key: "basic" },
      { key: "medical" },
      { key: "follow_up" }
    ],
    file: null,
    showImage: false,
    icono: "mdi-file",
    imgMiniatura: "",
    step: 0,
    snackbar: false,
    sb_type: "",
    sb_message: "",
    sb_timeout: 2000,
    sb_title: "",
    sb_icon: "",
    valid: true,
    person_id: "",
    loading: false,
    mostrar: false,
    home_id:"",
    dialog: false,
    dialogDelete: false,
    visits: [],
    data: {},
    editedItem: {
       id: "",
      date: null,
      vet_name: "",
      clinic: "",
      reason: "",
      diagnosis: "",
      treatment_given: "",
      recommendations: "",
      next_visit: null,
      image: "",
      pet_id: "",
      home_id: ""
    },
    originalItem: {
      id: "",
      date: null,
      vet_name: "",
      clinic: "",
      reason: "",
      diagnosis: "",
      treatment_given: "",
      recommendations: "",
      next_visit: null,
      image: "",
      pet_id: "",
      home_id: ""
    },
    defaultItem: {
      id: "",
      date: null,
      vet_name: "",
      clinic: "",
      reason: "",
      diagnosis: "",
      treatment_given: "",
      recommendations: "",
      next_visit: null,
      image: "",
      pet_id: "",
      home_id: ""
    },
    editedIndex: -1,
    search: "",
    menu: false,
    input: null,
    menu2: false,
    input2: null,
    dialogPhoto: false,
    loadingImage: false,
    selectedImageUrl: "",
    selectedFile: null,
    nameRules: [
      (v) => !!v || "El campo es requerido",
      (v) => (v && v.length <= 50) || "El campo debe tener menos de 51 caracteres",
      (v) => (v && v.length >= 3) || "El campo debe tener al menos de 3 caracteres",
    ],
    selectRules: [(v) => !!v || "Seleccionar al menos un elemento"],
    priceRules: [
      (v) => !!v || "El precio es obligatorio", // El campo es obligatorio
      (v) =>
        /^[0-9]+(\.[0-9]{1,2})?$/.test(v) ||
        "El precio debe ser un número válido con hasta 2 decimales", // Valida el formato del precio
      (v) => v > 0 || "El precio debe ser un número positivo", // El precio debe ser positivo
    ],
  }),
  computed: {
     validStep() {
    switch (this.step) {
      case 0:
        return !!this.editedItem.reason || !!this.editedItem.date;
      case 1:
        return true; // Todos los campos son opcionales en el segundo paso
      default:
        return true;
    }
  },
    formTitle() {
      return this.editedIndex === -1 ? "Agregar Deseo" : "Editar Deseo";
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
    dateFormatted1() {
      const date = this.input1 ? new Date(this.input1) : new Date();
      const day = date.getDate().toString().padStart(2, "0");
      const month = (date.getMonth() + 1).toString().padStart(2, "0");
      const year = date.getFullYear();
      return `${year}-${month}-${day}`;
    },
    getDate1() {
      return this.input1 ? new Date(this.input1) : new Date();
    },
    
    imgedit() {
      return this.imgMiniatura;
    },
     /*isImage(imagePath) {
  const imageTypes = ['jpg', 'jpeg', 'png', 'gif', 'webp', 'bmp', 'svg'];
  const type = this.getFileType(imagePath);
  return type ? imageTypes.includes(type) : false;
},*/
  },
  mounted() {
    this.person_id = JSON.parse(LocalStorageService.getItem("person_id"));
    this.home_id = JSON.parse(LocalStorageService.getItem("home_id"));
    this.initialize();
  },
  methods: {
    isImage(imagePath) {
      console.log("imagenPath:", imagePath);
    const imageTypes = ['jpg', 'jpeg', 'png', 'gif', 'webp', 'bmp', 'svg'];
    const type = this.getFileType(imagePath);
    return type ? imageTypes.includes(type) : false;
  },
    parseDateString(dateString) {
    if (!dateString) return null;
    const [year, month, day] = dateString.split('-');
    return new Date(year, month - 1, day);
  },
    getTypeColor(type) {
      const colorMap = {
        Personal: "deep-purple",      // Color morado para asuntos personales
        Profesional: "indigo",       // Color índigo para temas profesionales
        Hogar: "teal",               // Color verde azulado para el hogar
        // Puedes agregar más tipos si es necesario
        Regalo: "pink",              // Ejemplo adicional
        Otro: "blue-grey"            // Color neutral para otros tipos
      };
      
      // Retorna el color correspondiente o un color por defecto (primary)
      return colorMap[type] || "blue";
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
          year: "numeric", // <-- Añadido: muestra el año
        })
        .replace(/\./g, ""); // Elimina los puntos de abreviaturas (ej: "mar." → "mar")
  }
},
 truncate(text, length) {
    if (!text) return '—';
    return text.length > length ? text.substring(0, length) + '...' : text;
  },
    nextStep() {
      if (this.step < this.steps.length - 1) {
        this.step++;
      } else {
        this.save();
      }
    },
    updateDate(value) {
    const year = value.getFullYear();
    const month = String(value.getMonth() + 1).padStart(2, '0');
    const day = String(value.getDate()).padStart(2, '0');
    this.input = `${year}-${month}-${day}`;

      this.editedItem.date = this.input;
      this.menu = false;
    },
    updateDate1(value) {
      const year = value.getFullYear();
      const month = String(value.getMonth() + 1).padStart(2, '0');
      const day = String(value.getDate()).padStart(2, '0');
      this.input2 = `${year}-${month}-${day}`;

      this.editedItem.next_visit = this.input2;
      this.menu2 = false;
    },
    async showAdd() {
      this.editedIndex = -1;
      this.step = 0;
      this.dialog = true;
    },
    close() {
      this.dialog = false;
      this.showStatus = false;
      this.$nextTick(() => {
        this.editedItem = Object.assign({}, this.defaultItem);
        this.originalItem = Object.assign({}, this.defaultItem);
      });
      this.editedIndex = -1;
      this.file = null;
      this.imgMiniatura = "";
    },
    async initialize() {
      try {
        this.data = {};
        this.data.pet_id = this.pet.id;
        this.loading = true;
        const result = await handleRequest({
          endpoint: "get-vet-visits",
          method: "POST",
          data: this.data,
        });

        if (result.success) {
          // Si la solicitud es exitosa, asignamos las sucursales
          this.visits = result.data?.visits || [];
          // Filtro 1: donde person_id sea igual a this.person_id y type sea igual a 'Personal'
        } else {
          // Si no hay datos, asignamos un array vacío
          this.visits = [];
        }
      } catch (error) {
        this.loading = false;
        // Captura de errores no controlados
        this.showAlert(
          "error",
          "Ocurrió un error inesperado al cargar los deseos.",
          3000
        );
      } finally {
        this.loading = false;
      }
    },
    async save() {
      this.loading = true;
      if (this.editedIndex === -1) {
        this.valid = false;
        const fieldsToUpdate = [
          "date",
          "vet_name",
          "clinic",
          "reason",
          "diagnosis",
          "treatment_given",
          "recommendations",
          "next_visit",
          "image",
          "pet_id",
          "home_id"
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
          updatedFields.home_id = this.home_id;
          updatedFields.pet_id = this.pet.id;
          if (this.file) {
            updatedFields.image = this.editedItem.image;
          }
          const formData = new FormData();
          for (let key in updatedFields) {
            formData.append(key, updatedFields[key]);
          }


          try {
            const result = await handleRequest({
              endpoint: "vet-visit",
              method: "POST",
              data: formData,
            });

            // Manejo de la respuesta según el resultado
            if (result.success) {
              this.loading = false;
              this.showAlert("success", result.message, 3000);
              this.initialize();
            } else {
              this.close();
              this.loading = false;
              this.showAlert("warning", result.message, 3000);
            }
          } catch (error) {
            this.loading = false;
            this.close();
            // Este bloque captura errores inesperados fuera del manejo estándar
            this.showAlert(
              "error",
              "Ocurrió un error inesperado al procesar la solicitud.",
              3000
            );
          }
        } else {
          this.loading = false;
          this.close();
          this.showAlert("success", "Debe completar los datos de la vacuna.", 3000);
        }
      } else {
        this.valid = false;
        const fieldsToUpdate = [
          "date",
          "vet_name",
          "clinic",
          "reason",
          "diagnosis",
          "treatment_given",
          "recommendations",
          "next_visit",
          "image",
          "pet_id",
          "home_id"
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
          if (this.file) {
            updatedFields.image = this.editedItem.image;
          }
        if (Object.keys(updatedFields).length > 0) {
          updatedFields.id = this.editedItem.id;
          const formData = new FormData();
          for (let key in updatedFields) {
            formData.append(key, updatedFields[key]);
          }
          try {
            const result = await handleRequest({
              endpoint: "vet-visit-update",
              method: "POST",
              data: formData,
            });

            // Manejo de la respuesta según el resultado
            if (result.success) {
              this.loading = false;
              this.showAlert("success", result.message, 3000);
              this.initialize();
            } else {
              this.close();
              this.loading = false;
              this.showAlert("warning", result.message, 3000);
            }
          } catch (error) {
            this.loading = false;
            this.close();
            // Este bloque captura errores inesperados fuera del manejo estándar
            this.showAlert(
              "error",
              "Ocurrió un error inesperado al procesar la solicitud.",
              3000
            );
          }
        } else {
          this.loading = false;
          this.close();
          this.showAlert("success", "No se realizaron cambios.", 3000);
        }
      }
      this.close();
    },
    async editItem(item) {
      (this.showImage = false), (this.icono = "mdi-file");
      this.editedIndex = 1;
      this.step = 0;
      this.originalItem = Object.assign({}, item);
      this.editedItem = Object.assign({}, item);
        this.input = item.date;
      this.input2 = item.next_visit;
      this.file = null;
      const imagePath = item.image;
  if (!imagePath) {
    // No hay archivo adjunto
    this.showImage = false;
    this.icono = "mdi-paperclip";
    this.imgMiniatura = null;
  } else {
    const fileName = imagePath.split('/').pop();
    const extension = fileName?.split('.').pop()?.toLowerCase();

    const imageExtensions = ['jpg', 'jpeg', 'png', 'gif', 'webp', 'bmp'];
    const baseUrl = `${this.$axios.defaults.baseURL}images/`; // Ajusta esta ruta según tu backend
    const fileUrl = `${baseUrl}${imagePath}`;

    if (extension && imageExtensions.includes(extension)) {
      // Es una imagen
      this.showImage = true;
      this.icono = "mdi-image";
      // Cargar la imagen para verificar que existe
      const img = new Image();
      img.src = fileUrl;
      img.onload = () => {
        this.imgMiniatura = fileUrl;
      };
      img.onerror = () => {
        console.error("Error al cargar la imagen:", fileUrl);
        this.showAlert("error", "No se pudo cargar la imagen.", 3000);
        this.imgMiniatura = null;
        this.showImage = false;
      };
    } else {
      // Es un documento
      this.showImage = false;
      this.imgMiniatura = null;

      // Asignar ícono según extensión
      switch (extension) {
        case 'pdf':
          this.icono = 'mdi-file-pdf-box';
          break;
        case 'doc':
        case 'docx':
          this.icono = 'mdi-file-word';
          break;
        case 'xls':
        case 'xlsx':
          this.icono = 'mdi-file-excel';
          break;
        case 'txt':
          this.icono = 'mdi-file-document-outline';
          break;
        case 'zip':
        case 'rar':
          this.icono = 'mdi-zip-box';
          break;
        default:
          this.icono = 'mdi-file';
      }
    }
  }
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
      });
    },
    async deleteItemConfirm() {
      try {
        let request = {
          id: this.editedItem.id,
        };
        const result = await handleRequest({
          endpoint: "vet-visit-destroy",
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
        this.closeDelete();
      }
    },
    showAlert(sb_type, sb_message, sb_timeout) {
      this.sb_type = sb_type;

      if (sb_type == "success") {
        this.sb_title = "Éxito";
        this.sb_icon = "mdi-check-circle";
      }

      if (sb_type == "info") {
        this.sb_title = "Información";
        this.sb_icon = "mdi-alert-circle";
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
    imagenDisponible() {
      if (this.imgedit !== undefined && this.imgedit !== "") {
        // Intenta cargar la imagen en un elemento oculto para verificar si está disponible
        let img = new Image();
        img.src = this.imgedit;
        return true; // Devuelve true si la imagen está disponible
      }
      return false; // Si la URL de la imagen no está definida o está vacía, devuelve false
    },
    onFileSelected(event) {
      this.imgMiniatura = "";
      let file = event.target.files[0];
      // Validar el tamaño del archivo (500 KB máximo)
      const maxSize = 500 * 1024; // 500 KB en bytes
      if (file && file.size > maxSize) {
        this.valid = false;
        this.showAlert("warning", "El archivo de imagen debe ser de máximo 500 KB", 3000);
        return; // Detener el proceso si el archivo es demasiado grande
      }
      // Obtener tipo MIME y extensión
      const mimeType = file.type;
      const extension = file.name.split(".").pop().toLowerCase();

      // Lista de extensiones permitidas
      const imageExtensions = ["jpg", "jpeg", "png", "gif"];
      const documentExtensions = ["pdf", "doc", "docx", "txt"];

      // Validar tipo de archivo
      if (
        (mimeType.startsWith("image/") || imageExtensions.includes(extension)) &&
        imageExtensions.includes(extension)
      ) {
        this.cargarImage(file);
        this.showImage = true;
      } else if (documentExtensions.includes(extension)) {
        this.showImage = false;
        // Manejar tipos MIME específicos para documentos
        if (mimeType === "application/pdf" || extension === "pdf") {
          this.icono = "mdi-file-pdf-box";
        } else if (mimeType === "application/msword" || extension === "doc") {
          this.icono = "mdi-file-word";
        } else if (
          mimeType ===
            "application/vnd.openxmlformats-officedocument.wordprocessingml.document" ||
          extension === "docx"
        ) {
          this.icono = "mdi-file-word";
        } else if (mimeType === "text/plain" || extension === "txt") {
          this.icono = "mdi-file-document-outline";
        }
      }

      this.valid = true;
      this.editedItem.image = file;
      //console.log(this.editedItem.image_cardgift);
    },
    cargarImage(file) {
      let reader = new FileReader();
      reader.onload = (e) => {
        this.imgMiniatura = e.target.result;
      };
      reader.readAsDataURL(file);
    },
    openModal(file) {
  this.selectedFile = file;
  this.dialogPhoto = true;
  this.loadingImage = true;
  this.selectedImageUrl = "";

  const baseUrl = this.$axios.defaults.baseURL;
  const fileUrl = `${baseUrl}images/${file.image}`; // Ajusta según tu ruta
  const type = this.getFileType(file.image);

  // Validar si hay archivo
  if (!file.image || file.image.includes('default.jpg')) {
    this.loadingImage = false;
    return;
  }

  // Si es imagen, cargarla
  if (this.isImage(file.image)) {
    const img = new Image();
    img.src = fileUrl;

    img.onload = () => {
      this.selectedImageUrl = fileUrl;
      this.loadingImage = false;
    };

    img.onerror = () => {
      this.loadingImage = false;
      console.error("Error al cargar la imagen");
      this.showAlert("error", "No se pudo cargar la imagen.", 3000);
    };
  } else {
    // No es imagen: no mostramos imagen, pero sí el modal con info
    this.loadingImage = false;
    this.selectedImageUrl = ""; // No hay imagen
  }
},

    getFileIcon(file) {
  const type = this.getFileType(file.image); // <-- usa el campo `image`
  if (!type) return "mdi-file";

  const imageTypes = ['jpg', 'jpeg', 'png', 'gif', 'webp', 'bmp', 'svg'];
  if (imageTypes.includes(type)) return "mdi-image";
  if (type === 'pdf') return "mdi-file-pdf";
  if (['doc', 'docx'].includes(type)) return "mdi-file-word";
  if (['xls', 'xlsx'].includes(type)) return "mdi-file-excel";
  if (['ppt', 'pptx'].includes(type)) return "mdi-file-powerpoint";
  if (['zip', 'rar', '7z', 'tar'].includes(type)) return "mdi-zip-box";
  if (['txt', 'md'].includes(type)) return "mdi-file-document";
  return "mdi-file";
},

    // Color según tipo
    getFileColor(file) {
  const type = this.getFileType(file.image);
  if (!type) return "gray";

  if (this.isImage(file.image)) return "green";
  if (type === 'pdf') return "red";
  if (['doc', 'docx'].includes(type)) return "blue";
  if (['xls', 'xlsx'].includes(type)) return "green";
  if (['ppt', 'pptx'].includes(type)) return "orange";
  return "gray";
},

    // Tooltip
   getTooltip(file) {
  const type = this.getFileType(file.image);
  const typeName = type ? type.toUpperCase() : "Archivo";
  return `Ver ${typeName}`;
},

    // Manejar el clic: imagen → modal, archivo → descargar
   handleFileClick(file) {
  const imagePath = file.image;
  if (!imagePath || imagePath.includes('default.jpg')) {
    return;
  }

  if (this.isImage(imagePath)) {
    this.openModal(file);
  } else {
    this.downloadFileDirect(file);
  }
},

    // Descargar archivo con nombre correcto (como vimos antes)
    async downloadFileDirect(file) {
  const baseUrl = this.$axios.defaults.baseURL;
  const fileUrl = `${baseUrl}images/${file.image}`; // Ajusta: images o images según tu backend
  const type = this.getFileType(file.image);
  const name = file.vet_name || file.reason || "visita-veterinario"; // Nombre genérico
  const fileName = `${name}.${type}`;

  try {
    const response = await fetch(fileUrl, {
      headers: {
        // 'Authorization': 'Bearer ' + localStorage.getItem('token')
      },
    });

    if (!response.ok) throw new Error("Error al descargar");

    const blob = await response.blob();
    const blobUrl = URL.createObjectURL(blob);

    const link = document.createElement("a");
    link.href = blobUrl;
    link.download = fileName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(blobUrl);
  } catch (error) {
    console.error("Error al descargar:", error);
    this.showAlert("error", "No se pudo descargar el archivo.", 3000);
  }
},

    // Cerrar modal
    closeModal() {
      this.dialogPhoto = false;
      // Limpiar datos
      setTimeout(() => {
        this.selectedFile = null;
        this.selectedImageUrl = "";
      }, 300);
    },

    // Descargar archivo
    async downloadFile() {
      this.dowloading = true;
      if (!this.selectedFile) return;

      const baseUrl = this.$axios.defaults.baseURL;
      const fileUrl = `${baseUrl}images/${this.selectedFile.archive}`;
      const fileName = this.selectedFile.name + "." + this.selectedFile.type; // Ej: "Archivo de prueba.docx"

      try {
        // Usamos fetch para obtener el archivo como blob
        const response = await fetch(fileUrl, {
          method: "GET",
          // Si usas autenticación, añade headers
          headers: {
            // 'Authorization': 'Bearer ' + localStorage.getItem('token')
          },
        });

        if (!response.ok) throw new Error("Error al descargar el archivo");

        const blob = await response.blob();
        const blobUrl = URL.createObjectURL(blob);

        // Crear enlace temporal
        const link = document.createElement("a");
        link.href = blobUrl;
        link.download = fileName; // Aquí sí se respeta el nombre
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);

        // Liberar memoria
        URL.revokeObjectURL(blobUrl);
        this.dowloading = false;
      } catch (error) {
        this.dowloading = false;
        console.error("Error al descargar:", error);
        console.log("No se pudo descargar el archivo con el nombre deseado.");
      }
    },

    // Formatear tamaño de archivo
    formatFileSize(bytes) {
  if (!bytes) return "0 Bytes";
  const k = 1024;
  const sizes = ["Bytes", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
},
    getFileType(imagePath) {
  if (!imagePath) return null;

  // Extraer el nombre del archivo (última parte después de /)
  const fileName = imagePath.split('/').pop();
  if (!fileName || fileName === 'default.jpg') return null;

  // Extraer la extensión
  const match = fileName.match(/\.([a-zA-Z0-9]+)$/);
  return match ? match[1].toLowerCase() : null;
},
  },
};
</script>

<style scoped>
.date-display {
  font-size: 0.85rem; /* Equivale a text-caption */
  line-height: 1.1;
  font-weight: 500;
  text-align: center;
  word-break: break-word;
  white-space: normal;
}
.selected-tab {
  background-color: #03626c;
  /* Fondo del tab seleccionado */
  color: white;
  /* Texto blanco */
  border-radius: 4px;
  /* Esquinas redondeadas, opcional */
}
.icono-concavo {
  width: 50px;
  height: 50px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 10px;
  margin-right: 2px;
  color: white;
  /* Mantenemos solo el efecto cóncavo en el ícono 
  box-shadow: inset;*/
  position: relative;
  overflow: hidden;
  transition: all 0.3s ease;
  cursor: pointer;
   z-index: 1;
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
.icono-concavo:hover .img-concava {
  filter: brightness(1.1);
}

.modal-imagen {
  background: transparent !important;
  box-shadow: none !important;
}
</style>
