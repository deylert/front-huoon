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
           <h2 class="text-body-2 font-weight-bold">{{ $t("dewormings.listing.title") }}</h2>
          <v-btn icon color="deep-purple-accent-4" variant="flat" class="elevation-3" @click="showAdd" :title=" this.$t('dewormings.listing.addButton')">
            <v-icon>mdi-plus</v-icon>
          </v-btn>
          </v-col>
        </v-row>
      <template v-if="treatments.length > 0">
              <v-card v-for="(treatment, index) in treatments" :key="index" class="mb-4 rounded-lg pa-2"
                density="comfortable" elevation="2">
                <v-row>
                  <!-- Barra lateral de color e info -->
                  <v-col cols="1" class="d-flex justify-start ">
                    <div class="icono-concavo d-flex flex-column justify-center justify-start"
                      :class="`bg-${getTypeColor(treatment.type)}`">
                      <div class="date-display">
                        {{ formatIntuitiveDate(treatment.date) }}
                      </div>
                    </div>
                  </v-col>
                  <v-col cols="2" class="d-flex align-center justify-start">
                    <v-row align="center" class="gap-3">
                      <div>
                        <div class="font-weight-bold text-body-2">
                          {{ treatment.name }}
                        </div>
                      </div>
                    </v-row>
                  </v-col>
                  <v-col cols="1" class="d-flex align-center justify-start text-truncate">
                    <div>
                      <span class="text-body-2">
                        {{ treatment.dosage }}</span>
                      <v-tooltip activator="parent" location="bottom" max-width="350px">
                        <span style="white-space: normal; word-break: break-word">
                          {{ $t("dewormings.fields.dosage") }}: {{ treatment.dosage }}
                        </span>
                      </v-tooltip>
                    </div>
                  </v-col>
                  <v-col cols="1" class="d-flex align-center justify-start text-truncate">
                    <div>
                      <span class="text-body-2">
                        {{ treatment.unit }}</span>
                      <v-tooltip activator="parent" location="bottom" max-width="350px">
                        <span style="white-space: normal; word-break: break-word">
                          {{ $t("dewormings.fields.unit") }}: {{ treatment.unit }}
                        </span>
                      </v-tooltip>
                    </div>
                  </v-col>
                  <v-col cols="4" class="d-flex align-center justify-start">
                    <div class="text-truncate" style="max-width: 100%">
                      <span class="text-body-2 text-truncate d-inline-block" style="max-width: 100%">
                        {{ treatment.notes }}
                      </span>
                      <v-tooltip activator="parent" location="bottom" max-width="350px">
                        <span style="white-space: normal; word-break: break-word">
                          {{ $t("dewormings.fields.notes") }}: {{ treatment.notes }}
                        </span>
                      </v-tooltip>
                    </div>
                  </v-col>
                  <v-col cols="2" class="d-flex align-center justify-start text-truncate">
                    <div>
                      <span class="text-body-2">
                        {{ formatIntuitiveDate(treatment.next_date) }}</span>
                      <v-tooltip activator="parent" location="bottom" max-width="350px">
                        <span style="white-space: normal; word-break: break-word">
                          {{ $t("dewormings.fields.next_date") }}: {{ treatment.next_date }}
                        </span>
                      </v-tooltip>
                    </div>
                  </v-col>
                  <v-col cols="1" class="d-flex align-center ml-auto pe-4" style="margin-left: auto !important">
                    <v-btn icon variant="text" color="green-darken-2" size="small" @click="editItem(treatment)">
                      <v-icon>mdi-pencil</v-icon>
                    </v-btn>
                    <v-btn icon variant="text" color="red-darken-2" size="small" @click="deleteItem(treatment)">
                      <v-icon>mdi-delete</v-icon>
                    </v-btn>
                  </v-col>
                </v-row>
              </v-card>
             </template>
            <template v-else>
              <v-col cols="12" class="text-center py-8">
                {{ $t("dewormings.listing.noData") }}
              </v-col>
            </template>
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
          {{ $t(`dewormings.formTitle.${editedIndex === -1 ? "create" : "edit"}`) }}
        </h5>
        <p class="text-grey-lighten-1">{{ $t("dewormings.formInstructions") }}</p>

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
                    <strong>{{ $t(`dewormings.steps.${s.key}.title`) }}</strong>
                    <div class="text-caption text-grey">
                      {{ $t(`dewormings.steps.${s.key}.subtitle`) }}
                    </div>
                  </div>
                </template>
              </v-timeline-item>
            </v-timeline>
          </v-col>

          <!-- Contenido dinámico según paso -->
          <v-col cols="9">
            <h3 class="text-deep-purple-accent-3 mb-8">
              {{ $t(`dewormings.steps.${steps[step].key}.title`) }}
            </h3>

            <!-- Paso 1: Información básica -->
            <v-row dense v-if="step === 0">
              <v-col cols="12" md="12">
                <v-text-field
                  v-model="editedItem.name"
                  :label="$t('dewormings.fields.name')"
                  variant="underlined"
                  :rules="[
                    (v) =>
                      !!v ||
                      $t('dewormings.validation.required', {
                        field: $t('dewormings.fields.name'),
                      }),
                  ]"
                ></v-text-field>
              </v-col>
              
              <v-col cols="12">
                <v-textarea
                  v-model="editedItem.notes"
                  :label="$t('dewormings.fields.notes')"
                  variant="underlined"
                  rows="3"
                ></v-textarea>
              </v-col>
            </v-row>

            <!-- Paso 2: Detalles adicionales -->
            <v-row dense v-if="step === 1">
            <v-col cols="12" md="6">
                <v-text-field
                  v-model="editedItem.dosage"
                  :label="$t('dewormings.fields.dosage')"
                  variant="underlined"
                  type="number"
                  :rules="[
                    (v) =>
                      !!v ||
                      $t('dewormings.validation.required', {
                        field: $t('dewormings.fields.dosage'),
                      }),
                  ]"
                ></v-text-field>
              </v-col>

              <v-col cols="12" md="6">
                <v-select
                  v-model="editedItem.unit"
                  :items="units"
                  :label="$t('dewormings.fields.unit')"
                  variant="underlined"
                  :rules="[
                    (v) =>
                      !!v ||
                      $t('dewormings.validation.required', {
                        field: $t('dewormings.fields.unit'),
                      }),
                  ]"
                ></v-select>
              </v-col>
            <v-col cols="12" md="6">
                <v-locale-provider>
                  <v-menu v-model="menu" :close-on-content-click="false" offset-y min-width="auto" transition="scale-transition" location="end">
                    <template v-slot:activator="{ props }">
                      <v-text-field v-bind="props" :modelValue="this.editedItem.date" variant="underlined" :rules="[
                      v => !!v || $t('dewormings.validation.required', { field: $t('dewormings.fields.date') })
                              ]"
                        :label="$t('dewormings.fields.date')" readonly></v-text-field>
                    </template>
                      <v-date-picker color="#03626C" :modelValue="parseDateString(this.editedItem.date)" @update:model-value="updateDate"
                        format="yyyy-MM-dd"></v-date-picker>
                  </v-menu>
                    </v-locale-provider>
              </v-col>
              <v-col cols="12" md="6">
                <v-locale-provider>
                    <v-menu v-model="menu2" :close-on-content-click="false" offset-y min-width="auto" transition="scale-transition" location="end">
                      <template v-slot:activator="{ props }">
                        <v-text-field v-bind="props" :model-value="this.editedItem.next_date"
                          :label="$t('dewormings.fields.next_date')" variant="underlined" readonly></v-text-field>
                      </template>
                      <v-date-picker :modelValue="parseDateString(this.editedItem.next_date)" @update:model-value="updateDate1"
                        format="yyyy-MM-dd" color="#03626C"
                        :min="editedItem.date"></v-date-picker>
                    </v-menu>
                    </v-locale-provider>
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
                :disabled="!validStep"
              >
                {{
                  step === steps.length - 1 ? $t("buttons.saveAndClose") : $t("buttons.next")
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
      { key: "basic", title: "Información básica", subtitle: "Datos principales de la vacuna" },
      { key: "details", title: "Información adicional", subtitle: "Lote y observaciones" }
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
    loading: false,
    mostrar: false,
    home_id:"",
    dialog: false,
    dialogDelete: false,
    treatments: [],
    data: {},
     units: ["mg", "ml", "g", "gr", "kg", "l"],
    editedItem: {
      id: "",
        type: "deworming",
        name: "",
        dosage: "",
        unit: "",
        date: null,
        next_date: null,
        notes: "",
        pet_id: "",
        home_id: ""
    },
    originalItem: {
      id: "",
        type: "",
        name: "",
        dosage: "",
        unit: "",
        date: null,
        next_date: null,
        notes: "",
        pet_id: "",
        home_id: ""
    },
    defaultItem: {
      id: "",
        type: "deworming",
        name: "",
        dosage: "",
        unit: "",
        date: null,
        next_date: null,
        notes: "",
        pet_id: "",
        home_id: ""
    },
    editedIndex: -1,
    search: "",
    menu: false,
    input: null,
    menu2: false,
    input2: null,
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
        return !!this.editedItem.name;
      case 1:
        return !!this.editedItem.date; // Todos los campos son opcionales en el segundo paso
      default:
        return false;
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
  },
  mounted() {
    this.person_id = JSON.parse(LocalStorageService.getItem("person_id"));
    this.home_id = JSON.parse(LocalStorageService.getItem("home_id"));
    this.initialize();
  },
  methods: {
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
      return colorMap[type] || "secondary";
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
    nextStep() {
      if (this.step < this.steps.length - 1) {
        this.step++;
      } else {
        this.save();
      }
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

      this.editedItem.next_date = this.input2;
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
        this.data.home_id = this.home_id;
        this.data.pet_id = this.pet.id;
        this.data.type = "deworming";
        this.loading = true;
        const result = await handleRequest({
          endpoint: "get-pet-treatments",
          method: "POST",
          data: this.data,
        });

        if (result.success) {
          // Si la solicitud es exitosa, asignamos las sucursales
          this.treatments = result.data?.treatments || [];
          // Filtro 1: donde person_id sea igual a this.person_id y type sea igual a 'Personal'
        } else {
          // Si no hay datos, asignamos un array vacío
          this.treatments = [];
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
        "type",
        "name",
        "date",
        "unit",
        "dosage",
        "next_date",
        "notes",
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

          try {
            const result = await handleRequest({
              endpoint: "pet-treatment",
              method: "POST",
              data: updatedFields,
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
          "type",
        "name",
        "date",
        "unit",
        "dosage",
        "next_date",
        "notes",
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
          updatedFields.id = this.editedItem.id;
          try {
            const result = await handleRequest({
              endpoint: "pet-treatment-update",
              method: "POST",
              data: updatedFields,
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
      this.editedIndex = 1;
      this.step = 0;
      this.originalItem = Object.assign({}, item);
      this.editedItem = Object.assign({}, item);
        this.input = item.date;
      this.input2 = item.next_date;
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
          endpoint: "pet-treatment-destroy",
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
