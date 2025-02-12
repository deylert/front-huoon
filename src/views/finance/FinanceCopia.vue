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
          <span class="text-subtitle-1"><strong>Listado de Finanzas</strong></span>
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
                Agregar Transacción
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
                        label="Nombre de Transacción" 
                        prepend-icon="mdi-tag-outline" 
                        variant="underlined"
                      ></v-text-field>
                    </v-col>
                    <v-col cols="12" md="6">
                      <v-autocomplete 
                      v-model="editedItem.type" 
                      :items="typeOptions" 
                      clearable 
                      label="Tipo" 
                      prepend-icon="mdi-label-outline" 
                      variant="underlined"
                      ></v-autocomplete>
                     
                    </v-col>
                    <v-col cols="12" md="6">
                      <v-text-field 
                        v-model="editedItem.amount" 
                        clearable 
                        label="Monto" 
                        prepend-icon="mdi-currency-usd" 
                        variant="underlined"
                      ></v-text-field>
                    </v-col>
                    <v-col cols="12" md="6">
                      <v-menu v-model="menu" :close-on-content-click="false" :nudge-right="40" transition="scale-transition"
                  offset-y min-width="290px">
                  <template v-slot:activator="{ props }">
                    <v-text-field v-bind="props" :modelValue="dateFormatted" variant="underlined"
                    prepend-icon="mdi-calendar" label="Fecha"></v-text-field>
                  </template>
                  <v-locale-provider locale="es">
                    <v-date-picker header="Calendario" title="Seleccione la fecha" color="#03626C"
                      :modelValue="input" @update:model-value="updateDate" format="yyyy-MM-dd"
                      ></v-date-picker>
                  </v-locale-provider>
                </v-menu>
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
      <v-data-table style="max-height: 68vh; overflow-y: auto;" :headers="headers" :search="search" :items="transactions" class="elevation-1" :items-per-page-text="'Elementos por páginas'" no-data-text="No hay datos disponibles">
        <template v-slot:item.actions="{ item }">
          <v-btn 
            density="comfortable" 
            icon="mdi-pencil" 
            @click="editItem(item)" 
            color="#5D89E9" 
            variant="tonal" 
            elevation="1" 
            title="Editar Transacción"
          ></v-btn>
          <v-btn 
            density="comfortable" 
            icon="mdi-delete" 
            @click="deleteItem(item)" 
            color="red-darken-4" 
            variant="tonal" 
            elevation="1" 
            title="Eliminar Transacción"
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
    headers: [
      { title: 'Nombre de Transacción', value: 'name' },
      { title: 'Tipo', value: 'type' },
      { title: 'Monto', value: 'amount' },
      { title: 'Fecha', value: 'date' },
      { title: 'Acciones', value: 'actions', sortable: false },
    ],
    transactions: [
  { name: 'Ingreso Mensual', type: 'Ingreso', amount: 1500, date: '2024-01-15' },
  { name: 'Pago de Renta', type: 'Gasto', amount: 800, date: '2024-01-01' },
  { name: 'Compra de Insumos', type: 'Gasto', amount: 300, date: '2024-01-10' },
  { name: 'Pago de Servicios Públicos', type: 'Gasto', amount: 200, date: '2024-01-05' },
  { name: 'Ingreso por Ventas', type: 'Ingreso', amount: 2500, date: '2024-01-20' },
  { name: 'Compra de Equipo de Oficina', type: 'Gasto', amount: 1200, date: '2024-01-12' },
  { name: 'Mantenimiento de Equipos', type: 'Gasto', amount: 400, date: '2024-01-18' },
  { name: 'Consultoría Externa', type: 'Gasto', amount: 600, date: '2024-01-25' },
  { name: 'Ingreso Extraordinario', type: 'Ingreso', amount: 1000, date: '2024-01-28' },
  { name: 'Pago de Nómina', type: 'Gasto', amount: 3000, date: '2024-01-30' },
  { name: 'Ingreso por Proyecto Especial', type: 'Ingreso', amount: 5000, date: '2024-01-22' },
  { name: 'Publicidad y Marketing', type: 'Gasto', amount: 750, date: '2024-01-17' },
  { name: 'Suscripción a Software', type: 'Gasto', amount: 150, date: '2024-01-11' },
  { name: 'Venta de Activo', type: 'Ingreso', amount: 2000, date: '2024-01-19' },
  { name: 'Reembolso de Cliente', type: 'Gasto', amount: 250, date: '2024-01-27' }
],

    typeOptions: ['Gastos', 'Ingresos', 'Préstamos'],
    editedItem: {
      name: '',
      type: '',
      amount: '',
      date: '',
    },
    defaultItem: {
      name: '',
      type: '',
      amount: '',
      date: '',
    },
    editedIndex: -1,
    search: '',
  }),
  computed: {
    formTitle() {
      return this.editedIndex === -1 ? 'Nueva Transacción' : 'Editar Transacción';
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
    editItem(item) {
      this.editedIndex = this.transactions.indexOf(item);
      this.editedItem = Object.assign({}, item);
      this.dialog = true;
    },
    deleteItem(item) {
      const index = this.transactions.indexOf(item);
      this.transactions.splice(index, 1);
      this.showAlert('success', 'Transacción eliminada correctamente', 3000);
    },
    close() {
      this.dialog = false;
      this.$nextTick(() => {
        this.editedItem = Object.assign({}, this.defaultItem);
        this.editedIndex = -1;
      });
    },
    save() {
      if (this.editedIndex > -1) {
        Object.assign(this.transactions[this.editedIndex], this.editedItem);
        this.showAlert('success', 'Transacción editada correctamente', 3000);
      } else {
        this.transactions.push(this.editedItem);
        this.showAlert('success', 'Transacción agregada correctamente', 3000);
      }
      this.close();
    },
    showAlert(type, message, timeout) {
      this.sb_type = type;
      this.sb_message = message;
      this.sb_timeout = timeout;
      this.sb_icon = type === 'success' ? 'mdi-check-circle' : 'mdi-alert-circle';
      this.snackbar = true;
    },
  },
};
</script>

<style scoped>
.text-subtitle-1 {
  font-weight: bold;
}
</style>
