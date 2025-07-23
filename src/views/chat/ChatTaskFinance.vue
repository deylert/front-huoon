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
  <v-container>
     <v-row justify="center" class="mx-2">
  <v-col cols="12" class="px-0 mb-6">
    <v-card class="pt-4 mb-8 rounded-lg" elevation="2">
      <!-- Chat Body -->
      <div ref="chatBody" class="chat-body px-4 py-2">
        <div
          v-for="(message, index) in chatMessages"
          :key="index"
          class="d-flex mb-8"
          :class="message.from === 'user' ? 'justify-end' : 'justify-start'"
        >
          <div
            class="d-flex align-end"
            :class="message.from === 'user' ? 'flex-row-reverse' : ''"
          >
            <v-avatar v-if="message.from === 'ai'" size="28" class="mb-2 mr-3">
              <v-img src="@/assets/logo-verde.png" alt="Imagen de perfil" />
            </v-avatar>

            <div
              class="chat-bubble px-8 py-3 rounded-xl"
              :class="
                message.from === 'user'
                  ? 'bg-primary text-white'
                  : 'bg-grey-lighten-2 text-black'
              "
              style="width: 100%; max-width: 100%;"
            >
              <!-- Campo editable con componente -->
              <template v-if="message.isEditable && message.isEditing">
                <div
                  v-if="['start_date', 'end_date'].includes(message.fieldKey)"
                >
                  <v-menu
                    v-model="message.showDatePicker"
                    :close-on-content-click="false"
                    transition="scale-transition"
                    offset-y
                    location="bottom"
                    @update:modelValue="handleMenuClose(message, index)"
                  >
                    <template #activator="{ props }">
                      <v-text-field
                        v-bind="props"
                        :model-value="taskParameters[message.fieldKey]"
                        :label="message.fieldLabel"
                        variant="outlined"
                        density="comfortable"
                        class="full-width mt-2"
                        readonly
                        hide-details
                        @click:appendInner="message.showDatePicker = true"
                      />
                    </template>

                    <DatePicker
                      :dateValue="taskParameters[message.fieldKey]"
                      :fieldType="message.fieldKey"
                      @date-updated="
                        handleDateSelection(message.fieldKey, $event)
                      "
                    />
                  </v-menu>
                </div>
                <!-- Para campos de hora -->
                <div
                  v-else-if="
                    ['start_time', 'end_time'].includes(message.fieldKey)
                  "
                >
                  <v-menu
                    v-model="message.showTimePicker"
                    :close-on-content-click="false"
                    transition="scale-transition"
                    offset-y
                    location="bottom"
                    @update:modelValue="handleMenuClose(message, index)"
                  >
                    <template #activator="{ props }">
                      <v-text-field
                        v-bind="props"
                        :model-value="
                          taskParameters[message.fieldKey] || '00:00'
                        "
                        :label="message.fieldLabel"
                        variant="outlined"
                        density="comfortable"
                        class="full-width mt-2"
                        readonly
                        hide-details
                        @click:appendInner="message.showTimePicker = true"
                      />
                    </template>

                    <TimePicker
                      :timeValue="taskParameters[message.fieldKey]"
                      :fieldType="message.fieldKey"
                      @time-updated="
                        handleTimeSelection(message.fieldKey, $event)
                      "
                    />
                  </v-menu>
                </div>
                <v-textarea
                  v-else-if="['title', 'description'].includes(message.fieldKey)"
                  v-model="message.editValue"
                  :label="message.fieldLabel"
                  variant="outlined"
                  density="comfortable"
                  class="mt-2"
                  style="width: 100%"
                  :ref="(el) => setTextFieldRef(el, index)"
                  autofocus
                  auto-grow
                  rows="1"
                  no-resize
                  @keyup.enter="saveFieldEdit(index)"
                  @blur="saveFieldEdit(index)"
                ></v-textarea>
                
                <!-- Textfield para otros campos -->
                <v-text-field
                  v-else
                  v-model="message.editValue"
                  :label="message.fieldLabel"
                  variant="outlined"
                  density="comfortable"
                  class="mt-2"
                  style="width: 100%"
                  :ref="(el) => setTextFieldRef(el, index)"
                  autofocus
                  @keyup.enter="saveFieldEdit(index)"
                  @blur="saveFieldEdit(index)"
                ></v-text-field>
              </template>

              <!-- Texto normal -->
              <template v-else>
          <div
            v-if="!message.buttons"
            @click="message.isEditable ? startFieldEdit(index) : null"
            :class="{ 'editable-message': message.isEditable }"
            style="white-space: pre-wrap; word-break: break-word"
          >
            {{ message.text }}
            <v-icon v-if="message.isEditable" x-small class="ml-2">
              mdi-pencil
            </v-icon>
          </div>

          <!-- Mensaje con botones de confirmación -->
          <div v-else>
            <div style="white-space: pre-wrap; word-break: break-word; margin-bottom: 12px;">
              {{ message.text }}
            </div>
            <div class="d-flex flex-wrap gap-2">
              <v-btn
    v-for="(button, btnIndex) in message.buttons"
    :key="btnIndex"
    :color="button.color"
    :variant="button.variant"
    @click="button.action"
    class="text-none"
    size="small"
    v-bind="button.props || {}"
  >
    {{ button.text }}
  </v-btn>
            </div>
          </div>
        </template>

              <!-- Componente dinámico -->
              <component
                v-if="message.component && !message.isEditing"
                :is="message.component"
                v-bind="message.props"
                @priority-selected="handlePrioritySelection($event)"
                @recurrence-selected="handleRecurrenceSelection($event)"
                @selection-update="updatePeopleSelection($event)"
                @confirm="handlePeopleConfirmation($event)"
                @confirm-suggested="addSelectedTasks($event)"
                @cancel="handleCancellation()"
                @date-updated="updateDate($event)"
                @time-updated="updateTime($event)"
              />
            </div>
          </div>
        </div>

        <div v-if="isTyping" class="d-flex justify-start align-center mt-2">
          <v-avatar size="28" class="mr-3">
            <v-img src="@/assets/logo-verde.png" alt="Avatar" />
          </v-avatar>
          <span class="typing-indicator">•••</span>
        </div>
      </div>

      <!-- Herramientas -->
      <v-divider />
      <v-card-actions class="pa-3 bg-grey-lighten-5 tools-bar">
        <v-btn
          v-for="tool in tools"
          :key="tool.name"
          @click="tool.action"
          size="small"
          color="primary"
          variant="text"
          prepend-icon="mdi-plus"
          class="text-capitalize"
        >
          {{ tool.name }}
        </v-btn>
      </v-card-actions>

      <!-- Input -->
      <v-card-actions
        class="pa-4 bg-white rounded-b-2xl d-flex align-center"
        style="gap: 12px"
      >
        <!-- Input + texto temporal en un solo bloque -->
        <div style="flex: 1; display: flex; flex-direction: column; overflow: hidden">
          <v-textarea
            v-model="newMessage"
            :placeholder="$t('chat.inputPlaceholder')"
            variant="outlined"
            hide-details
            density="compact"
            rounded
            rows="1"
            no-resize
            @keyup.enter="sendMessage"
            style="overflow-y: auto; max-height: 120px; resize: none"
            class="custom-textarea"
            :disabled="isLoading"
          />
          <div
            v-if="escuchando && textoTemporal"
            style="
              margin-top: 10px;
              font-size: 12px;
              color: gray;
              font-style: italic;
              white-space: pre-wrap;
              word-break: break-word;
              max-height: 60px;
              overflow-y: auto;
            "
          >
            {{ textoTemporal }}
          </div>
        </div>

        <!-- Botón de dictado -->
        <v-btn
          color="primary"
          @click="toggleDictado"
          :disabled="!compatible"
          :loading="cargando"
          :icon="escuchando ? 'mdi-microphone-off' : 'mdi-microphone'"
          :title="
            !compatible ? 'Reconocimiento de voz no compatible con tu navegador' : ''
          "
        ></v-btn>

        <!-- Botón de enviar -->
        <v-btn icon="mdi-send" color="primary" @click="sendMessage" />
      </v-card-actions>
    </v-card>
  </v-col>        
</v-row>

  </v-container>
</template>

<script>
import DatePicker from "@/components/chatTask/DatePicker.vue";
import PeopleSelector from "@/components/chatTask/PeopleSelector.vue";
import PriorityOptions from "@/components/chatTask/PriorityOptions.vue";
import RecurrenceOptions from "@/components/chatTask/RecurrenceOptions.vue";
import TimePicker from "@/components/chatTask/TimePicker.vue";
import SuggestedTasksList from "@/components/suggested/SuggestedTasksList.vue";
import LocalStorageService from "@/LocalStorageService";
import { handleRequest } from "@/utils/api";
import { markRaw } from "vue";

export default {
  emits: {
    'close-dialog': null // o una función de validación
  },
  props: {
    initialMessage: {
      type: String,
      default: "",
    },
    taskData: {
      type: Object,
      default: null,
    },
  },
  components: {
    PriorityOptions,
    PeopleSelector,
    DatePicker,
    TimePicker,
    RecurrenceOptions,
    SuggestedTasksList: markRaw(SuggestedTasksList),
  },
  data() {
    return {
      textoTemporal: "",
      taskDataCollectionMode: false,
      currentTaskIntent: null,
      editingField: null,
      escuchando: false,
      recognition: null,
      cargando: false,
      compatible: true,
      tools: [],
      taskParameters: {
        type: null,
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
        end_date: null,
        end_time: null,
      },
      originalItem: {
        type: null,
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
        end_date: null,
        end_time: null,
      },
      defaultItem: {
        type: null,
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
        end_date: null,
        end_time: null,
      },
      textFieldRefs: [],
      currentParameterIndex: 0,
      waitingForConfirmation: false,
      collectingPeople: false,
      currentRoleSelection: null,
      priorities: [],
      roles: [],
      people: [],
      recurrences: [],
      status: [],
      isTyping: false,
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
      answers: [],
      currentQuestionIndex: 0,
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
     textoEditable() {
      // Muestra texto confirmado + texto dictado en vivo
      return this.newMessage + this.textoTemporal;
    },
    imgedit() {
      return `${this.$axios.defaults.baseURL}images/${this.imageUrl}`;
    },
  },
  async mounted() {
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
        this.newMessage += (this.newMessage.endsWith(" ") ? "" : " ") + final + " ";
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
    let taskData = this.taskData;
  
  // Si es string, parsearlo
  if (typeof taskData === 'string') {
    try {
      taskData = JSON.parse(taskData);
    } catch (error) {
      console.error("Error parsing taskData:", error);
      return;
    }
  }
  
  console.log("Datos recibidos del componente padre (taskData):", taskData);
    this.name = JSON.parse(LocalStorageService.getItem("name"));
    this.user = JSON.parse(LocalStorageService.getItem("user"));
    this.user_id = JSON.parse(LocalStorageService.getItem("user_id"));
    this.home_id = JSON.parse(LocalStorageService.getItem("home_id"));
    this.imageUrl = LocalStorageService.getItem("image").replace(/['"]+/g, "");
    if (this.taskData) {
      try {
        await this.loadRequiredData();
        // Copiar los datos de la tarea
          this.taskParameters = {
                          ...this.taskParameters,
                          ...taskData,
                        };
          this.taskDataCollectionMode = true;
          this.currentTaskIntent = taskData.type || "Tarea";
        // Mostrar en el chat
        this.chatMessages.push({
          from: "ai",
          text: `Datos de la  ${this.currentTaskIntent} recibidos. Puedes editarlos antes de confirmar.`,
          timestamp: new Date().toLocaleTimeString(),
        });

        // Iniciar flujo de edición
        
  
      await this.showInitialTaskData(taskData);
      } catch (error) {
        this.showAlert("error", "Error al cargar datos: " + error.message);
      }
    } else if (this.initialMessage) {
      // Si no hay taskData, pero hay initialMessage, simular envío
      this.newMessage = this.initialMessage;
      this.sendMessage();
    }
  },
  methods: {
     toggleDictado() {
      if (!this.recognition) return;

      if (this.escuchando) {
        this.recognition.stop();
      } else {
        this.cargando = true;
        this.recognition.start();
      }
    },
    formatDateDisplay(dateString) {
      if (!dateString) return "Seleccionar fecha";
      const options = { year: "numeric", month: "2-digit", day: "2-digit" };
      return new Date(dateString).toLocaleDateString("es-ES", options);
    },

    handleMenuClose(message, index) {
      if (
        (message.showDatePicker === false || message.showTimePicker === false) &&
        !this.chatMessages[index].isSaving
      ) {
        // Cuando el menú se cierra (click fuera)
        this.saveFieldEdit(index);
      }
    },
    setTextFieldRef(el, index) {
      this.textFieldRefs[index] = el;
    },
    startFieldEdit(index) {
      this.chatMessages[index].isEditing = true;
      this.chatMessages[index].editValue = this.chatMessages[index].currentValue;

      if (["start_date", "end_date"].includes(this.chatMessages[index].fieldKey)) {
        this.$nextTick(() => {
          this.chatMessages[index].showDatePicker = true;
        });
      } else if (["start_time", "end_time"].includes(this.chatMessages[index].fieldKey)) {
        this.$nextTick(() => {
          this.chatMessages[index].showTimePicker = true;
        });
      } else {
        this.$nextTick(() => {
          const textField = this.textFieldRefs[index];
          if (textField) {
            textField.focus();
          }
        });
      }
    },
    saveFieldEdit(index) {
      const message = this.chatMessages[index];
      try {
        const validatedValue = this.validateField(message.fieldKey, message.editValue);
        this.taskParameters[message.fieldKey] = validatedValue;
        message.currentValue = validatedValue;
        message.text = `• ${message.fieldLabel}: ${validatedValue}`;
        message.isEditing = false;
        this.scrollToBottom();
      } catch (error) {
        this.showAlert("error", error.message, 2000);
        message.editValue = message.currentValue;
        message.isEditing = false;
      }
    },
    async sendMessage() {
      if (this.newMessage.trim()) {
        this.isLoading = true;
        const tempMessage = this.newMessage;
        this.newMessage = "";
        this.chatMessages.push({
          from: "user",
          text: tempMessage,
          timestamp: new Date().toLocaleTimeString(),
        });
        this.isTyping = true;

        try {
          const lastAIMessage = this.chatMessages
            .slice()
            .reverse()
            .find((m) => m.from === "ai" && m.isFieldPrompt);
          if (lastAIMessage) {
            try {
              const validatedValue = this.validateField(
                lastAIMessage.fieldName,
                tempMessage
              );
              this.taskParameters[lastAIMessage.fieldName] = validatedValue;
              this.chatMessages.push({
                from: "ai",
                text: `✅ ${
                  lastAIMessage.fieldLabel || lastAIMessage.fieldName
                } guardado: ${validatedValue}`,
                timestamp: new Date().toLocaleTimeString(),
              });
              this.startAutomaticDataCollection();
              return;
            } catch (error) {
              this.chatMessages.push({
                from: "ai",
                text: `❌ Error: ${error.message}. Por favor ingresa un valor válido.`,
                timestamp: new Date().toLocaleTimeString(),
                isFieldPrompt: true,
                fieldName: lastAIMessage.fieldName,
                fieldLabel: lastAIMessage.fieldLabel,
              });
              return;
            }
          }

          if (this.waitingForConfirmation) {
            await this.handleTaskConfirmation(tempMessage);
            return;
          }

          if (this.collectingPeople) {
            await this.processPeopleSelection(tempMessage);
            return;
          }

          if (!this.taskDataCollectionMode) {
            const response = await handleRequest({
              endpoint: "ask-ai-task",
              method: "POST",
              data: {
                question: tempMessage,
                issue: "Eres un asistente para gestión de tareas y metas.",
              },
            });
            if (response.data.intentDetected) {
              this.data = { home_id: this.home_id };
              if (response.data.task) {
                this.taskParameters = {
                  ...this.taskParameters,
                  ...response.data.task,
                };
              }
              await this.loadRequiredData();
              this.currentTaskIntent = response.data.intent;
              this.taskDataCollectionMode = true;
              await this.showInitialTaskData(response.data.task);
            } else {
              this.chatMessages.push({
                from: "ai",
                text: response.data.answer,
                timestamp: new Date().toLocaleTimeString(),
              });
            }
            return;
          }
        } catch (error) {
          this.showAlert("error", error.message || "Ocurrió un error", 2000);
        } finally {
          this.isTyping = false;
          this.isLoading = false;
          this.scrollToBottom();
        }
      }
    },
    async loadRequiredData() {
      try {
        this.isLoading = true;
        const result = await handleRequest({
          endpoint: "category-status-priority-apk",
          method: "POST",
          data: { home_id: this.home_id },
        });
        if (!result.success) throw new Error(result.message || "Error al cargar datos");

        this.priorities = result.data?.taskpriorities || [];
        this.recurrences = result.data?.taskrecurrences || [];
        this.roles = result.data?.taskroles || [];
        this.people = (result.data?.taskpeople || []).map((person) => ({
          ...person,
          namePerson: this.fixEncoding(person.namePerson || ""),
          imagePerson: person.imagePerson ? this.fixImagePath(person.imagePerson) : null,
        }));
        if (this.priorities.length === 0) {
          throw new Error("No se encontraron prioridades configuradas");
        }
      } catch (error) {
        console.error("Error loading required data:", error);
        throw error;
      } finally {
        this.isLoading = false;
      }
    },
    async showInitialTaskData(taskData) {
      if (!taskData) return;
      await this.showTaskSummary(taskData);
      await this.startAutomaticDataCollection();
    },
    async showTaskSummary(taskData) {
      const fieldsToShow = [
        { key: "title", label: "Título" },
        { key: "description", label: "Descripción" },
        { key: "start_date", label: "Fecha de inicio" },
        { key: "start_time", label: "Hora de inicio" },
        { key: "end_date", label: "Fecha de finalización" },
        { key: "end_time", label: "Hora de finalización" },
        { key: "estimated_time", label: "Duración estimada (minutos)" },
      ];

      // Mostrar campos normales como texto
      fieldsToShow.forEach((field) => {
        const value = taskData[field.key];
        if (value) {
          this.chatMessages.push({
            from: "ai",
            text: `${field.label}: ${value}`,
            timestamp: new Date().toLocaleTimeString(),
            isEditable: true,
            fieldKey: field.key,
            fieldLabel: field.label,
            currentValue: value,
            editValue: value,
            isEditing: false,
            showDatePicker: false,
          });
        }
      });

      // Mostrar prioridad como componente especial
      if (taskData.priority_id) {
        this.chatMessages.push({
          from: "ai",
          text: "Prioridad actual:",
          component: "PriorityOptions",
          props: {
            options: this.priorities,
            selectedId: taskData.priority_id,
          },
          timestamp: new Date().toLocaleTimeString(),
        });
      }
    },
    async startAutomaticDataCollection() {
      const parametersOrder = [
        "title",
        "description",
        "priority_id",
        "recurrence", // Ahora se pedirá la recurrencia
        "people",
        "start_date",
        "start_time",
        "estimated_time",
        ...(this.taskParameters.type === "Meta" ? ["end_date", "end_time"] : []),
      ];

      const nextField = parametersOrder.find((field) => {
        const value = this.taskParameters[field];

        if (field === "people") {
          // Considerar como vacío si el array está vacío
          return !Array.isArray(value) || value.length === 0;
        }

        return !value && value !== 0;
      });
      console.log("nextField");
      console.log(nextField);
      if (nextField === "priority_id") {
        await this.showPriorityOptions();
      } else if (nextField === "people") {
        await this.showPeopleSelector();
      } else if (nextField === "recurrence") {
        await this.showRecurrenceOptions();
      } else if (nextField) {
        this.showFieldInput(nextField);
      } else {
        this.completeTaskCreation();
      }
    },
    async showFieldInput(field) {
      const fieldLabels = {
        title: "el título",
        description: "la descripción",
        start_date: "la fecha de inicio (YYYY-MM-DD)",
        start_time: "la hora de inicio (HH:MM)",
        estimated_time: "el tiempo estimado en minutos",
        priority_id: "la prioridad",
        people: "las personas asignadas",
        recurrence: "la recurrencia",
      };

      this.chatMessages.push({
        from: "ai",
        text: `Por favor, ingresa ${fieldLabels[field] || field}:`,
        timestamp: new Date().toLocaleTimeString(),
        isFieldPrompt: true,
        fieldName: field,
        fieldLabel: fieldLabels[field] || field,
      });
      if (field === "priority_id") {
        await this.showPriorityOptions();
      } else if (field === "recurrence") {
        await this.showRecurrenceOptions();
      } else if (field === "people") {
        await this.showPeopleSelector();
      } else if (field === "start_date" || field === "end_date") {
        this.showDatePicker(field);
      } else if (field === "start_time" || field === "end_time") {
        this.showTimePicker(field);
      }
    },
    validateField(field, value) {
      switch (field) {
        case "start_date":
          if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) {
            throw new Error("Formato de fecha inválido (YYYY-MM-DD)");
          }
          return value;
        case "start_time":
          if (!/^\d{2}:\d{2}$/.test(value)) {
            throw new Error("Formato de hora inválido (HH:MM)");
          }
          return value;
        case "estimated_time":
          const num = parseFloat(value);
          if (isNaN(num) || num <= 0) {
            throw new Error("Debe ser un número positivo");
          }
          return num;
        case "priority_id":
          const priority = this.priorities.find(
            (p) => p.namePriority.toLowerCase() === value.toLowerCase() || p.id == value
          );
          if (!priority) {
            throw new Error("Prioridad no válida");
          }
          return priority.id;
        default:
          return value;
      }
    },
    fixEncoding(str) {
      try {
        return decodeURIComponent(escape(str));
      } catch {
        return str;
      }
    },
    fixImagePath(path) {
      return path.replace(/[^a-zA-Z0-9\/._-]/g, "");
    },
    scrollToBottom() {
      this.$nextTick(() => {
        const container = this.$refs.chatContainer;
        if (container) container.scrollTop = container.scrollHeight;
      });
    },
    async showPriorityOptions() {
      this.isTyping = true;
      setTimeout(() => {
        this.chatMessages.push({
          from: "ai",
          text: "Selecciona la prioridad para esta tarea:",
          component: "PriorityOptions",
          props: {
            options: this.priorities,
            selectedId: this.taskParameters.priority_id,
          },
          timestamp: new Date().toLocaleTimeString(),
        });
        this.isTyping = false;
        this.scrollToBottom();
      }, 100);
    },
    handlePrioritySelection(priority) {
      this.taskParameters.priority_id = priority.id;

      // Actualizar el mensaje de prioridad existente o crear uno nuevo
      const priorityMessageIndex = this.chatMessages.findIndex(
        (m) => m.from === "ai" && m.component === "PriorityOptions"
      );

      if (priorityMessageIndex !== -1) {
        this.chatMessages[priorityMessageIndex].props.selectedId = priority.id;
      }

      //this.startAutomaticDataCollection();
    },
    showAlert(type, message, timeout) {
      this.sb_type = type;
      this.sb_message = message;
      this.sb_timeout = timeout;
      this.sb_icon = type === "success" ? "mdi-check-circle" : "mdi-alert-circle";
      this.snackbar = true;
    },
    async showRecurrenceOptions() {
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
      }, 100);
    },
    handleRecurrenceSelection(recurrence) {
      this.taskParameters.recurrence = recurrence.id === "none" ? null : recurrence.id;

      // Actualizar el mensaje de recurrencia existente
      const recurrenceMessageIndex = this.chatMessages.findIndex(
        (m) => m.from === "ai" && m.component === "RecurrenceOptions"
      );
      if (recurrenceMessageIndex !== -1) {
        this.chatMessages[recurrenceMessageIndex].props.selectedId = recurrence.id;
      }

      // Llamar a showPeopleSelector después de seleccionar recurrencia
      this.startAutomaticDataCollection();
    },
    //personas
    confirmPeopleSelection(selections) {
      this.taskParameters.people = selections;

      // Mostrar resumen de personas seleccionadas
      const peopleText =
        selections.length > 0
          ? selections.map((p) => `${p.name} (${p.roleName})`).join(", ")
          : "Ninguna persona seleccionada";

      this.startAutomaticDataCollection();
    },
    updatePeopleSelection(selections) {
      if (Array.isArray(selections)) {
        this.taskParameters.people = selections;
      } else {
        console.error("Selección inválida", selections);
      }
    },
    cancelSelection() {
      // Limpiar selección de personas
      this.taskParameters.people = [];
      this.taskParameters = Object.assign({}, this.defaultItem);
      this.originalItem = Object.assign({}, this.defaultItem);
      this.chatMessages.push({
        from: "ai",
        text: "Creación cancelada. ¿En qué más puedo ayudarte?",
        timestamp: new Date().toLocaleTimeString(),
      });
    },
    async showPeopleSelector() {
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
      }, 100);
    },
    handlePeopleConfirmation(selections) {
      this.taskParameters.people = selections;

      /*// Mostrar confirmación
  this.chatMessages.push({
    from: "ai",
    text: `✅ ${selections.length} persona(s) seleccionada(s)`,
    timestamp: new Date().toLocaleTimeString(),
  });

  // Si es "Meta", mostrar sugerencias
  if (this.taskParameters.type === "Meta") {
    this.showSuggestedTasks(); // Asegúrate de que esta función exista y funcione correctamente
  } else {*/
      this.completeTaskCreation(); // Si no es Meta, terminar el flujo
      //}
    },

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
    text: `¿Deseas crear esta ${this.currentTaskIntent} con los datos proporcionados?`,
    timestamp: new Date().toLocaleTimeString(),
    buttons: [
     {
    text: "Cancelar",
    color: "error",
    variant: "outlined",  // Corregido: usar dos puntos en lugar de signo igual
    action: () => this.handleCancellation('no'),
    props: {              // Propiedades adicionales para v-btn
      class: "mr-2",      // Margen derecho
      size: "default"     // Tamaño estándar
    }
  },
  {
    text: "Confirmar y crear",
    color: "primary",
    variant: "flat",      // Equivalente al estilo por defecto de v-btn
    action: () => this.handleTaskConfirmation('si'),
    props: {
      disabled: this.taskParameters.title === null, // Ejemplo de condición
      size: "default"     // Tamaño estándar
    }
  }
    ]
  });

      this.waitingForConfirmation = true;
      this.isTyping = false;
      this.scrollToBottom();
    },

    // Maneja la confirmación del usuario
    async handleTaskConfirmation(userResponse) {
      this.waitingForConfirmation = false;

      if (userResponse.toLowerCase() === "si" || userResponse.toLowerCase() === "sí") {
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
          ...(this.taskParameters.type === "Meta" ? ["end_date", "end_time"] : []),
        ];
        let updatedFields = Object.keys(this.taskParameters)
          .filter((key) => {
            return (
              fieldsToUpdate.includes(key) &&
              this.taskParameters[key] !== this.originalItem[key] &&
              this.taskParameters[key] !== null &&
              this.taskParameters[key] !== undefined &&
              this.taskParameters[key] !== ""
            );
          })
          .reduce((obj, key) => {
            if (key === "people") {
              // Transformar el campo `people`
              obj[key] = this.taskParameters.people.map((person) => ({
                home_id: Number(this.home_id), // Asegurar que sea un número
                person_id: Number(person.id), // Asegurar que sea un número
                role_id: Number(person.roleId),
                roleName: person.roleName,
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
          updatedFields.type = this.taskParameters.type
            ? this.taskParameters.type
            : "Tarea";

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
                from: "ai",
                text: `✅ ${this.currentTaskIntent} creada exitosamente!`,
                timestamp: new Date().toLocaleTimeString(),
              });
              //aqui comienza los cambios de mostrar las sugerencias
              if (result.data?.suggestedTasks?.length > 0) {
                this.showSuggestedTasks(result.data.suggestedTasks);
              }
            }
          } catch (error) {
            this.chatMessages.push({
              from: "ai",
              text: `❌ Error al crear la ${this.currentTaskIntent}: ${error.message}`,
              timestamp: new Date().toLocaleTimeString(),
            });
          } finally {
            this.isTyping = false;
          }
        } else {
          this.chatMessages.push({
            from: "ai",
            text: "No se realizaron cambios en la tarea/meta.",
            timestamp: new Date().toLocaleTimeString(),
          });
        }
      } else {
        this.handleCancellation();
      }

      // Resetear
      this.taskDataCollectionMode = false;
      this.currentTaskIntent = null;
      this.taskParameters = {};
      this.scrollToBottom();
    },
    handleCancellation() {
  this.waitingForConfirmation = false;
  this.taskParameters.people = [];
      this.taskParameters = Object.assign({}, this.defaultItem);
      this.originalItem = Object.assign({}, this.defaultItem);
  // Mensaje con botones de opción
  this.chatMessages.push({
    from: "ai",
    text: "¿Qué deseas hacer ahora?",
    timestamp: new Date().toLocaleTimeString(),
    buttons: [
      {
        text: "Salir",
        color: "grey",
        variant: "outlined",  // Botón con borde
        action: () => this.closeDialog(),
        props: {
          class: "mr-2",
          size: "default",
        }
      },
      {
    text: "Nueva conversación",
    color: "primary",
    variant: "flat",  // Botón sólido
    action: () => this.startNewConversation(),
    props: {
      size: "default",
    }
  }
    ]
  });
},

// Método para nueva conversación
startNewConversation() {
  // Limpiar el chat pero mantenerlo abierto
  this.chatMessages = [];
  this.isTyping = false;
  
  // Mensaje inicial del asistente
  this.chatMessages.push({
    from: "ai",
    text: "¡Hola! ¿En qué puedo ayudarte hoy?",
    timestamp: new Date().toLocaleTimeString()
  });
},

// Método para cerrar el diálogo
closeDialog() {
  
  // Opcional: limpiar la conversación
  this.chatMessages = [];
  // Emitir evento para cerrar el diálogo (ajusta según tu implementación)
  this.$emit('close-dialog');

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
          from: "ai",
          component: "SuggestedTasksList",
          props: {
            suggestedTasks: tasks,
            priorities: this.priorities,
            baseUrl: this.$axios.defaults.baseURL,
            allPeople: this.people, // Pasar la lista completa de personas
            allRoles: this.roles, // Pasar la lista completa de roles
          },
          timestamp: new Date().toLocaleTimeString(),
        });

        this.isTyping = false;
        this.scrollToBottom();
      }, 500);
    },
    async addSelectedTasks(selectedTasks) {
      this.isTyping = true;

      try {
        // Preparar datos para enviar al API
        const tasksToCreate = selectedTasks.map((task) => {
          const { selected, ...cleanTask } = task;
          return {
            ...cleanTask,
            home_id: Number(this.home_id),
            people: task.people.map((person) => ({
              home_id: Number(this.home_id),
              person_id: Number(person.person_id),
              role_id: Number(person.role_id),
            })),
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
            from: "ai",
            text: `✅ ${tasksToCreate.length} tarea(s) creada(s) exitosamente!`,
            timestamp: new Date().toLocaleTimeString(),
          });
          this.handleCancellation();
        } else {
          this.chatMessages.push({
            from: "ai",
            text: `⚠️ Se creó la meta pero hubo un error con las tareas: ${result.message}`,
            timestamp: new Date().toLocaleTimeString(),
          });
          this.handleCancellation();
        }
      } catch (error) {
        this.chatMessages.push({
          from: "ai",
          text: `❌ Error al crear tareas: ${error.message}`,
          timestamp: new Date().toLocaleTimeString(),
        });
        this.handleCancellation();
      } finally {
        this.handleCancellation();
        this.isTyping = false;
        this.scrollToBottom();
      }
    },
    //date y time
    handleDateSelection(field, dateEvent) {
      const { value } = dateEvent;

      // Actualizar el valor en taskParameters
      this.taskParameters[field] = value;

      // Encontrar el mensaje correspondiente
      const message = this.chatMessages.find((m) => m.fieldKey === field);

      if (message) {
        message.currentValue = value;
        message.editValue = value;
        message.text = `• ${message.fieldLabel}: ${value}`;
        message.isEditing = false;
      }

      // Continuar con el flujo automático
      //this.startAutomaticDataCollection();
    },
    handleTimeSelection(field, timeEvent) {
      const { value } = timeEvent;

      // Actualizar el valor en taskParameters
      this.taskParameters[field] = value;

      // Encontrar el mensaje correspondiente
      const message = this.chatMessages.find((m) => m.fieldKey === field);

      if (message) {
        message.currentValue = value;
        message.editValue = value;
        message.text = `• ${message.fieldLabel}: ${value}`;
        message.isEditing = false;
        message.showTimePicker = false;
      }

      // Continuar con el flujo automático
      //this.startAutomaticDataCollection();
    },
  },
};
</script>

<style scoped>
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

.v-slide-group__content {
  padding: 4px 0;
}
.avatar-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: 50%;
}

.message-item {
  margin-bottom: 5px;
}

.user-message-container {
  flex-direction: row-reverse;
}

.message-text {
  max-width: 100%;
}

.user-message {
  background-color: #888;
  border-radius: 12px;
  padding: 1px;
   min-width: 100% !important;
}

.ai-message {
  background-color: #888;
  border-radius: 12px;
  padding: 1px;
  min-width: 100% !important;
}

.v-card-text {
  line-height: 1.5;
}
.typing-dots {
  font-size: 1.5rem;
  animation: blink 1.5s infinite;
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
.v-btn--action-cancel {
  min-width: 160px;
  margin: 4px;
}

/* Efecto hover para los botones */
.v-btn--action-cancel:hover {
  transform: translateY(-1px);
  box-shadow: 0 4px 8px rgba(0,0,0,0.1);
  transition: all 0.2s ease;
}
</style>
