<template>
  <v-snackbar class="mt-12 rounded-lg" location="right top" :timeout="sb_timeout" :color="sb_type" elevation="24"
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
  <v-container>
    <v-card class="pa-4" elevation="4" rounded="lg">
      <!-- Encabezado con foto y datos -->
      <v-card-text>
        <v-row dense>
          <!-- Foto del usuario -->
          <!-- Foto y datos de la mascota (clickeable para cambiar) -->
          <v-col cols="12" md="6">
            <!-- Selector de mascota (activador del menú) -->
            <div class="d-flex align-center cursor-pointer pet-selector"
              style="padding: 8px; border-radius: 12px; transition: background-color 0.2s"
              @click="menuWarehouse = !menuWarehouse">
              <!-- Foto del paciente -->
              <div style="position: relative; display: inline-block;">
                <div class="icon-wrapper me-4">
                  <v-icon icon="mdi-store" color="white" size="40px"></v-icon>
                </div>
                <!-- Botón de edición superpuesto -->
                <v-btn icon variant="text" size="small" color="blue-grey" @click.stop="editItem(selectedWarehouse)"
                  style="position: absolute; bottom: 0; right: 12px;">
                  <v-icon color="primary" size="20">mdi-pencil</v-icon>
                </v-btn>
              </div>

              <!-- Datos del paciente -->
              <div>
                <div class="text-body-2 font-weight-bold mb-1">
                  {{ selectedWarehouse.title }}
                </div>
                <div class="text-body-2 text-grey-darken-1 text-truncated">
                  {{ selectedWarehouse.description }}
                  <v-tooltip activator="parent" location="bottom" max-width="350px">
                   <span style="white-space: normal; word-break: break-word">
                    {{ $t("warehouse.fields.description") }}: {{ selectedWarehouse.description }}
                    </span>
                  </v-tooltip>
                </div>
                <div class="text-body-2 text-grey-darken-1 text-truncated">
                  {{ selectedWarehouse.productCount }}
                  <v-tooltip activator="parent" location="bottom" max-width="350px">
                   <span style="white-space: normal; word-break: break-word">
                    {{ $t("product.fields.quantity") }}: {{ selectedWarehouse.productCount }}
                    </span>
                  </v-tooltip>
                </div>
              </div>

              <!-- Icono de despliegue -->
              <v-icon :class="{ 'rotate': menuWarehouse }" class="ms-2 transition-fast-in-fast-out" size="20"
                color="grey">
                mdi-menu-down
              </v-icon>
            </div>

            <!-- Menú desplegable con TARJETAS (no lista) -->
            <v-menu v-model="menuWarehouse" :close-on-content-click="false" location="bottom start" offset-y
              :min-width="null" :max-width="null" class="rounded-lg">
              <template #activator="{ props }">
                <div v-bind="props"></div>
              </template>
              <v-card max-width="900px" class="mx-auto rounded-lg">
                <v-card-text>
                  <v-container fluid>
                    <!-- Eliminamos flex-nowrap y overflow-x -->
                    <v-row justify="center">
                      <!-- Ajustamos columnas para 4 por fila -->
                      <v-col 
                        v-for="warehouse in personwarehouses" 
                        :key="warehouse.id" 
                        cols="12" sm="6" md="3" lg="3" xl="3"
                      >
                        <v-card 
                          class="text-center store-card" 
                          elevation="3" 
                          rounded="lg"
                          @click="selectWarehouse(warehouse)"
                          :class="selectedWarehouse?.id === warehouse.id ? 'bg-blue-lighten-5' : ''"
                        >
                          <div class="icon-wrapper mb-3">
                            <v-icon icon="mdi-store" color="white" size="50px"></v-icon>
                          </div>
                          
                          <!-- Texto truncado -->
                          <div class="store-name text-truncate px-2">{{ warehouse.title }}</div>
                          <div class="store-products text-truncate px-2">{{ warehouse.description }}</div>
                          
                          <v-tooltip activator="parent" location="bottom" max-width="350px">
                            <span style="white-space: normal; word-break: break-word">
                              {{ $t("warehouse.fields.description") }}: {{ warehouse.description }}
                            </span>
                          </v-tooltip>
                          
                          <v-icon 
                            v-if="selectedWarehouse?.id === warehouse.id" 
                            color="primary" 
                            size="18"
                            class="position-absolute" 
                            style="top: 8px; right: 8px;"
                          >
                            mdi-check-circle
                          </v-icon>
                        </v-card>
                      </v-col>
                    </v-row>
                  </v-container>
                </v-card-text>
              </v-card>

            </v-menu>
          </v-col>

          <!-- Espaciado para centrar visualmente -->
          <v-col cols="12" md="3"></v-col>

          <v-col cols="12" sm="6" md="3">
            <v-card class="pa-2 d-flex align-center signo-card" elevation="1" rounded="lg" @click="dialogAlerta = true"
              style="cursor: pointer">
              <!-- Ícono -->
              <v-avatar size="40" class="me-3" color="purple-lighten-4" variant="tonal">
                <v-icon color="warning">mdi-lightbulb-on-outline</v-icon>
              </v-avatar>

              <!-- Texto -->
              <div>
                <div class="text-body-2 font-weight-medium">
                  {{ $t("pets.alerts.title") }}
                </div>
                <div class="text-caption text-grey-darken-1">
                  {{ $t("pets.alerts.count", { count: suggestions.length }) }}
                </div>
              </div>
            </v-card>
          </v-col>
          <!-- Botón flotante de añadir (posición fija) -->
          <v-btn icon size="large" color="deep-purple-accent-4" class="ma-4" elevation="6"
            style="position: fixed; top: 40px; right: 260px" @click="showAddWareHouse()">
            <v-icon size="32">mdi-plus</v-icon>
          </v-btn>
        </v-row>
        <v-divider class="my-4" />
                <v-row class="pa-0 ma-0">
                    <v-col v-for="(tool, index) in warehouseTools" :key="index" cols="12" sm="6" md="6" lg="3" class="px-1">
                        <v-card class="d-flex align-center pa-2" elevation="2" rounded="lg" density="comfortable"
                            @click="tool.action()" style="cursor: pointer; height: 70px; width: 100%">
                            <v-avatar size="40" class="me-3" :color="tool.color + ' lighten-4'" variant="tonal">
                                <v-icon :color="tool.color">{{ tool.icon }}</v-icon>
                            </v-avatar>

                            <div style="min-width: 0; flex: 1">
                                <div class="text-body-2 font-weight-medium text-truncate">
                                    {{ tool.name }}
                                </div>

                                <template v-if="tool.count > 0">
                                    <!-- Caso 1: Solo 1 registro -->
                                    <template v-if="tool.count === 1">
                                        <v-tooltip location="bottom" v-if="tool.lastItemName">
                                            <template v-slot:activator="{ props }">
                                                <div v-bind="props"
                                                    class="text-caption text-grey-darken-1 text-truncate">
                                                    {{ tool.lastItemName }}
                                                </div>
                                            </template>
                                            <span>{{ tool.lastItemName }}</span>
                                        </v-tooltip>
                                        <div v-else class="text-caption text-grey-darken-1">
                                            {{ $t("common.no_name") }}
                                        </div>

                                        <div class="text-caption text-grey-lighten-1 mt-1">
                                            {{ formatIntuitiveDate(tool.lastDate) }}
                                        </div>
                                    </template>

                                    <!-- Caso 2: Más de 1 registro -->
                                    <template v-else>
                                        <div class="text-caption text-grey-lighten-1">
                                            <div class="font-weight-medium">
                                                {{ tool.count }} {{ $t("common.items") }}
                                            </div>
                                            <div class="mt-1">
                                                {{ formatIntuitiveDate(tool.lastDate) }}
                                            </div>
                                        </div>
                                    </template>
                                </template>
                                <template v-else>
                                    <div class="text-caption text-grey-darken-1">
                                        {{ $t("common.no_records") }}
                                    </div>
                                </template>
                            </div>
                        </v-card>
                    </v-col>
                </v-row>
        <!-- Encabezado -->
        <!--<v-row justify="space-between" align="center" class="mb-6">
           <h2 class="text-body-2 font-weight-bold">{{ $t("warehouse.list.title") }}</h2>
          <v-btn icon color="deep-purple-accent-4" variant="flat" class="elevation-3" @click="showAddWareHouse">
            <v-icon>mdi-plus</v-icon>
          </v-btn>
        </v-row>
        <v-row>
          <v-col cols="12" class="pa-0 pt-4">
            <v-row>
              <template v-for="(warehouse, index) in personwarehouses" :key="index">
                <v-col cols="12" sm="6" md="3">
                  <v-card elevation="2" density="comfortable" @click="showProducts(warehouse)" class="rounded-lg">
                    <v-card-item class="pa-3">
                      <template v-slot:prepend>
                        <div class="icono-concavo">
                          <v-icon icon="mdi-store-outline" color="error" size="x-large"></v-icon>
                        </div>
                      </template>

                      <div class="title-container">
                        <v-card-title class="text-body-2 text-truncate">
                          {{ warehouse.title }}
                          <v-tooltip activator="parent" location="bottom" max-width="350px">
                            <span style="white-space: normal; word-break: break-word">
                              {{ $t("warehouse.fields.name") }}: {{ warehouse.title }}
                            </span>
                          </v-tooltip>
                        </v-card-title>

                        <div v-if="warehouse.productCount > 0" class="dynamic-circle" :class="{
                          'bg-primary': warehouse.color === 'primary',
                          'bg-error': !warehouse.color || warehouse.color === 'error'
                        }">
                          {{ warehouse.productCount }}
                        </div>
                      </div>

                      <v-card-subtitle class="pt-0 text-truncate">
                        <span class="text-body-2">
                          {{ warehouse.description }}
                        </span>
                        <v-tooltip activator="parent" location="bottom" max-width="350px">
                          <span style="white-space: normal; word-break: break-word">
                            {{ $t("warehouse.fields.description") }}: {{ warehouse.description }}
                          </span>
                        </v-tooltip>
                      </v-card-subtitle>
                    </v-card-item>
                  </v-card>
                </v-col>
              </template>
            </v-row>
          </v-col>
        </v-row>-->
        <v-row>
          <v-divider class="my-4" />

        </v-row>
      </v-card-text>
      <SuggestionsList :items="suggestions" :title="$t('finances.sections.suggestions')" icon="mdi-finance">
        <template #detail="{ taskData, onClose }">
          <ChatTask :taskData="taskData" @close-dialog="onClose" />
        </template>
      </SuggestionsList>
    </v-card>
  </v-container>
  <v-dialog v-model="dialog" fullscreen persistent transition="dialog-bottom-transition"
    content-class="fullscreen-dialog">
    <v-form ref="form" v-model="valid" class="h-100">
      <v-card class="pa-10">
        <v-card-text class="pt-12">
          <h5 class="text-grey-darken-2 font-weight-medium">{{ formTitle }}</h5>
          <p class="text-grey-lighten-1">
            {{ $t("warehouse.formInstructions") }}
          </p>

          <v-row class="mt-12">
            <!-- Side steps -->
            <v-col cols="3">
              <v-timeline align="start" side="end" dense>
                <v-timeline-item v-for="(s, index) in steps" :key="index" :dot-color="
                    step > index
                      ? 'green'
                      : step === index
                      ? 'deep-purple'
                      : 'grey-lighten-1'
                  " :icon="
                    step >= index
                      ? step === index
                        ? `mdi-numeric-${index + 1}`
                        : 'mdi-check'
                      : null
                  " size="large">
                  <template #opposite>
                    <div class="text-end">
                      <strong>{{ $t(`warehouse.steps.${s.title}.title`) }}</strong>
                      <div class="text-caption text-grey">
                        {{ $t(`warehouse.steps.${s.title}.subtitle`) }}
                      </div>
                    </div>
                  </template>
                </v-timeline-item>
              </v-timeline>
            </v-col>

            <!-- Contenido dinámico según paso -->
            <v-col cols="9">
              <h3 class="text-deep-purple-accent-3 mb-8">
                {{ $t(`warehouse.steps.${steps[step].title}.title`) }}
              </h3>

              <!-- Paso 1: Información básica -->
              <v-row dense v-if="step === 0">
                <v-col cols="12" md="12" v-show="editedIndex === -1">
                  <v-autocomplete v-model="editedItem.warehouse_id" :items="warehouses"
                    :label="$t('warehouse.fields.warehouse')" item-title="title" item-value="id" variant="underlined">
                    <template v-slot:item="{ props, item }">
                      <v-list-item v-bind="props">
                        <v-list-item-subtitle class="d-flex flex-column">
                          <v-tooltip location="top right">
                            <template v-slot:activator="{ props }">
                              <div class="description-text" v-bind="props" :title="item.raw.description">
                                {{ $t("warehouse.fields.description") }}:
                                {{ item.raw.description }}
                              </div>
                            </template>
                            <span>{{ item.raw.description }}</span>
                          </v-tooltip>
                          <v-tooltip location="top right">
                            <template v-slot:activator="{ props }">
                              <div class="description-text" v-bind="props" :title="item.raw.location">
                                {{ $t("warehouse.fields.home_location") }}:
                                {{ item.raw.location }}
                              </div>
                            </template>
                            <span>{{ item.raw.location }}</span>
                          </v-tooltip>
                        </v-list-item-subtitle>
                      </v-list-item>
                    </template>
                  </v-autocomplete>
                </v-col>

                <v-col cols="12" md="12">
                  <v-text-field v-model="editedItem.title" clearable :label="$t('warehouse.fields.name')"
                    variant="underlined" :rules="nameRules"></v-text-field>
                </v-col>

                <v-col cols="12" md="12">
                  <v-text-field v-model="editedItem.location" clearable :label="$t('warehouse.fields.home_location')"
                    variant="underlined" :rules="locationRules"></v-text-field>
                </v-col>
              </v-row>

              <!-- Paso 2: Configuración adicional -->
              <v-row dense v-if="step === 1">
                <v-col cols="12" md="6">
                  <v-select v-model="editedItem.status" :items="[
                      { id: 0, label: $t('warehouse.status.public') },
                      { id: 1, label: $t('warehouse.status.private') },
                    ]" item-title="label" item-value="id" :label="$t('warehouse.fields.status')" variant="underlined"
                    :rules="statusRules"></v-select>
                </v-col>

                <v-col cols="12" md="12">
                  <v-textarea v-model="editedItem.description" clearable :label="$t('warehouse.fields.description')"
                    variant="underlined" :rules="descriptionRules"></v-textarea>
                </v-col>
              </v-row>

              <div class="d-flex justify-space-between mt-8">
                <v-btn variant="text" class="text-grey-darken-1" @click="step > 0 ? step-- : this.close()">
                  {{ step === 0 ? $t("buttons.close") : $t("buttons.previous") }}
                </v-btn>

                <v-btn variant="text" class="text-deep-purple-accent-3" @click="nextStep" :disabled="!valid">
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
        <span class="text-subtitle-2 ml-4"> <span class="text-subtitle-2 ml-4"> {{ $t('deleteDialog.title', { item:
            $t(`deleteDialog.items.warehouse`) }) }}</span></span>
      </v-toolbar>
      <v-card-text class="mt-2 mb-2"> {{ $t('deleteDialog.message') }}</v-card-text>
      <v-divider></v-divider>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn color="grey" variant="flat" @click="closeDelete">{{ $t('taskForm.buttons.cancel') }}</v-btn>
        <v-btn color="#03626C" variant="flat" :loading="loading" @click="deleteItemConfirm">{{
          $t('taskForm.buttons.confirmDelete') }}</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
  <v-dialog v-model="dialogProduct" fullscreen transition="dialog-bottom-transition">
    <v-card class="bg-grey-lighten-4">
      <v-card-text class="bg-grey-lighten-4">
        <!-- Aquí pasamos el 'selectedWorker' al componente dentro del diálogo -->
        <Product :warehouseData="warehouseData" @warehouse-updated="handleWarehouseUpdate" />
      </v-card-text>
      <v-divider></v-divider>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn @click="closeDialogProduct">Cerrar</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
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
              <v-tooltip activator="parent" location="bottom" max-width="350px" class="custom-tooltip">
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
</template>

<script>
import LocalStorageService from "@/LocalStorageService";
import { handleRequest } from "@/utils/api"; // Ruta al archivo
import Product from "../product/Product.vue";
import SuggestionsList from "../suggestion/SuggestionsList.vue";
import ChatTask from "../chat/ChatTask.vue";
export default {
    components: {
    Product,
    SuggestionsList,
    ChatTask
  },
  data: () => ({
    snackbar: false,
    dialogProduct: false,
    dialogAlerta: false,
    warehouseData: {},
    menuWarehouse: false,
    selectedWarehouse: {},
    warehouseTools: [],
    step: 0,
    steps: [
      {
        title: "basic",
        subtitle: "basic_information",
      },
      {
        title: "configuration",
        subtitle: "additional_configuration",
      },
    ],
    sb_type: "",
    sb_message: "",
    sb_timeout: 2000,
    sb_title: "",
    sb_icon: "",
    valid: true,
    loading: false,
    dialog: false,
    dialogDelete: false,
    warehouses: [],
    home_id: "",
    personwarehouses: [],
    suggestions: [],
    statusuggestions: [],
    data: {},
    headers: [
      { title: "warehouse.list.columns.name", value: "title", width: "25%" },
      { title: "warehouse.list.columns.location", value: "location", width: "25%" },
      { title: "warehouse.list.columns.status", value: "status", width: "20%" },
      {
        title: "warehouse.list.columns.actions",
        value: "actions",
        sortable: false,
        width: "10%",
      },
    ],

    editedItem: {
      id: "",
      title: "",
      description: "",
      location: "",
      status: "",
      home_id: "",
      warehouse_id: "",
    },
    defaultItem: {
      id: "",
      title: "",
      description: "",
      location: "",
      status: "",
      warehouse_id: "",
      home_id: "",
    },
    originalItem: {
      id: "",
      title: "",
      description: "",
      location: "",
      status: "",
      home_id: "",
      warehouse_id: "",
    },
    editedIndex: -1,
    isEditing: false,
    search: "",
  }),
  watch: {
    "editedItem.warehouse_id"(newVal) {
      if (!this.isEditing) {
        // Si está en modo edición, no ejecutar la lógica del watch
        return;
      }
      const selectedWarehouse = this.warehouses.find((w) => w.id === newVal);
      if (selectedWarehouse) {
        this.editedItem.title = selectedWarehouse.title;
        this.editedItem.description = selectedWarehouse.description;
        this.editedItem.location = selectedWarehouse.location;
      } else {
        this.editedItem.title = "";
        this.editedItem.description = "";
        this.editedItem.location = "";
      }
    },
  },
  computed: {
    translatedHeaders() {
      return this.headers.map((header) => ({
        ...header,
        title: this.$t(header.title),
      }));
    },
    formTitle() {
      return this.editedIndex === -1 ? "Agregar Nuevo Almacén" : "Editar Almacén";
    },
    nameRules() {
      return [
        (v) =>
          (v && v.length >= 3) ||
          this.$t("warehouse.validation.min_length", {
            field: this.$t("warehouse.fields.name"),
            length: 3,
          }),
        (v) =>
          (v && v.length <= 50) ||
          this.$t("warehouse.validation.max_length", {
            field: this.$t("warehouse.fields.name"),
            length: 50,
          }),
      ];
    },
    locationRules() {
      return [
        (v) =>
          (v && v.length <= 100) ||
          this.$t("warehouse.validation.max_length", {
            field: this.$t("warehouse.fields.home_location"),
            length: 100,
          }),
      ];
    },
    statusRules() {
      return [
        (v) =>
          (v !== null && v !== undefined) ||
          this.$t("warehouse.validation.required", {
            field: this.$t("warehouse.fields.status"),
          }),
        (v) =>
          [0, 1].includes(v) ||
          this.$t("warehouse.validation.invalid_selection", {
            field: this.$t("warehouse.fields.status"),
          }),
      ];
    },
    descriptionRules() {
      return [
        (v) =>
          !v ||
          v.length <= 255 ||
          this.$t("warehouse.validation.max_length", {
            field: this.$t("warehouse.fields.description"),
            length: 255,
          }),
      ];
    },
  },
  mounted() {
    this.home_id = JSON.parse(LocalStorageService.getItem("home_id"));
    this.initialize();
  },
  methods: {
    formatIntuitiveDate(dateString) {
      if (!dateString) return "";

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
    updateWarehouseTools() {
  this.warehouseTools = [
    {
      name: this.$t("warehouse.titles.products"),
      action: () => this.showProducts(),
      icon: "mdi-package-variant",
      color: "indigo",
      count: this.selectedWarehouse.productCount || 0,
      lastDate: this.lastAddedProductDate,
      lastItemName: this.lastAddedProductName || this.$t("common.no_name"),
    },
    {
      name: this.$t("warehouse.titles.lowStock"),
      action: () => this.showLowStock(),
      icon: "mdi-alert-box",
      color: "orange",
      count: this.lowStockItemsCount || 0,
      lastItemName: this.mostCriticalLowStockItem || this.$t("common.no_name"),
    },
    {
      name: this.$t("warehouse.titles.expiringSoon"),
      action: () => this.showExpiringSoon(),
      icon: "mdi-clock-alert-outline",
      color: "red",
      count: this.expiringSoonCount || 0,
      lastItemName: this.nextToExpireItem || this.$t("common.no_name"),
      lastDate: this.nextToExpireDate
    }/*,
    {
      name: this.$t("warehouse.titles.categories"),
      action: () => this.showCategories(),
      icon: "mdi-shape-outline",
      color: "green",
      count: this.categoryCount || 0,
      lastItemName: this.mostUsedCategory || this.$t("common.no_name"),
    },
    {
      name: this.$t("warehouse.titles.storageLocations"),
      action: () => this.showStorageLocations(),
      icon: "mdi-map-marker-outline",
      color: "blue",
      count: this.locationCount || 0,
      lastItemName: this.mostUsedLocation || this.$t("common.no_name"),
    }*/
  ];
},
    selectWarehouse(warehouse) {
      // Si necesitas el objeto completo también:
      this.selectedWarehouse = { ...warehouse };
      this.menuWarehouse = false;
      this.updateWarehouseTools();
    },
     handleWarehouseUpdate(updatedData) {
      // Actualizar los datos en el padre
      this.warehouseData = {
        ...this.warehouseData,
        ...updatedData
      };
    },
    showProducts() {
      this.warehouseData = this.selectedWarehouse;
      if (!this.selectedWarehouse.id) {
        this.showAlert("warning", "Primero selecciona un almacén.", 3000);
        return;
      }
      this.dialogProduct = true;
    },
    closeDialogProduct() {
      this.dialogProduct = false; // Cerramos el diálogo
      this.initialize();
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
    async showAddWareHouse() {
      this.isEditing = true;
      this.data.home_id = this.home_id;
      this.editedItem.home_id = this.home_id;
      try {
        const result = await handleRequest({
          endpoint: "person-warehouse-home-select",
          method: "POST",
          data: this.data,
        });

        if (result.success) {
          // Si la solicitud es exitosa, asignamos las sucursales
          //this.warehouses = result.data?.warehouses || [];
          this.warehouses =
            result.data?.warehouses?.filter(
              (warehouse) =>
                !this.personwarehouses.some(
                  (personwarehouse) => personwarehouse.warehouse_id === warehouse.id
                )
            ) || [];
        } else {
          // Si no hay datos, asignamos un array vacío
          this.warehouses = [];
          this.showAlert(
            "info",
            result.message || "No hay alamacenes disponibles.",
            3000
          );
        }
      } catch (error) {
        this.showAlert(
          "error",
          "Ocurrió un error inesperado al cargar los almacenes.",
          3000
        );
      } finally {
        this.dialog = true;
      }
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
    async initialize() {
      this.data = {};
      this.data.home_id = this.home_id;
      try {
        this.loading = true;
        const result = await handleRequest({
          endpoint: "person-warehouse-home",
          method: "POST",
          data: this.data,
        });

        if (result.success) {
          // Si la solicitud es exitosa, asignamos las sucursales
          this.personwarehouses = result.data?.store || [];
          this.suggestions = result.data?.suggestions || [];
          this.statusuggestions = result.data?.statusuggestions || [];
           if (!this.selectedWarehouse?.id && this.personwarehouses.length > 0) {
            this.selectedWarehouse = { ...this.personwarehouses[0] };
          }
          this.updateWarehouseTools();
        } else {
          // Si no hay datos, asignamos un array vacío
          this.personwarehouses = [];
          this.suggestions = [];
          this.statusuggestions = [];
          //this.showAlert('success', result.message || 'No hay almacénes disponibles.', 3000);
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
      this.loading = true;
      if (this.editedIndex === -1) {
        this.valid = false;
        this.data.title = this.editedItem.title;
        this.data.description = this.editedItem.description;
        this.data.location = this.editedItem.location;
        this.data.warehouse_id = this.editedItem.warehouse_id ?? "";
        this.data.home_id = this.editedItem.home_id;
        try {
          const result = await handleRequest({
            endpoint: "person-warehouse",
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
        const fieldsToUpdate = ["id", "title", "location", "description", "status"];
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
          this.loading = true;
          try {
            const result = await handleRequest({
              endpoint: "person-warehouse",
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
    async editItem(item) {
      this.editedIndex = 1;
      this.originalItem = Object.assign({}, item);
      this.editedItem = Object.assign({}, item);
      this.data.home_id = this.home_id;
      this.editedItem.home_id = this.home_id;
      try {
        const result = await handleRequest({
          endpoint: "person-warehouse-home-select",
          method: "POST",
          data: this.data,
        });

        if (result.success) {
          // Si la solicitud es exitosa, asignamos las sucursales
          //this.warehouses = result.data?.warehouses || [];
          this.warehouses =
            result.data?.warehouses?.filter(
              (warehouse) =>
                !this.personwarehouses.some(
                  (personwarehouse) => personwarehouse.warehouse_id === warehouse.id
                )
            ) || [];
        } else {
          // Si no hay datos, asignamos un array vacío
          this.warehouses = [];
          this.showAlert(
            "info",
            result.message || "No hay alamacenes disponibles.",
            3000
          );
        }
      } catch (error) {
        this.showAlert(
          "error",
          "Ocurrió un error inesperado al cargar los almacenes.",
          3000
        );
      } finally {
        this.dialog = true;
      }
      this.isEditing = false;
    },
    deleteItem(item) {
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
          endpoint: "person-warehouse-destroy",
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
  },
};
</script>
<style scoped>
.store-card {
  border-radius: 20px;
  cursor: pointer;
  transition: all 0.3s ease;
  width: 100%; /* Ocupa todo el ancho de la columna */
  height: 180px; /* Altura fija */
  background: #ffffff;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
  padding: 12px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  overflow: hidden; /* Evita que el contenido desborde */
}

.store-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 5px 10px rgba(0, 0, 0, 0.12);
}

.icon-wrapper {
  width: 60px;
  height: 60px;
  margin: 0 auto;
  border-radius: 50%;
  background: #F44336;
  display: flex;
  align-items: center;
  justify-content: center;
}

.store-name {
  font-size: 15px;
  font-weight: 600;
  color: #333;
  margin-bottom: 4px;
  width: 100%;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  text-align: center;
}

.store-products {
  font-size: 13px;
  color: #777;
  width: 100%;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  text-align: center;
}
.title-container {
  display: flex;
  align-items: center;
  min-width: 0; /* Fundamental para el truncado */
  width: 100%;
}

.v-card-title {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  flex: 1 1 auto;
  min-width: 0; /* Necesario para el truncado */
}

.dynamic-circle {
  width: 20px;
  height: 20px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 10px;
  font-weight: bold;
  color: white;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
  flex-shrink: 0; /* Evita que se reduzca */
  margin-left: 8px;
}

/* Clases de color para el círculo */
.dynamic-circle.primary {
  background-color: #03626c;
}
.dynamic-circle.error {
  background-color: #f44336;
}

.icono-concavo {
  width: 50px;
  height: 50px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 10px;
  margin-right: 8px;
  color: white;
  position: relative;
  overflow: hidden;
}
.avatar-border {
  border: 2px solid #000;
  /* Aquí se define el borde */
}

.description-text {
  max-width: 200px;
  /* Establece un límite de ancho */
  overflow: hidden;
  /* Oculta el texto que exceda */
  text-overflow: ellipsis;
  /* Añade "..." al final del texto largo */
  white-space: nowrap;
  /* Evita el salto de línea */
}
</style>
