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
          <span class="text-subtitle-1"><strong>Listado de Tareas</strong></span>
        </v-col>
        <v-col cols="12" md="3" class="text-right">
          <v-btn class="text-subtitle-1 ml-12" color="white" variant="tonal" elevation="2"
            prepend-icon="mdi-plus-circle" @click="showAdd">
            Agregar Nueva Tarea
          </v-btn>
        </v-col>
      </v-row>
    </v-toolbar>

    <v-card-text>
      <v-text-field class="mt-1 mb-1" v-model="search" append-icon="mdi-magnify" label="Buscar" single-line
        hide-details>
      </v-text-field>
      <v-data-table :headers="headers" :search="search" :items="tasks" class="elevation-1"
        style="max-height: 68vh; overflow-y: auto;" :items-per-page-text="'Elementos por páginas'"
        no-data-text="No hay datos disponibles" :loading="loading" loading-text="Cargando datos...">
        <template v-slot:item.actions="{ item }">
          <v-btn density="comfortable" icon="mdi-pencil" @click="editItem(item)" color="#1976D2" variant="tonal"
            elevation="1" title="Editar Tarea"></v-btn>
          <v-btn density="comfortable" icon="mdi-delete" @click="deleteItem(item)" color="#DA7171" variant="tonal"
            elevation="1" title="Eliminar Tarea"></v-btn>
        </template>
        <template v-slot:item.title="{ item }">
          <v-avatar class="mr-1" elevation="3" color="grey-lighten-4" size="large">
            <v-img :src="`${this.$axios.defaults.baseURL}images/${item.attachments}?t=${Date.now()}`"
              alt="image"></v-img>
          </v-avatar><!--+'?$'+Date.now()-->
          {{ item.title }}
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
            <v-tab value="purchase" :class="tab === 'purchase' ? 'selected-tab' : ''">Otros Datos</v-tab>
            <v-tab value="people" :class="tab === 'people' ? 'selected-tab' : ''">Personas</v-tab>
          </v-tabs>
          <!-- Contenido de las pestañas -->
          <v-window v-model="tab" min-height="50vh" class="mt-2">
            <!-- Pestaña de Generales -->
            <v-window-item value="general">
              <v-row>
                <v-col cols="12" md="6">
                  <v-text-field v-model="editedItem.title" clearable label="Título" prepend-icon="mdi-tag-outline"
                    variant="underlined" :rules="nameRules"></v-text-field>
                </v-col>
                <v-col cols="12" md="6">
                  <v-text-field v-model="editedItem.estimated_time" clearable label="Tiempo estimado(hrs)"
                    prepend-icon="mdi-timer-outline" variant="underlined"></v-text-field>
                </v-col>
                <v-col cols="12" md="6">
                  <v-autocomplete :no-data-text="'No hay datos disponibles'" v-model="editedItem.status_id"
                    :items="status" label="Estado" prepend-icon="mdi-lock-outline" item-title="nameStatus"
                    item-value="id" variant="underlined" density="compact" :rules="selectRules">
                    <template v-slot:item="{ props, item }">
                      <v-list-item v-bind="props">
                        <template v-slot:prepend>
                          <v-avatar size="24">
                            <v-icon>{{ item.raw.iconStatus }}</v-icon>
                          </v-avatar>
                        </template>
                        <v-list-item-subtitle class="d-flex flex-column">
                          <div>Descripción: {{ item.raw.descriptionStatus }}</div>
                        </v-list-item-subtitle>
                      </v-list-item>
                    </template>
                  </v-autocomplete>
                </v-col>
                <v-col cols="12" md="6">
                  <v-autocomplete :no-data-text="'No hay datos disponibles'" v-model="editedItem.category_id"
                    :items="categories" label="Categoría" prepend-icon="mdi-tag-outline" item-title="nameCategory"
                    item-value="id" variant="underlined" density="compact" :rules="selectRules">
                    <template v-slot:item="{ props, item }">
                      <v-list-item v-bind="props">
                        <template v-slot:prepend>
                          <v-avatar size="24">
                            <!-- Verifica si es URL o ícono -->
                            <template v-if="isImage(item.raw.iconCategory)">
                              <img
                                :src="`${this.$axios.defaults.baseURL}images/${item.raw.iconCategory}?t=${Date.now()}`"
                                alt="icon" />
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
                <v-col cols="12" md="6">
                  <v-select v-model="editedItem.priority_id" :items="priorities" item-title="namePriority"
                    item-value="id" label="Prioridad" variant="underlined" density="compact" :rules="selectRules"
                    prepend-icon="mdi-alert-outline">
                    <template v-slot:item="{ props, item }">
                      <v-list-item v-bind="props" :subtitle="item.raw.descriptionPriority"></v-list-item>
                    </template>
                  </v-select>
                </v-col>
                <v-col cols="12" md="6">
                  <v-select v-model="editedItem.recurrence" :items="recurrences" item-title="name" item-value="id"
                    label="Recurrencia" variant="underlined" density="compact" :rules="selectRules"
                    prepend-icon="mdi-timetable">
                  </v-select>
                </v-col>
                <v-col cols="12" md="6">
                  <v-textarea v-model="editedItem.description" clearable label="Descripción" prepend-icon="mdi-note"
                    variant="underlined" density="compact"></v-textarea>
                </v-col>
                <v-col cols="12" md="6">
                  <v-select v-model="editedItem.type" :items="typetasks" item-title="name" item-value="id"
                    label="Tipo de Tarea" variant="underlined" density="compact" :rules="selectRules"
                    prepend-icon="mdi-format-list-bulleted">
                  </v-select>
                </v-col>
              </v-row>
            </v-window-item>

            <!-- Pestaña de Otros datos -->
            <v-window-item value="purchase" class="mt-4">
              <v-row>
                <v-col cols="12" md="3">
                  <v-menu v-model="menu" :close-on-content-click="false" :nudge-right="40" transition="scale-transition"
                    offset-y min-width="290px">
                    <template v-slot:activator="{ props }">
                      <v-text-field v-bind="props" :modelValue="dateFormatted" variant="underlined"
                        prepend-icon="mdi-calendar" label="Fecha de inicio" density="compact"></v-text-field>
                    </template>
                    <v-locale-provider locale="es">
                      <v-date-picker header="Calendario" title="Seleccione la fecha" color="#03626C" :modelValue="input"
                        @update:model-value="updateDate" format="yyyy-MM-dd" :max="dateFormatted2"></v-date-picker>
                    </v-locale-provider>
                  </v-menu>
                </v-col>
                <!-- Segunda columna -->
                <v-col cols="12" md="3" v-if="editedItem.type === 'Evento'">
                  <v-menu v-model="menu2" :close-on-content-click="false" :nudge-right="40"
                    transition="scale-transition" offset-y min-width="290px">
                    <template v-slot:activator="{ props }">
                      <v-text-field v-bind="props" :modelValue="dateFormatted2" variant="underlined"
                        prepend-icon="mdi-calendar" label="Fecha Terminación" density="compact"></v-text-field>
                    </template>
                    <v-locale-provider locale="es">
                      <v-date-picker header="Calendario" title="Seleccione la fecha" color="#03626C"
                        :modelValue="input2" format="yyyy-MM-dd" :min="dateFormatted"
                        @update:model-value="updateDate1"></v-date-picker><!--@update:model-value="updateDate2"-->
                    </v-locale-provider>
                  </v-menu>
                </v-col>
                <v-col cols="12" md="3">
                  <!-- Selector de tiempo -->
                  <v-select v-model="editedItem.start_time" :items="timeSlots" label="Hora de inicio"
                    variant="underlined" density="compact" clearable></v-select>
                </v-col>
                <v-col cols="12" md="3" v-if="editedItem.type === 'Evento'">
                  <!-- Selector de tiempo -->
                  <v-select v-model="editedItem.end_time" :items="timeSlots" label="Hora de finalización"
                    variant="underlined" density="compact" clearable></v-select>
                </v-col>
              </v-row>
              <v-row>
                <v-col cols="12" md="6">
                  <v-textarea v-model="editedItem.comments" clearable label="Comentario" prepend-icon="mdi-note"
                    variant="underlined"></v-textarea>
                </v-col>
                <v-col cols="12" md="6">
                  <v-text-field v-model="editedItem.geo_location" clearable label="Ubicación"
                    prepend-icon="mdi-map-marker-outline" variant="underlined"></v-text-field>
                </v-col>
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
        <span class="text-subtitle-2 ml-4"> Eliminar una tarea</span>
      </v-toolbar>
      <v-card-text class="mt-2 mb-2"> ¿Desea eliminar la tarea?</v-card-text>
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
                      <v-list-item-subtitle class="d-flex flex-column">
                        <div>Rol: {{ item.raw.roleName }}</div>
                      </v-list-item-subtitle>
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
          <span class="text-subtitle-2 ml-4">Agregar Persona a la tarea</span>
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
                      <v-list-item-subtitle class="d-flex flex-column">
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
          <v-btn color="#03626C" variant="flat" @click="saveAddPeople" :disabled="!valid" :loading="loading">Aceptar</v-btn>
        </v-card-actions>
      </v-card>
    </v-form>
  </v-dialog>
</template>

<script>
import LocalStorageService from "@/LocalStorageService";
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
    dialog: false,
    dialogAssignedPeople: false,
    dialogDelete: false,
    file: null,
    imgMiniatura: '',
    tasks: [],
    categories: [],
    status: [],
    priorities: [],
    people: [],
    tittlePerson: -1,
    persons: [],
    recurrences: [],
    typetasks: [],
    home_id: '',
    roles: [],
    data: {},
    dialogAddPeople: false,
    person_id: '',
    role_id: '',
    task_id: '',
    timeSlots: [], // Inicialmente vacío
    selectedPerson: null, // Persona seleccionada en el formulario
    selectedRole: null,   // Rol seleccionado en el formulario
    headers: [
      { title: 'Título', value: 'title', width: '20%' },
      { title: 'Descripción', value: 'description', width: '30%' },
      { title: 'Personas', value: 'people', width: '30%' },
      { title: 'Acciones', value: 'actions', sortable: false, width: '20%' },
    ],
    headersPeople: [
      { title: 'Nombre', value: 'name', width: '60%' },
      { title: 'Rol', value: 'roleName', width: '20%' },
      { title: 'Acciones', value: 'actions', sortable: false, width: '20%' },
    ],
    editedItem: {
      id: '',
      title: '',
      description: '',
      start_date: null,
      end_date: null,
      start_time: null,
      end_time: null,
      type: '',
      parent_id: '',
      status_id: '',
      category_id: '',
      person_id: null,
      home_id: '',
      recurrence: '',
      estimated_time: '',
      attachments: null,
      comments: '',
      geo_location: '',
      people: [],
    },

    defaultItem: {
      id: '',
      title: '',
      description: '',
      start_date: null,
      end_date: null,
      start_time: null,
      end_time: null,
      type: '',
      parent_id: '',
      status_id: '',
      category_id: '',
      person_id: null,
      home_id: '',
      recurrence: '',
      estimated_time: '',
      attachments: null,
      comments: '',
      geo_location: '',
      people: [],
    },

    originalItem: {
      id: '',
      title: '',
      description: '',
      start_date: null,
      end_date: null,
      start_time: null,
      end_time: null,
      type: '',
      parent_id: '',
      status_id: '',
      category_id: '',
      person_id: null,
      home_id: '',
      recurrence: '',
      estimated_time: '',
      attachments: null,
      comments: '',
      geo_location: '',
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
      return this.editedIndex === -1 ? 'Agregar Nueva Tarea' : 'Editar Tarea';
    },
    formTitlePerson() {
      return this.tittlePerson === -1 ? 'Asignar Personas a la Tarea' : 'Editar rol de la persona';
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
  },
  mounted() {
    this.home_id = JSON.parse(LocalStorageService.getItem('home_id'));
    this.initialize();
    this.timeSlots = this.generateTimeSlots(); // Genera los horarios al montar el componente
  },
  methods: {
    async addPeople(item) {
      this.data = {};
      this.data.home_id = this.home_id;
      this.task_id = item.id;
      try {
        const result = await handleRequest({
          endpoint: 'category-status-priority-apk',
          method: 'POST',
          data: this.data
        });

        if (result.success) {
          // Si la solicitud es exitosa, asignamos las sucursales
          this.categories = result.data?.taskcategories || [];
          this.status = result.data?.taskstatus || [];
          this.priorities = result.data?.taskpriorities || [];
          this.recurrences = result.data?.taskrecurrences || [];
          this.people = result.data?.taskpeople || [];
          this.roles = result.data?.taskroles || [];
        } else {
          // Si no hay datos, asignamos un array vacío
          this.categories = [];
          this.status = [];
          this.priorities = [];
          this.recurrences = [];
          this.people = [];
          this.roles = [];
          this.showAlert('info', result.message || 'No hay datos disponibles.', 3000);
        }
      } catch (error) {
        this.showAlert('error', 'Ocurrió un error inesperado al cargar los datos.', 3000);
      } finally {
        // Asignar a originalItem y editedItem solo las personas seleccionadas
        this.originalItem = _.cloneDeep(item);
        this.editedItem = _.cloneDeep(item);

        this.people = this.people.filter(person => {
          // Verificar si la persona no está en editedItem.people
          return !this.editedItem.people.some(editedPerson => editedPerson.id === person.id);
        });
        this.dialogAddPeople = true;
      }
    },
    closeAddPeople() {
      this.person_id = '';
      this.role_id = '';
      this.task_id = '';
      this.dialogAddPeople = false;
    },
    async saveAddPeople() {
      this.valid = false;
      this.data = {};
      this.data.person_id = this.person_id;
      this.data.role_id = this.role_id;
      this.data.home_id = this.home_id;
      this.data.task_id = this.task_id;
      const selectedRole = this.roles.find(role => role.id === this.role_id);

      // Agregar el nombre del rol a this.data
      if (selectedRole) {
        this.data.roleName = selectedRole.nameRol;
      } else {
        this.data.roleName = 'Rol no encontrado'; // O algún valor por defecto
      }
      try {
        const result = await handleRequest({
          endpoint: 'home-person-task',
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
    generateTimeSlots() {
      const slots = [];
      for (let hour = 0; hour < 24; hour++) {
        for (let minute = 0; minute < 60; minute += 5) {
          // Incrementos de 5 minutos
          const formattedHour = String(hour).padStart(2, "0");
          const formattedMinute = String(minute).padStart(2, "0");
          slots.push(`${formattedHour}:${formattedMinute}`);
        }
      }
      return slots;
    },
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
    updateDate(val) {
      this.input = val;
      this.editedItem.start_date = this.dateFormatted;
      this.menu = false;
    },
    updateDate1(val) {
      this.input2 = val;
      this.editedItem.end_date = this.dateFormatted2;
      this.menu2 = false;
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
        this.imgMiniatura = '',
        this.data = {};
      this.editedItem.home_id = this.home_id;
      this.data.home_id = this.editedItem.home_id;
      this.editedIndex = -1;
      try {
        const result = await handleRequest({
          endpoint: 'category-status-priority-apk',
          method: 'POST',
          data: this.data
        });

        if (result.success) {
          // Si la solicitud es exitosa, asignamos las sucursales
          this.categories = result.data?.taskcategories || [];
          this.status = result.data?.taskstatus || [];
          this.priorities = result.data?.taskpriorities || [];
          this.recurrences = result.data?.taskrecurrences || [];
          this.people = result.data?.taskpeople || [];
          this.roles = result.data?.taskroles || [];
          this.typetasks = result.data?.tasktype || [];
          console.log('this.typetasks');
          console.log(this.typetasks);
        } else {
          // Si no hay datos, asignamos un array vacío
          this.categories = [];
          this.status = [];
          this.priorities = [];
          this.recurrences = [];
          this.people = [];
          this.roles = [];
          this.typetasks = [];
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
      this.data.home_id = this.home_id;
      this.data.start_date = "2025-01-11";
      try {
        this.loading = true;
        const result = await handleRequest({
          endpoint: 'task-date-apk',
          method: 'POST',
          data: this.data
        });

        if (result.success) {
          // Si la solicitud es exitosa, asignamos las sucursales
          this.tasks = result.data?.tasks || []; // Si no hay roles, asigna un arreglo vacío
        } else {
          // Si no hay datos, asignamos un array vacío
          this.tasks = [];
          this.showAlert('success', result.message || 'No hay tareas disponibles.', 3000);
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
        case 'Task':
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
        case 'Task':
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
          'title', 'description', 'start_date', 'end_date', 'parent_id',
          'status_id', 'category_id', 'home_id', 'recurrence', 'comments',
          'estimated_time', 'attachments', 'geo_location', 'priority_id', 'people', 'start_time', 'end_time', 'type'
        ];
        let updatedFields = Object.keys(this.editedItem)
          .filter((key) => fieldsToUpdate.includes(key) && this.editedItem[key] !== this.originalItem[key])
          .reduce((obj, key) => {
            if (key === 'people') {
              // Transformar el campo `people`
              obj[key] = this.editedItem.people.map(person => ({
                home_id: Number(this.editedItem.home_id), // Asegurar que sea un número
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
          updatedFields.home_id = this.editedItem.home_id;
          updatedFields.start_date = this.editedItem.start_date ? this.editedItem.start_date : new Date().toISOString();

          if (this.file) {
            updatedFields.attachments = this.editedItem.attachments;
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
              endpoint: 'task',
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
          this.showAlert("success", "Debe completar los datos de la tarea.", 3000);
        }
      } else {
        this.valid = false;
        const fieldsToUpdate = [
          'title', 'description', 'start_date', 'end_date', 'parent_id',
          'status_id', 'category_id', 'home_id', 'recurrence', 'comments',
          'estimated_time', 'attachments', 'geo_location', 'priority_id', 'people', 'start_time', 'end_time', 'type'
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
                home_id: Number(this.editedItem.home_id), // Asegurar que sea un número
                person_id: person.id ? Number(person.id) : Number(person.id),       // Asegurar que sea un número
                role_id: Number(person.roleId),
                roleName: person.roleName            // Asegurar que sea un número
              }));
            } else {
              obj[key] = this.editedItem[key];
            }
            return obj;
          }, {});
        if (Object.keys(updatedFields).length > 0) {
          updatedFields.id = this.editedItem.id;
          if (this.file) {
            updatedFields.attachments = this.editedItem.attachments;
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
              endpoint: 'task-update',
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
      img.src = `${this.$axios.defaults.baseURL}images/${item.attachments}`; // Se asume que item.image_url es la URL de la imagen

      // Usar una función asíncrona para manejar la carga de la imagen
      img.onload = async () => {
        try {
          // Asignar la imagen cargada a imgMiniatura
          this.imgMiniatura = `${this.$axios.defaults.baseURL}images/${item.attachments}`;
        } catch (error) {
          console.error('Error al cargar la imagen', error);
          this.showAlert('error', 'Error al cargar la imagen.', 3000);
        }
      };
      this.data = {};
      this.data.home_id = this.home_id;
      try {
        const result = await handleRequest({
          endpoint: 'category-status-priority-apk',
          method: 'POST',
          data: this.data
        });

        if (result.success) {
          // Si la solicitud es exitosa, asignamos las sucursales
          this.categories = result.data?.taskcategories || [];
          this.status = result.data?.taskstatus || [];
          this.priorities = result.data?.taskpriorities || [];
          this.recurrences = result.data?.taskrecurrences || [];
          this.people = result.data?.taskpeople || [];
          this.roles = result.data?.taskroles || [];
        } else {
          // Si no hay datos, asignamos un array vacío
          this.categories = [];
          this.status = [];
          this.priorities = [];
          this.recurrences = [];
          this.people = [];
          this.roles = [];
          this.showAlert('info', result.message || 'No hay datos disponibles.', 3000);
        }
      } catch (error) {
        this.showAlert('error', 'Ocurrió un error inesperado al cargar los datos.', 3000);
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
          endpoint: 'task-destroy',
          method: 'POST',
          data: request
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
      this.editedItem.attachments = file;
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
  /* Optional: reduce the space even further between avatars */
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

.avatar-item.hover-expand:hover {
  transform: scale(1.5);
  box-shadow: 0 0 0 rgba(0, 0, 0, 0.3);
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