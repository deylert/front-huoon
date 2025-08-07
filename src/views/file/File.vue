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
      <v-card-text>
        <v-row justify="space-between" align="center" class="mb-6">
        <v-col cols="12" class="d-flex justify-space-between align-center">
          <h2 class="text-body-2 font-weight-bold">{{ $t("files.listing.title") }}</h2>

          <v-btn
            icon
            color="deep-purple-accent-4"
            variant="flat"
            class="elevation-3"
            @click="showAdd"
            :title="this.$t('files.listing.addButton')"
          >
            <v-icon>mdi-plus</v-icon>
          </v-btn></v-col>
        </v-row>
        <v-row justify="space-between" align="center" class="mb-6">
          <v-col
            cols="12"
            class="pt-6"
            style="max-height: 60vh; min-height: 40vh; overflow-y: auto"
          >
            <template v-if="files.length > 0">
              <v-card
                v-for="(file, index) in files"
                :key="index"
                class="mb-4 rounded-lg pa-2"
                density="comfortable"
                elevation="2"
              >
                <v-row>
                  <v-col cols="1" class="d-flex justify-start">
                    <div
                      class="icono-concavo d-flex flex-column justify-center justify-start"
                      :class="`bg-${getTypeColor(file.type)}`"
                    >
                      <div class="date-display">
                        {{ formatIntuitiveDate(file.date) }}
                      </div>
                    </div>
                  </v-col>
                  <v-col cols="7" class="d-flex align-center justify-start">
                    <v-row align="center" class="gap-3">
                      <div>
                        <div class="font-weight-bold text-body-2">
                          {{ file.name }}
                        </div>
                        <div
                          class="text-body-2 d-flex align-center text-grey-darken-1 text-truncate"
                        >
                          {{ file.description }}
                          <v-tooltip
                            activator="parent"
                            location="bottom"
                            max-width="350px"
                          >
                            <span style="white-space: normal; word-break: break-word">
                              {{ $t("files.fields.description") }}: {{ file.description }}
                            </span>
                          </v-tooltip>
                        </div>
                      </div>
                    </v-row>
                  </v-col>
                  <v-col cols="2" class="d-flex align-center justify-start">
                    <div class="d-flex align-center">
                      <v-avatar color="#03626C" size="32" class="mr-2">
                        <v-icon
                          :icon="file.personal ? 'mdi-account' : 'mdi-home'"
                          color="white"
                        ></v-icon>
                      </v-avatar>
                      <span>{{ file.personal ? "Personal" : "Hogar" }}</span>
                      <v-tooltip activator="parent" location="bottom" max-width="350px">
                        <span style="white-space: normal; word-break: break-word">
                          {{ $t("files.fields.type") }}:
                          {{ file.personal ? "Personal" : "Hogar" }}
                        </span>
                      </v-tooltip>
                    </div>
                  </v-col>

                  <v-col cols="1" class="d-flex align-center justify-start text-truncate">
                    <v-btn
                      density="comfortable"
                      :icon="getFileIcon(file)"
                      :color="getFileColor(file)"
                      :title="getTooltip(file)"
                      variant="tonal"
                      elevation="1"
                      class="mr-1 mt-1 mb-1"
                      @click="handleFileClick(file)"
                    ></v-btn>
                  </v-col>
                  <v-col
                    cols="1"
                    class="d-flex align-center ml-auto pe-4"
                    style="margin-left: auto !important"
                  >
                    <v-btn
                      icon
                      variant="text"
                      color="green-darken-2"
                      size="small"
                      @click="editItem(file)"
                    >
                      <v-icon>mdi-pencil</v-icon>
                    </v-btn>
                    <v-btn
                      icon
                      variant="text"
                      color="red-darken-2"
                      size="small"
                      @click="deleteItem(file)"
                    >
                      <v-icon>mdi-delete</v-icon>
                    </v-btn>
                  </v-col>
                </v-row>
              </v-card>
            </template>
            <template v-else>
              <v-col cols="12" class="text-center py-8">
                {{ $t("files.listing.noData") }}
              </v-col>
            </template>
          </v-col>
        </v-row>
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
          <!-- Encabezado -->
          <h5 class="text-grey-darken-2 font-weight-medium">
            {{ $t(`files.formTitle.${editedIndex === -1 ? "create" : "edit"}`) }}
          </h5>
          <p class="text-grey-lighten-1">{{ $t("files.formInstructions") }}</p>

          <v-row class="mt-12">
            <!-- Pasos laterales -->
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
                      <strong>{{ $t(`files.steps.${s.title}.title`) }}</strong>
                      <div class="text-caption text-grey">
                        {{ $t(`files.steps.${s.title}.subtitle`) }}
                      </div>
                    </div>
                  </template>
                </v-timeline-item>
              </v-timeline>
            </v-col>

            <!-- Contenido dinámico según paso -->
            <v-col cols="9">
              <h3 class="text-deep-purple-accent-3 mb-8">
                {{ $t(`files.steps.${steps[step].title}.title`) }}
              </h3>

              <!-- Paso 1: Información básica -->
              <v-row dense v-if="step === 0">
                <v-col cols="12" md="6">
                  <v-text-field
                    v-model="editedItem.name"
                    :label="$t('files.fields.name')"
                    variant="underlined"
                    :rules="[
                      (v) =>
                        !!v ||
                        $t('files.validation.required', {
                          field: $t('files.fields.name'),
                        }),
                    ]"
                  ></v-text-field>
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
                        :label="$t('files.fields.date')"
                      ></v-text-field>
                    </template>
                    <v-locale-provider>
                      <v-date-picker
                        color="#03626C"
                        :modelValue="input"
                        @update:model-value="updateDate"
                        format="yyyy-MM-dd"
                        :min="new Date().toISOString().split('T')[0]"
                      ></v-date-picker>
                    </v-locale-provider>
                  </v-menu>
                </v-col>
                <v-col cols="12" md="12">
                  <v-textarea
                    v-model="editedItem.description"
                    clearable
                    :label="$t('files.fields.description')"
                    variant="underlined"
                  ></v-textarea>
                </v-col>
              </v-row>

              <!-- Paso 2: Detalles adicionales -->
              <v-row dense v-if="step === 1">
                <v-col cols="12" md="6">
                  <v-select
                    v-model="editedItem.personal"
                    :items="Options"
                    item-value="id"
                    item-title="name"
                    :label="$t('files.fields.type')"
                    variant="underlined"
                    density="compact"
                    :rules="[
                      (v) =>
                        !!v ||
                        $t('files.validation.required', {
                          field: $t('files.fields.type'),
                        }),
                    ]"
                  >
                    <template v-slot:item="{ props, item }">
                      <v-list-item v-bind="props">
                        <template v-slot:prepend>
                          <v-avatar size="30" color="#03626C" class="mr-2">
                            <v-icon>{{ item.raw.icon }}</v-icon>
                          </v-avatar>
                        </template>
                      </v-list-item>
                    </template>
                  </v-select>
                  <v-file-input
                    v-model="file"
                    ref="fileInput"
                    :label="$t('files.fields.file')"
                    variant="underlined"
                    density="compact"
                    name="file"
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
          {{ $t("deleteDialog.title", { item: $t(`deleteDialog.items.file`) }) }}</span
        >
      </v-toolbar>

      <v-card-text class="mt-2 mb-2"> {{ $t("deleteDialog.message") }}</v-card-text>
      <v-divider></v-divider>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn color="grey" variant="flat" @click="closeDelete">
          {{ $t("taskForm.buttons.cancel") }}
        </v-btn>
        <v-btn color="#03626C" variant="flat" @click="deleteItemConfirm">
          {{ $t("taskForm.buttons.confirmDelete") }}
        </v-btn>
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
export default {
  data: () => ({
    steps: [
      { title: "basic" }, // Paso 1: Información básica
      { title: "file_config" }, // Paso 2: Archivo y tipo combinados
    ],
    step: 0,
    snackbar: false,
    sb_type: "",
    sb_message: "",
    sb_timeout: 2000,
    sb_title: "",
    sb_icon: "",
    valid: true,
    person_id: "",
    tab: null,
    loading: false,
    mostrar: false,
    dowloading: false,
    file: null,
    showImage: false,
    icono: "mdi-file",
    imgMiniatura: "",
    dialog: false,
    dialogDelete: false,
    files: [],
    filteredPersonalFiles: [],
    filteredHomeFiles: [],
    data: {},
    home_id: "",
    dialogPhoto: false,
    loadingImage: false,
    selectedImageUrl: "",
    selectedFile: null,
    headers: [
      //{ title: 'Sucursal', value: 'branchName', width: '20%' },
      { title: "files.fields.name", value: "name", width: "20%" },
      { title: "files.fields.date", value: "date", width: "10%" },
      { title: "files.fields.type", value: "personal", width: "10%" },
      { title: "files.fields.description", value: "description", width: "30%" },
      { title: "files.fields.file", value: "archive", width: "5%" },
      { title: "files.fields.actions", value: "actions", sortable: false, width: "15%" },
    ],
    Options: [
      { name: "Personal", id: 1, icon: "mdi-account" },
      { name: "Hogar", id: 0, icon: "mdi-home" },
    ],
    editedItem: {
      id: "",
      home_id: "",
      date: "",
      description: "",
      name: "",
      personal: "",
      archive: "",
    },
    originalItem: {
      id: "",
      home_id: "",
      date: "",
      description: "",
      name: "",
      personal: "",
      archive: "",
    },
    defaultItem: {
      id: "",
      home_id: "",
      date: "",
      description: "",
      name: "",
      personal: "",
      archive: "",
    },
    editedIndex: -1,
    search: "",
    menu: false,
    input: null,
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
    fileTitle() {
      return this.selectedFile?.name || "Archivo";
    },
    isImage() {
      if (!this.selectedFile) return false;
      const imageTypes = ["jpg", "jpeg", "png", "gif", "webp", "bmp", "svg"];
      const ext = this.selectedFile.type.toLowerCase();
      return imageTypes.includes(ext);
    },

    // Obtener ícono según tipo de archivo
    translatedHeaders() {
      return this.headers.map((header) => ({
        ...header,
        title: this.$t(header.title),
      }));
    },
    formTitle() {
      return this.editedIndex === -1 ? "Agregar Archivo" : "Editar Archivo";
    },
    imgedit() {
      return this.imgMiniatura;
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
  },
  mounted() {
    this.person_id = JSON.parse(LocalStorageService.getItem("person_id"));
    this.home_id = JSON.parse(LocalStorageService.getItem("home_id"));
    this.initialize();
  },
  methods: {
    getTypeColor(type) {
      const colorMap = {
        Tarea: "warning",
        Meta: "purple",
        // Agrega más tipos si es necesario
      };
      return colorMap[type] || "indigo"; // Color por defecto
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
    nextStep() {
      if (this.step < this.steps.length - 1) {
        this.step++;
      } else {
        this.save();
      }
    },
    isValidFile(file) {
      if (!file) return true; // Si no hay archivo, se considera válido (para permitir limpiar el campo)

      // 1. Primero verifica la extensión del nombre del archivo (más confiable)
      if (file.name) {
        const fileName = file.name.toLowerCase();
        const validExtensions = [".png", ".jpg", ".jpeg", ".pdf", ".docx"];

        if (validExtensions.some((ext) => fileName.endsWith(ext))) {
          return true;
        }
      }

      // 2. Si no coincide por extensión, verifica el tipo MIME (como respaldo)
      if (file.type) {
        const validMimeTypes = [
          "image/png",
          "image/jpeg",
          "application/pdf",
          "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
        ];
        return validMimeTypes.includes(file.type);
      }

      // 3. Si no hay nombre ni tipo, rechaza el archivo
      return false;
    },
    openModal(file) {
      this.selectedFile = file;
      this.dialogPhoto = true;
      this.loadingImage = true;
      this.selectedImageUrl = "";

      const baseUrl = `${this.$axios.defaults.baseURL}`;
      const fileUrl = `${baseUrl}images/${file.archive}`; // Asumiendo que los archivos están en /images/

      // Validación de archivo por defecto
      if (!file.archive || file.archive === "files/default.jpg") {
        this.loadingImage = false;
        return;
      }

      // Si es imagen, cargarla
      if (this.isImage) {
        const img = new Image();
        img.src = fileUrl;

        img.onload = () => {
          this.selectedImageUrl = fileUrl;
          this.loadingImage = false;
        };

        img.onerror = () => {
          this.loadingImage = false;
          // No cerramos, se muestra mensaje de error
        };
      } else {
        // No es imagen: solo activamos la vista de archivo
        this.loadingImage = false;
      }
    },

    getFileIcon(file) {
      const type = file.type?.toLowerCase() || "";

      if (["jpg", "jpeg", "png", "gif", "webp", "bmp", "svg"].includes(type)) {
        return "mdi-image";
      } else if (type === "pdf") {
        return "mdi-file-pdf";
      } else if (["doc", "docx"].includes(type)) {
        return "mdi-file-word";
      } else if (["xls", "xlsx"].includes(type)) {
        return "mdi-file-excel";
      } else if (["ppt", "pptx"].includes(type)) {
        return "mdi-file-powerpoint";
      } else if (["zip", "rar", "7z", "tar"].includes(type)) {
        return "mdi-zip-box";
      } else if (["txt", "md"]) {
        return "mdi-file-document";
      }
      return "mdi-file";
    },

    // Color según tipo
    getFileColor(file) {
      const type = file.type?.toLowerCase() || "";
      if (["jpg", "jpeg", "png", "gif"].includes(type)) return "green";
      if (type === "pdf") return "red";
      if (["doc", "docx"].includes(type)) return "blue";
      if (["xls", "xlsx"].includes(type)) return "green";
      if (["ppt", "pptx"].includes(type)) return "orange";
      return "gray";
    },

    // Tooltip
    getTooltip(file) {
      const type = file.type?.toUpperCase() || "Archivo";
      return `Ver ${type}`;
    },

    // Manejar el clic: imagen → modal, archivo → descargar
    handleFileClick(file) {
      const isImage = ["jpg", "jpeg", "png", "gif", "webp", "bmp", "svg"].includes(
        file.type?.toLowerCase()
      );

      if (!file.archive || file.archive === "files/default.jpg") {
        return;
      }

      if (isImage) {
        this.openModal(file); // Abre el modal (tu función actual)
      } else {
        this.downloadFileDirect(file); // Descarga directamente
      }
    },

    // Descargar archivo con nombre correcto (como vimos antes)
    async downloadFileDirect(file) {
      const baseUrl = this.$axios.defaults.baseURL;
      const fileUrl = `${baseUrl}images/${file.archive}`;
      const ext = file.type?.toLowerCase();
      const name = file.name;
      const fileName = name.endsWith(`.${ext}`) ? name : `${name}.${ext}`;

      try {
        const response = await fetch(fileUrl, {
          headers: {
            // Descomenta si necesitas autenticación
            // 'Authorization': 'Bearer ' + localStorage.getItem('token')
          },
        });

        if (!response.ok) throw new Error("Error");

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
        console.log("No se pudo descargar el archivo.");
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
    formatNumber(value) {
      // Si el valor es menor que 1000, devuelve el valor original con dos decimales
      if (value < 1000) {
        return (Math.round((value + Number.EPSILON) * 100) / 100).toLocaleString(
          "en-US",
          { minimumFractionDigits: 2, maximumFractionDigits: 2 }
        );
      }

      // Primero, redondea el valor a dos decimales
      value = Math.round((value + Number.EPSILON) * 100) / 100;

      // Convierte el valor a cadena con formato de número local (en-US)
      let formattedValue = value.toLocaleString("en-US", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      });

      return formattedValue;
    },
    clearFields() {
      // Limpiar los valores de ingreso y gasto al cambiar el tipo
      this.editedItem.income = "";
      this.editedItem.spent = "";
      this.showType = !this.showType;
    },
    updateDate(val) {
      this.input = val;
      this.editedItem.date = this.dateFormatted;
      this.menu = false;
    },
    async showAdd() {
      this.step = 0;
      this.dialog = true;
      this.editedItem.home_id = this.home_id;
    },
    close() {
      this.dialog = false;
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
        this.data.home_id = this.home_id;
        this.data.personal = 2;
        this.loading = true;
        const result = await handleRequest({
          endpoint: "get-type-files",
          method: "POST",
          data: this.data,
        });

        if (result.success) {
          // Si la solicitud es exitosa, asignamos las sucursales
          this.files = result.data?.files || [];
          // Filtro 1: donde person_id sea igual a this.person_id y type sea igual a 'Personal'
          this.filteredPersonalFiles = this.files.filter((file) => file.personal === 1);

          // Filtro 2: donde home_id sea igual a this.home_id
          this.filteredHomeFiles = this.files.filter((file) => file.personal === 0);
        } else {
          // Si no hay datos, asignamos un array vacío
          this.files = [];
          //this.showAlert("info", "No hay archivos disponibles.", 3000);
        }
      } catch (error) {
        this.loading = false;
        // Captura de errores no controlados
        this.showAlert(
          "error",
          "Ocurrió un error inesperado al cargar las finanzas.",
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
          "home_id",
          "name",
          "archive",
          "date",
          "description",
          "personal",
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
          updatedFields.date = this.editedItem.date ? this.editedItem.date : new Date();
          updatedFields.home_id = this.editedItem.home_id;
          if (this.file) {
            updatedFields.archive = this.editedItem.archive;
          }
          const formData = new FormData();
          for (let key in updatedFields) {
            formData.append(key, updatedFields[key]);
          }

          console.log("formData");
          console.log(formData);

          try {
            const result = await handleRequest({
              endpoint: "file",
              method: "POST",
              data: formData,
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
          this.showAlert("success", "Debe completar los datos del archivo.", 3000);
        }
      } else {
        this.valid = false;
        const fieldsToUpdate = [
          "home_id",
          "name",
          "archive",
          "date",
          "description",
          "personal",
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
          updatedFields.id = Number(this.editedItem.id);
          if (this.file) {
            updatedFields.archive = this.editedItem.archive;
          }
          const formData = new FormData();
          for (let key in updatedFields) {
            formData.append(key, updatedFields[key]);
          }
          try {
            const result = await handleRequest({
              endpoint: "file-update",
              method: "POST",
              data: formData,
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
          this.showAlert("success", "No se realizaron cambios.", 3000);
        }
      }
      this.close();
    },
    async editItem(item) {
      (this.showImage = false), (this.icono = "mdi-file");
      this.editedIndex = 1;
      this.originalItem = Object.assign({}, item);
      this.editedItem = Object.assign({}, item);
      this.file = null;
      const imageExtensions = ["jpg", "jpeg", "png", "gif"];
      // Crear la imagen y configurar el src
      if (!imageExtensions.includes(item.type) && !item.type.startsWith("image/")) {
        this.showImage = false;
        // Manejar tipos MIME específicos para documentos
        if (item.type === "pdf") {
          this.icono = "mdi-file-pdf-box";
        } else if (item.type === "doc") {
          this.icono = "mdi-file-word";
        } else if (item.type === "docx") {
          this.icono = "mdi-file-word";
        } else if (item.type === "txt") {
          this.icono = "mdi-file-document-outline";
        }
      }
      // Usar una función asíncrona para manejar la carga de la imagen
      else {
        this.showImage = true;
        const img = new Image();
        img.src = `${this.$axios.defaults.baseURL}images/${item.archive}`; // Se asume que item.image_url es la URL de la imagen
        img.onload = async () => {
          try {
            // Asignar la imagen cargada a imgMiniatura
            this.imgMiniatura = `${this.$axios.defaults.baseURL}images/${item.archive}`;
          } catch (error) {
            console.error("Error al cargar la imagen", error);
            this.showAlert("error", "Error al cargar la imagen.", 3000);
          }
        };
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
          endpoint: "file-destroy",
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
      this.editedItem.archive = file;
      //console.log(this.editedItem.image_cardgift);
    },
    cargarImage(file) {
      let reader = new FileReader();
      reader.onload = (e) => {
        this.imgMiniatura = e.target.result;
      };
      reader.readAsDataURL(file);
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
.img-concava {
  width: 100%;
  height: 100%;
  object-fit: cover; /* Asegura que la imagen cubra el espacio */
  border-radius: 8px; /* Para que coincida con el contenedor */
}
.selected-tab {
  background-color: #03626c;
  /* Fondo del tab seleccionado */
  color: white;
  /* Texto blanco */
  border-radius: 4px;
  /* Esquinas redondeadas, opcional */
}
</style>
