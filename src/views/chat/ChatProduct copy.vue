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
                  <!-- Campo editable con componente -->
                  <template v-if="message.isEditable && message.isEditing">
                    <div v-if="['purchase_date', 'expiration_date'].includes(message.fieldKey)">
                    <v-locale-provider>
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
                      </v-locale-provider>
                    </div>
                    <div v-if="message.fieldKey === 'category_id'">
                      <v-autocomplete v-model="message.editValue" :items="message.availableCategories || categories"
                        :label="message.fieldLabel" item-title="nameCategory" item-value="id" variant="outlined"
                        density="comfortable" style="width: auto; min-width: 20em" return-object hide-details
                        @update:modelValue="onSelected(index, $event)" @blur="onBlur(index)"
                        @click:clear="onClear(index)">
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
                          :label="$t('product.fields.status')"
                          item-title="nameStatus"
                          item-value="id"
                          variant="underlined"
                          density="compact"
                          :rules="validationRules.status_id"
                          :no-data-text="$t('product.validation.no_data')"
                          return-object
                          @update:modelValue="onSelectedStatus($event)"
                          @blur="onBlurStatus"
                          @click:clear="onClear"
                        >
                          <template v-slot:item="{ props, item }">
                            <v-list-item v-bind="props">
                              <template v-slot:prepend>
                                <v-avatar size="24">
                                  <v-icon>{{ item.raw.iconStatus }}</v-icon>
                                </v-avatar>
                              </template>
                              <v-list-item-subtitle class="d-flex flex-column">
                                <div v-if="item.raw.descriptionStatus">Descripción: {{ item.raw.descriptionStatus }}</div>
                              </v-list-item-subtitle>
                            </v-list-item>
                          </template>
                          <template v-slot:selection="{ item }">
                            <div class="d-flex align-center">
                              <v-avatar size="20" start>
                                <v-icon small>{{ item.raw.iconStatus }}</v-icon>
                              </v-avatar>
                              <span>{{ item.raw.nameStatus }}</span>
                            </div>
                          </template>
                        </v-autocomplete>
                    </div>
                  <div v-if="message.fieldKey === 'warehouse_id'">
                  <v-autocomplete
                         v-model="message.editValue" :items="message.availableWarehouses || warehouses"
                        label="Almacén"
                        item-value="warehouse_id"
                        variant="underlined"
                        density="compact"
                        :rules="validationRules.warehouse_id"
                        return-object
                        @update:modelValue="onSelectedWarehouse($event)"
                        @blur="onBlurWarehouse"
                        @click:clear="onClear"
                      >
                        <template v-slot:item="{ props, item }">
                          <v-list-item v-bind="props">
                            <template v-slot:prepend>
                              <v-avatar size="24" color="grey-lighten-2">
                                <v-icon>mdi-warehouse</v-icon>
                              </v-avatar>
                            </template>
                            <v-list-item-subtitle class="d-flex flex-column">
                              <div>Descripción: {{ item.raw.description }}</div>
                            </v-list-item-subtitle>
                          </v-list-item>
                        </template>
                        <template v-slot:selection="{ item }">
                          <div class="d-flex align-center">
                            <v-avatar size="20" start color="grey-lighten-2">
                              <v-icon small>mdi-warehouse</v-icon>
                            </v-avatar>
                            <span>{{ item.raw.title }}</span>
                          </div>
                        </template>
                      </v-autocomplete>
                  </div>
                    <v-textarea v-else-if="['title', 'description'].includes(message.fieldKey)"
                      v-model="message.editValue" :label="message.fieldLabel" variant="outlined" density="comfortable"
                      style="width: auto; min-width: 50em" :ref="(el) => setTextFieldRef(el, index)" autofocus auto-grow
                      rows="2" no-resize @keyup.enter="saveFieldEdit(index)" @blur="saveFieldEdit(index)"></v-textarea>

                    <!-- Textfield para otros campos -->
                    <v-text-field v-else v-model="message.editValue" :label="message.fieldLabel" variant="outlined"
                      density="comfortable" style="width: auto; min-width: 15em" :ref="(el) => setTextFieldRef(el, index)"
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
    <v-dialog v-model="dialogChatBudget" fullscreen transition="dialog-bottom-transition">
    <v-card>
      <v-card-text>
        <!-- Pasamos los parámetros al componente ChatTask -->
        <ChatBudget :productData="currentBudget" @close-dialog="closeDialgChat()" @close-all-dialogs="$emit('close-all-dialogs')" />
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
import DatePicker from "@/components/chatTask/DatePicker.vue";
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
    productData: {
      type: Object,
      default: null,
    },
  },
  components: {
    DatePicker,
    
    ChatBudget: defineAsyncComponent(() => import('./ChatBudget.vue')),
    ChatFinance: defineAsyncComponent(() => import('./ChatFinance.vue')),
    ChatWarehouse: defineAsyncComponent(() => import('./ChatWarehouse.vue')),
  },
  data() {
    return {
      shownChatFields: new Set(), // ← Aquí llevamos control
       dialogChatFinance: false,
       dialogChatTask: false,
        dialogChatBudget: false,
        dialogChatWarehouse: false,
        isInitialCategorySelection: false,
        isInitialStatusSelection: false,
        isInitialWarehouseSelection: false,
      currentTask: null,
      currentBudget: null,
      currentFinance: null,
      currentWarehouse: null,
      currentIntentFinance: null,
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
        name: null,               // Nombre del producto
        quantity: null,          // Cantidad (número)
        unit_price: null,        // Precio unitario (número)
        total_price: null,       // Precio total (número, calculado)
        purchase_place: null,    // Lugar de compra (string)
        purchase_date: null,     // Fecha de compra (Date/string)
        expiration_date: null,   // Fecha de vencimiento (Date/string)
        additional_notes: null,  // Notas adicionales (string)
        warehouse_id: null,      // ID del almacén (número)
        category_id: null,       // ID de categoría (número)
        status_id: null          // ID de estado (número)
      },
      originalItem: {
        name: null,               // Nombre del producto
        quantity: null,          // Cantidad (número)
        unit_price: null,        // Precio unitario (número)
        total_price: null,       // Precio total (número, calculado)
        purchase_place: null,    // Lugar de compra (string)
        purchase_date: null,     // Fecha de compra (Date/string)
        expiration_date: null,   // Fecha de vencimiento (Date/string)
        additional_notes: null,  // Notas adicionales (string)
        warehouse_id: null,      // ID del almacén (número)
        category_id: null,       // ID de categoría (número)
        status_id: null          // ID de estado (número)
      },
      defaultItem: {
        name: null,               // Nombre del producto
        quantity: null,          // Cantidad (número)
        unit_price: null,        // Precio unitario (número)
        total_price: null,       // Precio total (número, calculado)
        purchase_place: null,    // Lugar de compra (string)
        purchase_date: null,     // Fecha de compra (Date/string)
        expiration_date: null,   // Fecha de vencimiento (Date/string)
        additional_notes: null,  // Notas adicionales (string)
        warehouse_id: null,      // ID del almacén (número)
        category_id: null,       // ID de categoría (número)
        status_id: null          // ID de estado (número)
      },
      textFieldRefs: [],
      currentParameterIndex: 0,
      waitingForConfirmation: false,
      status: [],
      wharehouses: [],
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
    validationRules() {
      return {
        name: [
          (v) =>
            !!v ||
            this.$t("product.validation.required", {
              field: this.$t("product.fields.name"),
            }),
          (v) =>
            (v && v.length >= 3) ||
            this.$t("product.validation.min_length", {
              field: this.$t("product.fields.name"),
              length: 3,
            }),
        ],
        unit_price: [
          (v) =>
            !!v ||
            this.$t("product.validation.required", {
              field: this.$t("product.fields.unit_price"),
            }),
          (v) =>
            !isNaN(v) ||
            this.$t("product.validation.invalid_number", {
              field: this.$t("product.fields.unit_price"),
            }),
          (v) =>
            v >= 0 ||
            this.$t("product.validation.min_value", {
              field: this.$t("product.fields.unit_price"),
              value: 0,
            }),
        ],
        quantity: [
          (v) =>
            !!v ||
            this.$t("product.validation.required", {
              field: this.$t("product.fields.quantity"),
            }),
          (v) =>
            !isNaN(v) ||
            this.$t("product.validation.invalid_number", {
              field: this.$t("product.fields.quantity"),
            }),
          (v) =>
            v >= 0 ||
            this.$t("product.validation.min_value", {
              field: this.$t("product.fields.quantity"),
              value: 0,
            }),
        ],
        status_id: [
          (v) =>
            !!v ||
            this.$t("product.validation.required", {
              field: this.$t("product.fields.status"),
            }),
        ],
        category_id: [
          (v) =>
            !!v ||
            this.$t("product.validation.required", {
              field: this.$t("product.fields.category"),
            }),
        ],
        purchase_date: [
          (v) =>
            !!v ||
            this.$t("product.validation.required", {
              field: this.$t("product.fields.purchase_date"),
            }),
        ],
        expiration_date: [
          (v) =>
            !v ||
            v >= this.productParameters.purchase_date ||
            this.$t("product.validation.invalid_date"),
        ],
      };
    },
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
  if (typeof productData === 'string') {
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

    /*if (this.productData) {
      try {
        await this.loadRequiredData();
        // Copiar los datos de la tarea
          this.productParameters = {
                          ...this.productParameters,
                          ...productData,
                        };
          this.productDataCollectionMode = true;
          this.currentIntent = productData.type || "Tarea";
        // Mostrar en el chat
        this.chatMessages.push({
          from: "ai",
          text: `Datos de la  ${this.currentIntent} recibidos. Puedes editarlos antes de confirmar.`,
          timestamp: new Date().toLocaleTimeString(),
        });

        // Iniciar flujo de edición
        
  
      await this.showInitialproductData(productData);
      } catch (error) {
        this.showAlert("error", "Error al cargar datos: " + error.message);
      }
    }*/ if (this.productData) {
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
        text: `Detecté que deseas registrar un ${this.currentIntent}, pero no se ha proporcionado una cantidad. Por favor, podrías especificar mejor lo que deseas hacer.`,
        timestamp: new Date().toLocaleTimeString(),
      });

      // Reiniciar estado para evitar datos parciales
       this.productDataCollectionMode = false;
      this.currentIntent = null;
      this.productParameters = {
        budget_type: null,
        amount: null,
        description: null,
        start_date: null,
        end_date: null,
        category_id: null,
        currency: "CLP",
        status: "Activo",
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
    onSelected(index, selected) {
      console.log("Categoría seleccionada:", selected);
      this.chatMessages[index].editValue = selected;
      
      // Si es selección inicial, guardar inmediatamente
      if (this.isInitialCategorySelection) {
        this.saveFieldEdit(index);
      }
      // Si es edición, esperará a blur o acción explícita
    },

    onBlur(index) {
      setTimeout(() => {
        const message = this.chatMessages[index];
        if (message && message.isEditing) {
          // Solo guardar si no es selección inicial (ya que esa se maneja en onBudgetSelected)
          if (!this.isInitialCategorySelection) {
            this.saveFieldEdit(index);
          }
        }
      }, 200);
    },

    onClear(index) {
      console.log("Selección de presupuesto limpiada");
      const message = this.chatMessages[index];
      // Establecer editValue a null
      message.editValue = null;
      // Guardar inmediatamente el valor null
      this.saveFieldEdit(index);
    },
    onSelectedStatus(index, selected) {
      console.log("Estado seleccionada:", selected);
      this.chatMessages[index].editValue = selected;
      
      // Si es selección inicial, guardar inmediatamente
      if (this.isInitialStatusSelection) {
        this.saveFieldEdit(index);
      }
      // Si es edición, esperará a blur o acción explícita
    },

    onBlurStatus(index) {
      setTimeout(() => {
        const message = this.chatMessages[index];
        if (message && message.isEditing) {
          // Solo guardar si no es selección inicial (ya que esa se maneja en onBudgetSelected)
          if (!this.isInitialStatusSelection) {
            this.saveFieldEdit(index);
          }
        }
      }, 200);
    },
    onSelectedWarehouse(index, selected) {
      console.log("Almacén seleccionado:", selected);
      this.chatMessages[index].editValue = selected;
      
      // Si es selección inicial, guardar inmediatamente
      if (this.isInitialWarehouseSelection) {
        this.saveFieldEdit(index);
      }
      // Si es edición, esperará a blur o acción explícita
    },

    onBlurWarehouse(index) {
      setTimeout(() => {
        const message = this.chatMessages[index];
        if (message && message.isEditing) {
          // Solo guardar si no es selección inicial (ya que esa se maneja en onBudgetSelected)
          if (!this.isInitialWarehouseSelection) {
            this.saveFieldEdit(index);
          }
        }
      }, 200);
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
    closeDialgChat() {
      this.dialogChatTask = false;
      this.dialogProduct = false;
      this.dialogChatFinance = false;
      this.dialogChatBudget = false;
      this.dialogChatWarehouse = false;
      this.texto = "";
      this.textoTemporal = "";
      this.currentTask = null;
      this.currentProduct = null;
      this.currentFinance = null;
      this.currentBudget = null;
      this.currentWarehouse = null;
      this.$emit("close-all-dialogs", "ChatBudgets");
      //this.initialize();
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
        (message.showDatePicker === false) &&
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

      if (["purchase_date", "expiration_date"].includes(this.chatMessages[index].fieldKey)) {
        this.$nextTick(() => {
          this.chatMessages[index].showDatePicker = true;
        });
      }  else {
        this.$nextTick(() => {
          const textField = this.textFieldRefs[index];
          if (textField) {
            textField.focus();
          }
        });
      }
    },
    async saveFieldEdit(index) {
      const message = this.chatMessages[index];
      console.log("Mensaje a guardar:", message);
      
      try {
        let valueToValidate = message.editValue;

        // Caso especial para category_id
        if (message.fieldKey === "category_id" && typeof valueToValidate === "object" && valueToValidate !== null) {
          valueToValidate = valueToValidate.id;
        }

        if (message.fieldKey === "status_id" && typeof valueToValidate === "object" && valueToValidate !== null) {
          valueToValidate = valueToValidate.id;
        }

        if (message.fieldKey === "warehouse_id" && typeof valueToValidate === "object" && valueToValidate !== null) {
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
        this.scrollToBottom();

        // Continuar el flujo solo si:
        // 1. Es la primera selección de categoría (category_id era null/undefined)
        // 2. O es cualquier otro campo durante la recolección inicial de datos
       const shouldContinueFlow = 
          // Si es la primera selección de categoría
          (message.fieldKey === "category_id" && this.isInitialCategorySelection) ||
          // O la primera selección de estado
          (message.fieldKey === "status_id" && this.isInitialStatusSelection) ||
          // O la primera selección de almacén
          (message.fieldKey === "warehouse_id" && this.isInitialWarehouseSelection) ||
          // O cualquier otro campo durante la recolección inicial de datos
          (message.fieldKey !== "category_id" && 
          message.fieldKey !== "status_id" && 
          message.fieldKey !== "warehouse_id" && 
          this.isInitialDataCollection);

        if (shouldContinueFlow) {
          // Marcar que ya no es la primera selección para cada campo específico
          switch (message.fieldKey) {
            case "category_id":
              this.isInitialCategorySelection = false;
              break;
            case "status_id":
              this.isInitialStatusSelection = false;
              break;
            case "warehouse_id":
              this.isInitialWarehouseSelection = false;
              break;
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
      /*try {
        const validatedValue = this.validateField(message.fieldKey, message.editValue);
        this.productParameters[message.fieldKey] = validatedValue;
        message.currentValue = validatedValue;
        message.text = `• ${message.fieldLabel}: ${validatedValue}`;
        message.isEditing = false;
         this.updateSummaryMessage();
        this.scrollToBottom();
      } catch (error) {
        this.showAlert("error", error.message, 2000);
        message.editValue = message.currentValue;
        message.isEditing = false;
      }*/
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
          }

          if (this.waitingForConfirmation) {
            await this.handleConfirmation(tempMessage);
            return;
          }

          if (this.collectingPeople) {
            await this.processPeopleSelection(tempMessage);
            return;
          }

          if (!this.productDataCollectionMode) {
            const response = await handleRequest({
              endpoint: "ask-ai-task",
              method: "POST",
              data: {
                question: tempMessage,
                issue: "Eres un asistente para gestión de tareas y metas.",
              },
            });
            this.isTyping = false;
        const { intentDetected, intent, task, answer, finances, budget, warehouse } = response.data;
            if (intentDetected && intent) {

              this.data = { home_id: this.home_id };
                switch (intent) {
            case "Tarea":
              this.$nextTick(async () => {
                  this.productParameters = {
                    ...this.productParameters,
                    ...task,
                  };
                 this.currentIntent = intent;
                  this.productDataCollectionMode = true;
                  this.chatMessages.push({
                    from: "ai",
                    text: `Datos de la  ${this.currentIntent} recibidos. Puedes editarlos antes de confirmar.`,
                    timestamp: new Date().toLocaleTimeString(),
                  });
                  await this.loadRequiredData();
                  await this.showInitialproductData(response.data.task);
                  this.scrollToBottom();
                });
              break;

            case "Meta":
              this.$nextTick(async () => {
                  this.productParameters = {
                    ...this.productParameters,
                    ...task,
                  };
                 this.currentIntent = intent;
                  this.productDataCollectionMode = true;
                  this.chatMessages.push({
                    from: "ai",
                    text: `Datos de la  ${this.currentIntent} recibidos. Puedes editarlos antes de confirmar.`,
                    timestamp: new Date().toLocaleTimeString(),
                  });
                  await this.loadRequiredData();
                  await this.showInitialproductData(task);
                  this.scrollToBottom();
                });
              break;
              case "Gasto":
              this.currentFinance = null;
              this.$nextTick(() => {
                const financeData =
                  typeof response.data.finances === "string"
                    ? JSON.parse(response.data.finances)
                    : response.data.finances;

              
                if(financeData.spent <= 0)
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
                  typeof response.data.finances === "string"
                    ? JSON.parse(response.data.finances)
                    : response.data.finances;

              
                if(financeData.income <= 0)
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
              this.currentBudget = null;
              this.$nextTick(() => {
                const productData =
                  typeof response.data.budget === "string"
                    ? JSON.parse(response.data.budget)
                    : response.data.budget;
                if(productData.amount <= 0)
                {
                this.chatMessages.push({
                from: "ai",
                text:
                  /*answer ||*/
                  "Detecte que desea registrar un presupuesto pero no especificaste el monto, podrías ser mas especifico",
                timestamp: new Date().toLocaleTimeString(),
              });
            }else{
                this.currentBudget = _.cloneDeep(productData);
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
              this.chatMessages.push({
                from: "ai",
                text:
                  answer ||
                  "No entendí muy bien tu solicitud. ¿Podrías ser más específico?",
                timestamp: new Date().toLocaleTimeString(),
              });
          }
              /*if (response.data.task) {
                this.productParameters = {
                  ...this.productParameters,
                  ...response.data.task,
                };
              }
              await this.loadRequiredData();
              this.currentIntent = response.data.intent;
              this.productDataCollectionMode = true;
              await this.showInitialproductData(response.data.task);*/
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
      await this.showSummary(productData);
      await this.startAutomaticDataCollection();
    },
    async showSummary(productData) {
      const fieldsToShow = [
        { key: "name", label: "Nombre del producto" },
        { key: "quantity", label: "Cantidad" },
        { key: "unit_price", label: "Precio unitario" },
        { key: "total_price", label: "Importe total" },
        { key: "purchase_place", label: "Lugar de compra" },
        { key: "purchase_date", label: "Fecha de compra" },
        { key: "expiration_date", label: "Fecha de vencimiento" },
        { key: "additional_notes", label: "Notas adicionales" },
        { key: "category_id", label: "Categoría" },
        { key: "warehouse_id", label: "Almacén asociado" },
        { key: "status_id", label: "Estado del producto" },
      ];

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
          if (field.key === "status_id") {
            // Buscar el nombre del presupuesto para mostrar
            const productInfo = this.status.find((b) => b.id === value);
            displayValue = productInfo ? `${productInfo.nameStatus}` : `ID: ${value}`;
            // Pasar los budgets disponibles para la edición con autocomplete
            additionalData.availableStatus = this.status;
          }

          if (field.key === "warehouse_id") {
            // Buscar el nombre del presupuesto para mostrar
            const warehouseInfo = this.warehouses.find((b) => b.id === value);
            displayValue = warehouseInfo ? `${warehouseInfo.title}` : `ID: ${value}`;
            // Pasar los budgets disponibles para la edición con autocomplete
            additionalData.availableWarehouses = this.warehouses;
          }

          this.chatMessages.push({
            from: "ai",
            text: `• ${field.label}: ${displayValue}`, // Usar displayValue formateado
            timestamp: new Date().toLocaleTimeString(),
            isEditable: true,
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
    async startAutomaticDataCollection() {
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

      // --- 🔁 Solo actualizar resumen si YA EXISTE (no crearlo aquí) ---
      this.updateSummaryMessage();

      // Si ya no hay campos faltantes, completar
      if (!nextField) {
        this.completeCreation(); // Aquí ya no genera resumen, solo confirmación
        return;
      }
        // Si ya fue mostrado, no mostramos de nuevo
      if (this.shownChatFields.has(nextField)) {
        return;
      }

      // Marcar como mostrado ANTES de mostrar el mensaje
      this.shownChatFields.add(nextField);

      console.log("nextField");
      console.log(nextField);
      /*if (nextField === "type") {
        await this.showTypeOptions();
      } else if (nextField === "priority_id") {
        await this.showPriorityOptions();
      } else if (nextField === "people") {
        await this.showPeopleSelector();
      } else if (nextField === "recurrence") {
        await this.showRecurrenceOptions();
      } else*/ if (nextField) {
        this.showFieldInput(nextField);
      } else {
        this.completeCreation();
      }
    },
    updateSummaryMessage() {
      const summaryIndex = this.chatMessages.findIndex(msg => msg.isSummary);
      if (summaryIndex !== -1) {
        // Solo actualizamos si ya existe
        this.chatMessages[summaryIndex].text = this.generateSummary();
        this.chatMessages[summaryIndex].timestamp = new Date().toLocaleTimeString();
        this.scrollToBottom();
      }
    },
    updateOrCreateSummary() {
      const summaryIndex = this.chatMessages.findIndex(msg => msg.isSummary);
      const newSummary = this.generateSummary();

      if (summaryIndex === -1) {
        // 🔹 Crear solo aquí (en completeCreation)
        this.chatMessages.push({
          from: "ai",
          text: newSummary,
          timestamp: new Date().toLocaleTimeString(),
          isSummary: true,
        });
      } else {
        // 🔹 Actualizar si ya existe
        this.chatMessages[summaryIndex].text = newSummary;
      }

      this.scrollToBottom();
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

       if (field === "category_id") {
    // Verificar si es la primera vez (valor null/undefined)
    this.isInitialCategorySelection = (
      this.productParameters[field] === null || 
      this.productParameters[field] === undefined
    );
      // Si es la primera vez, mostrar el mensaje de selección
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
      availableCategories: this.categories, // Pasar las categorías para el autocomplete
    });
    return; // Salir para no ejecutar el código posterior
  }

   if (field === "staus_id") {
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

   if (field === "warehouse_id") {
    // Verificar si es la primera vez (valor null/undefined)
  this.isInitialWarehouseSelection = (
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
      availableWarehouses: this.warehouses, // Pasar las categorías para el autocomplete
    });
    return; // Salir para no ejecutar el código posterior
  }

      this.chatMessages.push({
        from: "ai",
        text: `Por favor, ingresa ${fieldLabels[field] || field}:`,
        timestamp: new Date().toLocaleTimeString(),
        isFieldPrompt: true,
        fieldName: field,
        fieldLabel: fieldLabels[field] || field,
      });
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
    showAlert(type, message, timeout) {
      this.sb_type = type;
      this.sb_message = message;
      this.sb_timeout = timeout;
      this.sb_icon = type === "success" ? "mdi-check-circle" : "mdi-alert-circle";
      this.snackbar = true;
    },
    cancelSelection() {
      // Limpiar selección de personas
      this.productParameters.people = [];
      this.productParameters = Object.assign({}, this.defaultItem);
      this.originalItem = Object.assign({}, this.defaultItem);
      this.chatMessages.push({
        from: "ai",
        text: "Creación cancelada. ¿En qué más puedo ayudarte?",
        timestamp: new Date().toLocaleTimeString(),
      });
    },
   completeCreation() {
      this.isTyping = true;
      this.productDataCollectionMode = false;

      // ✅ Aquí sí: crear o actualizar el resumen
      this.updateOrCreateSummary();

      // ❌ Eliminar solo confirmación anterior
      this.chatMessages = this.chatMessages.filter(msg => !msg.isConfirmation);

      // ✅ Mostrar confirmación
      this.chatMessages.push({
        from: "ai",
        text: `¿Deseas crear esta ${this.currentIntent.toLowerCase()} con los datos proporcionados?`,
        timestamp: new Date().toLocaleTimeString(),
        isConfirmation: true,
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
      generateSummary() {
      let summary = `Resumen de la ${this.currentIntent}:\n\n`;

      const parameterLabels = {
        type: "Tipo",
        title: "Título",
        description: "Descripción",
        priority_id: "Prioridad",
        start_date: "Fecha inicio",
        estimated_time: "Duración estimada",
        recurrence: "Recurrencia",
        end_date: "Fecha fin",
        geo_location: "Ubicación",
      };

      Object.keys(parameterLabels).forEach((key) => {
        const value = this.productParameters[key];
        if (value !== null && value !== undefined && value !== "") {

          if (key === "status_id") {
            const status = this.status.find((p) => p.id === value);
            summary += `• ${parameterLabels[key]}: ${status?.nameStatus || "No especificado"}\n`;
          } else if (key === "category_id") {
            const category = this.categories.find((p) => p.id === value);
            summary += `• ${parameterLabels[key]}: ${category?.nameCategory || "No especificada"}\n`;
          }else if (key === "warehouse_id") {
            const warehouse = this.warehouses.find((p) => p.id === value);
            summary += `• ${parameterLabels[key]}: ${warehouse?.title || "No especificado"}\n`;
          } else if (key === "purchase_date" || key === "expiration_date") {
            const timeKey = key.replace("_date", "_time");
            const timeValue = this.productParameters[timeKey];
            const fullValue = timeValue ? `${value} ${timeValue}` : value;
            summary += `• ${parameterLabels[key]}: ${fullValue}\n`;
          } else if (!key.endsWith("_time")) {
            summary += `• ${parameterLabels[key]}: ${value}\n`;
          }
        }
      });
      return summary;
    },
    // Maneja la confirmación del usuario
    async handleConfirmation(userResponse) {
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
          ...(this.productParameters.type === "Meta" ? ["end_date", "end_time"] : []),
        ];
        let updatedFields = Object.keys(this.productParameters)
          .filter((key) => {
            return (
              fieldsToUpdate.includes(key) &&
              this.productParameters[key] !== this.originalItem[key] &&
              this.productParameters[key] !== null &&
              this.productParameters[key] !== undefined &&
              this.productParameters[key] !== ""
            );
          })
          .reduce((obj, key) => {
            if (key === "people") {
              // Transformar el campo `people`
              obj[key] = this.productParameters.people.map((person) => ({
                home_id: Number(this.home_id), // Asegurar que sea un número
                person_id: Number(person.id), // Asegurar que sea un número
                role_id: Number(person.roleId),
                roleName: person.roleName,
              }));
            } else {
              obj[key] = this.productParameters[key];
            }
            return obj;
          }, {});

        // Agregar campos adicionales si es necesario
        if (Object.keys(updatedFields).length > 0) {
          updatedFields.home_id = this.home_id;
          updatedFields.start_date = this.productParameters.start_date
            ? this.productParameters.start_date
            : `${new Date().getFullYear()}-${String(new Date().getMonth() + 1).padStart(
                2,
                "0"
              )}-${String(new Date().getDate()).padStart(2, "0")}`;
          updatedFields.estimated_time = this.productParameters.estimated_time
            ? this.productParameters.estimated_time
            : 0;
          updatedFields.type = this.productParameters.type
            ? this.productParameters.type
            : "Tarea";
          if (this.productParameters.type !== "Meta") {
            delete updatedFields.end_date;
            delete updatedFields.end_time;
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
              this.chatMessages.push({
                from: "ai",
                text: `✅ ${this.currentIntent} creada exitosamente!`,
                timestamp: new Date().toLocaleTimeString(),
              });
              //aqui comienza los cambios de mostrar las sugerencias
              if (result.data?.suggestedTasks?.length > 0) {
                this.showSuggestedTasks(result.data.suggestedTasks);
              }else{
                this.handleCancellation();
              }
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
            text: "No se realizaron cambios en la tarea/meta.",
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
      this.productDataCollectionMode = false;
      this.currentIntent = null;
      this.productParameters = {
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
      };
      this.waitingForConfirmation = false;
      this.collectingPeople = false;
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
      this.$emit("close-all-dialogs", "ChatTask");

    },
    //date y time
    /*showDatePicker(fieldType) {
      this.isTyping = true;

      const messageText =
        fieldType === "purchase_date"
          ? "Selecciona la fecha de compra:"
          : "Selecciona la fecha de expiración:";

      setTimeout(() => {
        this.chatMessages.push({
          from: "ai",
          text: messageText,
          component: "DatePicker",
          props: {
            dateValue: this.productParameters[fieldType],
            fieldType: fieldType,
            minDate: fieldType === "purchase_date" ? this.productParameters.purchase_date : null,
          },
          timestamp: new Date().toLocaleTimeString(),
        });

        this.isTyping = false;
        this.scrollToBottom();
      }, 500);
    },*/
    async handleDateSelection(field, dateEvent) {
      const { value } = dateEvent;

      // Actualizar el valor en productParameters
      this.productParameters[field] = value;

      // Encontrar el mensaje correspondiente
      const message = this.chatMessages.find((m) => m.fieldKey === field);

      if (message) {
        message.currentValue = value;
        message.editValue = value;
        message.text = `• ${message.fieldLabel}: ${value}`;
        message.isEditing = false;
      }

      // Continuar con el flujo automático
      await this.startAutomaticDataCollection();
    },
    async updateEndDateVisibilityInChat(isMeta) {
  //const isMeta = this.productParameters.type === "Meta";
  console.log("Actualizando visibilidad de fechas. ¿Es Meta?", isMeta);

  // Campos que queremos controlar
  const dateFields = ["end_date", "end_time"];

  dateFields.forEach((fieldKey) => {
    const messageIndex = this.chatMessages.findIndex(
      (m) => m.fieldKey === fieldKey
    );

    if (isMeta) {
      // Si es Meta y el mensaje no existe, hay que crearlo
      if (messageIndex === -1) {
        const value = this.productParameters[fieldKey];
        if (value) {
          const fieldLabel = fieldKey === "end_date" ? "Fecha de finalización" : "Hora de finalización";

          const newMessage = {
            from: "ai",
            text: `• ${fieldLabel}: ${value}`,
            timestamp: new Date().toLocaleTimeString(),
            isEditable: true,
            fieldKey: fieldKey,
            fieldLabel: fieldLabel,
            currentValue: value,
            editValue: value,
            isEditing: false,
            showDatePicker: false,
          };

          // Insertar en orden adecuado (opcional: busca posición lógica)
          const insertIndex = this.chatMessages.findIndex(m => m.fieldKey === "start_time") + 1;
          this.chatMessages.splice(insertIndex >= 0 ? insertIndex : this.chatMessages.length, 0, newMessage);
        }
      }
      // Si ya existe, aseguramos que esté visible (no hacemos nada, ya está)
    } else {
      // Si NO es Meta, debemos eliminarlo del chat si existe
      if (messageIndex > -1) {
        this.chatMessages.splice(messageIndex, 1);
        // Opcional: también limpiar de shownChatFields
        this.shownChatFields.delete(fieldKey);
      }
    }
  });
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
