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
              ><strong>{{ $t("files.listing.title") }}</strong></span
            >
          </v-col>
          <v-col cols="12" md="3" class="text-right">
            <v-btn
              class="text-subtitle-1 ml-12"
              color="white"
              variant="tonal"
              elevation="2"
              prepend-icon="mdi-plus-circle"
              @click="showAdd"
            >
              {{ $t("files.listing.addButton") }}
            </v-btn>
          </v-col>
        </v-row>
      </v-toolbar>

      <v-card-text>
        <v-tabs v-model="tab" vertical>
          <v-tab value="personal" :class="tab === 'personal' ? 'selected-tab' : ''">{{
            $t("files.listing.types.personal")
          }}</v-tab>
          <v-tab value="hogar" :class="tab === 'hogar' ? 'selected-tab' : ''">{{
            $t("files.listing.types.home")
          }}</v-tab>
          <v-tab value="todas" :class="tab === 'todas' ? 'selected-tab' : ''">{{
            $t("files.listing.types.all")
          }}</v-tab>
        </v-tabs>

        <v-window v-model="tab" min-height="50vh" class="mt-2">
          <v-window-item value="personal">
            <v-text-field
              class="mt-1 mb-1"
              v-model="search"
              append-icon="mdi-magnify"
              :label="$t('files.listing.types.search')"
              single-line
            >
            </v-text-field>
            <v-data-table
              :headers="translatedHeaders"
              :search="search"
              :items="filteredPersonalFiles"
              class="elevation-1"
              style="max-height: 68vh; overflow-y: auto"
              :loading="loading"
            >
              <template v-slot:item.actions="{ item }">
                <v-btn
                  density="comfortable"
                  icon="mdi-pencil"
                  @click="editItem(item)"
                  color="#1976D2"
                  variant="tonal"
                  elevation="1"
                  title="Editar Archivo"
                ></v-btn>
                <v-btn
                  density="comfortable"
                  icon="mdi-delete"
                  @click="deleteItem(item)"
                  color="#DA7171"
                  variant="tonal"
                  elevation="1"
                  title="Eliminar Archivo"
                ></v-btn>
              </template>
              <template v-slot:item.archive="{ item }">
                <v-btn
                  density="comfortable"
                  icon="mdi-eye"
                  color="green"
                  v-if="item.archive && item.archive !== 'files/default.jpg'"
                  @click="openModal(item.archive)"
                  variant="tonal"
                  elevation="1"
                  class="mr-1 mt-1 mb-1"
                  title="Ver detalles"
                ></v-btn>
              </template>
              <template v-slot:item.personal="{ item }">
                <div class="d-flex align-center">
                  <v-avatar color="#03626C" size="32" class="mr-2">
                    <v-icon
                      :icon="item.personal ? 'mdi-account' : 'mdi-home'"
                      color="white"
                    ></v-icon>
                  </v-avatar>
                  <span>{{ item.personal ? "Personal" : "Hogar" }}</span>
                </div>
              </template>
            </v-data-table>
          </v-window-item>
          <v-window-item value="hogar" class="mt-4">
            <v-text-field
              class="mt-1 mb-1"
              v-model="search"
              append-icon="mdi-magnify"
              label="Buscar"
              single-line
              hide-details
            >
            </v-text-field>
            <v-data-table
              :headers="translatedHeaders"
              :search="search"
              :items="filteredHomeFiles"
              class="elevation-1"
              style="max-height: 68vh; overflow-y: auto"
              :loading="loading"
            >
              <template v-slot:item.actions="{ item }">
                <v-btn
                  density="comfortable"
                  icon="mdi-pencil"
                  @click="editItem(item)"
                  color="#1976D2"
                  variant="tonal"
                  elevation="1"
                  title="Editar Archivo"
                ></v-btn>
                <v-btn
                  density="comfortable"
                  icon="mdi-delete"
                  @click="deleteItem(item)"
                  color="#DA7171"
                  variant="tonal"
                  elevation="1"
                  title="Eliminar Archivo"
                ></v-btn>
              </template>
              <template v-slot:item.archive="{ item }">
                <v-btn
                  density="comfortable"
                  icon="mdi-eye"
                  color="green"
                  v-if="item.archive && item.archive !== 'files/default.jpg'"
                  @click="openModal(item.archive)"
                  variant="tonal"
                  elevation="1"
                  class="mr-1 mt-1 mb-1"
                  title="Ver detalles"
                ></v-btn>
              </template>
              <template v-slot:item.personal="{ item }">
                <div class="d-flex align-center">
                  <v-avatar color="#03626C" size="32" class="mr-2">
                    <v-icon
                      :icon="item.personal ? 'mdi-account' : 'mdi-home'"
                      color="white"
                    ></v-icon>
                  </v-avatar>
                  <span>{{ item.personal ? "Personal" : "Hogar" }}</span>
                </div>
              </template>
            </v-data-table>
          </v-window-item>
          <v-window-item value="todas">
            <v-text-field
              class="mt-1 mb-1"
              v-model="search"
              append-icon="mdi-magnify"
              label="Buscar"
              single-line
              hide-details
            >
            </v-text-field>
            <v-data-table
              :headers="translatedHeaders"
              :search="search"
              :items="files"
              class="elevation-1"
              style="max-height: 68vh; overflow-y: auto"
              :loading="loading"
            >
              <template v-slot:item.actions="{ item }">
                <v-btn
                  density="comfortable"
                  icon="mdi-pencil"
                  @click="editItem(item)"
                  color="#1976D2"
                  variant="tonal"
                  elevation="1"
                  title="Editar Archivo"
                ></v-btn>
                <v-btn
                  density="comfortable"
                  icon="mdi-delete"
                  @click="deleteItem(item)"
                  color="#DA7171"
                  variant="tonal"
                  elevation="1"
                  title="Eliminar Archivo"
                ></v-btn>
              </template>
              <template v-slot:item.archive="{ item }">
                <v-btn
                  density="comfortable"
                  icon="mdi-eye"
                  color="green"
                  v-if="item.archive && item.archive !== 'files/default.jpg'"
                  @click="openModal(item.archive)"
                  variant="tonal"
                  elevation="1"
                  class="mr-1 mt-1 mb-1"
                  title="Ver detalles"
                ></v-btn>
              </template>
              <template v-slot:item.personal="{ item }">
                <div class="d-flex align-center">
                  <v-avatar color="#03626C" size="32" class="mr-2">
                    <v-icon
                      :icon="item.personal ? 'mdi-account' : 'mdi-home'"
                      color="white"
                    ></v-icon>
                  </v-avatar>
                  <span>{{ item.personal ? "Personal" : "Hogar" }}</span>
                </div>
              </template>
            </v-data-table>
          </v-window-item>
        </v-window>
      </v-card-text>
    </v-card>
  </v-container>
  <!--<v-dialog v-model="dialog" max-width="600px">
    <v-form ref="form" v-model="valid" enctype="multipart/form-data">
      <v-card>
        <v-toolbar color="#03626C">
          <span class="text-subtitle-2 ml-4">{{ formTitle }}</span>
        </v-toolbar>
        <v-card-text>
          <v-container>
            <v-row>
              <v-col cols="12" md="12">
                <v-text-field v-model="editedItem.name" clearable label="Nombre" prepend-icon="mdi-note"
                  variant="underlined"></v-text-field>
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
                <v-select v-model="editedItem.personal" :items="Options" item-value="id" item-title="name" label="Tipo"
                  prepend-icon="mdi-check-circle" variant="underlined" density="compact">
                  <template v-slot:item="{ props, item }">
                    <v-list-item v-bind="props">
                      <template v-slot:prepend>
                        <v-avatar size="30" color="#03626C" class="mr-2">
                          <v-icon>{{ item.raw.icon }}</v-icon>
                        </v-avatar>
                      </template>
                    </v-list-item>
                  </template>
                </v-select>
              </v-col>
              <v-col cols="12" md="12">
                <v-textarea v-model="editedItem.description" clearable label="Descripción" prepend-icon="mdi-note"
                  variant="underlined"></v-textarea>
              </v-col>
            </v-row>
            <v-row>
              <v-col cols="12" md="6">
                <v-file-input clearable v-model="file" ref="fileInput" label="Archivo" variant="underlined"
                  density="compact" name="file" accept=".png, .jpg, .jpeg, .docx, .pdf" @change="onFileSelected">
                </v-file-input>
              </v-col>
              <v-col cols="12" md="6">
                <v-card elevation="6" class="mx-auto" max-width="210" max-height="120">
                  <img v-if="imagenDisponible() && this.showImage" :src="imgedit" height="120" width="210">
                  <v-icon v-else class="d-flex align-center justify-center"
                    style="height: 120px; width: 210px; font-size: 120px;">{{ this.icono }}</v-icon>
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
          <!-- Encabezado -->
          <h5 class="text-grey-darken-2 font-weight-medium">
            {{ $t(`files.formTitle.${editedIndex === -1 ? "create" : "edit"}`) }}
          </h5>
          <p class="text-grey-lighten-1">{{ $t("files.formInstructions") }}</p>

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
                      <strong>{{ $t(`files.steps.${s.title}.title`) }}</strong>
                      <div class="text-caption text-grey">
                        {{ $t(`files.steps.${s.title}.subtitle`) }}
                      </div>
                    </div>
                  </template>
                </v-timeline-item>
              </v-timeline>
            </v-col>

            <!-- Contenido dinámico según paso -->
            <v-col cols="9">
              <h3 class="text-deep-purple-accent-3 mb-8">
                {{ $t(`files.steps.${steps[step].title}.title`) }}
              </h3>

              <!-- Paso 1: Información básica -->
              <v-row dense v-if="step === 0">
                <v-col cols="12" md="6">
                  <v-text-field
                    v-model="editedItem.name"
                    :label="$t('files.fields.name')"
                    variant="underlined"
                    :rules="[
                      (v) =>
                        !!v ||
                        $t('files.validation.required', {
                          field: $t('files.fields.name'),
                        }),
                    ]"
                  ></v-text-field>
                </v-col>
                <v-col cols="12" md="6">
                  <v-menu
                    v-model="menu"
                    :close-on-content-click="false"
                    :nudge-right="40"
                    transition="scale-transition"
                    offset-y
                    min-width="290px"
                  >
                    <template v-slot:activator="{ props }">
                      <v-text-field
                        v-bind="props"
                        :modelValue="dateFormatted"
                        variant="underlined"
                        :label="$t('files.fields.date')"
                      ></v-text-field>
                    </template>
                    <v-locale-provider>
                      <v-date-picker
                        color="#03626C"
                        :modelValue="input"
                        @update:model-value="updateDate"
                        format="yyyy-MM-dd"
                        :min="new Date().toISOString().split('T')[0]"
                      ></v-date-picker>
                    </v-locale-provider>
                  </v-menu>
                </v-col>
                <v-col cols="12" md="12">
                  <v-textarea
                    v-model="editedItem.description"
                    clearable
                    :label="$t('files.fields.description')"
                    variant="underlined"
                  ></v-textarea>
                </v-col>
              </v-row>

              <!-- Paso 2: Detalles adicionales -->
              <v-row dense v-if="step === 1">
                <v-col cols="12" md="6">
                  <v-select
                    v-model="editedItem.personal"
                    :items="Options"
                    item-value="id"
                    item-title="name"
                    :label="$t('files.fields.type')"
                    variant="underlined"
                    density="compact"
                    :rules="[
                      (v) =>
                        !!v ||
                        $t('files.validation.required', {
                          field: $t('files.fields.type'),
                        }),
                    ]"
                  >
                    <template v-slot:item="{ props, item }">
                      <v-list-item v-bind="props">
                        <template v-slot:prepend>
                          <v-avatar size="30" color="#03626C" class="mr-2">
                            <v-icon>{{ item.raw.icon }}</v-icon>
                          </v-avatar>
                        </template>
                      </v-list-item>
                    </template>
                  </v-select>
                  <v-file-input
                    v-model="file"
                    ref="fileInput"
                    :label="$t('files.fields.file')"
                    variant="underlined"
                    density="compact"
                    name="file"
                    :prepend-icon="false"
                    @change="onFileSelected"
                  ></v-file-input>
                </v-col>
                <v-col cols="12" md="6">
                  <v-card elevation="6" class="mx-auto" max-width="210" max-height="120">
                    <img
                      v-if="imagenDisponible() && showImage"
                      :src="imgedit"
                      height="120"
                      width="210"
                    />
                    <v-icon
                      v-else
                      class="d-flex align-center justify-center"
                      style="height: 120px; width: 210px; font-size: 120px"
                    >
                      {{ icono }}
                    </v-icon>
                    <v-card-subtitle class="text-center">{{
                      $t("files.fields.preview")
                    }}</v-card-subtitle>
                  </v-card>
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
        <span class="text-subtitle-2 ml-4"> {{ $t('deleteDialog.title', { item: $t(`deleteDialog.items.file`) }) }}</span>
      </v-toolbar>

      <v-card-text class="mt-2 mb-2">
       {{ $t('deleteDialog.message') }}</v-card-text
      >
      <v-divider></v-divider>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn color="#DA7171" variant="flat" @click="closeDelete"> {{ $t('taskForm.buttons.cancel') }} </v-btn>
        <v-btn color="#03626C" variant="flat" @click="deleteItemConfirm"> {{ $t('taskForm.buttons.confirmDelete') }} </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
  <v-dialog v-model="dialogPhoto" persistent max-width="600px">
  <v-card>
    <v-toolbar color="#03626C">
      <span class="text-subtitle-2 ml-4">Detalle</span> 
      <v-spacer></v-spacer>
      <v-btn icon @click="dialogPhoto = false">
        <v-icon>mdi-close</v-icon>
      </v-btn>
    </v-toolbar>

    <v-card-text>
      <template v-if="loadingImage">
        <div class="d-flex justify-center align-center" style="min-height: 200px">
          <v-progress-circular
            indeterminate
            color="#03626C"
            size="64"
          ></v-progress-circular>
        </div>
      </template>
      <template v-else-if="selectedImageUrl">
        <v-img 
          :src="selectedImageUrl" 
          max-height="500"
          contain
          class="mx-auto"
        ></v-img>
      </template>
      <template v-else>
        <div class="d-flex flex-column align-center justify-center py-8">
          <v-icon color="error" size="64">mdi-alert-circle-outline</v-icon>
          <p class="text-subtitle-1 mt-4">No se pudo cargar la imagen</p>
          <v-btn 
            color="#03626C" 
            class="mt-4"
            @click="openModal(lastOpenedImage)"
          >
            Reintentar
          </v-btn>
        </div>
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
    steps: [
      { title: "basic" }, // Paso 1: Información básica
      { title: "file_config" }, // Paso 2: Archivo y tipo combinados
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
    tab: null,
    loading: false,
    mostrar: false,
    file: null,
    showImage: false,
    icono: "mdi-file",
    imgMiniatura: "",
    dialog: false,
    dialogDelete: false,
    files: [],
    filteredPersonalFiles: [],
    filteredHomeFiles: [],
    data: {},
    home_id: "",
    dialogPhoto: false,
    loadingImage: false,
    selectedImageUrl: "",
    headers: [
      //{ title: 'Sucursal', value: 'branchName', width: '20%' },
      { title: "files.fields.name", value: "name", width: "20%" },
      { title: "files.fields.date", value: "date", width: "10%" },
      { title: "files.fields.type", value: "personal", width: "10%" },
      { title: "files.fields.description", value: "description", width: "30%" },
      { title: "files.fields.file", value: "archive", width: "5%" },
      { title: "files.fields.actions", value: "actions", sortable: false, width: "15%" },
    ],
    Options: [
      { name: "Personal", id: 1, icon: "mdi-account" },
      { name: "Hogar", id: 0, icon: "mdi-home" },
    ],
    editedItem: {
      id: "",
      home_id: "",
      date: "",
      description: "",
      name: "",
      personal: "",
      archive: "",
    },
    originalItem: {
      id: "",
      home_id: "",
      date: "",
      description: "",
      name: "",
      personal: "",
      archive: "",
    },
    defaultItem: {
      id: "",
      home_id: "",
      date: "",
      description: "",
      name: "",
      personal: "",
      archive: "",
    },
    editedIndex: -1,
    search: "",
    menu: false,
    input: null,
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
    translatedHeaders() {
      return this.headers.map((header) => ({
        ...header,
        title: this.$t(header.title),
      }));
    },
    formTitle() {
      return this.editedIndex === -1 ? "Agregar Archivo" : "Editar Archivo";
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
    this.person_id = JSON.parse(LocalStorageService.getItem("person_id"));
    this.home_id = JSON.parse(LocalStorageService.getItem("home_id"));
    this.initialize();
  },
  methods: {
    nextStep() {
      if (this.step < this.steps.length - 1) {
        this.step++;
      } else {
        this.save();
      }
    },
    isValidFile(file) {
      if (!file) return true; // Si no hay archivo, se considera válido (para permitir limpiar el campo)

      // 1. Primero verifica la extensión del nombre del archivo (más confiable)
      if (file.name) {
        const fileName = file.name.toLowerCase();
        const validExtensions = [".png", ".jpg", ".jpeg", ".pdf", ".docx"];

        if (validExtensions.some((ext) => fileName.endsWith(ext))) {
          return true;
        }
      }

      // 2. Si no coincide por extensión, verifica el tipo MIME (como respaldo)
      if (file.type) {
        const validMimeTypes = [
          "image/png",
          "image/jpeg",
          "application/pdf",
          "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
        ];
        return validMimeTypes.includes(file.type);
      }

      // 3. Si no hay nombre ni tipo, rechaza el archivo
      return false;
    },
    openModal(imageUrl) {
  this.dialogPhoto = true; // Abrir el modal inmediatamente
  this.loadingImage = true;
  this.selectedImageUrl = ''; // Limpiar la imagen anterior
  
  // Verificar si es una URL válida
  if (!imageUrl || imageUrl === 'files/default.jpg') {
    this.loadingImage = false;
    return;
  }

  const img = new Image();
  const imageSrc = `${this.$axios.defaults.baseURL}images/${imageUrl}`;
  img.src = imageSrc;

  img.onload = () => {
    this.selectedImageUrl = imageSrc;
    this.loadingImage = false;
  };

  img.onerror = () => {
    this.selectedImageUrl = ''; // Opcional: puedes establecer una imagen de respaldo aquí
    this.loadingImage = false;
    // No cerramos el modal, mostramos estado de error
  };
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
    clearFields() {
      // Limpiar los valores de ingreso y gasto al cambiar el tipo
      this.editedItem.income = "";
      this.editedItem.spent = "";
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
      this.editedIndex = -1;
      this.file = null;
      this.imgMiniatura = "";
    },
    async initialize() {
      try {
        this.data = {};
        this.data.home_id = this.home_id;
        this.data.personal = 2;
        this.loading = true;
        const result = await handleRequest({
          endpoint: "get-type-files",
          method: "POST",
          data: this.data,
        });

        if (result.success) {
          // Si la solicitud es exitosa, asignamos las sucursales
          this.files = result.data?.files || [];
          // Filtro 1: donde person_id sea igual a this.person_id y type sea igual a 'Personal'
          this.filteredPersonalFiles = this.files.filter((file) => file.personal === 1);

          // Filtro 2: donde home_id sea igual a this.home_id
          this.filteredHomeFiles = this.files.filter((file) => file.personal === 0);
        } else {
          // Si no hay datos, asignamos un array vacío
          this.files = [];
          this.showAlert("info", "No hay arcjivos disponibles.", 3000);
        }
      } catch (error) {
        this.loading = false;
        // Captura de errores no controlados
        this.showAlert(
          "error",
          "Ocurrió un error inesperado al cargar las finanzas.",
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
          "home_id",
          "name",
          "archive",
          "date",
          "description",
          "personal",
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
          updatedFields.date = this.editedItem.date ? this.editedItem.date : new Date();
          updatedFields.home_id = this.editedItem.home_id;
          if (this.file) {
            updatedFields.archive = this.editedItem.archive;
          }
          const formData = new FormData();
          for (let key in updatedFields) {
            formData.append(key, updatedFields[key]);
          }

          console.log("formData");
          console.log(formData);

          try {
            const result = await handleRequest({
              endpoint: "file",
              method: "POST",
              data: formData,
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
            this.showAlert(
              "error",
              "Ocurrió un error inesperado al procesar la solicitud.",
              3000
            );
          }
        } else {
          this.loading = false;
          this.showAlert("success", "Debe completar los datos del archivo.", 3000);
        }
      } else {
        this.valid = false;
        const fieldsToUpdate = [
          "home_id",
          "name",
          "archive",
          "date",
          "description",
          "personal",
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
          updatedFields.id = Number(this.editedItem.id);
          if (this.file) {
            updatedFields.archive = this.editedItem.archive;
          }
          const formData = new FormData();
          for (let key in updatedFields) {
            formData.append(key, updatedFields[key]);
          }
          try {
            const result = await handleRequest({
              endpoint: "file-update",
              method: "POST",
              data: formData,
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
      (this.showImage = false), (this.icono = "mdi-file");
      this.editedIndex = 1;
      this.originalItem = Object.assign({}, item);
      this.editedItem = Object.assign({}, item);
      this.file = null;
      const imageExtensions = ["jpg", "jpeg", "png", "gif"];
      // Crear la imagen y configurar el src
      if (!imageExtensions.includes(item.type) && !item.type.startsWith("image/")) {
        this.showImage = false;
        // Manejar tipos MIME específicos para documentos
        if (item.type === "pdf") {
          this.icono = "mdi-file-pdf-box";
        } else if (item.type === "doc") {
          this.icono = "mdi-file-word";
        } else if (item.type === "docx") {
          this.icono = "mdi-file-word";
        } else if (item.type === "txt") {
          this.icono = "mdi-file-document-outline";
        }
      }
      // Usar una función asíncrona para manejar la carga de la imagen
      else {
        this.showImage = true;
        const img = new Image();
        img.src = `${this.$axios.defaults.baseURL}images/${item.archive}`; // Se asume que item.image_url es la URL de la imagen
        img.onload = async () => {
          try {
            // Asignar la imagen cargada a imgMiniatura
            this.imgMiniatura = `${this.$axios.defaults.baseURL}images/${item.archive}`;
          } catch (error) {
            console.error("Error al cargar la imagen", error);
            this.showAlert("error", "Error al cargar la imagen.", 3000);
          }
        };
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
      try {
        let request = {
          id: this.editedItem.id,
        };
        const result = await handleRequest({
          endpoint: "file-destroy",
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
      this.imgMiniatura = "";
      let file = event.target.files[0];
      // Validar el tamaño del archivo (500 KB máximo)
      const maxSize = 500 * 1024; // 500 KB en bytes
      if (file && file.size > maxSize) {
        this.valid = false;
        this.showAlert("warning", "El archivo de imagen debe ser de máximo 500 KB", 3000);
        return; // Detener el proceso si el archivo es demasiado grande
      }
      // Obtener tipo MIME y extensión
      const mimeType = file.type;
      const extension = file.name.split(".").pop().toLowerCase();

      // Lista de extensiones permitidas
      const imageExtensions = ["jpg", "jpeg", "png", "gif"];
      const documentExtensions = ["pdf", "doc", "docx", "txt"];

      // Validar tipo de archivo
      if (
        (mimeType.startsWith("image/") || imageExtensions.includes(extension)) &&
        imageExtensions.includes(extension)
      ) {
        this.cargarImage(file);
        this.showImage = true;
      } else if (documentExtensions.includes(extension)) {
        this.showImage = false;
        // Manejar tipos MIME específicos para documentos
        if (mimeType === "application/pdf" || extension === "pdf") {
          this.icono = "mdi-file-pdf-box";
        } else if (mimeType === "application/msword" || extension === "doc") {
          this.icono = "mdi-file-word";
        } else if (
          mimeType ===
            "application/vnd.openxmlformats-officedocument.wordprocessingml.document" ||
          extension === "docx"
        ) {
          this.icono = "mdi-file-word";
        } else if (mimeType === "text/plain" || extension === "txt") {
          this.icono = "mdi-file-document-outline";
        }
      }

      this.valid = true;
      this.editedItem.archive = file;
      //console.log(this.editedItem.image_cardgift);
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
.selected-tab {
  background-color: #03626c;
  /* Fondo del tab seleccionado */
  color: white;
  /* Texto blanco */
  border-radius: 4px;
  /* Esquinas redondeadas, opcional */
}
</style>
