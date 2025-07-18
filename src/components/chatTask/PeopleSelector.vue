<template>
  <div class="people-selector-container">
    <v-row>
      <v-col cols="12" md="6" v-for="role in roles" :key="role.id">
        <v-card class="mx-auto" max-width="100%">
          <v-list
            v-model:selected="selectedItems[role.id]"
            @update:selected="updateSelection(role, $event)"
            select-strategy="leaf"
            multiple
          >
            <v-list-subheader>{{ role.nameRol }}</v-list-subheader>
            <v-list-item
              v-for="person in availablePeople(role.id)"
              :key="`${role.id}-${person.id}`"
              :value="person.id"
              :prepend-avatar="personImage(person)"
              class="py-3"
              active-class="text-green"
            >
              <v-list-item-title>{{ person.namePerson }}</v-list-item-title>
              <v-list-item-subtitle class="mb-1 text-high-emphasis opacity-100">
                {{ person.roleName }}
              </v-list-item-subtitle>

              <template v-slot:append="{ isSelected }">
                <v-list-item-action class="flex-column align-end">
                  <v-icon
                    v-if="isSelected || isPersonSelected(person.id, role.id)"
                    :color="getRoleIcon(role.id) === 'mdi-star' ? 'green-darken-3' : 'green-darken-3'"
                  >
                    {{ getRoleIcon(role.id) === "mdi-star" ? "mdi-star" : "mdi-circle-slice-8" }}
                  </v-icon>
                  <v-icon
                    v-else
                    class="opacity-30"
                    :color="getRoleIcon(role.id) === 'mdi-star' ? 'green-darken-3' : undefined"
                  >
                    {{ getRoleIcon(role.id) === "mdi-star" ? "mdi-star-outline" : "mdi-checkbox-blank-circle-outline" }}
                  </v-icon>
                </v-list-item-action>
              </template>
            </v-list-item>
          </v-list>
        </v-card>
      </v-col>
    </v-row>
    
    <div class="confirmation-buttons mt-4">
      <div class="text-caption mb-2">
        {{ selectedCountText }}
      </div>
      <div class="d-flex justify-end gap-2">
        <v-btn
          color="error"
          variant="outlined"
          @click="cancelSelection"
        >
          Cancelar
        </v-btn>
        <v-btn
          color="primary"
          @click="confirmSelection"
          :disabled="localSelections.length === 0"
        >
          Confirmar
        </v-btn>
      </div>
    </div>
  </div>
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
      assignedPeople: [] // Track personas ya asignadas
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
        // Mostrar persona si:
        // 1. No está asignada a ningún rol, o
        // 2. Está asignada al rol actual
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
        case "colaborador": return "mdi-account-group";
        default: return "mdi-account";
      }
    },
    
    updateSelection(role, selectedIds) {
      // 1. Eliminar personas que fueron deseleccionadas de este rol
      this.localSelections = this.localSelections.filter(
        p => p.roleId !== role.id || selectedIds.includes(p.id)
      );
      
      // 2. Añadir nuevas selecciones
      selectedIds.forEach(personId => {
        if (!this.localSelections.some(p => p.id === personId)) {
          const person = this.people.find(p => p.id === personId);
          if (person) {
            this.localSelections.push({
              id: person.id,
              roleId: role.id,
              name: person.namePerson,
              image: person.imagePerson,
              roleName: role.nameRol
            });
          }
        } else {
          // Actualizar rol si la persona ya estaba seleccionada en otro rol
          const index = this.localSelections.findIndex(p => p.id === personId);
          if (index !== -1) {
            this.localSelections[index].roleId = role.id;
            this.localSelections[index].roleName = role.nameRol;
          }
        }
      });
      
      // Notificar al padre
      this.$emit('selection-update', this.localSelections);
      this.$forceUpdate(); // Forzar actualización de la UI
    },
    
    cancelSelection() {
      this.$emit('cancel');
    },
    
    confirmSelection() {
      this.$emit('confirm', this.localSelections);
    }
  }
}
</script>

<style scoped>
.people-selector-container {
  padding: 8px;
}

.confirmation-buttons {
  position: sticky;
  bottom: 0;
  background: white;
  padding: 8px;
  border-top: 1px solid #eee;
}
</style>