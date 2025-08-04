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
            <div v-for="(message, index) in chatMessages" :key="index" class="d-flex mb-8"
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
                  <!-- Campo editable (modo edición) -->
                  <template v-if="message.isEditable && message.isEditing">

                    <!-- Campos de fecha -->
                    <div v-if="['purchase_date', 'expiration_date'].includes(message.fieldKey)">
                      <v-menu v-model="message.showDatePicker" :close-on-content-click="false"
                        transition="scale-transition" offset-y location="bottom"
                        @update:modelValue="handleMenuClose(message, index)">
                        <template #activator="{ props }">
                          <v-text-field v-bind="props" :model-value="productParameters[message.fieldKey]"
                            :label="message.fieldLabel" variant="outlined" density="comfortable"
                            style="width: auto; min-width: 10em" no-resize
                            @click:appendInner="message.showDatePicker = true" />
                        </template>

                        <DatePicker :dateValue="productParameters[message.fieldKey]" :fieldType="message.fieldKey"
                          @date-updated="
                        handleDateSelection(message.fieldKey, $event)
                      " />
                      </v-menu>
                    </div>

                    <!-- Selector de categoría -->
                    <div v-if="message.fieldKey === 'category_id'">
                      <v-autocomplete v-model="message.editValue" :items="message.availableCategories || categories"
                        :label="message.fieldLabel" item-title="nameCategory" item-value="id" variant="outlined"
                        density="comfortable" style="width: auto; min-width: 20em" return-object hide-details
                        @update:modelValue="onCategorySelected(index, $event)" @blur="onCategoryBlur(index)"
                        @click:clear="onCategoryClear(index)">
                        <!-- Templates de item y selection (mantener igual) -->
                        <template v-slot:item="{ props, item }">
                          <v-list-item v-bind="props">
                            <template v-slot:prepend>
                              <v-avatar size="24">
                                <template v-if="isImage(item.raw.iconCategory)">
                                  <img :src="`${$axios.defaults.baseURL}images/${
                                item.raw.iconCategory
                              }?t=${Date.now()}`" alt="icon" />
                                </template>
                                <template v-else>
                                  <v-icon>{{
                                    getIconName(item.raw.iconCategory)
                                    }}</v-icon>
                                </template>
                              </v-avatar>
                            </template>
                            <v-list-item-subtitle class="d-flex flex-column">
                              <div>Descripción: {{ item.raw.descriptionCategory }}</div>
                            </v-list-item-subtitle>
                          </v-list-item>
                        </template>
                        <template v-slot:selection="{ item }">
                          <div class="d-flex align-center">
                            <v-avatar size="20" start>
                              <template v-if="isImage(item.raw.iconCategory)">
                                <img :src="`${$axios.defaults.baseURL}images/${
                              item.raw.iconCategory
                            }?t=${Date.now()}`" alt="icon" />
                              </template>
                              <template v-else>
                                <v-icon small>{{
                                  getIconName(item.raw.iconCategory)
                                  }}</v-icon>
                              </template>
                            </v-avatar>
                            <span>{{ item.raw.nameCategory }}</span>
                          </div>
                        </template>
                      </v-autocomplete>
                    </div>
                    <div v-if="message.fieldKey === 'status_id'">
                    <v-autocomplete
                      v-model="message.editValue" :items="message.availableStatus || status"
                        :label="message.fieldLabel" item-title="nameStatus" item-value="id" variant="outlined"
                        density="comfortable" style="width: auto; min-width: 20em" return-object hide-details
                        @update:modelValue="onStatusSelected(index, $event)" @blur="onStatusBlur(index)"
                        @click:clear="onStatusClear(index)"
                    >
                      <template v-slot:item="{ props, item }">
                        <v-list-item v-bind="props">
                          <template v-slot:prepend>
                            <v-avatar size="24">
                              <v-icon>{{ item.raw.iconStatus }}</v-icon>
                            </v-avatar>
                          </template>
                        </v-list-item>
                      </template>
                    </v-autocomplete>
                    </div>
                    <!-- Textarea para campos largos -->
                    <v-textarea v-else-if="['title', 'additional_notes', 'purchase_place'].includes(message.fieldKey)"
                      v-model="message.editValue" :label="message.fieldLabel" variant="outlined" density="comfortable"
                      style="width: auto; min-width: 50em" :ref="(el) => setTextFieldRef(el, index)" autofocus auto-grow
                      rows="2" no-resize @keyup.enter="saveFieldEdit(index)" @blur="saveFieldEdit(index)"></v-textarea>

                    <!-- Textfield estándar -->
                    <v-text-field v-else v-model="message.editValue" :label="message.fieldLabel" variant="outlined"
                      density="comfortable" style="width: auto; min-width: 10em"
                      :ref="(el) => setTextFieldRef(el, index)" autofocus no-resize @keyup.enter="saveFieldEdit(index)"
                      @blur="saveFieldEdit(index)"></v-text-field>
                  </template>

                  <!-- Resto del código permanece igual -->
                  <template v-else>
                    <div v-if="!message.buttons" @click="message.isEditable ? startFieldEdit(index) : null"
                      :class="{ 'editable-message': message.isEditable }"
                      style="white-space: pre-wrap; word-break: break-word" class="d-flex align-center">
                      {{ message.text }}
                      <v-icon v-if="message.isEditable" x-small class="ml-2">
                        mdi-pencil
                      </v-icon>
                    </div>

                    <!-- Mensaje con botones -->
                    <div v-else>
                      <div style="
                  white-space: pre-wrap;
                  word-break: break-word;
                  margin-bottom: 12px;
                ">
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
                    v-bind="message.props" @date-updated="updateDate($event)" />
                </div>
              </div>
            </div>

            <!-- El resto de tu código permanece igual -->
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

          <!-- Input de mensaje -->
          <v-card-actions class="pa-4 bg-white rounded-b-2xl d-flex align-center" style="gap: 12px">
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

            <v-btn color="primary" @click="toggleDictado" :disabled="!compatible" :loading="cargando"
              :icon="escuchando ? 'mdi-microphone-off' : 'mdi-microphone'" :title="
        !compatible ? 'Reconocimiento de voz no compatible con tu navegador' : ''
      "></v-btn>

            <v-btn icon="mdi-send" color="primary" @click="sendMessage" />
          </v-card-actions>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
    <v-dialog v-model="dialogChatTask" fullscreen transition="dialog-bottom-transition">
    <v-card>
      <v-card-text>
        <!-- Pasamos los parámetros al componente ChatTask -->
        <ChatTask :taskData="currentTask" @close-dialog="closeDialgChat()"   @close-all-dialogs="handleCloseAll($event)" />
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
        <ChatFinance :financeData="currentFinance" :transactionIntent="currentIntentFinance" @close-dialog="closeDialgChat()" @close-all-dialogs="$emit('close-all-dialogs')" />
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
          @close-all-dialogs="$emit('close-all-dialogs')" />
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
import { handleRequest } from "@/utils/api";
import _ from "lodash";
import { defineAsyncComponent, markRaw } from "vue";
import DatePicker from "@/components/chatTask/DatePicker.vue";
import TypePersonalOptions from "@/components/chatTask/TypePersonalOptions.vue";
import PeriodOptions from "@/components/chatTask/PeriodOptions.vue";


export default {
 emits: ["close-dialog", "close-all-dialogs"],
  props: {
    initialMessage: {
      type: String,
      default: "",
    },
    productData: {
      type: Object,
      default: null,
    },
  },
  components: {
    DatePicker,
    TypePersonalOptions,
    PeriodOptions,
    ChatFinance: defineAsyncComponent(() => import('./ChatFinance.vue')),
    ChatTask: defineAsyncComponent(() => import('./ChatTask.vue')),
    ChatWarehouse: defineAsyncComponent(() => import('./ChatWarehouse.vue')),
  },
  data() {
    return {
      shownChatFields: new Set(),
       dialogChatTask: false,
      dialogChatFinance: false,
      dialogChatWarehouse: false,
      currentTask: null,
      currentFinance: null,
      currentWarehouse: null,
      currentIntentFinance: null,
      isInitialCategorySelection: false,
      isInitialStatusSelection: false,
      isInitialWarehouseSelection: false,
      textoTemporal: "",
      productDataCollectionMode: false,
      currentIntent: null,
      editingField: null,
      escuchando: false,
      recognition: null,
      cargando: false,
      compatible: true,
      tools: [],
      productParameters: {
         name: null,
        quantity: null,
        unit_price: null,
        total_price: null,
        purchase_place: null,
        purchase_date: null,
        expiration_date: null,
        additional_notes: null,
        warehouse_id: null,
        category_id: null,
        status_id: null
      },
      originalItem: {
        name: null,
        quantity: null,
        unit_price: null,
        total_price: null,
        purchase_place: null,
        purchase_date: null,
        expiration_date: null,
        additional_notes: null,
        warehouse_id: null,
        category_id: null,
        status_id: null
      },
      defaultItem: {
        name: null,
        quantity: null,
        unit_price: null,
        total_price: null,
        purchase_place: null,
        purchase_date: null,
        expiration_date: null,
        additional_notes: null,
        warehouse_id: null,
        category_id: null,
        status_id: null
      },
      textFieldRefs: [],
      currentParameterIndex: 0,
      waitingForConfirmation: false,
      warehouses: [],
      categories: [],
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
    let productData = this.productData;

    // Si es string, parsearlo
    if (typeof productData === "string") {
      try {
        productData = JSON.parse(productData);
      } catch (error) {
        console.error("Error parsing productData:", error);
        return;
      }
    }

    console.log("Datos recibidos del componente padre (productData):", productData);
    this.name = JSON.parse(LocalStorageService.getItem("name"));
    this.user = JSON.parse(LocalStorageService.getItem("user"));
    this.user_id = JSON.parse(LocalStorageService.getItem("user_id"));
    this.home_id = JSON.parse(LocalStorageService.getItem("home_id"));
    this.imageUrl = LocalStorageService.getItem("image").replace(/['"]+/g, "");
    if (this.productData) {
      try {
        // Copiar los datos de la tarea
        this.productParameters = {
          ...this.productParameters,
          ...productData,
        };
        this.productDataCollectionMode = true;
        //this.currentTransactionType = this.productData.spent > 0 ? 'gasto' : 'ingreso';
        this.currentIntent = "Producto";
        // Mostrar en el chat
        // ✅ Validar que el campo 'amount' sea válido (> 0)
    const amountValue = this.productData.quantity;

    if (amountValue === null || amountValue === undefined || amountValue <= 0) {
      // ❌ Monto no válido → advertir y reiniciar flujo
      this.chatMessages.push({
        from: "ai",
        text: `Detecté que deseas registrar un ${this.currentIntent}, pero no se ha proporcionado una cantidad válida. Por favor, podrías especificar mejor lo que deseas hacer.`,
        timestamp: new Date().toLocaleTimeString(),
      });

      // Reiniciar estado para evitar datos parciales
       this.productDataCollectionMode = false;
      this.currentIntent = null;
      this.productParameters = {
        name: null,
        quantity: null,
        unit_price: null,
        total_price: null,
        purchase_place: null,
        purchase_date: null,
        expiration_date: null,
        additional_notes: null,
        warehouse_id: null,
        category_id: null,
        status_id: null
      };
      this.waitingForConfirmation = false;
      this.isTyping = false;

      // Aquí puedes llamar a un método que inicie el flujo de presupuesto desde cero
      // await this.startBudgetCollection(); // opcional
    } else {
        await this.loadRequiredData();
      // ✅ Monto válido → mostrar confirmación y resumen
      this.chatMessages.push({
        from: "ai",
        text: `Datos del ${this.currentIntent} recibidos. Puedes editarlos antes de confirmar.`,
        timestamp: new Date().toLocaleTimeString(),
      });

      // Iniciar flujo de edición/resumen
      await this.showInitialData(this.productData);
    }
      } catch (error) {
        this.showAlert("error", "Error al cargar datos: " + error.message);
      }
    } else if (this.initialMessage) {
      // Si no hay productData, pero hay initialMessage, simular envío
      this.newMessage = this.initialMessage;
      this.sendMessage();
    }
  },
  methods: {
     handleCloseAll(sourceComponent) {
      console.log(`Evento de cierre iniciado por: ${sourceComponent}`);
      // Puedes hacer lógica específica según el origen si lo necesitas
      this.$emit("close-all-dialogs", sourceComponent);
    },
    closeDialgChat() {
      this.dialogChatTask = false;
      this.dialogChatFinance = false;
      this.dialogChatBudget = false;
      this.dialogChatWarehouse = false;
      this.texto = "";
      this.textoTemporal = "";
      this.currentTask = null;
      this.currentFinance = null;
      this.currentBudget = null;
      this.currentWarehouse = null;
      this.$emit("close-all-dialogs", "ChatProduct");
      //this.initialize();
    },
    isImage(icon) {
      // Validar si el valor es una URL válida (puedes personalizar esta lógica)
      return (
        typeof icon === "string" &&
        (icon.startsWith("http") || /\.(png|jpe?g|gif|svg|webp)$/i.test(icon))
      );
    },
    getIconName(icon) {
      if (!icon) return "mdi-help-circle"; // Ícono por defecto si no hay valor
      // Si el ícono tiene el prefijo "MdiIcons.", extraer solo el nombre
      if (icon.startsWith("MdiIcons.")) {
        return `mdi-${icon.split(".")[1].toLowerCase()}`;
      }
      // Si el ícono ya está en formato "mdi-*", devolverlo tal cual
      if (icon.startsWith("mdi-")) {
        return icon;
      }
      // En otros casos, devolver un ícono por defecto
      return "mdi-help-circle";
    },
    onCategorySelected(index, selectedBudget) {
      console.log("Categoría seleccionada:", selectedBudget);
      this.chatMessages[index].editValue = selectedBudget;
      
      // Si es selección inicial, guardar inmediatamente
      if (this.isInitialCategorySelection) {
        this.saveFieldEdit(index);
      }
      // Si es edición, esperará a blur o acción explícita
    },
    onStatusSelected(index, selectedStatus) {
      console.log("Estado seleccionada:", selectedStatus);
      this.chatMessages[index].editValue = selectedStatus;
      
      // Si es selección inicial, guardar inmediatamente
      if (this.isInitialStatusSelection) {
        this.saveFieldEdit(index);
      }
      // Si es edición, esperará a blur o acción explícita
    },
    onCategoryBlur(index) {
      setTimeout(() => {
        const message = this.chatMessages[index];
        if (message && message.isEditing) {
          // Solo guardar si no es selección inicial (ya que esa se maneja en onCategorySelected)
          if (!this.isInitialCategorySelection) {
            this.saveFieldEdit(index);
          }
        }
      }, 200);
    },

    onStatusBlur(index) {
      setTimeout(() => {
        const message = this.chatMessages[index];
        if (message && message.isEditing) {
          // Solo guardar si no es selección inicial (ya que esa se maneja en onCategorySelected)
          if (!this.isInitialStatusSelection) {
            this.saveFieldEdit(index);
          }
        }
      }, 200);
    },

    onCategoryClear(index) {
      console.log("Selección de la categoría limpiada");
      const message = this.chatMessages[index];
      // Establecer editValue a null
      message.editValue = null;
      // Guardar inmediatamente el valor null
      if (!this.isInitialCategorySelection) {
            this.saveFieldEdit(index);
          }
    },
    onStatusClear(index) {
      console.log("Selección del estado limpiada");
      const message = this.chatMessages[index];
      // Establecer editValue a null
      message.editValue = null;
      // Guardar inmediatamente el valor null
     if (!this.isInitialStatusSelection) {
            this.saveFieldEdit(index);
          }
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

    setTextFieldRef(el, index) {
      this.textFieldRefs[index] = el;
    },
    startFieldEdit(index) {
      this.chatMessages[index].isEditing = true;
      this.chatMessages[index].editValue = this.chatMessages[index].currentValue;

      if (["purchase_date", "expiration_date"].includes(this.chatMessages[index].fieldKey)) {
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

    handleMenuClose(message, index) {
      if (
        (message.showDatePicker === false || message.showTimePicker === false) &&
        !this.chatMessages[index].isSaving
      ) {
        // Cuando el menú se cierra (click fuera)
        this.saveFieldEdit(index);
      }
    },
    async saveFieldEdit(index) {
      console.log("saveFieldEdit", index);
      const message = this.chatMessages[index];
      console.log("Mensaje a guardar:", message);
      
      try {
        let valueToValidate = message.editValue;

        // Caso especial para category_id
        if (message.fieldKey === "category_id" && typeof valueToValidate === "object" && valueToValidate !== null) {
          valueToValidate = valueToValidate.id;
        }

        if (message.fieldKey === "warehouse_id" && typeof valueToValidate === "object" && valueToValidate !== null) {
          valueToValidate = valueToValidate.id;
        }

        if (message.fieldKey === "status_id" && typeof valueToValidate === "object" && valueToValidate !== null) {
          valueToValidate = valueToValidate.id;
        }

        const validatedValue = this.validateField(message.fieldKey, valueToValidate);
        this.productParameters[message.fieldKey] = validatedValue;

        // Actualizar el texto mostrado
        let displayValue = validatedValue;
        if (message.fieldKey === "category_id" && typeof message.editValue === "object" && message.editValue !== null) {
          displayValue = message.editValue.nameCategory;
        }

        if (message.fieldKey === "status_id" && typeof message.editValue === "object" && message.editValue !== null) {
          displayValue = message.editValue.nameStatus	;
        }

        if (message.fieldKey === "warehouse_id" && typeof message.editValue === "object" && message.editValue !== null) {
          displayValue = message.editValue.title	;
        }

        message.currentValue = validatedValue;
        message.text = `• ${message.fieldLabel}: ${displayValue}`;
        message.isEditing = false;
        // 🔥 Recalcular total_price si se editó quantity o unit_price
    if (["quantity", "unit_price"].includes(message.fieldKey)) {
      const quantity = parseFloat(this.productParameters.quantity) || 0;
      const unitPrice = parseFloat(this.productParameters.unit_price) || 0;
      const totalPrice = (quantity * unitPrice).toFixed(2); // Ajusta decimales según necesidad

      // Actualizar parámetro
      this.productParameters.total_price = parseFloat(totalPrice);

      // Buscar el mensaje de total_price y actualizarlo
      const totalMessageIndex = this.chatMessages.findIndex(m => m.fieldKey === "total_price");
      if (totalMessageIndex !== -1) {
        const totalMsg = this.chatMessages[totalMessageIndex];
        totalMsg.currentValue = parseFloat(totalPrice);
        totalMsg.text = `• ${totalMsg.fieldLabel}: ${totalPrice}`;
        totalMsg.editValue = parseFloat(totalPrice);
      }
    }
        this.scrollToBottom();

         const shouldContinueFlow = 
          (message.fieldKey === "category_id" && this.isInitialCategorySelection) ||
          (message.fieldKey !== "category_id" && this.isInitialDataCollection);
        
        if (shouldContinueFlow) {
          if (message.fieldKey === "category_id") {
            this.isInitialCategorySelection = false; // Marcar que ya no es la primera selección
          }
          await this.startAutomaticDataCollection();
        } else if (!this.productDataCollectionMode) {
          // Si estamos en modo edición (después de completeCreation)
          // Actualizar el mensaje de resumen si existe
          this.updateSummaryMessage();
        }
      } catch (error) {
        this.showAlert("error", error.message, 2000);
        message.editValue = message.currentValue;
        message.isEditing = false;
      }
    },

    // Añade este nuevo método
    updateSummaryMessage() {
      const summaryIndex = this.chatMessages.findIndex(msg => msg.isSummary);
      if (summaryIndex !== -1) {
        const newSummary = this.generateSummary();
        this.chatMessages[summaryIndex].text = newSummary;
        
        // También actualizar el mensaje individual del campo editado
        const fieldKey = this.chatMessages.find(m => m.isEditing)?.fieldKey;
        if (fieldKey) {
          const fieldMessageIndex = this.chatMessages.findIndex(
            m => m.fieldKey === fieldKey && !m.isEditing
          );
          if (fieldMessageIndex !== -1) {
            const fieldMessage = this.chatMessages[fieldMessageIndex];
            const displayValue = this.getDisplayValueForField(fieldKey);
            fieldMessage.text = `• ${fieldMessage.fieldLabel}: ${displayValue}`;
            fieldMessage.currentValue = this.productParameters[fieldKey];
          }
        }
      }
    },

    // Método auxiliar para obtener valores mostrados
    getDisplayValueForField(fieldKey) {
      const value = this.productParameters[fieldKey];
      if (fieldKey === "category_id") {
        const category = this.categories.find(b => b.id === value);
        return category?.nameCategory || `ID: ${value}`;
      } else if (fieldKey === "status_id") {
        const type = this.status.find(t => t.id === value);
        return type?.nameStatus || `ID: ${value}`;
      }else if (fieldKey === "warehouse_id") {
        const type = this.warehouses.find(t => t.id === value);
        return type?.title || `ID: ${value}`;
      }
      return value;
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
          /*const lastAIMessage = this.chatMessages
            .slice()
            .reverse()
            .find((m) => m.from === "ai" && m.isFieldPrompt);
          if (lastAIMessage) {
            try {
              const validatedValue = this.validateField(
                lastAIMessage.fieldName,
                tempMessage
              );
              this.productParameters[lastAIMessage.fieldName] = validatedValue;
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
          }*/

          if (this.waitingForConfirmation) {
            await this.handleConfirmation(tempMessage);
            return;
          }

          if (!this.productDataCollectionMode) {
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
        const { intentDetected, intent, task, answer, finances, budget, warehouse } = response.data;

            if (intentDetected && intent) {
              this.data = { home_id: this.home_id };
              switch (intent) {
            case "Tarea":
              this.currentTask = null;
              this.$nextTick(() => {
                const taskData =
                  typeof task === "string"
                    ? JSON.parse(task)
                    : task;

                this.currentTask = _.cloneDeep(taskData);
                this.dialogChatTask = true;
                this.scrollToBottom();
              });
              break;

            case "Meta":
              this.currentTask = null;
              this.$nextTick(() => {
                const taskData =
                  typeof task === "string"
                    ? JSON.parse(task)
                    : task;

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
                 if(Number(financeData.spent) <= 0)
                {
                this.chatMessages.push({
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
                 if(Number(financeData.income) <= 0)
                {
                this.chatMessages.push({
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
              this.$nextTick(async () => {
                  this.productParameters = {
                    ...this.productParameters,
                    ...budget,
                  };
                if (Number(this.productParameters.amount) <= 0){
                      this.chatMessages.push({
                        from: "ai",
                        text:
                          /*answer ||*/
                          "Detecte que desea registrar un presupuesto pero no especificaste el monto, podrías ser mas especifico",
                        timestamp: new Date().toLocaleTimeString(),
                      });
                    }else{
                  this.currentIntent = intent;
                  this.productDataCollectionMode = true;
                  this.chatMessages.push({
                    from: "ai",
                    text: `Datos del  ${this.currentIntent} recibidos. Puedes editarlos antes de confirmar.`,
                    timestamp: new Date().toLocaleTimeString(),
                  });
                  await this.loadRequiredData();
                  await this.showInitialData(budget);
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
              this.chatMessages.push({
                from: "ai",
                text: response.data.answer,
                timestamp: new Date().toLocaleTimeString(),
              });
            }
            
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
          endpoint: "productcategory-productstatus-apk",
          method: "POST",
          data: this.data
        });

        if (result.success) {
          this.categories = result.data.productcategories || [];
          this.status = result.data?.productstatus || [];
          this.warehouses = result.data?.productwarehouses || [];
        } else {
          this.categories = [];
          this.status = [];
          this.warehouses = [];
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
    async showInitialData(productData) {
      if (!productData) return;
            this.isInitialCategorySelection = (
        productData.category_id === null || 
        productData.category_id === undefined
      );
      this.isInitialStatusSelection = (
        productData.status_id === null || 
        productData.status_id === undefined
      );

      this.isInitialWarehouseSelection = (
        productData.warehouse_id === null || 
        productData.warehouse_id === undefined
      );
      
      this.isInitialDataCollection = !productData;
          await this.showSummary(productData);
          await this.startAutomaticDataCollection();
    },
    async showSummary(productData) {
          // Definir los campos a mostrar, excluyendo spent/income mutuamente y budget_id condicionalmente
      const fieldsToShow = [
        { key: "name", label: "Nombre del producto" },
        { key: "quantity", label: "Cantidad" },
        { key: "unit_price", label: "Precio unitario" },
        { key: "total_price", label: "Importe total" },
        { key: "purchase_place", label: "Lugar de compra" },
        { key: "purchase_date", label: "Fecha de compra" },
        { key: "expiration_date", label: "Fecha de vencimiento" },
        { key: "additional_notes", label: "Notas adicionales" },
        { key: "status_id", label: "Estado del producto" },
        { key: "category_id", label: "Categoría" },
        { key: "warehouse_id", label: "Almacén asociado" },
      ];
      // Mostrar campos normales como texto
      fieldsToShow.forEach((field) => {
        const value = productData[field.key];
        if (value !== null && value !== undefined && value !== "") {
          let displayValue = value;
          let additionalData = {}; // Para pasar datos adicionales necesarios para la edición

          if (field.key === "category_id") {
            // Buscar el nombre del presupuesto para mostrar
            const categoryInfo = this.categories.find((b) => b.id === value);
            displayValue = categoryInfo ? `${categoryInfo.nameCategory}` : `ID: ${value}`;
            // Pasar los budgets disponibles para la edición con autocomplete
            additionalData.availableCategories = this.categories;
          }

          if (field.key === "warehouse_id") {
            // Buscar el nombre del presupuesto para mostrar
            const warehouse = this.warehouses.find((b) => b.id === value);
            displayValue = warehouse ? `${warehouse.title}` : `ID: ${value}`;
            // Pasar los budgets disponibles para la edición con autocomplete
            additionalData.availableWarehouses = this.warehouses;
          }

          if (field.key === "status_id") {
            // Buscar el nombre del presupuesto para mostrar
            const status = this.status.find((b) => b.id === value);
            displayValue = status ? `${status.nameStatus}` : `ID: ${value}`;
            // Pasar los budgets disponibles para la edición con autocomplete
            additionalData.availableStatus = this.status;
          }

          // Añadir excepción para total_price
          const isEditable = field.key !== "total_price"; // No editable

          this.chatMessages.push({
            from: "ai",
            text: `• ${field.label}: ${displayValue}`, // Usar displayValue formateado
            timestamp: new Date().toLocaleTimeString(),
            isEditable,
            fieldKey: field.key,
            fieldLabel: field.label,
            currentValue: value, // Valor real para guardar
            editValue: value, // Valor para edición
            isEditing: false,
            showDatePicker: false,
            ...additionalData, // Añadir datos adicionales si es budget_id
          });
          this.shownChatFields.add(field.key);
        }
      });
    },
    /*async startAutomaticDataCollection() {
      const parametersOrder = [
         "name",
        "quantity",
        "unit_price",
        "total_price",
        "purchase_place", // Ahora se pedirá la recurrencia
        "purchase_date",
        "category_id",
        "expiration_date",
        "additional_notes",
        "warehouse_id",
        "status_id",
      ];

      const nextField = parametersOrder.find((field) => {
        const value = this.productParameters[field];

        return !value && value !== 0;
      });

      console.log("nextField");
      console.log(nextField);
       if (this.shownChatFields.has(nextField)) {
        return;
      }

      // Marcar como mostrado ANTES de mostrar el mensaje
      this.shownChatFields.add(nextField);
       /*if (nextField === 'category_id' && !this.isInitialCategorySelection) {
        this.completeCreation(); // Saltar a confirmación
      } else if (nextField === "type_id") {
        await this.showPeriodOptions();
      }else if (nextField === "budget_type") {
        await this.showTypeOptions();
      }*//*if (nextField) {
        this.showFieldInput(nextField);
      } else {
        this.completeCreation();
      }
    },*/
    async startAutomaticDataCollection() {
  const parametersOrder = [
    "name",
    "quantity",
    "unit_price",
    "total_price",
    "purchase_place",
    "purchase_date",
    "status_id",
    "category_id",
    "expiration_date",
    "additional_notes",
    "warehouse_id",
  ];

  // Buscar el primer campo no completado
  const nextField = parametersOrder.find(field => {
    const value = this.productParameters[field];
    return (value === null || value === undefined || value === "") && !this.shownChatFields.has(field);
  });

  if (nextField) {
    this.showFieldInput(nextField);
  } else {
    this.completeCreation();
  }
},
    async showFieldInput(field) {
      const fieldLabels = {
         name: "el nombre del producto",
                quantity: "la cantidad",
                unit_price: "el precio unitario",
                total_price: "el precio total",
                purchase_place: "el lugar de compra",
                purchase_date: "la fecha de compra (YYYY-MM-DD)",
                expiration_date: "la fecha de vencimiento (YYYY-MM-DD)",
                additional_notes: "notas adicionales",
                warehouse_id: "el almacén de almacenamiento",
                category_id: "la categoría del producto",
                status_id: "el estado del producto"
      };
       let additionalData = {};
      if (field === "category_id") {
        this.isInitialCategorySelection = (
          this.productParameters[field] === null || 
          this.productParameters[field] === undefined
        );
        additionalData.availableCategories = this.categories; 
        this.chatMessages.push({
          from: "ai",
          text: `Por favor, selecciona la ${fieldLabels[field] || field}:`,
          timestamp: new Date().toLocaleTimeString(),
          isEditable: true,
          fieldKey: field,
          fieldLabel: fieldLabels[field] || field,
          currentValue: this.productParameters[field], // Puede ser null
          editValue: this.productParameters[field],   // Puede ser null
          isEditing: true, // Iniciar en modo edición directamente
          showDatePicker: false,
          ...additionalData, // Pasar las categorías para el autocomplete
        });
        return; // Salir para no ejecutar el código posterior
      }

      if (field === "status_id") {
        // Verificar si es la primera vez (valor null/undefined)
        this.isInitialStatusSelection = (
          this.productParameters[field] === null || 
          this.productParameters[field] === undefined
        );
          // Si es la primera vez, mostrar el mensaje de selección
        this.chatMessages.push({
          from: "ai",
          text: `Por favor, selecciona el ${fieldLabels[field] || field}:`,
          timestamp: new Date().toLocaleTimeString(),
          isEditable: true,
          fieldKey: field,
          fieldLabel: fieldLabels[field] || field,
          currentValue: this.productParameters[field], // Puede ser null
          editValue: this.productParameters[field],   // Puede ser null
          isEditing: true, // Iniciar en modo edición directamente
          showDatePicker: false,
          availableStatus: this.status, // Pasar las categorías para el autocomplete
        });
        return; // Salir para no ejecutar el código posterior
      }
        // Caso 3: purchase_date o expiration_date → mostrar datepicker directamente
      if (field === "purchase_date" || field === "expiration_date") {
        this.chatMessages.push({
          from: "ai",
          text: `Selecciona ${fieldLabels[field]}:`,
          timestamp: new Date().toLocaleTimeString(),
          isEditable: true,
          fieldKey: field,
          fieldLabel: fieldLabels[field],
          currentValue: this.productParameters[field] || "",
          editValue: this.productParameters[field] || "",
          isEditing: true, // Para activar el componente visual
          showDatePicker: true, // ← ¡Aquí activas el menú del datepicker!
        });
        return;
      }
      else {
  // Para campos de texto normales
  this.chatMessages.push({
    from: "ai",
    text: `Por favor, ingresa ${fieldLabels[field] || field}:`,
    timestamp: new Date().toLocaleTimeString(),
    isEditable: true,
    fieldKey: field,
    fieldLabel: fieldLabels[field] || field,
    currentValue: this.productParameters[field] || "",
    editValue: this.productParameters[field] || "",
    isEditing: true // Activar edición directamente
  });
}

      /*if (field === "budget_type") {
        await this.showTypeOptions();
      }
      else if (field === "type_id") {
        await this.showPeriodOptions();
      }
       else *//*if (field === "purchase_date" || field === "expiration_date") {
        this.showDatePicker(field);
      }*/
    },
    validateField(field, value) {
      console.log("Validando campo de producto:", field, "con valor:", value);
      
      // Definir los labels de los campos para mensajes de error
      const fieldLabels = {
        name: "nombre del producto",
        quantity: "cantidad",
        unit_price: "precio unitario",
        total_price: "precio total",
        purchase_place: "lugar de compra",
        purchase_date: "fecha de compra",
        expiration_date: "fecha de vencimiento",
        additional_notes: "notas adicionales",
        warehouse_id: "almacén",
        category_id: "categoría",
        status_id: "estado"
      };

      switch (field) {
        case "name":
          if (!value || value.trim().length === 0) {
            throw new Error("El nombre del producto es requerido");
          }
          return value.trim();

        case "quantity":
          const quantity = parseFloat(value);
          if (isNaN(quantity) || quantity <= 0) {
            throw new Error("La cantidad debe ser un número positivo");
          }
          return quantity;

        case "unit_price":
          const unit_price = parseFloat(value);
          if (isNaN(unit_price) || unit_price <= 0) {
            throw new Error("El precio unitario debe ser un número positivo");
          }
          return unit_price;

        case "total_price":
          const total_price = parseFloat(value);
          if (isNaN(total_price) || total_price < 0) {
            throw new Error("El precio total debe ser un número positivo");
          }
          return total_price;

        case "purchase_place":
          if (!value || value.trim().length === 0) {
            throw new Error("El lugar de compra es requerido");
          }
          return value.trim();

        case "purchase_date":
        case "expiration_date":
          // Validar formato de fecha (YYYY-MM-DD)
          if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) {
            throw new Error(`Formato de fecha inválido (debe ser YYYY-MM-DD)`);
          }

          // Validar que sea una fecha válida
          const dateObj = new Date(value);
          if (isNaN(dateObj.getTime())) {
            throw new Error(`Fecha inválida para ${fieldLabels[field]}`);
          }

          // Validar relaciones entre fechas
          if (field === "expiration_date" && this.productParameters?.purchase_date) {
            const startDate = new Date(this.productParameters.purchase_date);
            const endDate = new Date(value);
            if (endDate < startDate) {
              throw new Error("La fecha de vencimiento debe ser posterior o igual a la fecha de compra");
            }
          }
          
          if (field === "purchase_date" && this.productParameters?.expiration_date) {
            const startDate = new Date(value);
            const endDate = new Date(this.productParameters.expiration_date);
            if (endDate < startDate) {
              throw new Error("La fecha de compra debe ser anterior o igual a la fecha de vencimiento");
            }
          }

          return value;

        case "warehouse_id":
          if (value === null || value === undefined || value === "") {
            throw new Error("Debes seleccionar un almacén");
          }
          const warehouseId = parseInt(value, 10);
          if (isNaN(warehouseId) || warehouseId <= 0) {
            throw new Error("ID de almacén inválido");
          }
          return warehouseId;

        case "status_id":
          if (value === null || value === undefined || value === "") {
            throw new Error("Debes seleccionar un estado");
          }
          const statusID = parseInt(value, 10);
          if (isNaN(statusID) || statusID <= 0) {
            throw new Error("ID de estado inválido");
          }
          return statusID;

        case "category_id":
          if (value === null || value === undefined || value === "") {
            throw new Error("Debes seleccionar una categoría");
          }
          const categoryId = parseInt(value, 10);
          if (isNaN(categoryId) || categoryId <= 0) {
            throw new Error("ID de categoría inválido");
          }
          return categoryId;

        case "additional_notes":
          // Notas adicionales son opcionales, solo trim si existe
          return value ? value.trim() : value;

        default:
          // Para campos no especificados, devolver el valor sin validación
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
    /*handleTypeSelection(type) {
      this.productParameters.budget_type = type.id;

      // Actualizar el mensaje de prioridad existente o crear uno nuevo
      const priorityMessageIndex = this.chatMessages.findIndex(
        (m) => m.from === "ai" && m.component === "TypePersonalOptions"
      );

      if (priorityMessageIndex !== -1) {
        this.chatMessages[priorityMessageIndex].props.selectedId = type.id;
      }

       if (this.isInitialCategorySelection) {
      this.startAutomaticDataCollection();
    } else {
      // Si estamos editando, actualizar el resumen
      this.updateSummaryMessage();
    }
    },*/
    showAlert(type, message, timeout) {
      this.sb_type = type;
      this.sb_message = message;
      this.sb_timeout = timeout;
      this.sb_icon = type === "success" ? "mdi-check-circle" : "mdi-alert-circle";
      this.snackbar = true;
    },

    generateSummary() {
      let summary = `Resumen del presupuesto:\n\n`;
      
      const parametersToShow = [
        { key: "description", label: "Descripción" },
        { key: "amount", label: "Monto" },
        //{ key: "purchase_date", label: "Fecha inicio" },
        //{ key: "expiration_date", label: "Fecha fin" },
        { key: "currency", label: "Moneda" },
        { key: "budget_type", label: "Tipo" },
        { key: "type_id", label: "Período" },
        { key: "category_id", label: "Categoría" },
      ];

      parametersToShow.forEach(({ key, label }) => {
        const value = this.productParameters[key];
        if (value !== null && value !== undefined && value !== "") {
          if (key === "budget_type") {
            const type = this.types.find((t) => t.id === value);
            summary += `• ${label}: ${type?.name || "No especificado"}\n`;
          } else if (key === "type_id") {
            const period = this.typesPeriod.find((b) => b.id === value);
            summary += `• ${label}: ${period?.nameTranslated || `ID: ${value}`}\n`;
          } else if (key === "category_id") {
            const category = this.categories.find((b) => b.id === value);
            summary += `• ${label}: ${category?.nameCategory || `ID: ${value}`}\n`;
          } else {
            summary += `• ${label}: ${value}\n`;
          }
        }
      });

      return summary;
    },
    completeCreation() {
      this.isTyping = true;
      this.productDataCollectionMode = false;

      // Eliminar mensajes de resumen y confirmación anteriores si existen
      this.chatMessages = this.chatMessages.filter(msg => 
        !msg.isSummary && !msg.isConfirmation
      );

      // Generar y mostrar resumen actualizado
      const summary = this.generateSummary();
      
      this.chatMessages.push({
        from: "ai",
        text: summary,
        timestamp: new Date().toLocaleTimeString(),
        isSummary: true // Marcar como mensaje de resumen
      });

      // Mostrar confirmación
      this.chatMessages.push({
        from: "ai",
        text: "¿Deseas crear este presupuesto con los datos proporcionados?",
        timestamp: new Date().toLocaleTimeString(),
        isConfirmation: true, // Marcar como mensaje de confirmación
        buttons: [
          {
            text: "Cancelar",
            color: "grey",
            variant: "outlined",
            action: () => this.handleCancellation("no"),
            props: { class: "mr-2", size: "default" }
          },
          {
            text: "Confirmar y crear",
            color: "primary",
            variant: "flat",
            action: () => this.handleConfirmation("si"),
            props: { size: "default" }
          }
        ]
      });

      this.waitingForConfirmation = true;
      this.isTyping = false;
      this.scrollToBottom();
    },
    // Maneja la confirmación del usuario
    async handleConfirmation(userResponse) {
      this.waitingForConfirmation = false;

      if (userResponse.toLowerCase() === "si" || userResponse.toLowerCase() === "sí") {
        const fieldsToUpdate = [
          "category_id",
          "amount",
          "used_amount",
          //"purchase_date",
          //"expiration_date",
          "budget_type",
          "status",
          "description",
          "currency",
          "type_id",
        ];

        let updatedFields = Object.keys(this.productParameters)
          .filter(
            (key) =>
              fieldsToUpdate.includes(key) &&
              this.productParameters[key] !== this.defaultItem[key]
          )
          .reduce((obj, key) => {
            obj[key] = this.productParameters[key];
            return obj;
          }, {});

        updatedFields.home_id = this.home_id;

        if (Object.keys(updatedFields).length > 0) {
          try {
            const result = await handleRequest({
              endpoint: "budget",
              method: "POST",
              data: updatedFields,
            });

            // Manejo de la respuesta según el resultado
            if (result.success) {
              this.chatMessages.push({
                from: "ai",
                text: `✅ ${this.currentIntent} creado exitosamente!`,
                timestamp: new Date().toLocaleTimeString(),
              });
            }
          } catch (error) {
            this.chatMessages.push({
              from: "ai",
              text: `❌ Error al crear la ${this.currentIntent}: ${error.message}`,
              timestamp: new Date().toLocaleTimeString(),
            });
          } finally {
            this.isTyping = false;
          }
        } else {
          this.chatMessages.push({
            from: "ai",
            text: "No se realizaron cambios en el presupuesto.",
            timestamp: new Date().toLocaleTimeString(),
          });
        }
      } else {
        this.handleCancellation();
      }

      // Resetear
      this.productDataCollectionMode = false;
      this.currentIntent = null;
      this.productParameters = {};
      this.scrollToBottom();
      this.handleCancellation();
    },
    handleCancellation() {
      this.waitingForConfirmation = false;
      this.productParameters.people = [];
      this.productParameters = Object.assign({}, this.defaultItem);
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
            variant: "outlined", // Botón con borde
            action: () => this.closeDialog(),
            props: {
              class: "mr-2",
              size: "default",
            },
          },
          {
            text: "Nueva conversación",
            color: "primary",
            variant: "flat", // Botón sólido
            action: () => this.startNewConversation(),
            props: {
              size: "default",
            },
          },
        ],
      });
    },

    // Método para nueva conversación
    startNewConversation() {
      // Limpiar el chat
      this.chatMessages = [];

      // Reiniciar todas las variables de estado relacionadas con tareas
      this.productDataCollectionMode = false;
      this.currentIntent = null;
      this.productParameters = {
        budget_type: null,
        amount: null,
        description: null,
        purchase_date: null,
        expiration_date: null,
        category_id: null,
        currency: "CLP",
        status: "Activo",
      };
      this.waitingForConfirmation = false;
      this.isTyping = false;

      // Mensaje inicial del asistente
      this.chatMessages.push({
        from: "ai",
        text: "¡Hola! ¿En qué puedo ayudarte hoy?",
        timestamp: new Date().toLocaleTimeString(),
      });

      // Asegurarse de que el scroll se actualice
      this.scrollToBottom();
    },

    // Método para cerrar el diálogo
    closeDialog() {
      // Opcional: limpiar la conversación
      this.chatMessages = [];
      // Emitir evento para cerrar el diálogo (ajusta según tu implementación)
      this.$emit("close-dialog");
      this.$emit("close-all-dialogs", "ChatBudget");
    },
    //date y time
    handleDateSelection(field, dateEvent) {
      const { value } = dateEvent;
      
      if (!value) {
        this.showAlert("error", "Fecha inválida", 2000);
        return;
      }

      // Actualizar el valor en el modelo
      this.productParameters[field] = value;
      
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

      this.scrollToBottom();
      
      // Continuar el flujo si es necesario
      if (this.isInitialDataCollection) {
        this.startAutomaticDataCollection();
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
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  transition: all 0.2s ease;
}
</style>
