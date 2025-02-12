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
  
    <v-card elevation="6" class="mx-5">
      <v-toolbar color="#03626C">
        <v-row align="center">
          <v-col cols="12" md="8" class="grow ml-4">
            <span class="text-subtitle-1"><strong>Lista de Archivos Personales</strong></span>
          </v-col>
          <v-col cols="12" md="3" class="text-right">
            <v-dialog v-model="dialog" max-width="600px">
              <template v-slot:activator="{ props }">
                <v-btn 
                  v-bind="props" 
                  class="text-subtitle-1 ml-12" 
                  color="#DA7171" 
                  variant="flat" 
                  elevation="2" 
                  prepend-icon="mdi-plus-circle"
                >
                  Agregar Nuevo Archivo
                </v-btn>
              </template>
              <v-card>
                <v-toolbar color="#03626C">
                  <span class="text-subtitle-2 ml-4">{{ formTitle }}</span>
                </v-toolbar>
                <v-card-text>
                  <v-container>
                    <v-row>
                      <v-col cols="12">
                        <v-text-field 
                          v-model="editedItem.title" 
                          clearable 
                          label="Título del Archivo" 
                          prepend-icon="mdi-file" 
                          variant="underlined"
                        ></v-text-field>
                      </v-col>
                      <v-col cols="12" md="6">
                        <v-text-field 
                          v-model="editedItem.description" 
                          clearable 
                          label="Descripción del Archivo" 
                          prepend-icon="mdi-pencil" 
                          variant="underlined"
                        ></v-text-field>
                      </v-col>
                      <v-col cols="12" md="6">
                        <v-menu v-model="menu" :close-on-content-click="false" :nudge-right="40" transition="scale-transition"
                            offset-y min-width="290px">
                          <template v-slot:activator="{ props }">
                            <v-text-field v-bind="props" :modelValue="dateFormatted" variant="underlined"
                              prepend-icon="mdi-calendar" label="Fecha de Creación"></v-text-field>
                          </template>
                          <v-locale-provider locale="es">
                            <v-date-picker header="Calendario" title="Seleccione la Fecha" color="#03626C"
                              :modelValue="input" @update:model-value="updateDate" format="yyyy-MM-dd"
                            ></v-date-picker>
                          </v-locale-provider>
                        </v-menu>
                      </v-col>
                      <v-col cols="12" md="6">
                        <v-select
                          v-model="editedItem.category"
                          :items="categories"
                          label="Categoría"
                          prepend-icon="mdi-folder"
                          variant="underlined"
                        ></v-select>
                      </v-col>
                      <v-col cols="12" md="6">
                        <v-checkbox 
                          v-model="editedItem.isImportant" 
                          label="¿Es archivo importante?" 
                          color="success" 
                        ></v-checkbox>
                      </v-col>
  
                      <!-- Aquí agregamos el campo para cargar archivos -->
                      <v-col cols="12" md="6">
                        <v-file-input 
                          v-model="editedItem.file" 
                          label="Seleccionar archivo" 
                          prepend-icon="mdi-paperclip"
                          accept="application/pdf, image/*, video/*"
                          variant="underlined"
                        ></v-file-input>
                      </v-col>
                    </v-row>
                  </v-container>
                </v-card-text>
                <v-divider></v-divider>
                <v-card-actions>
                  <v-spacer></v-spacer>
                  <v-btn color="#DA7171" variant="flat" @click="close">Cancelar</v-btn>
                  <v-btn color="#03626C" variant="flat" @click="save">Aceptar</v-btn>
                </v-card-actions>
              </v-card>
            </v-dialog>
          </v-col>
        </v-row>
      </v-toolbar>
  
      <v-card-text>
        <v-text-field class="mt-1 mb-1" v-model="search" append-icon="mdi-magnify" label="Buscar" single-line
                hide-details>
        </v-text-field>
        <v-data-table :headers="headers" :search="search" :items="files" class="elevation-1">
          <template v-slot:item.actions="{ item }">
            <v-btn 
              density="comfortable" 
              icon="mdi-pencil" 
              @click="editItem(item)" 
              color="#5D89E9" 
              variant="tonal" 
              elevation="1" 
              title="Editar Archivo"
            ></v-btn>
            <v-btn 
              density="comfortable" 
              icon="mdi-delete" 
              @click="deleteItem(item)" 
              color="red-darken-4" 
              variant="tonal" 
              elevation="1" 
              title="Eliminar Archivo"
            ></v-btn>
          </template>
        </v-data-table>
      </v-card-text>
    </v-card>
  </template>
  
  <script>
  export default {
    data: () => ({
      snackbar: false,
      sb_type: '',
      sb_message: '',
      sb_timeout: 2000,
      sb_title: '',
      sb_icon: '',
      dialog: false,
      input: null,
      menu: false,
      categories: ['Documentos', 'Imágenes', 'Videos', 'Otros'],
      headers: [
        { title: 'Título', value: 'title' },
        { title: 'Descripción', value: 'description' },
        { title: 'Fecha de Creación', value: 'createdDate' },
        { title: 'Categoría', value: 'category' },
        { title: 'Importante', value: 'isImportant' },
        { title: 'Acciones', value: 'actions', sortable: false },
      ],
      // Datos de ejemplo ya insertados
    files: [
      {
        title: 'Archivo de Proyecto',
        description: 'Descripción del archivo de proyecto',
        createdDate: '2024-11-30',
        category: 'Documentos',
        isImportant: true,
        file: URL.createObjectURL(new Blob(['Contenido del archivo'], { type: 'text/plain' })),  // Simulando un archivo
      },
      {
        title: 'Foto de Evento',
        description: 'Foto del evento de lanzamiento',
        createdDate: '2024-10-25',
        category: 'Imágenes',
        isImportant: false,
        file: URL.createObjectURL(new Blob(['Imagen del evento'], { type: 'image/jpeg' })),  // Simulando una imagen
      },
      {
        title: 'Video Tutorial',
        description: 'Video tutorial de instalación',
        createdDate: '2024-09-15',
        category: 'Videos',
        isImportant: false,
        file: URL.createObjectURL(new Blob(['Video tutorial'], { type: 'video/mp4' })),  // Simulando un video
      },
    ],
      editedItem: {
        title: '',
        description: '',
        createdDate: '',
        category: '',
        isImportant: false,
        file: null,  // Agregar para almacenar el archivo cargado
      },
      defaultItem: {
        title: '',
        description: '',
        createdDate: '',
        category: '',
        isImportant: false,
        file: null,
      },
      editedIndex: -1,
      search: '',
    }),
    computed: {
      formTitle() {
        return this.editedIndex === -1 ? 'Agregar Nuevo Archivo' : 'Editar Archivo';
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
  methods: {
    updateDate(val) {
      this.input = val;
      this.editedItem.createdDate = this.dateFormatted;
      this.menu = false;
    },
      close() {
        this.dialog = false;
        this.$nextTick(() => {
          this.editedItem = Object.assign({}, this.defaultItem);
        });
      },
      save() {
        if (this.editedItem.file) {
          // Simular agregar archivo localmente (sin backend)
          const fileData = {
            ...this.editedItem,
            createdDate: new Date().toLocaleDateString(),
            file: URL.createObjectURL(this.editedItem.file), // Simula una URL temporal del archivo
          };
          this.files.push(fileData); // Agregar archivo a la lista
          this.close();
        }
      },
      editItem(item) {
        this.editedIndex = this.files.indexOf(item);
        this.editedItem = Object.assign({}, item);
        this.dialog = true;
      },
      deleteItem(item) {
        const index = this.files.indexOf(item);
        if (confirm('¿Estás seguro de que quieres eliminar este archivo?')) {
          this.files.splice(index, 1);
        }
      },
    },
  };
  </script>
  