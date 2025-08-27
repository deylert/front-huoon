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
  >
    <div class="bg-white fill-height" style="position: relative">
    <!-- Botón de cierre -->
    <v-btn
      icon="mdi-close"
      color="grey-darken-2"
      variant="text"
      style="position: fixed; top: 16px; right: 16px; z-index: 1000; background-color: white"
      @click="internalDialog = false"
    />
     <v-container>
    <!-- Botón de cierre absoluto -->
    <v-btn
      icon="mdi-close"
      color="grey-darken-2"
      variant="text"
      style="position: absolute; top: 16px; right: 16px; z-index: 1000"
      @click="internalDialog = false"
    />
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

                <template v-else-if="msg.type === 'editable-text'">
                  <v-text-field
                    v-model="taskData.title"
                    :label="msg.label"
                    variant="outlined"
                    hide-details
                    style="min-width: 500px"
                    @keyup.enter="handleTitleInput"
                  />
                </template>

                <template v-else-if="msg.type === 'editable-textarea'">
                  <v-textarea
                    v-model="taskData.description"
                    :label="msg.label"
                    variant="underlined"
                    hide-details
                    rows="4"
                    style="min-width: 500px"
                    @keyup.enter="handleDescriptionInput"
                  />
                </template>

                <template v-else-if="msg.type === 'priority-options'">
                  <v-slide-group show-arrows class="pa-2">
                    <v-slide-group-item v-for="option in msg.options" :key="option.id">
                      <div class="me-3">
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
                      </div>
                    </v-slide-group-item>
                  </v-slide-group>
                </template>

                <template v-else-if="msg.type === 'recurrence-options'">
                  <v-slide-group show-arrows class="pa-2">
                    <v-slide-group-item v-for="option in msg.options" :key="option.name">
                      <div class="me-3">
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
                      </div>
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
                      :min="new Date().toISOString().split('T')[0]"
                      show-adjacent-months
                      landscape
                      class="pa-0"
                    />
                  </v-card>
                </template>
                <template v-else-if="msg.type === 'people-selector'">
                  <v-row>
                    <v-col cols="12" md="6" v-for="role in roles" :key="role.id">
                      <v-card class="mx-auto" max-width="100%">
                        <v-list
                          v-model:selected="selectedItems[role.id]"
                          @update:selected="updateSelection(role, $event)"
                          select-strategy="leaf"
                          multiple
                        >
                          <v-list-subheader>{{ role.nameRol }}</v-list-subheader>
                          <v-list-item
                            v-for="person in filteredPeople(role.id)"
                            :key="`${role.id}-${person.id}`"
                            :value="person.id"
                            :prepend-avatar="`${$axios.defaults.baseURL}images/${person.imagePerson}`"
                            class="py-3"
                            active-class="text-green"
                          >
                            <v-list-item-title>{{ person.namePerson }}</v-list-item-title>
                            <v-list-item-subtitle
                              class="mb-1 text-high-emphasis opacity-100"
                            >
                              {{ person.roleName }}
                            </v-list-item-subtitle>

                            <template v-slot:append="{ isSelected }">
                              <v-list-item-action class="flex-column align-end">
                                <v-icon
                                  v-if="
                                    isSelected || isPersonSelected(person.id, role.id)
                                  "
                                  :color="
                                    getRoleIcon(role.id) === 'mdi-star'
                                      ? 'green-darken-3'
                                      : 'green-darken-3'
                                  "
                                >
                                  {{
                                    getRoleIcon(role.id) === "mdi-star"
                                      ? "mdi-star"
                                      : "mdi-circle-slice-8"
                                  }}
                                </v-icon>
                                <v-icon
                                  v-else
                                  class="opacity-30"
                                  :color="
                                    getRoleIcon(role.id) === 'mdi-star'
                                      ? 'green-darken-3'
                                      : undefined
                                  "
                                >
                                  {{
                                    getRoleIcon(role.id) === "mdi-star"
                                      ? "mdi-star-outline"
                                      : "mdi-checkbox-blank-circle-outline"
                                  }}
                                </v-icon>
                              </v-list-item-action>
                            </template>
                          </v-list-item>
                        </v-list>
                      </v-card>
                    </v-col>
                  </v-row>
                  <!-- Botones de confirmación fijos -->
                  <div class="confirmation-buttons mt-4">
                    <div class="text-caption mb-2">
                      {{
                        $t("chat.selectedParticipants", taskData.people.length, {
                          count: taskData.people.length,
                        })
                      }}
                    </div>
                    <div class="d-flex justify-end gap-2">
                      <v-btn
                        color="error"
                        variant="outlined"
                        @click="handleAction($t('general.no'))"
                      >
                        {{ $t("general.no") }}
                      </v-btn>
                      <v-btn
                        color="primary"
                        @click="handleAction($t('general.yes'))"
                        :disabled="taskData.people.length === 0"
                      >
                        {{ $t("general.yes") }}
                      </v-btn>
                    </div>
                  </div>
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
      </v-container>
      </div>
  </v-dialog>
</template>

<script>
import LocalStorageService from "@/LocalStorageService";
import { handleRequest } from "@/utils/api"; // Ruta al archivo
import { VTimePicker } from "vuetify/labs/components";
export default {
  name: "ChatTaskDialog",
  emits: ["update:modelValue", "completed"], // Agrega esta línea
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
      confirmButtonShown: false,
      lastSelectionCount: 0,
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
    //this.timeSlots = this.generateTimeSlots(); // Genera los horarios al montar el componente
  },
  methods: {
    handleAction(action) {
      console.log("Handling action:", action, "at step:", this.step);

      if (this.step === 8) {
        // Asegúrate que coincida con tu paso de confirmación
        if (action === this.$t("general.yes")) {
          // Validación reforzada
          if (!this.taskData.people || this.taskData.people.length === 0) {
            this.sendBotMessage(this.$t("chat.mustSelectParticipants"));
            return;
          }

          // Mostrar confirmación
          const participantCount = this.taskData.people.length;
          this.sendUserMessage(
            this.$t("chat.confirmedParticipants", participantCount, {
              count: participantCount,
            })
          );

          // Forzar renderizado
          this.$forceUpdate();

          // Avanzar y procesar
          this.step = 9;
          console.log("Avanzando a paso 9");

          // Llamar directamente al caso de finalización
          this.sendBotMessage(this.$t("chat.completed"));
          setTimeout(() => {
            console.log("Completando tarea", this.taskData);
            this.$emit("completed",{
      taskData: this.taskData,  // Todos los datos de la tarea
      people: this.people       // Array de personas separado
    });
            this.closeDialog();
          }, 1500);
        } else if (action === this.$t("general.no")) {
          this.sendUserMessage(this.$t("chat.willModifyParticipants"));
          // Mantener en el mismo paso para permitir cambios
        }
      }
    },
    updateSelection(role, selectedIds) {
      // Actualizar selecciones
      this.taskData.people = this.taskData.people.filter(
        (p) => p.roleId !== role.id || selectedIds.includes(p.id)
      );

      // Añadir nuevas selecciones
      selectedIds.forEach((personId) => {
        if (
          !this.taskData.people.some((p) => p.id === personId && p.roleId === role.id)
        ) {
          const person = this.people.find((p) => p.id === personId);
          if (person) {
            this.taskData.people.push({
              id: person.id,
              name: person.namePerson,
              image: person.imagePerson,
              roleId: role.id,
              roleName: role.nameRol,
            });
          }
        }
      });

      // Forzar actualización de la UI
      this.$forceUpdate();
    },

    filteredPeople(roleId) {
      return this.people.filter((person) => {
        const assignedPerson = this.taskData.people.find((p) => p.id === person.id);
        return !assignedPerson || assignedPerson.roleId === roleId;
      });
    },

    isPersonSelected(personId, roleId) {
      return this.taskData.people.some((p) => p.id === personId && p.roleId === roleId);
    },

    getRoleIcon(roleId) {
      const role = this.roles.find((r) => r.id === roleId);
      if (!role) return "mdi-account";

      switch (role.name.toLowerCase()) {
        case "responsable":
          return "mdi-star";
        case "colaborador":
          return "mdi-account-group";
        default:
          return "mdi-account";
      }
    },
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
      let formattedDate = "";

      if (typeof value === "string") {
        formattedDate = value;
      } else if (value instanceof Date) {
        const year = value.getFullYear();
        const month = String(value.getMonth() + 1).padStart(2, "0");
        const day = String(value.getDate()).padStart(2, "0");
        formattedDate = `${year}-${month}-${day}`;
      }

      //if (this.taskData.start_date !== formattedDate) {
      this.dateInput = formattedDate;
      this.taskData.start_date = formattedDate;
      this.sendUserMessage(this.$t("chat.dateSelected", { date: formattedDate }));
      this.processStep(formattedDate);
      //}
    },

    handleDateConfirmed() {
      if (!this.dateInput) return;
      this.taskData.start_date = this.dateInput;
      this.sendUserMessage(this.$t("chat.dateSelected", { date: this.dateInput }));
      this.step++;
      this.sendBotMessage(this.$t("chat.askStartTime"));
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
          // Asignación de datos
          this.categories = result.data?.taskcategories || [];
          this.status = result.data?.taskstatus || [];
          this.priorities = result.data?.taskpriorities || [];
          this.recurrences = result.data?.taskrecurrences || [];
          this.people = result.data?.taskpeople || [];
          this.roles = result.data?.taskroles || [];
          this.typetasks = result.data?.tasktype || [];

          // Inicializar valores por defecto
          this.setDefaultValues();
        } else {
          // Manejo de caso sin datos
          this.resetData();
          this.showAlert("info", result.message || "No hay datos disponibles.", 3000);
        }
      } catch (error) {
        this.resetData();
        this.showAlert("error", "Ocurrió un error inesperado al cargar los datos.", 3000);
      } finally {
        this.dialog = true;
        this.initializeSelections();
        //this.timeSlots = this.generateTimeSlots();
      }
    },
    setDefaultValues() {
      // Prioridad por defecto (Normal)
      const normalPriority = this.priorities.find((p) => p.name === "Normal");
      if (normalPriority) {
        this.taskData.priority_id = normalPriority.id;
        this.selectedPriorityId = normalPriority.id;
      }

      // Recurrencia por defecto (Diaria)
      const dailyRecurrence = this.recurrences.find((r) => r.recurrenceName === "Diaria");
      if (dailyRecurrence) {
        this.taskData.recurrence = dailyRecurrence.name;
        this.selectedRecurrence = dailyRecurrence.name;
      }

      // Fecha y hora por defecto
      const today = new Date().toISOString().split("T")[0];
      this.taskData.start_date = this.suggestion?.date || today;
      this.dateInput = this.taskData.start_date;
    },
    resetData() {
      this.categories = [];
      this.status = [];
      this.priorities = [];
      this.recurrences = [];
      this.people = [];
      this.roles = [];
      this.typetasks = [];

      // Resetear taskData con valores básicos
      this.taskData = {
        type: "",
        title: "",
        description: "",
        start_date: new Date().toISOString().split("T")[0],
        start_time: null,
        estimated_time: "",
        geo_location: "",
        recurrence: "",
        priority_id: null,
        people: [],
      };
    },
    initializeTaskData() {
      // Usar valores existentes o iniciales
      const initialDate =
        this.taskData.start_date ||
        this.suggestion?.date ||
        new Date().toISOString().split("T")[0];

      this.taskData = {
        ...this.taskData, // Mantener valores ya establecidos (como recurrencia)
        type: "",
        title: this.suggestion?.title || "",
        description: this.suggestion?.description || "",
        start_date: initialDate,
        start_time: this.generateTimeSlots()[0],
        estimated_time: "",
        geo_location: "",
        people: this.getInitialPeopleSelection(),
      };

      this.dateInput = initialDate;
    },
    getInitialPeopleSelection() {
      // Si ya hay personas seleccionadas (de valores por defecto), mantenerlas
      if (this.taskData.people?.length > 0) {
        return [...this.taskData.people];
      }

      // Añadir usuario actual como responsable si existe
      if (this.person_id && this.people?.length > 0) {
        const person = this.people.find((p) => p.id === this.person_id);
        const responsableRole = this.roles?.find((r) => r.name === "Responsable");

        if (person && responsableRole) {
          return [
            {
              id: person.id,
              name: person.namePerson,
              image: person.imagePerson,
              roleId: responsableRole.id,
              roleName: responsableRole.nameRol,
            },
          ];
        }
      }

      return [];
    },
    initializeSelections() {
      // Inicializar selectedItems para cada rol
      this.roles.forEach((role) => {
        this.selectedItems[role.id] = this.taskData.people
          .filter((p) => p.roleId === role.id)
          .map((p) => p.id);
      });

      // Asegurar que el usuario actual esté incluido si no lo está
      if (this.person_id && !this.taskData.people.some((p) => p.id === this.person_id)) {
        const responsableRole = this.roles.find((r) => r.name === "Responsable");
        const person = this.people.find((p) => p.id === this.person_id);

        if (responsableRole && person) {
          this.taskData.people.push({
            id: person.id,
            name: person.namePerson,
            image: person.imagePerson,
            roleId: responsableRole.id,
            roleName: responsableRole.nameRol,
          });
          // Actualizar selectedItems
          this.selectedItems[responsableRole.id] = [
            ...(this.selectedItems[responsableRole.id] || []),
            person.id,
          ];
        }
      }
    },
    handleEditableInput(msg) {
      if (!msg.model?.trim()) return;

      this.sendUserMessage(msg.model);

      // Procesar el paso actual con el valor del campo editable
      this.processStep(msg.model);
    },
    handlePrioritySelection(option) {
      this.taskData.priority_id = option.id;
      this.selectedPriorityId = option.id;
      this.input = option.name; // Actualizar el input con la selección
      this.$nextTick(() => {
        this.handleUserInput(); // Disparar el envío automático
      });
    },

    handleRecurrenceSelection(option) {
      this.taskData.recurrence = option.name;
      this.selectedRecurrence = option.name;
      this.sendUserMessage(option.name);
      this.processStep(option.name); // Avanzar automáticamente
    },

    handleOptionSelection(value) {
      this.taskData.type = value;
      this.sendUserMessage(value);
      this.step = 1;
      this.prepareNextStep();
    },
    handleUserInput() {
      // Para pasos con inputs editables
      const currentMessage = this.messages[this.messages.length - 1];

      if (
        currentMessage?.type === "editable-text" ||
        currentMessage?.type === "editable-textarea"
      ) {
        if (!currentMessage.model?.trim()) return;
        this.sendUserMessage(currentMessage.model);
        this.processStep(currentMessage.model);
        //currentMessage.model = ""; // Limpiar después de enviar
        return;
      }

      // Para input normal
      if (!this.input.trim()) return;

      this.sendUserMessage(this.input.trim());
      this.processStep(this.input.trim());
      this.input = "";
    },
    handleTitleInput() {
      if (!this.taskData.title?.trim()) return;

      this.sendUserMessage(this.taskData.title);
      this.processStep(this.taskData.title);
      //this.step++; // Avanzar al siguiente paso
      //this.prepareNextStep();
    },

    handleDescriptionInput() {
      if (!this.taskData.description?.trim()) return;

      this.sendUserMessage(this.taskData.description);
      this.processStep(this.taskData.description);
      //this.step++; // Avanzar al siguiente paso
      //this.prepareNextStep();
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
    showSuggestion() {
      if (!this.suggestion || !this.suggestion.title) {
        this.sendBotMessage(this.$t("chat.invalidSuggestion"));
        return;
      }
      this.sendBotMessage(
        this.$t("chat.suggestionMessage", {
          title: this.suggestion.title,
          description: this.suggestion.description,
          date: this.suggestion.date || this.$t("chat.notAvailable"),
        })
      );
      setTimeout(() => {
        this.messages.push({
          from: "bot",
          type: "options",
          options: [
            { label: this.$t("chat.createAsTask"), value: "Tarea" },
            { label: this.$t("chat.createAsGoal"), value: "Meta" },
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
    processStep(response) {
      // Actualizar los datos según el paso actual
      switch (this.step) {
        case 1: // TÍTULO
          //this.taskData.title = response;
          break;
        case 2: // DESCRIPCIÓN
          //this.taskData.description = response;
          break;
        case 3: // PRIORIDAD
          console.log("prioridad:", response);
          //this.taskData.priority_id = response;
          break;
        case 4: // FECHA
          this.taskData.start_date = response;
          break;
        case 5: // HORA
          this.taskData.start_time = response;
          break;
        case 6: // RECURRENCIA
          this.taskData.recurrence = response;
          break;
        case 7: // TIEMPO ESTIMADO
          this.taskData.estimated_time = response;
          break;
      }

      // Avanzar al siguiente paso
      this.step++;

      // Preparar la UI para el siguiente paso
      this.prepareNextStep();
    },
    prepareNextStep() {
      switch (this.step) {
        case 1: // TÍTULO
          this.messages.push({
            from: "bot",
            type: "editable-text",
            label: this.$t("chat.taskTitle"),
            //model: this.taskData.title,
          });
          break;

        case 2: // DESCRIPCIÓN
          this.messages.push({
            from: "bot",
            type: "editable-textarea",
            label: this.$t("chat.taskDescription"),
            //model: this.taskData.description,
          });
          break;

        case 3: // PRIORIDAD
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

        case 4: // FECHA
          this.messages.push({
            from: "bot",
            type: "date-picker",
          });
          break;

        case 5: // HORA
          this.messages.push({
            from: "bot",
            type: "time-picker",
          });
          break;

        case 6: // RECURRENCIA
          this.messages.push({
            from: "bot",
            type: "recurrence-options",
            options: this.recurrences.map((r) => ({
              name: r.name,
              description: r.description || r.recurrenceName,
            })),
          });
          break;

        case 7: // TIEMPO ESTIMADO
          this.sendBotMessage(this.$t("chat.askEstimatedTime"));
          break;

        case 8: // PERSONAS
          this.messages.push({
            from: "bot",
            type: "people-selector",
          });
          break;

        case 9: // FINALIZACIÓN
          this.sendBotMessage(this.$t("chat.completed"));
          setTimeout(() => {
            this.$emit("completed",{
      taskData: this.taskData,  // Todos los datos de la tarea
      people: this.people       // Array de personas separado
    });
            this.closeDialog();
          }, 1500);
          break;
      }

      this.scrollToBottom();
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
.v-input__append {
  margin-left: 8px;
}

.chat-bubble .v-btn--icon {
  margin: 0;
}
.confirmation-buttons {
  background-color: #f8f9fa;
  border-radius: 8px;
  padding: 12px;
  margin-top: 16px;
  border-left: 3px solid #03626c;
}

.confirmation-buttons .v-btn {
  text-transform: uppercase;
  font-weight: 500;
  letter-spacing: 0.5px;
}
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
