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
            <div v-for="(message, index) in chatMessages" :key="index" class="d-flex mb-8"
              :class="message.from === 'user' ? 'justify-end' : 'justify-start'">
              <div class="d-flex align-end" :class="message.from === 'user' ? 'flex-row-reverse' : ''">
                <v-avatar v-if="message.from === 'ai'" size="28" class="mb-2 mr-3">
                  <v-img src="@/assets/logo-verde.png" alt="Imagen de perfil" />
                </v-avatar>

                <div class="chat-bubble px-8 py-3 rounded-xl" :class="
                message.from === 'user'
                  ? 'bg-primary text-white'
                  : 'bg-grey-lighten-2 text-black'
              " style="width: 100%; max-width: 100%;">
                  <!-- Campo editable con componente -->
                  <template v-if="message.isEditable && message.isEditing">
                    <!-- Para campos de fecha -->
                    <div v-if="['date'].includes(message.fieldKey)">
                      <v-menu v-model="message.showDatePicker" :close-on-content-click="false"
                        transition="scale-transition" offset-y location="bottom"
                        @update:modelValue="handleMenuClose(message, index)">
                        <template #activator="{ props }">
                          <v-text-field v-bind="props" :model-value="transactionData[message.fieldKey]"
                            :label="message.fieldLabel" variant="outlined" density="comfortable"
                            class="w-100 mt-2 editable-field" no-resize
                            @click:appendInner="message.showDatePicker = true" />
                        </template>
                        <DatePicker :dateValue="transactionData[message.fieldKey]" :fieldType="message.fieldKey"
                          @date-updated="handleDateSelection(message.fieldKey, $event)" />
                      </v-menu>
                    </div>
                    
                    <!-- Para campos de monto -->
                    <v-text-field v-else-if="['spent', 'income'].includes(message.fieldKey)" 
                      v-model="message.editValue" 
                      :label="message.fieldLabel" 
                      variant="outlined"
                      density="comfortable" 
                      class="w-100 mt-2 editable-field" 
                      type="number"
                      :prefix="currencySymbol"
                      :ref="(el) => setTextFieldRef(el, index)" 
                      autofocus 
                      no-resize 
                      @keyup.enter="saveFieldEdit(index)"
                      @blur="saveFieldEdit(index)">
                    </v-text-field>
                    
                    <!-- Para categoría de gasto -->
                    <v-autocomplete v-else-if="message.fieldKey === 'budget_id'"
                      v-model="message.editValue"
                      :items="budgets"
                      :label="message.fieldLabel"
                      item-title="categoryName"
                      item-value="id"
                      variant="outlined"
                      density="comfortable"
                      class="w-100 mt-2 editable-field"
                      :ref="(el) => setTextFieldRef(el, index)"
                      no-resize
                      @keyup.enter="saveFieldEdit(index)"
                      @blur="saveFieldEdit(index)">
                      <template v-slot:item="{ props, item }">
                        <v-list-item v-bind="props">
                          <template v-slot:prepend>
                            <v-avatar size="24">
                              <template v-if="isImage(item.raw.icon)">
                                <img
                                  :src="`${$axios.defaults.baseURL}images/${item.raw.icon}?t=${Date.now()}`"
                                  alt="icon"
                                />
                              </template>
                              <template v-else>
                                <v-icon>{{ getIconName(item.raw.icon) }}</v-icon>
                              </template>
                            </v-avatar>
                          </template>
                          <v-list-item-subtitle class="d-flex flex-column">
                            <div>
                              {{ $t("finances.fields.available") }}:
                              {{ formatCurrency(item.raw.amount - item.raw.used_amount) }}
                            </div>
                            <div>
                              {{ $t("finances.fields.total") }}:
                              {{ formatCurrency(item.raw.amount) }}
                            </div>
                          </v-list-item-subtitle>
                        </v-list-item>
                      </template>
                    </v-autocomplete>
                    
                    <!-- Para tipo (Personal/Hogar) -->
                    <v-select v-else-if="message.fieldKey === 'type'"
                      v-model="message.editValue"
                      :items="['Personal', 'Hogar']"
                      :label="message.fieldLabel"
                      variant="outlined"
                      density="comfortable"
                      class="w-100 mt-2 editable-field"
                      :ref="(el) => setTextFieldRef(el, index)"
                      no-resize
                      @keyup.enter="saveFieldEdit(index)"
                      @blur="saveFieldEdit(index)">
                    </v-select>
                    
                    <!-- Para descripción -->
                    <v-textarea v-else-if="message.fieldKey === 'description'"
                      v-model="message.editValue" 
                      :label="message.fieldLabel" 
                      variant="outlined" 
                      density="comfortable"
                      class="w-100 mt-2 editable-field" 
                      :ref="(el) => setTextFieldRef(el, index)" 
                      autofocus 
                      auto-grow
                      rows="2" 
                      no-resize 
                      @keyup.enter="saveFieldEdit(index)" 
                      @blur="saveFieldEdit(index)">
                    </v-textarea>
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

          <!-- Input -->
          <v-card-actions class="pa-4 bg-white rounded-b-2xl d-flex align-center" style="gap: 12px">
            <!-- Input + texto temporal en un solo bloque -->
            <div style="flex: 1; display: flex; flex-direction: column; overflow: hidden">
              <v-textarea v-model="newMessage" placeholder="Escribe tu mensaje..." variant="outlined"
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
import LocalStorageService from "@/LocalStorageService";
import { handleRequest } from "@/utils/api";

export default {
  components: {
    DatePicker,
  },
  props: {
    initialMessage: {
      type: String,
      default: "",
    },
    transactionData: {
      type: Object,
      default: null,
    },
    budgets: {
      type: Array,
      default: () => [],
    }
  },
  data() {
    return {
      textoTemporal: "",
      escuchando: false,
      recognition: null,
      cargando: false,
      compatible: true,
      transactionDataCollectionMode: false,
      currentTransactionType: null, // 'gasto' o 'ingreso'
      transactionData: {
        spent: 0,
        income: 0,
        date: new Date().toISOString().split('T')[0], // Fecha actual en formato YYYY-MM-DD
        description: "",
        type: "Personal",
        budget_id: null,
      },
      textFieldRefs: [],
      isTyping: false,
      isLoading: false,
      chatMessages: [],
      newMessage: "",
      snackbar: false,
      sb_type: "success",
      sb_message: "",
      sb_timeout: 3000,
      sb_title: "",
      sb_icon: "mdi-check-circle",
      currencySymbol: "$", // Puedes hacerlo dinámico según la configuración
    };
  },
  computed: {
    textoEditable() {
      return this.newMessage + this.textoTemporal;
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

    if (this.transactionData) {
      try {
        this.transactionData = {
          ...this.transactionData,
          date: this.transactionData.date || new Date().toISOString().split('T')[0]
        };
        
        this.currentTransactionType = this.transactionData.spent > 0 ? 'gasto' : 'ingreso';
        this.transactionDataCollectionMode = true;
        
        this.chatMessages.push({
          from: "ai",
          text: `Datos de ${this.currentTransactionType === 'gasto' ? 'gasto' : 'ingreso'} recibidos. Puedes editarlos antes de confirmar.`,
          timestamp: new Date().toLocaleTimeString(),
        });

        await this.showInitialTransactionData(this.transactionData);
      } catch (error) {
        this.showAlert("error", "Error al cargar datos: " + error.message);
      }
    } else if (this.initialMessage) {
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
    formatCurrency(value) {
      return `${this.currencySymbol}${parseFloat(value || 0).toFixed(2)}`;
    },
    isImage(icon) {
      return icon && (icon.endsWith('.png') || icon.endsWith('.jpg') || icon.endsWith('.jpeg'));
    },
    getIconName(icon) {
      return icon || 'mdi-cash';
    },
    handleMenuClose(message, index) {
      if (
        (message.showDatePicker === false) &&
        !this.chatMessages[index].isSaving
      ) {
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
    saveFieldEdit(index) {
      const message = this.chatMessages[index];
      try {
        const validatedValue = this.validateField(message.fieldKey, message.editValue);
        this.transactionData[message.fieldKey] = validatedValue;
        message.currentValue = validatedValue;
        
        // Formatear el texto para mostrar según el campo
        let displayValue = validatedValue;
        if (message.fieldKey === 'date') {
          displayValue = this.formatDateDisplay(validatedValue);
        } else if (['spent', 'income'].includes(message.fieldKey)) {
          displayValue = this.formatCurrency(validatedValue);
        } else if (message.fieldKey === 'budget_id') {
          const budget = this.budgets.find(b => b.id === validatedValue);
          displayValue = budget ? budget.categoryName : "Sin categoría";
        }
        
        message.text = `• ${message.fieldLabel}: ${displayValue}`;
        message.isEditing = false;
        this.scrollToBottom();
      } catch (error) {
        this.showAlert("error", error.message, 2000);
        message.editValue = message.currentValue;
        message.isEditing = false;
      }
    },
    validateField(field, value) {
      switch (field) {
        case 'date':
          if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) {
            throw new Error("Formato de fecha inválido (YYYY-MM-DD)");
          }
          return value;
        case 'spent':
        case 'income':
          const num = parseFloat(value);
          if (isNaN(num) || num <= 0) {
            throw new Error("El monto debe ser un número positivo");
          }
          return num;
        case 'budget_id':
          if (this.currentTransactionType === 'gasto' && !value) {
            throw new Error("Debes seleccionar una categoría para el gasto");
          }
          return value;
        case 'description':
          if (!value || value.trim().length < 3) {
            throw new Error("La descripción debe tener al menos 3 caracteres");
          }
          return value.trim();
        default:
          return value;
      }
    },
    scrollToBottom() {
      this.$nextTick(() => {
        const container = this.$refs.chatBody;
        if (container) container.scrollTop = container.scrollHeight;
      });
    },
    showAlert(type, message, timeout = 3000) {
      this.sb_type = type;
      this.sb_message = message;
      this.sb_timeout = timeout;
      this.sb_icon = type === "success" ? "mdi-check-circle" : "mdi-alert-circle";
      this.snackbar = true;
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
              this.transactionData[lastAIMessage.fieldName] = validatedValue;
              this.chatMessages.push({
                from: "ai",
                text: `✅ ${lastAIMessage.fieldLabel || lastAIMessage.fieldName} guardado: ${validatedValue}`,
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

          if (!this.transactionDataCollectionMode) {
            const response = await handleRequest({
              endpoint: "ask-ai-finance",
              method: "POST",
              data: {
                question: tempMessage,
                issue: "Eres un asistente para gestión de finanzas personales y del hogar.",
              },
            });
            
            if (response.data.intentDetected) {
              this.currentTransactionType = response.data.intent === 'gasto' ? 'gasto' : 'ingreso';
              this.transactionDataCollectionMode = true;
              
              if (response.data.transaction) {
                this.transactionData = {
                  ...this.transactionData,
                  ...response.data.transaction,
                  date: response.data.transaction.date || new Date().toISOString().split('T')[0]
                };
              }
              
              await this.showInitialTransactionData(response.data.transaction || {});
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
    async showInitialTransactionData(transactionData) {
      if (!transactionData) return;
      
      // Mostrar resumen de los datos recibidos
      const fieldsToShow = [
        { key: this.currentTransactionType === 'gasto' ? 'spent' : 'income', 
          label: this.currentTransactionType === 'gasto' ? 'Monto del gasto' : 'Monto del ingreso' },
        { key: 'date', label: 'Fecha' },
        { key: 'description', label: 'Descripción' },
        { key: 'type', label: 'Tipo (Personal/Hogar)' },
      ];
      
      if (this.currentTransactionType === 'gasto') {
        fieldsToShow.push({ key: 'budget_id', label: 'Categoría' });
      }

      // Mostrar campos editables
      fieldsToShow.forEach((field) => {
        const value = transactionData[field.key] || this.transactionData[field.key];
        if (value !== null && value !== undefined) {
          let displayValue = value;
          
          if (field.key === 'date') {
            displayValue = this.formatDateDisplay(value);
          } else if (['spent', 'income'].includes(field.key)) {
            displayValue = this.formatCurrency(value);
          } else if (field.key === 'budget_id') {
            const budget = this.budgets.find(b => b.id === value);
            displayValue = budget ? budget.categoryName : "Sin categoría";
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
            showDatePicker: false,
          });
        }
      });

      // Iniciar recolección automática de datos faltantes
      await this.startAutomaticDataCollection();
    },
    async startAutomaticDataCollection() {
      // Definir el orden de recolección de campos
      const parametersOrder = [
        this.currentTransactionType === 'gasto' ? 'spent' : 'income',
        'description',
        'date',
        'type',
        ...(this.currentTransactionType === 'gasto' ? ['budget_id'] : [])
      ];

      // Encontrar el primer campo que falte
      const nextField = parametersOrder.find(field => {
        const value = this.transactionData[field];
        
        if (field === 'budget_id') {
          return this.currentTransactionType === 'gasto' && !value;
        }
        
        return !value && value !== 0;
      });

      if (nextField === 'budget_id') {
        await this.showBudgetSelector();
      } else if (nextField) {
        this.showFieldInput(nextField);
      } else {
        this.completeTransactionCreation();
      }
    },
    async showFieldInput(field) {
      const fieldLabels = {
        spent: "el monto del gasto",
        income: "el monto del ingreso",
        date: "la fecha (YYYY-MM-DD)",
        description: "una descripción breve",
        type: "el tipo (Personal/Hogar)",
        budget_id: "la categoría del gasto"
      };

      this.chatMessages.push({
        from: "ai",
        text: `Por favor, ingresa ${fieldLabels[field] || field}:`,
        timestamp: new Date().toLocaleTimeString(),
        isFieldPrompt: true,
        fieldName: field,
        fieldLabel: fieldLabels[field] || field,
      });

      if (field === 'date') {
        this.showDatePicker(field);
      } else if (field === 'budget_id') {
        await this.showBudgetSelector();
      }
    },
    async showBudgetSelector() {
      this.isTyping = true;
      
      setTimeout(() => {
        this.chatMessages.push({
          from: "ai",
          text: "Selecciona la categoría para este gasto:",
          timestamp: new Date().toLocaleTimeString(),
          isEditable: true,
          fieldKey: "budget_id",
          fieldLabel: "Categoría",
          currentValue: this.transactionData.budget_id,
          editValue: this.transactionData.budget_id,
          isEditing: true,
        });
        
        this.isTyping = false;
        this.scrollToBottom();
      }, 100);
    },
    handleDateSelection(field, dateEvent) {
      const { value } = dateEvent;
      this.transactionData[field] = value;

      // Actualizar el mensaje correspondiente
      const messageIndex = this.chatMessages.findIndex(m => m.fieldKey === field);
      if (messageIndex !== -1) {
        this.chatMessages[messageIndex].currentValue = value;
        this.chatMessages[messageIndex].editValue = value;
        this.chatMessages[messageIndex].text = `• ${this.chatMessages[messageIndex].fieldLabel}: ${this.formatDateDisplay(value)}`;
        this.chatMessages[messageIndex].isEditing = false;
      }
      
      this.startAutomaticDataCollection();
    },
    completeTransactionCreation() {
      this.isTyping = true;
      
      // Construir mensaje de resumen
      let summary = `Resumen del ${this.currentTransactionType}:\n\n`;
      
      // Agregar campos básicos
      summary += `• ${this.currentTransactionType === 'gasto' ? 'Monto del gasto' : 'Monto del ingreso'}: ${this.formatCurrency(this.currentTransactionType === 'gasto' ? this.transactionData.spent : this.transactionData.income)}\n`;
      summary += `• Fecha: ${this.formatDateDisplay(this.transactionData.date)}\n`;
      summary += `• Descripción: ${this.transactionData.description}\n`;
      summary += `• Tipo: ${this.transactionData.type}\n`;
      
      // Agregar categoría si es gasto
      if (this.currentTransactionType === 'gasto') {
        const budget = this.budgets.find(b => b.id === this.transactionData.budget_id);
        summary += `• Categoría: ${budget ? budget.categoryName : "Sin categoría"}\n`;
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
        text: `¿Deseas registrar este ${this.currentTransactionType} con los datos proporcionados?`,
        timestamp: new Date().toLocaleTimeString(),
        buttons: [
          {
            text: "Cancelar",
            color: "error",
            variant: "outlined",
            action: () => this.handleCancellation(),
            props: {
              class: "mr-2",
              size: "default"
            }
          },
          {
            text: "Confirmar",
            color: "primary",
            variant: "flat",
            action: () => this.handleTransactionConfirmation(),
            props: {
              size: "default"
            }
          }
        ]
      });
      
      this.isTyping = false;
      this.scrollToBottom();
    },
    async handleTransactionConfirmation() {
      try {
        this.isLoading = true;
        
        // Preparar datos para enviar
        const transactionToSend = {
          ...this.transactionData,
          // Asegurarse de que los montos sean números
          spent: parseFloat(this.transactionData.spent || 0),
          income: parseFloat(this.transactionData.income || 0),
          home_id: JSON.parse(LocalStorageService.getItem("home_id")),
          user_id: JSON.parse(LocalStorageService.getItem("user_id")),
        };
        
        // Enviar al backend
        const result = await handleRequest({
          endpoint: "transaction",
          method: "POST",
          data: transactionToSend
        });
        
        if (result.success) {
          this.chatMessages.push({
            from: "ai",
            text: `✅ ${this.currentTransactionType === 'gasto' ? 'Gasto' : 'Ingreso'} registrado exitosamente!`,
            timestamp: new Date().toLocaleTimeString(),
          });
          
          // Emitir evento para notificar al componente padre
          this.$emit('transaction-created', result.data);
          
          // Resetear el chat
          this.handleCancellation();
        } else {
          throw new Error(result.message || "Error al registrar");
        }
      } catch (error) {
        this.chatMessages.push({
          from: "ai",
          text: `❌ Error al registrar el ${this.currentTransactionType}: ${error.message}`,
          timestamp: new Date().toLocaleTimeString(),
        });
      } finally {
        this.isLoading = false;
        this.scrollToBottom();
      }
    },
    handleCancellation() {
      // Resetear datos de transacción
      this.transactionData = {
        spent: 0,
        income: 0,
        date: new Date().toISOString().split('T')[0],
        description: "",
        type: "Personal",
        budget_id: null,
      };
      
      this.transactionDataCollectionMode = false;
      this.currentTransactionType = null;
      
      // Preguntar qué hacer ahora
      this.chatMessages.push({
        from: "ai",
        text: "¿Qué deseas hacer ahora?",
        timestamp: new Date().toLocaleTimeString(),
        buttons: [
          {
            text: "Registrar gasto",
            color: "primary",
            variant: "outlined",
            action: () => this.startNewTransaction('gasto'),
            props: {
              class: "mr-2",
              size: "default"
            }
          },
          {
            text: "Registrar ingreso",
            color: "primary",
            variant: "outlined",
            action: () => this.startNewTransaction('ingreso'),
            props: {
              size: "default"
            }
          },
          {
            text: "Salir",
            color: "grey",
            variant: "text",
            action: () => this.closeDialog(),
            props: {
              size: "default"
            }
          }
        ]
      });
      
      this.scrollToBottom();
    },
    startNewTransaction(type) {
      this.currentTransactionType = type;
      this.transactionDataCollectionMode = true;
      
      // Limpiar mensajes anteriores
      this.chatMessages = [];
      
      // Mostrar mensaje inicial
      this.chatMessages.push({
        from: "ai",
        text: `Vamos a registrar un nuevo ${type}. Por favor proporcióname los siguientes datos:`,
        timestamp: new Date().toLocaleTimeString(),
      });
      
      // Iniciar recolección de datos
      this.startAutomaticDataCollection();
    },
    closeDialog() {
      this.$emit('close-dialog');
    }
  }
};
</script>

<style scoped>
.editable-field {
  width: 100%;
  min-width: 100%;
}

.v-textarea .v-field,
.v-text-field .v-field,
.v-autocomplete .v-field,
.v-select .v-field {
  width: 100% !important;
}

.v-input__control {
  width: 100%;
}

.v-field__input {
  width: 100%;
}

.chat-bubble {
  width: 100%;
  min-width: 100%;
  display: block !important;
  word-break: break-word;
  font-size: 15px;
  line-height: 1.4;
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

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

.editable-message {
  cursor: pointer;
  transition: background-color 0.2s;
}

.editable-message:hover {
  background-color: rgba(0, 0, 0, 0.05);
}
</style>