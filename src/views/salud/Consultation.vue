<template>
  <v-snackbar class="mt-12" location="right top" :timeout="sb_timeout" :color="sb_type" elevation="24"
    :multi-line="true" vertical v-model="snackbar">
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
  <!--<v-container fluid fill-height>-->
  <v-card elevation="6" class="mx-2">
    <v-toolbar color="#03626C">
      <v-row align="center">
        <v-col cols="12" md="8" class="grow ml-4">
          <span class="text-subtitle-1"><strong>Consultas Médicas</strong></span>
        </v-col>
        <v-col cols="12" md="3" class="text-right">
          <v-btn class="text-subtitle-1 ml-12" color="white" variant="tonal" elevation="2"
            prepend-icon="mdi-plus-circle" @click="showAdd">
            Agregar Consulta Médica
          </v-btn>
        </v-col>
      </v-row>
    </v-toolbar>

    <v-card-text>
      <v-text-field class="mt-1 mb-1" v-model="search" append-icon="mdi-magnify" label="Buscar" single-line
        hide-details>
      </v-text-field>
      <v-data-table :headers="headers" :search="search" :items="medicalconsultations" class="elevation-1"
        style="max-height: 68vh; overflow-y: auto;" :items-per-page-text="'Elementos por páginas'"
        no-data-text="No hay datos disponibles" :loading="loading" loading-text="Cargando datos..." dense>
        <template v-slot:item.actions="{ item }">
          <v-btn density="comfortable" icon="mdi-pencil" @click="editItem(item)" color="primary" variant="tonal"
            elevation="1" title="Editar Consulta Médica"></v-btn>
          <v-btn density="comfortable" icon="mdi-delete" @click="deleteItem(item)" color="#DA7171" variant="tonal"
            elevation="1" title="Eliminar Consulta Médica"></v-btn>
        </template>
        <!-- Columna de Vacunas -->
        <template v-slot:item.treatments="{ item }">
          <v-list dense style="max-height: 150px; overflow-y: auto;">
            <v-list-item v-for="(treatment, index) in item.treatments" :key="index">
              <v-tooltip location="top">
                <template v-slot:activator="{ props }">
                  <span v-bind="props">{{ treatment.name }}</span>
                </template>
                <span>
                  <strong>Descripción:</strong> {{ treatment.name }}
                </span>
              </v-tooltip>
            </v-list-item>
          </v-list>
        </template>

        <!-- Columna de Medicamentos -->
        <template v-slot:item.files="{ item }">
          <v-list dense style="max-height: 150px; overflow-y: auto;">
            <v-list-item v-for="(file, index) in item.files" :key="index">
              <v-tooltip location="top">
                <template v-slot:activator="{ props }">
                  <span v-bind="props">{{ file.name }}</span>
                </template>
                <span>
                  <strong>Archivo:</strong> {{ file.name }}
                </span>
              </v-tooltip>
            </v-list-item>
          </v-list>
        </template>
      </v-data-table>
    </v-card-text>
  </v-card>
  <!--</v-container>-->

  <v-dialog v-model="dialog" max-width="800px">
    <v-form ref="form" v-model="valid">
      <v-card>
        <!-- Toolbar con título -->
        <v-toolbar color="#03626C">
          <span class="text-subtitle-2 ml-4">{{ formTitle }}</span>
        </v-toolbar>

        <!-- Campos principales -->
        <v-card-text>
          <v-container>
            <v-tabs v-model="tab" vertical>
              <v-tab value="general" :class="tab === 'general' ? 'selected-tab' : ''">Datos Generales</v-tab>
              <v-tab value="treatment" :class="tab === 'treatment' ? 'selected-tab' : ''">Tratamientos</v-tab>
              <v-tab value="archive" :class="tab === 'archive' ? 'selected-tab' : ''">Archivos</v-tab>
            </v-tabs>
            <v-window v-model="tab" min-height="75vh" class="mt-2">
              <v-window-item value="general">
                <br>
                <v-row>
                  <v-col cols="12" md="6">
                    <v-text-field v-model="editedItem.reason" label="Motivo de la Consulta"
                      prepend-icon="mdi-comment-question-outline" variant="underlined" density="compact"></v-text-field>
                  </v-col>
                  <v-col cols="12" md="6">
                    <v-menu v-model="menu" :close-on-content-click="false" :nudge-right="40"
                      transition="scale-transition" offset-y min-width="290px" density="compact">
                      <template v-slot:activator="{ props }">
                        <v-text-field v-bind="props" :modelValue="dateFormatted" variant="underlined"
                          prepend-icon="mdi-calendar" label="Fecha" density="compact"></v-text-field>
                      </template>
                      <v-locale-provider locale="es">
                        <v-date-picker header="Calendario" title="Seleccione la fecha" color="#03626C"
                          :modelValue="input" @update:model-value="updateDate" format="yyyy-MM-dd"
                          :min="new Date().toISOString().split('T')[0]"></v-date-picker>
                      </v-locale-provider>
                    </v-menu>
                  </v-col>
                  <v-col cols="12" md="6">
                    <v-textarea v-model="editedItem.diagnosis" label="Diagnóstico"
                      prepend-icon="mdi-clipboard-check-outline" variant="underlined" density="compact"></v-textarea>
                  </v-col>
                  <v-col cols="12" md="6">
                    <v-textarea v-model="editedItem.medicalNotes" label="Notas Médicas"
                      prepend-icon="mdi-note-text-outline" variant="underlined" density="compact"></v-textarea>
                  </v-col>
                </v-row>
              </v-window-item>
              <v-window-item value="treatment">
                <!-- Tabla de Tratamientos -->
                <v-row>
                  <v-col cols="12">
                    <v-card class="mb-4">
                      <v-toolbar color="#03626C">
                        <v-row align="center">
                          <v-col cols="12" md="4" class="grow ml-4">
                            <span class="text-subtitle-1"><strong>Tratamientos</strong></span>
                          </v-col>
                          <v-col cols="12" md="7" class="text-right">
                            <v-btn class="text-subtitle-1 mr-2" color="white" variant="tonal" elevation="2"
                              prepend-icon="mdi-plus-circle" @click="addTreatment">
                              Agregar Tratamiento
                            </v-btn>
                          </v-col>
                        </v-row>
                      </v-toolbar>
                      <v-data-table :headers="treatmentHeaders" :items="editedItem.treatments"
                        no-data-text="No hay tratamientos registradas" style="max-height: 40vh; overflow-y: auto;"
                        :items-per-page-text="'Elementos por páginas'" dense>
                        <template v-slot:item.actions="{ item }">
                          <v-btn density="comfortable" icon="mdi-pencil" @click="editTreatment(item)" color="primary"
                            variant="tonal"></v-btn>
                          <v-btn density="comfortable" icon="mdi-delete" @click="deleteTreatment(item)" color="error"
                            variant="tonal"></v-btn>
                        </template>
                      </v-data-table>
                    </v-card>
                  </v-col>
                </v-row>
              </v-window-item>
              <v-window-item value="archive">
                <!-- Tabla de archivos -->
                <v-row>
                  <v-col cols=" 12">
                    <v-card class="mb-4">

                      <v-toolbar color="#03626C">
                        <v-row align="center">
                          <v-col cols="12" md="8" class="grow ml-4">
                            <span class="text-subtitle-1"><strong>Archivos Actuales</strong></span>
                          </v-col>
                          <v-col cols="12" md="3" class="text-right">
                          </v-col>
                        </v-row>
                      </v-toolbar>
                      <br>
                      <!-- Input para seleccionar archivos -->
                      <v-file-input label="Selecciona archivos" multiple @change="handleFileChange" v-model="fileInput"
                        density="compact" variant="underlined" style="width: 50%;"></v-file-input>

                      <!-- Data Table para mostrar los archivos -->
                      <v-data-table :headers="filesHeaders" :items="editedItem.files"
                        no-data-text="No hay archivos registrados" style="max-height: 40vh; overflow-y: auto;"
                        :items-per-page-text="'Elementos por páginas'" dense>
                        <!-- Columna personalizada para acciones -->
                        <template v-slot:item.actions="{ item }">
                          <v-btn density="comfortable" icon="mdi-delete" @click="deleteFile(item)" color="error"
                            variant="tonal"></v-btn>
                        </template>
                        <template v-slot:item.files="{ item }">
                          <v-btn density="comfortable" icon="mdi-eye" color="green" v-if="item.path"
                            @click="openModal(item.path)" variant="tonal" elevation="1" class="mr-1 mt-1 mb-1"
                            title="Ver detalles"></v-btn>
                        </template>
                      </v-data-table>
                    </v-card>
                  </v-col>
                </v-row>
              </v-window-item>
            </v-window>
          </v-container>
        </v-card-text>

        <!-- Divider y botones de acción -->
        <v-divider></v-divider>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="#DA7171" variant="flat" @click="close">Cancelar</v-btn>
          <v-btn color="#03626C" variant="flat" :loading="loading" @click="save" :disabled="!valid">Aceptar</v-btn>
        </v-card-actions>
      </v-card>
    </v-form>
  </v-dialog>

  <!-- Diálogo para agregar/editar tratamientos -->
  <v-dialog v-model="treatmentDialog" max-width="500px">
    <v-card>
      <v-toolbar color="#03626C">
        <span class="text-subtitle-2 ml-4">{{ treatmentFormTitle }}</span>
      </v-toolbar>
      <v-card-text>
        <v-text-field v-model="editedTreatment.name" label="Descripción" variant="underlined"
          prepend-icon="mdi-pill"></v-text-field>
      </v-card-text>
      <v-card-actions>
        <v-btn color="#DA7171" variant="flat" @click="closeTreatmentDialog">Cancelar</v-btn>
        <v-btn color="#03626C" variant="flat" @click="saveTreatment">Guardar</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>

  <!-- Diálogo para agregar/editar medicamento -->
  <v-dialog v-model="fileDialog" max-width="500px">
    <v-card>
      <v-card-title>{{ fileFormTitle }}</v-card-title>
      <v-card-text>
        <v-file-input clearable v-model="files" ref="fileInput" label="Archivos" variant="underlined" density="compact"
          name="files" multiple accept=".png, .jpg, .jpeg, .docx, .pdf" @change="onFilesSelected"></v-file-input>
      </v-card-text>
      <v-card-actions>
        <v-btn @click="saveFile" color="primary">Guardar</v-btn>
        <v-btn @click="closeFileDialog" color="secondary">Cancelar</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
  <v-dialog v-model="dialogDelete" max-width="500px">
    <v-card>
      <v-toolbar color="#DA7171">
        <span class="text-subtitle-2 ml-4"> Eliminar una Consulta Médica</span>
      </v-toolbar>
      <v-card-text class="mt-2 mb-2"> ¿Desea eliminar la Consulta Médica Seleccionada?</v-card-text>
      <v-divider></v-divider>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn color="#DA7171" variant="flat" @click="closeDelete">Cancelar</v-btn>
        <v-btn color="#03626C" variant="flat" :loading="loading" @click="deleteItemConfirm">Aceptar</v-btn>
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
          <div class="d-flex justify-center align-center" style="min-height: 200px;">
            <v-progress-circular indeterminate color="#03626C"
              style="width: 100px; height: 100px;"></v-progress-circular>
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
import { handleRequest } from "@/utils/api"; // Ruta al archivo
import _ from 'lodash';
export default {
  data: () => ({
    snackbar: false,
    sb_type: '',
    sb_message: '',
    sb_timeout: 2000,
    sb_title: '',
    sb_icon: '',
    valid: true,
    tab: null,
    loading: false,
    files: [],
    imgMiniatura: '',
    dialog: false,
    dialogDelete: false,
    medicalconsultations: [],
    data: {},
    page: 1,              // Página actual
    itemsPerPage: 5,     // Elementos por página
    totalItems: 0,        // Total de elementos disponibles

    dialogPhoto: false,
    loadingImage: false,
    selectedImageUrl: '',
    headers: [
      { title: 'Motivo de la Consulta', value: 'reason' },
      { title: 'Diagnóstico', value: 'diagnosis' },
      { title: 'Notas Médicas', value: 'medicalNotes' },
      { title: 'Fecha', value: 'date' },
      { title: 'Tratamientos', value: 'treatments' },
      { title: 'Archivos', value: 'files' },
      { title: 'Acciones', value: 'actions', sortable: false, width: '10%' },
    ],

    editedItem: {
      id: '',
      reason: '',
      diagnosis: '',
      treatments: [],
      medicalNotes: '',
      files: []
    },
    defaultItem: {
      id: '',
      reason: '',
      diagnosis: '',
      treatments: [],
      medicalNotes: '',
      files: []
    },
    originalItem: {
      id: '',
      reason: '',
      diagnosis: '',
      treatments: [],
      medicalNotes: '',
      files: []
    },
    treatmentHeaders: [
      { title: 'Descripción', value: 'name' },
      { title: 'Acciones', value: 'actions', sortable: false },
    ],
    filesHeaders: [
      { title: 'Nombre', key: 'name' },
      { title: 'Detalles', value: 'files', },
      { title: 'Acciones', key: 'actions', sortable: false }, // Columna de acciones
    ],
    nextFileId: 1, // Contador para generar IDs únicos
    fileInput: null, // Contador para generar IDs únicos
    treatmentDialog: false, // Controla el diálogo de vacunas
    fileDialog: false, // Controla el diálogo de medicamentos
    editedTreatment: { id: null, name: '' }, // Vacuna en edición
    editedFile: { id: null, name: '' }, // Medicamento en edición
    treatmentFormTitle: 'Agregar Tratamiento', // Título del diálogo de vacunas
    fileFormTitle: 'Agregar Archivo', // Título del diálogo de medicamentos
    editedIndex: -1,
    search: '',
    menu: false,
    input: null,
    nameRules: [
      (v) => !!v || "El campo es requerido",
      (v) => (v && v.length <= 50) ||
        "El campo debe tener menos de 51 caracteres",
      (v) => (v && v.length >= 3) ||
        "El campo debe tener al menos de 3 caracteres",
    ],
    selectRules: [(v) => !!v || "Seleccionar al menos un elemento"],
  }),
  computed: {
    formTitle() {
      return this.editedIndex === -1 ? 'Agregar Consulta' : 'Editar Consulta';
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
        this.selectedImageUrl = '';
        this.dialogPhoto = false; // Abre el modal incluso si la carga falla, puede mostrar un mensaje de error o una imagen de respaldo
        this.loadingImage = false;
      };
    },
    // Manejar la selección de archivos
    handleFileChange(event) {
      // Acceder a los archivos seleccionados desde el evento nativo del DOM
      if (event && event.target && event.target.files) {
        const selectedFiles = Array.from(event.target.files);

        selectedFiles.forEach((file) => {
          const newFile = {
            id: this.editedItem.files.length + 1, // Generar un id único incremental
            name: file.name,
            file: file, // Guardar el archivo completo
          };

          // Verificar si el archivo ya existe en el array
          const existingFileIndex = this.editedItem.files.findIndex(
            (f) => f.id === newFile.id
          );

          if (existingFileIndex === -1) {
            // Si no existe, agregarlo al array
            this.editedItem.files.push(newFile);
          } else {
            // Si existe, actualizarlo
            this.editedItem.files.splice(existingFileIndex, 1, newFile);
          }
        });
      }
      // Limpiar el input de archivos
      this.fileInput = null;
    },
    // Eliminar un archivo
    deleteFile(item) {
      const index = this.editedItem.files.findIndex((f) => f.id === item.id);
      if (index !== -1) {
        this.editedItem.files.splice(index, 1);
      }
    },
    // Método para manejar la paginación
    updatePage(page) {
      this.page = page;
      this.initialize();  // Recarga los almacenes con la nueva página
    },

    // Método para manejar el cambio de elementos por página
    updateItemsPerPage(itemsPerPage) {
      this.itemsPerPage = itemsPerPage;
      this.initialize();  // Recarga los almacenes con el nuevo número de elementos por página
    },
    showAdd() {
      this.editedIndex = -1;
      this.editedItem.files = [];
      this.editedItem.treatments = [];
      this.dialog = true;
    },
    updateDate(val) {
      this.input = val;
      this.editedItem.date = this.dateFormatted;
      this.menu = false;
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
    addTreatment() {
      this.editedTreatment = { id: null, name: '' };
      this.treatmentFormTitle = 'Agregar Tratamineto';
      this.treatmentDialog = true;
    },
    editTreatment(treatment) {
      this.editedTreatment = { ...treatment };
      this.treatmentFormTitle = 'Editar Tratamiento';
      this.treatmentDialog = true;
    },
    deleteTreatment(treatment) {
      this.editedItem.treatments = this.editedItem.treatments.filter(v => v.id !== treatment.id);
    },
    saveTreatment() {
      if (this.editedTreatment.id === null) {
        this.editedTreatment.id = this.editedItem.treatments.length + 1;
        this.editedItem.treatments.push(this.editedTreatment);
      } else {
        const index = this.editedItem.treatments.findIndex(v => v.id === this.editedTreatment.id);
        this.editedItem.treatments.splice(index, 1, this.editedTreatment);
      }
      this.closeTreatmentDialog();
    },
    closeTreatmentDialog() {
      this.treatmentDialog = false;
    },

    // Métodos para Archivos
    addFile() {
      this.editedFile = { id: null, name: '' };
      this.fileFormTitle = 'Agregar Archivo';
      this.fileDialog = true;
    },
    /*editFile(file) {
      this.editedFile = { ...file };
      this.fileFormTitle = 'Editar Archivo';
      this.fileDialog = true;
    },
    deleteFile(file) {
      this.editedItem.files = this.editedItem.files.filter(m => m.id !== file.id);
    },*/
    saveFile() {
      if (this.editedFile.id === null) {
        this.editedFile.id = this.editedItem.files.length + 1;
        this.editedItem.files.push(this.editedFile);
      } else {
        const index = this.editedItem.files.findIndex(m => m.id === this.editedFile.id);
        this.editedItem.files.splice(index, 1, this.editedFile);
      }
      this.closeFileDialog();
    },
    closeFileDialog() {
      this.fileDialog = false;
    },
    async initialize() {
      this.data = {};
      try {
        this.loading = true;
        const result = await handleRequest({
          endpoint: 'get-medical-consultations',
          method: 'POST'
        });

        if (result.success) {
          // Si la solicitud es exitosa, asignamos las sucursales
          this.medicalconsultations = result.data?.medicalConsultations || [];
        } else {
          // Si no hay datos, asignamos un array vacío
          this.medicalconsultations = [];
        }
      } catch (error) {
        this.loading = false;
        // Captura de errores no controlados
        this.showAlert('error', 'Ocurrió un error inesperado al cargar los roles.', 3000);
      } finally {
        this.loading = false;
      }
    },
    async save() {
      this.data = {}
      this.loading = true;
      if (this.editedIndex === -1) {
        this.valid = false;
        // Crear un objeto FormData
        const formData = new FormData();

        // Agregar campos simples al FormData
        formData.append('reason', this.editedItem.reason);
        formData.append('diagnosis', this.editedItem.diagnosis);
        formData.append('medicalNotes', this.editedItem.medicalNotes);
        formData.append('date', this.editedItem.date ? this.editedItem.date : new Date().toISOString());

        // Agregar treatments solo si tiene datos
        if (this.editedItem.treatments && this.editedItem.treatments.length > 0) {
          formData.append('treatments', JSON.stringify(this.editedItem.treatments));
        }

        // Agregar archivos al FormData
        if (this.editedItem.files && this.editedItem.files.length > 0) {
          this.editedItem.files.forEach((file, index) => {
            // Solo agregar el archivo si tiene un archivo adjunto
            if (file.file) {
              formData.append(`files[${index}][id]`, file.id);
              formData.append(`files[${index}][name]`, file.name);
              formData.append(`files[${index}][file]`, file.file); // El archivo en sí
            }
          });
        }

        console.log('formData');
        console.log(formData);

        try {
          const result = await handleRequest({
            endpoint: 'consultation-medical',
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
        const fieldsToUpdate = ['id', 'reason', 'date', 'diagnosis', 'medicalNotes', 'treatments', 'files'];
        let updatedFields = Object.keys(this.editedItem)
          .filter((key) => fieldsToUpdate.includes(key) && (
            key !== 'treatments' && key !== 'files' // Si no es un array, comparar directamente
              ? this.editedItem[key] !== this.originalItem[key]
              : this.areArraysDifferent(this.originalItem[key], this.editedItem[key]) // Comparar arrays
          ))
          .reduce((obj, key) => {
            obj[key] = this.editedItem[key]; // Agregar el campo al objeto de campos actualizados
            return obj;
          }, {});
        if (Object.keys(updatedFields).length > 0) {
          if (updatedFields.treatments) {
            updatedFields.treatments = JSON.stringify(updatedFields.treatments);
          }
          updatedFields.id = this.editedItem.id;
          this.loading = true;
          const formData = new FormData();
          // Agregar campos actualizados al FormData
          for (let key in updatedFields) {
            if (key === 'files') {
              // Procesar el array de archivos
              // Procesar el array de archivos
              this.editedItem.files.forEach((file, index) => {
                // Asegurarse de que el ID sea un número
                formData.append(`files[${index}][id]`, file.id); // Convertir a número
                formData.append(`files[${index}][name]`, file.name);

                // Solo adjuntar el archivo si está presente
                if (file.file) {
                  formData.append(`files[${index}][file]`, file.file); // El archivo en sí
                } else {
                  // Si el archivo no está presente, enviar un campo vacío o null
                  formData.append(`files[${index}][file]`, ''); // O puedes usar null
                }
              });
            } else {
              formData.append(key, updatedFields[key]);
            }
          }

          console.log('formData');
          console.log(formData);
          try {
            const result = await handleRequest({
              endpoint: 'consultation-medical-update',
              method: 'POST',
              data: formData
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
            this.showAlert("error", "Ocurrió un error inesperado al procesar la solicitud.", 3000);
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
      // Asignar el último ID de los archivos a this.nextFileId
      if (this.editedItem.files && this.editedItem.files.length > 0) {
        this.nextFileId = Math.max(...this.editedItem.files.map((f) => f.id)) + 1;
      } else {
        this.nextFileId = 1; // Si no hay archivos, comenzar desde 1
      }
      this.editedItem.id = item.id;
    },
    // Función para comparar arrays de objetos
    areArraysDifferent(originalArray, editedArray) {
      /*// Ordenar ambos arrays por un campo único (por ejemplo, `id`)
      const sortedOriginal = [...originalArray].sort((a, b) => a.id - b.id);
      const sortedEdited = [...editedArray].sort((a, b) => a.id - b.id);

      // Comparar las cadenas generadas
      return JSON.stringify(sortedOriginal) !== JSON.stringify(sortedEdited);*/
      return !_.isEqual(originalArray, editedArray);
    },
    deleteItem(item) {
      this.editedIndex = 1;
      this.editedItem.id = item.id;
      this.dialogDelete = true;
    },
    closeDelete() {
      this.dialogDelete = false
      this.$nextTick(() => {
        this.editedItem = Object.assign({}, this.defaultItem)
      })
    },
    async deleteItemConfirm() {
      this.loading = true;
      try {
        let request = {
          id: this.editedItem.id
        };
        const result = await handleRequest({
          endpoint: 'consultation-medical-destroy',
          method: 'POST',
          data: request
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
        this.showAlert("error", "Ocurrió un error inesperado al procesar la solicitud.", 3000);
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
    //Subida multiple de Archivos
    onFilesSelected(event) {
      this.imgMiniatura = '';
      this.files = event.target.files;

      // Validar el tamaño de cada archivo (500 KB máximo)
      const maxSize = 500 * 1024; // 500 KB en bytes
      for (const file of this.files) {
        if (file.size > maxSize) {
          this.valid = false;
          this.showAlert('warning', 'El archivo debe ser de máximo 500 KB', 3000);
          this.files = []; // Limpiar los archivos seleccionados
          return; // Detener el proceso si algún archivo es demasiado grande
        }
      }

      // Validar tipos de archivo
      const imageExtensions = ['jpg', 'jpeg', 'png', 'gif'];
      const documentExtensions = ['pdf', 'doc', 'docx', 'txt'];

      for (const file of this.files) {
        const mimeType = file.type;
        const extension = file.name.split('.').pop().toLowerCase();

        if ((mimeType.startsWith('image/') || imageExtensions.includes(extension))) {
          this.showImage = true;
          this.cargarImage(file); // Cargar vista previa de la primera imagen
          break; // Mostrar solo la primera imagen como vista previa
        } else if (documentExtensions.includes(extension)) {
          this.showImage = false;
          this.icono = this.getIconForFile(extension); // Asignar icono según la extensión
        }
      }

      this.valid = true;
      this.editedItem.files = this.files; // Asignar los archivos al objeto `editedItem`
    },
    getIconForFile(extension) {
      const iconMap = {
        'pdf': 'mdi-file-pdf-box',
        'doc': 'mdi-file-word',
        'docx': 'mdi-file-word',
        'txt': 'mdi-file-document-outline'
      };
      return iconMap[extension] || 'mdi-file';
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
/* Estilos para personalizar el scroll */
.v-list {
  scrollbar-width: thin;
  /* Para navegadores que soportan scrollbar-width */
  scrollbar-color: #888 #f1f1f1;
  /* Color del scroll */
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

.selected-tab {
  background-color: #03626C;
  /* Fondo del tab seleccionado */
  color: white;
  /* Texto blanco */
  border-radius: 4px;
  /* Esquinas redondeadas, opcional */
}
</style>