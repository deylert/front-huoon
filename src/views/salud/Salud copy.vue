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
    <v-container style="min-width: 100%; min-height: 100%;">
    <v-card elevation="6" class="mx-5">
      <v-toolbar color="#03626C">
        <v-row align="center">
          <v-col cols="12" md="8" class="grow ml-4">
            <span class="text-subtitle-1"><strong>Listado de Citas Médicas</strong></span>
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
                  Agregar Cita Médica
                </v-btn>
              </template>
              <v-card>
                <v-toolbar color="#03626C">
                  <span class="text-subtitle-2 ml-4">{{ formTitle }}</span>
                </v-toolbar>
                <v-card-text>
                  <v-container>
                    <v-row>
                      <v-col cols="12" md="6">
                        <v-text-field 
                          v-model="editedItem.name" 
                          clearable 
                          label="Nombre Completo" 
                          prepend-icon="mdi-account-circle" 
                          variant="underlined"
                        ></v-text-field>
                      </v-col>
                      <v-col cols="12" md="6">
                        <v-text-field 
                          v-model="editedItem.dob" 
                          clearable 
                          label="Fecha de Nacimiento" 
                          prepend-icon="mdi-calendar" 
                          variant="underlined"
                        ></v-text-field>
                      </v-col>
                      <v-col cols="12" md="6">
                        <v-text-field 
                          v-model="editedItem.address" 
                          clearable 
                          label="Dirección" 
                          prepend-icon="mdi-home" 
                          variant="underlined"
                        ></v-text-field>
                      </v-col>
                      <v-col cols="12" md="6">
                        <v-menu v-model="menu" :close-on-content-click="false" :nudge-right="40" transition="scale-transition"
                            offset-y min-width="290px">
                          <template v-slot:activator="{ props }">
                            <v-text-field v-bind="props" :modelValue="dateFormatted" variant="underlined"
                              prepend-icon="mdi-calendar" label="Fecha de la Cita"></v-text-field>
                          </template>
                          <v-locale-provider locale="es">
                            <v-date-picker header="Calendario" title="Seleccione la Fecha" color="#03626C"
                              :modelValue="input" @update:model-value="updateDate" format="yyyy-MM-dd"
                            ></v-date-picker>
                          </v-locale-provider>
                        </v-menu>
                      </v-col>
                      <v-col cols="12" md="6">
                        <v-textarea 
                          v-model="editedItem.notes" 
                          clearable 
                          label="Notas Adicionales" 
                          prepend-icon="mdi-pencil" 
                          variant="underlined"
                        ></v-textarea>
                      </v-col>
                      <v-col cols="12" md="6">
                        <v-select
                          v-model="editedItem.hospital"
                          :items="hospitals"
                          label="Hospital"
                          prepend-icon="mdi-hospital-building"
                          variant="underlined"
                        ></v-select>
                      </v-col>
                      <v-col cols="12" md="6">
                        <v-text-field 
                          v-model="editedItem.treatment" 
                          clearable 
                          label="Tratamiento" 
                          prepend-icon="mdi-medical-bag" 
                          variant="underlined"
                        ></v-text-field>
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
        <v-data-table :headers="headers" :search="search" :items="appointments" class="elevation-1" style="max-height: 68vh; overflow-y: auto;" :items-per-page-text="'Elementos por páginas'" no-data-text="No hay datos disponibles">
          <template v-slot:item.actions="{ item }">
            <v-btn 
              density="comfortable" 
              icon="mdi-pencil" 
              @click="editItem(item)" 
              color="#5D89E9" 
              variant="tonal" 
              elevation="1" 
              title="Editar Cita Médica"
            ></v-btn>
            <v-btn 
              density="comfortable" 
              icon="mdi-delete" 
              @click="deleteItem(item)" 
              color="red-darken-4" 
              variant="tonal" 
              elevation="1" 
              title="Eliminar Cita Médica"
            ></v-btn>
          </template>
        </v-data-table>
      </v-card-text>
    </v-card>
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
      hospitals: [
        'Hospital Clínico Universidad de Chile', 
        'Hospital Sótero del Río', 
        'Hospital del Salvador',
        'Hospital Dr. Sótero del Río',
        'Clínica Alemana de Santiago',
        'Clínica Universidad de los Andes'
      ],
      headers: [
        { title: 'Nombre Completo', value: 'name' },
        { title: 'Fecha de la Cita', value: 'date' },
        { title: 'Tratamiento', value: 'treatment' },
        { title: 'Hospital', value: 'hospital' },
        { title: 'Notas', value: 'notes' },
        { title: 'Acciones', value: 'actions', sortable: false },
      ],
      appointments: [
  { name: 'Carlos Pérez', date: '2024-12-01', treatment: 'Chequeo general', hospital: 'Hospital Clínico Universidad de Chile', notes: 'Sin novedad' },
  { name: 'Marta Gómez', date: '2024-12-05', treatment: 'Control de hipertensión', hospital: 'Clínica Alemana de Santiago', notes: 'Prescripción de medicamentos renovada' },
  { name: 'Luis Rojas', date: '2024-12-10', treatment: 'Consulta odontológica', hospital: 'Clínica Dental Andes', notes: 'Se recomienda limpieza profunda' },
  { name: 'Ana Torres', date: '2024-12-15', treatment: 'Terapia física', hospital: 'Centro de Rehabilitación Los Pinos', notes: 'Mejoras en movilidad reportadas' },
  { name: 'Pedro Martínez', date: '2024-12-20', treatment: 'Evaluación cardiológica', hospital: 'Hospital del Salvador', notes: 'Electrocardiograma sin anomalías' },
  { name: 'Sofía López', date: '2024-12-22', treatment: 'Consulta pediátrica', hospital: 'Clínica Las Condes', notes: 'Vacunación al día' },
  { name: 'Ricardo Fernández', date: '2025-01-05', treatment: 'Examen de laboratorio', hospital: 'Laboratorio San Joaquín', notes: 'Resultados entregados, todo dentro de rangos normales' },
  { name: 'Carla Ramírez', date: '2025-01-12', treatment: 'Consulta dermatológica', hospital: 'Clínica Santa María', notes: 'Inicia tratamiento para acné' },
  { name: 'Javier Núñez', date: '2025-01-18', treatment: 'Terapia psicológica', hospital: 'Centro de Salud Mental Bienestar', notes: 'Plan de sesiones semanales acordado' },
  { name: 'Isabel Vega', date: '2025-01-25', treatment: 'Cirugía menor', hospital: 'Hospital Militar de Santiago', notes: 'Procedimiento sin complicaciones' },
  { name: 'Daniela Reyes', date: '2025-02-02', treatment: 'Consulta oftalmológica', hospital: 'Instituto de la Visión', notes: 'Se requiere cambio de lentes' },
  { name: 'Francisco Gutiérrez', date: '2025-02-10', treatment: 'Control postoperatorio', hospital: 'Clínica Indisa', notes: 'Recuperación satisfactoria' },
  { name: 'Lucía Morales', date: '2025-02-15', treatment: 'Consulta ginecológica', hospital: 'Hospital Barros Luco Trudeau', notes: 'Ecografía programada para próxima visita' },
  { name: 'César Paredes', date: '2025-02-20', treatment: 'Consulta neurológica', hospital: 'Hospital San Juan de Dios', notes: 'Se programaron exámenes complementarios' },
  { name: 'Gabriela Flores', date: '2025-02-28', treatment: 'Vacunación', hospital: 'CESFAM Padre Hurtado', notes: 'Vacuna contra la influenza administrada' }
],
      editedItem: {
        name: '',
        dob: '',
        address: '',
        date: '',
        treatment: '',
        hospital: '',
        notes: '',
      },
      defaultItem: {
        name: '',
        dob: '',
        address: '',
        date: '',
        treatment: '',
        hospital: '',
        notes: '',
      },
      editedIndex: -1,
      search: '',
    }),
    computed: {
      formTitle() {
        return this.editedIndex === -1 ? 'Agregar Cita Médica' : 'Editar Cita Médica';
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
      this.editedItem.date = this.dateFormatted;
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
          this.appointments.push(this.editedItem);
        } else {
          Object.assign(this.appointments[this.editedIndex], this.editedItem);
        }
        this.close();
      },
      editItem(item) {
        this.editedIndex = this.appointments.indexOf(item);
        this.editedItem = Object.assign({}, item);
        this.dialog = true;
      },
      deleteItem(item) {
        const index = this.appointments.indexOf(item);
        confirm('¿Estás seguro de eliminar esta cita?') && this.appointments.splice(index, 1);
      },
    },
  };
  </script>
  