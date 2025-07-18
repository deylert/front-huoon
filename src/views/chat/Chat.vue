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
  <v-card class="pa-4" elevation="4" rounded="lg">
    <!-- Vista de Chat -->
    <v-row justify="center" class="mx-2">
      <v-col cols="12" md="12">
        <v-card-title class="d-flex justify-space-between align-center" color="#03626C" dark>
          <span class="font-weight-bold text-body-2">Chat en vivo</span>
        </v-card-title>
        <v-card-text>
          <v-container ref="chatContainer" style="overflow-y: auto; min-height:60vh;">
            <v-list>
              <!-- Iterar sobre los mensajes -->
              <v-list-item v-for="(message, index) in chatMessages" :key="index" class="message-item"
                :class="{ 'user-message-container': message.from === 'user' }">
                <v-row align="center">
                  <!-- Avatar de IA -->
                  <v-col v-if="message.from === 'ai'" class="d-flex justify-start" cols="auto">
                    <v-avatar color="#03626C">
                      <img src="@/assets/logo-blanco.png" alt="Imagen de avatar" class="avatar-image" />
                    </v-avatar>
                  </v-col>

                  <!-- Mensaje -->
                  <v-col class="message-text" :class="{ 'text-right': message.from === 'user' }">
                    <v-card :class="message.from === 'ai' ? 'ai-message' : 'user-message'" elevation="2"
                      style="display: inline-block; max-width: 100%;">
                      <v-card-text style="white-space: pre-wrap; word-wrap: break-word;">{{ message.text }}</v-card-text>
                    </v-card>
                    <v-list-item-subtitle class="text-caption">
                      {{ message.timestamp }}
                    </v-list-item-subtitle>
                  </v-col>

                  <!-- Avatar de Usuario -->
                  <v-col v-if="message.from === 'user'" class="d-flex justify-end" cols="auto">
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
              <!-- Mostrar indicador de "escribiendo" cuando isTyping es true -->
              <v-list-item v-if="isTyping" class="message-item">
                <v-row align="center">
                  <!-- Avatar de la IA -->
                  <v-col class="d-flex justify-start" cols="auto">
                    <v-avatar color="#03626C">
                      <img src="@/assets/logo-blanco.png" alt="Imagen de avatar" class="avatar-image" />
                    </v-avatar>
                  </v-col>

                  <!-- Tres puntos sin fondo de card -->
                  <v-col class="message-text">
                    <div class="typing-container"
                      style="display: inline-block; border-radius: 12px;">
                      <span class="typing-dots">•••</span>
                    </div>
                  </v-col>
                </v-row>
              </v-list-item>
            </v-list>
          </v-container>
        </v-card-text>

        <!-- Campo de texto para escribir mensajes -->
        <v-divider></v-divider>
        <v-card-actions>
          <v-text-field v-model="newMessage" label="Escribe tu mensaje" append-icon="mdi-send"
            @keyup.enter="sendMessage" dense variant="underlined" full-width  @click:append="sendMessage" :disabled="isLoading"></v-text-field>
        </v-card-actions>
      </v-col>
    </v-row>
  </v-card>
</v-container>
</template>

<script>
import LocalStorageService from "@/LocalStorageService";
import { handleRequest } from "@/utils/api"; // Ruta al archivo

export default {
  data() {
    return {
      isTyping: false, // Indica si la IA está escribiendo
      imageUrl: '',
      data: {},
      isLoading: false,
      chatMessages: [
      ],
      newMessage: '',
      snackbar: false,
      sb_type: 'success',
      sb_message: '',
      sb_timeout: 3000,
      sb_title: '',
      sb_icon: 'mdi-check-circle',
      answers: [], // Aquí se almacenarán las respuestas a las preguntas iniciales
      currentQuestionIndex: 0, // Índice para saber qué pregunta hacer
      questions: [
        "Hola, ¿cómo te encuentras hoy? ¿Te gustaría hablar sobre viajes? ¿A dónde deseas viajar?",
        "¿En qué fecha planeas viajar?",
        "¿Cuál es el motivo de tu viaje? (Por ejemplo: vacaciones, negocios, visitas familiares, etc.)",
        "¿Tienes algún interés o preferencia específica? (Por ejemplo: playa, naturaleza, cultura, gastronomía, etc.)",
      ],
    };
  },
  computed: {
    imgedit() {
      return `${this.$axios.defaults.baseURL}images/${this.imageUrl}`;
    },
  },
  mounted() {
    this.name = JSON.parse(LocalStorageService.getItem('name'));
    this.user = JSON.parse(LocalStorageService.getItem('user'));
    this.user_id = JSON.parse(LocalStorageService.getItem('user_id'));
    //this.rol_id = LocalStorageService.getItem('role_id');
    //this.role = JSON.parse(LocalStorageService.getItem('role'));
    this.imageUrl = LocalStorageService.getItem('image').replace(/['"]+/g, '');
    // Enviar la primera pregunta al montar el componente
    this.askQuestion();
  },
  methods: {
    async askQuestion() {
      // Enviar la pregunta actual de la lista
      if (this.currentQuestionIndex < this.questions.length) {
        this.chatMessages.push({ from: 'ai', text: this.questions[this.currentQuestionIndex], timestamp: new Date().toLocaleTimeString() });        
        this.isLoading = false;
      }
    },
    async sendMessage() {
      if (this.newMessage.trim()) {
        this.isLoading = true;
         // Guardar la respuesta del usuario en el array
         this.answers.push(this.newMessage);
        
        // Limpiar el campo de entrada
        const tempMessage = this.newMessage;
        this.newMessage = '';
        
        // Mostrar la respuesta del usuario en el chat
        this.chatMessages.push({ from: 'user', text: tempMessage, timestamp: new Date().toLocaleTimeString() });
        this.isTyping = true;

        // Avanzar al siguiente índice de la pregunta
        this.currentQuestionIndex++;
        
        // Si ya respondieron todas las preguntas, enviar el prompt a la IA
        if (this.currentQuestionIndex >= this.questions.length) {
          try {
            // Preparar los datos para la IA
            this.data.issue = "Actúa como un experto en viajes. Responde preguntas sobre destinos, itinerarios, recomendaciones turísticas, consejos para viajeros y cómo aprovechar mejor los viajes.";
            if(this.currentQuestionIndex === this.questions.length){
              const fullContext = this.questions.map((q, index) => {
              return `Pregunta: ${q} Respuesta: ${this.answers[index] || ''}`;
            }).join(' ');  // Unir todo con un espacio para enviarlo completo
            // Asignar el contexto completo a la pregunta
            this.data.question = fullContext;

            }else{
              this.data.question = this.answers.join(' '); // Unir todas las respuestas
            }       

            // Enviar el mensaje a la API de Node.js
            const response = await handleRequest({
              endpoint: 'ask-ai',
              method: 'POST',
              data: this.data
            });

            // Mostrar la respuesta de la IA en el chat
            this.chatMessages.push({ from: 'ai', text: response.data.answer, timestamp: new Date().toLocaleTimeString() });

            // Limpiar las respuestas y avanzar al siguiente ciclo
            this.answers = [];

            this.scrollToBottom(); // Asegurar que el chat haga scroll hacia abajo
          } catch (error) {
            this.showAlert('error', error, 2000);
          } finally {
            // Finalizar el estado de "escribiendo" para la IA
            this.isTyping = false;
            this.isLoading = false;
          }
        } else {
          // Si no han respondido todas las preguntas, preguntar la siguiente
          this.askQuestion();
        }

        this.isTyping = false;
        /*const tempMessage = this.newMessage;
        this.newMessage = '';
        // Agregar el mensaje del usuario
        this.chatMessages.push({ from: 'user', text: tempMessage, timestamp: new Date().toLocaleTimeString() });
        // Mostrar estado de "escribiendo" para la IA
        this.isTyping = true;
        try {
          this.data.issue = "Actúa como un experto en viajes. Responde preguntas sobre destinos, itinerarios, recomendaciones turísticas, consejos para viajeros y cómo aprovechar mejor los viajes.";
          this.data.question = tempMessage;
          // Enviar el mensaje a la API de Node.js
          console.log(this.data);
          const response = await handleRequest({
            endpoint: 'ask-ai',
            method: 'POST',
            data: this.data
          });
          // Agregar la respuesta de la IA al chat
          this.chatMessages.push({ from: 'ai', text: response.data.answer, timestamp: new Date().toLocaleTimeString() });
          //this.showAlert('success', 'Mensaje enviado correctamente', 2000);
          this.scrollToBottom();
        } catch (error) {
          this.showAlert('error', 'Error al enviar el mensaje', 2000);
        } finally {
          // Mostrar estado de "escribiendo" para la IA
          this.isTyping = false;
        }

        this.newMessage = ''; // Limpiar campo de mensaje
        this.scrollToBottom();*/
      }
    },
    async sendToAI() {
      try {
        // Crear el prompt con las respuestas del usuario
        const userResponses = this.answers.join(' ');
        this.data.question = `Por favor, con base en las siguientes respuestas, sugiéme un itinerario de viaje: ${userResponses}`;

        // Enviar el prompt a la IA con el `issue` y `question`
        //this.chatMessages.push({ from: 'ai', text: "Procesando tu solicitud...", timestamp: new Date().toLocaleTimeString() });
        this.data.issue = "Actúa como un experto en viajes. Responde preguntas sobre destinos, itinerarios, recomendaciones turísticas, consejos para viajeros y cómo aprovechar mejor los viajes.";
        // Datos a enviar al backend
         const response = await handleRequest({
            endpoint: 'ask-ai',
            method: 'POST',
            data: this.data
          });
        // Mostrar la respuesta de la IA en el chat
        this.chatMessages.push({
          from: 'ai',
          text: response.data.answer,
          timestamp: new Date().toLocaleTimeString(),
        });

        this.scrollToBottom();
      } catch (error) {
        this.showAlert('error', 'Error al enviar el mensaje', 3000);
      }
    },
    showAlert(type, message, timeout) {
      this.sb_type = type;
      this.sb_message = message;
      this.sb_timeout = timeout;
      this.sb_icon = type === 'success' ? 'mdi-check-circle' : 'mdi-alert-circle';
      this.snackbar = true;
    },
    scrollToBottom() {
      this.$nextTick(() => {
        const container = this.$refs.chatContainer;
        container.scrollTop = container.scrollHeight;
      });
    },
    imagenDisponible() {
      if (this.imgedit !== undefined && this.imgedit !== '') {
        // Intenta cargar la imagen en un elemento oculto para verificar si está disponible
        let img = new Image();
        img.src = this.imgedit;
        return true; // Devuelve true si la imagen está disponible
      }
      return false; // Si la URL de la imagen no está definida o está vacía, devuelve false
    },
  },
};
</script>

<style scoped>
.avatar-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  /* Ajusta la imagen para que cubra el contorno del avatar */
  border-radius: 50%;
  /* Asegura que la imagen sea circular */
}

.message-item {
  margin-bottom: 5px;
}

.user-message-container {
  flex-direction: row-reverse;
  /* Invertir el orden de avatar y mensaje */
}

.message-text {
  max-width: 100%;
  /* Limitar el ancho máximo de los mensajes */
}

.user-message {
  background-color: #DA7171;
  border-radius: 12px;
  padding: 1px;
  font-size: 14px;
  color: white;
}

.ai-message {
  background-color: #03626C;
  border-radius: 12px;
  padding: 1px;
  font-size: 14px;
  color: white;
}

.v-card-text {
  line-height: 1.5;
  /* Mejorar la separación entre líneas */
}
.typing-dots {
  font-size: 1.5rem;
  animation: blink 1.5s infinite;
}

@keyframes blink {
  0%, 100% {
    opacity: 0.2;
  }
  50% {
    opacity: 1;
  }
}
</style>