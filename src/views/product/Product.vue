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
  <!--<v-container class="mx-5" justify="center" fluid>-->
    <v-toolbar color="#03626C">
      <v-row align="left">
        <v-col cols="12" md="8" class="grow ml-4">
          <span class="text-subtitle-1"><strong>Listado de Productos por Almacenes</strong></span>
        </v-col>
      </v-row>
    </v-toolbar>
    <v-container justify="center" fluid>
      <!-- Menú de almacenes -->
      <v-row>
        <v-col cols="12">
          <v-toolbar flat class="pa-0" style="overflow-x: auto; white-space: nowrap;">
            <v-btn-group>
              <v-btn v-for="store in stores" :key="store.warehouse_id"
                :color="store.warehouse_id === this.editedItem.warehouse_id ? '#03626C' : 'default'"
                @click="selectStore(store.warehouse_id)" :disabled="loading">
                <v-progress-circular v-if="loading && store.warehouse_id === this.editedItem.warehouse_id" indeterminate
                  color="white" size="24" class="mr-2"></v-progress-circular>
                {{ store.title }}
              </v-btn>
            </v-btn-group>
          </v-toolbar>
        </v-col>
      </v-row>

      <!-- Botón para agregar productos -->
      <v-row>
        <v-col cols="12" class="text-right">
          <v-btn class="text-subtitle-1" color="#DA7171" variant="flat" elevation="2" prepend-icon="mdi-plus-circle"
            @click="showAddProduct" :loading="loadingProduct">
            Agregar Producto
          </v-btn>
        </v-col>
      </v-row>
      <!-- Productos del almacén seleccionado -->
      <v-row v-if="selectedStore">
        <v-col v-for="product in paginatedProducts" :key="product.id" cols="12" md="3">
          <v-card class="mx-auto my-4" max-width="35vh">
            <!-- Imagen o Ícono en la parte superior -->
            <v-img height="25vh" :src="`${this.$axios.defaults.baseURL}images/${product.image}`" cover></v-img>
            <v-card-title>
              <v-tooltip bottom location="top" class="custom-tooltip">
                <template v-slot:activator="{ props }">
                  <span v-bind="props">
                    {{ product.productName }}
                  </span>
                </template>
                {{ product.productName }}
              </v-tooltip>
            </v-card-title>
            <v-card-subtitle>
              <v-tooltip bottom location="top">
                <template v-slot:activator="{ props }">
                  <span v-bind="props">
                    Descripción: {{ product.additionalNotes }}
                  </span>
                </template>
                {{ product.additionalNotes }}
              </v-tooltip>
            </v-card-subtitle>
            <v-card-text>
              Cantidad: {{ product.quantity }}
            </v-card-text>
            <v-card-actions justify="end" class="w-100">
              <v-btn color="#DA7171" @click="deleteItem(product)">Eliminar</v-btn>
              <v-btn color="#03626C" @click="editItem(product)" :loading="loadingProductEdit">Editar</v-btn>
            </v-card-actions>
          </v-card>
        </v-col>

        <!-- Paginación -->
        <v-col cols="12" class="text-center">
          <v-pagination v-model="currentPage" :length="pageCount" :total-visible="5"></v-pagination>
        </v-col>
      </v-row>
    <!--</v-container>-->

    <!-- Crear/Editar Producto -->
    <v-dialog v-model="dialog" max-width="800px">
      <v-form ref="form" v-model="valid">
        <v-card>
          <v-toolbar color="#03626C">
            <span class="text-subtitle-2 ml-4">{{ formTitle }}</span>
          </v-toolbar>

          <v-card-text>
            <!-- Pestañas -->
            <v-tabs v-model="tab" vertical>
              <!-- Pestañas -->
              <v-tab value="general" :class="tab === 'general' ? 'selected-tab' : ''">Generales</v-tab>
              <v-tab value="purchase" :class="tab === 'purchase' ? 'selected-tab' : ''">Compra</v-tab>
            </v-tabs>
            <!-- Contenido de las pestañas -->
            <v-window v-model="tab" min-height="50vh">
              <!-- Pestaña de Generales -->
              <v-window-item value="general">
                <v-row>
                  <v-col cols="12" md="6">
                    <v-text-field v-model="editedItem.name" clearable label="Nombre" prepend-icon="mdi-tag-outline"
                      variant="underlined" :rules="nameRules"></v-text-field>
                  </v-col>
                  <v-col cols="12" md="6">
                    <v-text-field v-model="editedItem.brand" clearable label="Marca" prepend-icon="mdi-tag-outline"
                      variant="underlined"></v-text-field>
                  </v-col>
                  <v-col cols="12" md="6">
                    <v-file-input clearable v-model="file" ref="fileInput" label="Imagen del Producto"
                      variant="underlined" density="compact" name="file" accept=".png, .jpg, .jpeg"
                      @change="onFileSelected">
                    </v-file-input>
                  </v-col>
                  <v-col cols="12" md="6">
                    <v-card elevation="6" class="mx-auto" max-width="210" max-height="120">
                      <img v-if="imagenDisponible()" :src="imgedit" height="120" width="210">
                    </v-card>


                  </v-col>
                  <v-col cols="12" md="12">
                    <v-textarea v-model="editedItem.additional_notes" clearable label="Notas Adicionales"
                      prepend-icon="mdi-note" variant="underlined"></v-textarea>
                  </v-col>
                </v-row>
              </v-window-item>

              <!-- Pestaña de Compra -->
              <v-window-item value="purchase">
                <v-row>
                  <v-col cols="12" md="4">
                    <v-text-field v-model="editedItem.unit_price" clearable label="Precio Unitario"
                      prepend-icon="mdi-currency-usd" variant="underlined" type="number" :rules="price"></v-text-field>
                  </v-col>
                  <v-col cols="12" md="4">
                    <v-text-field v-model="editedItem.quantity" clearable label="Cantidad" prepend-icon="mdi-numeric"
                      variant="underlined" type="number" :rules="price"></v-text-field>
                  </v-col>
                  <v-col cols="12" md="4">
                    <v-text-field v-model="editedItem.total_price" clearable label="Precio Total"
                      prepend-icon="mdi-currency-usd" variant="underlined" type="number" disabled="true"
                      :value="calculatedTotalPrice"></v-text-field>
                  </v-col>
                </v-row>
                <v-row>
                  <v-col cols="12" md="6">
                    <v-autocomplete :no-data-text="'No hay datos disponibles'" v-model="editedItem.status_id"
                      :items="status" label="Estados" prepend-icon="mdi-lock-outline" item-title="nameStatus"
                      item-value="id" variant="underlined" density="compact" :rules="selectRules">
                      <template v-slot:item="{ props, item }">
                      <v-list-item v-bind="props">
                        <template v-slot:prepend>
                          <v-avatar size="24">
                            <v-icon>{{ item.raw.iconStatus }}</v-icon>
                          </v-avatar>
                        </template>
                      </v-list-item>
                    </template>
                    </v-autocomplete>
                  </v-col>
                  <v-col cols="12" md="6">
                    <v-autocomplete :no-data-text="'No hay datos disponibles'" v-model="editedItem.category_id"
                      :items="categories" label="Categorías" prepend-icon="mdi-tag-outline" item-title="nameCategory"
                      item-value="id" variant="underlined" density="compact" :rules="selectRules">
                      <template v-slot:item="{ props, item }">
                        <v-list-item v-bind="props">
                          <template v-slot:prepend>
                            <v-avatar size="24">
                              <!-- Verifica si es URL o ícono -->
                              <template v-if="isImage(item.raw.iconCategory)">
                                <img
                                  :src="`${this.$axios.defaults.baseURL}images/${item.raw.iconCategory}?t=${Date.now()}`"
                                  alt="icon" />
                              </template>
                              <template v-else>
                                <v-icon>{{ getIconName(item.raw.iconCategory) }}</v-icon>
                              </template>
                            </v-avatar>
                          </template>
                        </v-list-item>
                      </template>
                    </v-autocomplete>
                  </v-col>
                  <v-col cols="12" md="6">
                    <v-menu v-model="menu" :close-on-content-click="false" :nudge-right="40"
                      transition="scale-transition" offset-y min-width="290px">
                      <template v-slot:activator="{ props }">
                        <v-text-field v-bind="props" :modelValue="dateFormatted" variant="underlined"
                          prepend-icon="mdi-calendar" label="Fecha de Compra"></v-text-field>
                      </template>
                      <v-locale-provider locale="es">
                        <v-date-picker header="Calendario" title="Seleccione la fecha" color="#03626C"
                          :modelValue="input" @update:model-value="updateDate" format="yyyy-MM-dd"
                          :max="dateFormatted2"></v-date-picker>
                      </v-locale-provider>
                    </v-menu>
                  </v-col>
                  <!-- Segunda columna -->
                  <v-col cols="12" sm="6" md="6">
                    <v-menu v-model="menu2" :close-on-content-click="false" :nudge-right="40"
                      transition="scale-transition" offset-y min-width="290px">
                      <template v-slot:activator="{ props }">
                        <v-text-field v-bind="props" :modelValue="dateFormatted2" variant="underlined"
                          prepend-icon="mdi-calendar" label="Fecha de Expiración"></v-text-field>
                      </template>
                      <v-locale-provider locale="es">
                        <v-date-picker header="Calendario" title="Seleccione la fecha" color="#03626C"
                          :modelValue="input2" format="yyyy-MM-dd" :min="dateFormatted"
                          @update:model-value="updateDate1"></v-date-picker><!--@update:model-value="updateDate2"-->
                      </v-locale-provider>
                    </v-menu>
                  </v-col>
                </v-row>
                <v-row>
                  <v-col cols="12" md="6">
                    <v-text-field v-model="editedItem.frequency" clearable label="Frecuencia (hrs)"
                      prepend-icon="mdi-timer-outline" variant="underlined" type="number"></v-text-field>
                  </v-col>
                  <!-- Campo Tipo -->
                  <v-col cols="12" md="6">
                    <v-select v-model="editedItem.type" :items="['Invierno', 'Verano']" clearable label="Tipo"
                      prepend-icon="mdi-weather-partly-snowy" variant="underlined">
                    </v-select>
                  </v-col>
                </v-row>
                <v-row>
                  <v-col cols="12" md="12">
                    <v-text-field v-model="editedItem.purchase_place" clearable label="Lugar de Compra"
                      prepend-icon="mdi-store-outline" variant="underlined"></v-text-field>
                  </v-col>
                </v-row>
              </v-window-item>
            </v-window>
          </v-card-text>

          <v-divider></v-divider>

          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="#DA7171" variant="flat" @click="close">Cancelar</v-btn>
            <v-btn color="#03626C" variant="flat" :loading="loading" @click="save" :disabled="!valid">Aceptar</v-btn>
          </v-card-actions>
        </v-card>
      </v-form>
    </v-dialog>

    <v-dialog v-model="dialogDelete" max-width="500px">
      <v-card>
        <v-toolbar color="#DA7171">
          <span class="text-subtitle-2 ml-4"> Eliminar el producto</span>
        </v-toolbar>
        <v-card-text class="mt-2 mb-2"> ¿Desea eliminar el producto?</v-card-text>
        <v-divider></v-divider>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="#DA7171" variant="flat" @click="closeDelete">Cancelar</v-btn>
          <v-btn color="#03626C" variant="flat" :loading="loading" @click="deleteItemConfirm">Aceptar</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-container>
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
    loading: false,
    loadingProduct: false,
    loadingProductEdit: false,
    file: null,
    imgMiniatura: '',
    // Datos de prueba: almacenes y productos
    stores: [],
    products: [],
    categories: [],
    status: [],
    warehouse_id: '',
    home_id: '',
    // Paginación
    currentPage: 1,
    itemsPerPage: 6,
    dialog: false,
    dialogDelete: false,
    isEditing: false,
    editedIndex: -1,
    editedItem: {
      id: '',
      // Datos generales
      warehouse_id: '',  // Almacén seleccionado
      home_id: '',
      name: '',            // Nombre del producto
      brand: '',           // Marca del producto

      // Detalles de compra
      unit_price: 0,       // Precio unitario
      total_price: 0,      // Precio total
      quantity: 0,         // Cantidad
      purchase_date: null, // Fecha de compra
      purchase_place: '',  // Lugar de compra
      expiration_date: null, // Fecha de expiración

      // Otros datos
      additional_notes: '', // Notas adicionales
      maintenance_date: null, // Fecha de mantenimiento
      due_date: null,       // Fecha de vencimiento
      frequency: '',        // Frecuencia (Diario, Semanal, Mensual, Anual)
      status_id: null,      // Estado (Activo/Inactivo)
      category_id: null,    // Categoría
      type: '',             // Tipo de producto
      image: null,          // Imagen
      product_id: null
    },

    defaultItem: {
      id: '',
      // Datos generales
      warehouse_id: '',  // Almacén seleccionado
      home_id: '',
      name: '',            // Nombre del producto
      brand: '',           // Marca del producto

      // Detalles de compra
      unit_price: 0,       // Precio unitario
      total_price: 0,      // Precio total
      quantity: 0,         // Cantidad
      purchase_date: null, // Fecha de compra
      purchase_place: '',  // Lugar de compra
      expiration_date: null, // Fecha de expiración

      // Otros datos
      additional_notes: '', // Notas adicionales
      maintenance_date: null, // Fecha de mantenimiento
      due_date: null,       // Fecha de vencimiento
      frequency: '',        // Frecuencia (Diario, Semanal, Mensual, Anual)
      status_id: null,      // Estado (Activo/Inactivo)
      category_id: null,    // Categoría
      type: '',             // Tipo de producto
      image: null,          // Imagen
      product_id: null
    },

    originalItem: {
      id: '',
      // Datos generales
      warehouse_id: '',  // Almacén seleccionado
      home_id: '',
      name: '',            // Nombre del producto
      brand: '',           // Marca del producto

      // Detalles de compra
      unit_price: 0,       // Precio unitario
      total_price: 0,      // Precio total
      quantity: 0,         // Cantidad
      purchase_date: null, // Fecha de compra
      purchase_place: '',  // Lugar de compra
      expiration_date: null, // Fecha de expiración

      // Otros datos
      additional_notes: '', // Notas adicionales
      maintenance_date: null, // Fecha de mantenimiento
      due_date: null,       // Fecha de vencimiento
      frequency: '',        // Frecuencia (Diario, Semanal, Mensual, Anual)
      status_id: null,      // Estado (Activo/Inactivo)
      category_id: null,    // Categoría
      type: '',             // Tipo de producto
      image: null,
      product_id: null        // Imagen
    },

    tab: null,
    menu: false,
    menu2: false,
    input: null,
    input2: null,

    nameRules: [
      (v) => !!v || "El campo es requerido",
      (v) => (v && v.length <= 50) ||
        "El campo debe tener menos de 51 caracteres",
      (v) => (v && v.length >= 3) ||
        "El campo debe tener al menos de 3 caracteres",
    ],
    selectRules: [(v) => !!v || "Seleccionar al menos un elemento"],
    price: [
      (value) => !!value || 'Campo requerido',
      (value) => !value || !isNaN(parseFloat(value)) || 'Debe ser un número'],

  }),
  watch: {
    // Observa los cambios en unit_price y quantity para recalcular total_price
    'editedItem.unit_price': 'calculateTotalPrice',
    'editedItem.quantity': 'calculateTotalPrice',
  },
  computed: {
    // Obtener el almacén seleccionado
    selectedStore() {
      const store = this.stores.find(store => store.warehouse_id === this.editedItem.warehouse_id);
      if (store) {
        this.selectStore(store.warehouse_id);
      }
      return store;
    },
    // Productos paginados
    paginatedProducts() {
      if (!this.products.length) return [];
      const start = (this.currentPage - 1) * this.itemsPerPage;
      const end = start + this.itemsPerPage;
      return this.products.slice(start, end);
    },
    // Cantidad de páginas
    pageCount() {
      return this.products.length
        ? Math.ceil(this.products.length / this.itemsPerPage)
        : 0;
    },
    formTitle() {
      return this.editedIndex === -1 ? 'Agregar Nuevo Producto' : 'Editar Producto';
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
    // Calcula automáticamente el precio total
    calculatedTotalPrice() {
      return (this.editedItem.unit_price * this.editedItem.quantity).toFixed(2);
    },
  },
  mounted() {
    this.home_id = LocalStorageService.getItem('home_id');
    this.initialize();
  },
  methods: {
    updateDate(val) {
      this.input = val;
      this.editedItem.purchase_date = this.dateFormatted;
      this.menu = false;
    },
    updateDate1(val) {
      this.input2 = val;
      this.editedItem.expiration_date = this.dateFormatted2;
      this.menu2 = false;
    },
    isImage(icon) {
      // Validar si el valor es una URL válida (puedes personalizar esta lógica)
      return typeof icon === "string" &&
        (icon.startsWith("http") || /\.(png|jpe?g|gif|svg|webp)$/i.test(icon));
    },
    getIconName(icon) {
      if (!icon) return 'mdi-help-circle'; // Ícono por defecto si no hay valor
      // Si el ícono tiene el prefijo "MdiIcons.", extraer solo el nombre
      if (icon.startsWith('MdiIcons.')) {
        return `mdi-${icon.split('.')[1].toLowerCase()}`;
      }
      // Si el ícono ya está en formato "mdi-*", devolverlo tal cual
      if (icon.startsWith('mdi-')) {
        return icon;
      }
      // En otros casos, devolver un ícono por defecto
      return 'mdi-help-circle';
    },
    // Cambiar almacén seleccionado
    selectStore(warehouse_id) {
      this.editedItem.warehouse_id = warehouse_id;
      this.currentPage = 1; // Reiniciar paginación al cambiar almacén
      this.showPersonProducts();
    },
    async initialize() {
      this.data = {};
      this.data.home_id = this.home_id;
      try {
        this.loading = true;
        const result = await handleRequest({
          endpoint: 'person-warehouse-home',
          method: 'POST',
          data: this.data,
        });

        if (result.success) {
          // Si la solicitud es exitosa, asignamos las sucursales
          this.stores = result.data?.store || [];
          if (this.stores.length > 0) {
            // Seleccionar el primer almacén por defecto
            this.editedItem.warehouse_id = this.stores[0].warehouse_id;
          }
        } else {
          // Si no hay datos, asignamos un array vacío
          this.stores = [];
          this.showAlert('success', result.message || 'No hay almacénes disponibles.', 3000);
        }
      } catch (error) {
        this.loading = false;
        // Captura de errores no controlados
        this.showAlert('error', 'Ocurrió un error inesperado al cargar los almacenes.', 3000);
      } finally {
        this.loading = false;
        this.showPersonProducts();
      }
    },
    async showPersonProducts() {
      this.products = [];
      this.data = {};      
      this.editedItem.home_id = this.home_id;
      this.data.home_id = this.home_id;
      this.data.warehouse_id = this.editedItem.warehouse_id;
      try {
        this.loading = true;
        const result = await handleRequest({
          endpoint: 'person-home-warehouse-products',
          method: 'POST',
          data: this.data,
        });

        if (result.success) {
          // Si la solicitud es exitosa, asignamos las sucursales
          this.products = result.data?.products || [];
        } else {
          // Si no hay datos, asignamos un array vacío
          this.products = [];
          this.showAlert('success', 'No hay productos disponibles.', 3000);
        }
      } catch (error) {
        this.loading = false;
        // Captura de errores no controlados
        this.showAlert('error', 'Ocurrió un error inesperado al cargar los roles.', 3000);
      } finally {
        this.loading = false;

      }
    },
    async showAddProduct() {
      this.loadingProduct = true;
      this.data = {};
      this.editedIndex = -1;
      this.editedItem.home_id = this.home_id;
      this.data.home_id = this.editedItem.home_id;
      try {
        const result = await handleRequest({
          endpoint: 'productcategory-productstatus-apk',
          method: 'GET'
        });

        if (result.success) {
          // Si la solicitud es exitosa, asignamos las sucursales
          this.categories = result.data?.productcategories || [];
          this.status = result.data?.productstatus || [];
        } else {
          // Si no hay datos, asignamos un array vacío
          this.categories = [];
          this.status = [];
          this.showAlert('info', result.message || 'No hay alamacenes disponibles.', 3000);
        }
      } catch (error) {
        this.showAlert('error', 'Ocurrió un error inesperado al cargar los almacenes.', 3000);
        this.loadingProduct = false;
      } finally {
        this.dialog = true;
        this.loadingProduct = false;
      }
    },
    close() {
      this.dialog = false;
      this.loading = false;
      this.loadingProduct = false;
      this.loadingProductEdit = false;
      this.$nextTick(() => {
        this.editedItem = Object.assign({}, this.defaultItem);
        this.originalItem = Object.assign({}, this.defaultItem);
      });
      this.editedIndex = -1;
      this.file = null;
      this.imgMiniatura = '';
    },

    async save() {
      if (this.editedIndex === -1) {
      this.loadingProduct = true;
        this.valid = false;
        const fieldsToUpdate = ['id', 'home_id', 'warehouse_id', 'product_id', 'status_id', 'category_id', 'name', 'unit_price', 'quantity', 'total_price', 'purchase_date', 'purchase_place', 'expiration_date', 'brand', 'additional_notes', 'maintenance_date', 'due_date', 'frequency', 'type'];

        let updatedFields = Object.keys(this.editedItem)
          .filter((key) => fieldsToUpdate.includes(key) && this.editedItem[key] !== this.originalItem[key])
          .reduce((obj, key) => {
            obj[key] = this.editedItem[key];
            return obj;
          }, {});
        if (Object.keys(updatedFields).length > 0) {
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
              endpoint: 'person-home-warehouse-product',
              method: 'POST',
              data: formData
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
            this.loadingProduct = false;
            this.editedIndex = -1
          }
        }
        else {
          this.loadingProduct = false;
          this.showAlert("success", "Debe completar los datos de producto.", 3000);
        }
      } else {
        this.loadingProductEdit = true;
        this.valid = false;
        const fieldsToUpdate = ['id', 'home_id', 'warehouse_id', 'product_id', 'status_id', 'category_id', 'name', 'unit_price', 'quantity', 'total_price', 'purchase_date', 'purchase_place', 'expiration_date', 'brand', 'additional_notes', 'maintenance_date', 'due_date', 'frequency', 'type'];

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
              endpoint: 'person-home-warehouse-product-update',
              method: 'POST',
              data: formData
            });

            // Manejo de la respuesta según el resultado
            if (result.success) {
              this.showAlert("success", result.message, 3000);
              this.initialize();
            } else {
              this.showAlert("warning", result.message, 3000);
            }
          } catch (error) {
            this.loadingProductEdit = false;
            // Este bloque captura errores inesperados fuera del manejo estándar
            this.showAlert("error", "Ocurrió un error inesperado al procesar la solicitud.", 3000);
          }
        } else {
          this.loadingProductEdit = false;
          this.showAlert("success", "No se realizaron cambios.", 3000);
        }
      }
      this.close();
    },

    async editItem(item) {
      this.originalItem = Object.assign({}, item);
      this.editedItem = Object.assign({}, item);
      this.file = null;
      this.editedIndex = 1;
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
      }
      this.loadingProductEdit = true;
      this.data = {};
      this.data.home_id = this.editedItem.home_id;
      try {
        const result = await handleRequest({
          endpoint: 'productcategory-productstatus-apk',
          method: 'GET'
        });

        if (result.success) {
          // Si la solicitud es exitosa, asignamos las sucursales
          this.categories = result.data?.productcategories || [];
          this.status = result.data?.productstatus || [];
        } else {
          // Si no hay datos, asignamos un array vacío
          this.categories = [];
          this.status = [];
          this.showAlert('info', result.message || 'No hay alamacenes disponibles.', 3000);
        }
      } catch (error) {
        this.showAlert('error', 'Ocurrió un error inesperado al cargar los almacenes.', 3000);
        this.loadingProductEdit = false;
      } finally {
        this.dialog = true;
        this.loadingProductEdit = false;
      }
    },

    deleteItem(item) {
      this.editedItem.id = item.id;
      this.dialogDelete = true;
    },
    closeDelete() {
      this.dialogDelete = false;
    },
    async deleteItemConfirm() {
      this.loading = true;
      try {
        let request = {
          id: this.editedItem.id
        };
        const result = await handleRequest({
          endpoint: 'person-home-warehouse-product-destroy',
          method: 'POST',
          data: request
        });

        // Manejo de la respuesta según el resultado
        if (result.success) {
          this.showAlert("success", result.message, 3000);
          this.loading = false;
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
        this.showAlert('warning', 'El archivo de imagen debe ser de máximo 500 KB', 3000);
        return; // Detener el proceso si el archivo es demasiado grande
      }
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
  /* Color de fondo */
  color: white;
  /* Color de texto */
  border-radius: 4px;
  /* Opcional: redondear esquinas */
  padding: 8px;
  /* Opcional: ajustar padding */
}

.text-wrap {
  white-space: normal;
  /* Permitir que el texto se envuelva */
  word-wrap: break-word;
  /* Dividir palabras largas */
  overflow: visible;
  /* Evitar el recorte del texto */
}
.custom-tooltip {
  --v-tooltip-background: #03626C; /* Fondo del tooltip */
  --v-tooltip-color: #ffffff;      /* Color del texto */
  --v-tooltip-border-radius: 4px; /* Bordes redondeados */
  --v-tooltip-padding: 8px 12px;  /* Espaciado interno */
}
</style>