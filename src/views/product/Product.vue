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
  <v-container>
    <v-card class="pa-4" elevation="4" rounded="lg">
      <v-card-text>
        <v-row justify="space-between" align="center" class="mb-6">
          <!-- Foto del usuario -->
          <v-col cols="1">
            <!-- Contenedor relativo para posicionar elementos absolutos dentro -->
            <div style="position: relative; display: inline-block;">
              <v-avatar size="80" class="me-4" color="grey-lighten-4">
                <v-icon color="error" size="40">mdi-store</v-icon>
              </v-avatar>
              <!-- Botón de edición con estilo mejorado -->
              <v-btn icon variant="text" size="small" color="grey-lighten-4" @click="editWarehouse()" style="
        position: absolute;
        bottom: 10px;
        right: 10px;
      ">
                <v-icon color="primary" size="20">mdi-pencil</v-icon>
              </v-btn>
            </div>
          </v-col>

          <!-- Resto de tu código permanece igual -->
          <v-col cols="10">
            <div class="text-h6 font-weight-bold mb-1">{{ warehouseData.title }}</div>
            <div class="text-body-2 text-grey-darken-1 text-truncate">
              {{warehouseData.description }}
              <v-tooltip activator="parent" location="buttom" max-width="350px">
                <span class="d-inline-block" style="white-space: normal; word-break: break-word; width: 100%">
                  {{ $t("warehouse.fields.description") }}: {{ warehouseData.description }}
                </span>
              </v-tooltip>
            </div>
            <div class="text-body-2 text-grey-darken-1 text-truncated">
                  {{ warehouseData.productCount }}
                  <v-tooltip activator="parent" location="bottom" max-width="350px">
                   <span style="white-space: normal; word-break: break-word">
                    {{ $t("product.fields.quantity") }}: {{ warehouseData.productCount }}
                    </span>
                  </v-tooltip>
                </div>
          </v-col>
          <v-col cols="1">
            <v-btn icon color="deep-purple-accent-4" variant="flat" class="elevation-3" @click="showAddProduct"
              :loading="loadingProduct">
              <v-icon>mdi-plus</v-icon>
            </v-btn>
          </v-col>
          <v-col cols="12">
            <h2 class="text-body-2 font-weight-bold">
              {{ $t('product.listing.title') }}
            </h2>
          </v-col>
          <!-- Productos del almacén seleccionado -->
          <v-col cols="12" class="ma-0 pt-6" style="max-height: 60vh; min-height: 40vh; overflow-y: auto">
            <template v-if="paginatedProducts.length > 0">
              <v-card v-for="(product, index) in paginatedProducts" :key="index" class="mb-4 rounded-lg pa-2"
                density="comfortable" elevation="2">
                <v-row no-gutters>
                  <!-- Barra lateral de color e info -->
                  <v-col cols="auto" class="d-flex justify-start mr-4">
                    <div class="icono-concavo d-flex flex-column justify-center align-center rounded-lg"
                      :class="`bg-${getTypeColor(product.nameStatus)}`">
                      <div class="date-display">
                        {{ formatIntuitiveDate(product.purchase_date) }}
                      </div>
                    </div>
                  </v-col>
                   <v-col cols="1" class="d-flex justify-start">
                    <v-dialog max-width="500" class="rounded-lg">
                      <!-- Activator: La imagen que abre el diálogo -->
                      <template v-slot:activator="{ props: activatorProps }">
                        <div 
                          v-bind="activatorProps"
                          class="icono-concavo"
                        >
                          <v-img
                            :src="`${$axios.defaults.baseURL}images/${product.image}`"
                            cover
                            class="img-concava"
                          />
                        </div>
                      </template>

                      <!-- Contenido del diálogo -->
                      <template v-slot:default="{ isActive }">
                        <v-card class="modal-imagen">
                          <v-img
                            :src="`${$axios.defaults.baseURL}images/${product.image}`"
                            max-height="500"
                            contain
                          />
                          <v-card-actions>
                            <v-spacer></v-spacer>
                            <v-btn
                              text="Cerrar"
                              variant="flat"
                              @click="isActive.value = false"
                            ></v-btn>
                          </v-card-actions>
                        </v-card>
                      </template>
                    </v-dialog>
                  </v-col>
                  <v-col cols="3" class="d-flex align-center justify-start">
                    <v-row align="center" class="gap-3">
                      <div>
                        <div class="font-weight-bold text-body-2">
                          {{ product.productName }}
                        </div>
                        <div class="text-body-2 d-flex align-center text-grey-darken-1">
                          {{ product.quantity }}
                          <v-tooltip activator="parent" location="bottom" max-width="350px">
                            <span style="white-space: normal; word-break: break-word">
                              {{ $t("product.fields.quantity") }}: {{ product.quantity }}
                            </span>
                          </v-tooltip>
                        </div>
                        <div class="text-body-2 d-flex align-center text-grey-darken-1">
                          {{ product.total_price }}
                          <v-tooltip activator="parent" location="bottom" max-width="350px">
                            <span style="white-space: normal; word-break: break-word">
                              {{ $t("product.fields.total_price") }}: {{ product.total_price }}
                            </span>
                          </v-tooltip>
                        </div>
                      </div>
                    </v-row>
                  </v-col>
                  <v-col cols="1" class="d-flex align-center justify-start text-truncate">
                    <div>
                      <span class="text-body-2">
                        {{ product.nameCategory }}</span>
                      <v-tooltip activator="parent" location="bottom" max-width="350px">
                        <span style="white-space: normal; word-break: break-word">
                          {{ $t("product.fields.category") }}: {{ product.nameCategory }}
                        </span>
                      </v-tooltip>
                    </div>
                  </v-col>
                  <v-col cols="1" class="d-flex align-center justify-start text-truncate">
                    <div>
                      <span class="text-body-2">
                        {{ product.brand }}</span>
                      <v-tooltip activator="parent" location="bottom" max-width="350px">
                        <span style="white-space: normal; word-break: break-word">
                          {{ $t("product.fields.brand") }}: {{ product.brand }}
                        </span>
                      </v-tooltip>
                    </div>
                  </v-col>
                  <v-col cols="2" class="d-flex align-center justify-start text-truncate">
                    <div>
                      <span class="text-body-2">
                        {{ product.additional_notes }}</span>
                      <v-tooltip activator="parent" location="bottom" max-width="350px">
                        <span style="white-space: normal; word-break: break-word">
                          {{ $t("product.fields.additional_notes") }}: {{ product.additional_notes }}
                        </span>
                      </v-tooltip>
                    </div>
                  </v-col>
                  <v-col cols="2" class="d-flex align-center justify-start text-truncate">
                    <div>
                      <span class="text-body-2 text-truncate">
                        {{ product.purchase_place }}</span>
                      <v-tooltip activator="parent" location="bottom" max-width="350px">
                        <span style="white-space: normal; word-break: break-word">
                          {{ $t("product.fields.purchase_place") }}: {{ product.purchase_place }}
                        </span>
                      </v-tooltip>
                    </div>
                  </v-col>
                  <v-col cols="1" class="d-flex align-center ml-auto pe-4" style="margin-left: auto !important">
                    <v-btn icon variant="text" color="green-darken-2" size="small" @click="editItem(product)">
                      <v-icon>mdi-pencil</v-icon>
                    </v-btn>
                    <v-btn icon variant="text" color="red-darken-2" size="small" @click="deleteItem(product)">
                      <v-icon>mdi-delete</v-icon>
                    </v-btn>
                  </v-col>
                </v-row>
              </v-card>
               </template>
            <template v-else>
              <v-col cols="12" class="text-center py-8">
                {{ $t("product.listing.noProducts") }}
              </v-col>
            </template>

            <!-- Paginación -->
            <v-col cols="12" class="text-center">
              <v-pagination v-model="currentPage" :length="pageCount" :total-visible="5"></v-pagination>
            </v-col>

          </v-col>
        </v-row>
      </v-card-text>
    </v-card>
  </v-container>

  <!-- Crear/Editar Producto -->
  <v-dialog v-model="dialog" fullscreen persistent transition="dialog-bottom-transition"
    content-class="fullscreen-dialog">
    <v-form ref="form" v-model="valid" class="h-100">
      <v-card class="pa-10">
        <v-card-text class="pt-12">
          <!-- Pasos laterales -->
          <h5 class="text-grey-darken-2 font-weight-medium">
            {{ $t(`product.formTitle.${editedIndex === -1 ? "create" : "edit"}`) }}
          </h5>
          <p class="text-grey-lighten-1">{{ $t("product.formInstructions") }}</p>

          <v-row class="mt-12">
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
                      <strong>{{ $t(`product.steps.${s.title}.title`) }}</strong>
                      <div class="text-caption text-grey">
                        {{ $t(`product.steps.${s.title}.subtitle`) }}
                      </div>
                    </div>
                  </template>
                </v-timeline-item>
              </v-timeline>
            </v-col>

            <!-- Contenido dinámico según paso -->
            <v-col cols="9">
              <h3 class="text-deep-purple-accent-3 mb-8">
                {{ $t(`product.steps.${steps[step].title}.title`) }}
              </h3>

              <!-- Paso 1: Información básica -->
              <v-row dense v-if="step === 0">
                <v-col cols="12" md="6">
                  <v-text-field v-model="editedItem.name" :label="$t('product.fields.name')" variant="underlined"
                    :rules="validationRules.name"></v-text-field>
                </v-col>
                <v-col cols="12" md="6">
                  <v-text-field v-model="editedItem.brand" :label="$t('product.fields.brand')"
                    variant="underlined"></v-text-field>
                </v-col>
                <v-col cols="12" md="6">
                  <v-file-input clearable v-model="file" ref="fileInput" :label="$t('product.fields.image')"
                    variant="underlined" :prepend-icon="false" density="compact" name="file" accept=".png, .jpg, .jpeg"
                    @change="onFileSelected"></v-file-input>
                </v-col>
                <v-col cols="12" md="6">
                  <v-card elevation="6" class="mx-auto" max-width="210" max-height="120">
                    <img v-if="imagenDisponible()" :src="imgedit" height="120" width="210" />
                  </v-card>
                </v-col>
                <v-col cols="12" md="12">
                  <v-textarea v-model="editedItem.additional_notes" :label="$t('product.fields.additional_notes')"
                    variant="underlined"></v-textarea>
                </v-col>
              </v-row>

              <!-- Paso 2: Información de compra -->
              <v-row dense v-if="step === 1">
                <v-col cols="12" md="4">
                  <v-text-field v-model="editedItem.unit_price" :label="$t('product.fields.unit_price')"
                    variant="underlined" type="number" :rules="validationRules.unit_price"></v-text-field>
                </v-col>
                <v-col cols="12" md="4">
                  <v-text-field v-model="editedItem.quantity" :label="$t('product.fields.quantity')"
                    variant="underlined" type="number" :rules="validationRules.quantity"></v-text-field>
                </v-col>
                <v-col cols="12" md="4">
                  <v-text-field :model-value="formattedTotalPrice" :label="$t('product.fields.total_price')"
                    variant="underlined" type="number" readonly @update:model-value="
                        (val) => (editedItem.total_price = parseFloat(val))
                      "></v-text-field>
                </v-col>
                <v-col cols="12" md="6">
                  <v-autocomplete v-model="editedItem.status_id" :items="status" :label="$t('product.fields.status')"
                    item-title="nameStatus" item-value="id" variant="underlined" density="compact"
                    :rules="validationRules.status_id" :no-data-text="$t('product.validation.no_data')">
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
                  <v-autocomplete v-model="editedItem.category_id" :items="categories"
                    :label="$t('product.fields.category')" item-title="nameCategory" item-value="id"
                    variant="underlined" density="compact" :rules="validationRules.category_id"
                    :no-data-text="$t('product.validation.no_data')">
                    <template v-slot:item="{ props, item }">
                      <v-list-item v-bind="props">
                        <template v-slot:prepend>
                          <v-avatar size="24">
                            <template v-if="isImage(item.raw.iconCategory)">
                              <img :src="`${this.$axios.defaults.baseURL}images/${
                                    item.raw.iconCategory
                                  }?t=${Date.now()}`" alt="icon" />
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
                  <v-menu v-model="menu" :close-on-content-click="false" :nudge-right="40" transition="scale-transition"
                    offset-y min-width="290px">
                    <template v-slot:activator="{ props }">
                      <v-text-field v-bind="props" :modelValue="dateFormatted" variant="underlined"
                        :label="$t('product.fields.purchase_date')"
                        :rules="validationRules.purchase_date"></v-text-field>
                    </template>
                    <v-locale-provider>
                      <v-date-picker :title="$t('product.fields.purchase_date')" color="#03626C" :modelValue="input"
                        @update:model-value="updateDate" format="yyyy-MM-dd"></v-date-picker>
                    </v-locale-provider>
                  </v-menu>
                </v-col>
                <v-col cols="12" md="6">
                  <v-menu v-model="menu2" :close-on-content-click="false" :nudge-right="40"
                    transition="scale-transition" offset-y min-width="290px">
                    <template v-slot:activator="{ props }">
                      <v-text-field v-bind="props" :modelValue="dateFormatted2" variant="underlined"
                        :label="$t('product.fields.expiration_date')"></v-text-field>
                    </template>
                    <v-locale-provider>
                      <v-date-picker :title="$t('product.fields.expiration_date')" color="#03626C" :modelValue="input2"
                        format="yyyy-MM-dd" :min="dateFormatted" @update:model-value="updateDate1"></v-date-picker>
                    </v-locale-provider>
                  </v-menu>
                </v-col>
              </v-row>

              <!-- Paso 3: Configuración adicional -->
              <v-row dense v-if="step === 2">
                <v-col cols="12" md="6">
                  <v-text-field v-model="editedItem.frequency" :label="$t('product.fields.frequency')"
                    variant="underlined" type="number" :rules="validationRules.frequency"></v-text-field>
                </v-col>
                <v-col cols="12" md="6">
                  <v-select v-model="editedItem.type" :items="[$t('product.types.winter'), $t('product.types.summer')]"
                    :label="$t('product.fields.type')" variant="underlined"></v-select>
                </v-col>
                <v-col cols="12" md="12">
                  <v-text-field v-model="editedItem.purchase_place" :label="$t('product.fields.purchase_place')"
                    variant="underlined"></v-text-field>
                </v-col>
              </v-row>

              <!-- Navegación -->
              <div class="d-flex justify-space-between mt-8">
                <v-btn variant="text" class="text-grey-darken-1" @click="step > 0 ? step-- : close()">
                  {{ step === 0 ? $t("buttons.close") : $t("buttons.previous") }}
                </v-btn>

                <v-btn variant="text" class="text-deep-purple-accent-3" @click="nextStep" :disabled="!valid">
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
        <span class="text-subtitle-2 ml-4"> {{ $t('deleteDialog.title', { item: $t(`deleteDialog.items.product`) })
          }}</span>
      </v-toolbar>
      <v-card-text class="mt-2 mb-2"> {{ $t('deleteDialog.message') }}</v-card-text>
      <v-divider></v-divider>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn color="#DA7171" variant="flat" @click="closeDelete">{{ $t('taskForm.buttons.cancel') }}</v-btn>
        <v-btn color="#03626C" variant="flat" :loading="loading" @click="deleteItemConfirm">{{
          $t('taskForm.buttons.confirmDelete') }}</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>

  <!--Almacén-->
  <v-dialog v-model="dialogWarehouse" fullscreen persistent transition="dialog-bottom-transition"
    content-class="fullscreen-dialog">
    <v-form ref="form" v-model="valid" class="h-100">
      <v-card class="pa-10">
        <v-card-text class="pt-12">
          <h5 class="text-grey-darken-2 font-weight-medium">{{ formTitleWarehouse }}</h5>
          <p class="text-grey-lighten-1">
            {{ $t("warehouse.formInstructions") }}
          </p>

          <v-row class="mt-12">
            <!-- Side steps -->
            <v-col cols="3">
              <v-timeline align="start" side="end" dense>
                <v-timeline-item v-for="(s, index) in stepsW" :key="index" :dot-color="
                    stepW > index
                      ? 'green'
                      : stepW === index
                      ? 'deep-purple'
                      : 'grey-lighten-1'
                  " :icon="
                    stepW >= index
                      ? stepW === index
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
                {{ $t(`warehouse.steps.${stepsW[stepW].title}.title`) }}
              </h3>

              <!-- Paso 1: Información básica -->
              <v-row dense v-if="stepW === 0">
                <!--<v-col cols="12" md="12" v-show="editedIndex === -1">
                  <v-autocomplete v-model="editedItemWarehouse.warehouse_id" :items="warehouses"
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
                </v-col>-->

                <v-col cols="12" md="12">
                  <v-text-field v-model="editedItemWarehouse.title" clearable :label="$t('warehouse.fields.name')"
                    variant="underlined" :rules="nameRules"></v-text-field>
                </v-col>

                <v-col cols="12" md="12">
                  <v-text-field v-model="editedItemWarehouse.location" clearable
                    :label="$t('warehouse.fields.home_location')" variant="underlined"
                    :rules="locationRules"></v-text-field>
                </v-col>
              </v-row>

              <!-- Paso 2: Configuración adicional -->
              <v-row dense v-if="stepW === 1">
                <v-col cols="12" md="6">
                  <v-select v-model="editedItemWarehouse.status" :items="[
                      { id: 0, label: $t('warehouse.status.public') },
                      { id: 1, label: $t('warehouse.status.private') },
                    ]" item-title="label" item-value="id" :label="$t('warehouse.fields.status')" variant="underlined"
                    :rules="statusRules"></v-select>
                </v-col>

                <v-col cols="12" md="12">
                  <v-textarea v-model="editedItemWarehouse.description" clearable
                    :label="$t('warehouse.fields.description')" variant="underlined"
                    :rules="descriptionRules"></v-textarea>
                </v-col>
              </v-row>

              <div class="d-flex justify-space-between mt-8">
                <v-btn variant="text" class="text-grey-darken-1" @click="stepW > 0 ? stepW-- : this.closeWarehouse()">
                  {{ stepW === 0 ? $t("buttons.close") : $t("buttons.previous") }}
                </v-btn>

                <v-btn variant="text" class="text-deep-purple-accent-3" @click="nextStepW" :disabled="!valid">
                  {{
                  stepW === stepsW.length - 1
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
  <!--</v-container>-->
</template>

<script>
import LocalStorageService from "@/LocalStorageService";
import { handleRequest } from "@/utils/api"; // Ruta al archivo
export default {
  props: {
      warehouseData: {
      type: Object,
      default: null,
    },
  },
  emits: ['warehouse-updated'],
  data: () => ({
    steps: [
      { title: "basic", subtitle: "basic_information" },
      { title: "purchase", subtitle: "purchase_details" },
      { title: "additional", subtitle: "additional_configuration" },
    ],
    dialogWarehouse: false,
    step: 0,
    stepsW: [
      {
        title: "basic",
        subtitle: "basic_information",
      },
      {
        title: "configuration",
        subtitle: "additional_configuration",
      },
    ],
    stepW: 0,
    snackbar: false,
    sb_type: "",
    sb_message: "",
    sb_timeout: 2000,
    sb_title: "",
    sb_icon: "",
    valid: true,
    loading: false,
    loadingProduct: false,
    loadingProductEdit: false,
    dialogImg: false,
    currentImage: '',
    file: null,
    imgMiniatura: "",
    // Datos de prueba: almacenes y productos
    stores: [],
    products: [],
    categories: [],
    status: [],
    home_id: "",
    // Paginación
    currentPage: 1,
    itemsPerPage: 10,
    dialog: false,
    dialogDelete: false,
    isEditing: false,
    editedIndex: -1,
    editedItem: {
      id: "",
      // Datos generales
      warehouse_id: "", // Almacén seleccionado
      home_id: "",
      name: "", // Nombre del producto
      brand: "", // Marca del producto

      // Detalles de compra
      unit_price: 0, // Precio unitario
      total_price: 0, // Precio total
      quantity: 0, // Cantidad
      purchase_date: null, // Fecha de compra
      purchase_place: "", // Lugar de compra
      expiration_date: null, // Fecha de expiración

      // Otros datos
      additional_notes: "", // Notas adicionales
      maintenance_date: null, // Fecha de mantenimiento
      due_date: null, // Fecha de vencimiento
      frequency: "", // Frecuencia (Diario, Semanal, Mensual, Anual)
      status_id: null, // Estado (Activo/Inactivo)
      category_id: null, // Categoría
      type: "", // Tipo de producto
      image: null, // Imagen
      product_id: null,
    },

    defaultItem: {
      id: "",
      // Datos generales
      warehouse_id: "", // Almacén seleccionado
      home_id: "",
      name: "", // Nombre del producto
      brand: "", // Marca del producto

      // Detalles de compra
      unit_price: 0, // Precio unitario
      total_price: 0, // Precio total
      quantity: 0, // Cantidad
      purchase_date: null, // Fecha de compra
      purchase_place: "", // Lugar de compra
      expiration_date: null, // Fecha de expiración

      // Otros datos
      additional_notes: "", // Notas adicionales
      maintenance_date: null, // Fecha de mantenimiento
      due_date: null, // Fecha de vencimiento
      frequency: "", // Frecuencia (Diario, Semanal, Mensual, Anual)
      status_id: null, // Estado (Activo/Inactivo)
      category_id: null, // Categoría
      type: "", // Tipo de producto
      image: null, // Imagen
      product_id: null,
    },

    originalItem: {
      id: "",
      // Datos generales
      warehouse_id: "", // Almacén seleccionado
      home_id: "",
      name: "", // Nombre del producto
      brand: "", // Marca del producto

      // Detalles de compra
      unit_price: 0, // Precio unitario
      total_price: 0, // Precio total
      quantity: 0, // Cantidad
      purchase_date: null, // Fecha de compra
      purchase_place: "", // Lugar de compra
      expiration_date: null, // Fecha de expiración

      // Otros datos
      additional_notes: "", // Notas adicionales
      maintenance_date: null, // Fecha de mantenimiento
      due_date: null, // Fecha de vencimiento
      frequency: "", // Frecuencia (Diario, Semanal, Mensual, Anual)
      status_id: null, // Estado (Activo/Inactivo)
      category_id: null, // Categoría
      type: "", // Tipo de producto
      image: null,
      product_id: null, // Imagen
    },

    editedItemWarehouse: {
      id: "",
      title: "",
      description: "",
      location: "",
      status: "",
      home_id: "",
      warehouse_id: "",
    },
    defaultItemWarehouse: {
      id: "",
      title: "",
      description: "",
      location: "",
      status: "",
      warehouse_id: "",
      home_id: "",
    },
    originalItemWarehouse: {
      id: "",
      title: "",
      description: "",
      location: "",
      status: "",
      home_id: "",
      warehouse_id: "",
    },
    warehouse: [],
    tab: null,
    menu: false,
    menu2: false,
    input: null,
    input2: null,
    /*nameRules: [
      (v) => !!v || "El campo es requerido",
      (v) => (v && v.length <= 50) ||
        "El campo debe tener menos de 51 caracteres",
      (v) => (v && v.length >= 3) ||
        "El campo debe tener al menos de 3 caracteres",
    ],
    selectRules: [(v) => !!v || "Seleccionar al menos un elemento"],
    price: [
      (value) => !!value || 'Campo requerido',
      (value) => !value || !isNaN(parseFloat(value)) || 'Debe ser un número'],*/
  }),
  watch: {
    "editedItem.unit_price": {
      handler: "calculateTotalPrice",
      immediate: true,
    },
    "editedItem.quantity": {
      handler: "calculateTotalPrice",
      immediate: true,
    },
    "editedItemWarehouse.warehouse_id"(newVal) {
      if (!this.isEditing) {
        // Si está en modo edición, no ejecutar la lógica del watch
        return;
      }
      const selectedWarehouse = this.warehouses.find((w) => w.id === newVal);
      if (selectedWarehouse) {
        this.editedItemWarehouse.title = selectedWarehouse.title;
        this.editedItemWarehouse.description = selectedWarehouse.description;
        this.editedItemWarehouse.location = selectedWarehouse.location;
      } else {
        this.editedItemWarehouse.title = "";
        this.editedItemWarehouse.description = "";
        this.editedItemWarehouse.location = "";
      }
    },
  },
  computed: {
    validationRules() {
      return {
        name: [
          (v) =>
            !!v ||
            this.$t("product.validation.required", {
              field: this.$t("product.fields.name"),
            }),
          (v) =>
            (v && v.length >= 3) ||
            this.$t("product.validation.min_length", {
              field: this.$t("product.fields.name"),
              length: 3,
            }),
        ],
        unit_price: [
          (v) =>
            !!v ||
            this.$t("product.validation.required", {
              field: this.$t("product.fields.unit_price"),
            }),
          (v) =>
            !isNaN(v) ||
            this.$t("product.validation.invalid_number", {
              field: this.$t("product.fields.unit_price"),
            }),
          (v) =>
            v >= 0 ||
            this.$t("product.validation.min_value", {
              field: this.$t("product.fields.unit_price"),
              value: 0,
            }),
        ],
        quantity: [
          (v) =>
            !!v ||
            this.$t("product.validation.required", {
              field: this.$t("product.fields.quantity"),
            }),
          (v) =>
            !isNaN(v) ||
            this.$t("product.validation.invalid_number", {
              field: this.$t("product.fields.quantity"),
            }),
          (v) =>
            v >= 0 ||
            this.$t("product.validation.min_value", {
              field: this.$t("product.fields.quantity"),
              value: 0,
            }),
        ],
        status_id: [
          (v) =>
            !!v ||
            this.$t("product.validation.required", {
              field: this.$t("product.fields.status"),
            }),
        ],
        category_id: [
          (v) =>
            !!v ||
            this.$t("product.validation.required", {
              field: this.$t("product.fields.category"),
            }),
        ],
        purchase_date: [
          (v) =>
            !!v ||
            this.$t("product.validation.required", {
              field: this.$t("product.fields.purchase_date"),
            }),
        ],
        expiration_date: [
          (v) =>
            !v ||
            v >= this.editedItem.purchase_date ||
            this.$t("product.validation.invalid_date"),
        ],
      };
    },
    priceRules() {
      return this.validationRules.unit_price;
    },
    quantityRules() {
      return this.validationRules.quantity;
    },
    selectRules() {
      return [(v) => !!v || this.$t("product.validation.required")];
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
    // Obtener el almacén seleccionado
    /*selectedStore() {
      const store = this.warehouseData.find(
        (store) => store.warehouse_id === this.editedItem.warehouse_id
      );
      if (store) {
        this.selectStore(store.warehouse_id);
      }
      return store;
    },*/
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
      return this.editedIndex === -1 ? "Agregar Nuevo Producto" : "Editar Producto";
    },
    formTitleWarehouse() {
      return "Editar Almacén";
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
    formattedTotalPrice() {
      return this.editedItem.total_price
        ? parseFloat(this.editedItem.total_price).toFixed(2)
        : "0.00";
    },
  },
  mounted() {
    this.home_id = LocalStorageService.getItem("home_id");
    this.editedItem.warehouse_id = this.warehouseData.warehouse_id;
    this.showPersonProducts();
  },
  methods: {
     openModal() {
      this.dialogImg = true;
      console.log("Diálogo abierto:", this.dialogImg); // Debug
    },
    closeModal() {
      // Pequeño delay para evitar que se cierre al mover el mouse hacia el modal
      setTimeout(() => {
        this.dialogImg = false
      }, 100)
    },
    getTypeColor(type) {
      const colorMap = {
        Tarea: "warning",
        Meta: "purple",
        // Agrega más tipos si es necesario
      };
      return colorMap[type] || "error"; // Color por defecto
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
    nextStepW() {
      if (this.stepW < this.stepsW.length - 1) {
        this.stepW++;
      } else {
        this.dialogWarehouse = false;
        this.step = 0;
        this.editDataWarehouse();
      }
    },
    closeWarehouse() {
      this.dialogWarehouse = false;
      this.loading = false;
      this.$nextTick(() => {
        this.editedItemWarehouse = Object.assign({}, this.defaultItemWarehouse);
        this.originalItemWarehouse = Object.assign({}, this.defaultItemWarehouse);
      });
    },
    async editDataWarehouse(){
      const fieldsToUpdate = ["id", "title", "location", "description", "status"];
        let updatedFields = Object.keys(this.editedItemWarehouse)
          .filter(
            (key) =>
              fieldsToUpdate.includes(key) &&
              this.editedItemWarehouse[key] !== this.originalItemWarehouse[key]
          )
          .reduce((obj, key) => {
            obj[key] = this.editedItemWarehouse[key];
            return obj;
          }, {});
        if (Object.keys(updatedFields).length > 0) {
          updatedFields.id = this.editedItemWarehouse.id;
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
              //this.initialize();
             this.$emit('warehouse-updated', result.data.personWarehouse);
 
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
        }
    },
    async editWarehouse() {
      console.log("editWarehouse", this.warehouseData);
      this.stepW = 0;
      // Asigna los datos del almacén al objeto de edición
      this.editedItemWarehouse = {
        ...this.warehouseData
      };
    
      this.originalItemWarehouse = { ...this.warehouseData };
      this.data = {};
      this.data.home_id = this.home_id;
      this.editedItemWarehouse.home_id = this.home_id;
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
            result.data?.warehouses || [];
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
        this.dialogWarehouse = true;
      }
      this.isEditing = false;
    },
    calculateTotalPrice() {
      this.editedItem.total_price = (
        this.editedItem.unit_price * this.editedItem.quantity
      ).toFixed(2);
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
    // Cambiar almacén seleccionado
    /*selectStore(warehouse_id) {
      this.editedItem.warehouse_id = warehouse_id;
      this.currentPage = 1; // Reiniciar paginación al cambiar almacén
      this.showPersonProducts();
    },*/
    /*async initialize() {
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
          this.stores = result.data?.store || [];
          if (this.stores.length > 0) {
            // Seleccionar el primer almacén por defecto
            this.editedItem.warehouse_id = this.stores[0].warehouse_id;
          }
        } else {
          // Si no hay datos, asignamos un array vacío
          this.stores = [];
          //this.showAlert('success', result.message || 'No hay almacénes disponibles.', 3000);
        }
      } catch (error) {
        this.loading = false;
        // Captura de errores no controlados
        this.showAlert(
          "error",
          "Ocurrió un error inesperado al cargar los almacenes.",
          3000
        );
      } finally {
        this.loading = false;
        this.showPersonProducts();
      }
    },*/
    async showPersonProducts() {
      this.products = [];
      this.data = {};
      this.editedItem.home_id = this.home_id;
      this.data.home_id = this.home_id;
      this.data.warehouse_id = this.editedItem.warehouse_id;
      try {
        this.loading = true;
        const result = await handleRequest({
          endpoint: "person-home-warehouse-products",
          method: "POST",
          data: this.data,
        });

        if (result.success) {
          // Si la solicitud es exitosa, asignamos las sucursales
          this.products = result.data?.products || [];
        } else {
          // Si no hay datos, asignamos un array vacío
          this.products = [];
          //this.showAlert('success', 'No hay productos disponibles.', 3000);
        }
      } catch (error) {
        this.loading = false;
        // Captura de errores no controlados
        this.showAlert("error", "Ocurrió un error inesperado al cargar los roles.", 3000);
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
          endpoint: "productcategory-productstatus-apk",
          method: "POST",
          data: this.data,
        });

        if (result.success) {
          // Si la solicitud es exitosa, asignamos las sucursales
          this.categories = result.data?.productcategories || [];
          this.status = result.data?.productstatus || [];
        } else {
          // Si no hay datos, asignamos un array vacío
          this.categories = [];
          this.status = [];
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
      this.imgMiniatura = "";
    },

    async save() {
      if (this.editedIndex === -1) {
        this.loadingProduct = true;
        this.valid = false;
        const fieldsToUpdate = [
          "id",
          "home_id",
          "warehouse_id",
          "product_id",
          "status_id",
          "category_id",
          "name",
          "unit_price",
          "quantity",
          "total_price",
          "purchase_date",
          "purchase_place",
          "expiration_date",
          "brand",
          "additional_notes",
          "maintenance_date",
          "due_date",
          "frequency",
          "type",
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
              endpoint: "person-home-warehouse-product",
              method: "POST",
              data: formData,
            });

            // Manejo de la respuesta según el resultado
            if (result.success) {
              this.showAlert("success", result.message, 3000);
              this.showPersonProducts();
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
            this.loadingProduct = false;
            this.editedIndex = -1;
          }
        } else {
          this.loadingProduct = false;
          this.showAlert("success", "Debe completar los datos de producto.", 3000);
        }
      } else {
        this.loadingProductEdit = true;
        this.valid = false;
        const fieldsToUpdate = [
          "id",
          "home_id",
          "warehouse_id",
          "product_id",
          "status_id",
          "category_id",
          "name",
          "unit_price",
          "quantity",
          "total_price",
          "purchase_date",
          "purchase_place",
          "expiration_date",
          "brand",
          "additional_notes",
          "maintenance_date",
          "due_date",
          "frequency",
          "type",
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
          if (this.file) {
            updatedFields.image = this.editedItem.image;
          }
          const formData = new FormData();
          for (let key in updatedFields) {
            formData.append(key, updatedFields[key]);
          }
          try {
            const result = await handleRequest({
              endpoint: "person-home-warehouse-product-update",
              method: "POST",
              data: formData,
            });

            // Manejo de la respuesta según el resultado
            if (result.success) {
              this.showAlert("success", result.message, 3000);
              this.showPersonProducts();
            } else {
              this.showAlert("warning", result.message, 3000);
            }
          } catch (error) {
            this.loadingProductEdit = false;
            // Este bloque captura errores inesperados fuera del manejo estándar
            this.showAlert(
              "error",
              "Ocurrió un error inesperado al procesar la solicitud.",
              3000
            );
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
          console.error("Error al cargar la imagen", error);
          this.showAlert("error", "Error al cargar la imagen.", 3000);
        }
      };
      this.loadingProductEdit = true;
      this.data = {};
      this.data.home_id = this.editedItem.home_id;
      try {
        const result = await handleRequest({
          endpoint: "productcategory-productstatus-apk",
          method: "POST",
          data: this.data
        });

        if (result.success) {
          // Si la solicitud es exitosa, asignamos las sucursales
          this.categories = result.data?.productcategories || [];
          this.status = result.data?.productstatus || [];
        } else {
          // Si no hay datos, asignamos un array vacío
          this.categories = [];
          this.status = [];
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
          id: this.editedItem.id,
        };
        const result = await handleRequest({
          endpoint: "person-home-warehouse-product-destroy",
          method: "POST",
          data: request,
        });

        // Manejo de la respuesta según el resultado
        if (result.success) {
          this.showAlert("success", result.message, 3000);
          this.loading = false;
          this.showPersonProducts();
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
      let file = event.target.files[0];
      // Validar el tamaño del archivo (500 KB máximo)
      const maxSize = 500 * 1024; // 500 KB en bytes
      if (file && file.size > maxSize) {
        this.showAlert("warning", "El archivo de imagen debe ser de máximo 500 KB", 3000);
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
      };
      reader.readAsDataURL(file);
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
   margin: 0;
  padding: 0;
}
.icono-concavo {
  width: 50px;
  height: 50px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0;
  padding: 0;
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
.img-concava {
  width: 100%;
  height: 100%;
  object-fit: cover; /* Asegura que la imagen cubra el espacio */
  border-radius: 8px; /* Para que coincida con el contenedor */
}
.modal-imagen {
  background: transparent !important;
  box-shadow: none !important;
}
.selected-tab {
  background-color: #03626c;
  /* Color de fondo */
  color: white;
  /* Color de texto */
  border-radius: 4px;
  /* Opcional: redondear esquinas */
  padding: 8px;
  /* Opcional: ajustar padding */
}
.v-tooltip__content {
  transform: translateX(-50%) !important;
  left: 50% !important;
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
  --v-tooltip-background: #03626c; /* Fondo del tooltip */
  --v-tooltip-color: #ffffff; /* Color del texto */
  --v-tooltip-border-radius: 4px; /* Bordes redondeados */
  --v-tooltip-padding: 8px 12px; /* Espaciado interno */
}
</style>
