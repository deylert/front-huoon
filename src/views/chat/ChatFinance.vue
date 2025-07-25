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
          <div ref="chatBody" class="px-4 py-2">
            <div v-for="(message, index) in chatMessages" :key="index" class="mb-8"
              :class="message.from === 'user' ? 'justify-end' : 'justify-start'">
              <div class="d-flex align-end" :class="message.from === 'user' ? 'flex-row-reverse' : ''">
                <v-avatar v-if="message.from === 'ai'" size="28" class="mb-2 mr-3">
                  <v-img src="@/assets/logo-verde.png" alt="Imagen de perfil" />
                </v-avatar>

                <div :class="[
            'rounded-xl',
            message.from === 'user' 
              ? 'bg-primary text-white' 
              : 'bg-grey-lighten-2 text-black',
            message.isEditing 
              ? 'pa-4'  // Estilo cuando está en edición
              : 'px-8 py-3'  // Estilo normal
          ]"
          style="min-width: 0; max-width: 100%; width: fit-content" >
                  <!-- Campo editable con componente -->
                  <template v-if="message.isEditable && message.isEditing">
                    <div v-if="['date'].includes(message.fieldKey)">
                      <v-menu v-model="message.showDatePicker" :close-on-content-click="false"
                        transition="scale-transition" offset-y location="bottom"
                        @update:modelValue="handleMenuClose(message, index)">
                        <template #activator="{ props }">
                          <v-text-field v-bind="props" :model-value="financeParameters[message.fieldKey]"
                            :label="message.fieldLabel" variant="outlined" density="comfortable"
                            style="width: auto; min-width: 10em" no-resize
                            @click:appendInner="message.showDatePicker = true" />
                        </template>

                        <DatePicker :dateValue="financeParameters[message.fieldKey]" :fieldType="message.fieldKey"
                          @date-updated="
                        handleDateSelection(message.fieldKey, $event)
                      " />
                      </v-menu>
                    </div>
                    <div v-if="message.fieldKey === 'budget_id'">
                        <v-autocomplete
                          v-model="message.editValue"
                          :items="message.availableBudgets || budgets"
                          item-title="categoryName"
                          item-value="id"
                          :label="message.fieldLabel"
                          variant="outlined"
                          density="comfortable"
                          return-object
                          style="width: auto; min-width: 20em"
                          hide-details
                          @update:modelValue="onBudgetSelected(index, $event)"
                          @blur="onBudgetBlur(index)"
                          @click:clear="onBudgetClear(index)"
                        >
                          <template v-slot:item="{ props, item }">
                            <v-list-item v-bind="props">
                              <template v-slot:title>
                                <div class="d-flex align-center">
                                  <v-icon v-if="item.raw.icon" start>{{ item.raw.icon }}</v-icon>
                                  <span>{{ item.raw.categoryName }}</span>
                                </div>
                              </template>
                              <template v-slot:subtitle>
                                <div class="d-flex flex-column">
                                  <span v-if="item.raw.description">{{ item.raw.description }}</span>
                                  <span class="text-caption">
                                    {{ item.raw.budget_type }} |
                                    {{ item.raw.currency }} {{ parseFloat(item.raw.amount).toFixed(2) }} |
                                    {{ parseFloat(item.raw.used_amount).toFixed(2) }} usado
                                  </span>
                                </div>
                              </template>
                            </v-list-item>
                          </template>
                          <template v-slot:selection="{ item }">
                            <div class="d-flex align-center">
                              <v-icon v-if="item.raw.icon" start small>{{ item.raw.icon }}</v-icon>
                              <span>{{ item.raw.categoryName }}</span>
                            </div>
                          </template>
                        </v-autocomplete>
                        <!-- Opcional: Puedes ocultar los botones si quieres que todo sea automático -->
                        <!-- Si decides mantenerlos, puedes hacerlos más discretos -->
                        <!--
                        <div class="d-flex justify-end mt-2">
                          <v-btn size="small" @click="cancelFieldEdit(index)" variant="text">Cancelar</v-btn>
                          <v-btn size="small" color="primary" @click="saveFieldEdit(index)" class="ml-2" variant="text">Guardar</v-btn>
                        </div>
                        -->
                      </div>
                      <v-textarea v-else-if="['title', 'description'].includes(message.fieldKey)"
                      v-model="message.editValue" :label="message.fieldLabel" variant="outlined" density="comfortable"
                      style="width: auto; min-width: 50em" :ref="(el) => setTextFieldRef(el, index)" autofocus auto-grow
                      rows="2" no-resize @keyup.enter="saveFieldEdit(index)" @blur="saveFieldEdit(index)"></v-textarea>

                    <!-- Textfield para otros campos -->
                    <v-text-field v-else v-model="message.editValue" :label="message.fieldLabel" variant="outlined"
                      density="comfortable" style="width: auto; min-width: 10em" :ref="(el) => setTextFieldRef(el, index)"
                      autofocus no-resize @keyup.enter="saveFieldEdit(index)"
                      @blur="saveFieldEdit(index)"></v-text-field>
                  </template>

                  <!-- Texto normal -->
                  <template v-else>
                    <div v-if="!message.buttons" @click="message.isEditable ? startFieldEdit(index) : null"
                      :class="{ 'editable-message': message.isEditable }"
                      style="white-space: pre-wrap; word-break: break-word">
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
                        <v-btn v-for="(button, btnIndex) in message.buttons" :key="btnIndex" :color="button.color"
                          :variant="button.variant" @click="button.action" class="text-none" size="small"
                          v-bind="button.props || {}">
                          {{ button.text }}
                        </v-btn>
                      </div>
                    </div>
                  </template>

                  <!-- Componente dinámico -->
                  <component v-if="message.component && !message.isEditing" :is="message.component"
                    v-bind="message.props" @type-selected="handleTypeSelection($event)"
                    @date-updated="updateDate($event)"/>
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
              <v-textarea v-model="newMessage" :placeholder="$t('chat.inputPlaceholder')" variant="outlined"
                hide-details density="compact" rounded rows="1" no-resize @keyup.enter="sendMessage"
                style="overflow-y: auto; max-height: 120px; resize: none" class="custom-textarea"
                :disabled="isLoading" />
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
    </v-row>

  </v-container>
</template>

<script>
import DatePicker from "@/components/chatTask/DatePicker.vue";
import TypePersonalConfirmation from "@/components/chatTask/TypePersonalConfirmation.vue";
import TypePersonalOptions from "@/components/chatTask/TypePersonalOptions.vue";
import LocalStorageService from "@/LocalStorageService";
import { handleRequest } from "@/utils/api";
import { markRaw } from "vue";

export default {
emits: ["close-dialog", "close-all-dialogs"],
  props: {
    initialMessage: {
      type: String,
      default: "",
    },
    financeData: {
      type: Object,
      default: null,
    },
  },
  components: {
    DatePicker,
    TypePersonalOptions,
    TypePersonalConfirmation
  },
  data() {
    return {
      isInitialCategorySelection: false,
      textoTemporal: "",
      financeDataCollectionMode: false,
      currentFinanceIntent: null,
      editingField: null,
      escuchando: false,
      recognition: null,
      cargando: false,
      compatible: true,
      tools: [],
      financeParameters: {
        type: null,
        spent: null,
        description: null,
        income: null,
        date: null,
        budget_id: null,
      },
      originalItem: {
        type: null,
        spent: null,
        description: null,
        income: null,
        date: null,
        budget_id: null,
      },
      defaultItem: {
        type: null,
        spent: null,
        description: null,
        income: null,
        date: null,
        budget_id: null,
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
      budgets: [],
      types: [],
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
    let financeData = this.financeData;
  
  // Si es string, parsearlo
  if (typeof financeData === 'string') {
    try {
      financeData = JSON.parse(financeData);
    } catch (error) {
      console.error("Error parsing financeData:", error);
      return;
    }
  }
  
  console.log("Datos recibidos del componente padre (financeData):", financeData);
    this.name = JSON.parse(LocalStorageService.getItem("name"));
    this.user = JSON.parse(LocalStorageService.getItem("user"));
    this.user_id = JSON.parse(LocalStorageService.getItem("user_id"));
    this.home_id = JSON.parse(LocalStorageService.getItem("home_id"));
    this.imageUrl = LocalStorageService.getItem("image").replace(/['"]+/g, "");
    if (this.financeData) {
      try {
        await this.loadRequiredData();
        // Copiar los datos de la tarea
          this.financeParameters = {
                          ...this.financeParameters,
                          ...financeData,
                        };
          this.financeDataCollectionMode = true;
          this.currentTransactionType = this.financeData.spent > 0 ? 'gasto' : 'ingreso';
        this.currentFinanceIntent = financeData.spent > 0 ? 'Gasto' : 'Ingreso';
        // Mostrar en el chat
        this.chatMessages.push({
          from: "ai",
          text: `Datos de la  ${this.currentFinanceIntent} recibidos. Puedes editarlos antes de confirmar.`,
          timestamp: new Date().toLocaleTimeString(),
        });

        // Iniciar flujo de edición
        
  
      await this.showInitialFinanceData(financeData);
      } catch (error) {
        this.showAlert("error", "Error al cargar datos: " + error.message);
      }
    } else if (this.initialMessage) {
      // Si no hay financeData, pero hay initialMessage, simular envío
      this.newMessage = this.initialMessage;
      this.sendMessage();
    }
  },
  methods: {
    onBudgetSelected(index, selectedBudget) {
    console.log("Presupuesto seleccionado:", selectedBudget);
    // Si se selecciona un objeto (no null/undefined), guardar automáticamente
    if (selectedBudget && typeof selectedBudget === 'object' && this.isInitialBudgetSelection) {

    this.saveFieldEdit(index);

    }
    // Si selectedBudget es null (limpiado con clear) o un ID, también podrías guardarlo
    // pero saveFieldEdit manejará la validación.
  },

  onBudgetBlur(index) {
    console.log("Autocomplete perdió foco");
    // Cuando se pierde el foco, intentar guardar.
    // Si no hay valor válido, saveFieldEdit lo manejará.
    // Puedes añadir un pequeño retraso si quieres permitir clic en el menú desplegable.
    setTimeout(() => {
      const message = this.chatMessages[index];
      if (message && message.isEditing) {
         // Verificar si el valor actual es diferente al original antes de guardar
         if (message.editValue !== message.currentValue) {
             if (!this.isInitialBudgetSelection) {
        this.saveFieldEdit(index);
      }
         } else {
             // Si no cambió, simplemente salir del modo edición
             message.isEditing = false;
             this.scrollToBottom();
         }
      }
    }, 200); // Pequeño retraso para permitir selección del menú
  },

  onBudgetClear(index) {
    console.log("Selección de presupuesto limpiada");
    const message = this.chatMessages[index];
    // Establecer editValue a null
    message.editValue = null;
    // Guardar inmediatamente el valor null
    this.saveFieldEdit(index);
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

      if (["date"].includes(this.chatMessages[index].fieldKey)) {
        this.$nextTick(() => {
          this.chatMessages[index].showDatePicker = true;
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
    cancelFieldEdit(index) {
    const message = this.chatMessages[index];
    message.isEditing = false;
    message.editValue = message.currentValue; // Revertir cambios
    this.scrollToBottom();
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
              this.financeParameters[lastAIMessage.fieldName] = validatedValue;
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
            await this.handleConfirmation(tempMessage);
            return;
          }

          if (!this.financeDataCollectionMode) {
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
        const { intentDetected, intent, task, answer, finances, budget } = response.data;

            if (intentDetected && intent) {
              this.data = { home_id: this.home_id };
              if (response.data.finances) {
                this.financeParameters = {
                  ...this.financeParameters,
                  ...response.data.finances,
                };
              }
              await this.loadRequiredData();
              this.currentFinanceIntent = intent;
              this.financeDataCollectionMode = true;
              await this.showInitialFinanceData(finances);
            } else {
              this.chatMessages.push({
                from: "ai",
                text: answer,
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
      this.isLoading = true;
           this.data = {};
      this.data.home_id = this.home_id;
      try {
        const result = await handleRequest({
          endpoint: "get-finances-data",
          method: "POST",
          data: this.data,
        });

        if (result.success) {
          this.types = result.data?.types || [];
          this.budgets = result.data?.budgets || [];
        } else {
          this.types = [];
          this.butgets = [];
        }
      } catch (error) {
        this.showAlert(
          "error",
          "Ocurrió un error inesperado al cargar los tipos de consulta.",
          3000
        );
      } finally {
        this.isLoading = false;
      }
    },
async showInitialFinanceData(financeData) {
  if (!financeData) return;
  
  // Inicializar estado para budget_id
  if(financeData.spent > 0){
  this.isInitialBudgetSelection = (
    financeData.budget_id === null || 
    financeData.budget_id === undefined
  );}
  
  this.isInitialDataCollection = !financeData;
  await this.showFinanceSummary(financeData);
  await this.startAutomaticDataCollection();
},

async showFinanceSummary(financeData) {
  // Definir campos a mostrar
  const fieldsToShow = [
    { key: "description", label: "Descripción" },
    ...(financeData.spent > 0 ? [{ key: "spent", label: "Gasto" }] : []),
    ...(financeData.income > 0 ? [{ key: "income", label: "Ingreso" }] : []),
    { key: "date", label: "Fecha" },
    ...(financeData.spent > 0 && financeData.budget_id ? [{ key: "budget_id", label: "Presupuesto" }] : []),
  ];

  // Mostrar campos editables
  fieldsToShow.forEach((field) => {
    const value = financeData[field.key];
    if (value !== null && value !== undefined && value !== '') {
      let displayValue = value;
      let additionalData = {};

      if (field.key === "spent" || field.key === "income") {
        displayValue = `$${parseFloat(value).toFixed(2)}`;
      } else if (field.key === "budget_id") {
        const budgetInfo = this.budgets.find(b => b.id === value);
        displayValue = budgetInfo ? budgetInfo.categoryName : `ID: ${value}`;
        additionalData.availableBudgets = this.budgets;
      }

      this.chatMessages.push({
        from: "ai",
        text: `• ${field.label}: ${displayValue}`,
        timestamp: new Date().toLocaleTimeString(),
        isEditable: true,
        fieldKey: field.key,
        fieldLabel: field.label,
        currentValue: value,
        editValue: value,
        isEditing: false,
        showDatePicker: field.key === 'date',
        ...additionalData
      });
        // Mostrar componente de tipo si existe
 
    }
  });
   if (financeData.type) {
    this.chatMessages.push({
      from: "ai",
      text: "Tipo:",
      component: "TypePersonalOptions",
      props: {
        options: this.types,
        selectedId: financeData.type,
      },
      timestamp: new Date().toLocaleTimeString(),
    });
  }
},

async startAutomaticDataCollection() {
  const parametersOrder = [
    "description",
    "spent",
    "income",
    "date",
    "type",
    ...(this.financeParameters.spent > 0 ? ["budget_id"] : []),
  ];

  const nextField = parametersOrder.find(field => {
    const value = this.financeParameters[field];
    return !value && value !== 0;
  });

  if (nextField === "type") {
    await this.showTypeOptions();
  } 
  else if (nextField === "budget_id" && !this.isInitialBudgetSelection) {
    // Si es budget_id pero no es la primera selección, completar creación
    this.completeFinanceCreation();
  }
  else if (nextField) {
    this.showFieldInput(nextField);
  } 
  else {
    this.completeFinanceCreation();
  }
},

async showFieldInput(field) {
  const fieldLabels = {
    description: "la descripción",
    spent: "el monto del gasto",
    income: "el monto del ingreso",
    date: "la fecha (YYYY-MM-DD)",
    type: "el tipo de transacción",
    budget_id: "el presupuesto",
  };

  // Configuración especial para budget_id
  if (field === "budget_id") {
    this.isInitialBudgetSelection = (
      this.financeParameters[field] === null || 
      this.financeParameters[field] === undefined
    );
    
    this.chatMessages.push({
      from: "ai",
      text: `Por favor, selecciona ${fieldLabels[field]}:`,
      timestamp: new Date().toLocaleTimeString(),
      isEditable: true,
      fieldKey: field,
      fieldLabel: fieldLabels[field],
      currentValue: this.financeParameters[field],
      editValue: this.financeParameters[field],
      isEditing: true,
      availableBudgets: this.budgets,
    });
    return;
  }

  // Para otros campos
  this.chatMessages.push({
    from: "ai",
    text: `Por favor, ingresa ${fieldLabels[field] || field}:`,
    timestamp: new Date().toLocaleTimeString(),
    isFieldPrompt: true,
    fieldName: field,
    fieldLabel: fieldLabels[field] || field,
  });

  if (field === "type") {
    await this.showTypeOptions();
  } else if (field === "date") {
    this.showDatePicker(field);
  }
},
    
    async saveFieldEdit(index) {
  console.log("saveFieldEdit", index);
  const message = this.chatMessages[index];
  console.log("Mensaje a guardar:", message);
  
  try {
    let valueToValidate = message.editValue;
    
    // Caso especial para budget_id
    if (message.fieldKey === "budget_id" && typeof valueToValidate === 'object' && valueToValidate !== null) {
      valueToValidate = valueToValidate.id;
    }
    
    const validatedValue = this.validateField(message.fieldKey, valueToValidate);
    this.financeParameters[message.fieldKey] = validatedValue;
    
    // Actualizar el texto mostrado
    let displayValue = validatedValue;
    if (message.fieldKey === "budget_id" && typeof message.editValue === 'object' && message.editValue !== null) {
      displayValue = message.editValue.categoryName;
    } else if (message.fieldKey === "spent" || message.fieldKey === "income") {
      displayValue = `$${parseFloat(validatedValue).toFixed(2)}`;
    } else if (message.fieldKey === "date") {
      displayValue = validatedValue;
    }
    
    message.currentValue = validatedValue;
    message.text = `• ${message.fieldLabel}: ${displayValue}`;
    message.isEditing = false;
    this.scrollToBottom();

       if (this.financeDataCollectionMode) {
      // Si estamos en recolección inicial
      if (message.fieldKey === "budget_id") {
        this.isInitialBudgetSelection = false;
      }
      await this.startAutomaticDataCollection();
    } else {
      // Si estamos editando después del resumen
      this.updateFinanceSummary();
    }
    
  } catch (error) {
    this.showAlert("error", error.message, 2000);
    message.editValue = message.currentValue;
    message.isEditing = false;
  }
},

updateFinanceSummary() {
  // Encontrar y eliminar el resumen y confirmación anteriores
   let index = this.chatMessages.length - 1;
  while (index >= 0) {
    const msg = this.chatMessages[index];
    if (msg.text && (
      msg.text.startsWith("Resumen de la transacción financiera") ||
      msg.text.startsWith("¿Deseas crear esta transacción financiera")
    )) {
      this.chatMessages.splice(index, 1);
    }
    index--;
  }
  
  // Volver a llamar a completeFinanceCreation para regenerar el resumen
  this.completeFinanceCreation();
},

completeFinanceCreation() {
  this.isTyping = true;
  this.financeDataCollectionMode = false;

  // Construir mensaje de resumen
  let summary = `Resumen de la transacción financiera:\n\n`;

  // Determinar qué campo de monto mostrar
  let amountToShow = [];
  if (this.financeParameters.spent > 0) {
    amountToShow = [{ key: "spent", label: "Gasto" }];
  } else if (this.financeParameters.income > 0) {
    amountToShow = [{ key: "income", label: "Ingreso" }];
  }

  // Construir la lista de parámetros a mostrar
  const parametersToShow = [
    { key: "type", label: "Tipo" },
    { key: "description", label: "Descripción" },
    ...amountToShow,
    { key: "date", label: "Fecha" },
    ...(this.financeParameters.spent > 0 && this.financeParameters.budget_id ? 
        [{ key: "budget_id", label: "Presupuesto" }] : []),
  ];

  // Agregar cada parámetro al resumen
  parametersToShow.forEach(({ key, label }) => {
    const value = this.financeParameters[key];
    if (value !== null && value !== undefined && value !== '') {
      if (key === "type") {
        const type = this.types.find((t) => t.id === value);
        summary += `• ${label}: ${type?.name || "No especificado"}\n`;
      } else if (key === "spent" || key === "income") {
        summary += `• ${label}: $${parseFloat(value).toFixed(2)}\n`;
      } else if (key === "budget_id") {
        const budget = this.budgets.find((b) => b.id === value);
        summary += `• ${label}: ${budget?.categoryName || `ID: ${value}`}\n`;
      } else {
        summary += `• ${label}: ${value}\n`;
      }
    }
  });

   const hasExistingSummary = this.chatMessages.some(msg => 
    msg.text && msg.text.startsWith("Resumen de la transacción financiera")
  );
   if (!hasExistingSummary) {
  // Mostrar resumen actualizado
  this.chatMessages.push({
    from: "ai",
    text: summary,
    timestamp: new Date().toLocaleTimeString(),
  });

  // Pedir confirmación (si no estamos en modo edición)
  if (!this.isEditingExisting) {
    this.chatMessages.push({
      from: "ai",
      text: "¿Deseas crear esta transacción financiera con los datos proporcionados?",
      timestamp: new Date().toLocaleTimeString(),
      buttons: [
        {
          text: "Cancelar",
          color: "error",
          variant: "outlined",
          action: () => this.handleCancellation('no'),
          props: { class: "mr-2", size: "default" }
        },
        {
          text: "Confirmar y crear",
          color: "primary",
          variant: "flat",
          action: () => this.handleConfirmation('si'),
          props: { size: "default" }
        }
      ]
    });
  }
}

  this.waitingForConfirmation = true;
  this.isTyping = false;
  this.scrollToBottom();
},

    validateField(field, value) {
      console.log("Validando campo:", field, "con valor:", value);
      switch (field) {
        case "date":
          if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) {
            throw new Error("Formato de fecha inválido (YYYY-MM-DD)");
          }
          return value;
        case "spent":
        case "income":  
          const num = parseFloat(value);
          if (isNaN(num) || num < 0) {
            throw new Error("Debe ser un número positivo o cero");
          }
          return num;
        case "type":
          const type = this.types.find(
            (t) => t.name.toLowerCase() === value.toLowerCase() || t.id == value
          );
          if (!type) {
            throw new Error("Tipo no válido");
          }
          return type.id;
        case "budget_id":
          const budgetId = parseInt(value);
          if (isNaN(budgetId) || budgetId <= 0) {
            throw new Error("ID de presupuesto debe ser un número positivo");
          }
          return budgetId;
        default:
          return value;
      }
    },

    // Nuevo método para mostrar opciones de tipo
    async showTypeOptions() {
      this.chatMessages.push({
        from: "ai",
        text: "Selecciona el tipo de transacción:",
        component: "TypeFinanceOptions",
        props: {
          options: this.types,
          selectedId: this.financeParameters.type,
        },
        timestamp: new Date().toLocaleTimeString(),
      });
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
   handleTypeSelection(type) {
      this.financeParameters.type = type.id;

      // Actualizar el mensaje de prioridad existente o crear uno nuevo
      const priorityMessageIndex = this.chatMessages.findIndex(
        (m) => m.from === "ai" && m.component === "TypePersonalOptions"
      );

      if (priorityMessageIndex !== -1) {
        this.chatMessages[priorityMessageIndex].props.selectedId = type.id;
      }

       if (this.isInitialBudgetSelection) {
    this.startAutomaticDataCollection();
  } else {
    // Si estamos editando, actualizar el resumen
    this.updateFinanceSummary();
  }
    },
    showAlert(type, message, timeout) {
      this.sb_type = type;
      this.sb_message = message;
      this.sb_timeout = timeout;
      this.sb_icon = type === "success" ? "mdi-check-circle" : "mdi-alert-circle";
      this.snackbar = true;
    },

    // Maneja la confirmación del usuario
    async handleConfirmation(userResponse) {
      this.waitingForConfirmation = false;

      if (userResponse.toLowerCase() === "si" || userResponse.toLowerCase() === "sí") {
         const fieldsToUpdate = [
          "home_id",
          "spent",
          "income",
          "image",
          "date",
          "description",
          "image",
          "type",
          "method",
        ];

        let updatedFields = Object.keys(this.financeParameters)
          .filter(
            (key) =>
              fieldsToUpdate.includes(key) &&
              this.financeParameters[key] !== this.originalItem[key]
          )
          .reduce((obj, key) => {
            obj[key] = this.financeParameters[key];
            return obj;
          }, {});
        if (Object.keys(updatedFields).length > 0) {
          updatedFields.date = this.financeParameters.date ? this.financeParameters.date : new Date();
          updatedFields.home_id = Number(this.home_id);
          if (this.file) {
            updatedFields.image = this.financeParameters.image;
          }
          const formData = new FormData();
          for (let key in updatedFields) {
            formData.append(key, updatedFields[key]);
          }

          try {
            const result = await handleRequest({
              endpoint: "finance",
              method: "POST",
              data: formData,
            });

            // Manejo de la respuesta según el resultado
            if (result.success) {
              this.chatMessages.push({
                from: "ai",
                text: `✅ ${this.currentFinanceIntent} creado exitosamente!`,
                timestamp: new Date().toLocaleTimeString(),
              });
            }
          } catch (error) {
            this.chatMessages.push({
              from: "ai",
              text: `❌ Error al crear la ${this.currentFinanceIntent}: ${error.message}`,
              timestamp: new Date().toLocaleTimeString(),
            });
          } finally {
            this.isTyping = false;
          }
        } else {
          this.chatMessages.push({
            from: "ai",
            text: "No se realizaron cambios en el gasto o ingreso.",
            timestamp: new Date().toLocaleTimeString(),
          });
        }
      } else {
        this.handleCancellation();
      }

      // Resetear
      this.financeDataCollectionMode = false;
      this.currentFinanceIntent = null;
      this.financeParameters = {};
      this.scrollToBottom();
      this.handleCancellation();
    },
    handleCancellation() {
      this.waitingForConfirmation = false;
      this.financeParameters.people = [];
          this.financeParameters = Object.assign({}, this.defaultItem);
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
          // Limpiar el chat
      this.chatMessages = [];
      
      // Reiniciar todas las variables de estado relacionadas con tareas
      this.financeDataCollectionMode = false;
      this.currentFinanceIntent = null;
      this.isInitialBudgetSelection = false;
      this.financeParameters = {
        type: null,
            spent: null,
            description: null,
            income: null,
            date: null,
            budget_id: null,
      };
      this.waitingForConfirmation = false;
      this.isTyping = false;
      
      // Mensaje inicial del asistente
      this.chatMessages.push({
        from: "ai",
        text: "¡Hola! ¿En qué puedo ayudarte hoy?",
        timestamp: new Date().toLocaleTimeString()
      });
      
      // Asegurarse de que el scroll se actualice
      this.scrollToBottom();
    },

    // Método para cerrar el diálogo
    closeDialog() {
      
      // Opcional: limpiar la conversación
      this.chatMessages = [];
      // Emitir evento para cerrar el diálogo (ajusta según tu implementación)
      this.$emit('close-dialog');
      this.$emit("close-all-dialogs");

    },
    //date y time
    handleDateSelection(field, dateEvent) {
  const { value } = dateEvent;

  // Validar que la fecha sea correcta
  if (!value || !/^\d{4}-\d{2}-\d{2}$/.test(value)) {
    this.showAlert("error", "Formato de fecha inválido (YYYY-MM-DD)", 2000);
    return;
  }

  // Actualizar el valor en financeParameters
  this.financeParameters[field] = value;

  // Actualizar el mensaje en el chat
  const messageIndex = this.chatMessages.findIndex(m => m.fieldKey === field);
  if (messageIndex !== -1) {
    const message = this.chatMessages[messageIndex];
    message.currentValue = value;
    message.editValue = value;
    message.text = `• ${message.fieldLabel}: ${value}`;
    message.isEditing = false;
    message.showDatePicker = false;
  }

  // Si estamos en modo recolección de datos, continuar el flujo
  if (this.isInitialBudgetSelection) {
    this.startAutomaticDataCollection();
  } else {
    // Si estamos editando, actualizar el resumen
    this.updateFinanceSummary();
  }
},
  },
};
</script>

<style scoped>

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
