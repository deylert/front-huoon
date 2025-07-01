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
      <h2 class="text-h5 font-weight-bold">{{ $t("viewTitles.medicalExams") }}</h2>
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
    <template v-if="medicalExams.length > 0">
  <v-card
    v-for="(exam, index) in medicalExams"
    :key="index"
    class="mb-4 rounded-lg"
    elevation="2"
  >
    <v-row no-gutters class="ma-0">
      <!-- Columna 1: Fecha -->
      <v-col cols="2" md="1" class="py-3 d-flex align-center justify-center">
        <div class="text-body-2 font-weight-bold">
          {{ formatDate(exam.date) }}
        </div>
      </v-col>

      <!-- Columna 2: Tipo y Nombre -->
      <v-col cols="3" md="2" class="px-2 py-3">
        <div class="text-subtitle-1 font-weight-bold text-blue-darken-4 mb-1">
          {{ exam.typeName || exam.type_name || $t("medicalExams.notRecorded") }}
        </div>
        <div class="text-body-1 font-weight-medium">
          {{ exam.examName || exam.exam_name || $t("medicalExams.notRecorded") }}
        </div>
      </v-col>

      <!-- Columna 3: Resultados -->
      <v-col cols="2" md="3" class="px-1 py-3">
        <div v-if="exam.results" class="h-100">
          <div class="text-caption font-weight-bold text-grey-darken-2 mb-1">
            {{ $t("medicalExams.fields.results") }}:
          </div>
          <v-tooltip bottom max-width="400px">
            <template v-slot:activator="{ props }">
              <div 
                v-bind="props"
                class="text-body-2 text-grey-darken-3 text-truncate-3-lines"
              >
                {{ exam.results }}
              </div>
            </template>
            <span>{{ exam.results }}</span>
          </v-tooltip>
        </div>
      </v-col>

      <!-- Columna 4: Observaciones -->
      <v-col cols="2" md="3" class="px-1 py-3">
        <div v-if="exam.observations" class="h-100">
          <div class="text-caption font-weight-bold text-grey-darken-2 mb-1">
            {{ $t("medicalExams.fields.observations") }}:
          </div>
          <v-tooltip bottom max-width="400px">
            <template v-slot:activator="{ props }">
              <div 
                v-bind="props"
                class="text-body-2 text-grey-darken-3 text-truncate-3-lines"
              >
                {{ exam.observations }}
              </div>
            </template>
            <span>{{ exam.observations }}</span>
          </v-tooltip>
        </div>
      </v-col>

      <!-- Columna 5: Archivo y Acciones -->
      <v-col cols="3" md="2" class="px-2 py-6 d-flex flex-column justify-space-between">
        <!-- Archivo -->
        <div v-if="exam.archive && exam.archive !== 'medicalexams/default.jpg'">
          <v-btn 
            density="comfortable" 
            icon="mdi-eye" 
            color="green"
            @click="openModal(exam.archive)" 
            variant="tonal" 
            size="small"
            class="mr-1"
            title="Ver archivo adjunto"
          ></v-btn>
        </div>
        </v-col>
        <v-col cols="3" md="1" class="px-2 py-3 d-flex flex-column justify-space-between">
        <!-- Acciones -->
        <div class="d-flex justify-end mt-2">
          <v-btn
            icon
            variant="text"
            color="green-darken-2"
            size="small"
            @click="editItem(exam)"
            class="mx-1"
          >
            <v-icon>mdi-pencil</v-icon>
          </v-btn>
          <v-btn
            icon
            variant="text"
            color="red-darken-2"
            size="small"
            @click="deleteItem(exam)"
            class="mx-1"
          >
            <v-icon>mdi-close</v-icon>
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
          {{ $t("medicalExams.noRecords") }}
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
            {{ $t("medicalExams.formInstructions") }}
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
                      <strong>{{ $t(`medicalExams.steps.${s.title}.title`) }}</strong>
                      <div class="text-caption text-grey">
                        {{ $t(`medicalExams.steps.${s.title}.subtitle`) }}
                      </div>
                    </div>
                  </template>
                </v-timeline-item>
              </v-timeline>
            </v-col>

            <!-- Contenido dinámico según paso -->
            <v-col cols="9">
              <h3 class="text-deep-purple-accent-3 mb-8">
                {{ $t(`medicalExams.steps.${steps[step].title}.title`) }}
              </h3>

              <!-- Paso 1: Detalles del examen -->
              <v-row dense v-if="step === 0">
                <v-col cols="12" sm="6">
                  <v-autocomplete
                    v-model="editedItem.type_id"
                    :items="examTypes"
                    :label="$t('medicalExams.fields.type')"
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
                                style="
                                  white-space: nowrap;
                                  overflow: hidden;
                                  text-overflow: ellipsis;
                                "
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
                    v-model="editedItem.exam_name"
                    :label="$t('medicalExams.fields.exam_name')"
                    variant="underlined"
                    :rules="examNameRules"
                  />
                </v-col>
                <v-col cols="12" md="6">
                  <v-file-input
                    v-model="file"
                    ref="fileInput"
                    :label="$t('medicalExams.fields.attach_file')"
                    variant="underlined"
                    name="file"
                    accept=".png, .jpg, .jpeg, .docx, .pdf"
                    @change="onFileSelected"
                    :prepend-icon="false"
                  >
                  </v-file-input>
                </v-col>
                <v-col cols="12" md="6">
                  <v-card elevation="6" class="mx-auto" max-width="210" max-height="120">
                    <img
                      v-if="imagenDisponible() && this.showImage"
                      :src="imgedit"
                      height="120"
                      :label="$t('medicalExams.fields.file')"
                      width="210"
                    />
                    <v-icon
                      v-else
                      class="d-flex align-center justify-center"
                      style="height: 120px; width: 210px; font-size: 120px"
                      >{{ this.icono }}</v-icon
                    >
                  </v-card>
                </v-col>
              </v-row>

              <!-- Step 2: Resultados y observaciones -->
              <v-row dense v-if="step === 1">
                <v-col cols="12">
                  <v-textarea
                    v-model="editedItem.results"
                    :label="$t('medicalExams.fields.results')"
                    variant="underlined"
                    rows="3"
                    auto-grow
                  />
                </v-col>

                <v-col cols="12">
                  <v-textarea
                    v-model="editedItem.observations"
                    :label="$t('medicalExams.fields.observations')"
                    variant="underlined"
                    rows="3"
                    auto-grow
                  />
                </v-col>

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
                        :label="$t('medicalExams.fields.date')"
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
            $t("deleteDialog.title", { item: $t(`deleteDialog.items.medicalExam`) })
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
  <v-dialog v-model="dialogPhoto" persistent max-width="600px">
    <v-card>
      <v-toolbar color="#03626C">
        <span class="text-subtitle-2 ml-4">Detalle</span> <v-spacer></v-spacer>
        <v-btn @click="dialogPhoto = false">
          <v-icon>mdi-close</v-icon>
        </v-btn>
      </v-toolbar>

      <v-card-text>
        <template v-if="loadingImage">
          <!-- Centro el cargador dentro de su contenedor y aumento su tamaño -->
          <div class="d-flex justify-center align-center" style="min-height: 200px">
            <v-progress-circular
              indeterminate
              color="#03626C"
              style="width: 100px; height: 100px"
            ></v-progress-circular>
          </div>
        </template>
        <template v-else>
          <v-img :src="selectedImageUrl" aspect-ratio="1.5" contain fill-height></v-img>
        </template>
      </v-card-text>
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
        title: "examDetails",
        subtitle: "basic_information",
      },
      {
        title: "results",
        subtitle: "exam_results",
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
    file: null,
    showImage: false,
    icono: "mdi-file",
    imgMiniatura: "",
    dialog: false,
    dialogDelete: false,
    medicalExams: [],
    examTypes: [],
    dialogPhoto: false,
    loadingImage: false,
    selectedImageUrl: "",
    dateMenu: false,
    dateInput: null,
    home_id: "",
    person_id: "",
    editedItem: {
      id: "",
      type_id: null,
      exam_name: "",
      results: "",
      observations: "",
      date: null,
    },
    defaultItem: {
      id: "",
      type_id: null,
      exam_name: "",
      results: "",
      observations: "",
      date: null,
    },
    originalItem: {
      id: "",
      type_id: null,
      exam_name: "",
      results: "",
      observations: "",
      date: null,
    },
    data: {},
    editedIndex: -1,
    search: "",
    dateRules: [(v) => !!v || this.$t("medicalExams.validationMessages.date.required")],
  }),

  computed: {
    typeRules() {
      return [
        v => !!v || this.$t('medicalExams.validationMessages.type.required')
      ];
    },
    examNameRules() {
    return [
      (v) => !v || v.length <= 200 || this.$t("medicalExams.validationMessages.exam_name.maxLength"),
      (v) => !!v || this.$t("medicalExams.validationMessages.exam_name.required")
    ]
  },
    formTitle() {
      return this.editedIndex === -1
        ? this.$t("medicalExams.titles.new")
        : this.$t("medicalExams.titles.edit");
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
    imgedit() {
      return this.imgMiniatura;
    },
  },

  mounted() {
    this.home_id = JSON.parse(LocalStorageService.getItem("home_id"));
    this.person_id = JSON.parse(LocalStorageService.getItem("person_id"));
    this.initialize();
  },

  methods: {
    openModal(imageUrl) {
      this.dialogPhoto = true;
      this.loadingImage = true;
      var img = new Image();
      img.src = `${this.$axios.defaults.baseURL}images/${imageUrl}`;

      img.onload = () => {
        this.selectedImageUrl = `${this.$axios.defaults.baseURL}images/${imageUrl}`;
        this.loadingImage = false;
        //this.dialogPhoto = true; // Abre el modal solo después de que la imagen esté cargada
      };

      img.onerror = () => {
        this.selectedImageUrl = "";
        this.dialogPhoto = false; // Abre el modal incluso si la carga falla, puede mostrar un mensaje de error o una imagen de respaldo
        this.loadingImage = false;
      };
    },
    clearFields() {
      // Limpiar los valores de ingreso y gasto al cambiar el tipo
      this.editedItem.income = "";
      this.editedItem.spent = "";
      this.showType = !this.showType;
    },
    formatDate(dateString) {
      if (!dateString) return "N/R";
      const [year, month, day] = dateString.split("-");
      return `${day}-${month}-${year}`;
    },
    shouldShowTooltip(text) {
      // Mostrar tooltip solo si el texto es lo suficientemente largo como para ser truncado
      return text && text.length > 120; // Ajusta este valor según tus necesidades
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
          endpoint: "get-type",
          method: "POST",
          data: this.data,
        });

        if (result.success) {
          // Si la solicitud es exitosa, asignamos las sucursales
          this.examTypes = result.data?.types || [];
        } else {
          // Si no hay datos, asignamos un array vacío
          this.examTypes = [];
        }
      } catch (error) {
        this.showAlert("error", "Ocurrió un error inesperado al cargar los datos.", 3000);
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
      this.file = null;
      this.imgMiniatura = "";
    },

    async initialize() {
      try {
        this.loading = true;
        const result = await handleRequest({
          endpoint: "get-exam-person",
          method: "POST",
        });

        if (result.success) {
          this.medicalExams = result.data?.medicalExams || [];
        } else {
          this.medicalExams = [];
        }
      } catch (error) {
        this.loading = false;
        this.showAlert("error", "Ocurrió un error al cargar los exámenes médicos.", 3000);
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
                const fieldsToUpdate = ['result', 'archive', 'date', 'type_id', 'observations'];

                let updatedFields = Object.keys(this.editedItem)
                    .filter((key) => fieldsToUpdate.includes(key) && this.editedItem[key] !== this.originalItem[key])
                    .reduce((obj, key) => {
                        obj[key] = this.editedItem[key];
                        return obj;
                    }, {});
                if (Object.keys(updatedFields).length > 0) {
                    updatedFields.date = this.editedItem.date ? this.editedItem.date : new Date();
                    if (this.file) {
                        updatedFields.archive = this.editedItem.archive;
                    }
                    const formData = new FormData();
                    for (let key in updatedFields) {
                        formData.append(key, updatedFields[key]);
                    }

                    try {
                        const result = await handleRequest({
                            endpoint: 'medical-exam',
                            method: 'POST',
                            data: formData
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
                        this.showAlert("error", "Ocurrió un error inesperado al procesar la solicitud.", 3000);
                    }
                } else {
                    this.loading = false;
                    this.showAlert("success", "Debe completar los datos del archivo.", 3000);
                }
            } else {
                this.valid = false;
                const fieldsToUpdate = ['result', 'archive', 'date', 'type_id', 'observations'];
                let updatedFields = Object.keys(this.editedItem)
                    .filter((key) => fieldsToUpdate.includes(key) && this.editedItem[key] !== this.originalItem[key])
                    .reduce((obj, key) => {
                        obj[key] = this.editedItem[key];
                        return obj;
                    }, {});
                if (Object.keys(updatedFields).length > 0) {
                    updatedFields.id = this.editedItem.id;
                    if (this.file) {
                        updatedFields.archive = this.editedItem.archive;
                    }
                    const formData = new FormData();
                    for (let key in updatedFields) {
                        formData.append(key, updatedFields[key]);
                    }
                    try {
                        const result = await handleRequest({
                            endpoint: 'medical-exam-update',
                            method: 'POST',
                            data: formData
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
      this.showImage = false;
      this.icono = "mdi-file";
      this.editedIndex = 1;
      this.originalItem = Object.assign({}, item);
      this.editedItem = Object.assign({}, item);
      this.file = null;

      const imageExtensions = ["jpg", "jpeg", "png", "gif"];
      const extension = item.archive.split(".").pop().toLowerCase(); // Obtener la extensión del archivo

      // Mapeo de tipos de archivo a iconos
      const iconMap = {
        pdf: "mdi-file-pdf-box",
        doc: "mdi-file-word",
        docx: "mdi-file-word",
        txt: "mdi-file-document-outline",
      };

      // Verificar si es una imagen
      if (imageExtensions.includes(extension) || item.type.startsWith("image/")) {
        this.showImage = true;
        const img = new Image();
        img.src = `${this.$axios.defaults.baseURL}images/${item.archive}`;
        img.onload = async () => {
          try {
            this.imgMiniatura = `${this.$axios.defaults.baseURL}images/${item.archive}`;
          } catch (error) {
            console.error("Error al cargar la imagen", error);
            this.showAlert("error", "Error al cargar la imagen.", 3000);
          }
        };
      } else {
        // Asignar el icono correspondiente al tipo de archivo
        this.icono = iconMap[extension] || "mdi-file";
      }
      this.data = {};
      this.data.type = "Salud";
      try {
        const result = await handleRequest({
          endpoint: "get-type",
          method: "POST",
          data: this.data,
        });

        if (result.success) {
          // Si la solicitud es exitosa, asignamos las sucursales
          this.examTypes = result.data?.types || [];
        } else {
          // Si no hay datos, asignamos un array vacío
          this.examTypes = [];
        }
      } catch (error) {
        this.showAlert("error", "Ocurrió un error inesperado al cargar los datos.", 3000);
      } finally {
        this.dialog = true;
      }
      this.dateInput = item.date;
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
          endpoint: "delete-medical-exam",
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
        this.showAlert("error", "Ocurrió un error al eliminar el examen médico.", 3000);
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

    compactExamData(exam) {
      return [
        {
          label: this.$t("medicalExams.fields.type"),
          value: exam.type_name || "N/R",
          fullLabel: this.$t("medicalExams.fields.type"),
          fullValue: exam.type_name || this.$t("medicalExams.notRecorded"),
          icon: "mdi-hospital-box",
          color: "indigo-darken-2",
        },
        {
          label: this.$t("medicalExams.fields.exam_name"),
          value: this.truncateText(exam.exam_name) || "N/R",
          fullLabel: this.$t("medicalExams.fields.exam_name"),
          fullValue: exam.exam_name || this.$t("medicalExams.notRecorded"),
          icon: "mdi-file-document",
          color: "green-darken-2",
        },
      ].filter((item) => item.value !== "N/R");
    },

    compactDetails(exam) {
      const details = [];

      if (exam.results) {
        details.push({
          label: this.$t("medicalExams.fields.results"),
          text: this.truncateText(exam.results),
          fullLabel: this.$t("medicalExams.fields.results"),
          fullText: exam.results,
          icon: "mdi-clipboard-text",
          color: "blue-darken-2",
        });
      }

      if (exam.observations) {
        details.push({
          label: this.$t("medicalExams.fields.observations"),
          text: this.truncateText(exam.observations),
          fullLabel: this.$t("medicalExams.fields.observations"),
          fullText: exam.observations,
          icon: "mdi-comment-text",
          color: "teal-darken-1",
        });
      }

      return details;
    },

    truncateText(text, length = 15) {
      if (!text) return null;
      return text.length > length ? text.substring(0, length) + "..." : text;
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
.text-truncate-3-lines {
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
  text-overflow: ellipsis;
  line-height: 1.4;
  max-height: 4.2em; /* 3 líneas * 1.4 line-height */
}

/* Estilo para el tooltip */
.v-tooltip__content {
  font-size: 0.875rem;
  line-height: 1.5;
  padding: 8px 12px;
  background-color: rgba(97, 97, 97, 0.9);
}
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
.v-text-field,
.v-select,
.v-textarea {
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
