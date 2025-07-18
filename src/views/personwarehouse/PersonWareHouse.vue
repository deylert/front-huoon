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
  <v-card elevation="6" class="mx-2">
    <v-toolbar color="#03626C">
      <v-row align="center">
        <v-col cols="12" md="8" class="grow ml-4">
          <span class="text-subtitle-1"
            ><strong
              ><h2>{{ $t("warehouse.list.title") }}</h2></strong
            ></span
          >
        </v-col>
        <v-col cols="12" md="3" class="text-right">
          <v-btn
            class="text-subtitle-1 ml-12"
            color="white"
            variant="tonal"
            elevation="2"
            prepend-icon="mdi-plus-circle"
            @click="showAddWareHouse"
          >
            {{ $t('warehouse.formTitle.create') }}
          </v-btn>
        </v-col>
      </v-row>
    </v-toolbar>

    <v-card-text>
      <v-text-field
        class="mt-1 mb-1"
        v-model="search"
        append-icon="mdi-magnify"
        :label="$t('warehouse.list.search')"
        single-line
        hide-details
      >
      </v-text-field>
      <v-data-table
        :headers="translatedHeaders"
        :search="search"
        :items="personwarehouses"
        class="elevation-1"
        style="max-height: 68vh; overflow-y: auto"
        :loading="loading"
        dense
      >
        <template v-slot:item.actions="{ item }">
          <v-btn
            density="comfortable"
            icon="mdi-pencil"
            @click="editItem(item)"
            color="primary"
            variant="tonal"
            elevation="1"
            title="Editar Almacén"
          ></v-btn>
          <v-btn
            density="comfortable"
            icon="mdi-delete"
            @click="deleteItem(item)"
            color="#DA7171"
            variant="tonal"
            elevation="1"
            title="Eliminar Almacén"
          ></v-btn>
        </template>
        <template v-slot:item.status="{ item }">
          {{
            item.status === 0
              ? $t("warehouse.status.public")
              : $t("warehouse.status.private")
          }}
        </template>
      </v-data-table>
    </v-card-text>
  </v-card>
  </v-container>

  <!--<v-dialog v-model="dialog" max-width="600px">
        <v-form ref="form" v-model="valid">
            <v-card>
                <v-toolbar color="#03626C">
                    <span class="text-subtitle-2 ml-4">{{ formTitle }}</span>
                </v-toolbar>
                <v-card-text>
                    <v-container>
                        <v-row>
                            <v-col cols="12" md="6" v-show="editedIndex === -1">
                                <v-autocomplete v-model="editedItem.warehouse_id" :items="warehouses" label="Almacenes"
                                    prepend-icon="mdi-store-outline" item-title="title" item-value="id"
                                    variant="underlined" clearable>
                                    <template v-slot:item="{ props, item }">
                                        <v-list-item v-bind="props">
                                            <v-list-item-subtitle class="d-flex flex-column">
                                                <v-tooltip location="top right">
                                                    <template v-slot:activator="{ props }">
                                                        <div class="description-text" v-bind="props"
                                                            :title="item.raw.description">
                                                            Descripción: {{ item.raw.description }}
                                                        </div>
                                                    </template>
                                                    <span>{{ item.raw.description }}</span>
                                                </v-tooltip>
                                                <v-tooltip location="top right">
                                                    <template v-slot:activator="{ props }">
                                                        <div class="description-text" v-bind="props"
                                                            :title="item.raw.location">
                                                            Ubicación: {{ item.raw.location }}
                                                        </div>
                                                    </template>
                                                    <span>{{ item.raw.location }}</span>
                                                </v-tooltip>
                                            </v-list-item-subtitle>
                                        </v-list-item>
                                    </template>
                                </v-autocomplete>
                            </v-col>
                            <v-col cols="12" md="6">
                                <v-text-field v-model="editedItem.title" clearable label="Nombre"
                                    prepend-icon="mdi-tag-outline" variant="underlined"
                                    :rules="nameRules"></v-text-field>
                            </v-col>
                            <v-col cols="12" md="6">
                                <v-text-field v-model="editedItem.location" clearable label="Ubicación en la casa"
                                    prepend-icon="mdi-home-map-marker" variant="underlined">
                                </v-text-field>
                            </v-col>
                            <v-col cols="12" md="6">
                                <v-select v-model="editedItem.status" :items="[
                                    { id: 0, label: 'Público' },
                                    { id: 1, label: 'Privado' }
                                ]" item-title="label" item-value="id" label="Estado" prepend-icon="mdi-lock-outline"
                                    variant="underlined">
                                </v-select>
                            </v-col>
                            <v-col cols="12" md="12">
                                <v-textarea v-model="editedItem.description" clearable label="Descripción"
                                    prepend-icon="mdi-note" variant="underlined"></v-textarea>
                            </v-col>
                        </v-row>
                    </v-container>
                </v-card-text>
                <v-divider></v-divider>
                <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn color="#DA7171" variant="flat" @click="close">Cancelar</v-btn>
                    <v-btn color="#03626C" variant="flat" :loading="loading" @click="save"
                        :disabled="!valid">Aceptar</v-btn>
                </v-card-actions>
            </v-card>
        </v-form>
    </v-dialog>-->
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
            {{ $t("warehouse.formInstructions") }}
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
                  <v-autocomplete
                    v-model="editedItem.warehouse_id"
                    :items="warehouses"
                    :label="$t('warehouse.fields.warehouse')"
                    item-title="title"
                    item-value="id"
                    variant="underlined"
                  >
                    <template v-slot:item="{ props, item }">
                      <v-list-item v-bind="props">
                        <v-list-item-subtitle class="d-flex flex-column">
                          <v-tooltip location="top right">
                            <template v-slot:activator="{ props }">
                              <div
                                class="description-text"
                                v-bind="props"
                                :title="item.raw.description"
                              >
                                {{ $t("warehouse.fields.description") }}:
                                {{ item.raw.description }}
                              </div>
                            </template>
                            <span>{{ item.raw.description }}</span>
                          </v-tooltip>
                          <v-tooltip location="top right">
                            <template v-slot:activator="{ props }">
                              <div
                                class="description-text"
                                v-bind="props"
                                :title="item.raw.location"
                              >
                                {{ $t("warehouse.fields.location") }}:
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
                  <v-text-field
                    v-model="editedItem.title"
                    clearable
                    :label="$t('warehouse.fields.name')"
                    variant="underlined"
                    :rules="nameRules"
                  ></v-text-field>
                </v-col>

                <v-col cols="12" md="12">
                  <v-text-field
                    v-model="editedItem.location"
                    clearable
                    :label="$t('warehouse.fields.home_location')"
                    variant="underlined"
                    :rules="locationRules"
                  ></v-text-field>
                </v-col>
              </v-row>

              <!-- Paso 2: Configuración adicional -->
              <v-row dense v-if="step === 1">
                <v-col cols="12" md="6">
                  <v-select
                    v-model="editedItem.status"
                    :items="[
                      { id: 0, label: $t('warehouse.status.public') },
                      { id: 1, label: $t('warehouse.status.private') },
                    ]"
                    item-title="label"
                    item-value="id"
                    :label="$t('warehouse.fields.status')"
                    variant="underlined"
                    :rules="statusRules"
                  ></v-select>
                </v-col>

                <v-col cols="12" md="12">
                  <v-textarea
                    v-model="editedItem.description"
                    clearable
                    :label="$t('warehouse.fields.description')"
                    variant="underlined"
                    :rules="descriptionRules"
                  ></v-textarea>
                </v-col>
              </v-row>

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
        <span class="text-subtitle-2 ml-4"> <span class="text-subtitle-2 ml-4"> {{ $t('deleteDialog.title', { item: $t(`deleteDialog.items.warehouse`) }) }}</span></span>
      </v-toolbar>
      <v-card-text class="mt-2 mb-2">  {{ $t('deleteDialog.message') }}</v-card-text>
      <v-divider></v-divider>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn color="#DA7171" variant="flat" @click="closeDelete">{{ $t('taskForm.buttons.cancel') }}</v-btn>
        <v-btn
          color="#03626C"
          variant="flat"
          :loading="loading"
          @click="deleteItemConfirm"
          >{{ $t('taskForm.buttons.confirmDelete') }}</v-btn
        >
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
import LocalStorageService from "@/LocalStorageService";
import { handleRequest } from "@/utils/api"; // Ruta al archivo
export default {
  data: () => ({
    snackbar: false,
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
        } else {
          // Si no hay datos, asignamos un array vacío
          this.personwarehouses = [];
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
    editItem(item) {
      this.editedIndex = 1;
      this.originalItem = Object.assign({}, item);
      this.editedItem = Object.assign({}, item);
      this.dialog = true;
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
