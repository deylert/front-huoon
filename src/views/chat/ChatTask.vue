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
    <v-card class="pa-4" elevation="4" rounded="lg">
      <!-- Vista de Chat -->
      <v-row justify="center" class="mx-2">
        <v-col cols="12" md="12">
          <v-card-title class="d-flex justify-space-between" color="#03626C" dark>
            <span class="font-weight-bold text-body-2">Chat en vivo</span>
          </v-card-title>
          <v-card-text>
            <v-container ref="chatContainer" style="overflow-y: auto; min-height: 60vh; max-height: 60vh;">
              <v-list>
                <!-- Iterar sobre los mensajes -->
                <v-list-item
                  v-for="(message, index) in chatMessages"
                  :key="index"
                  class="message-item"
                  :class="{ 'user-message-container': message.from === 'user' }"
                >
                  <v-row align="center">
                    <!-- Avatar de IA -->
                    <v-col
                      v-if="message.from === 'ai'"
                      class="d-flex justify-start"
                      cols="auto"
                    >
                      <v-avatar color="#03626C">
                        <img
                          src="@/assets/logo-blanco.png"
                          alt="Imagen de avatar"
                          class="avatar-image"
                        />
                      </v-avatar>
                    </v-col>

                    <!-- Mensaje (parte modificada) -->
                    <v-col
                      class="message-text"
                      :class="{ 'text-right': message.from === 'user' }"
                    >
                      <v-card
                        :class="message.from === 'ai' ? 'ai-message' : 'user-message'"
                        elevation="1"
                        style="display: inline-block; max-width: 100%"
                      >
                        <v-card-text>
                          <div
                            v-if="message.text"
                            style="white-space: pre-wrap; word-wrap: break-word"
                          >
                            {{ message.text }}
                          </div>
                          <component
                            v-if="message.component"
                            :is="message.component"
                            v-bind="message.props"
                            @priority-selected="
                              handleComponentEvent(
                                message.component,
                                'priority-selected',
                                $event
                              )
                            "
                            @recurrence-selected="
                              handleComponentEvent(
                                message.component,
                                'recurrence-selected',
                                $event
                              )
                            "
                            @selection-update="
                              handleComponentEvent(
                                message.component,
                                'selection-update',
                                $event
                              )
                            "
                            @confirm="
                              handleComponentEvent(message.component, 'confirm', $event)
                            "
                            @cancel="handleComponentEvent(message.component, 'cancel')"
                            @date-updated="
                              handleComponentEvent(
                                message.component,
                                'date-updated',
                                $event
                              )
                            "
                            @time-updated="
                              handleComponentEvent(
                                message.component,
                                'time-updated',
                                $event
                              )
                            "
                          />
                        </v-card-text>
                      </v-card>
                      <v-list-item-subtitle class="text-caption">
                        {{ message.timestamp }}
                      </v-list-item-subtitle>
                    </v-col>

                    <!-- Avatar de Usuario -->
                    <v-col
                      v-if="message.from === 'user'"
                      class="d-flex justify-end"
                      cols="auto"
                    >
                      <v-avatar color="#DA7171">
                        <template v-if="imagenDisponible()">
                          <img :src="imgedit" alt="User Avatar" class="avatar-image" />
                        </template>
                        <template else>
                          <v-icon>mdi-account</v-icon>
                        </template>
                      </v-avatar>
                    </v-col>
                  </v-row>
                </v-list-item>

                <!-- Mostrar indicador de "escribiendo" cuando isTyping es true -->
                <v-list-item v-if="isTyping" class="message-item">
                  <v-row align="center">
                    <!-- Avatar de la IA -->
                    <v-col class="d-flex justify-start" cols="auto">
                      <v-avatar color="#03626C">
                        <img
                          src="@/assets/logo-blanco.png"
                          alt="Imagen de avatar"
                          class="avatar-image"
                        />
                      </v-avatar>
                    </v-col>

                    <!-- Tres puntos sin fondo de card -->
                    <v-col class="message-text">
                      <div
                        class="typing-container"
                        style="display: inline-block; border-radius: 12px"
                      >
                        <span class="typing-dots">•••</span>
                      </div>
                    </v-col>
                  </v-row>
                </v-list-item>
              </v-list>
            </v-container>
          </v-card-text>

          <!-- Campo de texto para escribir mensajes -->
          <v-divider></v-divider>
          <v-card-actions>
            <v-text-field
              v-model="newMessage"
              label="Escribe tu mensaje"
              append-icon="mdi-send"
              @keyup.enter="sendMessage"
              dense
              variant="underlined"
              full-width
              @click:append="sendMessage"
              :disabled="isLoading"
            ></v-text-field>
          </v-card-actions>
        </v-col>
      </v-row>
    </v-card>
  </v-container>
</template>

<script>
import DatePicker from "@/components/chatTask/DatePicker.vue";
import PeopleSelector from "@/components/chatTask/PeopleSelector.vue";
import PriorityConfirmation from "@/components/chatTask/PriorityConfirmation.vue";
import PriorityOptions from "@/components/chatTask/PriorityOptions.vue";
import RecurrenceConfirmation from "@/components/chatTask/RecurrenceConfirmation.vue";
import RecurrenceOptions from "@/components/chatTask/RecurrenceOptions.vue";
import TimePicker from "@/components/chatTask/TimePicker.vue";
import SuggestedTasksList from "@/components/suggested/SuggestedTasksList.vue";
import LocalStorageService from "@/LocalStorageService";
import { handleRequest } from "@/utils/api"; // Ruta al archivo
import { markRaw } from 'vue'

export default {
  emits: ["close"],
  props: {
    initialMessage: {
      type: String,
      default: "",
    },
  },
  components: {
    PriorityOptions,
    PriorityConfirmation,
    PeopleSelector,
    DatePicker,
    TimePicker,
    RecurrenceOptions,
    RecurrenceConfirmation,
    SuggestedTasksList: markRaw(SuggestedTasksList) 
  },
  data() {
    return {
      taskDataCollectionMode: false,
      currentTaskIntent: null,
      taskParameters: {
        type: null, // 'Tarea' o 'Meta'
        title: null,
        description: null,
        priority_id: null,
        people: [], // {id, roleId}[]
        start_date: null,
        start_time: null,
        estimated_time: null,
        geo_location: null,
        recurrence: null,
        status_id: null,
        // Para metas
        end_date: null,
        end_time: null,
      },
      originalItem: {
        type: null, // 'Tarea' o 'Meta'
        title: null,
        description: null,
        priority_id: null,
        people: [], // {id, roleId}[]
        start_date: null,
        start_time: null,
        estimated_time: null,
        geo_location: null,
        recurrence: null,
        status_id: null,
        // Para metas
        end_date: null,
        end_time: null,
      },
      currentParameterIndex: 0,
      waitingForConfirmation: false,
      collectingPeople: false,
      currentRoleSelection: null,
      priorities: [], // Debes cargar esto desde tu API
      roles: [], // Debes cargar esto desde tu API
      people: [], // Debes cargar esto desde tu API
      recurrences: [], // Debes cargar esto desde tu API
      status: [], // Debes cargar esto desde tu API
      isTyping: false, // Indica si la IA está escribiendo
      imageUrl: "",
      data: {},
      isLoading: false,
      chatMessages: [],
      newMessage: "",
      snackbar: false,
      sb_type: "success",
      sb_message: "",
      sb_timeout: 3000,
      sb_title: "",
      sb_icon: "mdi-check-circle",
      answers: [], // Aquí se almacenarán las respuestas a las preguntas iniciales
      currentQuestionIndex: 0, // Índice para saber qué pregunta hacer
      questions: [
        "Hola, ¿cómo te encuentras hoy? ¿Te gustaría hablar sobre viajes? ¿A dónde deseas viajar?",
        "¿En qué fecha planeas viajar?",
        "¿Cuál es el motivo de tu viaje? (Por ejemplo: vacaciones, negocios, visitas familiares, etc.)",
        "¿Tienes algún interés o preferencia específica? (Por ejemplo: playa, naturaleza, cultura, gastronomía, etc.)",
      ],
      home_id: "",
    };
  },
  computed: {
    imgedit() {
      return `${this.$axios.defaults.baseURL}images/${this.imageUrl}`;
    },
  },
  mounted() {
    this.name = JSON.parse(LocalStorageService.getItem("name"));
    this.user = JSON.parse(LocalStorageService.getItem("user"));
    this.user_id = JSON.parse(LocalStorageService.getItem("user_id"));
    this.home_id = JSON.parse(LocalStorageService.getItem("home_id"));
    //this.role = JSON.parse(LocalStorageService.getItem('role'));
    this.imageUrl = LocalStorageService.getItem("image").replace(/['"]+/g, "");
    // Enviar la primera pregunta al montar el componente

    // Si hay mensaje inicial, procesarlo
    if (this.initialMessage) {
      this.newMessage = this.initialMessage;
      this.sendMessage();
    } else {
      // Si no hay mensaje inicial, comenzar con las preguntas
      //this.askQuestion();
    }
  },
  methods: {
    async askQuestion() {
      // Enviar la pregunta actual de la lista
      if (this.currentQuestionIndex < this.questions.length) {
        this.chatMessages.push({
          from: "ai",
          text: this.questions[this.currentQuestionIndex],
          timestamp: new Date().toLocaleTimeString(),
        });
        this.isLoading = false;
      }
    },
    showAlert(type, message, timeout) {
      this.sb_type = type;
      this.sb_message = message;
      this.sb_timeout = timeout;
      this.sb_icon = type === "success" ? "mdi-check-circle" : "mdi-alert-circle";
      this.snackbar = true;
    },
    scrollToBottom() {
      this.$nextTick(() => {
        const container = this.$refs.chatContainer;
        container.scrollTop = container.scrollHeight;
      });
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
    closeDialog() {
      this.$emit("close");
    },
    //Nuevos datos de tareas a pedir
    async sendMessage() {
      if (this.newMessage.trim()) {
        this.isLoading = true;
        const tempMessage = this.newMessage;
        this.newMessage = "";

        // Mostrar mensaje del usuario
        this.chatMessages.push({
          from: "user",
          text: tempMessage,
          timestamp: new Date().toLocaleTimeString(),
        });

        this.isTyping = true;

        try {
          // Si estamos esperando confirmación
          if (this.waitingForConfirmation) {
            await this.handleTaskConfirmation(tempMessage);
            return;
          }

          // Si estamos en modo recolección de personas
          if (this.collectingPeople) {
            await this.processPeopleSelection(tempMessage);
            return;
          }

          // Si estamos en modo recolección de datos para tarea/meta
          if (this.taskDataCollectionMode) {
            await this.processTaskParameter(tempMessage);
            return;
          }

          // Detección normal de intención
          const response = await handleRequest({
            endpoint: "ask-ai-task",
            method: "POST",
            data: {
              question: tempMessage,
              issue:
                "Eres un asistente para gestión de tareas y metas. Analiza si el usuario quiere crear una tarea o meta.",
            },
          });

          // Si se detectó intención
          if (response.data.intentDetected) {
            this.data = {};
            this.data.home_id = this.home_id;
            try {
              const result = await handleRequest({
                endpoint: "category-status-priority-apk",
                method: "POST",
                data: this.data,
              });

              if (result.success) {
                // Asignación de datos
                this.categories = result.data?.taskcategories || [];
                this.status = result.data?.taskstatus || [];
                this.priorities = result.data?.taskpriorities || [];
                this.recurrences = result.data?.taskrecurrences || [];
                this.people =
                  result.data?.taskpeople?.map((person) => ({
                    ...person,
                    namePerson: this.fixEncoding(person.namePerson),
                    imagePerson: person.imagePerson
                      ? this.fixImagePath(person.imagePerson)
                      : null,
                  })) || [];
                this.roles = result.data?.taskroles || [];
                this.typetasks = result.data?.tasktype || [];

                // Inicializar valores por defecto
                //this.setDefaultValues();
              } else {
                // Manejo de caso sin datos
                //this.resetData();
                this.showAlert(
                  "info",
                  result.message || "No hay datos disponibles.",
                  3000
                );
              }
            } catch (error) {
              //this.resetData();
              this.showAlert(
                "error",
                "Ocurrió un error inesperado al cargar los datos.",
                3000
              );
            } finally {
              //this.dialog = true;
              //this.initializeSelections();
              //this.timeSlots = this.generateTimeSlots();
              this.startTaskDataCollection(response.data.intent);
            }
          } else {
            // Chat normal
            this.chatMessages.push({
              from: "ai",
              text: response.data.answer,
              timestamp: new Date().toLocaleTimeString(),
            });
          }
        } catch (error) {
          this.showAlert("error", error, 2000);
        } finally {
          this.isTyping = false;
          this.isLoading = false;
          this.scrollToBottom();
        }
      }
    },
    fixEncoding(str) {
      try {
        // Primero decodificamos como si fuera UTF-8 mal interpretado como Latin1
        return decodeURIComponent(escape(str));
      } catch {
        return str; // Si falla, devolver el original
      }
    },

    // Método para asegurar rutas de imagen válidas
    fixImagePath(path) {
      return path.replace(/[^a-zA-Z0-9\/._-]/g, ""); // Elimina caracteres especiales
    },

    // Inicia el proceso de recolección
    startTaskDataCollection(intentType) {
      this.taskDataCollectionMode = true;
      this.currentTaskIntent = intentType;

      // Inicialización completa de taskParameters
      this.taskParameters = {
        type: intentType.includes("Meta") ? "Meta" : "Tarea",
        title: null,
        description: null,
        priority_id: null,
        people: [],
        start_date: null,
        start_time: null,
        estimated_time: null,
        geo_location: null,
        recurrence: null,
        status_id: null,
        // Campos específicos para metas
        ...(intentType.includes("Meta")
          ? {
              end_date: null,
              end_time: null,
            }
          : {}),
        attachments: [],
      };

      // Reiniciar el índice de parámetros
      this.currentParameterIndex = 0;

      // Iniciar el proceso de recolección
      this.askForNextTaskParameter();
    },

    // Pide el siguiente parámetro
    askForNextTaskParameter() {
      const parametersOrder = [
        "title",
        "description",
        "priority_id",
        "people",
        "start_date",
        "start_time",
        "estimated_time",
        "recurrence",
        ...(this.taskParameters.type === "Meta" ? ["end_date", "end_time"] : []),
      ];

      if (this.currentParameterIndex < parametersOrder.length) {
        const currentParam = parametersOrder[this.currentParameterIndex];

        if (currentParam === "priority_id") {
          this.showPriorityOptions();
          return;
        }

        if (currentParam === "people") {
          this.showPeopleSelector();
          return;
        }

        if (currentParam === "start_date" || currentParam === "end_date") {
          this.showDatePicker(currentParam);
          return;
        }

        if (currentParam === "start_time" || currentParam === "end_time") {
          this.showTimePicker(currentParam);
          return;
        }

        if (currentParam === "recurrence") {
          this.showRecurrenceOptions();
          return;
        }

        // Manejo para otros parámetros
        let question = "";
        switch (currentParam) {
          case "title":
            question = `Por favor, ingresa un título para la ${this.currentTaskIntent}:`;
            break;
          case "description":
            question = `Describe la ${this.currentTaskIntent} con más detalle:`;
            break;
          case "estimated_time":
            question = `¿Cuánto tiempo estimas que tomará (en horas)?`;
            break;
          case "geo_location":
            question = `¿Dónde se realizará? (ubicación)`;
            break;
        }

        this.isTyping = true;
        setTimeout(() => {
          this.chatMessages.push({
            from: "ai",
            text: question,
            timestamp: new Date().toLocaleTimeString(),
          });
          this.isTyping = false;
          this.scrollToBottom();
        }, 500);
      } else {
        this.completeTaskCreation();
      }
    },

    showPriorityOptions() {
      this.isTyping = true;

      setTimeout(() => {
        this.chatMessages.push({
          from: "ai",
          text: "Selecciona la prioridad para esta tarea:",
          component: "PriorityOptions", // Nombre exacto del componente
          props: {
            options: this.priorities,
            selectedId: this.taskParameters.priority_id,
          },
          timestamp: new Date().toLocaleTimeString(),
        });

        this.isTyping = false;
        this.scrollToBottom();
      }, 500);
    },

    // Procesa la respuesta del usuario para un parámetro
    async processTaskParameter(userInput) {
      const parametersOrder = [
        "title",
        "description",
        "priority_id",
        "people",
        "start_date",
        "start_time",
        "estimated_time",
        "geo_location",
        "recurrence",
        ...(this.taskParameters.type === "Meta" ? ["end_date", "end_time"] : []),
      ];

      const currentParam = parametersOrder[this.currentParameterIndex];

      try {
        // Validar y procesar según el parámetro actual
        switch (currentParam) {
          case "title":
            if (!userInput.trim()) throw new Error("El título no puede estar vacío");
            this.taskParameters.title = userInput;
            break;

          case "description":
            this.taskParameters.description = userInput;
            break;

          case "priority_id":
            const priorityIndex = parseInt(userInput) - 1;
            if (
              isNaN(priorityIndex) ||
              priorityIndex < 0 ||
              priorityIndex >= this.priorities.length
            ) {
              throw new Error("Por favor selecciona un número válido");
            }
            this.taskParameters.priority_id = this.priorities[priorityIndex].id;
            break;

          case "start_date":
            if (!/^\d{4}-\d{2}-\d{2}$/.test(userInput))
              throw new Error("Formato de fecha inválido");
            this.taskParameters.start_date = userInput;
            break;

          case "start_time":
            if (!/^\d{2}:\d{2}$/.test(userInput))
              throw new Error("Formato de hora inválido");
            this.taskParameters.start_time = userInput;
            break;

          case "estimated_time":
            const hours = parseFloat(userInput);
            if (isNaN(hours) || hours <= 0)
              throw new Error("Debe ser un número positivo");
            this.taskParameters.estimated_time = hours;
            break;

          case "recurrence":
            const recurrenceIndex = parseInt(userInput) - 1;
            if (
              isNaN(recurrenceIndex) ||
              recurrenceIndex < 0 ||
              recurrenceIndex >= this.recurrences.length
            ) {
              throw new Error("Por favor selecciona un número válido");
            }
            this.taskParameters.recurrence = this.recurrences[recurrenceIndex].id;
            break;

          // ... otros casos
        }

        // Confirmación al usuario
        this.chatMessages.push({
          from: "ai",
          text: `✅ ${
            currentParam === "priority_id" ? "Prioridad" : currentParam
          } guardado correctamente`,
          timestamp: new Date().toLocaleTimeString(),
        });

        this.currentParameterIndex++;
        this.askForNextTaskParameter();
      } catch (error) {
        this.chatMessages.push({
          from: "ai",
          text: `❌ Error: ${error.message}. Por favor inténtalo de nuevo.`,
          timestamp: new Date().toLocaleTimeString(),
        });
        this.scrollToBottom();
      }
    },

    // Completa la creación mostrando resumen
    completeTaskCreation() {
      this.isTyping = true;
      this.taskDataCollectionMode = false;

      // Construir mensaje de resumen
      let summary = `Resumen de la ${this.currentTaskIntent}:\n\n`;

      // Lista de todos los posibles parámetros con sus etiquetas
      const parameterLabels = {
        title: "Título",
        description: "Descripción",
        priority_id: "Prioridad",
        start_date: "Fecha inicio",
        start_time: "Hora inicio",
        estimated_time: "Duración estimada",
        recurrence: "Recurrencia",
        end_date: "Fecha fin",
        end_time: "Hora fin",
        geo_location: "Ubicación",
      };

      // Agregar cada parámetro que tenga valor
      Object.keys(parameterLabels).forEach((key) => {
        const value = this.taskParameters[key];
        if (value !== null && value !== undefined && value !== "") {
          // Manejo especial para algunos campos
          if (key === "priority_id") {
            const priority = this.priorities.find((p) => p.id === value);
            summary += `• ${parameterLabels[key]}: ${
              priority?.namePriority || "No especificada"
            }\n`;
          } else if (key === "recurrence") {
            const recurrence = this.recurrences.find((r) => r.id === value);
            summary += `• ${parameterLabels[key]}: ${
              recurrence?.recurrenceName || "No recurrente"
            }\n`;
          } else if (key === "start_date" || key === "end_date") {
            // Combinar fecha y hora si existen ambos
            const timeKey = key.replace("_date", "_time");
            const timeValue = this.taskParameters[timeKey];
            const fullValue = timeValue ? `${value} ${timeValue}` : value;
            summary += `• ${parameterLabels[key]}: ${fullValue}\n`;
          } else if (!key.endsWith("_time")) {
            // Evitar duplicar hora (ya se maneja con fecha)
            summary += `• ${parameterLabels[key]}: ${value}\n`;
          }
        }
      });

      // Personas asignadas (manejo especial por estructura de datos)
      if (this.taskParameters.people.length > 0) {
        summary += `• Personas asignadas:\n`;
        this.roles.forEach((role) => {
          const peopleInRole = this.taskParameters.people.filter(
            (p) => p.roleId === role.id
          );
          if (peopleInRole.length > 0) {
            summary += `  - ${role.nameRol}: `;
            summary += peopleInRole
              .map((pId) => {
                const person = this.people.find((p) => p.id === pId.id);
                return person?.namePerson;
              })
              .join(", ");
            summary += "\n";
          }
        });
      }

      // Mostrar resumen
      this.chatMessages.push({
        from: "ai",
        text: summary,
        timestamp: new Date().toLocaleTimeString(),
      });

      // Pedir confirmación
      this.chatMessages.push({
        from: "ai",
        text:
          "¿Deseas crear esta " +
          this.currentTaskIntent +
          " con los datos proporcionados? (si/no)",
        timestamp: new Date().toLocaleTimeString(),
      });

      this.waitingForConfirmation = true;
      this.isTyping = false;
      this.scrollToBottom();
    },

    // Maneja la confirmación del usuario
    async handleTaskConfirmation(userResponse) {
    this.waitingForConfirmation = false;
    
    if (userResponse.toLowerCase() === 'si' || userResponse.toLowerCase() === 'sí') {
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
        let updatedFields = Object.keys(this.taskParameters)
          .filter(
            (key) =>
              fieldsToUpdate.includes(key) &&
              this.taskParameters[key] !== this.originalItem[key]
          )
          .reduce((obj, key) => {
            if (key === "people") {
              // Transformar el campo `people`
              obj[key] = this.taskParameters.people.map((person) => ({
                home_id: Number(this.home_id), // Asegurar que sea un número
                person_id: Number(person.id), // Asegurar que sea un número
                role_id: Number(person.roleId),
                roleName: person.roleName
              }));
            } else {
              obj[key] = this.taskParameters[key];
            }
            return obj;
          }, {});

        // Agregar campos adicionales si es necesario
        if (Object.keys(updatedFields).length > 0) {
          updatedFields.home_id = this.home_id;
          updatedFields.start_date = this.taskParameters.start_date
            ? this.taskParameters.start_date
            : `${new Date().getFullYear()}-${String(new Date().getMonth() + 1).padStart(
              2,
              "0"
            )}-${String(new Date().getDate()).padStart(2, "0")}`;
          updatedFields.estimated_time = this.taskParameters.estimated_time
            ? this.taskParameters.estimated_time
            : 0;
          updatedFields.type = this.taskParameters.type ? this.taskParameters.type : "Tarea";

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
              this.chatMessages.push({
          from: 'ai',
          text: `✅ ${this.currentTaskIntent} creada exitosamente!`,
          timestamp: new Date().toLocaleTimeString()
        });
        //aqui comienza los cambios de mostrar las sugerencias
        if (result.data?.suggestedTasks?.length > 0) {
          this.showSuggestedTasks(result.data.suggestedTasks);
        }
            }
          } catch (error) {
            this.chatMessages.push({
          from: 'ai',
          text: `❌ Error al crear la ${this.currentTaskIntent}: ${error.message}`,
          timestamp: new Date().toLocaleTimeString()
        });
          }
          finally {
        this.isTyping = false;
      }
        } else {
          this.chatMessages.push({
            from: 'ai',
            text: 'No se realizaron cambios en la tarea/meta.',
            timestamp: new Date().toLocaleTimeString()
          });
        }
    } else {
      this.chatMessages.push({
        from: 'ai',
        text: 'Creación cancelada. ¿En qué más puedo ayudarte?',
        timestamp: new Date().toLocaleTimeString()
      });
    }
    
    // Resetear
    this.taskDataCollectionMode = false;
    this.currentTaskIntent = null;
    this.taskParameters = {};
    this.scrollToBottom();
  },
  showSuggestedTasks(tasks) {
  this.isTyping = true;
  
  // Preparar las tareas con el campo selected
  /*const preparedTasks = tasks.map(task => ({
    ...task,
    selected: true, // Por defecto seleccionadas
    people: this.enrichPeopleData(task.people || [])
  }));*/

  setTimeout(() => {
    this.chatMessages.push({
      from: 'ai',
      component: 'SuggestedTasksList',
      props: {
        suggestedTasks: tasks,
        priorities: this.priorities,
        baseUrl: this.$axios.defaults.baseURL,
         allPeople: this.people,  // Pasar la lista completa de personas
        allRoles: this.roles     // Pasar la lista completa de roles
      },
      timestamp: new Date().toLocaleTimeString()
    });

    this.isTyping = false;
    this.scrollToBottom();
  }, 500);
},
async addSelectedTasks(selectedTasks) {
  this.isTyping = true;
  
  try {
    // Preparar datos para enviar al API
    const tasksToCreate = selectedTasks.map(task => {
      const { selected, ...cleanTask } = task;
      return {
        ...cleanTask,
        home_id: Number(this.home_id),
        people: task.people.map(person => ({
          home_id: Number(this.home_id),
          person_id: Number(person.person_id),
          role_id: Number(person.role_id)
        }))
      };
    });

    // Enviar al endpoint de creación múltiple
    const result = await handleRequest({
      endpoint: "task-bulk",
      method: "POST",
      data: { tasks: tasksToCreate },
    });

    if (result.success) {
      this.chatMessages.push({
        from: 'ai',
        text: `✅ ${tasksToCreate.length} tarea(s) creada(s) exitosamente!`,
        timestamp: new Date().toLocaleTimeString()
      });
    } else {
      this.chatMessages.push({
        from: 'ai',
        text: `⚠️ Se creó la meta pero hubo un error con las tareas: ${result.message}`,
        timestamp: new Date().toLocaleTimeString()
      });
    }
  } catch (error) {
    this.chatMessages.push({
      from: 'ai',
      text: `❌ Error al crear tareas: ${error.message}`,
      timestamp: new Date().toLocaleTimeString()
    });
  } finally {
    this.isTyping = false;
    this.scrollToBottom();
  }
},

// Método para saltar la selección de tareas
skipTaskSelection() {
  this.chatMessages.push({
    from: 'ai',
    text: 'No se agregaron tareas sugeridas. ¿En qué más puedo ayudarte?',
    timestamp: new Date().toLocaleTimeString()
  });
  this.scrollToBottom();
},

// Método para enriquecer datos de personas
enrichPeopleData(people) {
  return people.map(person => {
    const personData = this.people.find(p => p.id === person.person_id);
    const roleData = this.roles.find(r => r.id === person.role_id);
    
    return {
      ...person,
      namePerson: personData?.namePerson || 'Desconocido',
      imagePerson: personData?.imagePerson || null,
      roleName: roleData?.nameRol || 'Sin rol'
    };
  });
},
    handleComponentEvent(componentType, event, payload) {
      console.log("Event received:", componentType, event, payload);
      switch (componentType) {
        case "PriorityOptions":
          if (event === "priority-selected") {
            // Asegúrate que este nombre coincida con lo que emite PriorityOptions
            this.handlePrioritySelection(payload);
          }
          break;
        case "PeopleSelector":
          if (event === "selection-update") {
            // Actualiza taskParameters.people con las nuevas selecciones
            this.taskParameters.people = payload;
          } else if (event === "confirm") {
            this.handlePeopleConfirmation(payload);
          } else if (event === "cancel") {
            this.cancelPeopleSelection();
          }
          break;
        case "DatePicker":
          if (event === "date-updated") {
            this.handleDateUpdate(payload);
          }
          break;
        case "TimePicker":
          if (event === "time-updated") {
            this.handleTimeUpdate(payload);
          }
          break;
        case "RecurrenceOptions":
          if (event === "recurrence-selected") {
            this.handleRecurrenceSelection(payload);
          }
          break;
        case 'SuggestedTasksList':
      if (event === 'confirm') {
        this.addSelectedTasks(payload);
      } else if (event === 'cancel') {
        this.skipTaskSelection();
      }
      break;
      }
    },
    handlePrioritySelection(priority) {
      this.taskParameters.priority_id = priority.id;

      // Mostrar confirmación en el chat como texto simple
      this.chatMessages.push({
        from: "ai",
        text: `✅ Prioridad "${priority.namePriority}" seleccionada correctamente`,
        timestamp: new Date().toLocaleTimeString(),
      });

      // Continuar con el siguiente parámetro
      this.currentParameterIndex++;
      this.askForNextTaskParameter();
    },

    showPeopleSelector() {
      this.isTyping = true;

      setTimeout(() => {
        this.chatMessages.push({
          from: "ai",
          text: "Selecciona las personas para esta tarea:",
          component: "PeopleSelector",
          props: {
            roles: this.roles,
            people: this.people,
            initialSelections: [...this.taskParameters.people],
            baseUrl: this.$axios.defaults.baseURL,
          },
          timestamp: new Date().toLocaleTimeString(),
        });

        this.isTyping = false;
        this.scrollToBottom();
      }, 500);
    },
    handlePeopleConfirmation(selections) {
      // Asignar las selecciones confirmadas
      this.taskParameters.people = selections;

      this.chatMessages.push({
        from: "ai",
        text: `✅ ${selections.length} persona(s) seleccionada(s)`,
        timestamp: new Date().toLocaleTimeString(),
      });

      this.currentParameterIndex++;
      this.askForNextTaskParameter();
    },

    cancelPeopleSelection() {
      // Limpiar selecciones
      this.taskParameters.people = [];

      this.chatMessages.push({
        from: "ai",
        text: "Selección de personas cancelada",
        timestamp: new Date().toLocaleTimeString(),
      });

      this.currentParameterIndex++;
      this.askForNextTaskParameter();
    },
    showDatePicker(fieldType) {
      this.isTyping = true;

      const messageText =
        fieldType === "start_date"
          ? "Selecciona la fecha de inicio:"
          : "Selecciona la fecha de finalización:";

      setTimeout(() => {
        this.chatMessages.push({
          from: "ai",
          text: messageText,
          component: "DatePicker",
          props: {
            dateValue: this.taskParameters[fieldType],
            fieldType: fieldType,
            minDate: fieldType === "end_date" ? this.taskParameters.start_date : null,
          },
          timestamp: new Date().toLocaleTimeString(),
        });

        this.isTyping = false;
        this.scrollToBottom();
      }, 500);
    },
    handleDateUpdate({ field, value }) {
      // Actualiza el parámetro correspondiente
      this.taskParameters[field] = value;

      // Muestra confirmación en el chat
      const fieldName =
        field === "start_date" ? "fecha de inicio" : "fecha de finalización";
      this.chatMessages.push({
        from: "ai",
        text: `✅ ${fieldName} establecida: ${value}`,
        timestamp: new Date().toLocaleTimeString(),
      });

      // Forzar actualización del componente
      this.$forceUpdate();

      // Continuar con el siguiente paso
      this.currentParameterIndex++;
      this.askForNextTaskParameter();

      console.log("Fecha actualizada:", field, value, this.taskParameters);
    },
    showTimePicker(fieldType) {
      this.isTyping = true;

      const messageText =
        fieldType === "start_time"
          ? "Selecciona la hora de inicio:"
          : "Selecciona la hora de finalización:";

      setTimeout(() => {
        this.chatMessages.push({
          from: "ai",
          text: messageText,
          component: "TimePicker",
          props: {
            timeValue: this.taskParameters[fieldType],
            fieldType: fieldType,
            minTime: fieldType === "end_time" ? this.taskParameters.start_time : null,
          },
          timestamp: new Date().toLocaleTimeString(),
        });

        this.isTyping = false;
        this.scrollToBottom();
      }, 500);
    },
    handleTimeUpdate({ field, value }) {
      this.taskParameters[field] = value;

      const fieldName =
        field === "start_time" ? "hora de inicio" : "hora de finalización";

      this.chatMessages.push({
        from: "ai",
        text: `✅ ${fieldName} establecida: ${value}`,
        timestamp: new Date().toLocaleTimeString(),
      });

      this.currentParameterIndex++;
      this.askForNextTaskParameter();
    },
    showRecurrenceOptions() {
      this.isTyping = true;

      setTimeout(() => {
        this.chatMessages.push({
          from: "ai",
          text: "Selecciona la recurrencia para esta tarea:",
          component: "RecurrenceOptions",
          props: {
            options: this.recurrences,
            selectedId: this.taskParameters.recurrence,
          },
          timestamp: new Date().toLocaleTimeString(),
        });

        this.isTyping = false;
        this.scrollToBottom();
      }, 500);
    },

    handleRecurrenceSelection(recurrence) {
      this.taskParameters.recurrence = recurrence.id;

      // Mostrar confirmación en el chat
      this.chatMessages.push({
        from: "ai",
        text: `✅ Recurrencia "${recurrence.recurrenceName}" seleccionada correctamente`,
        /*component: 'RecurrenceConfirmation',
    props: {
      recurrence: recurrence
    },*/
        timestamp: new Date().toLocaleTimeString(),
      });

      this.currentParameterIndex++;
      this.askForNextTaskParameter();
    },
  },
};
</script>

<style scoped>
/* Agrega esto a tus estilos */
.priority-options-container {
  margin-top: 12px;
  max-width: 100%;
  overflow-x: auto;
}

.priority-confirmation {
  margin-top: 8px;
  padding: 8px;
  background-color: rgba(0, 150, 136, 0.1);
  border-radius: 8px;
}

/* Asegúrate que las tarjetas de prioridad sean visibles */
.v-slide-group__content {
  padding: 4px 0;
}
.avatar-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  /* Ajusta la imagen para que cubra el contorno del avatar */
  border-radius: 50%;
  /* Asegura que la imagen sea circular */
}

.message-item {
  margin-bottom: 5px;
}

.user-message-container {
  flex-direction: row-reverse;
  /* Invertir el orden de avatar y mensaje */
}

.message-text {
  max-width: 100%;
  /* Limitar el ancho máximo de los mensajes */
}

.user-message {
  background-color: #888;
  border-radius: 12px;
  padding: 1px;
}

.ai-message {
  background-color: #888;
  border-radius: 12px;
  padding: 1px;
}

.v-card-text {
  line-height: 1.5;
  /* Mejorar la separación entre líneas */
}
.typing-dots {
  font-size: 1.5rem;
  animation: blink 1.5s infinite;
}

@keyframes blink {
  0%,
  100% {
    opacity: 0.2;
  }
  50% {
    opacity: 1;
  }
}
</style>
