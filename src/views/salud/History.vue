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
          <span class="text-subtitle-1"><strong>Historias Clínicas</strong></span>
        </v-col>
        <v-col cols="12" md="3" class="text-right">
          <v-btn class="text-subtitle-1 ml-12" color="white" variant="tonal" elevation="2"
            prepend-icon="mdi-plus-circle" @click="showAdd">
            Agregar Historia Clínica
          </v-btn>
        </v-col>
      </v-row>
    </v-toolbar>

    <v-card-text>
      <v-text-field class="mt-1 mb-1" v-model="search" append-icon="mdi-magnify" label="Buscar" single-line
        hide-details>
      </v-text-field>
      <v-data-table :headers="headers" :search="search" :items="medicalhistories" class="elevation-1"
        style="max-height: 68vh; overflow-y: auto;" :items-per-page-text="'Elementos por páginas'"
        no-data-text="No hay datos disponibles" :loading="loading" loading-text="Cargando datos..." dense>
        <template v-slot:item.actions="{ item }">
          <v-btn density="comfortable" icon="mdi-pencil" @click="editItem(item)" color="primary" variant="tonal"
            elevation="1" title="Editar Historia Clínica"></v-btn>
          <v-btn density="comfortable" icon="mdi-delete" @click="deleteItem(item)" color="#DA7171" variant="tonal"
            elevation="1" title="Eliminar Historia Clínica"></v-btn>
        </template>
        <!-- Columna de Vacunas -->
        <template v-slot:item.vaccines="{ item }">
          <v-list dense style="max-height: 150px; overflow-y: auto;">
            <v-list-item v-for="(vaccine, index) in item.vaccines" :key="index">
              <v-tooltip location="top">
                <template v-slot:activator="{ props }">
                  <span v-bind="props">{{ vaccine.name }}</span>
                </template>
                <span>
                  <strong>Nombre:</strong> {{ vaccine.name }}<br />
                  <strong>Fecha:</strong> {{ vaccine.date }}<br />
                  <strong>Lote:</strong> {{ vaccine.lot }}
                </span>
              </v-tooltip>
            </v-list-item>
          </v-list>
        </template>

        <!-- Columna de Medicamentos -->
        <template v-slot:item.currentMedications="{ item }">
          <v-list dense style="max-height: 150px; overflow-y: auto;">
            <v-list-item v-for="(medication, index) in item.currentMedications" :key="index">
              <v-tooltip location="top">
                <template v-slot:activator="{ props }">
                  <span v-bind="props">{{ medication.name }}</span>
                </template>
                <span>
                  <strong>Nombre:</strong> {{ medication.name }}<br />
                  <strong>Dosis:</strong> {{ medication.dose }}<br />
                  <strong>Frecuencia:</strong> {{ medication.frequency }}
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
              <v-tab value="vaccine" :class="tab === 'vaccine' ? 'selected-tab' : ''">Vacunas</v-tab>
              <v-tab value="medication" :class="tab === 'medication' ? 'selected-tab' : ''">Medicamentos</v-tab>
            </v-tabs>
            <v-window v-model="tab" min-height="50vh" class="mt-2">
              <v-window-item value="general">

                <v-row>
                  <v-col cols="12" md="12">
                    <v-text-field v-model="editedItem.familyBackground" label="Antecedentes Familiares"
                      prepend-icon="mdi-account-group-outline" variant="underlined" :rules="nameRules"></v-text-field>
                  </v-col>
                  <v-col cols="12" md="12">
                    <v-text-field v-model="editedItem.personalBackground" label="Antecedentes Personales"
                      prepend-icon="mdi-account-outline" variant="underlined" :rules="nameRules"></v-text-field>
                  </v-col>
                  <v-col cols="12" md="12">
                    <v-text-field v-model="editedItem.bloodType" label="Tipo de Sangre" prepend-icon="mdi-blood-bag"
                      variant="underlined" :rules="nameRules"></v-text-field>
                  </v-col>
                </v-row>
              </v-window-item>
              <v-window-item value="vaccine">

                <!-- Tabla de Vacunas -->
                <v-row>
                  <v-col cols="12">
                    <v-card class="mb-4">
                      <v-toolbar color="#03626C">
                        <v-row align="center">
                          <v-col cols="12" md="8" class="grow ml-4">
                            <span class="text-subtitle-1"><strong>Vacunas</strong></span>
                          </v-col>
                          <v-col cols="12" md="3" class="text-right">
                            <v-btn class="text-subtitle-1 mr-2" color="white" variant="tonal" elevation="2"
                              prepend-icon="mdi-plus-circle" @click="addVaccine">
                              Agregar Vacuna
                            </v-btn>
                          </v-col>
                        </v-row>
                      </v-toolbar>
                      <v-data-table :headers="vaccineHeaders" :items="editedItem.vaccines"
                        no-data-text="No hay vacunas registradas" style="max-height: 40vh; overflow-y: auto;" :items-per-page-text="'Elementos por páginas'" dense>
                        <template v-slot:item.actions="{ item }">
                          <v-btn density="comfortable" icon="mdi-pencil" @click="editVaccine(item)" color="primary"
                            variant="tonal"></v-btn>
                          <v-btn density="comfortable" icon="mdi-delete" @click="deleteVaccine(item)" color="error"
                            variant="tonal"></v-btn>
                        </template>
                      </v-data-table>
                    </v-card>
                  </v-col>
                </v-row>
              </v-window-item>
              <v-window-item value="medication">

                <!-- Tabla de Medicamentos -->
                <v-row>
                  <v-col cols="12">
                    <v-card class="mb-4">
                      <v-toolbar color="#03626C">
                        <v-row align="center">
                          <v-col cols="12" md="5" class="grow ml-4">
                            <span class="text-subtitle-1"><strong>Medicamentos Actuales</strong></span>
                          </v-col>
                          <v-col cols="12" md="6" class="text-right">
                            <v-btn class="text-subtitle-1 mr-2" color="white" variant="tonal" elevation="2"
                              prepend-icon="mdi-plus-circle" @click="addMedication">
                              Agregar Medicamento
                            </v-btn>
                          </v-col>
                        </v-row>
                      </v-toolbar>
                      <v-data-table :headers="medicationHeaders" :items="editedItem.currentMedications"
                        no-data-text="No hay medicamentos registrados" style="max-height: 40vh; overflow-y: auto;" :items-per-page-text="'Elementos por páginas'"
                        dense>
                        <template v-slot:item.actions="{ item }">
                          <v-btn density="comfortable" icon="mdi-pencil" @click="editMedication(item)" color="primary"
                            variant="tonal"></v-btn>
                          <v-btn density="comfortable" icon="mdi-delete" @click="deleteMedication(item)" color="error"
                            variant="tonal"></v-btn>
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

  <!-- Diálogo para agregar/editar vacuna -->
  <v-dialog v-model="vaccineDialog" max-width="500px">
    <v-card>
      <v-toolbar color="#03626C">
        <span class="text-subtitle-2 ml-4">{{ vaccineFormTitle }}</span>
      </v-toolbar>
      <v-card-text>
        <v-text-field v-model="editedVaccine.name" label="Nombre de la Vacuna" variant="underlined"
          prepend-icon="mdi-needle"></v-text-field>
        <v-menu v-model="menu" :close-on-content-click="false" :nudge-right="40" transition="scale-transition" offset-y
          min-width="290px">
          <template v-slot:activator="{ props }">
            <v-text-field v-bind="props" :modelValue="dateFormatted" variant="underlined" prepend-icon="mdi-calendar"
              label="Fecha" density="compact"></v-text-field>
          </template>
          <v-locale-provider locale="es">
            <v-date-picker header="Calendario" title="Seleccione la fecha" color="#03626C" :modelValue="input"
              @update:model-value="updateDate" format="yyyy-MM-dd"
              :min="new Date().toISOString().split('T')[0]"></v-date-picker>
          </v-locale-provider>
        </v-menu>
        <v-text-field v-model="editedVaccine.lot" label="Lote" variant="underlined"
          prepend-icon="mdi-barcode"></v-text-field>
      </v-card-text>
      <v-card-actions>
        <v-btn color="#DA7171" variant="flat" @click="closeVaccineDialog">Cancelar</v-btn>
        <v-btn color="#03626C" variant="flat" @click="saveVaccine">Guardar</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>

  <!-- Diálogo para agregar/editar medicamento -->
  <v-dialog v-model="medicationDialog" max-width="500px">
    <v-card>
      <v-toolbar color="#03626C">
        <span class="text-subtitle-2 ml-4">{{ medicationFormTitle }}</span>
      </v-toolbar>
      <v-card-text>
        <v-text-field v-model="editedMedication.name" label="Nombre del Medicamento" variant="underlined"
          prepend-icon="mdi-pill"></v-text-field>
        <v-text-field v-model="editedMedication.dose" label="Dosis" variant="underlined"
          prepend-icon="mdi-numeric"></v-text-field>
        <v-text-field v-model="editedMedication.frequency" label="Frecuencia" variant="underlined"
          prepend-icon="mdi-clock-outline"></v-text-field>
      </v-card-text>
      <v-card-actions>
        <v-btn color="#DA7171" variant="flat" @click="closeMedicationDialog">Cancelar</v-btn>
        <v-btn color="#03626C" variant="flat" @click="saveMedication">Guardar</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
  <v-dialog v-model="dialogDelete" max-width="500px">
    <v-card>
      <v-toolbar color="#DA7171">
        <span class="text-subtitle-2 ml-4"> Eliminar una Historia Clínica</span>
      </v-toolbar>
      <v-card-text class="mt-2 mb-2"> ¿Desea eliminar la Historia Clínica Seleccionada?</v-card-text>
      <v-divider></v-divider>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn color="#DA7171" variant="flat" @click="closeDelete">Cancelar</v-btn>
        <v-btn color="#03626C" variant="flat" :loading="loading" @click="deleteItemConfirm">Aceptar</v-btn>
      </v-card-actions>
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
    dialog: false,
    dialogDelete: false,
    medicalhistories: [],
    data: {},
    page: 1,              // Página actual
    itemsPerPage: 5,     // Elementos por página
    totalItems: 0,        // Total de elementos disponibles
    headers: [
      { title: 'Antecedentes Familiares', value: 'familyBackground' },
      { title: 'Antecedentes Personales', value: 'personalBackground' },
      { title: 'Grupo Sanguíneo', value: 'bloodType' },
      { title: 'Vacunaciones', value: 'vaccines' },
      { title: 'Medicamentos Actuales', value: 'currentMedications' },
      { title: 'Acciones', value: 'actions', sortable: false, width: '10%' },
    ],

    editedItem: {
      id: '',
      familyBackground: '',
      personalBackground: '',
      vaccines: [],
      bloodType: '',
      currentMedications: []
    },
    defaultItem: {
      id: '',
      familyBackground: '',
      personalBackground: '',
      vaccines: [],
      bloodType: '',
      currentMedications: []
    },
    originalItem: {
      id: '',
      familyBackground: '',
      personalBackground: '',
      vaccines: [],
      bloodType: '',
      currentMedications: []
    },
    vaccineHeaders: [
      { title: 'Nombre', value: 'name' },
      { title: 'Fecha', value: 'date' },
      { title: 'Lote', value: 'lot' },
      { title: 'Acciones', value: 'actions', sortable: false },
    ],
    medicationHeaders: [
      { title: 'Nombre', value: 'name' },
      { title: 'Dosis', value: 'dose' },
      { title: 'Frecuencia', value: 'frequency' },
      { title: 'Acciones', value: 'actions', sortable: false },
    ],
    vaccineDialog: false, // Controla el diálogo de vacunas
    medicationDialog: false, // Controla el diálogo de medicamentos
    editedVaccine: { id: null, name: '', date: '', lot: '' }, // Vacuna en edición
    editedMedication: { id: null, name: '', dose: '', frequency: '' }, // Medicamento en edición
    vaccineFormTitle: 'Agregar Vacuna', // Título del diálogo de vacunas
    medicationFormTitle: 'Agregar Medicamento', // Título del diálogo de medicamentos
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
      return this.editedIndex === -1 ? 'Agregar Historia Clínica' : 'Editar Historia Clínica';
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
    // Método para manejar la paginación
    updatePage(page) {
      this.page = page;
      this.initialize();  // Recarga los almacenes con la nueva página
    },

    updateDate(val) {
      this.input = val;
      this.editedVaccine.date = this.dateFormatted;
      this.menu = false;
    },
    // Método para manejar el cambio de elementos por página
    updateItemsPerPage(itemsPerPage) {
      this.itemsPerPage = itemsPerPage;
      this.initialize();  // Recarga los almacenes con el nuevo número de elementos por página
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
    addVaccine() {
      this.editedVaccine = { id: null, name: '', date: '', lot: '' };
      this.vaccineFormTitle = 'Agregar Vacuna';
      this.vaccineDialog = true;
    },
    editVaccine(vaccine) {
      this.editedVaccine = { ...vaccine };
      this.vaccineFormTitle = 'Editar Vacuna';
      this.vaccineDialog = true;
    },
    deleteVaccine(vaccine) {
      this.editedItem.vaccines = this.editedItem.vaccines.filter(v => v.id !== vaccine.id);
    },
    saveVaccine() {
      if (this.editedVaccine.id === null) {
        this.editedVaccine.id = this.editedItem.vaccines.length + 1;
        this.editedVaccine.date = this.editedVaccine.date ? this.editedVaccine.date : new Date().toISOString().split('T')[0];
        this.editedItem.vaccines.push(this.editedVaccine);
      } else {
        const index = this.editedItem.vaccines.findIndex(v => v.id === this.editedVaccine.id);
        this.editedItem.vaccines.splice(index, 1, this.editedVaccine);
      }
      this.closeVaccineDialog();
    },
    closeVaccineDialog() {
      this.vaccineDialog = false;
    },

    // Métodos para medicamentos
    addMedication() {
      this.editedMedication = { id: null, name: '', dose: '', frequency: '' };
      this.medicationFormTitle = 'Agregar Medicamento';
      this.medicationDialog = true;
    },
    editMedication(medication) {
      this.editedMedication = { ...medication };
      this.medicationFormTitle = 'Editar Medicamento';
      this.medicationDialog = true;
    },
    deleteMedication(medication) {
      this.editedItem.currentMedications = this.editedItem.currentMedications.filter(m => m.id !== medication.id);
    },
    saveMedication() {
      if (this.editedMedication.id === null) {
        this.editedMedication.id = this.editedItem.currentMedications.length + 1;
        this.editedItem.currentMedications.push(this.editedMedication);
      } else {
        const index = this.editedItem.currentMedications.findIndex(m => m.id === this.editedMedication.id);
        this.editedItem.currentMedications.splice(index, 1, this.editedMedication);
      }
      this.closeMedicationDialog();
    },
    closeMedicationDialog() {
      this.medicationDialog = false;
    },
    async initialize() {
      this.data = {};
      try {
        this.loading = true;
        const result = await handleRequest({
          endpoint: 'get-medical-histories',
          method: 'POST'
        });

        if (result.success) {
          // Si la solicitud es exitosa, asignamos las sucursales
          this.medicalhistories = result.data?.medicalHistories || [];
        } else {
          // Si no hay datos, asignamos un array vacío
          this.medicalhistories = [];
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
        this.data.familyBackground = this.editedItem.familyBackground;
        this.data.personalBackground = this.editedItem.personalBackground;
        this.data.bloodType = this.editedItem.bloodType;
        this.data.vaccines = this.editedItem.vaccines;
        this.data.currentMedications = this.editedItem.currentMedications;
        try {
          const result = await handleRequest({
            endpoint: 'history-medical',
            method: 'POST',
            data: this.data
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
        } finally {
          this.loading = false;
        }
      } else {
        const fieldsToUpdate = ['id', 'familyBackground', 'personalBackground', 'bloodType', 'vaccines', 'currentMedications'];
        let updatedFields = Object.keys(this.editedItem)
          .filter((key) => fieldsToUpdate.includes(key) && (
            key !== 'vaccines' && key !== 'currentMedications' // Si no es un array, comparar directamente
              ? this.editedItem[key] !== this.originalItem[key]
              : this.areArraysDifferent(this.originalItem[key], this.editedItem[key]) // Comparar arrays
          ))
          .reduce((obj, key) => {
            obj[key] = this.editedItem[key]; // Agregar el campo al objeto de campos actualizados
            return obj;
          }, {});
        if (Object.keys(updatedFields).length > 0) {
          updatedFields.id = this.editedItem.id;
          this.loading = true;
          try {
            const result = await handleRequest({
              endpoint: 'history-medical',
              method: 'PUT',
              data: updatedFields
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
          endpoint: 'history-medical-destroy',
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

.selected-tab {
  background-color: #03626C;
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
</style>