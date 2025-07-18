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
    <!-- Vista de Chat para Onboarding -->
    <v-row justify="center" class="mx-2">
      <v-col cols="12" md="12">
        <v-card-title class="d-flex justify-space-between" color="#03626C" dark>
          <span class="font-weight-bold text-body-2">Configuración de tu hogar</span>
        </v-card-title>
        <v-card-text>
          <v-container style="overflow-y: auto; min-height: 60vh; max-height: 60vh;">
            <v-list>
              <!-- Mensajes del onboarding -->
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
                  <!-- Mensaje -->
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
                          class="w-100"
                          v-bind="message.props"
                          @next-step="nextStep"
                          @join-home="handleJoinHome"
                          @home-created="handleHomeCreated"
                          @create-home="handleCreateHome"
                          @home-joined="handleHomeJoined"
                          @go-back="goBackToOptions"
                          @complete="handleOnboardingComplete" 
                        />
                      </v-card-text>
                    </v-card>
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
              <!-- Indicador de "escribiendo" -->
              <v-list-item v-if="isTyping" class="message-item">
                <v-row align="center">
                  <v-col class="d-flex justify-start" cols="auto">
                    <v-avatar color="#03626C">
                      <img
                        src="@/assets/logo-blanco.png"
                        alt="Imagen de avatar"
                        class="avatar-image"
                      />
                    </v-avatar>
                  </v-col>
                  <v-col class="message-text">
                    <div class="typing-container">
                      <span class="typing-dots">•••</span>
                    </div>
                  </v-col>
                </v-row>
              </v-list-item>
            </v-list>
          </v-container>
        </v-card-text>
      </v-col>
    </v-row>
  </v-card>
</v-container>
</template>

<script>
import WelcomeStep from "@/components/onboarding/WelcomeStep.vue";
import HomeOptionsStep from "@/components/onboarding/HomeOptionsStep.vue";
import CreateHomeStep from "@/components/onboarding/CreateHomeStep.vue";
import JoinHomeStep from "@/components/onboarding/JoinHomeStep.vue";
import ConfirmationStep from "@/components/onboarding/ConfirmationStep.vue";
import LocalStorageService from "@/LocalStorageService";
import { handleRequest } from "@/utils/api";
import { markRaw } from 'vue'

export default {
  emits: ["onboarding-complete"],
  components: {
    WelcomeStep,
    HomeOptionsStep,
    CreateHomeStep,
    JoinHomeStep,
    ConfirmationStep
  },
  data() {
    return {
      currentStep: 0,
      steps: [
        { component: "WelcomeStep", props: {} },
        { component: "HomeOptionsStep", props: {} },
        // Los pasos 3A y 3B se determinarán dinámicamente
        { component: "ConfirmationStep", props: {} }
      ],
      selectedOption: null,
      homeData: {
        name: "",
        address: "",
        type: "house"
      },
      joinCode: "",
      createdHome: null,
      joinedHome: null,
      isTyping: false,
      imageUrl: "",
      isLoading: false,
      chatMessages: [],
      data: {},
      snackbar: false,
      sb_type: "success",
      sb_message: "",
      sb_timeout: 3000,
      sb_title: "",
      sb_icon: "mdi-check-circle"
    };
  },
  computed: {
    imgedit() {
      return `${this.$axios.defaults.baseURL}images/${this.imageUrl}`;
    }
  },
  mounted() {
    this.imageUrl = LocalStorageService.getItem("image")?.replace(/['"]+/g, "") || "";
    this.startOnboarding();
  },
  methods: {
    startOnboarding() {
      this.isTyping = true;
      setTimeout(() => {
        this.addMessage({
          from: "ai",
          component: "WelcomeStep",
          props: {}, // No necesitamos pasar props especiales
          timestamp: new Date().toLocaleTimeString()
        });
        this.isTyping = false;
      }, 1000);
    },
    
    addMessage(message) {
      this.chatMessages.push(message);
      this.scrollToBottom();
    },
    
    scrollToBottom() {
      this.$nextTick(() => {
        const container = this.$refs.chatContainer;
        if (container) {
          container.scrollTop = container.scrollHeight;
        }
      });
    },
    
    imagenDisponible() {
      return this.imgedit && this.imgedit !== "";
    },
    
    showAlert(type, message, timeout = 3000) {
      this.sb_type = type;
      this.sb_message = message;
      this.sb_timeout = timeout;
      this.sb_icon = type === "success" ? "mdi-check-circle" : "mdi-alert-circle";
      this.snackbar = true;
    },
    
    // Manejo de eventos de los componentes
    handleCreateHome() {
      this.selectedOption = "create";
      this.nextStep();
    },
    
    handleJoinHome() {
      this.selectedOption = "join";
      this.nextStep();
    },

     handleOnboardingComplete() {
      this.$router.push({ path: "home" });
    },
    
    goBackToOptions() {
  this.selectedOption = null;
  this.currentStep = 1; // Resetear al paso de opciones
  
  // Limpiar mensajes relacionados con los pasos siguientes
  this.chatMessages = this.chatMessages.filter(msg => 
    msg.component !== "CreateHomeStep" && 
    msg.component !== "JoinHomeStep"
  );
  
  // Agregar nuevamente el componente de opciones
  this.addMessage({
    from: "ai",
    component: "HomeOptionsStep",
    props: {},
    timestamp: new Date().toLocaleTimeString()
  });
},
    
    /*async handleHomeCreated(homeData) {
      try {
        this.isLoading = true;
        const response = await handleRequest({
          endpoint: "homes",
          method: "POST",
          data: homeData
        });
        
        if (response.success) {
          this.createdHome = response.data;
          LocalStorageService.setItem("home_id", JSON.stringify(response.data.id));
          this.nextStep();
        } else {
          this.showAlert("error", response.message || "Error al crear el hogar");
        }
      } catch (error) {
        this.showAlert("error", "Error al conectar con el servidor");
      } finally {
        this.isLoading = false;
      }
    },*/
    async handleHomeCreated(homeData) {
       if (!homeData) {
    console.error('Error: homeData es undefined');
    this.addMessage({
      from: "ai",
      text: "Error interno: no se recibieron datos del formulario",
      timestamp: new Date().toLocaleTimeString()
    });
    this.goBackToOptions(); // Regresar al paso anterior
    return;
  }

       console.log('Datos recibidos para crear hogar:', homeData); // Debug
  try {
    this.isLoading = true;
    
    // Definir los campos que se pueden actualizar
    const fieldsToUpdate = [
      'name', 'address', 'home_type_id', 'status_id', 'category_id', 
      'residents', 'geo_location', 'timezone', 'people', 'image', 'code'
    ];
    
    // Filtrar solo los campos modificados
    let updatedFields = Object.keys(homeData)
      .filter((key) => fieldsToUpdate.includes(key) && homeData[key] !== null)
      .reduce((obj, key) => {
        if (key === 'people') {
          // Transformar el campo `people`
          obj[key] = homeData.people.map(person => ({
            person_id: Number(person.id),
            role_id: Number(person.roleId),
            roleName: person.roleName
          }));
        } else {
          obj[key] = homeData[key];
        }
        return obj;
      }, {});

    // Verificar si hay campos para actualizar
    if (Object.keys(updatedFields).length === 0) {
      this.addMessage({
        from: "ai",
        text: "Debe completar los datos del hogar para continuar.",
        timestamp: new Date().toLocaleTimeString()
      });
      return;
    }

    // Crear FormData y agregar los campos
    const formData = new FormData();
    for (let key in updatedFields) {
      if (key === 'people') {
        updatedFields[key].forEach((person, index) => {
          for (const [personKey, value] of Object.entries(person)) {
            formData.append(`people[${index}][${personKey}]`, value);
          }
        });
      } else {
        // Para la imagen, asegurarse de agregarla correctamente
        if (key === 'image' && updatedFields[key] instanceof File) {
          formData.append(key, updatedFields[key], updatedFields[key].name);
        } else {
          formData.append(key, updatedFields[key]);
        }
      }
    }

    // Hacer la petición al API
    const result = await handleRequest({
      endpoint: 'home',
      method: 'POST',
      data: formData,
    });

    if (result.success) {
      const homeId = result.data.home.id;
        LocalStorageService.setItem("home_id", JSON.stringify(homeId));
      
      this.handleOnboardingComplete();
    } else {
      // Mostrar error en el chat y volver al paso anterior
      this.addMessage({
        from: "ai",
        text: result.message || "Error al crear el hogar",
        timestamp: new Date().toLocaleTimeString()
      });
      this.goBackToOptions();
    }
  } catch (error) {
    console.error("Error en la creación del hogar:", error);
    this.addMessage({
      from: "ai",
      text: "Ocurrió un error inesperado al procesar la solicitud.",
      timestamp: new Date().toLocaleTimeString()
    });
    this.goBackToOptions();
  } finally {
    this.isLoading = false;
  }
},
    async handleHomeJoined({ code }) {
      if (!code) {
    console.error('Error: código no proporcionado');
    this.addMessage({
      from: "ai",
      text: "Debe ingresar un código válido para unirse al hogar",
      timestamp: new Date().toLocaleTimeString()
    });
    this.goBackToOptions();
    return;
  }

  console.log('Código recibido para unirse a hogar:', code); // Debug

  try {
    this.isLoading = true;
    this.data = {};
    this.data.code = code;
    // Hacer la petición al nuevo endpoint
    const response = await handleRequest({
      endpoint: "home-verify-code",
      method: "POST",
      data: this.data
    });

    if (response.success) {
      // Guardar el ID del hogar en localStorage como en ambos ejemplos
      const homeId = response.data.home.id;
      LocalStorageService.setItem("home_id", JSON.stringify(homeId));
      
      this.handleOnboardingComplete();
    } else {
      // Manejo de errores similar a handleHomeCreated
      this.addMessage({
        from: "ai",
        text: response.message || "Código inválido o error al unirse al hogar",
        timestamp: new Date().toLocaleTimeString()
      });
      
      // Opcional: volver a opciones como en handleHomeCreated
      this.goBackToOptions();
    }
  } catch (error) {
    this.addMessage({
      from: "ai",
      text: "Ocurrió un error inesperado al procesar la solicitud.",
      timestamp: new Date().toLocaleTimeString()
    });
    this.goBackToOptions();
  } finally {
    this.isLoading = false;
  }
    },
    
    nextStep() {
  this.isTyping = true;
  
  setTimeout(() => {
    let nextComponent;
    
    if (this.currentStep === 0) {
      nextComponent = "HomeOptionsStep";
      this.currentStep = 1;
    } else if (this.currentStep === 1) {
      if (this.selectedOption === "create") {
        nextComponent = "CreateHomeStep";
      } else {
        nextComponent = "JoinHomeStep";
      }
      this.currentStep = 2;
    }  
    
    this.addMessage({
      from: "ai",
      component: nextComponent,
      props: {
        homeName: this.createdHome?.name || this.joinedHome?.name || "",
        homeType: this.homeData.type,
        ...(nextComponent === "ConfirmationStep" ? {
          isAdmin: this.selectedOption === "create"
        } : {})
      },
      timestamp: new Date().toLocaleTimeString()
    });
    
    this.isTyping = false;
  }, 800);
}
  }
};
</script>

<style scoped>
/* Estilos similares al componente original */
.priority-options-container {
  margin-top: 12px;
  max-width: 100%;
  overflow-x: auto;
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
}

.ai-message {
  background-color: #888;
  border-radius: 12px;
  padding: 1px;
}

.v-card-text {
  line-height: 1.5;
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

/* Estilos específicos para componentes de onboarding */
.onboarding-card {
  background-color: #f5f5f5;
  border-radius: 12px;
  padding: 16px;
  margin: 8px 0;
}

.onboarding-option {
  cursor: pointer;
  transition: all 0.3s;
}

.onboarding-option:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 8px rgba(0,0,0,0.1);
}

.onboarding-button {
  margin-top: 16px;
}
</style>