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

  <v-container class="bg-grey-lighten-4">
    <v-row no-gutters class="ma-0">
      <v-col cols="12" class="px-0 mb-6">
        <v-card class="pt-4" elevation="2" style="max-height: 600px; display: flex; flex-direction: column">
          <!-- Chat Body -->
          <div ref="chatBody" class="chat-body px-4 py-2" style="overflow-y: auto; flex-grow: 1">
            <div v-for="(msg, i) in messages" :key="i" class="d-flex mb-8"
              :class="msg.from === 'user' ? 'justify-end' : 'justify-start'">
              <div class="d-flex align-end" :class="msg.from === 'user' ? 'flex-row-reverse' : ''">
                <v-avatar v-if="msg.from !== 'user'" size="28" class="mb-2 mr-3">
                  <v-img src="@/assets/logo-verde.png" alt="Imagen de perfil"></v-img>
                </v-avatar>
                <v-avatar v-else size="28" class="mb-2 ml-3">
                  <v-img :src="`${this.$axios.defaults.baseURL}images/${imageUrl}`" alt="Imagen de usuario"></v-img>
                </v-avatar>
                <div class="chat-bubble px-8 py-3 rounded-xl" :class="
                    msg.from === 'user'
                      ? 'bg-primary text-white'
                      : 'bg-grey-lighten-2 text-black'
                  ">
                  {{ msg.text }}
                </div>
              </div>
            </div>
          </div>
          <div v-if="isTyping" class="d-flex justify-start align-center mb-8 mb-2 ml-3">
            <div class="d-flex align-end">
              <v-avatar size="28" class="mb-2 mr-3">
                <v-img src="@/assets/logo-verde.png" alt="Avatar" />
              </v-avatar>
              <div class="chat-bubble px-8 py-3 rounded-xl bg-grey-lighten-2 text-black">
                <span class="typing-indicator">•••</span>
              </div>
            </div>
          </div>
          <!-- Herramientas -->
          <v-divider />
          <v-card-actions class="pa-3 bg-grey-lighten-5 tools-bar">
            <v-btn v-for="tool in tools" :key="tool.name" @click="tool.action" size="small" color="primary"
              variant="text" prepend-icon="mdi-plus" class="text-capitalize">
              {{ tool.name }}
            </v-btn>
          </v-card-actions>

          <!-- Input -->

          <v-card-actions class="pa-4 bg-white rounded-b-2xl d-flex align-center" style="gap: 12px">
            <!-- Input + texto temporal en un solo bloque -->
            <div style="flex: 1; display: flex; flex-direction: column; overflow: hidden">
              <v-textarea v-model="texto" :placeholder="$t('chat.inputPlaceholder')" variant="outlined" hide-details
                density="compact" rounded rows="1" no-resize @keyup.enter="sendMessage"
                style="overflow-y: auto; max-height: 120px; resize: none" class="custom-textarea" />
              <div v-if="escuchando && textoTemporal" style="
                  margin-top: 10px;
                  font-size: 12px;
                  color: gray;
                  font-style: italic;
                  white-space: pre-wrap;
                  word-break: break-word;
                  max-height: 60px;
                  overflow-y: auto;
                ">
                {{ textoTemporal }}
              </div>
            </div>

            <!-- Botón de dictado -->
            <v-btn color="primary" @click="toggleDictado" :disabled="!compatible" :loading="cargando"
              :icon="escuchando ? 'mdi-microphone-off' : 'mdi-microphone'" :title="
                !compatible ? 'Reconocimiento de voz no compatible con tu navegador' : ''
              "></v-btn>

            <!-- Botón de enviar -->
            <v-btn icon="mdi-send" color="primary" @click="sendMessage" />
          </v-card-actions>
        </v-card>
      </v-col>

      <v-col cols="12" class="pa-0">
        <v-row>
          <template v-for="(card, index) in cards" :key="index">
            <v-col cols="12" sm="6" md="3" v-if="!card.menu">
              <v-card elevation="2" density="comfortable" @click="$router.push(card.to)" class="rounded-lg">
                <v-card-item class="pa-3">
                  <template v-slot:prepend>
                    <div class="icono-concavo">
                      <v-icon :icon="card.icon" :color="card.color" size="x-large"></v-icon>
                    </div>
                  </template>

                  <!-- Contenedor para título + círculo dinámico -->
                  <div class="title-container">
                    <v-card-title class="text-body-2">
                      {{ $t(`menu.${card.to.replace("/", "")}.title`) || card.title }}
                    </v-card-title>
                    <div v-if="getDynamicValue(card.to) > 0" class="dynamic-circle"
                      :class="{ primary: card.color === 'primary' }">
                      {{ getDynamicValue(card.to) }}
                    </div>
                  </div>

                  <v-card-subtitle class="pt-0">
                    <span class="text-body-2">
                      {{
                      $t(`menu.${card.to.replace("/", "")}.description`) ||
                      card.description
                      }}
                    </span>
                  </v-card-subtitle>
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
                    <v-card-item class="pa-2">
                      <template v-slot:prepend>
                        <div class="icono-concavo" :class="card.color" style="margin-inline-end: 8px; padding: 8px">
                          <v-icon :icon="card.icon" size="large"></v-icon>
                        </div>
                      </template>
                      <v-card-title class="text-body-2">{{
                        $t(`menu.${card.to.replace("/", "")}.title`) || card.title
                        }}</v-card-title>
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
                    <v-list-item-title class="text-body-2">{{
                      item.title
                      }}</v-list-item-title>
                  </v-list-item>
                </v-list>
              </v-menu>
            </v-col>
          </template>
        </v-row>
      </v-col>

      <v-col cols="12" class="ma-0 pt-6" style="max-height: 60vh; min-height: 40vh; overflow-y: auto">
        <template v-if="tasks.length === 0">
          <v-col cols="12" class="text-center py-8 pa-0">
            <v-icon size="64" color="grey-lighten-1">mdi-check-circle-outline</v-icon>
            <div class="text-body-2 text-grey mt-4">
              {{ $t("taskForm.noTasksToday") }}
            </div>
          </v-col>
        </template>

        <template v-else>
          <v-card v-for="(meeting, index) in tasks" :key="index" class="mb-4 rounded-lg pa-2" density="comfortable"
            elevation="2">
            <v-row>
              <!-- Barra lateral de color e info -->
              <v-col cols="1" class="d-flex justify-start">
                <div class="icono-concavo d-flex flex-column justify-center justify-start"
                  :class="`bg-${getTypeColor(meeting.type)}`">
                  <div class="date-display">
                    {{ formatIntuitiveDate(meeting.start_date) }}
                  </div>
                  <div v-if="meeting.start_time" class="time-display">
                    {{ formatTime(meeting.start_time) }}
                  </div>
                </div>
              </v-col>

              <!-- Contenido principal -->
              <v-col cols="7" class="d-flex align-center justify-start">
                <v-row align="center" class="gap-3">
                  <div>
                    <div class="font-weight-bold text-body-2">
                      {{ meeting.title }}
                    </div>
                    <div class="text-body-2 d-flex align-center text-grey-darken-1">
                      {{ meeting.description }}
                    </div>
                    <div class="text-body-2 d-flex align-center text-grey-darken-1">
                      {{ meeting.geo_location }}
                    </div>
                  </div>
                </v-row>
              </v-col>
              <v-col cols="1" class="d-flex align-center justify-start">
                <!-- Info usuario -->
                <v-row align="center" class="gap-3">
                  <div class="avatar-row d-flex flex-wrap justify-end gap-1">
                    <v-tooltip v-for="person in meeting.people" :key="person.id" bottom :open-delay="300"
                      :close-delay="100">
                      <template v-slot:activator="{ props }">
                        <v-avatar class="avatar-item hover-expand" size="32" v-bind="props">
                          <v-img :src="`${this.$axios.defaults.baseURL}images/${
                              person.image
                            }?t=${Date.now()}`" alt="avatar" />
                        </v-avatar>
                      </template>
                      <span>{{ person.name }}<br />{{ person.roleName }}</span>
                    </v-tooltip>
                  </div>
                </v-row>
              </v-col>
              <v-col cols="1" class="d-flex align-center justify-start">
                <div>
                  <v-icon :color="getTypeColor(meeting.type)"
                    style="font-size: 10px; filter: drop-shadow(0 0 2px currentColor)" icon="mdi-circle"
                    class="mr-0"></v-icon>
                  <span class="text-grey-darken-1 text-body-2">{{
                    meeting.typeName
                    }}</span>
                </div>
              </v-col>
              <v-col cols="1" class="d-flex align-center justify-start">
                <div>
                  <span class="text-grey-darken-1 text-body-2">{{
                    meeting.namePriority
                    }}</span>
                </div>
              </v-col>
              <v-col cols="1" class="d-flex align-center justify-end justify-start">
                <v-row>
                  <!-- Fecha y estado -->
                  <div>
                    <v-dialog v-model="meeting.statusDialog" width="400">
                      <template v-slot:activator="{ props }">
                        <v-btn v-bind="props" :color="
                            '#' +
                            (getStatusById(meeting.status_id)?.colorStatus || 'grey')
                          " variant="text" size="small" class="text-body-2" :prepend-icon="
                            getStatusById(meeting.status_id)?.iconStatus ||
                            'mdi-help-circle'
                          ">
                          {{
                          getStatusById(meeting.status_id)?.nameStatus || "Desconocido"
                          }}
                        </v-btn>
                      </template>
                      <v-card>
                        <v-card-title class="pa-4 text-center">
                          {{ $t("taskForm.updateStatus") }}
                        </v-card-title>
                        <v-divider></v-divider>
                        <v-card-text class="pa-0">
                          <v-row class="px-2 pb-1" dense>
                            <v-col cols="12" v-for="(statusOption, i) in status" :key="i" class="py-1">
                              <v-card @click="changeTaskStatus(meeting, statusOption.id)" :class="[
                                  'status-option mx-1',
                                  {
                                    'current-status':
                                      meeting.status_id === statusOption.id,
                                  },
                                ]" :style="
                                  meeting.status_id === statusOption.id
                                    ? {
                                        'background-color': `#${statusOption.colorStatus}`,
                                        'border-color': `#${statusOption.colorStatus}`,
                                        color: 'white',
                                      }
                                    : {
                                        'border-color': '#9e9e9e', // Color gris (puedes ajustar el código de color según necesites)
                                      }
                                " variant="outlined" :elevation="meeting.status_id === statusOption.id ? 2 : 0"
                                style="border-radius: 12px; cursor: pointer">
                                <v-card-item class="pa-2">
                                  <div class="d-flex align-center">
                                    <v-icon :color="
                                        meeting.status_id === statusOption.id
                                          ? 'white'
                                          : '#' + statusOption.colorStatus
                                      " :icon="statusOption.iconStatus" size="large" class="mr-3"></v-icon>
                                    <v-card-title :style="{
                                        color:
                                          meeting.status_id === statusOption.id
                                            ? 'white'
                                            : 'inherit',
                                        'font-size': '1rem',
                                      }">
                                      {{ statusOption.nameStatus }}
                                    </v-card-title>
                                    <v-spacer></v-spacer>
                                    <v-icon v-if="meeting.status_id === statusOption.id" color="white"
                                      icon="mdi-check-circle"></v-icon>
                                  </div>
                                </v-card-item>
                              </v-card>
                            </v-col>
                          </v-row>
                        </v-card-text>
                        <v-divider></v-divider>
                        <v-card-actions>
                          <v-spacer></v-spacer>
                          <v-btn variant="flat" color="#03626C" @click="meeting.statusDialog = false">
                            {{ $t("buttons.cancel") }}
                          </v-btn>
                        </v-card-actions>
                      </v-card>
                    </v-dialog>
                  </div>
                </v-row>
              </v-col>
            </v-row>
          </v-card>
        </template>
      </v-col>
    </v-row>
  </v-container>
  <v-dialog v-model="dialogChatTask" fullscreen transition="dialog-bottom-transition">
    <v-card>
      <v-card-text>
        <!-- Pasamos los parámetros al componente ChatTask -->
        <ChatTask :taskData="currentTask" @close-dialog="closeDialgChat()"
          @close-all-dialogs="closeAllDialogs($event)" />
      </v-card-text>
      <v-divider></v-divider>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn text @click="closeDialgChat()">Cerrar</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>

  <v-dialog v-model="dialogChatFinance" fullscreen transition="dialog-bottom-transition">
    <v-card>
      <v-card-text>
        <!-- Pasamos los parámetros al componente ChatTask -->
        <ChatFinance :financeData="currentFinance" :transactionIntent="currentIntentFinance" @close-dialog="closeDialgChat()"
          @close-all-dialogs="closeAllDialogs($event)" />
      </v-card-text>
      <v-divider></v-divider>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn text @click="closeDialgChat()">Cerrar</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
  <v-dialog v-model="dialogChatBudget" fullscreen transition="dialog-bottom-transition">
    <v-card>
      <v-card-text>
        <!-- Pasamos los parámetros al componente ChatTask -->
        <ChatBudget :budgetData="currentBudget" @close-dialog="closeDialgChat()"
          @close-all-dialogs="closeAllDialogs($event)" />
      </v-card-text>
      <v-divider></v-divider>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn text @click="closeDialgChat()">Cerrar</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
  <v-dialog v-model="dialogChatWarehouse" fullscreen transition="dialog-bottom-transition">
    <v-card>
      <v-card-text>
        <!-- Pasamos los parámetros al componente ChatTask -->
        <ChatWarehouse :warehouseData="currentWarehouse" @close-dialog="closeDialgChat()"
          @close-all-dialogs="closeAllDialogs($event)" />
      </v-card-text>
      <v-divider></v-divider>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn text @click="closeDialgChat()">Cerrar</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
  <v-dialog v-model="dialogChatProduct" fullscreen transition="dialog-bottom-transition">
    <v-card>
      <v-card-text>
        <!-- Pasamos los parámetros al componente ChatTask -->
        <ChatProduct :productData="currentProduct" @close-dialog="closeDialgChat()"
          @close-all-dialogs="closeAllDialogs($event)" />
      </v-card-text>
      <v-divider></v-divider>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn text @click="closeDialgChat()">Cerrar</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
  <v-dialog v-model="dialogChatDesire" fullscreen transition="dialog-bottom-transition">
    <v-card>
      <v-card-text>
        <!-- Pasamos los parámetros al componente ChatTask -->
        <ChatDesire :desireData="currentDesire" @close-dialog="closeDialgChat()"
          @close-all-dialogs="closeAllDialogs($event)" />
      </v-card-text>
      <v-divider></v-divider>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn text @click="closeDialgChat()">Cerrar</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
import LocalStorageService from "@/LocalStorageService";
import { handleRequest } from "@/utils/api"; // Ruta al archivo
import router from "@/router/index";
import { shallowRef } from "vue";
import _ from "lodash";
import ChatTask from "../views/chat/ChatTask.vue";
import ChatFinance from "./chat/ChatFinance.vue";
import ChatBudget from "./chat/ChatBudget.vue";
import ChatWarehouse from "./chat/ChatWarehouse.vue";
import ChatProduct from "./chat/ChatProduct.vue";
import ChatDesire from "./chat/ChatDesire.vue";

/*import { Line as LineChart } from 'vue-chartjs'

import { Chart as ChartJS, Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale, PointElement, LineElement } from 'chart.js'
ChartJS.register(Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale, PointElement, LineElement,)*/
export default {
  components: {
    //"v-time-picker": VTimePicker,
    ChatFinance,
    ChatTask,
    ChatBudget,
    ChatWarehouse,
    ChatProduct,
    ChatDesire
  },
  //components: { LineChart },
  data() {
    return {
      selected: shallowRef([2]),
      dialogChatTask: false,
      dialogChatFinance: false,
      dialogChatBudget: false,
      dialogChatWarehouse: false,
      dialogChatProduct: false,
      dialogChatDesire: false,
      currentTask: null,
      currentFinance: null,
      currentBudget: null,
      currentWarehouse: null,
      currentIntentFinance: null,
      currentProduct: null,
      currentDesire: null,
      selected2: null,
      texto: "", // texto confirmado y editable
      textoTemporal: "", // texto dictado en vivo (solo para mostrar)
      escuchando: false,
      cargando: false,
      recognition: null,
      compatible: true,
      snackbar: false,
      imageUrl: "",
      sb_type: "",
      sb_message: "",
      sb_timeout: 2000,
      sb_title: "",
      sb_icon: "",
      isTyping: false,
      expandedStates: {
        salud: false,
        mantenedores: false,
      },
      loading: false,
      taskStatus: [
        {
          name: "Tareas",
          count: 4,
          color: "orange-lighten-3",
          icon: "mdi-calendar-weekend-outline",
          to: "task",
        },
        { name: "Sugerencias", count: 4, color: "blue-lighten-3", icon: "mdi-calendar" },
        {
          name: "Salud",
          count: 2,
          color: "purple-lighten-3",
          icon: "mdi-calendar",
          to: "",
        },
        {
          name: "Finanzas",
          count: 3,
          color: "green-lighten-3",
          icon: "mdi-calendar",
          to: "finance",
        },
      ],

      tasks: [],
      chartData: {
        labels: [
          "Ene",
          "Feb",
          "Mar",
          "Abril",
          "May",
          "Jun",
          "Jul",
          "Agost",
          "Sep",
          "Oct",
          "Nov",
          "Dic",
        ],
        datasets: [
          {
            label: "Salud",
            backgroundColor: ["#03626C"],
            data: [1200, 1500, 1000, 1800, 1300, 900, 1700, 5000, 3000, 1000, 300, 100], // Datos estáticos de ejemplo
          },
        ],
      },
      chartOptions: {
        responsive: true,
      },
      user: "",
      name: "",
      user_id: "",
      data: {},

      //input: "",
      messages: [
        {
          text: `Hola 👋 ${
            this.name ? this.name + ", " : ""
          }¿En qué te puedo ayudar hoy?`,
          from: "ai",
        },
      ],
      home_id: "",
      status: [],
      tools: [],

      cards: [
        {
          title: "Deseos",
          description: "Listas de deseos y compras",
          icon: "mdi-creation",
          to: "/desire",
          color: "secondary",
        },
        {
          title: "Finanzas",
          description: "Ingresos, gastos y presupuestos",
          icon: "mdi-finance",
          to: "/finance",
          color: "success",
        },
        {
          title: "Tareas",
          description: "Organiza actividades pendientes",
          icon: "mdi-calendar-weekend-outline",
          to: "/task",
          color: "warning",
        },
        {
          title: "Almacenes",
          description: "Gestiona inventarios",
          icon: "mdi-store-outline",
          to: "/personwarehouse",
          color: "error",
        },
        {
          title: "Historia Clínica",
          description: "Registro médico y bienestar",
          icon: "mdi-heart-pulse",  // Icono de corazón/pulso (típico para salud)
          to: "/history",            // Ruta sugerida
          color: "pink",            // Color que asocia con salud
          // Alternativa de color: "red" para algo más estándar
        },
        /*{
          title: "Productos",
          description: "Catálogo de productos",
          icon: "mdi-package-variant",
          to: "/product",
          color: "purple",
        },*/
        {
          title: "Archivos",
          description: "Documentos importantes",
          icon: "mdi-folder-star-outline",
          to: "/file",
          color: "indigo",
        },
        /*{
          title: "Chat",
          description: "Comunicación con contactos",
          icon: "mdi-chat",
          to: "/chat",
          color: "teal",
        },*/
        {
          title: "Hogar",
          description: "Gestión del hogar",
          icon: "mdi-home",
          to: "/homes",
          color: "brown",
        },
        {
          title: "suggestions",
          description: "Recomendaciones y propuestas",
          icon: "mdi-lightbulb-on-outline",
          to: "/suggestions",
          color: "amber",
        },
      ] /*   {
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
        }*/,
      taskCount: "",
      whishCount: "",
      financeCount: "",
      personWarehousesCount: "",
      suggestionCount: "",
      homeCount: "",
      fileCount: "",
      productCount: "",
      dialog: false,
      editedItem: {
        id: "",
        title: "",
        description: "",
        start_date: null,
        end_date: null,
        start_time: null,
        end_time: null,
        type: "Tarea",
        parent_id: "",
        status_id: "",
        category_id: "",
        person_id: null,
        home_id: "",
        recurrence: "",
        estimated_time: 1,
        attachments: null,
        comments: "",
        geo_location: "",
        people: [],
      },

      defaultItem: {
        id: "",
        title: "",
        description: "",
        start_date: null,
        end_date: null,
        start_time: null,
        end_time: null,
        type: "",
        parent_id: "",
        status_id: "",
        category_id: "",
        person_id: null,
        home_id: "",
        recurrence: "",
        estimated_time: 1,
        attachments: null,
        comments: "",
        geo_location: "",
        people: [],
      },

      originalItem: {
        id: "",
        title: "",
        description: "",
        start_date: null,
        end_date: null,
        start_time: null,
        end_time: null,
        type: "",
        parent_id: "",
        status_id: "",
        category_id: "",
        person_id: null,
        home_id: "",
        recurrence: "",
        estimated_time: 1,
        attachments: null,
        comments: "",
        geo_location: "",
        people: [],
      },
      step: 0,
      valid: true,
      time: null,
      modal2: false,
      timePickerDialog: false,
      steps: [
        { title: "Información Básica", subtitle: "Ingresa el título y descripción" },
        { title: "Asignación", subtitle: "Selecciona responsables y participantes" },
        { title: "Programación", subtitle: "Elige fecha y hora de la tarea" },
      ],
      menu: false,
      menu2: false,
      input: null,
      input2: null,
      editedIndex: -1,
      categories: [],

      priorities: [],
      people: [],
      tittlePerson: -1,
      selectedItems: {}, // Almacena las selecciones por rol
      persons: [],
      recurrences: [],
      typetasks: [],

      roles: [],
      nameRules: [
        (v) => !!v || "El campo es requerido",
        (v) => (v && v.length <= 50) || "El campo debe tener menos de 51 caracteres",
        (v) => (v && v.length >= 3) || "El campo debe tener al menos de 3 caracteres",
      ],
      selectRules: [(v) => !!v || "Seleccionar al menos un elemento"],
    };
  },
  computed: {
    textoEditable() {
      // Muestra texto confirmado + texto dictado en vivo
      return this.texto + this.textoTemporal;
    },
    formTitle() {
      return this.editedIndex === -1
        ? this.$t("taskForm.titles.new")
        : this.$t("taskForm.titles.edit");
    },
    formTitlePerson() {
      return this.tittlePerson === -1
        ? "Asignar Personas a la Tarea"
        : "Editar rol de la persona";
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
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;

    if (!SpeechRecognition) {
      this.compatible = false;
      return;
    }

    this.recognition = new SpeechRecognition();
    this.recognition.lang = "es-ES";
    this.recognition.continuous = true;
    this.recognition.interimResults = true;

    this.recognition.onstart = () => {
      this.escuchando = true;
      this.cargando = false;
    };

    this.recognition.onresult = (event) => {
      let interim = "";
      let final = "";

      for (let i = event.resultIndex; i < event.results.length; ++i) {
        const transcript = event.results[i][0].transcript;
        if (event.results[i].isFinal) {
          final += transcript;
        } else {
          interim += transcript;
        }
      }

      if (final) {
        this.texto += (this.texto.endsWith(" ") ? "" : " ") + final + " ";
      }

      this.textoTemporal = interim;
    };

    this.recognition.onerror = (event) => {
      console.error("Error de reconocimiento:", event.error);
      this.escuchando = false;
      this.cargando = false;
    };

    this.recognition.onend = () => {
      this.escuchando = false;
      this.textoTemporal = "";
    };
    this.name = JSON.parse(LocalStorageService.getItem("name"));
    this.user = JSON.parse(LocalStorageService.getItem("user"));
    this.user_id = JSON.parse(LocalStorageService.getItem("user_id"));
    this.home_id = JSON.parse(LocalStorageService.getItem("home_id"));
    this.imageUrl = LocalStorageService.getItem("image").replace(/['"]+/g, "");
    this.messages = [
      {
        text: `Hola 👋 ${this.name}, ¿En qué te puedo ayudar hoy?`,
        from: "ai",
      },
    ];
    this.showStatuses();
    this.tools = [
      {
        name: "Crear tarea",
        action: () =>
          this.messages.push({
            text: "📝 ¿Cuál es la tarea que deseas crear?",
            from: "bot",
          }),
      },
      {
        name: "Agregar recordatorio",
        action: () =>
          this.messages.push({
            text: "⏰ ¿Qué quieres que te recuerde y cuándo?",
            from: "bot",
          }),
      },
      {
        name: "Consultar clima",
        action: () =>
          this.messages.push({
            text: "🌦️ Por favor indícame tu ciudad para consultar el clima.",
            from: "bot",
          }),
      },
      {
        name: "Resumen del día",
        action: () =>
          this.messages.push({
            text: "📋 Hoy tienes 3 tareas pendientes y 1 recordatorio programado.",
            from: "bot",
          }),
      },
    ];
  },
  methods: {
    closeAllDialogs(sourceComponent) {
      console.log(`Cerrando todo desde: ${sourceComponent}`);
      this.dialogChatTask = false;
      this.dialogChatFinance = false;
      this.dialogChatBudget = false;
      this.dialogChatWarehouse = false;
      this.dialogChatProduct = false;
      this.dialogChatDesire = false;
      this.texto = "";
      this.textoTemporal = "";
      this.currentTask = null;
      this.currentFinance = null;
      this.currentBudget = null;
      this.currentWarehouse = null;
      this.currentProduct = null;
      this.currentDesire = null;
    },
    closeDialgChat() {
      this.dialogChatTask = false;
      this.dialogChatFinance = false;
      this.dialogChatBudget = false;
      this.dialogChatWarehouse = false;
      this.dialogChatProduct = false;
      this.dialogChatDesire = false;
      this.texto = "";
      this.textoTemporal = "";
      this.currentTask = null;
      this.currentFinance = null;
      this.currentBudget = null;
      this.currentWarehouse = null;
      this.currentProduct = null;
      this.currentDesire = null;
      this.initialize();
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
            })
            .replace(/\./g, "");
      }
    },

    formatTime(timeString) {
      if (!timeString) return "";

      const [hours, minutes] = timeString.split(":");
      return `${hours}:${minutes}`;
    },
    toggleDictado() {
      if (!this.recognition) return;

      if (this.escuchando) {
        this.recognition.stop();
      } else {
        this.cargando = true;
        this.recognition.start();
      }
    },
    async sendMessage() {
      if (this.texto.trim() === "") return;

      // Guardar el texto temporal
      this.textoTemporal = this.texto;
      console.log("Texto temporal:", this.textoTemporal);
      // Abrir el diálogo con el chat
      const tempMessage = this.texto.trim();
      this.texto = "";

      // Agregar mensaje del usuario al chat
      this.messages.push({
        from: "user",
        text: tempMessage,
        timestamp: new Date().toLocaleTimeString(),
      });
      //this.dialogChatTask = true;
      this.isTyping = true;
      try {
        // Llamar a la IA
        const response = await handleRequest({
          endpoint: "ask-ai-task",
          method: "POST",
          data: {
            question: tempMessage,
            issue:
              "Eres un asistente para gestión del hogar: tareas, metas, finanzas, salud, compras y presupuestos.",
            home_id: this.home_id,
          },
        });
        this.isTyping = false;
        const { intentDetected, intent, task, answer, finances, budget, warehouse, product, desire } = response.data;

        if (intentDetected && intent) {
          // Preparar datos comunes
          this.data = { home_id: this.home_id };

          // Si hay datos de tarea, guardarlos
          /*if (task) {
        this.taskParameters = {
          ...this.taskParameters,
          ...task,
        };
      }*/

          // Cargar datos requeridos si es necesario
          //await this.loadRequiredData();

          // Determinar qué chat mostrar según la intención
          switch (intent) {
            case "Tarea":
              this.currentTask = null;
              this.$nextTick(() => {
                const taskData =
                  typeof response.data.task === "string"
                    ? JSON.parse(response.data.task)
                    : response.data.task;

                this.currentTask = _.cloneDeep(taskData);
                this.dialogChatTask = true;
                this.scrollToBottom();
              });
              break;

            case "Meta":
              this.currentTask = null;
              this.$nextTick(() => {
                const taskData =
                  typeof response.data.task === "string"
                    ? JSON.parse(response.data.task)
                    : response.data.task;

                this.currentTask = _.cloneDeep(taskData);
                this.dialogChatTask = true;
                this.scrollToBottom();
              });
              break;

            case "Gasto":
              this.currentFinance = null;
              this.$nextTick(() => {
                const financeData =
                  typeof finances === "string"
                    ? JSON.parse(finances)
                    : finances;

              
                if(financeData.spent <= 0)
                {
                this.messages.push({
                from: "ai",
                text:
                  /*answer ||*/
                  "Detecte que desea registrar un gasto pero no especificaste el monto, podrías ser mas especifico",
                timestamp: new Date().toLocaleTimeString(),
              });
            }else{
                this.currentFinance = _.cloneDeep(financeData);
                this.currentIntentFinance = response.data.intent;
                this.dialogChatFinance = true;
                this.scrollToBottom();
            }
              });
              break;

            case "Ingreso":
              this.currentFinance = null;
              this.$nextTick(() => {
                const financeData =
                  typeof finances === "string"
                    ? JSON.parse(finances)
                    : finances;

              
                if(financeData.income <= 0)
                {
                this.messages.push({
                from: "ai",
                text:
                  /*answer ||*/
                  "Detecte que desea registrar un ingreso pero no especificaste el monto, podrías ser mas especifico",
                timestamp: new Date().toLocaleTimeString(),
              });
            }else{
                this.currentFinance = _.cloneDeep(financeData);
                this.currentIntentFinance = response.data.intent;
                this.dialogChatFinance = true;
                this.scrollToBottom();
            }
              });
              break;

            case "Presupuesto":
              this.currentBudget = null;
              this.$nextTick(() => {
                const budgetData =
                  typeof budget === "string"
                    ? JSON.parse(budget)
                    : budget;
                if(budgetData.amount <= 0)
                {
                this.messages.push({
                from: "ai",
                text:
                  /*answer ||*/
                  "Detecte que desea registrar un presupuesto pero no especificaste el monto, podrías ser mas especifico",
                timestamp: new Date().toLocaleTimeString(),
              });
            }else{
                this.currentBudget = _.cloneDeep(budgetData);
                this.dialogChatBudget = true;
                this.scrollToBottom();
              }
              });
              break;

              case "Warehouse":
              this.currentWarehouse = null;
              this.$nextTick(() => {
                const warehouseData =
                  typeof warehouse === "string"
                    ? JSON.parse(warehouse)
                    : warehouse;

                this.currentWarehouse = _.cloneDeep(warehouseData);
                this.dialogChatWarehouse = true;
                this.scrollToBottom();
              });
              break;
            
              case "Producto":
              this.currentProduct = null;
              this.$nextTick(() => {
                const productData =
                  typeof product === "string"
                    ? JSON.parse(product)
                    : product;
                 if (isNaN(productData.quantity) || isNaN(productData.unit_price) || productData.quantity <= 0 || productData.unit_price <= 0) {
                    this.messages.push({
                      from: "ai",
                      text: "⚠️ Parece que aún no has especificado bien la **cantidad** o el **precio unitario** del producto. Ambos deben ser valores numéricos mayores a cero. ¿Podrías revisarlo y corregirlo, por favor?",
                      timestamp: new Date().toLocaleTimeString(),
                    });
                    return; // Detener el flujo hasta que se corrijan
                  }else{
                this.currentProduct = _.cloneDeep(productData);
                this.dialogChatProduct = true;
                this.scrollToBottom();
              }
              });
              break;

              case "Deseo":
              this.currentDesire = null;
              this.$nextTick(() => {
                const desireData =
                  typeof desire === "string"
                    ? JSON.parse(desire)
                    : desire;

                this.currentDesire = _.cloneDeep(desireData);
                this.dialogChatDesire = true;
                this.scrollToBottom();
              });
              break;

            case "salud":
              this.currentHealthData = _.cloneDeep(task || {});
              this.dialogChatHealth = true;
              this.scrollToBottom();
              break;

            case "compra":
              this.currentShoppingData = _.cloneDeep(task || {});
              this.dialogChatShopping = true;
              this.scrollToBottom();
              break;

            default:
              // Respuesta por defecto si no se reconoce la intención
              this.messages.push({
                from: "ai",
                text:
                  answer ||
                  "No entendí muy bien tu solicitud. ¿Podrías ser más específico?",
                timestamp: new Date().toLocaleTimeString(),
              });
          }
        } else {
          this.isTyping = false;
          // No se detectó intención, solo mostrar respuesta normal
          this.messages.push({
            from: "ai",
            text: answer || "No tengo claro qué necesitas. ¿Puedes ser más específico?",
            timestamp: new Date().toLocaleTimeString(),
          });
        }
      } catch (error) {
        this.isTyping = false;
        console.error("Error al procesar el mensaje:", error);
        this.messages.push({
          from: "ai",
          text: "Ocurrió un error al procesar tu solicitud. Inténtalo nuevamente.",
          timestamp: new Date().toLocaleTimeString(),
        });
      }
    },
    scrollToBottom() {
      this.messages = [
        {
          text: `Hola 👋 ${
            this.name ? this.name + ", " : ""
          }¿En qué te puedo ayudar hoy?`,
          from: "ai",
          timestamp: new Date().toLocaleTimeString(),
        },
      ];
      // Limpiar cualquier otro estado relacionado con el chat
      this.texto = "";
      this.textoTemporal = "";
      this.$nextTick(() => {
        const chatContainer = this.$refs.chatBody;
        if (chatContainer) {
          chatContainer.scrollTop = chatContainer.scrollHeight;
        }
      });
    },
    close() {
      this.step = 0;
      this.dialog = false;
      this.$nextTick(() => {
        this.editedItem = Object.assign({}, this.defaultItem);
        this.originalItem = Object.assign({}, this.defaultItem);
      });
      this.editedIndex = -1;
    },
    async save() {
      console.log("Guardando tarea...:", this.editedItem);
      this.loading = true;
      this.valid = false;
      const fieldsToUpdate = [
        "title",
        "description",
        "start_date",
        "end_date",
        "parent_id",
        "status_id",
        "category_id",
        "home_id",
        "recurrence",
        "comments",
        "estimated_time",
        "attachments",
        "geo_location",
        "priority_id",
        "people",
        "start_time",
        "end_time",
        "type",
      ];
      let updatedFields = Object.keys(this.editedItem)
        .filter(
          (key) =>
            fieldsToUpdate.includes(key) &&
            this.editedItem[key] !== this.originalItem[key]
        )
        .reduce((obj, key) => {
          if (key === "people") {
            // Transformar el campo `people`
            obj[key] = this.editedItem.people.map((person) => ({
              home_id: Number(this.editedItem.home_id), // Asegurar que sea un número
              person_id: Number(person.id), // Asegurar que sea un número
              role_id: Number(person.roleId),
              roleName: person.roleName,
            }));
          } else {
            obj[key] = this.editedItem[key];
          }
          return obj;
        }, {});

      // Agregar campos adicionales si es necesario
      if (Object.keys(updatedFields).length > 0) {
        updatedFields.home_id = this.editedItem.home_id;
        updatedFields.start_date = this.editedItem.start_date
          ? this.editedItem.start_date
          : `${new Date().getFullYear()}-${String(new Date().getMonth() + 1).padStart(
              2,
              "0"
            )}-${String(new Date().getDate()).padStart(2, "0")}`;
        updatedFields.estimated_time = this.editedItem.estimated_time
          ? this.editedItem.estimated_time
          : 0;
        updatedFields.type = this.editedItem.type ? this.editedItem.type : "Tarea";

        if (this.file) {
          updatedFields.attachments = this.editedItem.attachments;
        }

        // Crear el objeto FormData
        const formData = new FormData();
        for (let key in updatedFields) {
          if (key === "people") {
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
            endpoint: "task",
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
        this.showAlert("success", "Debe completar los datos de la tarea.", 3000);
      }
      this.close();
    },
    getDynamicValue(toPath) {
      console.log("path");
      console.log(toPath);
      // Aquí implementa tu lógica para obtener el valor dinámico
      // basado en el 'to' de la tarjeta
      // Ejemplo simple:
      if (toPath === "/task") return this.taskCount;
      if (toPath === "/finance") return this.financeCount;
      //if (toPath === '/saludMenu') return '12'
      if (toPath === "/desire") return this.whishCount;
      if (toPath === "/personwarehouse") return this.personWarehousesCount;
      if (toPath === "/homes") return this.homeCount;
      if (toPath === "/file") return this.fileCount;
      if (toPath === "/product") return this.productCount;
      if (toPath === "/suggestions") return this.suggestionCount;
      // Añade más casos según tus necesidades
      return "0";

      // O puedes llamar a una API o consultar Vuex/store
      // return this.$store.getters.getValueByPath(toPath)
    },
    toggleExpanded(key) {
      this.expandedStates[key] = !this.expandedStates[key];
    },
    toggleStatus(index) {
      const task = this.tasks[index];
      task.status = task.status === "pendiente" ? "hecha" : "pendiente";
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
        Tarea: "warning",
        Meta: "purple",
        // Agrega más tipos si es necesario
      };
      return colorMap[type] || "grey-lighten-1"; // Color por defecto
    },
    getStatusById(statusId) {
      return this.status.find((status) => status.id === statusId);
    },
    async changeTaskStatus(task, newStatusId) {
      console.log("tarea y estado");
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
          endpoint: "task-update",
          method: "POST",
          data: this.data,
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
          data: this.data,
        });

        if (result.success) {
          // Si la solicitud es exitosa, asignamos las sucursales
          this.status = result.data?.status || [];
          this.taskCount = result.data?.task || 0;
          this.whishCount = result.data?.whish || 0;
          this.financeCount = result.data?.finance || 0;
          this.personWarehousesCount = result.data?.personWarehouses || 0;
          this.homeCount = result.data?.home || 0;
          this.fileCount = result.data?.file || 0;
          this.suggestionCount = result.data.suggestion || 0;
          this.productCount = result.data?.product || 0;
        } else {
          // Si no hay datos, asignamos un array vacío
          this.status = [];
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
      const month = String(today.getMonth() + 1).padStart(2, "0"); // Meses son 0-11
      const day = String(today.getDate()).padStart(2, "0");

      const formattedDate = `${year}-${month}-${day}`; // Formato "YYYY-MM-DD"
      this.data.start_date = formattedDate;
      try {
        this.loading = true;
        const result = await handleRequest({
          endpoint: "task-date-web",
          method: "POST",
          data: this.data,
        });

        if (result.success) {
          // Si la solicitud es exitosa, asignamos las sucursales
          this.tasks = result.data?.tasks || []; // Si no hay roles, asigna un arreglo vacío
        } else {
          // Si no hay datos, asignamos un array vacío
          this.tasks = [];
          //this.showAlert('success', result.message || 'No hay tareas disponibles.', 3000);
        }
      } catch (error) {
        this.loading = false;
        // Captura de errores no controlados
        this.showAlert(
          "error",
          "Ocurrió un error inesperado al cargar las tareas.",
          3000
        );
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
    //tarea
    nextStep() {
      if (this.step < this.steps.length - 1) {
        this.step++;
      } else {
        this.dialog = false;
        this.step = 0;
        this.save();
      }
    },
    getRoleIcon(roleId) {
      const role = this.roles.find((r) => r.id === roleId);
      if (!role) return "mdi-account";

      switch (role.name.toLowerCase()) {
        case "responsable":
          return "mdi-star";
        case "colaborado":
          return "mdi-account-group";
        default:
          return "mdi-account";
      }
    },

    updateSelection(role, selectedIds) {
      console.log("Selection changed:", { role, selectedIds });

      // Eliminar personas de este rol que ya no están seleccionadas
      this.editedItem.people = this.editedItem.people.filter(
        (p) => p.roleId !== role.id || selectedIds.includes(p.id)
      );

      // Agregar nuevas selecciones
      selectedIds.forEach((personId) => {
        if (
          !this.editedItem.people.some((p) => p.id === personId && p.roleId === role.id)
        ) {
          const person = this.people.find((p) => p.id === personId);
          if (person) {
            this.editedItem.people.push({
              id: person.id,
              name: person.namePerson,
              image: person.imagePerson,
              roleId: role.id,
              roleName: role.nameRol,
            });
          }
        }
      });

      console.log("Updated people:", this.editedItem.people);
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
    filteredPeople(roleId) {
      return this.people.filter((person) => {
        const assignedPerson = this.editedItem.people.find((p) => p.id === person.id);
        return !assignedPerson || assignedPerson.roleId === roleId;
      });
    },

    isPersonSelected(personId, roleId) {
      console.log("isPersonSelected", personId, roleId);
      return this.editedItem.people.some((p) => p.id === personId && p.roleId === roleId);
    },
    generateTimeSlots() {
      const now = new Date();
      const currentHour = now.getHours();
      const currentMinute = now.getMinutes();

      // Redondear a los 5 minutos más cercanos
      const roundedMinute = Math.ceil(currentMinute / 5) * 5;
      const nearestTime = new Date();
      nearestTime.setMinutes(roundedMinute, 0, 0);

      // Si pasamos de 60 minutos, ajustar hora
      if (roundedMinute >= 60) {
        nearestTime.setHours(currentHour + 1);
        nearestTime.setMinutes(0);
      }

      const formattedNearestTime =
        String(nearestTime.getHours()).padStart(2, "0") +
        ":" +
        String(nearestTime.getMinutes()).padStart(2, "0");

      // Generar todos los slots
      const allSlots = [];
      for (let hour = 0; hour < 24; hour++) {
        for (let minute = 0; minute < 60; minute += 5) {
          const formattedHour = String(hour).padStart(2, "0");
          const formattedMinute = String(minute).padStart(2, "0");
          allSlots.push(`${formattedHour}:${formattedMinute}`);
        }
      }

      // Ordenar los slots comenzando desde el más cercano
      const index = allSlots.indexOf(formattedNearestTime);
      const orderedSlots = [...allSlots.slice(index), ...allSlots.slice(0, index)];

      // Establecer el valor por defecto en editedItem
      this.editedItem.start_time = formattedNearestTime;

      return orderedSlots;
    },
  },
};
</script>

<style scoped>
.avatar-row {
  display: flex;
  flex-wrap: nowrap;
  justify-content: start;
}

.avatar-col {
  margin-right: -10px;
  /* Reduce the space between avatars */
}
.avatar-item.hover-expand:hover {
  transform: scale(1.5);
  box-shadow: 0 0 0 rgba(0, 0, 0, 0.3);
}
.avatar-item {
  margin-right: -5px;
  /* Cambia el color del borde según desees */
  border-radius: 50%;
  transition: transform 0.2s ease, box-shadow 0.2s ease;
  /* Para que siga siendo redondo */
  box-sizing: border-box;
  /* Asegura que el borde no afecte el tamaño del avatar */
  /* Optional: reduce the space even further between avatars */
  /* Optional: reduce the space even further between avatars */
}
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
  width: 50px;
  height: 50px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 10px;
  margin-right: 2px;
  color: white;
  /* Mantenemos solo el efecto cóncavo en el ícono 
  box-shadow: inset;*/
  position: relative;
  overflow: hidden;
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

.date-display {
  font-size: 0.75rem; /* Equivale a text-caption */
  line-height: 1.1;
  font-weight: 500;
  text-align: center;
  word-break: break-word;
  white-space: normal;
}

/* Estilos para la hora */
.time-display {
  font-size: 0.625rem;
  line-height: 1;
  margin-top: 2px;
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

.title-container {
  position: relative;
  display: flex;
  align-items: center;
  gap: 8px; /* Espacio entre título y círculo */
}

.dynamic-circle {
  width: 24px;
  height: 24px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 12px;
  font-weight: bold;
  color: white;
  background-color: #03626c; /* Color por defecto */
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
  flex-shrink: 0; /* Evita que se reduzca el tamaño */
}

.dynamic-circle.primary {
  background-color: #03626c; /* Color primario */
}
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
  max-width: 100%;
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
