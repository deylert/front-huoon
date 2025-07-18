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
      <h2 class="text-h5 font-weight-bold">{{ $t("viewTitles.budget") }}</h2>
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
    <template v-if="budgets.length > 0">
      <!-- Tarjetas de presupuestos -->
      <v-card
        v-for="(budget, index) in budgets"
        :key="index"
        class="mb-3 rounded-lg"
        elevation="2"
      >
        <v-row no-gutters class="ma-0">
          <!-- Barra lateral con fecha -->
          <v-col cols="1" class="py-2 d-flex flex-column align-center justify-center">
            <div class="date white--text font-weight-bold text-body-2 text-center">
              {{ formatDate(budget.start_date) }}
            </div>
          </v-col>

          <!-- Contenido principal -->
          <v-col cols="10" class="d-flex align-center pe-2 gap-2 py-2">
            <v-row align="center" justify="space-between" no-gutters>
              <div>
                <!-- Datos principales -->
                <div class="d-flex flex-wrap align-center gap-2 mb-2">
                <v-tooltip bottom>
              <template v-slot:activator="{ props }">
                <v-chip
                  v-bind="props"
                  size="small"
                  color="primary"
                  class="mr-1"
                  text-color="white"
                >
                  <v-icon start size="small" icon="mdi-tag" color="white"></v-icon>
                  <span class="text-body-2">
                    {{ $t('budget.fields.category') }}: {{ budget.categoryName }}
                  </span>
                </v-chip>
              </template>
              <span>{{ $t('budget.fields.category') }}: {{ budget.categoryName }}</span>
            </v-tooltip>
                  <v-tooltip
                    v-for="(item, i) in compactBudgetData(budget)"
                    :key="i"
                    bottom
                  >
                    <template v-slot:activator="{ props }">
                      <v-chip
                        v-bind="props"
                        size="small"
                        :color="item.color"
                        class="mr-1"
                        text-color="white"
                      >
                        <v-icon
                          start
                          size="small"
                          :icon="item.icon"
                          color="white"
                        ></v-icon>
                        <span class="text-body-2"
                          >{{ item.label }}: {{ item.value }}</span
                        >
                      </v-chip>
                    </template>
                    <span
                      >{{ item.fullLabel || item.label }}:
                      {{ item.fullValue || item.value }}</span
                    >
                  </v-tooltip>
                </div>

                <!-- Sección de Detalles -->
                <div class="mt-2">
                  <div class="text-caption font-weight-bold text-grey-darken-2 mb-1">
                    {{ $t("budget.fields.description") }}:
                  </div>
                  <div class="d-flex flex-wrap gap-1">
                    <v-tooltip
                      v-for="(detail, i) in compactDetails(budget)"
                      :key="'detail' + i"
                      bottom
                    >
                      <template v-slot:activator="{ props }">
                        <v-chip
                          v-bind="props"
                          size="small"
                          variant="outlined"
                          :color="detail.color"
                          class="mr-1"
                        >
                          <v-icon left size="small" :icon="detail.icon"></v-icon>
                          <span class="text-body-2">{{ detail.label }}</span>
                          <span class="ml-1 text-body-2">- {{ detail.text }}</span>
                        </v-chip>
                      </template>
                      <span>{{ detail.fullLabel }}: {{ detail.fullText }}</span>
                    </v-tooltip>
                  </div>
                </div>
              </div>
            </v-row>
          </v-col>

          <!-- Acciones -->
          <v-col cols="1" class="d-flex align-center pe-4 gap-2">
            <v-btn
              icon
              variant="text"
              color="green-darken-2"
              size="small"
              @click="editItem(budget)"
            >
              <v-icon>mdi-pencil</v-icon>
            </v-btn>
            <v-btn
              icon
              variant="text"
              color="red-darken-2"
              size="small"
              @click="deleteItem(budget)"
            >
              <v-icon>mdi-close</v-icon>
            </v-btn>
          </v-col>
        </v-row>
      </v-card>
    </template>
    <template v-else>
      <v-col cols="12" class="text-center py-8 pa-0">
        <v-icon size="64" color="grey-lighten-1">mdi-wallet-outline</v-icon>
        <div class="text-h6 text-grey mt-4">
          {{ $t("budget.noRecords") }}
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
            {{ $t("budget.formInstructions") }}
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
                      <strong>{{ $t(`budget.steps.${s.title}.title`) }}</strong>
                      <div class="text-caption text-grey">
                        {{ $t(`budget.steps.${s.title}.subtitle`) }}
                      </div>
                    </div>
                  </template>
                </v-timeline-item>
              </v-timeline>
            </v-col>

            <!-- Contenido dinámico según paso -->
            <v-col cols="9">
              <h3 class="text-deep-purple-accent-3 mb-8">
                {{ $t(`budget.steps.${steps[step].title}.title`) }}
              </h3>

              <!-- Paso 1: Información básica -->
              <v-row dense v-if="step === 0">
                <v-col cols="12" md="6">
                  <v-autocomplete
                    v-model="editedItem.category_id"
                    :items="categories"
                    :label="$t('budget.fields.category')"
                    item-title="nameCategory"
                    item-value="id"
                    variant="underlined"
                    :rules="selectRules"
                  >
                    <template v-slot:item="{ props, item }">
                      <v-list-item v-bind="props">
                        <template v-slot:prepend>
                          <v-avatar size="24">
                            <!-- Verifica si es URL o ícono -->
                            <template v-if="isImage(item.raw.iconCategory)">
                              <img
                                :src="`${this.$axios.defaults.baseURL}images/${
                                  item.raw.iconCategory
                                }?t=${Date.now()}`"
                                alt="icon"
                              />
                            </template>
                            <template v-else>
                              <v-icon>{{ getIconName(item.raw.iconCategory) }}</v-icon>
                            </template>
                          </v-avatar>
                        </template>
                        <v-list-item-subtitle class="d-flex flex-column">
                          <div>Descripción: {{ item.raw.descriptionCategory }}</div>
                        </v-list-item-subtitle>
                      </v-list-item>
                    </template>
                  </v-autocomplete>
                </v-col>

                <v-col cols="12" sm="6">
                  <v-autocomplete
                    v-model="editedItem.budget_type"
                    :items="types"
                    :label="$t('budget.fields.budget_type')"
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
                    v-model="editedItem.amount"
                    :label="$t('budget.fields.amount')"
                    variant="underlined"
                    type="number"
                    step="0.01"
                    min="0"
                    :rules="amountRules"
                  />
                </v-col>

                <v-col cols="12" sm="6">
                  <v-select
                    v-model="editedItem.currency"
                    :label="$t('budget.fields.currency')"
                    :items="[
                      { title: $t('budget.currencies.USD'), value: 'USD' },
                      { title: $t('budget.currencies.EUR'), value: 'EUR' },
                      { title: $t('budget.currencies.BRL'), value: 'BRL' },
                      { title: $t('budget.currencies.MXN'), value: 'MXN' },
                      { title: $t('budget.currencies.COP'), value: 'COP' },
                    ]"
                    variant="underlined"
                    :rules="currencyRules"
                  />
                </v-col>
              </v-row>

              <!-- Step 2: Fechas y detalles -->
              <v-row dense v-if="step === 1">
                <v-col cols="12" sm="6">
                  <v-menu
                    v-model="startDateMenu"
                    :close-on-content-click="false"
                    :nudge-right="40"
                    transition="scale-transition"
                    offset-y
                    min-width="290px"
                  >
                    <template v-slot:activator="{ props }">
                      <v-text-field
                        v-bind="props"
                        :modelValue="startDateFormatted"
                        variant="underlined"
                        :label="$t('budget.fields.start_date')"
                      ></v-text-field>
                    </template>
                    <v-locale-provider>
                      <v-date-picker
                        color="#03626C"
                        :modelValue="startDateInput"
                        @update:model-value="updateStartDate"
                        format="yyyy-MM-dd"
                      ></v-date-picker>
                    </v-locale-provider>
                  </v-menu>
                </v-col>

                <v-col cols="12" sm="6">
                  <v-menu
                    v-model="endDateMenu"
                    :close-on-content-click="false"
                    :nudge-right="40"
                    transition="scale-transition"
                    offset-y
                    min-width="290px"
                  >
                    <template v-slot:activator="{ props }">
                      <v-text-field
                        v-bind="props"
                        :modelValue="endDateFormatted"
                        variant="underlined"
                        :label="$t('budget.fields.end_date')"
                      ></v-text-field>
                    </template>
                    <v-locale-provider>
                      <v-date-picker
                        color="#03626C"
                        :modelValue="endDateInput"
                        @update:model-value="updateEndDate"
                        format="yyyy-MM-dd"
                      ></v-date-picker>
                    </v-locale-provider>
                  </v-menu>
                </v-col>

                <v-col cols="12">
                  <v-textarea
                    v-model="editedItem.description"
                    :label="$t('budget.fields.description')"
                    variant="underlined"
                    rows="3"
                    auto-grow
                  />
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
          {{ $t("deleteDialog.title", { item: $t(`deleteDialog.items.budget`) }) }}</span
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
        title: "basic",
        subtitle: "basic_information",
      },
      {
        title: "dates",
        subtitle: "dates_and_details",
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
    dialog: false,
    dialogDelete: false,
    budgets: [],
    types: [],
    categories: [],
    //budgetTypes: ["Mensual", "Trimestral", "Semestral", "Anual", "Personalizado"],
    currencies: ["USD", "EUR", "COP", "MXN", "Otro"],
    startDateMenu: false,
    endDateMenu: false,
    startDateInput: null,
    endDateInput: null,
    home_id: "",
    editedItem: {
      id: "",
      category_id: null,
      amount: null,
      used_amount: 0,
      start_date: null,
      end_date: null,
      budget_type: "",
      status: "",
      description: "",
      currency: "",
    },

    defaultItem: {
      id: "",
      category_id: null,
      amount: null,
      used_amount: 0,
      start_date: null,
      end_date: null,
      budget_type: "",
      status: "",
      description: "",
      currency: "",
    },

    editedIndex: -1,
    search: "",
    selectRules: [(v) => !!v || "Seleccionar al menos un elemento"],
    amountRules: [
      (v) => !!v || "El monto es requerido",
      (v) => (v && v > 0) || "El monto debe ser positivo",
    ],
  currencyRules: [
  v => !!v || 'La moneda es requerida',
],
    usedAmountRules: [(v) => !v || v >= 0 || "El monto utilizado no puede ser negativo"],
    descriptionRules: [
      (v) =>
        !v ||
        v.length <= 200 ||
        this.$t("budget.validationMessages.description.maxLength"),
    ],
  }),

  computed: {
    formTitle() {
      return this.editedIndex === -1
        ? this.$t("budget.titles.new")
        : this.$t("budget.titles.edit");
    },
    startDateFormatted() {
      const date = this.startDateInput ? new Date(this.startDateInput) : new Date();
      const day = date.getDate().toString().padStart(2, "0");
      const month = (date.getMonth() + 1).toString().padStart(2, "0");
      const year = date.getFullYear();
      return `${year}-${month}-${day}`;
    },
    endDateFormatted() {
      if (!this.endDateInput) return "";
      const date = new Date(this.endDateInput);
      const day = date.getDate().toString().padStart(2, "0");
      const month = (date.getMonth() + 1).toString().padStart(2, "0");
      const year = date.getFullYear();
      return `${year}-${month}-${day}`;
    },
    paginatedBudgets() {
      if (!Array.isArray(this.budgets)) return [];
      const start = (this.currentPage - 1) * this.itemsPerPage;
      const end = start + this.itemsPerPage;
      return this.budgets.slice(start, end);
    },
    pageCount() {
      return this.budgets?.length
        ? Math.ceil(this.budgets.length / this.itemsPerPage)
        : 0;
    },
    typeRules() {
      return [
        (v) => !!v || this.$t("budget.validationMessages.category.required"), // Validación de requerido
        /*(v) =>
          !v || v.length <= 50 || this.$t("finances.validationMessages.type.maxLength"), // Validación de longitud máxima*/
      ];
    },
  },

  mounted() {
    this.home_id = JSON.parse(LocalStorageService.getItem("home_id"));
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
    formatDate(dateString) {
      if (!dateString) return "N/R";
      const [year, month, day] = dateString.split("-");
      return `${day}-${month}-${year}`;
    },

    updateStartDate(val) {
      this.startDateInput = val;
      this.editedItem.start_date = this.startDateFormatted;
      this.startDateMenu = false;
    },

    updateEndDate(val) {
      this.endDateInput = val;
      this.editedItem.end_date = this.endDateFormatted;
      this.endDateMenu = false;
    },

    async showAdd() {
      this.editedIndex = -1;
      try {
        const result = await handleRequest({
          endpoint: "category-budgets",
          method: "POST",
        });

        if (result.success) {
          this.categories = result.data.categories || [];
          this.types = result.data.types || [];
        } else {
          this.categories = [];
          this.types = [];
        }
      } catch (error) {
        this.showAlert(
          "error",
          "Ocurrió un error inesperado al cargar las categorías.",
          3000
        );
      } finally {
        this.dialog = true;
      }
    },

    close() {
      this.step = 0;
      this.dialog = false;
      this.$nextTick(() => {
        this.editedItem = Object.assign({}, this.defaultItem);
        this.originalItem = Object.assign({}, this.defaultItem);
      });
      this.editedIndex = -1;
    },

    async initialize() {
      try {
        this.data = {};
        this.data.home_id = this.home_id;
        this.loading = true;
        const result = await handleRequest({
          endpoint: "get-budget-person",
          method: "POST",
          data: this.data
        });

        if (result.success) {
          this.budgets = result.data.budgets || [];
        } else {
          this.budgets = [];
        }
      } catch (error) {
        this.loading = false;
        this.showAlert(
          "error",
          "Ocurrió un error inesperado al cargar los presupuestos.",
          3000
        );
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
        // Crear nuevo presupuesto
        const fieldsToUpdate = [
          "category_id",
          "amount",
          "used_amount",
          "start_date",
          "end_date",
          "budget_type",
          "status",
          "description",
          "currency",
        ];

        let updatedFields = Object.keys(this.editedItem)
          .filter(
            (key) =>
              fieldsToUpdate.includes(key) &&
              this.editedItem[key] !== this.defaultItem[key]
          )
          .reduce((obj, key) => {
            obj[key] = this.editedItem[key];
            return obj;
          }, {});

        updatedFields.home_id = this.home_id;

        if (Object.keys(updatedFields).length > 0) {
          try {
            const result = await handleRequest({
              endpoint: "budget",
              method: "POST",
              data: updatedFields,
            });

            if (result.success) {
              this.showAlert("success", result.message, 3000);
              this.initialize();
            } else {
              this.showAlert("warning", result.message, 3000);
            }
          } catch (error) {
            this.showAlert("error", "Ocurrió un error al guardar el presupuesto", 3000);
          }
        }
      } else {
        // Actualizar presupuesto existente
        const fieldsToUpdate = [
          "category_id",
          "amount",
          "used_amount",
          "start_date",
          "end_date",
          "budget_type",
          "status",
          "description",
          "currency",
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
          updatedFields.id = this.editedItem.id;
          try {
            const result = await handleRequest({
              endpoint: "budget-update",
              method: "POST",
              data: updatedFields,
            });

            if (result.success) {
              this.showAlert("success", result.message, 3000);
              this.initialize();
            } else {
              this.showAlert("warning", result.message, 3000);
            }
          } catch (error) {
            this.showAlert(
              "error",
              "Ocurrió un error al actualizar el presupuesto",
              3000
            );
          }
        }
      }
      this.loading = false;
      this.close();
    },

    async editItem(item) {
      this.editedIndex = 1;
      this.editedItem = Object.assign({}, this.originalItem);
      this.originalItem = Object.assign({}, item);
      this.editedItem = Object.assign({}, item);
      this.startDateInput = item.start_date;
      this.endDateInput = item.end_date;

      try {
        const result = await handleRequest({
          endpoint: "category-budgets",
          method: "POST",
        });

        if (result.success) {
          this.categories = result.data.categories || [];
          this.types = result.data.types || [];
        } else {
          this.categories = [];
          this.types = [];
        }
      } catch (error) {
        this.showAlert(
          "error",
          "Ocurrió un error inesperado al cargar las categorías.",
          3000
        );
      } finally {
        this.dialog = true;
      }
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
        this.originalItem = Object.assign({}, this.defaultItem);
      });
    },

    async deleteItemConfirm() {
      this.loading = true;
      try {
        let request = {
          id: this.editedItem.id,
        };
        const result = await handleRequest({
          endpoint: "delete-budget",
          method: "POST",
          data: request,
        });

        if (result.success) {
          this.showAlert("success", result.message, 3000);
          this.initialize();
        } else {
          this.showAlert("warning", result.message, 3000);
        }
      } catch (error) {
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

    compactBudgetData(budget) {
      return [
        {
          label: this.$t("budget.fields.category"),
          value: budget.category_name || "N/R",
          fullLabel: this.$t("budget.fields.category"),
          fullValue: budget.category_name || this.$t("budget.notRecorded"),
          icon: "mdi-tag",
          color: "indigo-darken-2",
        },
        {
          label: this.$t("budget.fields.amount"),
          value: `${budget.amount} ${budget.currency || ""}` || "N/R",
          fullLabel: this.$t("budget.fields.amount"),
          fullValue:
            `${budget.amount} ${budget.currency || ""}` || this.$t("budget.notRecorded"),
          icon: "mdi-cash",
          color: "green-darken-2",
        },
        {
          label: this.$t("budget.fields.used_amount"),
          value: `${budget.used_amount} ${budget.currency || ""}` || "N/R",
          fullLabel: this.$t("budget.fields.used_amount"),
          fullValue:
            `${budget.used_amount} ${budget.currency || ""}` ||
            this.$t("budget.notRecorded"),
          icon: "mdi-cash-minus",
          color: "red-darken-2",
        },
        {
          label: this.$t("budget.fields.budget_type"),
          value: budget.budget_type || "N/R",
          fullLabel: this.$t("budget.fields.budget_type"),
          fullValue: budget.budget_type || this.$t("budget.notRecorded"),
          icon: "mdi-calendar",
          color: "orange-darken-2",
        },
      ].filter((item) => item.value !== "N/R");
    },

    compactDetails(budget) {
      return [
        {
          label: this.$t("budget.fields.description"),
          text: this.truncateText(budget.description) || "-",
          fullLabel: this.$t("budget.fields.description"),
          fullText: budget.description || this.$t("budget.notRecorded"),
          icon: "mdi-information",
          color: "teal-darken-1",
        },
        {
          label: this.$t("budget.fields.status"),
          text: budget.status || "-",
          fullLabel: this.$t("budget.fields.status"),
          fullText: budget.status || this.$t("budget.notRecorded"),
          icon: "mdi-check-circle",
          color: "blue-darken-1",
        },
      ].filter((detail) => detail.text !== "-");
    },

    truncateText(text, length = 15) {
      if (!text) return null;
      return text.length > length ? text.substring(0, length) + "..." : text;
    },
  },
};
</script>

<style scoped>
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
