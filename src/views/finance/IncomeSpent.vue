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

  <v-container class="pa-4">
  <v-card class="pa-4" elevation="4" rounded="lg">
      <!-- Encabezado con foto y datos -->
      <v-card-text>
    <!-- Encabezado -->
    <v-row justify="space-between" align="center" class="mb-6">
      <h2 class="text-body-2 font-weight-bold">{{ $t("finances.header.title") }}</h2>
      <v-btn icon color="deep-purple-accent-4" variant="flat" class="elevation-3" @click="showAdd">
        <v-icon>mdi-plus</v-icon>
      </v-btn>
    </v-row>

    <template v-if="financialRecords.length > 0">
      <v-card v-for="(income, index) in financialRecords" :key="index" class="mb-4 rounded-lg pa-2" density="comfortable" elevation="2">
        <v-row no-gutters class="ma-0">
          <!-- Columna 1: Fecha -->
          <v-col cols="1" md="1" class="d-flex align-center justify-center">
            <div class="icono-concavo" :class="`bg-${getTypeColor(income.type)}`">
              <div class="date-text">
                {{ formatIntuitiveDate(income.date) }}
              </div>
            </div>
          </v-col>

          <!-- Columna 2: Tipo y Método -->
          <v-col cols="1" class="d-flex align-center pe-4 gap-2">
            <div class="text-body-2 font-weight-bold">
              {{ income.type || $t("finances.notRecorded") }}
            </div>
          </v-col>
           <v-col cols="2" class="d-flex align-center pe-4 gap-2">
            <div v-if="income.income > 0" class="text-body-2 text-grey-darken-1">
       
                    </div>
            <div v-else class="text-body-2 text-grey-darken-1">
                           <span>
                        {{ income.categoryName }}
                      </span>
                      <v-tooltip activator="parent" location="bottom">
                        <span>{{ $t('finances.fields.budget') }}: {{ income.categoryName }}</span>
                      </v-tooltip>
            </div>
          </v-col>

          <!-- Columna 3: Ingresos -->
          <v-col cols="2" class="d-flex align-center pe-4 gap-2">
          <div :class="['text-body-2', income.income > 0 ? 'text-green-darken-1' : 'text-red-darken-1']">
    <span>
      {{ income.income > 0 ? formatCurrency(income.income) : formatCurrency(income.spent) }}
    </span>
    <v-tooltip activator="parent" location="bottom">
      <span>
        {{ $t('finances.fields.currency') }}: 
        {{ income.income > 0 ? formatCurrency(income.income) : formatCurrency(income.spent) }}
      </span>
    </v-tooltip>
  </div>
        </v-col>

          <!-- Columna 4: Descripción -->
          <v-col cols="4" class="d-flex align-center pe-4 gap-2">
            <div class="text-body-2 text-grey-darken-1">
              <span>
                {{ income.description }}
              </span>
              <v-tooltip activator="parent" location="bottom">
                <span>{{ $t('finances.fields.description') }}: {{ income.description }}</span>
              </v-tooltip>
            </div>
          </v-col>

          <!-- Columna 5: Archivo y Acciones -->
          <v-col cols="2" class="d-flex align-center pe-4 gap-2 justify-end align-center">
            <!-- Archivo -->
            <div v-if="income.image && income.image !== 'finances/default.jpg'" class="mr-2">
              <v-btn density="comfortable" icon="mdi-eye" color="green" @click="openModal(income.image)" variant="tonal"
                size="small" title="Ver archivo adjunto"></v-btn>
            </div>

            <!-- Acciones -->
            <div class="d-flex">
              <v-btn icon variant="text" color="green-darken-2" size="small" @click="editItem(income)" class="mx-1">
                <v-icon>mdi-pencil</v-icon>
              </v-btn>
              <v-btn icon variant="text" color="red-darken-2" size="small" @click="deleteItem(income)" class="mx-1">
                <v-icon>mdi-delete</v-icon>
              </v-btn>
            </div>
          </v-col>
        </v-row>
      </v-card>
    </template>

    <template v-else>
      <v-col cols="12" class="text-center py-8 pa-0">
        <v-icon size="64" color="grey-lighten-1">mdi-wallet-outline</v-icon>
        <div class="text-h6 text-grey mt-4">
          {{ $t("finances.noRecords") }}
        </div>
      </v-col>
    </template>
    </v-card-text>
    </v-card>
  </v-container>

  <!-- Diálogo para agregar/editar ingresos -->
  <v-dialog v-model="dialog" fullscreen persistent transition="dialog-bottom-transition"
    content-class="fullscreen-dialog">
     <v-form ref="form" v-model="valid" class="h-100">
      <v-card class="pa-10">
        <v-card-text class="pt-12">
          <h5 class="text-grey-darken-2 font-weight-medium">{{ formTitle }}</h5>
          <p :class="[isIncome ? 'text-green' : 'text-red', 'text-grey-lighten-1']">
            {{
              isIncome
                ? $t("finances.formInstructions.income")
                : $t("finances.formInstructions.expense")
            }}
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
                      <strong>{{ $t(`finances.steps.${s.title}.title`) }}</strong>
                      <div class="text-caption text-grey">
                        {{ $t(`finances.steps.${s.title}.subtitle`) }}
                      </div>
                    </div>
                  </template>
                </v-timeline-item>
              </v-timeline>
            </v-col>

            <!-- Contenido dinámico según paso -->
            <v-col cols="9">
              <h3 class="text-deep-purple-accent-3 mb-8">
                {{ $t(`finances.steps.${steps[step].title}.title`) }}
              </h3>

              <!-- Paso 1: Detalles del ingreso -->
              <v-row dense v-if="step === 0">
                <v-col cols="12" sm="12">
                  <v-switch
                    v-model="isIncome"
                    inset
                    hide-details
                    :label="''"
                    :base-color="isIncome ? 'green' : 'red'"
                    :color="isIncome ? 'green' : 'red'"
                    class="mb-4 font-weight-bold"
                  >
                    <template #label>
                      <span :class="isIncome ? 'text-green' : 'text-red'">
                        {{
                          isIncome
                            ? $t("finances.fields.income")
                            : $t("finances.fields.spent")
                        }}
                      </span>
                    </template>
                  </v-switch>
                </v-col>

                <v-col cols="12" sm="6">
                  <v-autocomplete
                    v-model="editedItem.type"
                    :items="types"
                    :label="$t('finances.fields.type')"
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
                    v-if="isIncome"
                    v-model="editedItem.income"
                    :label="$t('finances.fields.income')"
                    variant="underlined"
                    type="number"
                    step="0.01"
                    :rules="incomeRules"
                    required
                    :color="'green'"
                  />
                  <v-text-field
                    v-else
                    v-model="editedItem.spent"
                    :label="$t('finances.fields.spent')"
                    variant="underlined"
                    type="number"
                    step="0.01"
                    :rules="incomeRules"
                    required
                    :color="'red'"
                  />
                </v-col>

                <v-col cols="12" sm="12" v-if="!isIncome">
                  <v-autocomplete
                    v-model="editedItem.budget_id"
                    :items="budgets"
                    :label="$t('budget.fields.category')"
                    item-title="categoryName"
                    item-value="id"
                    variant="underlined"
                    :rules="selectRules"
                  >
                    <template v-slot:item="{ props, item }">
                      <v-list-item v-bind="props">
                        <template v-slot:prepend>
                          <v-avatar size="24">
                            <template v-if="isImage(item.raw.icon)">
                              <img
                                :src="`${this.$axios.defaults.baseURL}images/${
                                  item.raw.icon
                                }?t=${Date.now()}`"
                                alt="icon"
                              />
                            </template>
                            <template v-else>
                              <v-icon>{{ getIconName(item.raw.icon) }}</v-icon>
                            </template>
                          </v-avatar>
                        </template>
                        <v-list-item-subtitle class="d-flex flex-column">
                          <div>
                            {{ $t("finances.fields.available") }}:
                            {{ formatCurrency(item.raw.amount - item.raw.used_amount) }}
                          </div>
                          <div>
                            {{ $t("finances.fields.total") }}:
                            {{ formatCurrency(item.raw.amount) }}
                          </div>
                        </v-list-item-subtitle>
                      </v-list-item>
                    </template>
                  </v-autocomplete>
                </v-col>

                <v-col cols="12" md="6">
                  <v-file-input
                    v-model="file"
                    ref="fileInput"
                    :label="$t('finances.fields.attach_file')"
                    variant="underlined"
                    name="file"
                    accept=".png, .jpg, .jpeg"
                    @change="onFileSelected"
                    :prepend-icon="false"
                  ></v-file-input>
                </v-col>
                <v-col cols="12" md="6">
                  <v-card elevation="6" class="mx-auto" max-width="210" max-height="120">
                    <img
                      v-if="imagenDisponible() && this.showImage"
                      :src="imgedit"
                      height="120"
                      :label="$t('finances.fields.file')"
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

              <!-- Step 2: Descripción y fecha -->
              <v-row dense v-if="step === 1">
                <v-col cols="12">
                  <v-textarea
                    v-model="editedItem.description"
                    :label="$t('finances.fields.description')"
                    variant="underlined"
                    rows="3"
                    auto-grow
                    :rules="descriptionRules"
                  />
                </v-col>

                <v-col cols="12">
                  <v-menu
                    v-model="dateMenu"
                    :close-on-content-click="false"
                    transition="scale-transition"
                    offset-y
                    min-width="auto"
                  >
                    <template v-slot:activator="{ props }">
                      <v-text-field
                        v-bind="props"
                        :model-value="dateInput"
                        :label="$t('finances.fields.date')"
                        variant="underlined"
                        readonly
                      ></v-text-field>
                    </template>
                    <v-date-picker
                      color="#03626C"
                      :model-value="parseDateString(dateInput)"
                      @update:model-value="updateDate"
                    ></v-date-picker>
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

  <!-- Diálogo de confirmación para eliminar -->
  <v-dialog v-model="dialogDelete" max-width="500px">
    <v-card rounded-lg>
      <v-toolbar color="#DA7171">
        <span class="text-subtitle-2 ml-4">
          {{
          $t("deleteDialog.title", { item: $t(`deleteDialog.items.income`) })
          }}</span>
      </v-toolbar>
      <v-card-text class="mt-2 mb-2"> {{ $t("deleteDialog.message") }}</v-card-text>
      <v-divider></v-divider>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn color="grey" variant="flat" @click="closeDelete">{{
          $t("taskForm.buttons.cancel")
          }}</v-btn>
        <v-btn color="#03626C" variant="flat" :loading="loading" @click="deleteItemConfirm">
          {{ $t("taskForm.buttons.confirmDelete") }}</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>

  <!-- Diálogo para ver imagen -->
  <v-dialog v-model="dialogPhoto" persistent max-width="600px">
    <v-card rounded-lg>
      <v-toolbar color="#03626C">
        <span class="text-subtitle-2 ml-4">Detalle</span> <v-spacer></v-spacer>
        <v-btn @click="dialogPhoto = false">
          <v-icon>mdi-close</v-icon>
        </v-btn>
      </v-toolbar>

      <v-card-text>
        <template v-if="loadingImage">
          <div class="d-flex justify-center align-center" style="min-height: 200px">
            <v-progress-circular indeterminate color="#03626C"
              style="width: 100px; height: 100px"></v-progress-circular>
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
    isIncome: true,
    modal2: false,
    timePickerDialog: false,
    steps: [
      {
        title: "financialDetails",
        subtitle: "basic_information",
      },
      {
        title: "description",
        subtitle: "additional_details",
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
    financialRecords: [],
    dialogPhoto: false,
    loadingImage: false,
    selectedImageUrl: "",
    dateMenu: false,
    dateInput: null,
    home_id: "",
    person_id: "",
    editedItem: {
       id: "",
        type: "",
        method: "",
        income: null,
        spent: null,
        description: "",
        date: null,
        image: null,
        budget_id: "",
    },
    defaultItem: {
       id: "",
        type: "",
        method: "",
        income: null,
        spent: null,
        description: "",
        date: null,
        image: null,
        budget_id: "",
    },
    originalItem: {
       id: "",
        type: "",
        method: "",
        income: null,
        spent: null,
        description: "",
        date: null,
        image: null,
        budget_id: "",
    },
    editedIndex: -1,
    search: "",
    types: [],
    budgets: [],
  }),

  computed: {
     filteredIncomes() {
      return this.financialRecords.filter(record => record.income && record.income > 0);
    },
    typeRules() {
      return [
        v => !!v || this.$t('finances.validationMessages.type.required'), // Validación de requerido
        v => !v || v.length <= 50 || this.$t('finances.validationMessages.type.maxLength') // Validación de longitud máxima
      ];
    }, 
   methodRules() {
      return [
        v => !v || v.length <= 50 || this.$t('finances.validationMessages.method.maxLength')
      ];
    },
    incomeRules() {
      return [
        v => v === null || v === '' || !isNaN(v) || this.$t('finances.validationMessages.income.number'),
        v => v === null || v === '' || /^-?\d+(\.\d{1,2})?$/.test(v) || this.$t('finances.validationMessages.income.precision')
      ];
    },
    spentRules() {
      return [
        v => v === null || v === '' || !isNaN(v) || this.$t('finances.validationMessages.spent.number'),
        v => v === null || v === '' || /^-?\d+(\.\d{1,2})?$/.test(v) || this.$t('finances.validationMessages.spent.precision')
      ];
    },
    descriptionRules() {
      return [
        v => !v || v.length <= 255 || this.$t('finances.validationMessages.description.maxLength')
      ];
    },
    dateRules() {
      return [v => !!v || this.$t("finances.validationMessages.date.required")];
    },
    formTitle() {
      return this.editedIndex === -1
        ? this.$t("finances.titles.new")
        : this.$t("finances.titles.edit");
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
    isImage(icon) {
      // Validar si el valor es una URL válida (puedes personalizar esta lógica)
      return (
        typeof icon === "string" &&
        (icon.startsWith("http") || /\.(png|jpe?g|gif|svg|webp)$/i.test(icon))
      );
    },
    getIconName(icon) {
      if (!icon) return "mdi-help-circle"; // Ícono por defecto si no hay valor
      // Si el ícono tiene el prefijo "MdiIcons.", extraer solo el nombre
      if (icon.startsWith("MdiIcons.")) {
        return `mdi-${icon.split(".")[1].toLowerCase()}`;
      }
      // Si el ícono ya está en formato "mdi-*", devolverlo tal cual
      if (icon.startsWith("mdi-")) {
        return icon;
      }
      // En otros casos, devolver un ícono por defecto
      return "mdi-help-circle";
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
    
    getTypeColor(type) {
      const colorMap = {
        Gasto: "red-lighten-1",
        Ingreso: "green-lighten-1",
        // Agrega más tipos si es necesario
      };
      return colorMap[type] || "grey-lighten-1"; // Color por defecto
    },
    updateDate(value) {
    // value viene como objeto Date desde el date-picker
    // Convertimos a formato YYYY-MM-DD
    const year = value.getFullYear();
    const month = String(value.getMonth() + 1).padStart(2, '0');
    const day = String(value.getDate()).padStart(2, '0');
    this.dateInput = `${year}-${month}-${day}`;
    this.editedItem.date = this.dateInput;
    this.dateMenu = false;
  },
  
  // Método para convertir string a Date (solo cuando sea necesario)
  parseDateString(dateString) {
    if (!dateString) return null;
    const [year, month, day] = dateString.split('-');
    return new Date(year, month - 1, day);
  },
    formatCurrency(value) {
      if (value === null || value === undefined) return "";
      return new Intl.NumberFormat('es-ES', { 
        style: 'currency', 
        currency: 'EUR',
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
      }).format(value);
    },
    openModal(imageUrl) {
      this.dialogPhoto = true;
      this.loadingImage = true;
      var img = new Image();
      img.src = `${this.$axios.defaults.baseURL}images/${imageUrl}`;

      img.onload = () => {
        this.selectedImageUrl = `${this.$axios.defaults.baseURL}images/${imageUrl}`;
        this.loadingImage = false;
      };

      img.onerror = () => {
        this.selectedImageUrl = "";
        this.dialogPhoto = false;
        this.loadingImage = false;
      };
    },
    formatDate(dateString) {
      if (!dateString) return "N/R";
      const [year, month, day] = dateString.split("-");
      return `${day}-${month}-${year}`;
    },
    shouldShowTooltip(text) {
      return text && text.length > 120;
    },
    /*updateDate(val) {
      this.dateInput = val;
      this.editedItem.date = this.dateFormatted;
      this.dateMenu = false;
    },*/

    async showAdd() {
      this.editedIndex = -1;
      this.editedItem = Object.assign({}, this.defaultItem);
      this.originalItem = Object.assign({}, this.defaultItem);
      this.file = null;
      this.imgMiniatura = "";
      try {
        const result = await handleRequest({
          endpoint: 'get-finances-data',
          method: 'POST',
        });

        if (result.success) {
          this.types = result.data?.types || [];
          this.budgets = result.data?.budgets || [];
        } else {
          this.types = [];
          this.budgets = [];
        }
      } catch (error) {
        this.showAlert('error', 'Ocurrió un error inesperado al cargar los tipos de consulta.', 3000);
      } finally {
        this.dialog = true;
      }
      this.dialog = true;
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
      this.data = {};
        this.data.home_id = this.home_id;
        this.data.type = 'Todas';
      try {
        this.loading = true;
        const result = await handleRequest({
          endpoint: "get-type-finance-range",
          method: "POST",
          data: this.data
        });

        if (result.success) {
          this.financialRecords = result.data?.finances || [];
        } else {
          this.financialRecords = [];
        }
      } catch (error) {
        this.loading = false;
        this.showAlert("error", "Ocurrió un error al cargar los registros financieros.", 3000);
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
        const fieldsToUpdate = ['home_id', 'spent', 'income', 'image', 'date', 'description', 'image', 'type', 'method', 'budget_id'];

        let updatedFields = Object.keys(this.editedItem)
          .filter((key) => fieldsToUpdate.includes(key) && this.editedItem[key] !== this.originalItem[key])
          .reduce((obj, key) => {
            obj[key] = this.editedItem[key];
            return obj;
          }, {});
        if (Object.keys(updatedFields).length > 0) {
          updatedFields.date = this.editedItem.date ? this.editedItem.date : new Date();
          updatedFields.home_id = Number(this.home_id);
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
        const fieldsToUpdate = ['home_id', 'spent', 'income', 'image', 'date', 'description', 'image', 'type', 'method', 'budget_id'];
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
      this.showImage = false;
      this.icono = "mdi-file";
      this.editedIndex = 1;
      this.originalItem = Object.assign({}, item);
      this.editedItem = Object.assign({}, item);
      this.dateInput = item.date || null;
      console.log('this.dateInput');
      console.log(this.dateInput);
      this.file = null;
      item.income > 0 ? this.isIncome = true : this.isIncome = false;
      const imageExtensions = ["jpg", "jpeg", "png", "gif"];
      const extension = item.image?.split(".").pop().toLowerCase();

      if (imageExtensions.includes(extension) || item.image?.startsWith("image/")) {
        this.showImage = true;
        const img = new Image();
        img.src = `${this.$axios.defaults.baseURL}images/${item.image}`;
        img.onload = () => {
          this.imgMiniatura = `${this.$axios.defaults.baseURL}images/${item.image}`;
        };
      } else {
        this.icono = "mdi-file";
      }
      try {
        const result = await handleRequest({
          endpoint: 'get-finances-data',
          method: 'POST',
        });

        if (result.success) {
          this.types = result.data?.types || [];
          this.budgets = result.data?.budgets || [];
        } else {
          this.types = [];
          this.budgets = [];
        }
      } catch (error) {
        this.showAlert('error', 'Ocurrió un error inesperado al cargar los tipos de consulta.', 3000);
      } finally {
        this.dialog = true;
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
      this.loading = true;
      try {
        const result = await handleRequest({
          endpoint: "delete-financial-record",
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
        this.showAlert("error", "Ocurrió un error al eliminar el registro financiero.", 3000);
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

    compactRecordData(record) {
      return [
        {
          label: this.$t("finances.fields.type"),
          value: record.type || "N/R",
          fullLabel: this.$t("finances.fields.type"),
          fullValue: record.type || this.$t("finances.notRecorded"),
          icon: "mdi-cash",
          color: "indigo-darken-2",
        },
        {
          label: this.$t("finances.fields.method"),
          value: this.truncateText(record.method) || "N/R",
          fullLabel: this.$t("finances.fields.method"),
          fullValue: record.method || this.$t("finances.notRecorded"),
          icon: "mdi-credit-card",
          color: "green-darken-2",
        },
      ].filter((item) => item.value !== "N/R");
    },

    truncateText(text, length = 15) {
      if (!text) return null;
      return text.length > length ? text.substring(0, length) + "..." : text;
    },

    imagenDisponible() {
      if (this.imgedit !== undefined && this.imgedit !== "") {
        let img = new Image();
        img.src = this.imgedit;
        return true;
      }
      return false;
    },

    onFileSelected(event) {
      this.imgMiniatura = "";
      let file = event.target.files[0];
      const maxSize = 500 * 1024; // 500 KB en bytes
      
      if (file && file.size > maxSize) {
        this.valid = false;
        this.showAlert("warning", "El archivo de imagen debe ser de máximo 500 KB", 3000);
        return;
      }

      const mimeType = file.type;
      const extension = file.name.split(".").pop().toLowerCase();
      const imageExtensions = ["jpg", "jpeg", "png", "gif"];

      if ((mimeType.startsWith("image/") || imageExtensions.includes(extension)) && 
          imageExtensions.includes(extension)) {
        this.cargarImage(file);
        this.showImage = true;
      } else {
        this.showImage = false;
        this.icono = "mdi-file";
      }

      this.valid = true;
      this.editedItem.image = file;
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
}

.date-text {
  font-size: 0.75rem; /* Equivale a text-caption */
  line-height: 1.1;
  font-weight: 500;
  text-align: center;
  word-break: break-word;
  white-space: normal;
}
.text-truncate-3-lines {
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
  text-overflow: ellipsis;
  line-height: 1.4;
  max-height: 4.2em;
}

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

.v-chip {
  margin-right: 4px;
  margin-bottom: 4px;
}

.v-timeline-item {
  padding-bottom: 16px;
}

.v-text-field,
.v-select,
.v-textarea {
  margin-bottom: 12px;
}

.v-btn--icon {
  transition: all 0.2s ease;
}

.v-btn--icon:hover {
  transform: scale(1.1);
}
</style>