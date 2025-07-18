<template>
  <v-card class="pa-4 w-100" style="min-width: 100%;"> <!-- Agrega la clase "w-100" -->
    <v-card-text>
      <h5 class="text-grey-darken-2 font-weight-medium">{{ $t('home.create.title') }}</h5>
      <p class="text-grey-lighten-1">{{ $t('home.create.instructions') }}</p>
      <v-form ref="form" v-model="valid" class="mt-6">
        <v-row>
          <!-- Pasos laterales -->
          <v-col cols="3">
            <v-timeline align="start" side="end" dense>
              <v-timeline-item 
                v-for="(step, index) in steps" 
                :key="index"
                :dot-color="currentStep > index ? 'green' : currentStep === index ? 'deep-purple' : 'grey-lighten-1'"
                :icon="currentStep >= index ? (currentStep === index ? `mdi-numeric-${index + 1}` : 'mdi-check') : null"
                size="large"
              >
                <template #opposite>
                  <div class="text-end">
                    <strong>{{ $t(`home.create.steps.${step.key}.title`) }}</strong>
                    <div class="text-caption text-grey">{{ $t(`home.create.steps.${step.key}.subtitle`) }}</div>
                  </div>
                </template>
              </v-timeline-item>
            </v-timeline>
          </v-col>
          <!-- Contenido dinámico según paso -->
          <v-col cols="9">
            <h3 class="text-deep-purple-accent-3 mb-8">
              {{ $t(`home.create.steps.${steps[currentStep].key}.title`) }}
            </h3>
            <!-- Paso 1: Información básica -->
            <v-row v-if="currentStep === 0" dense>
              <v-col cols="12"> <!-- Cambia md="6" a cols="12" -->
                <v-text-field 
                  v-model="homeData.name" 
                  :label="$t('home.create.fields.name')" 
                  variant="underlined"
                  :rules="nameRules"
                />
              </v-col>
              <v-col cols="12">
                <v-text-field 
                  v-model="homeData.address" 
                  :label="$t('home.create.fields.address')" 
                  variant="underlined"
                />
              </v-col>
              <v-col cols="12">
                <v-select
                    v-model="homeData.home_type_id"
                    :items="hometypes"
                    item-title="name"
                    item-value="id"
                    :label="$t('home.create.fields.type')"
                    variant="underlined"
                    >
                    <template v-slot:item="{ props, item }">
                        <v-list-item
                        v-bind="props"
                        :prepend-icon="item.raw.icon"
                        :title="item.raw.name"
                        :subtitle="item.raw.description"
                        />
                    </template>
                    </v-select>
              </v-col>
              <v-col cols="12">
                <v-text-field
                  v-model="homeData.code"
                  :label="$t('home.create.fields.code')"
                  variant="underlined"
                  :type="showCode ? 'text' : 'password'"
                  :append-inner-icon="showCode ? 'mdi-eye-off' : 'mdi-eye'"
                  :rules="codeRules"
                  @click:append-inner="showCode = !showCode"
                />
              </v-col>
            </v-row>
            <!-- Paso 2: Detalles adicionales -->
            <v-row v-if="currentStep === 1" dense>
              <v-col cols="12">
                <v-autocomplete v-model="homeData.status_id"
                    :items="status" :label="$t('home.create.fields.status')" item-title="nameStatus"
                    item-value="id" variant="underlined" :rules="selectRules">
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
              </v-col>
              <v-col cols="12">
                <v-text-field
                  v-model="homeData.timezone"
                  :label="$t('home.create.fields.timezone')"
                  variant="underlined"
                />
              </v-col>
              <v-col cols="12">
                <v-text-field
                  v-model="homeData.residents"
                  :label="$t('home.create.fields.residents')"
                  type="number"
                  variant="underlined"
                />
              </v-col>
            </v-row>
            <!-- Navegación entre pasos -->
            <div class="d-flex justify-space-between mt-8">
              <v-btn 
                variant="text" 
                class="text-grey-darken-1" 
                @click="currentStep > 0 ? currentStep-- : $emit('go-back')"
              >
                {{ currentStep === 0 ? $t('home.create.actions.cancel') : $t('home.create.actions.previous') }}
              </v-btn>
              <v-btn 
                variant="text" 
                class="text-deep-purple-accent-3" 
                @click="nextStep" 
                :disabled="!valid"
              >
                {{ currentStep === steps.length - 1 ? $t('home.create.actions.create') : $t('home.create.actions.next') }}
              </v-btn>
            </div>
          </v-col>
        </v-row>
      </v-form>
    </v-card-text>
  </v-card>
</template>

<script>
import { handleRequest } from "@/utils/api"; // Ruta al ar
import LocalStorageService from "@/LocalStorageService";

export default {
  name: 'CreateHomeStep',
  emits: ['next-step', 'create-home', 'go-back'],
  data() {
    return {
      valid: false,
      currentStep: 0,
      showCode: false,
      showPeopleDialog: false,
      steps: [
        { key: 'basic', title: 'Información básica', subtitle: 'Datos principales del hogar' },
        { key: 'details', title: 'Detalles adicionales', subtitle: 'Configuraciones del hogar' },
      ],
      homeData: {
         id: '',
      name: '',
      address: '',
      home_type_id: '',
      status_id: '',
      person_id: null,
      residents: '',
      geo_location: '',
      timezone: '',
      image: null,
    people: [],
      code: ''
      },
      
    tittlePerson: -1,
    persons: [],
    roles: [],    
      hometypes: [],
    status: [],
      file: null,
    imgMiniatura: '',
      /*homeTypes: [
        { text: this.$t('home.types.house'), value: 'house', icon: 'mdi-home' },
        { text: this.$t('home.types.apartment'), value: 'apartment', icon: 'mdi-office-building' },
        { text: this.$t('home.types.other'), value: 'other', icon: 'mdi-city' }
      ],*/
      /*peopleHeaders: [
        { title: this.$t('home.create.membersTable.avatar'), key: 'avatar', sortable: false },
        { title: this.$t('home.create.membersTable.name'), key: 'name' },
        { title: this.$t('home.create.membersTable.email'), key: 'email' },
        { title: this.$t('home.create.membersTable.role'), key: 'role' },
        { title: this.$t('home.create.membersTable.actions'), key: 'actions', sortable: false }
      ],*/
      nameRules: [
        v => !!v || this.$t('home.create.validation.nameRequired'),
        v => (v && v.length >= 3) || this.$t('home.create.validation.nameMinLength')
      ],
      codeRules: [
        v => !!v || this.$t('home.create.validation.codeRequired'),
        v => (v && v.length >= 8) || this.$t('home.create.validation.codeMinLength')
      ],
      selectRules: [(v) => !!v || "Seleccionar al menos un elemento"],
    };
  },

  mounted() {
     this.person_id = JSON.parse(LocalStorageService.getItem("person_id"));
    this.initialize();
  },
  methods: {
    async nextStep() {
      if (this.currentStep < this.steps.length - 1) {
        this.currentStep++;
      } else {
         // Buscar el rol "Padre"
    const fatherRole = this.roles.find(role => role.nameRol === 'Padre');

    if (!fatherRole) {
      //console.warn('No se encontró el rol "Padre".');
      return; // O manejar el error como prefieras
    }

    // Crear el objeto de persona con el rol "Padre"
    const newMember = {
      id: this.person_id,
      roleId: fatherRole.id,
      roleName: fatherRole.nameRol
    };
console.log('Datos del hogar a enviar:', this.homeData);
    // Agregar a homeData.people
    this.homeData.people.push(newMember);
        this.$emit('home-created', this.homeData);
      }
    },

    async initialize(){
        this.file = null,
        this.editedIndex = -1;
      this.imgMiniatura = '',
        this.data = {};
      try {
        const result = await handleRequest({
          endpoint: 'hometype-status-people-apk',
          method: 'GET'
        });

        if (result.success) {
          // Si la solicitud es exitosa, asignamos las sucursales
          this.status = result.data?.homestatus || [];
          this.people = result.data?.homepeople || [];
          this.roles = result.data?.homeroles || [];
          this.hometypes = result.data?.hometypes || [];
        } else {
          // Si no hay datos, asignamos un array vacío
          this.status = [];
          this.people = [];
          this.roles = [];
          this.hometypes = [];
        }
      } catch (error) {
        console.log(error);
      } 
    }
  }
};
</script>

<style scoped>
/* Estilos ajustados para que se vea dentro del chat */
.v-card {
  width: 100%;
}
</style>