<template>
  <div class="suggested-tasks-container">
    <v-card-title class="text-h6 mb-4">
      Tareas sugeridas para tu meta
      <v-chip color="primary" class="ml-2">
        {{ localTasks.length }}
      </v-chip>
    </v-card-title>

    <v-card
      v-for="(task, index) in localTasks"
      :key="index"
      class="mb-3 task-card rounded-lg"
      :class="{ 'selected-task': task.selected }"
      @click="toggleTaskSelection(task)"
      elevation="2"
    >
      <v-row no-gutters class="align-center">
        <!-- Checkbox 
        <v-col cols="auto" class="d-flex justify-center px-2">
          <v-checkbox
            v-model="task.selected"
            hide-details
            class="ma-0"
            @click.stop
          ></v-checkbox>
        </v-col>-->

        <!-- Fecha y hora -->
        <v-col cols="auto" class="pa-2 d-flex flex-column align-center date-time-col">
          <div class="text-body-2 font-weight-medium text-center date-time-text">
            {{ formatDate(task.start_date) }}
          </div>
          <div
            v-if="task.start_time"
            class="text-body-2 font-weight-medium text-center mt-1 date-time-text"
          >
            {{ formatTime(task.start_time) }}
          </div>
        </v-col>

        <!-- Detalles de la tarea -->
        <v-col cols="7" class="py-3 px-4 task-details">
          <div class="font-weight-semibold text-body-1">{{ task.title }}</div>
          <div class="text-caption text-grey-darken-1 mt-1">
            {{ task.description }}
          </div>
        </v-col>

        <v-col cols="auto" class="d-flex align-center px-2">
          <v-chip
            color="amber"
            variant="outlined"
            class="score-chip"
            :title="$t('suggestedTasks.scoreTooltip')"
          >
            <v-icon left size="small">mdi-star</v-icon>
            {{ task.score }}
          </v-chip>
        </v-col>

        <v-col cols="1" class="d-flex align-center pe-4 gap-2">
          <div>
            <span class="text-black">{{ task.namePriority }}</span>
          </div>
        </v-col>

        <!-- Participantes -->
        <v-col cols="auto" class="d-flex align-center pe-4 gap-2">
          <div class="avatar-row d-flex flex-wrap justify-end gap-1">
            <template v-for="(person, personIndex) in task.people" :key="person.person_id">
              <v-tooltip
                bottom
              >
                <template v-slot:activator="{ props }">
                  <v-avatar class="avatar-item hover-expand" size="32" v-bind="props">
                    <v-img
                      :src="`${baseUrl}images/${person.image}?t=${Date.now()}`"
                      alt="avatar"
                    />
                  </v-avatar>
                </template>
                <span>{{ person.name }}<br />{{ person.roleName }}</span>
              </v-tooltip>
            </template>
          </div>
        </v-col>
      </v-row>
    </v-card>

    <!-- Acciones -->
    <v-card-actions class="justify-end mt-4">
      <v-btn
        color="primary"
        @click="confirmSelection"
        :disabled="selectedTasksCount === 0"
      >
        Agregar seleccionadas
        <v-chip color="white" text-color="primary" small class="ml-2">
          {{ selectedTasksCount }}
        </v-chip>
      </v-btn>
      <v-btn color="secondary" @click="skipSelection" class="ml-2"> Saltar </v-btn>
    </v-card-actions>
  </div>
</template>

<script>
export default {
  props: {
    suggestedTasks: {
      type: Array,
      default: () => [],
      validator: (value) => {
        console.log("Tareas sugeridas recibidas:", JSON.parse(JSON.stringify(value)));
        return true;
      },
    },
    priorities: {
      type: Array,
      default: () => [],
    },
    baseUrl: String,
    allPeople: {
      // Nuevo prop para recibir la lista completa de personas
      type: Array,
      default: () => [],
    },
    allRoles: {
      // Nuevo prop para recibir la lista completa de roles
      type: Array,
      default: () => [],
    },
  },
  data() {
    return {
      localTasks: [], // Copia local para manejar el estado
      tempIdCounter: 0
    };
  },
  computed: {
    selectedTasksCount() {
      return this.localTasks.filter((t) => t.selected).length;
    },
    enrichedTasks() {
      // Computed para tareas con datos enriquecidos
      return this.suggestedTasks.map((task) => ({
        ...task,
        selected: false,
        people: this.enrichPeopleData(task.people || []),
      }));
    },
  },
  watch: {
  suggestedTasks: {
    immediate: true,
    deep: true,
    handler(newTasks) {
      // Generar un ID temporal único para cada tarea nueva
      this.localTasks = newTasks.map(newTask => {
        const existing = this.localTasks.find(t => 
          this.areTasksEqual(t, newTask)
        );
        
        return {
          ...JSON.parse(JSON.stringify(newTask)),
          tempId: existing?.tempId || this.tempIdCounter++,
          selected: existing ? existing.selected : false,
          people: this.enrichPeopleData(newTask.people || [])
        };
      });
    }
  }
},
  methods: {
    enrichPeopleData(taskPeople) {
      // 1. Verificar y extraer datos del Proxy
      const peopleProxy = this.allPeople; // El Proxy recibido
      const rawPeople = peopleProxy
        ? peopleProxy.__v_raw || JSON.parse(JSON.stringify(peopleProxy))
        : [];

      // 2. Validar que taskPeople sea un array
      if (!Array.isArray(taskPeople)) {
        //console.error('taskPeople no es un array válido:', taskPeople);
        return [];
      }

      // 3. Recorrer y enriquecer los datos
      return taskPeople.map((person) => {
        console.log("Enriqueciendo persona:", person);
        // 3.1. Verificar que tenga person_id
        if (!person.person_id) {
          //console.warn('Persona sin person_id:', person);
          return person;
        }

        // 3.2. Buscar en los datos reales
        const fullPersonData = rawPeople.find((p) => p.id === Number(person.person_id));

        // 3.3. Mostrar información de debug si no se encuentra
        /*if (!fullPersonData) {
      console.warn(`No se encontró persona con ID ${person.person_id}`);
      console.log('IDs disponibles:', rawPeople.map(p => p.id));
    }*/

        // 3.4. Retornar objeto enriquecido
        return {
          ...person,
          name: fullPersonData?.namePerson || person.name || "Sin nombre",
          image: fullPersonData?.imagePerson || person.image || "default.jpg",
        };
      });
    },
    areTasksEqual(task1, task2) {
    // Compara los campos relevantes para determinar si son la misma tarea
    return (
      task1.title === task2.title &&
      task1.description === task2.description &&
      task1.start_date === task2.start_date &&
      JSON.stringify(task1.people) === JSON.stringify(task2.people)
    );
  },
  
  toggleTaskSelection(task) {
    const index = this.localTasks.findIndex(t => t.tempId === task.tempId);
    if (index !== -1) {
      this.localTasks[index].selected = !this.localTasks[index].selected;
      this.localTasks = [...this.localTasks]; // Forzar reactividad
    }
  },
    confirmSelection() {
      const selectedTasks = this.localTasks.filter((t) => t.selected);
      this.$emit("confirm-suggested", selectedTasks);
    },
    formatDate(date) {
      if (!date) return "";
      const options = { weekday: "short", day: "numeric", month: "short" };
      return new Date(date).toLocaleDateString("es-ES", options);
    },
    formatTime(timeString) {
      if (!timeString) return "";
      // Asume formato HH:mm
      return timeString;
    },
    getPriorityName(priorityId) {
      const priority = this.priorities.find((p) => p.id === priorityId);
      return priority?.namePriority || "Sin prioridad";
    },
    getPriorityColor(priorityId) {
      const priority = this.priorities.find((p) => p.id === priorityId);
      return priority?.color || "grey";
    },
    /*confirmSelection() {
      const selectedTasks = this.suggestedTasks.filter(t => t.selected);
      this.$emit('confirm', selectedTasks);
    },*/
    skipSelection() {
      this.$emit("cancel");
    },
  },
};
</script>

<style scoped>
/* Estilos para el texto en tareas seleccionadas */
.selected-task {
  background-color: #03626c;
}

.selected-task .date-time-text,
.selected-task .font-weight-semibold,
.selected-task .text-caption,
.selected-task .text-grey-darken-1,
.selected-task .v-icon {
  color: white !important;
}

.selected-task .text-caption {
  opacity: 0.9;
}

/* Opcional: para mantener consistencia en el hover */
.selected-task:hover .date-time-text {
  opacity: 0.95;
}

.avatar-border {
  border: 2px solid #000;
  /* Aquí se define el borde */
}

.avatar-row {
  display: flex;
  flex-wrap: nowrap;
  justify-content: start;
}

.avatar-col {
  margin-right: -10px;
  /* Reduce the space between avatars */
}

.avatar-item {
  margin-right: -5px;
  /* Cambia el color del borde según desees */
  border-radius: 50%;
  transition: transform 0.2s ease, box-shadow 0.2s ease;
  /* Para que siga siendo redondo */
  box-sizing: border-box;
  /* Asegura que el borde no afecte el tamaño del avatar */
  /* Optional: reduce the space even further between avatars */
  /* Optional: reduce the space even further between avatars */
}
</style>
