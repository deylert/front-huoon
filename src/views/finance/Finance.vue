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
  <!--<v-container style="min-width: 100%; min-height: 100%;">-->
    <v-card elevation="6" class="mx-2">
      <v-toolbar color="#03626C">
        <v-row align="center">
          <v-col cols="12" md="8" class="grow ml-4">
            <span class="text-subtitle-1"><strong>Finanzas</strong></span>
          </v-col>
          <v-col cols="12" md="3" class="text-right">
            <v-btn class="text-subtitle-1 ml-12" color="white" variant="tonal" elevation="2"
              prepend-icon="mdi-plus-circle" @click="showAdd">
              Agregar Finanza
            </v-btn>
          </v-col>
        </v-row>
      </v-toolbar>

      <v-card-text>
        <v-tabs v-model="tab" vertical>
          <v-tab value="personal" :class="tab === 'personal' ? 'selected-tab' : ''">Personales</v-tab>
          <v-tab value="hogar" :class="tab === 'hogar' ? 'selected-tab' : ''">Hogar</v-tab>
          <v-tab value="todas" :class="tab === 'todas' ? 'selected-tab' : ''">Todas</v-tab>
        </v-tabs>

        <v-window v-model="tab" min-height="50vh" class="mt-2">
          <v-window-item value="personal">
            <v-text-field class="mt-1 mb-1" v-model="search" append-icon="mdi-magnify" label="Buscar" single-line
              hide-details>
            </v-text-field>
            <v-data-table :headers="headers" :search="search" :items="filteredPersonalFinances" class="elevation-1"
              style="max-height: 68vh; overflow-y: auto;" :items-per-page-text="'Elementos por páginas'"
              no-data-text="No hay datos disponibles" :loading="loading" loading-text="Cargando datos...">
              <template v-slot:item.actions="{ item }">
                <v-btn density="comfortable" icon="mdi-pencil" @click="editItem(item)" color="#1976D2" variant="tonal"
                  elevation="1" title="Editar Finanza"></v-btn>
                <v-btn density="comfortable" icon="mdi-delete" @click="deleteItem(item)" color="#DA7171" variant="tonal"
                  elevation="1" title="Eliminar Finanza"></v-btn>
              </template>
              <template v-slot:item.plate="{ item }">
                <v-avatar class="mr-1" elevation="3" color="grey-lighten-4" size="small">
                  <v-img :src="`${this.$axios.defaults.baseURL}images/${item.image}?t=${Date.now()}`"
                    alt="image"></v-img>
                </v-avatar>
                {{ item.plate }}
              </template>
              <template v-slot:item.income="{ item }">
                <span class="text-success font-weight-bold">{{ item.income }}</span>
              </template>
              <template v-slot:item.spent="{ item }">
                <span class="text-error font-weight-bold">{{ item.spent }}</span>
              </template>
              <template v-slot:item.image="{ item }">
                <v-btn density="comfortable" icon="mdi-eye" color="green"
                  v-if="item.image && item.image !== 'finances/default.jpg'" @click="openModal(item.image)"
                  variant="tonal" elevation="1" class="mr-1 mt-1 mb-1" title="Ver detalles"></v-btn>
              </template>
            </v-data-table>
          </v-window-item>
          <v-window-item value="hogar" class="mt-4">
            <v-text-field class="mt-1 mb-1" v-model="search" append-icon="mdi-magnify" label="Buscar" single-line
          hide-details>
        </v-text-field>
        <v-data-table :headers="headers" :search="search" :items="filteredHomeFinances" class="elevation-1"
          style="max-height: 68vh; overflow-y: auto;" :items-per-page-text="'Elementos por páginas'"
          no-data-text="No hay datos disponibles" :loading="loading" loading-text="Cargando datos...">
          <template v-slot:item.actions="{ item }">
            <v-btn density="comfortable" icon="mdi-pencil" @click="editItem(item)" color="#1976D2" variant="tonal"
              elevation="1" title="Editar Finanza"></v-btn>
            <v-btn density="comfortable" icon="mdi-delete" @click="deleteItem(item)" color="#DA7171" variant="tonal"
              elevation="1" title="Eliminar Finanza"></v-btn>
          </template>
          <template v-slot:item.plate="{ item }">
            <v-avatar class="mr-1" elevation="3" color="grey-lighten-4" size="small">
              <v-img :src="`${this.$axios.defaults.baseURL}images/${item.image}?t=${Date.now()}`" alt="image"></v-img>
            </v-avatar>
            {{ item.plate }}
          </template>
          <template v-slot:item.income="{ item }">
            <span class="text-success font-weight-bold">{{ item.income }}</span>
          </template>
          <template v-slot:item.spent="{ item }">
            <span class="text-error font-weight-bold">{{ item.spent }}</span>
          </template>
          <template v-slot:item.image="{ item }">
            <v-btn density="comfortable" icon="mdi-eye" color="green"
              v-if="item.image && item.image !== 'finances/default.jpg'" @click="openModal(item.image)" variant="tonal"
              elevation="1" class="mr-1 mt-1 mb-1" title="Ver detalles"></v-btn>
          </template>
        </v-data-table>
          </v-window-item>
          <v-window-item value="todas">
            <v-text-field class="mt-1 mb-1" v-model="search" append-icon="mdi-magnify" label="Buscar" single-line
          hide-details>
        </v-text-field>
        <v-data-table :headers="headers" :search="search" :items="finances" class="elevation-1"
          style="max-height: 68vh; overflow-y: auto;" :items-per-page-text="'Elementos por páginas'"
          no-data-text="No hay datos disponibles" :loading="loading" loading-text="Cargando datos...">
          <template v-slot:item.actions="{ item }">
            <v-btn density="comfortable" icon="mdi-pencil" @click="editItem(item)" color="#1976D2" variant="tonal"
              elevation="1" title="Editar Finanza"></v-btn>
            <v-btn density="comfortable" icon="mdi-delete" @click="deleteItem(item)" color="#DA7171" variant="tonal"
              elevation="1" title="Eliminar Finanza"></v-btn>
          </template>
          <template v-slot:item.plate="{ item }">
            <v-avatar class="mr-1" elevation="3" color="grey-lighten-4" size="small">
              <v-img :src="`${this.$axios.defaults.baseURL}images/${item.image}?t=${Date.now()}`" alt="image"></v-img>
            </v-avatar>
            {{ item.plate }}
          </template>
          <template v-slot:item.income="{ item }">
            <span class="text-success font-weight-bold">{{ item.income }}</span>
          </template>
          <template v-slot:item.spent="{ item }">
            <span class="text-error font-weight-bold">{{ item.spent }}</span>
          </template>
          <template v-slot:item.image="{ item }">
            <v-btn density="comfortable" icon="mdi-eye" color="green"
              v-if="item.image && item.image !== 'finances/default.jpg'" @click="openModal(item.image)" variant="tonal"
              elevation="1" class="mr-1 mt-1 mb-1" title="Ver detalles"></v-btn>
          </template>
        </v-data-table>
          </v-window-item>
        </v-window>
      </v-card-text>
    </v-card>
  <!--</v-container>-->
  <v-dialog v-model="dialog" max-width="600px">
    <v-form ref="form" v-model="valid" enctype="multipart/form-data">
      <v-card>
        <v-toolbar color="#03626C">
          <span class="text-subtitle-2 ml-4">{{ formTitle }}</span>
        </v-toolbar>
        <v-card-text>
          <v-container>
            <v-row>
              <v-col cols="12" md="6">
                <v-select v-model="finance" :items="typeOptions" item-value="value" item-title="text" label="Finanza"
                  prepend-icon="mdi-check-circle" variant="underlined" @update:model-value="clearFields"
                  density="compact"></v-select>
              </v-col>

              <!-- Campo para Ingreso -->
              <v-col cols="12" md="6" v-if="showType">
                <v-text-field v-model="editedItem.income" clearable label="Ingreso" prepend-icon="mdi-currency-usd"
                  variant="underlined" :rules="priceRules" type="number" density="compact"></v-text-field>
              </v-col>

              <!-- Campo para Gasto -->
              <v-col cols="12" md="6" v-if="!showType">
                <v-text-field v-model="editedItem.spent" clearable label="Gasto" prepend-icon="mdi-currency-usd"
                  variant="underlined" :rules="priceRules" type="number" density="compact"></v-text-field>
              </v-col>
              <v-col cols="12" md="6">
                <v-menu v-model="menu" :close-on-content-click="false" :nudge-right="40" transition="scale-transition"
                  offset-y min-width="290px">
                  <template v-slot:activator="{ props }">
                    <v-text-field v-bind="props" :modelValue="dateFormatted" variant="underlined"
                      prepend-icon="mdi-calendar" label="Fecha" density="compact"></v-text-field>
                  </template>
                  <v-locale-provider locale="es">
                    <v-date-picker header="Calendario" title="Seleccione la fecha" color="#03626C" :modelValue="input"
                      @update:model-value="updateDate" format="yyyy-MM-dd"
                      :min="new Date().toISOString().split('T')[0]"></v-date-picker>
                  </v-locale-provider>
                </v-menu>
              </v-col>
              <v-col cols="12" md="6">
                <v-select v-model="editedItem.type" :items="Options" item-value="value" item-title="text" label="Tipo"
                  prepend-icon="mdi-check-circle" variant="underlined" density="compact"></v-select>
              </v-col>
              <v-col cols="12" md="12">
                <v-textarea v-model="editedItem.description" clearable label="Descripción" prepend-icon="mdi-note"
                  variant="underlined"></v-textarea>
              </v-col>
            </v-row>
            <v-row>
              <v-col cols="12" md="6">
                <v-file-input clearable v-model="file" ref="fileInput" label="Imagen de la Dispositivo"
                  variant="underlined" density="compact" name="file" accept=".png, .jpg, .jpeg"
                  @change="onFileSelected">
                </v-file-input>
              </v-col>
              <v-col cols="12" md="6">
                <v-card elevation="6" class="mx-auto" max-width="210" max-height="120">
                  <img v-if="imagenDisponible()" :src="imgedit" height="120" width="210">
                </v-card>


              </v-col>
            </v-row>
          </v-container>
        </v-card-text>
        <v-divider></v-divider>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="#DA7171" variant="flat" @click="close">Cancelar</v-btn>
          <v-btn color="#03626C" variant="flat" @click="save" :disabled="!valid" :loading="loading">Aceptar</v-btn>
        </v-card-actions>
      </v-card>
    </v-form>
  </v-dialog>
  <v-dialog v-model="dialogDelete" max-width="500px">
    <v-card>

      <v-toolbar color="#DA7171">
        <span class="text-subtitle-2 ml-4"> Eliminar Finanza</span>
      </v-toolbar>

      <v-card-text class="mt-2 mb-2"> ¿Desea eliminar la finanza?</v-card-text>
      <v-divider></v-divider>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn color="#DA7171" variant="flat" @click="closeDelete">
          Cancelar
        </v-btn>
        <v-btn color="#1976D2" variant="flat" @click="deleteItemConfirm">
          Aceptar
        </v-btn>

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
import LocalStorageService from "@/LocalStorageService";
import { handleRequest } from "@/utils/api"; // Ruta al archivo
export default {
  data: () => ({
    snackbar: false,
    sb_type: '',
    sb_message: '',
    sb_timeout: 2000,
    sb_title: '',
    sb_icon: '',
    valid: true,
    person_id: '',
    tab: null,
    loading: false,
    mostrar: false,
    file: null,
    imgMiniatura: '',
    dialog: false,
    dialogDelete: false,
    finances: [],
    filteredPersonalFinances: [],
    filteredHomeFinances: [],
    data: {},
    home_id: '',
    finance: 'Ingreso',
    showType: true,
    dialogPhoto: false,
    loadingImage: false,
    selectedImageUrl: '',
    headers: [
      //{ title: 'Sucursal', value: 'branchName', width: '20%' },
      { title: 'Ingreso', value: 'income', width: '10%' },
      { title: 'Gasto', value: 'spent', width: '10%' },
      { title: 'Fecha', value: 'date', width: '10%' },
      { title: 'Tipo', value: 'type', width: '10%' },
      { title: 'Método', value: 'method', width: '10%' },
      { title: 'Descripción', value: 'description', width: '30%' },
      { title: 'Detalle', value: 'image', width: '5%' },
      { title: 'Acciones', value: 'actions', sortable: false, width: '15%' },
    ],
    typeOptions: [
      { text: 'Ingreso', value: 'Ingreso' },
      { text: 'Gasto', value: 'Gasto' },
    ],
    Options: [
      { text: 'Personal', value: 'Personal' },
      { text: 'Hogar', value: 'Hogar' },
    ],
    editedItem: {
      id: '',
      home_id: '',
      spent: '',
      income: '',
      image: '',
      date: '',
      description: '',
      type: '',
      method: '',
    },
    originalItem: {
      id: '',
      home_id: '',
      spent: '',
      income: '',
      image: '',
      date: '',
      description: '',
      type: '',
      method: '',
    },
    defaultItem: {
      id: '',
      home_id: '',
      spent: '',
      income: '',
      image: '',
      date: '',
      description: '',
      type: '',
      method: '',
    },
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
    priceRules: [
      (v) => !!v || "El precio es obligatorio", // El campo es obligatorio
      (v) =>
        /^[0-9]+(\.[0-9]{1,2})?$/.test(v) ||
        "El precio debe ser un número válido con hasta 2 decimales", // Valida el formato del precio
      (v) => v > 0 || "El precio debe ser un número positivo", // El precio debe ser positivo
    ],
  }),
  computed: {
    formTitle() {
      return this.editedIndex === -1 ? 'Agregar Finanza' : 'Editar Finanza';
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
    this.person_id = JSON.parse(LocalStorageService.getItem('person_id'));
    this.home_id = JSON.parse(LocalStorageService.getItem('home_id'));
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
    formatNumber(value) {
      // Si el valor es menor que 1000, devuelve el valor original con dos decimales
      if (value < 1000) {
        return (Math.round((value + Number.EPSILON) * 100) / 100).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
      }

      // Primero, redondea el valor a dos decimales
      value = Math.round((value + Number.EPSILON) * 100) / 100;

      // Convierte el valor a cadena con formato de número local (en-US)
      let formattedValue = value.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });

      return formattedValue;
    },
    clearFields() {
      // Limpiar los valores de ingreso y gasto al cambiar el tipo
      this.editedItem.income = '';
      this.editedItem.spent = '';
      this.showType = !this.showType;
    },
    updateDate(val) {
      this.input = val;
      this.editedItem.date = this.dateFormatted;
      this.menu = false;
    },
    async showAdd() {
      this.dialog = true;
      this.editedItem.home_id = this.home_id;
    },
    close() {
      this.dialog = false;
      this.$nextTick(() => {
        this.editedItem = Object.assign({}, this.defaultItem);
        this.originalItem = Object.assign({}, this.defaultItem);
      });
      this.editedIndex = -1
      this.file = null;
      this.imgMiniatura = '';
    },
    async initialize() {
      try {
        this.data = {};
        this.data.home_id = this.home_id;
        this.data.type = 'Todas';
        this.loading = true;
        const result = await handleRequest({
          endpoint: 'get-type-finance',
          method: 'POST',
          data: this.data
        });

        if (result.success) {
          // Si la solicitud es exitosa, asignamos las sucursales
          this.finances = result.data?.finances || [];
          // Filtro 1: donde person_id sea igual a this.person_id y type sea igual a 'Personal'
          this.filteredPersonalFinances = this.finances.filter(finance =>
            finance.idType === 'Personal')

          // Filtro 2: donde home_id sea igual a this.home_id
          this.filteredHomeFinances = this.finances.filter(finance =>
            finance.idType === 'Hogar');
        } else {
          // Si no hay datos, asignamos un array vacío
          this.finances = [];
          this.showAlert('info', 'No hay finanzas disponibles.', 3000);
        }
      } catch (error) {
        this.loading = false;
        // Captura de errores no controlados
        this.showAlert('error', 'Ocurrió un error inesperado al cargar las finanzas.', 3000);
      } finally {
        this.loading = false;
      }
    },
    async save() {
      this.loading = true;
      if (this.editedIndex === -1) {
        this.valid = false;
        const fieldsToUpdate = ['home_id', 'spent', 'income', 'image', 'date', 'description', 'image', 'type', 'method'];

        let updatedFields = Object.keys(this.editedItem)
          .filter((key) => fieldsToUpdate.includes(key) && this.editedItem[key] !== this.originalItem[key])
          .reduce((obj, key) => {
            obj[key] = this.editedItem[key];
            return obj;
          }, {});
        if (Object.keys(updatedFields).length > 0) {
          updatedFields.date = this.editedItem.date ? this.editedItem.date : new Date();
          updatedFields.home_id = this.editedItem.home_id;
          if (this.file) {
            updatedFields.image = this.editedItem.image;
          }
          const formData = new FormData();
          for (let key in updatedFields) {
            formData.append(key, updatedFields[key]);
          }

          try {
            const result = await handleRequest({
              endpoint: 'finance',
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
          this.showAlert("success", "Debe completar los datos de producto.", 3000);
        }
      } else {
        this.valid = false;
        const fieldsToUpdate = ['home_id', 'spent', 'income', 'image', 'date', 'description', 'image', 'type', 'method'];
        let updatedFields = Object.keys(this.editedItem)
          .filter((key) => fieldsToUpdate.includes(key) && this.editedItem[key] !== this.originalItem[key])
          .reduce((obj, key) => {
            obj[key] = this.editedItem[key];
            return obj;
          }, {});
        if (Object.keys(updatedFields).length > 0) {
          updatedFields.id = this.editedItem.id;
          if (this.file) {
            updatedFields.image = this.editedItem.image;
          }
          const formData = new FormData();
          for (let key in updatedFields) {
            formData.append(key, updatedFields[key]);
          }
          try {
            const result = await handleRequest({
              endpoint: 'finance-update',
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
      this.editedIndex = 1;
      this.originalItem = Object.assign({}, item);
      this.editedItem = Object.assign({}, item);
      if (this.editedItem.finance === 'Ingreso') {
        this.finance = 'Ingreso';
        this.showType = true;
      }
      else {
        this.finance = 'Gasto';
        this.showType = false;
      }
      this.file = null;
      // Crear la imagen y configurar el src
      const img = new Image();
      img.src = `${this.$axios.defaults.baseURL}images/${item.image}`; // Se asume que item.image_url es la URL de la imagen

      // Usar una función asíncrona para manejar la carga de la imagen
      img.onload = async () => {
        try {
          // Asignar la imagen cargada a imgMiniatura
          this.imgMiniatura = `${this.$axios.defaults.baseURL}images/${item.image}`;
        } catch (error) {
          console.error('Error al cargar la imagen', error);
          this.showAlert('error', 'Error al cargar la imagen.', 3000);
        }
      };
      this.dialog = true;
      console.log('this.type');
      console.log(this.type);
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
      try {
        let request = {
          id: this.editedItem.id
        };
        const result = await handleRequest({
          endpoint: 'finance-destroy',
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
      if (this.imgedit !== undefined && this.imgedit !== '') {
        // Intenta cargar la imagen en un elemento oculto para verificar si está disponible
        let img = new Image();
        img.src = this.imgedit;
        return true; // Devuelve true si la imagen está disponible
      }
      return false; // Si la URL de la imagen no está definida o está vacía, devuelve false
    },
    onFileSelected(event) {
      let file = event.target.files[0];
      // Validar el tamaño del archivo (500 KB máximo)
      const maxSize = 500 * 1024; // 500 KB en bytes
      if (file && file.size > maxSize) {
        this.valid = false;
        this.showAlert('warning', 'El archivo de imagen debe ser de máximo 500 KB', 3000);
        return; // Detener el proceso si el archivo es demasiado grande
      }
      this.valid = true;
      this.editedItem.image = file;
      //console.log(this.editedItem.image_cardgift);
      this.cargarImage(file);
    },
    cargarImage(file) {
      let reader = new FileReader();
      reader.onload = (e) => {
        this.imgMiniatura = e.target.result;
      }
      reader.readAsDataURL(file);
    },
  },
};
</script>

<style scoped>
.selected-tab {
  background-color: #03626C;
  /* Fondo del tab seleccionado */
  color: white;
  /* Texto blanco */
  border-radius: 4px;
  /* Esquinas redondeadas, opcional */
}
</style>