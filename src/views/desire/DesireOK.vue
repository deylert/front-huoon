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
            <span class="text-subtitle-1"><strong>Lista de Deseos Personales</strong></span>
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
                  Agregar Nuevo Deseo
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
                          label="Título del Deseo" 
                          prepend-icon="mdi-star" 
                          variant="underlined"
                        ></v-text-field>
                      </v-col>
                      <v-col cols="12" md="6">
                        <v-text-field 
                          v-model="editedItem.description" 
                          clearable 
                          label="Descripción del Deseo" 
                          prepend-icon="mdi-pencil" 
                          variant="underlined"
                        ></v-text-field>
                      </v-col>
                      <v-col cols="12" md="6">
                        <v-menu v-model="menu" :close-on-content-click="false" :nudge-right="40" transition="scale-transition"
                            offset-y min-width="290px">
                          <template v-slot:activator="{ props }">
                            <v-text-field v-bind="props" :modelValue="dateFormatted" variant="underlined"
                              prepend-icon="mdi-calendar" label="Fecha Estimada para Cumplirlo"></v-text-field>
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
                          v-model="editedItem.priority"
                          :items="priorities"
                          label="Prioridad"
                          prepend-icon="mdi-alert-circle"
                          variant="underlined"
                        ></v-select>
                      </v-col>
                      <v-col cols="12" md="6">
                        <v-checkbox 
                          v-model="editedItem.isFulfilled" 
                          label="Deseo cumplido?" 
                          color="success" 
                        ></v-checkbox>
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
        <v-data-table :headers="headers" :search="search" :items="wishes" class="elevation-1" style="max-height: 68vh; overflow-y: auto;" :items-per-page-text="'Elementos por páginas'" no-data-text="No hay datos disponibles">
          <template v-slot:item.actions="{ item }">
            <v-btn 
              density="comfortable" 
              icon="mdi-pencil" 
              @click="editItem(item)" 
              color="#5D89E9" 
              variant="tonal" 
              elevation="1" 
              title="Editar Deseo"
            ></v-btn>
            <v-btn 
              density="comfortable" 
              icon="mdi-delete" 
              @click="deleteItem(item)" 
              color="red-darken-4" 
              variant="tonal" 
              elevation="1" 
              title="Eliminar Deseo"
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
      priorities: ['Alta', 'Media', 'Baja'],
      headers: [
        { title: 'Título', value: 'title' },
        { title: 'Descripción', value: 'description' },
        { title: 'Fecha Estimada', value: 'estimatedDate' },
        { title: 'Prioridad', value: 'priority' },
        { title: 'Cumplido', value: 'isFulfilled' },
        { title: 'Acciones', value: 'actions', sortable: false },
      ],
      wishes: [
  { title: 'Viajar a Japón', description: 'Conocer Tokio y Kyoto', estimatedDate: '2025-10-15', priority: 'Alta', isFulfilled: false },
  { title: 'Aprender a tocar guitarra', description: 'Tomar clases de guitarra acústica', estimatedDate: '2024-12-01', priority: 'Media', isFulfilled: false },
  { title: 'Comprar una casa', description: 'Adquirir una casa cerca del lago', estimatedDate: '2030-06-30', priority: 'Alta', isFulfilled: false },
  { title: 'Dominar un tercer idioma', description: 'Estudiar alemán hasta nivel B2', estimatedDate: '2026-05-01', priority: 'Alta', isFulfilled: false },
  { title: 'Correr un maratón', description: 'Completar un maratón oficial de 42 km', estimatedDate: '2025-03-20', priority: 'Media', isFulfilled: false },
  { title: 'Tener un huerto propio', description: 'Cultivar vegetales orgánicos en el jardín', estimatedDate: '2024-09-15', priority: 'Baja', isFulfilled: false },
  { title: 'Publicar un libro', description: 'Escribir y publicar una novela de ciencia ficción', estimatedDate: '2027-11-30', priority: 'Alta', isFulfilled: false },
  { title: 'Hacer paracaidismo', description: 'Experimentar un salto en paracaídas', estimatedDate: '2025-07-10', priority: 'Media', isFulfilled: false },
  { title: 'Tomar un curso de cocina', description: 'Aprender técnicas avanzadas de cocina', estimatedDate: '2024-11-01', priority: 'Media', isFulfilled: false },
  { title: 'Ahorrar para la jubilación', description: 'Crear un fondo de inversión estable', estimatedDate: '2035-01-01', priority: 'Alta', isFulfilled: false },
  { title: 'Visitar las auroras boreales', description: 'Viajar a Noruega para ver las auroras', estimatedDate: '2026-02-25', priority: 'Alta', isFulfilled: false },
  { title: 'Hacer voluntariado', description: 'Ayudar en una organización sin fines de lucro', estimatedDate: '2025-06-01', priority: 'Baja', isFulfilled: false },
  { title: 'Aprender a nadar', description: 'Tomar clases de natación', estimatedDate: '2024-08-15', priority: 'Media', isFulfilled: false },
  { title: 'Asistir a un concierto de mi banda favorita', description: 'Ver un concierto en vivo de Coldplay', estimatedDate: '2025-09-10', priority: 'Alta', isFulfilled: false },
  { title: 'Practicar yoga regularmente', description: 'Unirme a un grupo de yoga', estimatedDate: '2024-10-01', priority: 'Baja', isFulfilled: false }
],

      editedItem: {
        title: '',
        description: '',
        estimatedDate: '',
        priority: '',
        isFulfilled: false,
      },
      defaultItem: {
        title: '',
        description: '',
        estimatedDate: '',
        priority: '',
        isFulfilled: false,
      },
      editedIndex: -1,
      search: '',
    }),
    computed: {
      formTitle() {
        return this.editedIndex === -1 ? 'Agregar Nuevo Deseo' : 'Editar Deseo';
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
      this.editedItem.estimatedDate = this.dateFormatted;
      this.menu = false;
    },
      close() {
        this.dialog = false;
        this.$nextTick(() => {
          this.editedItem = Object.assign({}, this.defaultItem);
        });
      },
      save() {
        if (this.editedIndex === -1) {
          this.wishes.push(this.editedItem);
        } else {
          Object.assign(this.wishes[this.editedIndex], this.editedItem);
        }
        this.close();
      },
      editItem(item) {
        this.editedIndex = this.wishes.indexOf(item);
        this.editedItem = Object.assign({}, item);
        this.dialog = true;
      },
      deleteItem(item) {
        const index = this.wishes.indexOf(item);
        confirm('¿Estás seguro de eliminar este deseo?') && this.wishes.splice(index, 1);
      },
      updateDate(date) {
        this.editedItem.estimatedDate = date;
      },
    },
  };
  </script>
  