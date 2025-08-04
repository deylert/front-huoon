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
          ]" style="min-width: 0; max-width: 100%; width: fit-content">
                  <!-- Campo editable con componente -->
                  <template v-if="message.isEditable && message.isEditing">
                    <div v-if="message.fieldKey === 'category_id'">
                      <v-autocomplete v-model="message.editValue" :items="message.availableCategories || categories"
                        :label="message.fieldLabel" item-title="nameCategory" variant="outlined" item-value="id" density="comfortable"
                        style="width: auto; min-width: 20em" return-object hide-details
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
                    <div v-else-if="message.fieldKey === 'status_id'">
                      <v-autocomplete v-model="message.editValue" :items="message.availableStatus || status"
                        :label="message.fieldLabel" item-title="nameStatus" item-value="id" variant="outlined"
                        density="comfortable" style="width: auto; min-width: 20em" return-object hide-details
                        @update:modelValue="onStatusSelected(index, $event)" @blur="onStatusBlur(index)"
                        @click:clear="onStatusClear(index)">
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
                    <div v-else-if="message.fieldKey === 'warehouse_id'">
                      <v-autocomplete v-model="message.editValue" :items="message.availableWarehouses || warehouses"
                        :label="$t('warehouse.fields.warehouse')" item-title="title" item-value="warehouse_id"
                        variant="outlined" density="comfortable" style="width: auto; min-width: 20em" return-object
                        hide-details @update:modelValue="onWarehouseSelected(index, $event)"
                        @blur="onWarehouseBlur(index)" @click:clear="onWarehouseClear(index)">
                        <template v-slot:item="{ props, item }">
                          <v-list-item v-bind="props">
                            <v-list-item-subtitle class="d-flex flex-column">
                              <v-tooltip location="top right">
                                <template v-slot:activator="{ props }">
                                  <div class="description-text" v-bind="props" :title="item.raw.description">
                                    {{ $t("warehouse.fields.description") }}:
                                    {{ item.raw.description }}
                                  </div>
                                </template>
                                <span>{{ item.raw.description }}</span>
                              </v-tooltip>
                              <v-tooltip location="top right">
                                <template v-slot:activator="{ props }">
                                  <div class="description-text" v-bind="props" :title="item.raw.location">
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
                    </div>
                    <div v-else-if="['purchase_date', 'expiration_date'].includes(message.fieldKey)">
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
                    <!-- Para campos de hora -->

                    <v-textarea v-else-if="['title', 'additional_notes', 'purchase_place'].includes(message.fieldKey)"
                      v-model="message.editValue" :label="message.fieldLabel" variant="outlined" density="comfortable"
                      style="width: auto; min-width: 50em" :ref="(el) => setTextFieldRef(el, index)" autofocus auto-grow
                      rows="2" no-resize @keyup.enter="saveFieldEdit(index)" @blur="onFliedBlur(index)"></v-textarea>

                    <!-- Textfield para otros campos -->
                    <v-text-field v-else v-model="message.editValue" :label="message.fieldLabel" variant="outlined"
                      density="comfortable" style="width: auto; min-width: 15em"
                      :ref="(el) => setTextFieldRef(el, index)" autofocus no-resize @keyup.enter="saveFieldEdit(index)"
                      @blur="onFliedBlur(index)"></v-text-field>
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
                    v-bind="message.props" @date-updated="updateDate($event)" />
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
        <ChatFinance :financeData="currentFinance" :transactionIntent="currentIntentFinance"
          @close-dialog="closeDialgChat()" @close-all-dialogs="$emit('close-all-dialogs')" />
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
          @close-all-dialogs="$emit('close-all-dialogs')" />
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
    ChatTask: defineAsyncComponent(() => import('./ChatTask.vue')),
  },
  data() {
    return {
      shownChatFields: new Set(), // ← Aquí llevamos control
       dialogChatFinance: false,
        dialogChatBudget: false,
        dialogChatWarehouse: false,
        dialogChatTask: false,
        editingFieldKey: null,
      currentBudget: null,
      currentFinance: null,
      currentWarehouse: null,
      currentTask: null,
      currentIntentFinance: null,
      isInitialCategorySelection: false,
      isInitialStatusSelection: false,
      isInitialWarehouseSelection: false,
      textoTemporal: "",
      productDataCollectionMode: false,
      currentProductIntent: null,
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
      collectingPeople: false,
      currentRoleSelection: null,
      categories: [],
      warehouses: [],
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
    if (this.productData) {
      try {
        await this.loadRequiredData();
        // Copiar los datos de la tarea
          this.productParameters = {
                          ...this.productParameters,
                          ...productData,
                        };
          this.productDataCollectionMode = true;
          this.currentProductIntent = "Producto";
        if (isNaN(productData.quantity) || isNaN(productData.unit_price) || productData.quantity <= 0 || productData.unit_price <= 0) {
                    this.chatMessages.push({
                      from: "ai",
                      text: "⚠️ Parece que aún no has especificado bien la **cantidad** o el **precio unitario** del producto. Ambos deben ser valores numéricos mayores a cero. ¿Podrías revisarlo y corregirlo, por favor?",
                      timestamp: new Date().toLocaleTimeString(),
                    });
                    return; // Detener el flujo hasta que se corrijan
                  }
                  else{
                    
        // Mostrar en el chat
        this.chatMessages.push({
          from: "ai",
          text: `Datos del  ${this.currentProductIntent} recibidos. Puedes editarlos antes de confirmar.`,
          timestamp: new Date().toLocaleTimeString(),
        });

        // Iniciar flujo de edición
        
  
      await this.showInitialData(productData);
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
    onFieldBlur(index) {
  // Si el campo pierde foco pero el chat está esperando edición, no cerramos
  if (this.editingFieldKey === index && this.newMessage.trim()) {
    return; // Deja que sendMessage lo maneje
  }

  // Si no, cerramos edición solo si no hay input en el chat
  if (!this.newMessage.trim()) {
    this.chatMessages[index].isEditing = false;
    this.editingFieldKey = null;
  }
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
    onWarehouseSelected(index, selectedWarehouse) {
      console.log("Almacén seleccionado:", selectedWarehouse);
      this.chatMessages[index].editValue = selectedWarehouse;
      
      // Si es selección inicial, guardar inmediatamente
      if (this.isInitialWarehouseSelection) {
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

    onWarehouseBlur(index) {
      setTimeout(() => {
        const message = this.chatMessages[index];
        if (message && message.isEditing) {
          // Solo guardar si no es selección inicial (ya que esa se maneja en onCategorySelected)
          if (!this.isInitialWarehouseSelection) {
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
    onWarehouseClear(index) {
      console.log("Selección del almacen limpiada");
      const message = this.chatMessages[index];
      // Establecer editValue a null
      message.editValue = null;
      // Guardar inmediatamente el valor null
     if (!this.isInitialWarehouseSelection) {
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
     const message = this.chatMessages[index];
      this.editingFieldKey = message.fieldKey; // ← Marcamos que este campo está en edición

      message.isEditing = true;
      message.editValue = message.currentValue;

      if (["purchase_date", "expiration_date"].includes(message.fieldKey)) {
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
   async saveFieldEdit(index) {
      console.log("saveFieldEdit", index);
      const message = this.chatMessages[index];
      console.log("Mensaje a guardar:", message);
      
      try {
        // 1. Obtener y validar el valor
        let valueToValidate = message.editValue;

        // Manejar casos especiales donde el valor es un objeto (selects)
        if (["category_id", "warehouse_id", "status_id"].includes(message.fieldKey)) {
          if (typeof valueToValidate === "object" && valueToValidate !== null) {
          if (message.fieldKey === "category_id" || message.fieldKey === "status_id") {
            valueToValidate = valueToValidate.id;
          } else if (message.fieldKey === "warehouse_id") {
            valueToValidate = valueToValidate.warehouse_id; // ✅ Correcto para warehouse
          }
        }
        }

        // Permitir campos opcionales vacíos (purchase_place, expiration_date, additional_notes)
        const optionalFields = ["purchase_place", "expiration_date", "additional_notes"];
        if (optionalFields.includes(message.fieldKey) && (valueToValidate === null || valueToValidate === "")) {
          valueToValidate = undefined; // Marcamos como undefined para indicar que es opcional
        }

        const validatedValue = this.validateField(message.fieldKey, valueToValidate);
        this.productParameters[message.fieldKey] = validatedValue;

        // 2. Actualizar la visualización del mensaje
        let displayValue = validatedValue;
        if (message.fieldKey === "category_id" && typeof message.editValue === "object") {
          displayValue = message.editValue.nameCategory;
        } else if (message.fieldKey === "status_id" && typeof message.editValue === "object") {
          displayValue = message.editValue.nameStatus;
        } else if (message.fieldKey === "warehouse_id" && typeof message.editValue === "object") {
          displayValue = message.editValue.title;
        } else if (optionalFields.includes(message.fieldKey) && !validatedValue) {
          displayValue = "(Seleccionar)"; // Mantener el placeholder para opcionales vacíos
        }

        message.currentValue = validatedValue;
        message.text = `• ${message.fieldLabel}: ${displayValue}`;
        message.isEditing = false;

        // 3. Recalcular total_price si se editó quantity o unit_price
        if (["quantity", "unit_price"].includes(message.fieldKey)) {
          const quantity = parseFloat(this.productParameters.quantity) || 0;
          const unitPrice = parseFloat(this.productParameters.unit_price) || 0;
          const totalPrice = (quantity * unitPrice).toFixed(2);

          this.productParameters.total_price = parseFloat(totalPrice);

          // Actualizar el mensaje de total_price si existe
          const totalMessageIndex = this.chatMessages.findIndex(m => m.fieldKey === "total_price");
          if (totalMessageIndex !== -1) {
            const totalMsg = this.chatMessages[totalMessageIndex];
            totalMsg.currentValue = parseFloat(totalPrice);
            totalMsg.text = `• ${totalMsg.fieldLabel}: ${totalPrice}`;
            totalMsg.editValue = parseFloat(totalPrice);
          }
        }

        this.scrollToBottom();

        // 4. Determinar qué acción tomar después de guardar
        const isInitialSelection = (
          (message.fieldKey === "category_id" && this.isInitialCategorySelection) ||
          (message.fieldKey === "status_id" && this.isInitialStatusSelection) ||
          (message.fieldKey === "warehouse_id" && this.isInitialWarehouseSelection)
        );

        if (isInitialSelection) {
      // Es la primera vez que se ingresa un dato clave
      if (message.fieldKey === "category_id") this.isInitialCategorySelection = false;
      if (message.fieldKey === "status_id") this.isInitialStatusSelection = false;
      if (message.fieldKey === "warehouse_id") this.isInitialWarehouseSelection = false;

      await this.startAutomaticDataCollection();
    }
    else if (this.productDataCollectionMode) {
      // Modo automático: seguir recolectando
      await this.startAutomaticDataCollection();
    }
    else {
      // Modo edición (después de haber completado)
      // Pero: ¿todavía faltan campos obligatorios?
      if (this.isFormComplete()) {
        this.updateSummaryMessage(); // Todo bien, actualiza resumen
      } else {
        // ❌ Aún faltan campos obligatorios: NO mostrar resumen
        // Solo actualiza el mensaje editado, pero no avances
        console.log("Aún faltan campos obligatorios. No se actualiza el resumen completo.");
        // Opcional: puedes mostrar un mensaje al usuario
        // this.showAlert("error", "Faltan campos obligatorios por completar", 2000);
      }
    }
    this.editingFieldKey = null;
      } catch (error) {
        console.error("Error al guardar edición:", error);
        this.showAlert("error", error.message, 2000);
        message.editValue = message.currentValue;
        message.isEditing = false;
      }
    },
    isFormComplete() {
      const requiredFields = [
        "name",
        "quantity",
        "unit_price",
        "purchase_date",
        "status_id",
        "category_id"
        // Añade más si "warehouse_id" es obligatorio cuando hay categoría
      ];

      // Si hay categoría, warehouse_id también es obligatorio
      const hasCategory = this.productParameters.category_id;
      if (hasCategory) {
        requiredFields.push("warehouse_id");
      }

      return requiredFields.every(field => {
        const value = this.productParameters[field];
        return value !== null && value !== undefined && value !== "";
      });
    },
//okkk
    async sendMessage() {
        if (this.editingFieldKey) {
    const fieldKey = this.editingFieldKey;
    const tempMessage = this.newMessage.trim();

    if (tempMessage) {
      // Encontrar el mensaje del campo que se está editando
      const messageIndex = this.chatMessages.findIndex(m => m.fieldKey === fieldKey && m.isEditable);
      if (messageIndex !== -1) {
        const message = this.chatMessages[messageIndex];

        // Simular edición: asignar valor temporal
        message.editValue = tempMessage;
        await this.saveFieldEdit(messageIndex); // Guardar
      }
    }

    // ✅ Resetear estado
    this.editingFieldKey = null;
    this.newMessage = "";
    return;
  }
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
        const { intentDetected, intent, task, answer, finances, budget, warehouse, product } = response.data;
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
              case "Gasto":
              this.currentFinance = null;
              this.$nextTick(() => {
                const financeData =
                  typeof finances === "string"
                    ? JSON.parse(finances)
                    : finances;

              
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
                this.currentIntentFinance = finances.intent;
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
                this.currentIntentFinance = finances.intent;
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
                this.chatMessages.push({
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
              this.$nextTick(async () => {
                  this.productParameters = {
                    ...this.productParameters,
                    ...product,
                  };
                if (isNaN(product.quantity) || isNaN(product.unitPrice) || product.quantity <= 0 || product.unitPrice <= 0) {
                    this.chatMessages.push({
                      from: "ai",
                      text: "⚠️ Parece que aún no has especificado bien la **cantidad** o el **precio unitario** del producto. Ambos deben ser valores numéricos mayores a cero. ¿Podrías revisarlo y corregirlo, por favor?",
                      timestamp: new Date().toLocaleTimeString(),
                    });
                    return; // Detener el flujo hasta que se corrijan
                  }else{
                  this.currentIntent = intent;
                  this.productDataCollectionMode = true;
                  this.chatMessages.push({
                    from: "ai",
                    text: `Datos del  ${this.currentIntent} recibidos. Puedes editarlos antes de confirmar.`,
                    timestamp: new Date().toLocaleTimeString(),
                  });
                  await this.loadRequiredData();
                  await this.showInitialData(product);
                  this.scrollToBottom();
                }
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
              this.currentProductIntent = response.data.intent;
              this.productDataCollectionMode = true;
              await this.showInitialData(response.data.task);*/
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
    /*async showSummary(productData) {
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
            const warehouse = this.warehouses.find((b) => b.warehouse_id === value);
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
    },*/
   async showSummary(productData) {
  const fieldsToShow = [
    { key: "name", label: "Nombre del producto" },
    { key: "quantity", label: "Cantidad" },
    { key: "unit_price", label: "Precio unitario" },
    { key: "total_price", label: "Importe total", editable: false },
    { key: "purchase_place", label: "Lugar de compra", optional: true },
    { key: "purchase_date", label: "Fecha de compra" },
    { key: "expiration_date", label: "Fecha de vencimiento", optional: true, dateField: true },
    { key: "additional_notes", label: "Notas adicionales", optional: true },
    { key: "status_id", label: "Estado del producto" },
    { key: "category_id", label: "Categoría" },
    { key: "warehouse_id", label: "Almacén asociado" }
  ];

  for (const field of fieldsToShow) {
    const value = productData[field.key];

    // ✅ 1. Validar dependencias antes de mostrar
    if (field.key === "warehouse_id" && !productData.category_id) {
      // No mostrar almacén si no hay categoría seleccionada
      continue;
    }

    // ✅ 2. No mostrar campos obligatorios vacíos que aún no pueden editarse
    if (!field.optional && (value === null || value === undefined || value === "")) {
      // No lo mostramos en el chat todavía
      // Solo lo mostraremos cuando el flujo lo requiera
      continue;
    }

    // ✅ 3. Ahora procesamos el valor para mostrar
    let displayValue = value;
    let additionalData = {};
    let isEmpty = false;

    if (field.key === "category_id") {
      const categoryInfo = this.categories.find((b) => b.id === value);
      displayValue = categoryInfo ? categoryInfo.nameCategory : "(Seleccionar categoría)";
      additionalData.availableCategories = this.categories;
      isEmpty = !value;
    } 
    else if (field.key === "warehouse_id") {
      const warehouse = this.warehouses
        .filter(w => w.category_id === productData.category_id) // ✅ Filtrar por categoría
        .find(w => w.warehouse_id === value);

      const warehouseOptions = this.warehouses.filter(w => w.category_id === productData.category_id);
      additionalData.availableWarehouses = warehouseOptions;

      displayValue = warehouse ? warehouse.title : "(Seleccionar almacén)";
      isEmpty = !value;
    }
    else if (field.key === "status_id") {
      const status = this.status.find((b) => b.id === value);
      displayValue = status ? status.nameStatus : "(Seleccionar estado)";
      additionalData.availableStatus = this.status;
      isEmpty = !value;
    }
    else if (field.key === "total_price") {
      displayValue = value ? `$${parseFloat(value).toFixed(2)}` : "$0.00";
    }
    else if (field.dateField) {
      displayValue = value || "(Seleccionar fecha)";
      additionalData.showDatePicker = !value;
      isEmpty = !value;
    }
    else if (field.optional) {
      displayValue = value || "(Seleccionar)";
      isEmpty = !value;
    }

    // ✅ 4. Solo ahora agregamos al chat
    this.chatMessages.push({
      from: "ai",
      text: `• ${field.label}: ${displayValue}`,
      timestamp: new Date().toLocaleTimeString(),
      isEditable: field.editable !== false,
      fieldKey: field.key,
      fieldLabel: field.label,
      currentValue: value,
      editValue: value,
      isEditing: false,
      showDatePicker: additionalData.showDatePicker || false,
      isEmpty: isEmpty,
      ...additionalData
    });

    this.shownChatFields.add(field.key);
  }
},

    async startAutomaticDataCollection() {
  const parametersOrder = [
    "name",
    "quantity",
    "unit_price",
    "total_price",
    "purchase_place",
    "purchase_date",
    "expiration_date",
    "additional_notes",
    "status_id",
    "category_id",
    "warehouse_id"
  ];

  // ✅ Buscar el primer campo que:
  // - No tiene valor
  // - No ha sido mostrado
  // - Y sus dependencias están resueltas
  const nextField = parametersOrder.find(field => {
    const value = this.productParameters[field];
    const hasValue = value !== null && value !== undefined && value !== "";

    if (hasValue || this.shownChatFields.has(field)) {
      return false;
    }

    // ✅ Dependencia: warehouse_id requiere category_id
    if (field === "warehouse_id" && !this.productParameters.category_id) {
      return false;
    }

    return true;
  });

  this.updateExistingSummary();

  if (!nextField) {
    if (this.isFormComplete()) {
    this.completeCreation();
  } else {
    console.warn("Faltan campos obligatorios, no se puede completar.");
  }
    return;
  }

  // ✅ Marcar como mostrado y mostrar input
  this.shownChatFields.add(nextField);
  await this.showFieldInput(nextField);
},
    updateExistingSummary() {
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
         name: "Nombre del producto",
                quantity: "Cantidad",
                unit_price: "Precio unitario",
                total_price: "Precio total",
                purchase_place: "Lugar de compra",
                purchase_date: "Fcha de compra (YYYY-MM-DD)",
                expiration_date: "Fecha de vencimiento (YYYY-MM-DD)",
                additional_notes: "Notas adicionales",
                warehouse_id: "Almacén seleccionado",
                category_id: "Categoría del producto",
                status_id: "Estado del producto"
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
          //isEditing: true, // Para activar el componente visual
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
        //isEditing: true // Activar edición directamente
      });
    }
    },
    validateField(field, value) {
  console.log("Validando campo de producto:", field, "con valor:", value);
  
  // Definir campos opcionales
  const optionalFields = ["purchase_place", "expiration_date", "additional_notes"];
  
  // Si es campo opcional y está vacío, retornar null
  if (optionalFields.includes(field) && (value === undefined || value === null || value === "")) {
    return null;
  }

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
    case "purchase_place":
      if (!value || value.trim().length === 0) {
        throw new Error(`El ${fieldLabels[field]} es requerido`);
      }
      return value.trim();

    case "quantity":
    case "unit_price":
    case "total_price":
      const num = parseFloat(value);
      if (isNaN(num) || num < 0) {
        throw new Error(`El ${fieldLabels[field]} debe ser un número positivo`);
      }
      return num;

    case "purchase_date":
    case "expiration_date":
      if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) {
        throw new Error(`Formato de ${fieldLabels[field]} inválido (YYYY-MM-DD)`);
      }
      const dateObj = new Date(value);
      if (isNaN(dateObj.getTime())) {
        throw new Error(`Fecha inválida para ${fieldLabels[field]}`);
      }
      return value;

    case "warehouse_id":
    case "category_id":
    case "status_id":
      if (value === null || value === undefined || value === "") {
        throw new Error(`Debes seleccionar un ${fieldLabels[field]}`);
      }
      const id = parseInt(value, 10);
      if (isNaN(id) || id <= 0) {
        throw new Error(`ID de ${fieldLabels[field]} inválido`);
      }
      return id;

    case "additional_notes":
      return value ? value.trim() : null;

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
        text: `¿Deseas crear esta ${this.currentProductIntent.toLowerCase()} con los datos proporcionados?`,
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
      let summary = `Resumen del producto:\n\n`;

      // Definir campos y sus labels (extraídos de showSummary)
      const parameterLabels = {
        name: "Nombre del producto",
        quantity: "Cantidad",
        unit_price: "Precio unitario",
        total_price: "Importe total",
        purchase_place: "Lugar de compra",
        purchase_date: "Fecha de compra",
        expiration_date: "Fecha de vencimiento",
        additional_notes: "Notas adicionales",
        status_id: "Estado del producto",
        category_id: "Categoría",
        warehouse_id: "Almacén asociado"
      };

      // Recorrer todos los campos posibles del producto
      Object.keys(parameterLabels).forEach((key) => {
        const value = this.productParameters[key];
        
        // Solo mostrar campos con valor
        if (value !== null && value !== undefined && value !== "") {
          let displayValue = value;
          
          // Manejar campos especiales (relaciones)
          if (key === "category_id") {
            const category = this.categories.find(c => c.id === value);
            displayValue = category?.nameCategory || `ID: ${value}`;
          } 
          else if (key === "status_id") {
            const status = this.status.find(s => s.id === value);
            displayValue = status?.nameStatus || `ID: ${value}`;
          }
          else if (key === "warehouse_id") {
            const warehouse = this.warehouses.find(w => w.warehouse_id === value);
            displayValue = warehouse?.title || `ID: ${value}`;
          }
          else if (["unit_price", "total_price"].includes(key)) {
            displayValue = `$${parseFloat(value).toFixed(2)}`;
          }

          summary += `• ${parameterLabels[key]}: ${displayValue}\n`;
        }
      });

      return summary;
    },
    updateSummaryMessage() {
      const summaryIndex = this.chatMessages.findIndex(msg => msg.isSummary);
      if (summaryIndex !== -1) {
        // Actualizar el resumen completo
        const newSummary = this.generateSummary();
        this.chatMessages[summaryIndex].text = newSummary;

        // Actualizar mensaje individual del campo editado
        const fieldKey = this.chatMessages.find(m => m.isEditing)?.fieldKey;
        if (fieldKey) {
          const fieldLabel = {
            type: "Tipo",
            title: "Título",
            description: "Descripción",
            priority_id: "Prioridad",
            recurrence: "Recurrencia",
            purchase_date: "Fecha inicio",
            expiration_date: "Fecha fin",
            estimated_time: "Duración estimada",
            geo_location: "Ubicación",
          }[fieldKey];

          if (fieldLabel) {
            const fieldMessageIndex = this.chatMessages.findIndex(
              m => m.fieldKey === fieldKey && !m.isEditing && !m.isSummary
            );
            if (fieldMessageIndex !== -1) {
              const displayValue = this.getDisplayValueForField(fieldKey);
              this.chatMessages[fieldMessageIndex].text = `• ${fieldLabel}: ${displayValue}`;
              this.chatMessages[fieldMessageIndex].currentValue = this.productParameters[fieldKey];
            }
          }
        }
      }
    },
    getDisplayValueForField(fieldKey) {
      const value = this.productParameters[fieldKey];
      if (!value) return value;

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


    // Maneja la confirmación del usuario
    async handleConfirmation(userResponse) {
      this.waitingForConfirmation = false;

      if (userResponse.toLowerCase() === "si" || userResponse.toLowerCase() === "sí") {
        const fieldsToUpdate = [
          "id",
          "home_id",
          "warehouse_id",
          "product_id",
          "status_id",
          "category_id",
          "name",
          "unit_price",
          "quantity",
          "total_price",
          "purchase_date",
          "purchase_place",
          "expiration_date",
          "brand",
          "additional_notes",
          "maintenance_date",
          "due_date",
          "frequency",
          "type",
        ];

        let updatedFields = Object.keys(this.productParameters)
          .filter(
            (key) =>
              fieldsToUpdate.includes(key) &&
              this.productParameters[key] !== this.originalItem[key]
          )
          .reduce((obj, key) => {
            obj[key] = this.productParameters[key];
            return obj;
          }, {});
        if (Object.keys(updatedFields).length > 0) {
          updatedFields.home_id = this.home_id;
          const formData = new FormData();
          for (let key in updatedFields) {
            formData.append(key, updatedFields[key]);
          }

          try {
            const result = await handleRequest({
              endpoint: "person-home-warehouse-product",
              method: "POST",
              data: formData,
            });

            // Manejo de la respuesta según el resultado
            if (result.success) {
              this.chatMessages.push({
                from: "ai",
                text: `✅ ${this.currentProductIntent} creado exitosamente!`,
                timestamp: new Date().toLocaleTimeString(),
              });
              
                this.handleCancellation();
            }
          } catch (error) {
            this.chatMessages.push({
              from: "ai",
              text: `❌ Error al crear la ${this.currentProductIntent}: ${error.message}`,
              timestamp: new Date().toLocaleTimeString(),
            });
          } finally {
            this.isTyping = false;
          }
        } else {
          this.chatMessages.push({
            from: "ai",
            text: "No se realizaron cambios en el producto.",
            timestamp: new Date().toLocaleTimeString(),
          });
        }
      } else {
        this.handleCancellation();
      }

      // Resetear
      this.productDataCollectionMode = false;
      this.currentProductIntent = null;
      this.productParameters = {};
      this.scrollToBottom();
    },
    handleCancellation() {
      this.waitingForConfirmation = false;
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
      this.currentProductIntent = null;
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
      this.$emit("close-all-dialogs", "ChatProduct");

    },
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
  },
};
</script>

<style scoped>
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
