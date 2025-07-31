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
                  <!-- Campo editable con componente -->
                  <template v-if="message.isEditable && message.isEditing">
                    <div v-if="message.fieldKey === 'warehouse_id'">
                      <v-autocomplete
                        v-model="message.editValue"
                        :items="message.availableWareHouses || warehouses"
                        item-title="title"
                        item-value="id"
                        :label="message.fieldLabel"
                        variant="outlined"
                        density="comfortable"
                        return-object
                        style="width: auto; min-width: 20em"
                        hide-details
                        @update:modelValue="onWarehouseSelected(index, $event)"
                        @blur="onWarehouseBlur(index)"
                        @click:clear="onWarehouseClear(index)"
                      >
                         <template v-slot:item="{ props, item }">
                      <v-list-item v-bind="props">
                        <v-list-item-subtitle class="d-flex flex-column">
                          <v-tooltip location="top right">
                            <template v-slot:activator="{ props }">
                              <div
                                class="description-text"
                                v-bind="props"
                                :title="item.raw.description"
                              >
                                {{ $t("warehouse.fields.description") }}:
                                {{ item.raw.description }}
                              </div>
                            </template>
                            <span>{{ item.raw.description }}</span>
                          </v-tooltip>
                          <v-tooltip location="top right">
                            <template v-slot:activator="{ props }">
                              <div
                                class="description-text"
                                v-bind="props"
                                :title="item.raw.location"
                              >
                                {{ $t("warehouse.fields.home_location") }}:
                                {{ item.raw.location }}
                              </div>
                            </template>
                            <span>{{ item.raw.location }}</span>
                          </v-tooltip>
                        </v-list-item-subtitle>
                      </v-list-item>
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
                    <v-textarea
                      v-else-if="['title', 'description', 'location'].includes(message.fieldKey)"
                      v-model="message.editValue"
                      :label="message.fieldLabel"
                      variant="outlined"
                      density="comfortable"
                      style="width: auto; min-width: 50em"
                      :ref="(el) => setTextFieldRef(el, index)"
                      autofocus
                      auto-grow
                      rows="2"
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
                      style="width: auto; min-width: 10em"
                      :ref="(el) => setTextFieldRef(el, index)"
                      autofocus
                      no-resize
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
                      <div
                        style="
                          white-space: pre-wrap;
                          word-break: break-word;
                          margin-bottom: 12px;
                        "
                      >
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
                    v-bind="message.props || {}"
                    @private-selected="handlePrivateSelection($event)"
                  />
                </div>
              </div>
            </div>

            <div v-if="isTyping" class="d-flex justify-start align-center mb-8 mb-2 ml-3">
              <div class="d-flex align-end">
                <v-avatar size="28" class="mb-2 mr-3">
                  <v-img src="@/assets/logo-verde.png" alt="Avatar" />
                </v-avatar>
                <div
                  class="chat-bubble px-8 py-3 rounded-xl bg-grey-darken-1-lighten-2 text-black"
                >
                  <span class="typing-indicator">•••</span>
                </div>
              </div>
            </div>
          </div>

          <!-- Herramientas -->
          <v-divider />
          <v-card-actions class="pa-3 bg-grey-darken-1-lighten-5 tools-bar">
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
  <v-dialog v-model="dialogChatTask" fullscreen transition="dialog-bottom-transition">
    <v-card>
      <v-card-text>
        <!-- Pasamos los parámetros al componente ChatTask -->
        <ChatTask
          :taskData="currentTask"
          @close-dialog="closeDialgChat()"
          @close-all-dialogs="handleCloseAll($event)"
        />
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
        <ChatBudget
          :budgetData="currentBudget"
          @close-dialog="closeDialgChat()"
          @close-all-dialogs="$emit('close-all-dialogs')"
        />
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
        <ChatFinance :financeData="currentFinance" @close-dialog="closeDialgChat()" @close-all-dialogs="$emit('close-all-dialogs')" />
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
import PrivateOptions from "@/components/chatTask/PrivateOptions.vue";
import LocalStorageService from "@/LocalStorageService";
import { handleRequest } from "@/utils/api";
import _ from "lodash";
import { defineAsyncComponent, markRaw } from "vue";

export default {
  emits: ["close-dialog", "close-all-dialogs"],
  props: {
    initialMessage: {
      type: String,
      default: "",
    },
    warehouseData: {
      type: Object,
      default: null,
    },
  },
  components: {
    PrivateOptions,
    ChatBudget: defineAsyncComponent(() => import("./ChatBudget.vue")),
    ChatTask: defineAsyncComponent(() => import("./ChatTask.vue")),
    ChatFinance: defineAsyncComponent(() => import("./ChatFinance.vue")),
  },
  data() {
    return {
      shownChatFields: new Set(),
      dialogChatTask: false,
      dialogChatFinance: false,
      dialogChatBudget: false,
      currentTask: null,
      currentBudget: null,
      currentFinance: null,
      isInitialCategorySelection: false,
      textoTemporal: "",
      warehouseDataCollectionMode: false,
      currentWarehouseIntent: null,
      editingField: null,
      escuchando: false,
      recognition: null,
      cargando: false,
      compatible: true,
      tools: [],
      warehouseParameters: {
      title: "",
      description: "",
      location: "",
      status: "",
      home_id: "",
      warehouse_id: "",
      },
      originalItem: {
         title: "",
      description: "",
      location: "",
      status: "",
      home_id: "",
      warehouse_id: "",
      },
      defaultItem: {
         title: "",
      description: "",
      location: "",
      status: "",
      home_id: "",
      warehouse_id: "",
      },
      textFieldRefs: [],
      currentParameterIndex: 0,
      waitingForConfirmation: false,
      collectingPeople: false,
      currentRoleSelection: null,
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
      warehouses: [],
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
    let warehouseData = this.warehouseData;

    // Si es string, parsearlo
    if (typeof warehouseData === "string") {
      try {
        warehouseData = JSON.parse(warehouseData);
      } catch (error) {
        console.error("Error parsing warehouseData:", error);
        return;
      }
    }

    console.log("Datos recibidos del componente padre (warehouseData):", warehouseData);
    this.name = JSON.parse(LocalStorageService.getItem("name"));
    this.user = JSON.parse(LocalStorageService.getItem("user"));
    this.user_id = JSON.parse(LocalStorageService.getItem("user_id"));
    this.home_id = JSON.parse(LocalStorageService.getItem("home_id"));
    this.imageUrl = LocalStorageService.getItem("image").replace(/['"]+/g, "");
    if (this.warehouseData) {
      try {
        await this.loadRequiredData();
        // Copiar los datos de la tarea
        this.warehouseParameters = {
          ...this.warehouseParameters,
          ...warehouseData,
        };
        this.warehouseDataCollectionMode = true;
        this.currentTransactionType = 'Almacén';
        this.currentWarehouseIntent = 'Almacén';
        // Mostrar en el chat
        this.chatMessages.push({
          from: "ai",
          text: `Datos del  ${this.currentWarehouseIntent} recibidos. Puedes editarlos antes de confirmar.`,
          timestamp: new Date().toLocaleTimeString(),
        });

        // Iniciar flujo de edición

        await this.showInitialwarehouseData(warehouseData);
      } catch (error) {
        this.showAlert("error", "Error al cargar datos: " + error.message);
      }
    } else if (this.initialMessage) {
      // Si no hay warehouseData, pero hay initialMessage, simular envío
      this.newMessage = this.initialMessage;
      this.sendMessage();
    }
  },
  methods: {
    closeDialgChat() {
      this.dialogChatTask = false;
      this.dialogChatFinance = false;
      this.dialogChatBudget = false;
      this.texto = "";
      this.textoTemporal = "";
      this.currentTask = null;
      this.currentFinance = null;
      this.currentBudget = null;
      this.$emit("close-all-dialogs", "ChatWarehouse");
      //this.initialize();
    },
    async onWarehouseSelected(index, selectedWarehouse) {
      console.log("Almacén seleccionado:", selectedWarehouse);
      // Si se selecciona un objeto (no null/undefined), guardar automáticamente
      if (
        selectedWarehouse &&
        typeof selectedWarehouse === "object" &&
        this.isInitialWarehouseSelection
      ) {
        await this.saveFieldEdit(index);
      }
      // Si selectedBudget es null (limpiado con clear) o un ID, también podrías guardarlo
      // pero saveFieldEdit manejará la validación.
    },

    async onWarehouseBlur(index) {
      console.log("Autocomplete perdió foco");
      // Cuando se pierde el foco, intentar guardar.
      // Si no hay valor válido, saveFieldEdit lo manejará.
      // Puedes añadir un pequeño retraso si quieres permitir clic en el menú desplegable.
      setTimeout(async () => {
        const message = this.chatMessages[index];
        if (message && message.isEditing) {
          // Verificar si el valor actual es diferente al original antes de guardar
          if (message.editValue !== message.currentValue) {
            if (!this.isInitialWarehouseSelection) {
              await this.saveFieldEdit(index);
            }
          } else {
            // Si no cambió, simplemente salir del modo edición
            message.isEditing = false;
            this.scrollToBottom();
          }
        }
      }, 200); // Pequeño retraso para permitir selección del menú
    },

    async onWarehouseClear(index) {
      console.log("Selección de presupuesto limpiada");
      const message = this.chatMessages[index];
      // Establecer editValue a null
      message.editValue = null;
      // Guardar inmediatamente el valor null
      await this.saveFieldEdit(index);
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
              this.warehouseParameters[lastAIMessage.fieldName] = validatedValue;
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

          if (!this.warehouseDataCollectionMode) {
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
            const {
              intentDetected,
              intent,
              task,
              answer,
              finances,
              budget,
            } = response.data;

            if (intentDetected && intent) {
              this.data = { home_id: this.home_id };
              switch (intent) {
                case "Tarea":
                  this.currentTask = null;
                  this.$nextTick(() => {
                    const taskData = typeof task === "string" ? JSON.parse(task) : task;

                    this.currentTask = _.cloneDeep(taskData);
                    this.dialogChatTask = true;
                    this.scrollToBottom();
                  });
                  break;

                case "Meta":
                  this.currentTask = null;
                  this.$nextTick(() => {
                    const taskData =
                      typeof response.data.task === "string" ? JSON.parse(task) : task;

                    this.currentTask = _.cloneDeep(taskData);
                    this.dialogChatTask = true;
                    this.scrollToBottom();
                  });
                  break;

                case "Warehouse":
                  this.$nextTick(async () => {
                    this.warehouseParameters = {
                      ...this.warehouseParameters,
                      ...finances,
                    };
                    this.currentIntent = intent;
                    this.currentWarehouseIntent = intent;
                    this.currentTransactionType = intent;
                    this.warehouseDataCollectionMode = true;
                    this.chatMessages.push({
                      from: "ai",
                      text: `Datos del  ${this.currentIntent} recibidos. Puedes editarlos antes de confirmar.`,
                      timestamp: new Date().toLocaleTimeString(),
                    });
                    await this.loadRequiredData();
                    await this.showInitialwarehouseData(finances);
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

                  this.currentFinance = _.cloneDeep(financeData);
                  this.dialogChatFinance = true;
                  this.scrollToBottom();
                });
                break;

            case "Ingreso":
              this.currentFinance = null;
              this.$nextTick(() => {
                const financeData =
                  typeof finances === "string"
                    ? JSON.parse(finances)
                    : finances;

                this.currentFinance = _.cloneDeep(financeData);
                this.dialogChatFinance = true;
                this.scrollToBottom();
              });
              break;

                case "Presupuesto":
                  this.currentBudget = null;
                  this.$nextTick(() => {
                    const budgetData =
                      typeof budget === "string" ? JSON.parse(budget) : budget;

                    this.currentBudget = _.cloneDeep(budgetData);
                    this.dialogChatBudget = true;
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
              /*this.data = { home_id: this.home_id };
              if (response.data.finances) {
                this.warehouseParameters = {
                  ...this.warehouseParameters,
                  ...response.data.finances,
                };
              }
              await this.loadRequiredData();
              this.currentWarehouseIntent = intent;
              this.warehouseDataCollectionMode = true;
              await this.showInitialwarehouseData(finances);*/
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
          endpoint: "person-warehouse-home-select",
          method: "POST",
          data: this.data,
        });

        if (result.success) {
          this.warehouses =
            result.data?.warehouses || [];
            console.log('this.warehouses');
            console.log(this.warehouses);
        } else {
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
    async showInitialwarehouseData(warehouseData) {
      if (!warehouseData) return;

        this.isInitialWarehouseSelection =
          warehouseData.warehouse_id === null || warehouseData.warehouse_id === undefined;


      this.isInitialDataCollection = !warehouseData;
      await this.showSummary(warehouseData);
      await this.startAutomaticDataCollection();
    },

    async showSummary(warehouseData) {
      // Definir campos a mostrar
      const fieldsToShow = [
        { key: "title", label: "Nombre" },
        { key: "description", label: "Descripción" },
        { key: "location", label: "Ubicación en la casa" },
        { key: "warehouse_id", label: "Almacenes" },
      ];

      // Mostrar campos editables
      fieldsToShow.forEach((field) => {
        const value = warehouseData[field.key];
        if (value !== null && value !== undefined && value !== "") {
          let displayValue = value;
          let additionalData = {};

          if (field.key === "warehouse_id") {
            const warehouseInfo = this.warehouses.find((b) => b.id === value);
            displayValue = warehouseInfo ? warehouseInfo.title : `ID: ${value}`;
            additionalData.availableWarehouses = this.warehouses;
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
            ...additionalData,
          });
          // Mostrar componente de tipo si existe
          this.shownChatFields.add(field.key);
        }
      });
      if (warehouseData.status !== undefined && warehouseData.status !== null) {
        this.chatMessages.push({
          from: "ai",
          text: "Estado:",
          component: "PrivateOptions",
          props: {
            selectedId: warehouseData.status,
          },
          timestamp: new Date().toLocaleTimeString(),
        });
        this.shownChatFields.add("status");
      }
    },

    async startAutomaticDataCollection() {
      const parametersOrder = [
        "title",
        "description",
        "location",
        "status",
        "warehouse_id",
      ];

      const nextField = parametersOrder.find((field) => {
        const value = this.warehouseParameters[field];
        return !value && value !== 0;
      });

      if (this.shownChatFields.has(nextField)) {
        return;
      }

      // Marcar como mostrado ANTES de mostrar el mensaje
      this.shownChatFields.add(nextField);

      if (nextField === "status") {
        await this.showPrivateOptions();
      } /*else if (nextField === "budget_id" && !this.isInitialWarehouseSelection) {
        // Si es budget_id pero no es la primera selección, completar creación
        this.completeCreation();
      }*/ else if (nextField) {
        this.showFieldInput(nextField);
      } else {
        this.completeCreation();
      }
    },

    async showFieldInput(field) {
      const fieldLabels = {
        title: "el nombre",
        description: "la descripción",
        location: "ubicación en la casa",
        status: "el estado",
        warehouse_id: "Almacén",
      };

      // Configuración especial para budget_id
      if (field === "warehouse_id") {
        this.isInitialWarehouseSelection =
          this.warehouseParameters[field] === null ||
          this.warehouseParameters[field] === undefined;

        this.chatMessages.push({
          from: "ai",
          text: `¿Deseas asociar a un almacén existente? (opcional)`,
          timestamp: new Date().toLocaleTimeString(),
          isEditable: true,
          fieldKey: field,
          fieldLabel: fieldLabels[field],
          currentValue: this.warehouseParameters[field],
          editValue: this.warehouseParameters[field],
          isEditing: true,
          availableBudgets: this.budgets,
        });
        this.completeCreation();
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

      if (field === "status") {
        await this.showPrivateOptions();
      }
    },

    async saveFieldEdit(index) {
      console.log("saveFieldEdit", index);
      const message = this.chatMessages[index];
      console.log("Mensaje a guardar:", message);

      try {
        let valueToValidate = message.editValue;

        // Caso especial para budget_id
        if (
          message.fieldKey === "warehouse_id" &&
          typeof valueToValidate === "object" &&
          valueToValidate !== null
        ) {
          valueToValidate = valueToValidate.id;
        }

        const validatedValue = this.validateField(message.fieldKey, valueToValidate);
        this.warehouseParameters[message.fieldKey] = validatedValue;

        // Actualizar el texto mostrado
        let displayValue = validatedValue;
        if (
          message.fieldKey === "warehouse_id" &&
          typeof message.editValue === "object" &&
          message.editValue !== null
        ) {
          displayValue = message.editValue.title;
        }

        message.currentValue = validatedValue;
        message.text = `• ${message.fieldLabel}: ${displayValue}`;
        message.isEditing = false;
        this.scrollToBottom();

        if (this.warehouseDataCollectionMode) {
          // Si estamos en recolección inicial
          if (message.fieldKey === "warehouse_id") {
            this.isInitialWarehouseSelection = false;
          }
          await this.startAutomaticDataCollection();
        } else {
          // Si estamos editando después del resumen
          this.updateSummary();
        }
      } catch (error) {
        this.showAlert("error", error.message, 2000);
        message.editValue = message.currentValue;
        message.isEditing = false;
      }
    },

    updateSummary() {
      // Encontrar y eliminar el resumen y confirmación anteriores
      let index = this.chatMessages.length - 1;
      while (index >= 0) {
        const msg = this.chatMessages[index];
        if (
          msg.text &&
          (msg.text.startsWith("Resumen de la transacción financiera") ||
            msg.text.startsWith("¿Deseas crear esta transacción financiera"))
        ) {
          this.chatMessages.splice(index, 1);
        }
        index--;
      }

      // Volver a llamar a completeCreation para regenerar el resumen
      this.completeCreation();
    },

    completeCreation() {
      this.isTyping = true;
      this.warehouseDataCollectionMode = false;

      // Construir mensaje de resumen
      let summary = `Resumen de la transacción financiera:\n\n`;

      // Determinar qué campo de monto mostrar
      let amountToShow = [];
      // Construir la lista de parámetros a mostrar
      const parametersToShow = [
        { key: "title", label: "Nombre" },
        { key: "description", label: "Descripción" },
        { key: "location", label: "Ubicación en la casa" },
        { key: "status", label: "Estado" },
        { key: "warehouse_id", label: "Almacén existente" },
      ];

      // Agregar cada parámetro al resumen
      parametersToShow.forEach(({ key, label }) => {
        const value = this.warehouseParameters[key];
        if (value !== null && value !== undefined && value !== "") {
          if (key === "status") {
            const status = value === 0 
              ? this.$t("warehouse.status.private") 
              : this.$t("warehouse.status.public");

            summary += `• ${label}: ${status || "No especificado"}\n`;
          } else if (key === "warehouse_id") {
            const warehouse = this.warehouses.find((b) => b.id === value);
            summary += `• ${label}: ${warehouse?.title || `ID: ${value}`}\n`;
          } else {
            summary += `• ${label}: ${value}\n`;
          }
        }
      });

      const hasExistingSummary = this.chatMessages.some(
        (msg) => msg.text && msg.text.startsWith("Resumen de la transacción financiera")
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
            text:
              "¿Deseas crear esta transacción financiera con los datos proporcionados?",
            timestamp: new Date().toLocaleTimeString(),
            buttons: [
              {
                text: "Cancelar",
                color: "grey-darken-1",
                variant: "outlined",
                action: () => this.handleCancellation("no"),
                props: { class: "mr-2", size: "default" },
              },
              {
                text: "Confirmar y crear",
                color: "primary",
                variant: "flat",
                action: () => this.handleConfirmation("si"),
                props: { size: "default" },
              },
            ],
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
          case "status":
          // Convertir a número por si viene como string
          const statusValue = Number(value);
          
          // Validar que sea 0 o 1
          if (statusValue !== 0 && statusValue !== 1) {
            throw new Error("El estado debe ser 0 (Privado) o 1 (Público)");
          }
          
          return statusValue;
        case "warehouse_id":
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
    async showPrivateOptions() {
      this.chatMessages.push({
        from: "ai",
        text: "Selecciona el estado:",
        component: "PrivateOptions",
        props: {
          selectedId: this.warehouseParameters.status,
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
    handlePrivateSelection(type) {
      console.log("Tipo seleccionado:", type);
      this.warehouseParameters.status = type.id;

      // Actualizar el mensaje de prioridad existente o crear uno nuevo
      const priorityMessageIndex = this.chatMessages.findIndex(
        (m) => m.from === "ai" && m.component === "PrivateOptions"
      );

      if (priorityMessageIndex !== -1) {
        this.chatMessages[priorityMessageIndex].props.selectedId = type.id;
      }

      if (this.isInitialWarehouseSelection) {
        this.startAutomaticDataCollection();
      } else {
        // Si estamos editando, actualizar el resumen
        this.updateSummary();
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
        const fieldsToUpdate = ["id", "title", "location", "description", "status", "warehouse_id"];

        let updatedFields = Object.keys(this.warehouseParameters)
          .filter(
            (key) =>
              fieldsToUpdate.includes(key) &&
              this.warehouseParameters[key] !== this.originalItem[key]
          )
          .reduce((obj, key) => {
            obj[key] = this.warehouseParameters[key];
            return obj;
          }, {});
        if (Object.keys(updatedFields).length > 0) {
          updatedFields.home_id = Number(this.home_id);
          try {
            const result = await handleRequest({
              endpoint: "person-warehouse",
              method: "POST",
              data: updatedFields,
            });

            // Manejo de la respuesta según el resultado
            if (result.success) {
              this.chatMessages.push({
                from: "ai",
                text: `✅ ${this.currentWarehouseIntent} creado exitosamente!`,
                timestamp: new Date().toLocaleTimeString(),
              });
            }
          } catch (error) {
            this.chatMessages.push({
              from: "ai",
              text: `❌ Error al crear la ${this.currentWarehouseIntent}: ${error.message}`,
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
      this.warehouseDataCollectionMode = false;
      this.currentWarehouseIntent = null;
      this.warehouseParameters = {};
      this.scrollToBottom();
      this.handleCancellation();
    },
    handleCancellation() {
      this.waitingForConfirmation = false;
      this.warehouseParameters = Object.assign({}, this.defaultItem);
      this.originalItem = Object.assign({}, this.defaultItem);
      // Mensaje con botones de opción
      this.chatMessages.push({
        from: "ai",
        text: "¿Qué deseas hacer ahora?",
        timestamp: new Date().toLocaleTimeString(),
        buttons: [
          {
            text: "Salir",
            color: "grey-darken-1",
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
      this.warehouseDataCollectionMode = false;
      this.currentWarehouseIntent = null;
      this.isInitialWarehouseSelection = false;
      this.warehouseParameters = {
        title: "",
        description: "",
        location: "",
        status: "",
        home_id: "",
        warehouse_id: "",
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
      this.$emit("close-all-dialogs", "ChatWarehouse");
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
.description-text {
  max-width: 200px;
  /* Establece un límite de ancho */
  overflow: hidden;
  /* Oculta el texto que exceda */
  text-overflow: ellipsis;
  /* Añade "..." al final del texto largo */
  white-space: nowrap;
  /* Evita el salto de línea */
}
</style>
