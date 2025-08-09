<template>
  <v-card class="people-selector-container" elevation="0" style="max-width: 100%; width: 100%;">
    <div class="pa-1">
      <div v-for="(role, index) in roles" :key="role.id" class="mb-1">
        <v-list-subheader class="text-body-2">{{ role.nameRol }}</v-list-subheader>

        <!-- Contenedor grid manteniendo la estructura original -->
        <div class="people-grid-container">
          <v-card
            v-for="person in availablePeople(role.id)"
            :key="`${role.id}-${person.id}`"
            class="person-card"
            elevation="2"
            rounded="lg"
            :class="{
              'bg-primary text-white': isPersonSelected(person.id, role.id),
              'bg-grey-lighten-3': !isPersonSelected(person.id, role.id),
            }"
            @click="togglePersonSelection(person, role)"
          >
            <div class="card-content">
              <v-avatar
                size="32"
                class="me-2"
                :color="isPersonSelected(person.id, role.id) ? 'white' : 'blue-lighten-4'"
                variant="tonal"
              >
                <v-img :src="personImage(person)" v-if="personImage(person)" />
                <v-icon v-else :color="isPersonSelected(person.id, role.id) ? 'primary' : 'blue'">
                  mdi-account
                </v-icon>
              </v-avatar>
              
              <div class="person-info">
                <div class="text-body-2 font-weight-medium">
                  {{ person.namePerson }}
                </div>
              </div>
              
              <v-icon
                size="18"
                class="ml-2"
                :color="isPersonSelected(person.id, role.id) ? 'white' : 'grey'"
              >
                {{
                  isPersonSelected(person.id, role.id)
                    ? (getRoleIcon(role.id) === 'mdi-star' ? 'mdi-star' : 'mdi-circle-slice-8')
                    : (getRoleIcon(role.id) === 'mdi-star' ? 'mdi-star-outline' : 'mdi-checkbox-blank-circle-outline')
                }}
              </v-icon>
            </div>
          </v-card>
        </div>
      </div>
    </div>

    <v-card-actions class="pt-0">
      <div class="text-caption text-medium-emphasis">
        {{ selectedCountText }}
      </div>
      <v-spacer />
      <v-btn
        color="primary"
        size="small"
        variant="flat"
        :disabled="localSelections.length === 0"
        @click="confirmSelection"
      >
        Confirmar
      </v-btn>
    </v-card-actions>
  </v-card>
</template>

<script>
export default {
  name: 'PeopleSelector',
  props: {
    roles: {
      type: Array,
      default: () => []
    },
    people: {
      type: Array,
      default: () => []
    },
    initialSelections: {
      type: Array,
      default: () => []
    },
    baseUrl: {
      type: String,
      required: true
    }
  },
  data() {
    return {
      selectedItems: {},
      localSelections: [...this.initialSelections],
      assignedPeople: [],
    }
  },
  computed: {
    selectedCountText() {
      const count = this.localSelections.length;
      return count === 0 
        ? 'No hay personas seleccionadas' 
        : `Personas seleccionadas: ${count}`;
    }
  },
  created() {
    this.roles.forEach(role => {
      this.selectedItems[role.id] = this.localSelections
        .filter(p => p.roleId === role.id)
        .map(p => p.id);
    });
  },
  methods: {
    personImage(person) {
      if (!person?.imagePerson) return undefined;
      return `${this.baseUrl}images/${person.imagePerson.replace(/['"]+/g, '')}`;
    },
    
    availablePeople(roleId) {
      return this.people.filter(person => {
        const assignedRole = this.getAssignedRole(person.id);
        return !assignedRole || assignedRole === roleId;
      });
    },
    
    getAssignedRole(personId) {
      const selection = this.localSelections.find(p => p.id === personId);
      return selection ? selection.roleId : null;
    },
    
    isPersonSelected(personId, roleId) {
      return this.localSelections.some(p => p.id === personId && p.roleId === roleId);
    },
    
    getRoleIcon(roleId) {
      const role = this.roles.find(r => r.id === roleId);
      if (!role) return "mdi-account";
      
      switch (role.nameRol.toLowerCase()) {
        case "responsable": return "mdi-star";
        case "colaborador": return "mdi-circle-slice-8";
        default: return "mdi-account";
      }
    },
    
    togglePersonSelection(person, role) {
      const isSelected = this.isPersonSelected(person.id, role.id);
      
      if (isSelected) {
        // Deseleccionar
        this.localSelections = this.localSelections.filter(p => p.id !== person.id);
      } else {
        // Seleccionar
        const existingIndex = this.localSelections.findIndex(p => p.id === person.id);
        
        if (existingIndex >= 0) {
          // Actualizar rol si ya existe
          this.localSelections[existingIndex].roleId = role.id;
          this.localSelections[existingIndex].roleName = role.nameRol;
        } else {
          // Añadir nueva selección
          this.localSelections.push({
            id: person.id,
            roleId: role.id,
            name: person.namePerson,
            image: person.imagePerson,
            roleName: role.nameRol
          });
        }
      }
      
      // Actualizar el modelo selectedItems para el rol
      this.selectedItems[role.id] = this.localSelections
        .filter(p => p.roleId === role.id)
        .map(p => p.id);
      
      this.$emit('selection-update', this.localSelections);
    },
    
    confirmSelection() {
      this.$emit('confirm', this.localSelections);
    }
  }
}
</script>

<style scoped>
.people-selector-container {
  max-width: 100%;
  width: 100%;
  overflow-x: hidden;
  background: transparent !important;
}

.people-grid-container {
  display: grid !important;
  grid-template-columns: repeat(4, 1fr);
  gap: 8px;
  padding: 4px !important;
  background: transparent !important;
}

.person-card {
  cursor: pointer;
  transition: all 0.2s ease;
  min-height: 40px;
  display: flex;
  align-items: center;
  padding: 8px !important;
}

.card-content {
  display: flex;
  align-items: center;
  width: 100%;
}

.person-info {
  flex-grow: 1;
  min-width: 0;
}

.text-body-2 {
  font-size: 0.875rem !important;
  line-height: 1.25;
  white-space: normal;
  overflow: hidden;
  text-overflow: ellipsis;
  word-break: break-word;
  max-width: 180px; 
  min-width: 140px;
}

.text-caption {
  font-size: 0.75rem !important;
  line-height: 1.25;
}

/* Responsive */
@media (max-width: 960px) {
  .people-grid-container {
    grid-template-columns: repeat(3, 1fr);
  }
}

@media (max-width: 600px) {
  .people-grid-container {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 400px) {
  .people-grid-container {
    grid-template-columns: 1fr;
  }
}
</style>