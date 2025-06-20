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

  <v-container class=" bg-grey-lighten-4">
    <v-row no-gutters class="ma-0">
    <v-col cols="12" class="px-0 mb-6">      
    <v-card class="pt-4 mb-8"  elevation="2">    

      <!-- Chat Body -->
      <div ref="chatBody" class="chat-body px-4 py-2">
        <div v-for="(msg, i) in messages" :key="i" class="d-flex mb-8"
          :class="msg.from === 'user' ? 'justify-end' : 'justify-start'">
          <div class="d-flex align-end" :class="msg.from === 'user' ? 'flex-row-reverse' : ''">
            <v-avatar v-if="msg.from === 'bot'" size="28" class="mb-2 mr-3">
              <v-img src="@/assets/logo-verde.png" alt="Imagen de perfil"></v-img>
            </v-avatar>
            <div class="chat-bubble px-8 py-3 rounded-xl"
              :class="msg.from === 'user' ? 'bg-primary text-white' : 'bg-grey-lighten-2 text-black'">
              {{ msg.text }}
            </div>
          </div>
        </div>
      </div>

      <!-- Herramientas -->
      <v-divider />
      <v-card-actions class="pa-3 bg-grey-lighten-5 tools-bar">
        <v-btn v-for="tool in tools" :key="tool.name" @click="tool.action" size="small" color="primary" variant="text"
          prepend-icon="mdi-plus" class="text-capitalize">
          {{ tool.name }}
        </v-btn>
      </v-card-actions>

      <!-- Input -->
      <v-card-actions class="pa-4 bg-white rounded-b-2xl">
        <v-text-field v-model="input" placeholder="Escribe un mensaje..." variant="outlined" hide-details
          density="compact" class="flex-grow-1" rounded @keyup.enter="sendMessage" />
        <v-btn icon="mdi-send" color="primary" @click="sendMessage" />
      </v-card-actions>
    </v-card> 
    </v-col> 
      <v-col cols="12" class="pa-0">
        <v-row>
          <template v-for="(card, index) in cards" :key="index">
            <v-col cols="12" sm="6" md="3" v-if="!card.menu">
              <!-- Tarjetas normales -->
              <v-card elevation="2" density="comfortable" @click="$router.push(card.to)">
                <div class="dynamic-circle" v-if="getDynamicValue(card.to) > 0">
                  {{ getDynamicValue(card.to) }}
                </div>
                <v-card-item>
                  <template v-slot:prepend>
                    <div class="icono-concavo">
                      <v-icon :icon="card.icon" :color="card.color" size="x-large"></v-icon>
                    </div>
                  </template>
                  <v-card-title class="text-body-2">{{ card.title }}</v-card-title>
                  <v-card-subtitle class="text-body-2">{{ card.title }}</v-card-subtitle>
                </v-card-item>
              </v-card>
            </v-col>

            <v-col cols="12" sm="6" md="3" v-else>
              <!-- Tarjetas con menú desplegable -->
              <v-menu>
                <template v-slot:activator="{ props }">
                  <v-card v-bind="props" class="menu-card">
                    <div class="dynamic-circle" v-if="getDynamicValue(card.to) > 0">
                      {{ getDynamicValue(card.to) }}
                    </div>
                    <v-card-item>
                      <template v-slot:prepend>
                        <div class="icono-concavo" :class="card.color" style="margin-inline-end: 8px; padding: 8px;">
                          <v-icon :icon="card.icon" size="large"></v-icon>
                        </div>
                      </template>
                      <v-card-title class="text-body-2">{{ card.title }}</v-card-title>
                      <template v-slot:append>
                        <v-icon icon="mdi-chevron-down" size="small"></v-icon>
                      </template>
                    </v-card-item>
                  </v-card>
                </template>

                <v-list density="compact">
                  <v-list-item v-for="(item, i) in card.items" :key="i" @click="$router.push(item.to)">
                    <template v-slot:prepend>
                      <v-icon :icon="item.icon" size="small"></v-icon>
                    </template>
                    <v-list-item-title class="text-body-1">{{ item.title }}</v-list-item-title>
                  </v-list-item>
                </v-list>
              </v-menu>
            </v-col>
          </template>
        </v-row>
      </v-col>

      <v-col cols="12" class="pa-0 mt-4" style="max-height: 100vh; min-height: 40vh; overflow-y: auto;">
        <v-row no-gutters class="ma-0">
          <v-col cols="12" class="px-0">
            <template v-if="tasks.length === 0">
              <v-col cols="12" class="text-center py-8 pa-0">
                <v-icon size="64" color="grey-lighten-1">mdi-check-circle-outline</v-icon>
                <div class="text-h6 text-grey mt-4">No tienes tareas para realizar en el día de hoy</div>
              </v-col>
            </template>

            <template v-else>
  <v-card
    v-for="(task, index) in tasks"
    :key="index"
    class="mb-4 px-4 py-4"
    elevation="1"
    rounded="xl"
    color="white"
  >
    <v-row align="start" no-gutters>
      <!-- Columna izquierda - Contenido principal -->
      <v-col cols="12" sm="8" md="9" class="pe-4">
        <!-- Hora y título en misma línea -->
        <v-row align="center" class="mb-2">
          <v-col cols="4" sm="3">
            <div class="text-grey text-xs mb-1">Hora</div>
            <div class="text-base font-medium">{{ task.startTime }}</div>
          </v-col>
          <v-col cols="8" sm="9">
            <div class="text-grey text-xs mb-1">Título</div>
            <div class="text-base font-medium">{{ task.title }}</div>
          </v-col>
        </v-row>

        <!-- Descripción -->
        <div class="text-grey text-xs mb-1">Descripción</div>
        <div class="text-sm text-grey-darken-2 mb-3">{{ task.description }}</div>
      </v-col>

      <!-- Columna derecha - Personas y estado -->
      <v-col cols="12" sm="4" md="3" class="d-flex flex-column align-end">
        <!-- Personas -->
        <div class="mb-3">
          <div class="text-grey text-xs mb-1">Personas</div>
          <div class="avatar-row d-flex flex-wrap justify-end gap-1">
            <v-tooltip v-for="person in task.people" :key="person.id" bottom>
              <template v-slot:activator="{ props }">
                <v-avatar class="avatar-item hover-expand" size="32" v-bind="props">
                  <v-img :src="`${this.$axios.defaults.baseURL}images/${person.image}?t=${Date.now()}`" alt="avatar" />
                </v-avatar>
              </template>
              <span>{{ person.name }}<br>{{ person.roleName }}</span>
            </v-tooltip>
          </div>
        </div>

        <!-- Estado -->
        <div class="text-grey text-xs mb-1">Estado</div>
        <v-dialog v-model="task.statusDialog" width="400">
          <template v-slot:activator="{ props }">
            <v-btn 
              v-bind="props" 
              :color="'#' + getStatusById(task.status_id)?.colorStatus || 'grey'"
              variant="flat" 
              size="small"
              :prepend-icon="getStatusById(task.status_id)?.iconStatus || 'mdi-help-circle'"
              class="mb-2"
            >
              {{ getStatusById(task.status_id)?.nameStatus || 'Desconocido' }}
            </v-btn>
          </template>
          <v-card>
            <v-card-title class="pa-4 text-center">
              Actualizar Estado
            </v-card-title>
            <v-divider></v-divider>
            <v-card-text class="pa-0">
              <v-row class="px-2 pb-1" dense>
                <v-col cols="12" v-for="(statusOption, i) in statuses" :key="i" class="py-1">
                  <v-card 
                    @click="changeTaskStatus(task, statusOption.id)" 
                    :class="['status-option mx-1', {'current-status': task.status_id === statusOption.id}]" 
                    :style="task.status_id === statusOption.id ? {
                      'background-color': `#${statusOption.colorStatus}`,
                      'border-color': `#${statusOption.colorStatus}`,
                      'color': 'white'
                    } : {}" 
                    variant="outlined"
                    :elevation="task.status_id === statusOption.id ? 2 : 0"
                    style="border-radius: 12px; cursor: pointer;"
                  >
                    <v-card-item class="pa-2">
                      <div class="d-flex align-center">
                        <v-icon
                          :color="task.status_id === statusOption.id ? 'white' : '#' + statusOption.colorStatus"
                          :icon="statusOption.iconStatus" 
                          size="large" 
                          class="mr-3"
                        ></v-icon>
                        <v-card-title :style="{
                          'color': task.status_id === statusOption.id ? 'white' : 'inherit',
                          'font-size': '1rem'
                        }">
                          {{ statusOption.nameStatus }}
                        </v-card-title>
                        <v-spacer></v-spacer>
                        <v-icon v-if="task.status_id === statusOption.id" color="white" icon="mdi-check-circle"></v-icon>
                      </div>
                    </v-card-item>
                  </v-card>
                </v-col>
              </v-row>
            </v-card-text>
            <v-divider></v-divider>
            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn variant="flat" color="#03626C" @click="task.statusDialog = false">
                Cancelar
              </v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>
      </v-col>
    </v-row>
  </v-card>
</template>
          </v-col>
        </v-row>
      </v-col>

    </v-row>
  </v-container>

</template>


<script>
import LocalStorageService from "@/LocalStorageService";
import { handleRequest } from "@/utils/api"; // Ruta al archivo
import router from '@/router/index';
/*import { Line as LineChart } from 'vue-chartjs'

import { Chart as ChartJS, Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale, PointElement, LineElement } from 'chart.js'
ChartJS.register(Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale, PointElement, LineElement,)*/
export default {
  //components: { LineChart },
  data() {
    return {
       sb_type: '',
    sb_message: '',
    sb_timeout: 2000,
    sb_title: '',
    sb_icon: '',
      expandedStates: {
        salud: false,
        mantenedores: false
      },
      loading: false,
      taskStatus: [
        { name: 'Tareas', count: 4, color: 'orange-lighten-3', icon: 'mdi-calendar-weekend-outline', to: 'task' },
        { name: 'Sugerencias', count: 4, color: 'blue-lighten-3', icon: 'mdi-calendar' },
        { name: 'Salud', count: 2, color: 'purple-lighten-3', icon: 'mdi-calendar', to: '' },
        { name: 'Finanzas', count: 3, color: 'green-lighten-3', icon: 'mdi-calendar', to: 'finance' },
      ],
     
      tasks: [/*
        {
          hour: '08:00',
          title: 'Revisar gastos familiares',
          description: 'Analizar el estado de cuentas y actualizar presupuesto.',
          participants: [
            { name: 'Ana', avatar: 'https://randomuser.me/api/portraits/women/1.jpg' },
            { name: 'Luis', avatar: 'https://randomuser.me/api/portraits/men/2.jpg' },
          ],
          module: 'Finanzas',
          status: 'pendiente',
        },
        {
          hour: '10:30',
          title: 'Control pediátrico',
          description: 'Llevar a Camila al centro médico.',
          participants: [
            { name: 'Camila', avatar: 'https://randomuser.me/api/portraits/women/3.jpg' },
          ],
          module: 'Salud',
          status: 'pendiente',
        },
        {
          hour: '13:00',
          title: 'Preparar almuerzo',
          description: 'Almuerzo vegetariano con ingredientes disponibles.',
          participants: [
            { name: 'Pedro', avatar: 'https://randomuser.me/api/portraits/men/4.jpg' },
          ],
          module: 'Nutrición',
          status: 'pendiente',
        },
        {
          hour: '15:00',
          title: 'Reunión planificación tareas',
          description: 'Organizar responsabilidades semanales en casa.',
          participants: [
            { name: 'Familia Pérez', avatar: 'https://randomuser.me/api/portraits/men/5.jpg' },
          ],
          module: 'Tareas',
          status: 'pendiente',
        },
        {
          hour: '18:00',
          title: 'Paseo con mascota',
          description: 'Llevar a Lolo a caminar al parque.',
          participants: [
            { name: 'Lolo', avatar: 'https://cdn-icons-png.flaticon.com/512/616/616408.png' },
          ],
          module: 'Mascotas',
          status: 'pendiente',
        },*/
      ],


      /*mainteiners: [
      ['Categorías', 'mdi-text-box-outline', '/category'],
      ['Almacénes', 'mdi-warehouse', '/warehouse'],
      ['Prioridades', 'mdi-star-circle-outline', '/priority'],
      ['Roles', 'mdi-account-cog-outline', '/role'],
      ['Estados', 'mdi-check-circle-outline', '/status'],
      ['Tipos de Hogar', 'mdi-home-group', '/hometype'],
      ['Tipos de Salud', 'mdi-heart-pulse', '/type'],
    ],

    salud : [
      ['Historias Clínicas', 'mdi-clipboard-text-outline', '/history'],
      ['Consultas Médicas', 'mdi-stethoscope', '/consultation'],
      ['Exámenes Médicos', 'mdi-microscope', '/exam'],
      ['Emergencias Médicas', 'mdi-alert-circle-outline', '/emergency'],
    ],*/
      chartData: {
        labels: ['Ene', 'Feb', 'Mar', 'Abril', 'May', 'Jun', 'Jul', 'Agost', 'Sep', 'Oct', 'Nov', 'Dic'],
        datasets: [
          {
            label: 'Salud',
            backgroundColor: ["#03626C"],
            data: [1200, 1500, 1000, 1800, 1300, 900, 1700, 5000, 3000, 1000, 300, 100] // Datos estáticos de ejemplo
          }
        ]
      },
      chartOptions: {
        responsive: true
      },
      finances: [
        {
          icon: 'mdi-credit-card', // Ícono
          cardType: 'Secondary',
          bank: 'DBL Bank',
          cardNumber: '1234567890123456',
          cardName: 'William',
          color: 'blue' // Color del avatar
        },
        {
          icon: 'mdi-credit-card-outline', // Ícono
          cardType: 'Primary',
          bank: 'BRC Bank',
          cardNumber: '9876543210987654',
          cardName: 'Michel',
          color: 'green' // Color del avatar
        },
        {
          icon: 'mdi-bank', // Ícono
          cardType: 'Saving',
          bank: 'HSBC',
          cardNumber: '1234567890',
          cardName: 'Clara Elena',
          color: 'purple' // Color del avatar
        },
        // Más objetos...
      ],
      users: [
        {
          avatar: 'https://randomuser.me/api/portraits/men/32.jpg',
          name: 'Juan Pérez',
          role: 'Administrador'
        },
        {
          avatar: 'https://randomuser.me/api/portraits/women/44.jpg',
          name: 'Ana García',
          role: 'Usuario'
        },
        {
          avatar: 'https://randomuser.me/api/portraits/men/55.jpg',
          name: 'Carlos López',
          role: 'Moderador'
        },

        {
          avatar: 'https://randomuser.me/api/portraits/men/70.jpg',
          name: 'Javier Fernández',
          role: 'Soporte'
        },
        {
          avatar: 'https://randomuser.me/api/portraits/women/13.jpg',
          name: 'Carla Sánchez',
          role: 'Recursos Humanos'
        },
        {
          avatar: 'https://randomuser.me/api/portraits/men/25.jpg',
          name: 'David Pérez',
          role: 'Ventas'
        }
      ],
      user: '',
      name: '',
      user_id: '',
      recentOrders: [
        { tracking: '876364', product: 'Camera Lens', price: '$178', order: 325, amount: '$1,466,660' },
        { tracking: '876368', product: 'Black Dress', price: '$14', order: 53, amount: '$46,660' },
        { tracking: '876412', product: 'Argan Oil', price: '$21', order: 78, amount: '$46,676' },
        { tracking: '876621', product: 'EAU DE Parfum', price: '$32', order: 98, amount: '$46,981' },
      ],
      data: {},
     

      input: '',
      messages: [
        { text: 'Hola 👋 ¿En qué te puedo ayudar hoy?', from: 'bot' },
      ],
      home_id: '',
      statuses: [],
      tools: [],

      cards: [
        /*{
          title: 'Dashboard',
          icon: 'mdi-view-dashboard-outline',
          to: '/home',
          color: 'bg-primary'
        },*/
        {
          title: 'Deseos',
          icon: 'mdi-creation',
          to: '/desire',
          color: 'secondary'
        },
        {
          title: 'Finanzas',
          icon: 'mdi-finance',
          to: '/finance',
          color: 'success'
        },
      /*  {
          title: 'Salud',
          icon: 'mdi-hospital-box-outline',
          color: 'light-blue-darken-2',
          to: '/saludMenu',
          menu: true,
          items: [
            { title: 'Historias Clínicas', icon: 'mdi-clipboard-text-outline', to: '/history' },
            { title: 'Consultas Médicas', icon: 'mdi-stethoscope', to: '/consultation' },
            { title: 'Exámenes Médicos', icon: 'mdi-microscope', to: '/exam' },
            { title: 'Emergencias Médicas', icon: 'mdi-alert-circle-outline', to: '/emergency' }
          ]
        },*/
        {
          title: 'Tareas',
          icon: 'mdi-calendar-weekend-outline',
          to: '/task',
          color: 'warning'
        },
        {
          title: 'Almacenes',
          icon: 'mdi-store-outline',
          to: '/personwarehouse',
          color: 'error'
        },
        {
          title: 'Productos',
          icon: 'mdi-package-variant',
          to: '/product',
          color: 'purple'
        },
        {
          title: 'Archivos',
          icon: 'mdi-folder-star-outline',
          to: '/file',
          color: 'indigo'
        },
        {
          title: 'Chat',
          icon: 'mdi-chat',
          to: '/chat',
          color: 'teal'
        },
        {
          title: 'Hogar',
          icon: 'mdi-home',
          to: '/homes',
          color: 'brown'
        },
     /*   {
          title: 'Mantenedores',
          icon: 'mdi-progress-wrench',
          color: 'deep-orange',
          menu: true,
          to: '/mantenedoresMenu',
          items: [
            { title: 'Categorías', icon: 'mdi-text-box-outline', to: '/category' },
            { title: 'Almacénes', icon: 'mdi-warehouse', to: '/warehouse' },
            { title: 'Prioridades', icon: 'mdi-star-circle-outline', to: '/priority' },
            { title: 'Roles', icon: 'mdi-account-cog-outline', to: '/role' },
            { title: 'Estados', icon: 'mdi-check-circle-outline', to: '/status' },
            { title: 'Tipos de Hogar', icon: 'mdi-home-group', to: '/hometype' },
            { title: 'Tipos de Salud', icon: 'mdi-heart-pulse', to: '/type' }
          ]
        }*/
      ],
      taskCount: '',
      whishCount: '',
      financeCount: '',
      personWarehousesCount: '',
      homeCount: '',
      fileCount: '',
      productCount: '',
    };
  },
  mounted() {
    this.name = JSON.parse(LocalStorageService.getItem('name'));
    this.user = JSON.parse(LocalStorageService.getItem('user'));
    this.user_id = JSON.parse(LocalStorageService.getItem('user_id'));
    this.home_id = JSON.parse(LocalStorageService.getItem('home_id'));
    this.showStatuses();
    this.tools = [
      {
        name: 'Crear tarea',
        action: () => this.messages.push({ text: '📝 ¿Cuál es la tarea que deseas crear?', from: 'bot' }),
      },
      {
        name: 'Agregar recordatorio',
        action: () => this.messages.push({ text: '⏰ ¿Qué quieres que te recuerde y cuándo?', from: 'bot' }),
      },
      {
        name: 'Consultar clima',
        action: () => this.messages.push({ text: '🌦️ Por favor indícame tu ciudad para consultar el clima.', from: 'bot' }),
      },
      {
        name: 'Resumen del día',
        action: () => this.messages.push({ text: '📋 Hoy tienes 3 tareas pendientes y 1 recordatorio programado.', from: 'bot' }),
      },
    ]
  },
  methods: {
    getDynamicValue(toPath) {
      console.log('path');
      console.log(toPath);
      // Aquí implementa tu lógica para obtener el valor dinámico
      // basado en el 'to' de la tarjeta
      // Ejemplo simple:
      if (toPath === '/task') return this.taskCount
      if (toPath === '/finance') return this.financeCount
      //if (toPath === '/saludMenu') return '12'
      if (toPath === '/desire') return this.whishCount
      if (toPath === '/personwarehouse') return this.personWarehousesCount
      if (toPath === '/homes') return this.homeCount
      if (toPath === '/file') return this.fileCount
      if (toPath === '/product') return this.productCount
      // Añade más casos según tus necesidades
      return '0'

      // O puedes llamar a una API o consultar Vuex/store
      // return this.$store.getters.getValueByPath(toPath)
    },
    toggleExpanded(key) {
      this.expandedStates[key] = !this.expandedStates[key];
    },
    toggleStatus(index) {
      const task = this.tasks[index]
      task.status = task.status === 'pendiente' ? 'hecha' : 'pendiente'
    },
    selectCategory(category) {
      if (this.selectedCategory === category.name) {
        // Si ya está seleccionada, la deseleccionamos
        this.selectedCategory = null;
      } else {
        // Seleccionamos la nueva categoría
        this.selectedCategory = category.name;

        // Aquí puedes cargar los datos específicos para esta categoría
        this.loadCategoryContent(category.name);
      }
    },
    /*getStatusColor(status) {
    const colorMap = {
      'pending': 'orange', // Más vivo que orange-lighten-3
      'in-progress': 'blue', // Más vivo que blue-lighten-3
      'completed': 'green', // Más vivo que green-lighten-3
      'cancelled': 'red' // Más vivo que red-lighten-1
    };
    return colorMap[status] || 'grey';
    },

    getStatusIcon(status) {
      const iconMap = {
        'pending': 'mdi-clock-outline',
        'in-progress': 'mdi-progress-wrench',
        'completed': 'mdi-check-bold',
        'cancelled': 'mdi-close-circle-outline'
      };
      return iconMap[status] || 'mdi-help-circle';
    },

  getStatusText(status) {
    const textMap = {
      'pending': 'Pendiente',
      'in-progress': 'En progreso',
      'completed': 'Completado',
      'cancelled': 'Cancelado'
    };
    return textMap[status] || 'Desconocido';
  },

  isCurrentStatus(task, statusValue) {
    return task.status === statusValue;
  },*/
    getTypeColor(type) {
      const colorMap = {
        'Tarea': 'deep-purple-lighten-2',
        'Evento': 'teal-lighten-2',
        // Agrega más tipos si es necesario
      };
      return colorMap[type] || 'grey-lighten-1'; // Color por defecto
    },
    getStatusById(statusId) {
      return this.statuses.find(status => status.id === statusId);
    },
    async changeTaskStatus(task, newStatusId) {
      console.log('tarea y estado');
      console.log(task.id);
      console.log(newStatusId);
      // Tu lógica para cambiar el estado
      //task.status_id = newStatusId;
      this.valid = false;
      this.data = {};
      this.data.id = task.id;
      this.data.status_id = newStatusId;

      try {
        const result = await handleRequest({
          endpoint: 'task-update',
          method: 'POST',
          data: this.data
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
      }
      task.statusDialog = false;
      // Aquí probablemente quieras hacer una llamada API para actualizar el estado en el backend
    },
    /*changeTaskStatus(task, newStatus) {
      task.status = newStatus;
      task.statusDialog = false;
    },*/
    async showStatuses() {
      this.data = {};
      this.data.type = "Task";
      this.data.home_id = this.home_id;
      try {
        const result = await handleRequest({
          endpoint: "status-by-type",
          method: "POST",
          data: this.data
        });

        if (result.success) {
          // Si la solicitud es exitosa, asignamos las sucursales
          this.statuses = result.data?.status || [];
          this.taskCount = result.data?.task || 0;
          this.whishCount = result.data?.whish || 0;
          this.financeCount = result.data?.finance || 0;
          this.personWarehousesCount = result.data?.personWarehouses || 0;
          this.homeCount = result.data?.home || 0;
          this.fileCount = result.data?.file || 0;
          this.productCount = result.data?.product || 0;
        } else {
          // Si no hay datos, asignamos un array vacío
          this.statuses = [];
        }
      } catch (error) {
        // Captura de errores no controlados
        this.showAlert(
          "error",
          "Ocurrió un error inesperado al procesar la solicitud.",
          3000
        );
      } finally {
        this.initialize();
      }
    },
    async initialize() {
      this.data = {};
      this.data.home_id = this.home_id;
      const today = new Date();
      const year = today.getFullYear();
      const month = String(today.getMonth() + 1).padStart(2, '0'); // Meses son 0-11
      const day = String(today.getDate()).padStart(2, '0');

      const formattedDate = `${year}-${month}-${day}`; // Formato "YYYY-MM-DD"
      this.data.start_date = formattedDate;
      try {
        this.loading = true;
        const result = await handleRequest({
          endpoint: 'task-date-web',
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
  }
};
</script>

<style scoped>
.custom-card {
  width: 100%;
  /* Responsivo */
  max-width: 200px;
  /* Tamaño máximo */
}

.scrollable-cards {
  max-height: 400px;
  overflow-y: auto;
  /* Scroll vertical cuando el contenido exceda */
}

.ml-3 {
  margin-left: 14px;
}

.subheading {
  font-size: 0.7em;
  color: #757575;
  text-align: center;
}

.icono-concavo {
  width: 48px;
  height: 48px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 10px;
  margin-right: 10px;
  color: white;
  /* Mantenemos solo el efecto cóncavo en el ícono 
  box-shadow: inset;*/
  position: relative;
  overflow: hidden;
}

.icono-concavo::after {
  content: '';
  position: absolute;
  top: 2px;
  left: 2px;
  right: 2px;
  bottom: 2px;
  border-radius: 8px;
  background: transparent;
}

.v-icon {
  font-size: 28px;
}

.status-option {
  transition: background-color 0.3s ease;
}

.status-option:hover {
  background-color: rgba(0, 0, 0, 0.05) !important;
}

.current-status {
  border-left: 4px solid;
  border-left-color: inherit;
}

.v-card-title {
  font-weight: 600;
}

.menu-card {
  cursor: pointer;
  transition: all 0.3s ease;
  border-radius: 10px;
  height: 100%;
}

.menu-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

/*.icono-concavo {
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
}*/

.v-card-title {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

/* Estilo para el menú desplegable */
.v-menu__content {
  border-radius: 8px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
}

.dynamic-circle {
  position: absolute;
  top: 3%;
  right: 1%;
  width: 24px;
  height: 24px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 12px;
  font-weight: bold;
  color: rgb(7, 6, 6);
  z-index: 1;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
}

.dynamic-circle.primary {
  background-color: #03626C;
  /* Usa tu color primario */
}
</style>

<style scoped>
.chat-wrapper {
  max-width: 700px;
  height: 85vh;
  display: flex;
  flex-direction: column;
}

.chat-body {
  flex: 1;
  overflow-y: auto;
  max-height: 65vh;
  scrollbar-width: thin;
  scrollbar-color: #ddd transparent;
}

.chat-body::-webkit-scrollbar {
  width: 6px;
}

.chat-body::-webkit-scrollbar-thumb {
  background-color: #ccc;
  border-radius: 8px;
}

.chat-bubble {
  max-width:100%;
  word-break: break-word;
  font-size: 15px;
  line-height: 1.4;
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

.tools-bar {
  overflow-x: auto;
  white-space: nowrap;
  gap: 8px;
}
</style>