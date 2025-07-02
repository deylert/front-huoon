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
  <v-dialog
    :model-value="internalDialog"
    @update:model-value="(val) => (internalDialog = val)"
    fullscreen
    transition="dialog-bottom-transition"
    class="bg-grey-lighten-4"
  >
    <v-sheet class="fill-height bg-grey-lighten-4 d-flex flex-column" width="100%">
      <v-card class="fill-height bg-grey-lighten-4 d-flex flex-column" elevation="0">
        <!-- Chat Body -->
        <div ref="chatBody" class="chat-body px-4 py-2 flex-grow-1 overflow-y-auto">
          <div
            v-for="(msg, i) in messages"
            :key="i"
            class="d-flex mb-4"
            :class="msg.from === 'user' ? 'justify-end' : 'justify-start'"
          >
            <div
              class="d-flex align-end"
              :class="msg.from === 'user' ? 'flex-row-reverse' : ''"
            >
              <v-avatar v-if="msg.from === 'bot'" size="28" class="mb-2 mr-3">
                <v-img src="@/assets/logo-verde.png" alt="Bot" />
              </v-avatar>

              <div
                class="chat-bubble px-6 py-3 rounded-xl"
                :class="
                  msg.from === 'user'
                    ? 'bg-primary text-white'
                    : 'bg-grey-lighten-2 text-black'
                "
              >
                <!-- Texto normal -->
                <template v-if="msg.text">
                  <pre style="margin: 0; white-space: pre-wrap">{{ msg.text }}</pre>
                </template>

                <!-- Botones de opciones simples -->
                <template v-else-if="msg.type === 'options'">
                  <v-btn
                    v-for="option in msg.options"
                    :key="option.value"
                    class="ma-1"
                    size="small"
                    variant="outlined"
                    color="primary"
                    @click="handleOptionSelection(option.value)"
                  >
                    {{ option.label }}
                  </v-btn>
                </template>

                <template v-else-if="msg.type === 'editable-textarea'">
                  <v-textarea
                    v-model="msg.model"
                    :label="msg.label"
                    variant="underlined"
                    hide-details
                    rows="4"
                    @keyup.enter="handleEditableInput(msg)"
                  />
                </template>

                <template v-else-if="msg.type === 'editable-text'">
                  <v-text-field
                    v-model="msg.model"
                    :label="msg.label"
                    variant="outlined"
                    hide-details
                    class="w-100"
                    density="comfortable"
                    autofocus
                    @keyup.enter="handleEditableInput(msg)"
                  />
                </template>

                <template v-else-if="msg.type === 'priority-options'">
                  <v-slide-group show-arrows class="pa-2">
                    <v-slide-group-item
                      v-for="option in msg.options"
                      :key="option.id"
                      class="me-3"
                    >
                      <v-card
                        class="pa-3 d-flex align-center"
                        elevation="2"
                        rounded="lg"
                        :class="{
                          'bg-primary text-white': option.id === selectedPriorityId,
                          'bg-grey-lighten-3': option.id !== selectedPriorityId,
                        }"
                        style="min-width: 250px; cursor: pointer"
                        @click="handlePrioritySelection(option)"
                      >
                        <v-avatar
                          size="40"
                          class="me-3"
                          :color="`#${option.color}20`"
                          variant="tonal"
                        >
                          <v-icon :color="'#' + option.color">mdi-priority-high</v-icon>
                        </v-avatar>
                        <div>
                          <div class="text-body-1 font-weight-medium">
                            {{ option.name }}
                          </div>
                          <div class="text-caption text-grey-darken-1">
                            {{ option.description }}
                          </div>
                        </div>
                      </v-card>
                    </v-slide-group-item>
                  </v-slide-group>
                </template>

                <template v-else-if="msg.type === 'recurrence-options'">
                  <v-slide-group show-arrows class="pa-2">
                    <v-slide-group-item
                      v-for="option in msg.options"
                      :key="option.name"
                      class="me-3"
                    >
                      <v-card
                        class="pa-3 d-flex align-center"
                        elevation="2"
                        rounded="lg"
                        :class="{
                          'bg-blue-darken-1 text-white':
                            option.name === selectedRecurrence,
                          'bg-grey-lighten-3': option.name !== selectedRecurrence,
                        }"
                        style="min-width: 250px; cursor: pointer"
                        @click="handleRecurrenceSelection(option)"
                      >
                        <v-avatar
                          size="40"
                          class="me-3"
                          color="blue-lighten-4"
                          variant="tonal"
                        >
                          <v-icon color="blue">mdi-calendar-repeat</v-icon>
                        </v-avatar>
                        <div>
                          <div class="text-body-1 font-weight-medium">
                            {{ option.name }}
                          </div>
                          <div class="text-caption text-grey-darken-1">
                            {{ option.description }}
                          </div>
                        </div>
                      </v-card>
                    </v-slide-group-item>
                  </v-slide-group>
                </template>

                <template v-else-if="msg.type === 'date-picker'">
                  <v-card class="pa-2 w-100" elevation="1" style="max-width: 350px">
                    <v-date-picker
                      color="#03626C"
                      locale="es"
                      :model-value="parseDateString(dateInput)"
                      @update:model-value="updateDate"
                      :min="new Date()"
                      show-adjacent-months
                      landscape
                      class="pa-0"
                    />
                  </v-card>
                </template>

                <template v-else-if="msg.type === 'time-picker'">
                  <v-card class="pa-4 w-100" elevation="1" style="max-width: 350px">
                    <v-time-picker
                      v-model="taskData.start_time"
                      format="24hr"
                      color="#03626C"
                      scrollable
                      @update:model-value="processStep(taskData.start_time)"
                    />
                    <v-text-field
                      class="mt-2"
                      v-model="taskData.start_time"
                      label="Hora seleccionada"
                      readonly
                      variant="outlined"
                      density="compact"
                    />
                  </v-card>
                </template>
              </div>
            </div>
          </div>
        </div>

        <!-- Input -->
        <v-card-actions class="pa-4 bg-white rounded-b-2xl">
          <v-text-field
            v-model="input"
            placeholder="Escribe un mensaje..."
            variant="outlined"
            hide-details
            density="compact"
            class="flex-grow-1"
            rounded
            @keyup.enter="handleUserInput"
          />
          <v-btn icon="mdi-send" color="primary" @click="handleUserInput" />
        </v-card-actions>
      </v-card>
    </v-sheet>
  </v-dialog>
</template>

<script>
import LocalStorageService from "@/LocalStorageService";
import { handleRequest } from "@/utils/api"; // Ruta al archivo
import { VTimePicker } from "vuetify/labs/components";
export default {
  name: "ChatTaskDialog",
  props: {
    modelValue: {
      type: Boolean,
      default: false,
    },
    suggestion: {
      type: Object,
      default: () => ({}),
    },
  },
  components: {
    "v-time-picker": VTimePicker,
  },
  data() {
    return {
      selectedPriorityId: null,
      selectedRecurrence: null,
      alreadyInitialized: false,
      snackbar: false,
      sb_type: "",
      sb_message: "",
      sb_timeout: 2000,
      sb_title: "",
      sb_icon: "",
      chatStarted: false,
      timePickerValue: null,
      internalDialog: this.modelValue,
      messages: [],
      categories: [],
      status: [],
      priorities: [],
      people: [],
      tittlePerson: -1,
      selectedItems: {}, // Almacena las selecciones por rol
      persons: [],
      recurrences: [],
      typetasks: [],
      home_id: "",
      roles: [],
      data: {},
      dialogAddPeople: false,
      person_id: "",
      role_id: "",
      task_id: "",
      timeSlots: [], // Inicialmente vacío
      input: "",
      step: 0,
      dateInput: null,
      taskData: {
        type: "",
        title: "",
        description: "",
        date: "",
        start_date: "",
        start_time: "",
        estimated_time: "",
        geo_location: "",
        recurrence: "",
        priority_id: null,
        status_id: null,
        people: [], // Inicialmente vacío, se llenará con las personas seleccionadas
      },
    };
  },
  watch: {
    modelValue(val) {
      this.internalDialog = val;
      console.log("Watcher modelValue, suggestion:", this.suggestion);
      if (val && this.suggestion?.title && !this.chatStarted) {
        this.startChat();
      }
    },
    suggestion: {
      handler(newVal) {
        console.log("Watcher suggestion:", newVal);
        if (this.internalDialog && newVal?.title && !this.chatStarted) {
          this.startChat();
        }
      },
      immediate: true,
      deep: true,
    },
    internalDialog(val) {
      this.$emit("update:modelValue", val);
    },
  },
  mounted() {
    this.home_id = JSON.parse(LocalStorageService.getItem("home_id"));
    this.person_id = JSON.parse(LocalStorageService.getItem("person_id"));
    this.initialize();
    this.timeSlots = this.generateTimeSlots(); // Genera los horarios al montar el componente
  },
  methods: {
    onTimeSelected(value) {
      this.timePickerValue = value.length > 5 ? value.substring(0, 5) : value;
    },

    onTimeConfirmed(time) {
      this.taskData.start_time = time;
      this.processStep(time); // o avanzar al siguiente paso
    },
    parseDateString(dateString) {
      if (!dateString) return null;
      const [year, month, day] = dateString.split("-");
      return new Date(year, month - 1, day);
    },

    updateDate(value) {
      const year = value.getFullYear();
      const month = String(value.getMonth() + 1).padStart(2, "0");
      const day = String(value.getDate()).padStart(2, "0");
      const formattedDate = `${year}-${month}-${day}`;

      this.dateInput = formattedDate;

      // Llamar a processStep con la fecha seleccionada
      this.processStep(formattedDate);
    },

    handleDateConfirmed() {
      if (!this.dateInput) return;
      this.taskData.start_date = this.dateInput;
      this.sendUserMessage(`Fecha seleccionada: ${this.dateInput}`);
      this.step++;
      this.sendBotMessage("¿Hora de inicio? (HH:mm)");
    },
    async initialize() {
      this.data = {};
      this.data.home_id = this.home_id;
      this.editedIndex = -1;
      try {
        const result = await handleRequest({
          endpoint: "category-status-priority-apk",
          method: "POST",
          data: this.data,
        });

        if (result.success) {
          // Si la solicitud es exitosa, asignamos las sucursales
          this.categories = result.data?.taskcategories || [];
          this.status = result.data?.taskstatus || [];
          this.priorities = result.data?.taskpriorities || [];
          const normalPriority = this.priorities.find(
            (priority) => priority.name === "Normal"
          );
          if (normalPriority) {
            this.taskData.priority_id = normalPriority.id;
          }
          this.recurrences = result.data?.taskrecurrences || [];
          const diaryRecurrence = this.recurrences.find(
            (recurrence) => recurrence.recurrenceName === "Diaria"
          );
          if (diaryRecurrence) {
            this.taskData.recurrence = diaryRecurrence.name;
          }
          this.people = result.data?.taskpeople || [];
          this.roles = result.data?.taskroles || [];
          this.typetasks = result.data?.tasktype || [];
          console.log("typetasks:", this.typetasks);
          //
        } else {
          // Si no hay datos, asignamos un array vacío
          this.categories = [];
          this.status = [];
          this.priorities = [];
          this.recurrences = [];
          this.people = [];
          this.roles = [];
          this.typetasks = [];
          this.showAlert("info", result.message || "No hay datos disponibles.", 3000);
        }
      } catch (error) {
        this.showAlert("error", "Ocurrió un error inesperado al cargar los datos.", 3000);
      } finally {
        this.dialog = true;
        this.initializeSelections();
        this.timeSlots = this.generateTimeSlots();
      }
    },
    handleOptionSelection(value) {
      this.taskData.type = value;
      this.sendUserMessage(value);
      this.messages.push({
        from: "bot",
        type: "editable-text",
        label: "Título de la tarea",
        model: this.taskData.title,
        step: 1,
      });
      this.step = 1;
    },
    /*handleEditableInput(msg) {
      if (!msg.model?.trim()) return;
      this.sendUserMessage(msg.model);
      this.processStep(msg.model);
    },*/
    handleEditableInput(msg) {
      if (!msg.model?.trim()) return;
      this.sendUserMessage(msg.model);
      this.processStep(msg.model);
    },
    handlePrioritySelection(option) {
      this.taskData.priority_id = option.id;
      this.selectedPriorityId = option.id;
      this.step++;
      this.processStep();
    },

    handleRecurrenceSelection(option) {
      this.taskData.recurrence = option.name;
      this.selectedRecurrence = option.name;
      this.step++;
      this.processStep(option.name);
    },
    handleUserInput() {
      if (!this.input.trim()) return;
      const userText = this.input.trim();
      this.sendUserMessage(userText);
      this.processStep(userText);
      this.input = "";
    },
    initializeSelections() {
      // Verificar si person_id no está en taskData.people
      if (this.person_id && !this.taskData.people.some((p) => p.id === this.person_id)) {
        // Buscar el rol "Responsable" en los roles disponibles
        const responsableRole = this.roles.find((role) => role.name === "Responsable");
        // Buscar la persona correspondiente al person_id (asumiendo que tienes acceso a las personas)
        const person = this.people.find((p) => p.id === this.person_id); // Asegúrate de tener this.people disponible

        if (responsableRole && person) {
          // Agregar la persona con el rol de Responsable y toda la estructura requerida
          this.taskData.people.push({
            id: person.id,
            name: person.namePerson,
            image: person.imagePerson,
            roleId: responsableRole.id,
            roleName: responsableRole.nameRol,
          });
        }
      }

      // Inicializar selectedItems para cada rol
      this.roles.forEach((role) => {
        this.selectedItems[role.id] = this.taskData.people
          .filter((p) => p.roleId === role.id)
          .map((p) => p.id);
      });
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

      // Establecer el valor por defecto en taskData
      this.taskData.start_time = formattedNearestTime;

      return orderedSlots;
    },
    startChat() {
      this.chatStarted = true;
      this.messages = [];
      this.step = 1;
      this.initializeTaskData();
      this.showSuggestion();
    },
    initializeTaskData() {
      const initialDate = this.suggestion?.date || new Date().toISOString().split("T")[0];
      this.taskData = {
        type: "",
        title: this.suggestion?.title || "",
        description: this.suggestion?.description || "",
        start_date: initialDate,
        start_time: null,
        estimated_time: "",
        geo_location: "",
        recurrence: "",
        priority_id: null,
        status_id: null,
        people: [], // Inicialmente vacío, se llenará con las personas seleccionadas
      };
      this.dateInput = initialDate;
    },
    showSuggestion() {
      if (!this.suggestion || !this.suggestion.title) {
        this.sendBotMessage("⚠️ No se recibió una sugerencia válida.");
        return;
      }
      this.sendBotMessage(
        `💡 Tienes una nueva sugerencia:\n\n📌 ${this.suggestion.title}\n📝 ${
          this.suggestion.description
        }\n📅 ${this.suggestion.date || "No disponible"}`
      );
      setTimeout(() => {
        this.messages.push({
          from: "bot",
          type: "options",
          options: [
            { label: "Crear como tarea", value: "task" },
            { label: "Crear como meta", value: "goal" },
          ],
        });
        this.scrollToBottom();
      }, 800);
    },
    sendUserMessage(text) {
      this.messages.push({ from: "user", text });
    },
    sendBotMessage(text) {
      this.messages.push({ from: "bot", text });
    },
    scrollToBottom() {
      this.$nextTick(() => {
        const container = this.$refs.chatBody;
        if (container) {
          container.scrollTop = container.scrollHeight;
        }
      });
    },
    closeDialog() {
      this.chatStarted = false;
      this.internalDialog = false;
    },
    /*processStep(response) {
      switch (this.step) {
        case 1:
          this.taskData.title = response;
          this.sendBotMessage(
            `Muy bien, ¿quieres usar este título o escribir otro?\n➡️ *${this.taskData.title}*`
          );
          break;
        case 2:
          this.taskData.description = response;
          this.sendBotMessage(`Muy bien, ¿quieres usar esta descripción o escribir otra?\n➡️ *${this.taskData.description}*`);
          break;
        case 3:
          this.taskData.priority_id = response;
          this.messages.push({
            from: "bot",
            type: "priority-options",
            options: this.priorities.map((p) => ({
              id: p.id,
              name: p.namePriority,
              description: p.descriptionPriority,
              color: p.colorPriority,
            })),
          });
          break;
        case 4:
          this.taskData.start_time = response;
          this.sendBotMessage("¿Hora de inicio? (HH:mm)");
          break;
        case 5:
          this.taskData.estimated_time = response;
          this.sendBotMessage("¿Tiempo estimado? (ej: 1h, 30min)");
          break;
        case 6:
          this.taskData.geo_location = response;
          this.sendBotMessage("¿Ubicación (opcional)?");
          break;
        case 7:
          this.taskData.recurrence = response;
          this.messages.push({
            from: "bot",
            type: "recurrence-options",
            options: this.recurrences.map((r) => ({
              name: r.name,
              description: r.description || r.recurrenceName,
            })),
          });
          break;
        case 8:
          //this.taskData.status_id = parseInt(response) || 1;
          this.sendBotMessage("✅ ¡Todo listo! Guardando...");
          setTimeout(() => {
            this.$emit("completed", this.taskData);
            this.closeDialog();
          }, 1500);
          break;
      }
      this.step++;
    },*/
    processStep(response) {
      switch (this.step) {
        case 1:
          // Guardar título y pedir descripción
          this.taskData.title = response;
          this.messages.push({
            from: "bot",
            type: "editable-textarea",
            label: "Descripción de la tarea",
            model: this.taskData.description,
            step: 2,
          });
          break;

        case 2:
          // Guardar descripción y pedir fecha
          this.taskData.description = response;
          this.messages.push({
            from: "bot",
            type: "date-picker",
          });
          break;

        case 3:
          // Guardar fecha (response viene del handler de fecha)
          this.taskData.start_date = response;
          this.messages = [
            ...this.messages,
            {
              from: "bot",
              type: "time-picker",
            },
          ];
          break;

        case 4:
          // Guardar hora de inicio (response viene del handler de hora)
          this.taskData.start_time = response;
          //this.sendUserMessage(`Hora de inicio: ${response}`);
          // Mostrar opciones de recurrencia
          this.messages.push({
            from: "bot",
            type: "recurrence-options",
            options: this.recurrences.map((r) => ({
              name: r.name,
              description: r.description || r.recurrenceName,
            })),
          });
          break;

        case 5:
          // Guardar recurrencia seleccionada
          this.taskData.recurrence = response;
          //this.sendUserMessage(`Recurrencia: ${response}`);
          // Pedir tiempo estimado
          this.sendBotMessage("¿Tiempo estimado? (ej: 1h, 30min)");
          break;

        case 6:
          // Guardar tiempo estimado y cerrar
          this.taskData.estimated_time = response;
          this.sendUserMessage(`Tiempo estimado: ${response}`);
          this.sendBotMessage("✅ ¡Todo listo! Guardando...");
          setTimeout(() => {
            this.$emit("completed", this.taskData);
            this.closeDialog();
          }, 1500);
          break;
      }

      // Avanzar paso excepto en paso 5 que espera selección manual
      if (this.step !== 5) {
        this.step++;
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
  },
};
</script>

<style scoped>
.chat-body {
  background-color: #f5f5f5;
  overflow-y: auto;
  flex: 1;
}
.chat-body::-webkit-scrollbar {
  width: 8px;
}
.chat-body::-webkit-scrollbar-track {
  background: #f1f1f1;
}
.chat-body::-webkit-scrollbar-thumb {
  background: #888;
  border-radius: 4px;
}
.chat-body::-webkit-scrollbar-thumb:hover {
  background: #555;
}
</style>
