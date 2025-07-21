<template>
  <v-card class="pa-4 rounded-lg text-body-2">
    <!-- Agrega la clase "w-100" -->
    <v-card-text>
      <h5 class="text-grey-darken-2 text-body-2">{{ $t("home.create.title") }}</h5>
      <p class="text-grey-lighten-1">{{ $t("home.create.instructions") }}</p>
      <v-form ref="form" v-model="valid" class="mt-3 text-body-2">
        <v-row>
          <!-- Contenido dinámico según paso -->
          <v-col cols="12">
            <v-row v-if="currentStep === 0" dense>
              <v-col cols="12">
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
                variant="tonal"
                class="text-grey-darken-1"
                @click="currentStep > 0 ? currentStep-- : $emit('go-back')"
              >
                {{
                  currentStep === 0
                    ? $t("home.create.actions.cancel")
                    : $t("home.create.actions.previous")
                }}
              </v-btn>
              <v-btn
                variant="tonal"
                class="text-deep-purple-accent-3"
                @click="nextStep"
                :disabled="!valid"
              >
                {{
                  currentStep === steps.length - 1
                    ? $t("home.create.actions.create")
                    : $t("home.create.actions.next")
                }}
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
  name: "CreateHomeStep",
  emits: ["next-step", "create-home", "go-back"],
  data() {
    return {
      valid: false,
      currentStep: 0,
      showCode: false,
      showPeopleDialog: false,
      steps: [
        {
          key: "basic",
          title: "Información básica",
          subtitle: "Datos principales del hogar",
        },
        //{ key: 'details', title: 'Detalles adicionales', subtitle: 'Configuraciones del hogar' },
      ],
      homeData: {
        id: "",
        name: "",
        address: "",
        home_type_id: "",
        status_id: "",
        person_id: null,
        residents: "",
        geo_location: "",
        timezone: "",
        image: null,
        people: [],
        code: "",
      },

      tittlePerson: -1,
      persons: [],
      roles: [],
      hometypes: [],
      status: [],
      file: null,
      imgMiniatura: "",
      nameRules: [
        (v) => !!v || this.$t("home.create.validation.nameRequired"),
        (v) => (v && v.length >= 3) || this.$t("home.create.validation.nameMinLength"),
      ],
      codeRules: [
        (v) => !!v || this.$t("home.create.validation.codeRequired"),
        (v) => (v && v.length >= 8) || this.$t("home.create.validation.codeMinLength"),
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
        const fatherRole = this.roles.find((role) => role.nameRol === "Administrador");

        if (!fatherRole) {
          //console.warn('No se encontró el rol "Padre".');
          return; // O manejar el error como prefieras
        }

        // Crear el objeto de persona con el rol "Padre"
        const newMember = {
          id: this.person_id,
          roleId: fatherRole.id,
          roleName: fatherRole.nameRol,
        };
        const activeStatus = this.status.find(
            (status) => status.nameStatus === "Activa" || status.nameStatus.toLowerCase() === "activa"
          );

          if (activeStatus) {
            this.homeData.status_id = activeStatus.id;
          }
           const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
      this.homeData.timezone = timezone;
        console.log("Datos del hogar a enviar:", this.homeData);
        // Agregar a homeData.people
        this.homeData.people.push(newMember);
        this.$emit("home-created", this.homeData);
      }
    },

    async initialize() {
      (this.file = null), (this.editedIndex = -1);
      (this.imgMiniatura = ""), (this.data = {});
      try {
        const result = await handleRequest({
          endpoint: "hometype-status-people-apk",
          method: "GET",
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
    },
  },
};
</script>

<style>
/* Estilos ajustados para que se vea dentro del chat */
.v-card {
  width: 100%;
}
</style>
