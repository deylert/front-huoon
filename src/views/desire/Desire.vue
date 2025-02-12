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
  
      <v-container>
      <v-card elevation="6" class="mx-5 w-100">
        <v-row align="center" class="pa-1">
          <v-col cols="12" md="8" class="grow ml-4">
            <span class="text-subtitle-1"><strong>Deseos</strong></span>
          </v-col>
          <v-col cols="12" md="3" class="text-right">
          <v-btn
            class="text-subtitle-1 ml-12"
            color="#03626C"
            variant="flat"
            elevation="2"
            prepend-icon="mdi-plus-circle"
            @click="add"
          >
            Agregar Nuevo Deseo
          </v-btn>
          </v-col>
        </v-row>
  
    <v-card-text>
      <v-row>
        <!-- Mostrar deseos por página -->
        <v-col
          v-for="(wish, index) in paginatedWishes"
          :key="index"
          cols="12"
          md="12"
        >
        <v-container>
          <v-card class="mx-0 my-3 card-style" elevation="3" max-width="100%">
            <v-row>
              <!-- Columna con icono -->
              <v-col cols="2" md="1" class="d-flex justify-center align-center">
                <v-avatar color="primary" size="45">
                  <v-icon>mdi-star</v-icon> <!-- Aquí el ícono deseado -->
                </v-avatar>
              </v-col>
              <v-col cols="11">
                <v-card-text>
                  <!-- Fila de datos con encabezados -->
                  <v-row>
                    <v-col cols="12" md="2">
                      <div><strong>Título:</strong></div>
                    </v-col>
                    <v-col cols="12" md="3">
                      <div><strong>Descripción:</strong></div>
                    </v-col>
                    <v-col cols="12" md="2">
                      <div><strong>Fecha Estimada:</strong></div>
                    </v-col>
                    <v-col cols="12" md="2">
                      <div><strong>Prioridad:</strong></div>
                    </v-col>
                    <v-col cols="12" md="2">
                      <div><strong>Cumplido:</strong></div>
                    </v-col>
                  </v-row>
                  <v-row>
                    <v-col cols="12" md="2">
                      <div>{{ wish.title }}</div>
                    </v-col>
                    <v-col cols="12" md="3">
                      <div>{{ wish.description }}</div>
                    </v-col>
                    <v-col cols="12" md="2">
                      <div>{{ wish.estimatedDate }}</div>
                    </v-col>
                    <v-col cols="12" md="2">
                      <div>{{ wish.priority }}</div>
                    </v-col>
                    <v-col cols="12" md="2">
                      <div>{{ wish.isFulfilled ? 'Sí' : 'No' }}</div>
                    </v-col>
                  </v-row>
                </v-card-text>
                <v-card-actions>
                  <!-- Botones de editar y eliminar -->
                  <v-btn @click="editItem(wish)" color="primary">Editar</v-btn>
                  <v-btn @click="deleteItem(wish)" color="red">Eliminar</v-btn>
                </v-card-actions>
              </v-col>
            </v-row>
          </v-card>
        </v-container>
        </v-col>
      </v-row>

      <!-- Paginación -->
      <v-pagination v-model="page" :length="pageCount" @input="loadPage" class="mt-4" />
    </v-card-text>
      </v-card>
  
      <!-- Dialogo para agregar nuevo deseo -->
      <v-dialog v-model="dialog" max-width="600px"> 
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
    </v-container>
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
      search: '',
      page: 1,  // Página actual
      perPage: 5,  // Elementos por página
      formTitle: 'Agregar Nuevo Deseo',
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
        { title: 'Tener un perro', description: 'Adoptar un perro de refugio', estimatedDate: '2024-12-01', priority: 'Alta', isFulfilled: false },
      ],
      editedItem: {
        title: '',
        description: '',
        estimatedDate: '',
        priority: 'Media',
        isFulfilled: false
      }
    }),
    computed: {
      filteredWishes() {
        return this.wishes.filter(wish =>
          wish.title.toLowerCase().includes(this.search.toLowerCase()) ||
          wish.description.toLowerCase().includes(this.search.toLowerCase())
        );
      },
      pageCount() {
        return Math.ceil(this.filteredWishes.length / this.perPage);
      },
      paginatedWishes() {
        const start = (this.page - 1) * this.perPage;
        const end = this.page * this.perPage;
        return this.filteredWishes.slice(start, end);
      }
    },
    methods: {
      editItem(wish) {
        this.editedItem = { ...wish };
        this.formTitle = 'Editar Deseo';
        this.dialog = true;
      },
      save() {
        if (this.formTitle === 'Agregar Nuevo Deseo') {
          this.wishes.push({ ...this.editedItem });
        } else {
          const index = this.wishes.findIndex(w => w.title === this.editedItem.title);
          if (index !== -1) {
            this.wishes.splice(index, 1, { ...this.editedItem });
          }
        }
        this.dialog = false;
      },
      deleteItem(wish) {
        const index = this.wishes.indexOf(wish);
        if (index !== -1) {
          this.wishes.splice(index, 1);
        }
      },
      close() {
        this.dialog = false;
      },
      add() {
        this.dialog = true;
      },
      updateDate(date) {
        this.editedItem.estimatedDate = date;
      },
      loadPage() {
        // Esta función se puede personalizar para realizar alguna acción cada vez que cambie la página
      }
    }
  };
  </script>

  <style scoped>
.card-style{
  border-radius: 16px; /* Redondear las esquinas */
  overflow: hidden; /* Asegura que los contenidos no sobresalgan de las esquinas redondeadas */
}
.v-card-text {
  font-size: 14px;
}
.v-btn {
  font-size: 14px;
}
.v-avatar {
  background-color: #4caf50;
}
</style>
  