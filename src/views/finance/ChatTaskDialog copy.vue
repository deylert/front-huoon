<template>
  <v-dialog
    :value="value"
    @input="$emit('input', $event)"
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
            <div class="d-flex align-end" :class="msg.from === 'user' ? 'flex-row-reverse' : ''">
              <v-avatar v-if="msg.from === 'bot'" size="28" class="mb-2 mr-3">
                <v-img src="@/assets/logo-verde.png" alt="Bot" />
              </v-avatar>

              <div
                class="chat-bubble px-6 py-3 rounded-xl"
                :class="msg.from === 'user' ? 'bg-primary text-white' : 'bg-grey-lighten-2 text-black'"
              >
                <!-- Texto -->
                <template v-if="msg.text">
                  <pre style="margin: 0; white-space: pre-wrap;">{{ msg.text }}</pre>
                </template>

                <!-- Opciones -->
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
export default {
  name: 'ChatTaskDialog',
  props: {
    suggestion: {
      type: Object,
      default: () => ({})
    },
    value: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      chatStarted: false,
      internalDialog: this.value,
      messages: [],
      input: '',
      step: 0,
      taskData: {
        type: '',
        title: '',
        description: '',
        date: '',
        start_time: '',
        estimated_time: '',
        geo_location: '',
        recurrence: '',
        priority_id: null,
        status_id: null
      }
    };
  },
  watch: {
     value(val) {
    this.internalDialog = val;
    if (val && this.suggestion?.statusuggestions?.length && !this.chatStarted) {
      this.startChat();
    }
  },
    internalDialog(val) {
      this.$emit('input', val);
    }
  },
  methods: {
    startChat() {
    this.chatStarted = true;
    this.messages = [];
    this.step = 0;
    this.initializeTaskData();
    this.showSuggestion();
  },
  initializeTaskData() {
    const firstSuggestion = this.suggestion.statusuggestions[0];
    this.taskData = {
      type: '',
      title: firstSuggestion?.name || '',
      description: firstSuggestion?.description || '',
      date: new Date().toISOString().split('T')[0],
      start_time: '',
      estimated_time: '',
      geo_location: '',
      recurrence: '',
      priority_id: null,
      status_id: null
    };
  },
  showSuggestion() {
    const firstSuggestion = this.suggestion.statusuggestions[0];
    if (!firstSuggestion || !firstSuggestion.name) {
      this.sendBotMessage('⚠️ No se recibió una sugerencia válida.');
      return;
    }
    this.sendBotMessage(
      `💡 Tienes una nueva sugerencia:\n\n📌 ${firstSuggestion.name}\n📝 ${firstSuggestion.description}\n📅 ${firstSuggestion.date || 'No disponible'}`
    );
    setTimeout(() => {
      this.messages.push({
        from: 'bot',
        type: 'options',
        options: [
          { label: 'Crear como tarea', value: 'task' },
          { label: 'Crear como meta', value: 'goal' }
        ]
      });
      this.scrollToBottom();
    }, 800);
  },
    handleOptionSelection(type) {
      this.taskData.type = type;
      this.sendUserMessage(type === 'task' ? 'Crear como tarea' : 'Crear como meta');
      this.sendBotMessage(`Perfecto. ¿Deseas usar este título o escribir uno nuevo?\n➡️ *${this.taskData.title}*`);
      this.step = 1;
    },
    handleUserInput() {
      if (!this.input.trim()) return;

      const userText = this.input.trim();
      this.sendUserMessage(userText);
      this.processStep(userText);
      this.input = '';
    },
    sendBotMessage(text) {
      this.messages.push({ from: 'bot', text });
      this.scrollToBottom();
    },
    sendUserMessage(text) {
      this.messages.push({ from: 'user', text });
      this.scrollToBottom();
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
      switch (this.step) {
        case 1:
          this.taskData.title = response;
          this.sendBotMessage(`Muy bien, ¿quieres usar esta descripción o escribir otra?\n➡️ *${this.taskData.description}*`);
          break;
        case 2:
          this.taskData.description = response;
          this.sendBotMessage('¿Qué prioridad tiene? (1-5)');
          break;
        case 3:
          this.taskData.priority_id = parseInt(response) || 1;
          this.sendBotMessage(`¿Fecha de inicio? (por defecto: ${this.taskData.date})`);
          break;
        case 4:
          this.taskData.date = response;
          this.sendBotMessage('¿Hora de inicio? (HH:mm)');
          break;
        case 5:
          this.taskData.start_time = response;
          this.sendBotMessage('¿Tiempo estimado? (ej: 1h, 30min)');
          break;
        case 6:
          this.taskData.estimated_time = response;
          this.sendBotMessage('¿Ubicación (opcional)?');
          break;
        case 7:
          this.taskData.geo_location = response;
          this.sendBotMessage('¿Repetición (diaria, semanal, etc)?');
          break;
        case 8:
          this.taskData.recurrence = response;
          this.sendBotMessage('¿Estado inicial? (1: pendiente, 2: en progreso, etc)');
          break;
        case 9:
          this.taskData.status_id = parseInt(response) || 1;
          this.sendBotMessage('✅ ¡Todo listo! Guardando...');
          setTimeout(() => {
            this.$emit('completed', this.taskData);
            this.closeDialog();
          }, 1500);
          break;
      }
      this.step++;
    }
  }
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
