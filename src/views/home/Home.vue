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
  <!--<v-container fluid fill-height>-->
  <v-card elevation="6" class="mx-2">
    <v-toolbar color="#03626C">
      <v-row align="center">
        <v-col cols="12" md="8" class="grow ml-4">
          <span class="text-subtitle-1"><strong>Listado de Hogares</strong></span>
        </v-col>
        <v-col cols="12" md="3" class="text-right">
          <v-btn class="text-subtitle-1 ml-12" color="white" variant="tonal" elevation="2"
            prepend-icon="mdi-plus-circle" @click="showAdd">
            Agregar Nuevo Hogar
          </v-btn>
        </v-col>
      </v-row>
    </v-toolbar>

    <v-card-text>
      <v-text-field class="mt-1 mb-1" v-model="search" append-icon="mdi-magnify" label="Buscar" single-line
        hide-details>
      </v-text-field>
      <v-data-table :headers="headers" :search="search" :items="homes" class="elevation-1"
        style="max-height: 68vh; overflow-y: auto;" :items-per-page-text="'Elementos por páginas'"
        no-data-text="No hay datos disponibles" :loading="loading" loading-text="Cargando datos...">
        <template v-slot:item.actions="{ item }">
          <v-btn density="comfortable" icon="mdi-pencil" @click="editItem(item)" color="#1976D2" variant="tonal"
            elevation="1" title="Editar Tarea" :loading="btnLoading"></v-btn>
          <v-btn density="comfortable" icon="mdi-delete" @click="deleteItem(item)" color="#DA7171" variant="tonal"
            elevation="1" title="Eliminar Tarea"></v-btn>
        </template>
        <template v-slot:item.name="{ item }">
          <v-avatar class="mr-1" elevation="3" color="grey-lighten-4" size="large">
            <v-img :src="`${this.$axios.defaults.baseURL}images/${item.image}?t=${Date.now()}`" alt="image"></v-img>
          </v-avatar><!--+'?$'+Date.now()-->
          {{ item.name }}
        </template>
        <template v-slot:item.people="{ item }">
          <div class="avatar-row">
            <!-- Mostrar los avatares de las personas con tooltip -->
            <v-tooltip v-for="person in item.people" :key="person.id" bottom content-class="custom-tooltip">
              <template v-slot:activator="{ props }">
                <v-avatar class="avatar-item hover-expand" size="32" elevation="3" v-bind="props">
                  <v-img :src="`${this.$axios.defaults.baseURL}images/${person.image}?t=${Date.now()}`" alt="image" />
                </v-avatar>
              </template>
              <!-- Información en el tooltip -->
              <span>{{ person.name }}</span>
              <v-spacer></v-spacer>
              <span class="text-secondary">{{ person.roleName }}</span> <!-- Segundo dato -->
            </v-tooltip>
            <!-- Ícono de "más" para agregar una nueva persona -->
            <v-tooltip bottom content-class="custom-tooltip">
              <template v-slot:activator="{ props }">
                <v-btn density="comfortable" icon="mdi-plus" @click="addPeople(item)" bg-color="white" color="#03626C"
                  size="32" elevation="3" v-bind="props"></v-btn>
              </template>
              <span class="text-secondary">Agregar persona</span>
            </v-tooltip>
          </div>
        </template>
      </v-data-table>
    </v-card-text>
  </v-card>
  <!--</v-container>-->

  <!--<v-dialog v-model="dialog" max-width="600px">
    <v-form ref="form" v-model="valid">
      <v-card>
        <v-toolbar color="#03626C">
          <span class="text-subtitle-2 ml-4">{{ formTitle }}</span>
        </v-toolbar>
        <v-card-text>
          <v-container>
            <v-row>
              <v-col cols="12" md="6">
                <v-text-field v-model="editedItem.title" clearable label="Título" prepend-icon="mdi-tag-outline"
                  variant="underlined" :rules="nameRules"></v-text-field>
              </v-col>
              <v-col cols="12" md="12">
                <v-textarea v-model="editedItem.description" clearable label="Descripción" prepend-icon="mdi-note"
                  variant="underlined"></v-textarea>
              </v-col>
            </v-row>
            
            <v-row>
              <v-col cols="12" md="6">
                <v-file-input clearable v-model="file" ref="fileInput" label="Imagen de la Tarea" variant="underlined"
                  density="compact" name="file" accept=".png, .jpg, .jpeg" @change="onFileSelected">
                </v-file-input>
              </v-col>
              <v-col cols="12" md="6">
                <v-card elevation="6" class="mx-auto" max-width="210" max-height="120">
                  <img v-if="imagenDisponible()" :src="imgedit" height="120" width="210">
                </v-card>


              </v-col>
            </v-row>
          </v-container>
        </v-card-text>
        <v-divider></v-divider>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="#DA7171" variant="flat" @click="close">Cancelar</v-btn>
          <v-btn color="#03626C" variant="flat" :loading="loading" @click="save" :disabled="!valid">Aceptar</v-btn>
        </v-card-actions>
      </v-card>
    </v-form>
  </v-dialog>-->

  <v-dialog v-model="dialog" max-width="800px">
    <v-form ref="form" v-model="valid">
      <v-card>
        <v-toolbar color="#03626C">
          <span class="text-subtitle-2 ml-4">{{ formTitle }}</span>
        </v-toolbar>

        <v-card-text>
          <!-- Pestañas -->
          <v-tabs v-model="tab" vertical>
            <!-- Pestañas -->
            <v-tab value="general" :class="tab === 'general' ? 'selected-tab' : ''">Generales</v-tab>
            <v-tab value="people" :class="tab === 'people' ? 'selected-tab' : ''">Personas</v-tab>
          </v-tabs>
          <!-- Contenido de las pestañas -->
          <v-window v-model="tab" min-height="50vh" class="mt-2">
            <!-- Pestaña de Generales -->
            <v-window-item value="general">
              <v-row>
                <v-col cols="12" md="6">
                  <v-text-field v-model="editedItem.name" clearable label="Nombre" prepend-icon="mdi-account-outline"
                    variant="underlined" :rules="nameRules"></v-text-field>
                </v-col>
                <v-col cols="12" md="6">
                  <v-text-field v-model="editedItem.address" clearable label="Dirección"
                    prepend-icon="mdi-map-marker-outline" variant="underlined"></v-text-field>
                </v-col>
                <v-col cols="12" md="6">
                  <v-autocomplete :no-data-text="'No hay datos disponibles'" v-model="editedItem.status_id"
                    :items="status" label="Estado" prepend-icon="mdi-flag-outline" item-title="nameStatus"
                    item-value="id" variant="underlined" density="compact" :rules="selectRules">
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
                  <v-select v-model="editedItem.home_type_id" :items="hometypes" item-title="name" item-value="id"
                    label="Tipo de Hogar" variant="underlined" density="compact" :rules="selectRules"
                    prepend-icon="mdi-home-outline">
                    <template v-slot:item="{ props, item }">
                      <v-list-item v-bind="props" :subtitle="item.raw.description"></v-list-item>
                    </template>
                  </v-select>
                </v-col>
              </v-row>
              <v-row>
                <v-col cols="12" md="4">
                  <v-text-field v-model="editedItem.geo_location" clearable label="Geolocación" prepend-icon="mdi-earth"
                    density="compact" variant="underlined"></v-text-field>
                </v-col>
                <v-col cols="12" md="4">
                  <v-text-field v-model="editedItem.residents" label="Residentes" type="number" variant="underlined"
                    density="compact" prepend-icon="mdi-human-male-female">
                  </v-text-field>
                </v-col>
                <v-col cols="12" md="4">
                  <v-text-field v-model="editedItem.timezone" label="Zono Horaria" variant="underlined"
                    density="compact" prepend-icon="mdi-clock-outline">
                  </v-text-field>
                </v-col>
              </v-row>
              <v-row>
                <v-col cols="12" md="6">
                  <v-file-input clearable v-model="file" ref="fileInput" label="Imagen del Hogar" variant="underlined"
                    density="compact" name="file" accept=".png, .jpg, .jpeg" prepend-icon="mdi-image-outline"
                    @change="onFileSelected">
                  </v-file-input>
                </v-col>
                <v-col cols="12" md="6">
                  <v-card elevation="6" class="mx-auto" max-width="210" max-height="120">
                    <img v-if="imagenDisponible()" :src="imgedit" height="120" width="210">
                  </v-card>
                </v-col>
              </v-row>
            </v-window-item>
            <!-- Pestaña de Personas -->
            <v-window-item value="people">
              <v-card elevation="3" class="mx-2">
                <v-toolbar color="#03626C">
                  <v-row align="center">
                    <v-col cols="12" md="8" class="grow ml-4">
                      <span class="text-subtitle-1"><strong>Relación de personas</strong></span>
                    </v-col>
                    <v-col cols="12" md="3" class="text-right">
                      <v-btn class="text-subtitle-1 ml-10" color="white" variant="tonal" elevation="2"
                        prepend-icon="mdi-plus-circle" @click="showAssiegnedPeople">
                        Asignar Personas
                      </v-btn>
                    </v-col>
                  </v-row>
                </v-toolbar>

                <v-card-text>
                  <v-data-table :headers="headersPeople" :items="editedItem.people" class="elevation-1"
                    style="max-height: 68vh; overflow-y: auto;" :items-per-page-text="'Elementos por páginas'"
                    no-data-text="No hay datos disponibles" :loading="loading" loading-text="Cargando datos...">
                    <template v-slot:item.actions="{ item }">
                      <v-btn density="comfortable" icon="mdi-pencil" @click="editItemPeople(item)" color="#1976D2"
                        variant="tonal" elevation="1" title="Editar Relación"></v-btn>
                      <v-btn density="comfortable" icon="mdi-delete" @click="deleteItemPeople(item)" color="#DA7171"
                        variant="tonal" elevation="1" title="Eliminar Relación"></v-btn>
                    </template>
                    <template v-slot:item.name="{ item }">
                      <v-avatar class="mr-1" elevation="3" color="grey-lighten-4" size="large">
                        <v-img :src="`${this.$axios.defaults.baseURL}images/${item.image}?t=${Date.now()}`"
                          alt="image"></v-img>
                      </v-avatar><!--+'?$'+Date.now()-->
                      {{ item.name }}
                    </template>
                  </v-data-table>
                </v-card-text>
              </v-card>
            </v-window-item>
          </v-window>
        </v-card-text>

        <v-divider></v-divider>

        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="#DA7171" variant="flat" @click="close">Cancelar</v-btn>
          <v-btn color="#03626C" variant="flat" :loading="loading" @click="save"
            :disabled="(!valid || !editedItem.people.length)">Aceptar</v-btn>
        </v-card-actions>
      </v-card>
    </v-form>
  </v-dialog>
  <v-dialog v-model="dialogDelete" max-width="500px">
    <v-card>
      <v-toolbar color="#DA7171">
        <span class="text-subtitle-2 ml-4"> Eliminar un hogar</span>
      </v-toolbar>
      <v-card-text class="mt-2 mb-2"> ¿Desea eliminar el hogar?</v-card-text>
      <v-divider></v-divider>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn color="#DA7171" variant="flat" @click="closeDelete">Cancelar</v-btn>
        <v-btn color="#03626C" variant="flat" :loading="loading" @click="deleteItemConfirm">Aceptar</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>

  <v-dialog v-model="dialogAssignedPeople" max-width="400px">
    <v-form ref="form" v-model="valid" enctype="multipart/form-data">
      <v-card>
        <v-toolbar color="#03626C">
          <span class="text-subtitle-2 ml-4">{{ formTitlePerson }}</span>
        </v-toolbar>
        <v-card-text>
          <v-container>
            <v-row>
              <v-col cols="12" md="12">
                <v-autocomplete :no-data-text="'No hay datos disponibles'" v-model="selectedPerson" :items="people"
                  label="Personas" prepend-icon="mdi-account" item-title="namePerson" item-value="id"
                  variant="underlined" :rules="selectRules">
                  <template v-slot:item="{ props, item }">
                    <v-list-item v-bind="props"
                      :prepend-avatar="`${this.$axios.defaults.baseURL}images/${item.raw.imagePerson}`"
                      :title="item.raw.namePerson">
                    </v-list-item>
                  </template>
                </v-autocomplete>
                <v-select v-model="selectedRole" :items="roles" item-title="nameRol" item-value="id" label="Rol"
                  variant="underlined" density="compact" :rules="selectRules" prepend-icon="mdi-briefcase">
                  <template v-slot:item="{ props, item }">
                    <v-list-item v-bind="props" :subtitle="item.raw.descriptionRol"></v-list-item>
                  </template>
                </v-select>
              </v-col>
            </v-row>
          </v-container>
        </v-card-text>
        <v-divider></v-divider>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="#DA7171" variant="flat" @click="closeAssignedPeople">Cancelar</v-btn>
          <v-btn color="#03626C" variant="flat" @click="saveAssignedPeople" :disabled="!valid">Aceptar</v-btn>
        </v-card-actions>
      </v-card>
    </v-form>
  </v-dialog>

  <v-dialog v-model="dialogAddPeople" max-width="400px">
    <v-form ref="form" v-model="valid" enctype="multipart/form-data">
      <v-card>
        <v-toolbar color="#03626C">
          <span class="text-subtitle-2 ml-4">Agregar Persona al Hogar</span>
        </v-toolbar>
        <v-card-text>
          <v-container>
            <v-row>
              <v-col cols="12" md="12">
                <v-autocomplete :no-data-text="'No hay datos disponibles'" v-model="person_id" :items="people"
                  label="Personas" prepend-icon="mdi-account" item-title="namePerson" item-value="id"
                  variant="underlined" :rules="selectRules">
                  <template v-slot:item="{ props, item }">
                    <v-list-item v-bind="props"
                      :prepend-avatar="`${this.$axios.defaults.baseURL}images/${item.raw.imagePerson}`"
                      :title="item.raw.namePerson">
                      <v-list-item-subtitle class="d-flex flex-column" v-if="item.raw.roleName">
                        <div>Rol: {{ item.raw.roleName }}</div>
                      </v-list-item-subtitle>
                    </v-list-item>
                  </template>
                </v-autocomplete>
                <v-select v-model="role_id" :items="roles" item-title="nameRol" item-value="id" label="Rol"
                  variant="underlined" density="compact" :rules="selectRules" prepend-icon="mdi-briefcase">
                  <template v-slot:item="{ props, item }">
                    <v-list-item v-bind="props" :subtitle="item.raw.descriptionRol"></v-list-item>
                  </template>
                </v-select>
              </v-col>
            </v-row>
          </v-container>
        </v-card-text>
        <v-divider></v-divider>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="#DA7171" variant="flat" @click="closeAddPeople">Cancelar</v-btn>
          <v-btn color="#03626C" variant="flat" @click="saveAddPeople" :disabled="!valid"
            :loading="loading">Aceptar</v-btn>
        </v-card-actions>
      </v-card>
    </v-form>
  </v-dialog>
</template>

<script>
import { handleRequest } from "@/utils/api"; // Ruta al archivo
import _ from 'lodash';
export default {
  data: () => ({
    snackbar: false,
    sb_type: '',
    sb_message: '',
    sb_timeout: 2000,
    sb_title: '',
    sb_icon: '',
    valid: true,
    loading: false,
    btnLoading: false,
    dialog: false,
    dialogAssignedPeople: false,
    dialogDelete: false,
    file: null,
    imgMiniatura: '',
    homes: [],
    hometypes: [],
    status: [],
    people: [],
    tittlePerson: -1,
    persons: [],
    roles: [],
    data: {},
    person_id: null,
    role_id: null,
    dialogAddPeople: false,
    selectedPerson: null, // Persona seleccionada en el formulario
    selectedRole: null,   // Rol seleccionado en el formulario
    selectedHome: null,   // Rol seleccionado en el formulario
    headers: [
      { title: 'Nombre', value: 'name', width: '20%' },
      { title: 'Dirección', value: 'address', width: '30%' },
      { title: 'Personas', value: 'people', width: '15%' },
      { title: 'Tipo', value: 'nameHomeType', width: '10%' },
      { title: 'Estado', value: 'nameStatus', width: '10%' },
      { title: 'Acciones', value: 'actions', sortable: false, width: '15%' },
    ],
    headersPeople: [
      { title: 'Nombre', value: 'name', width: '60%' },
      { title: 'Rol', value: 'roleName', width: '20%' },
      { title: 'Acciones', value: 'actions', sortable: false, width: '20%' },
    ],
    editedItem: {
      id: '',
      name: '',
      address: '',
      home_type_id: '',
      status_id: '',
      person_id: null,
      residents: '',
      geo_location: '',
      timezone: '',
      image: null,
      people: [],
    },

    defaultItem: {
      id: '',
      name: '',
      address: '',
      home_type_id: '',
      status_id: '',
      person_id: null,
      residents: '',
      geo_location: '',
      timezone: '',
      image: null,
      people: [],
    },

    originalItem: {
      id: '',
      name: '',
      address: '',
      home_type_id: '',
      status_id: '',
      person_id: null,
      residents: '',
      geo_location: '',
      timezone: '',
      image: null,
      people: [],
    },

    tab: null,
    menu: false,
    menu2: false,
    input: null,
    input2: null,
    editedIndex: -1,
    search: '',
    nameRules: [
      (v) => !!v || "El campo es requerido",
      (v) => (v && v.length <= 50) ||
        "El campo debe tener menos de 51 caracteres",
      (v) => (v && v.length >= 3) ||
        "El campo debe tener al menos de 3 caracteres",
    ],
    selectRules: [(v) => !!v || "Seleccionar al menos un elemento"],
  }),
  computed: {
    formTitle() {
      return this.editedIndex === -1 ? 'Agregar Nuevo Hogar' : 'Editar Hogar';
    },
    formTitlePerson() {
      return this.tittlePerson === -1 ? 'Asignar Personas al Hogar' : 'Editar rol de la persona';
    },
    imgedit() {
      return this.imgMiniatura;
    },
  },
  mounted() {
    this.initialize();
  },
  methods: {
    isImage(icon) {
      // Validar si el valor es una URL válida (puedes personalizar esta lógica)
      return typeof icon === "string" &&
        (icon.startsWith("http") || /\.(png|jpe?g|gif|svg|webp)$/i.test(icon));
    },
    getIconName(icon) {
      if (!icon) return 'mdi-help-circle'; // Ícono por defecto si no hay valor
      // Si el ícono tiene el prefijo "MdiIcons.", extraer solo el nombre
      if (icon.startsWith('MdiIcons.')) {
        return `mdi-${icon.split('.')[1].toLowerCase()}`;
      }
      // Si el ícono ya está en formato "mdi-*", devolverlo tal cual
      if (icon.startsWith('mdi-')) {
        return icon;
      }
      // En otros casos, devolver un ícono por defecto
      return 'mdi-help-circle';
    },
    async showAssiegnedPeople() {
      this.tittlePerson = -1;
      // Filtrar las personas que no están en editedItem.people usando el 'id' para la comparación
      this.people = this.people.filter(person => {
        // Verificar si la persona no está en editedItem.people
        return !this.editedItem.people.some(editedPerson => editedPerson.id === person.id);
      });
      this.dialogAssignedPeople = true;
    },
    async showAdd() {
      this.file = null,
        this.editedIndex = -1;
      this.imgMiniatura = '',
        this.data = {};
      try {
        const result = await handleRequest({
          endpoint: 'hometype-status-people-apk',
          method: 'GET'
        });

        if (result.success) {
          // Si la solicitud es exitosa, asignamos las sucursales
          this.status = result.data?.homestatus || [];
          this.people = result.data?.homepeople || [];
          this.roles = result.data?.homeroles || [];
          this.hometypes = result.data?.hometypes || [];
        } else {
          // Si no hay datos, asignamos un array vacío
          this.status = [];
          this.people = [];
          this.roles = [];
          this.hometypes = [];
          this.showAlert('info', result.message || 'No hay datos disponibles.', 3000);
        }
      } catch (error) {
        this.showAlert('error', 'Ocurrió un error inesperado al cargar los datos.', 3000);
      } finally {
        this.dialog = true;
      }
    },
    close() {
      this.dialog = false;
      this.$nextTick(() => {
        this.editedItem = Object.assign({}, this.defaultItem);
        this.originalItem = Object.assign({}, this.defaultItem);
      });
      this.file = null;
      this.imgMiniatura = "";
      this.editedIndex = -1;
    },
    closeAssignedPeople() {
      this.dialogAssignedPeople = false;
      this.selectedPerson = null;
      this.selectedRole = null;
      this.tittlePerson = -1;
    },
    saveAssignedPeople() {
      if (this.selectedPerson && this.selectedRole) {
        const person = this.people.find(p => p.id === this.selectedPerson);
        const role = this.roles.find(r => r.id === this.selectedRole);

        if (!person || !role) {
          console.error("Persona o rol no encontrado.");
          return;
        }

        // Crear un nuevo objeto con los datos actuales
        const newPerson = {
          id: person.id,
          name: person.namePerson,
          image: person.imagePerson,
          roleId: role.id,
          roleName: role.nameRol,
        };
        // Verificar si la relación ya existe en editedItem.people
        const existingPersonIndex = this.editedItem.people.findIndex(p =>
          p.id === newPerson.id);

        if (existingPersonIndex === -1) {
          // No existe, por lo tanto, se agrega uno nuevo
          this.editedItem.people.push(newPerson);
        } else {
          // Existe, por lo tanto se edita el existente
          this.editedItem.people.splice(existingPersonIndex, 1, newPerson); // Actualiza el elemento en el array
        }
      }

      // Reiniciar selección y cerrar diálogo
      this.closeAssignedPeople();
    },
    editItemPeople(item) {
      this.selectedPerson = item.id;
      this.selectedRole = item.roleId;
      this.dialogAssignedPeople = true;
      this.tittlePerson = 1;
    },
    deleteItemPeople(item) {
      const index = this.editedItem.people.findIndex(p => p.id === item.id);
      if (index !== -1) {
        this.editedItem.people.splice(index, 1);
      }
    },
    async initialize() {
      this.data = {};
      try {
        this.loading = true;
        const result = await handleRequest({
          endpoint: 'person-homes',
          method: 'POST'
        });

        if (result.success) {
          // Si la solicitud es exitosa, asignamos las sucursales
          this.homes = result.data?.homes || []; // Si no hay roles, asigna un arreglo vacío
        } else {
          // Si no hay datos, asignamos un array vacío
          this.homes = [];
          this.showAlert('success', result.message || 'No hay hogares disponibles.', 3000);
        }
      } catch (error) {
        this.loading = false;
        // Captura de errores no controlados
        this.showAlert('error', 'Ocurrió un error inesperado al cargar las tareas.', 3000);
      } finally {
        this.loading = false;
      }
    },
    getTypeIcon(type) {
      switch (type) {
        case 'home':
          return 'mdi-clipboard-text'; // Ícono para tareas
        case 'Sistema':
          return 'mdi-cog'; // Ícono para productos
        case 'Home':
          return 'mdi-home'; // Ícono para hogar
        default:
          return 'mdi-help-circle'; // Ícono por defecto
      }
    },
    getTypeDetails(type) {
      switch (type) {
        case 'home':
          return { icon: 'mdi-clipboard-text', name: 'Tarea' }; // Ícono y nombre para tareas
        case 'Sistema':
          return { icon: 'mdi-cog', name: 'Sistema' }; // Ícono y nombre para sistema
        case 'Home':
          return { icon: 'mdi-home', name: 'Hogar' }; // Ícono y nombre para hogar
        default:
          return { icon: 'mdi-help-circle', name: 'Desconocido' }; // Ícono y nombre por defecto
      }
    },
    getTypeColor(type) {
      switch (type) {
        case 'Task':
          return '#FFB300'; // Color sugerente para tareas (amarillo)
        case 'Sistema':
          return '#43A047'; // Color sugerente para productos (verde)
        case 'Home':
          return '#03626C'; // Color base para hogar
        default:
          return '#E0E0E0'; // Color gris claro para otros tipos
      }
    },
    async save() {
      this.loading = true;
      if (this.editedIndex === -1) {
        this.valid = false;
        const fieldsToUpdate = [
          'name', 'address', 'home_type_id', 'status_id', 'category_id', 'residents', 'geo_location', 'timezone', 'people', 'image'
        ];
        let updatedFields = Object.keys(this.editedItem)
          .filter((key) => fieldsToUpdate.includes(key) && this.editedItem[key] !== this.originalItem[key])
          .reduce((obj, key) => {
            if (key === 'people') {
              // Transformar el campo `people`
              obj[key] = this.editedItem.people.map(person => ({
                person_id: Number(person.id),       // Asegurar que sea un número
                role_id: Number(person.roleId),
                roleName: person.roleName
              }));
            } else {
              obj[key] = this.editedItem[key];
            }
            return obj;
          }, {});

        // Agregar campos adicionales si es necesario
        if (Object.keys(updatedFields).length > 0) {

          if (this.file) {
            updatedFields.image = this.editedItem.image;
          }

          // Crear el objeto FormData
          const formData = new FormData();
          for (let key in updatedFields) {
            if (key === 'people') {
              // Agregar cada elemento del array `people` al FormData
              updatedFields[key].forEach((person, index) => {
                for (const [personKey, value] of Object.entries(person)) {
                  formData.append(`people[${index}][${personKey}]`, value);
                }
              });
            } else {
              formData.append(key, updatedFields[key]);
            }
          }

          try {
            const result = await handleRequest({
              endpoint: 'home',
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
          this.showAlert("success", "Debe completar los datos del hogar.", 3000);
        }
      } else {
        this.valid = false;
        const fieldsToUpdate = [
          'name', 'address', 'home_type_id', 'status_id', 'category_id', 'residents', 'geo_location', 'timezone', 'people', 'image'
        ];

        let updatedFields = Object.keys(this.editedItem)
          .filter((key) => fieldsToUpdate.includes(key) && (
            key !== 'people' ? this.editedItem[key] !== this.originalItem[key] :
              this.arePeopleDifferent(this.originalItem[key], this.editedItem[key]) // Compara el array people
          ))
          .reduce((obj, key) => {
            if (key === 'people') {
              // Transformar el campo `people`
              obj[key] = this.editedItem.people.map(person => ({
                person_id: person.id ? Number(person.id) : Number(person.id),       // Asegurar que sea un número
                role_id: Number(person.roleId),            // Asegurar que sea un número
                roleName: person.roleName
              }));
            } else {
              obj[key] = this.editedItem[key];
            }
            return obj;
          }, {});
        if (Object.keys(updatedFields).length > 0) {
          updatedFields.id = this.editedItem.id;
          if (this.file) {
            updatedFields.image = this.editedItem.image;
          }
          const formData = new FormData();
          for (let key in updatedFields) {
            if (key === 'people') {
              // Agregar cada elemento del array `people` al FormData
              updatedFields[key].forEach((person, index) => {
                for (const [personKey, value] of Object.entries(person)) {
                  formData.append(`people[${index}][${personKey}]`, value);
                }
              });
            } else {
              formData.append(key, updatedFields[key]);
            }
          }
          try {
            const result = await handleRequest({
              endpoint: 'home-update',
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
              this.editedIndex = -1;
              this.showAlert("warning", result.message, 3000);
            }
          } catch (error) {
            this.loading = false;
            this.editedIndex = -1;
            // Este bloque captura errores inesperados fuera del manejo estándar
            this.showAlert("error", "Ocurrió un error inesperado al procesar la solicitud.", 3000);
          }
        } else {
          this.editedIndex = -1;
          this.loading = false;
          this.showAlert("success", "No se realizaron cambios.", 3000);
        }
      }
      this.close();
    },
    arePeopleDifferent(originalPeople, editedPeople) {
      // Convertir ambos arrays en cadenas de texto para una comparación profunda
      const sortedOriginal = [...originalPeople].sort((a, b) => a.id - b.id);
      const sortedEdited = [...editedPeople].sort((a, b) => a.id - b.id);
      // Comparar las cadenas generadas
      return JSON.stringify(sortedOriginal) !== JSON.stringify(sortedEdited);
    },
    async editItem(item) {
      this.editedIndex = 1;
      this.btnLoading = true;
      // Filtrar las personas que tengan 'select' igual a 1
      //const selectedPeople = item.people.filter(person => person.select === 1);

      // Asignar a originalItem y editedItem solo las personas seleccionadas
      this.originalItem = _.cloneDeep(item);
      this.editedItem = _.cloneDeep(item);

      // Asignamos las personas seleccionadas a las propiedades 'people' de los dos objetos
      //this.originalItem.people = _.cloneDeep(selectedPeople); // Aseguramos una copia profunda
      //this.editedItem.people = _.cloneDeep(selectedPeople); // Aseguramos una copia profunda
      this.file = null;
      // Crear la imagen y configurar el src
      const img = new Image();
      img.src = `${this.$axios.defaults.baseURL}images/${item.image}`; // Se asume que item.image_url es la URL de la imagen

      // Usar una función asíncrona para manejar la carga de la imagen
      img.onload = async () => {
        try {
          // Asignar la imagen cargada a imgMiniatura
          this.imgMiniatura = `${this.$axios.defaults.baseURL}images/${item.image}`;
        } catch (error) {
          console.error('Error al cargar la imagen', error);
          this.showAlert('error', 'Error al cargar la imagen.', 3000);
        }
      };
      this.data = {};
      try {
        const result = await handleRequest({
          endpoint: 'hometype-status-people-apk',
          method: 'GET'
        });

        if (result.success) {
          // Si la solicitud es exitosa, asignamos las sucursales
          this.status = result.data?.homestatus || [];
          this.people = result.data?.homepeople || [];
          this.roles = result.data?.homeroles || [];
          this.hometypes = result.data?.hometypes || [];
        } else {
          // Si no hay datos, asignamos un array vacío
          this.status = [];
          this.people = [];
          this.roles = [];
          this.hometypes = [];
          this.btnLoading = false;
          this.showAlert('info', result.message || 'No hay datos disponibles.', 3000);
        }
      } catch (error) {
        this.btnLoading = false;
        this.showAlert('error', 'Ocurrió un error inesperado al cargar los datos.', 3000);
      } finally {
        this.dialog = true;
        this.btnLoading = false;
      }
    },
    deleteItem(item) {
      this.editedIndex = 1;
      this.editedItem.id = item.id;
      this.dialogDelete = true;
    },
    closeDelete() {
      this.dialogDelete = false
      this.$nextTick(() => {
        this.editedItem = Object.assign({}, this.defaultItem);
        this.originalItem = Object.assign({}, this.defaultItem);
      })
    },
    async deleteItemConfirm() {
      this.loading = true;
      try {
        let request = {
          id: this.editedItem.id
        };
        const result = await handleRequest({
          endpoint: 'home-destroy',
          method: 'POST',
          data: request
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
        // Este bloque captura errores inesperados fuera del manejo estándar
        this.showAlert("error", "Ocurrió un error inesperado al procesar la solicitud.", 3000);
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
      if (this.imgedit !== undefined && this.imgedit !== '') {
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
        this.showAlert('warning', 'El archivo de imagen debe ser de máximo 500 KB', 3000);
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
      }
      reader.readAsDataURL(file);
    },
    //asignar personas
    async addPeople(item) {
      this.selectedHome = item.id;
      try {
        const result = await handleRequest({
          endpoint: 'hometype-status-people-apk',
          method: 'GET'
        });

        if (result.success) {
          // Si la solicitud es exitosa, asignamos las sucursales
          this.status = result.data?.homestatus || [];
          this.people = result.data?.homepeople || [];
          this.roles = result.data?.homeroles || [];
          this.hometypes = result.data?.hometypes || [];
        } else {
          // Si no hay datos, asignamos un array vacío
          this.status = [];
          this.people = [];
          this.roles = [];
          this.hometypes = [];
          this.showAlert('info', result.message || 'No hay datos disponibles.', 3000);
        }
      } catch (error) {
        this.showAlert('error', 'Ocurrió un error inesperado al cargar los datos.', 3000);
      } finally {
        this.originalItem = _.cloneDeep(item);
        this.editedItem = _.cloneDeep(item);

        this.people = this.people.filter(person => {
          // Verificar si la persona no está en editedItem.people
          return !this.editedItem.people.some(editedPerson => (editedPerson.id === person.id && editedPerson.role_id !== 0));
        });
        this.dialogAddPeople = true;
      }
    },
    closeAddPeople() {
      this.person_id = null;
      this.role_id = null;
      this.selectedHome = null;
      this.dialogAddPeople = false;
    },
    async saveAddPeople() {
      this.valid = false;
      this.data = {};
      this.data.person_id = this.person_id;
      this.data.role_id = this.role_id;
      this.data.home_id = this.selectedHome;
      // Buscar el rol correspondiente en el array roles
      const selectedRole = this.roles.find(role => role.id === this.role_id);

      // Agregar el nombre del rol a this.data
      if (selectedRole) {
        this.data.roleName = selectedRole.nameRol;
      } else {
        this.data.roleName = 'Rol no encontrado'; // O algún valor por defecto
      }
      try {
        const result = await handleRequest({
          endpoint: 'home-person',
          method: 'POST',
          data: this.data
        });

        // Manejo de la respuesta según el resultado
        if (result.success) {
          this.showAlert("success", result.message, 3000);
          this.initialize();
        } else {
          this.showAlert("warning", result.message, 3000);
          this.closeAddPeople();
        }
      } catch (error) {
        // Este bloque captura errores inesperados fuera del manejo estándar
        this.showAlert("error", "Ocurrió un error inesperado al procesar la solicitud.", 3000);
        this.closeAddPeople();
      } finally {
        this.closeAddPeople();
      }
    },
  },
};
</script>
<style scoped>
.avatar-border {
  border: 2px solid #000;
  /* Aquí se define el borde */
}

.avatar-row {
  display: flex;
  flex-wrap: nowrap;
  justify-content: start;
}

.avatar-col {
  margin-right: -10px;
  /* Reduce the space between avatars */
}

.avatar-item {
  margin-right: -5px;
  border: 2px solid #4CAF50;
  /* Cambia el color del borde según desees */
  border-radius: 50%;
  transition: transform 0.2s ease, box-shadow 0.2s ease;
  /* Para que siga siendo redondo */
  box-sizing: border-box;
  /* Asegura que el borde no afecte el tamaño del avatar */
  /* Optional: reduce the space even further between avatars */
}

.avatar-item.hover-expand:hover {
  transform: scale(1.5);
  box-shadow: 0 0 0 rgba(0, 0, 0, 0.3);
}

.text-secondary {
  color: #6c757d;
  /* Color gris claro */
  font-size: 0.85rem;
  /* Tamaño de texto más pequeño */
}

.custom-tooltip {
  background-color: #f5f5f5 !important;
  /* Fondo claro */
  color: #E5E5E5 !important;
  /* Texto oscuro */
  border-radius: 8px;
  /* Bordes redondeados */
  padding: 8px;
  /* Espaciado interno */
  box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.1);
  /* Sombra suave */
}

.selected-tab {
  background-color: #03626C;
  /* Fondo del tab seleccionado */
  color: white;
  /* Texto blanco */
  border-radius: 4px;
  /* Esquinas redondeadas, opcional */
}
</style>