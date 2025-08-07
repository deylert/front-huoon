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
      <v-card-text>
        <v-row justify="space-between" align="center" class="mb-6">
        <v-col cols="12" class="d-flex justify-space-between align-center">
          <h2 class="text-body-2 font-weight-bold">{{ $t("home.title") }}</h2>
          <v-btn
            icon
            color="deep-purple-accent-4"
            variant="flat"
            class="elevation-3"
            @click="showAdd"
            :title="this.$t('home.addButton')"
          >
            <v-icon>mdi-plus</v-icon>
          </v-btn>
          </v-col>
        </v-row>
        <v-row justify="space-between" align="center" class="mb-6">
          <v-col
            cols="12"
            class="ma-0 pt-6"
            style="max-height: 60vh; min-height: 40vh; overflow-y: auto"
          >
            <template v-if="homes.length > 0">
              <v-card
                v-for="(home, index) in homes"
                :key="index"
                class="mb-4 rounded-lg pa-2"
                density="comfortable"
                elevation="2"
              >
                <v-row>
                  <v-col cols="1" class="d-flex justify-start">
                    <v-dialog max-width="500" class="rounded-lg">
                      <!-- Activator: La imagen que abre el diálogo -->
                      <template v-slot:activator="{ props: activatorProps }">
                        <div
                          v-bind="activatorProps"
                          class="icono-concavo d-flex flex-column justify-center justify-start"
                          :class="`bg-${getTypeColor(home.nameStatus)}`"
                        >
                          <v-img
                            :src="`${$axios.defaults.baseURL}images/${home.image}`"
                            cover
                            class="img-concava"
                          />
                        </div>
                      </template>

                      <!-- Contenido del diálogo -->
                      <template v-slot:default="{ isActive }">
                        <v-card class="modal-imagen">
                          <v-img
                            :src="`${$axios.defaults.baseURL}images/${home.image}`"
                            max-height="500"
                            contain
                          />
                          <v-card-actions>
                            <v-spacer></v-spacer>
                            <v-btn
                              text="Cerrar"
                              variant="flat"
                              @click="isActive.value = false"
                            ></v-btn>
                          </v-card-actions>
                        </v-card>
                      </template>
                    </v-dialog>
                  </v-col>
                  <v-col cols="4" class="d-flex align-center justify-start">
                    <v-row align="center" class="gap-3">
                      <div>
                        <div class="font-weight-bold text-body-2">
                          {{ home.name }}
                        </div>
                        <div
                          class="text-body-2 d-flex align-center text-grey-darken-1 text-truncate"
                        >
                          {{ home.address }}
                          <v-tooltip
                            activator="parent"
                            location="bottom"
                            max-width="350px"
                          >
                            <span style="white-space: normal; word-break: break-word">
                              {{ $t("home.fields.address") }}: {{ home.address }}
                            </span>
                          </v-tooltip>
                        </div>
                      </div>
                    </v-row>
                  </v-col>
                  <v-col cols="1" class="d-flex align-center justify-start text-truncate">
                    <div>
                      <v-rating
                        :model-value="home.percent"
                        color="orange-darken-2"
                        density="compact"
                        size="small"
                        readonly
                      ></v-rating>
                      <v-tooltip activator="parent" location="bottom" max-width="350px">
                        <span style="white-space: normal; word-break: break-word">
                          {{ $t("home.fields.ranking") }}: {{ home.percent }}
                        </span>
                      </v-tooltip>
                    </div>
                  </v-col>
                  <v-col cols="3" class="d-flex align-center justify-start">
                    <div class="avatar-row">
                      <v-tooltip
                        v-for="person in home.people"
                        :key="person.id"
                        bottom
                        content-class="custom-tooltip"
                      >
                        <template v-slot:activator="{ props }">
                          <v-avatar
                            class="avatar-item hover-expand"
                            size="32"
                            elevation="3"
                            v-bind="props"
                          >
                            <v-img
                              :src="`${this.$axios.defaults.baseURL}images/${
                                person.image
                              }?t=${Date.now()}`"
                              alt="image"
                            />
                          </v-avatar>
                        </template>
                        <span>{{ person.name }}</span>
                        <v-spacer></v-spacer>
                        <span class="text-secondary">{{ person.roleName }}</span>
                        <div class="star-rating">
                          <v-rating
                            :model-value="person.percent"
                            color="orange-darken-2"
                            density="compact"
                            size="small"
                            readonly
                          ></v-rating>
                        </div>
                      </v-tooltip>
                      <v-tooltip bottom content-class="custom-tooltip">
                        <template v-slot:activator="{ props }">
                          <v-btn
                            density="comfortable"
                            icon="mdi-plus"
                            @click="addPeople(home)"
                            bg-color="white"
                            color="#03626C"
                            size="32"
                            elevation="3"
                            v-bind="props"
                          ></v-btn>
                        </template>
                        <span> {{ $t("home.actions.addMembers") }}</span>
                      </v-tooltip>
                    </div>
                  </v-col>
                  <v-col cols="1" class="d-flex align-center justify-start">
                    <div>
                      <span class="text-body-2">
                        {{ home.nameHomeType }}</span>
                      <v-tooltip activator="parent" location="bottom" max-width="350px">
                        <span style="white-space: normal; word-break: break-word">
                          {{ $t("home.fields.type") }}: {{ home.nameHomeType }}
                        </span>
                      </v-tooltip>
                    </div>
                  </v-col>
                  <v-col cols="1" class="d-flex align-center justify-start">
                    <div>
                      <span class="text-body-2">
                        {{ home.nameStatus }}</span>
                      <v-tooltip activator="parent" location="bottom" max-width="350px">
                        <span style="white-space: normal; word-break: break-word">
                          {{ $t("home.fields.status") }}: {{ home.nameStatus }}
                        </span>
                      </v-tooltip>
                    </div>
                  </v-col>
                  <v-col cols="1" class="d-flex align-center ml-auto pe-4" style="margin-left: auto !important" >
                    <v-btn
                      icon
                      variant="text"
                      color="green-darken-2"
                      size="small"
                      @click="editItem(home)"
                    >
                      <v-icon>mdi-pencil</v-icon>
                    </v-btn>
                    <v-btn
                      icon
                      variant="text"
                      color="red-darken-2"
                      size="small"
                      @click="deleteItem(home)"
                    >
                      <v-icon>mdi-delete</v-icon>
                    </v-btn>
                  </v-col>
                </v-row>
              </v-card>
            </template>
            <template v-else>
              <v-col cols="12" class="text-center py-8">
                {{ $t("home.empty") }}
              </v-col>
            </template>
          </v-col>
        </v-row>
      </v-card-text>
    </v-card>
  </v-container>

  <v-dialog v-model="dialog" fullscreen persistent transition="dialog-bottom-transition" content-class="fullscreen-dialog">
  <v-form ref="form" v-model="valid" class="h-100">
    <v-card class="pa-10">
      <v-card-text class="pt-12">
        <h5 class="text-grey-darken-2 font-weight-medium">
            {{ $t(`home.actions.${editedIndex === -1 ? "create" : "edit"}`) }}
          </h5>
        <p class="text-grey-lighten-1">{{ $t('home.instructions') }}</p>
        
        <v-row class="mt-12">
          <!-- Pasos laterales -->
          <v-col cols="3">
            <v-timeline align="start" side="end" dense>
              <v-timeline-item 
                v-for="(stepKey, index) in ['basic', 'details', 'members']" 
                :key="index" 
                :dot-color="step > index ? 'green' : step === index ? 'deep-purple' : 'grey-lighten-1'" 
                :icon="step >= index ? (step === index ? `mdi-numeric-${index + 1}` : 'mdi-check') : null" 
                size="large">
                <template #opposite>
                  <div class="text-end">
                    <strong>{{ $t(`home.steps.${stepKey}.title`) }}</strong>
                    <div class="text-caption text-grey">
                      {{ $t(`home.steps.${stepKey}.subtitle`) }}
                    </div>
                  </div>
                </template>
              </v-timeline-item>
            </v-timeline>
          </v-col>

          <!-- Contenido dinámico según paso -->
          <v-col cols="9">
            <h3 class="text-deep-purple-accent-3 mb-8">
              {{ $t(`home.steps.${['basic', 'details', 'members'][step]}.title`) }}
            </h3>

            <!-- Paso 1: Información Básica -->
            <v-row dense v-if="step === 0">
              <v-col cols="12">
                <v-text-field
                  v-model="editedItem.name"
                  :label="$t('home.fields.name')"
                  variant="underlined"
                  :rules="nameRules"
                ></v-text-field>
              </v-col>
              <v-col cols="12">
                <v-text-field
                  v-model="editedItem.address"
                  :label="$t('home.fields.address')"
                  variant="underlined"
                ></v-text-field>
              </v-col>
              <v-col cols="12" v-if="this.editedIndex != -1">
                <v-autocomplete
                  :no-data-text="$t('noData')"
                  v-model="editedItem.status_id"
                  :items="status"
                  :label="$t('home.fields.status')"
                  item-title="nameStatus"
                  item-value="id"
                  variant="underlined"
                  density="compact"
                  :rules="selectRules"
                >
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
                <v-select
                  v-model="editedItem.home_type_id"
                  :items="hometypes"
                  item-title="name"
                  item-value="id"
                  :label="$t('home.fields.type')"
                  variant="underlined"
                  density="compact"
                  :rules="selectRules"
                >
                  <template v-slot:item="{ props, item }">
                    <v-list-item
                      v-bind="props"
                      :subtitle="item.raw.description"
                    ></v-list-item>
                  </template>
                </v-select>
              </v-col>
              <!--<v-col cols="12" md="6" v-if="editedIndex === -1">
                <v-text-field
                  v-model="editedItem.code"
                  :label="$t('home.fields.code')"
                  variant="underlined"
                  :placeholder="$t('home.placeholders.code')"
                  :type="showCode ? 'text' : 'password'"
                  :append-inner-icon="showCode ? 'mdi-eye-off' : 'mdi-eye'"
                  :rules="codeRules"
                  @click:append-inner="showCode = !showCode"
                  density="compact"
                  prepend-icon="mdi-key-chain-variant"
                />
              </v-col>-->
            </v-row>

            <!-- Paso 2: Detalles Adicionales -->
            <v-row dense v-if="step === 1">
              <v-col cols="12">
                <v-text-field
                  v-model="editedItem.geo_location"
                  :label="$t('home.fields.geoLocation')"
                  density="compact"
                  variant="underlined"
                ></v-text-field>
              </v-col>
              <v-col cols="12" v-if="this.editedIndex != -1">
                  <v-text-field
                    v-model="editedItem.timezone"
                    :label="$t('home.fields.timezone')"
                    variant="underlined"
                    density="compact"
                  >
                  </v-text-field>
                </v-col>
              <v-col cols="12">
                <v-text-field
                  v-model="editedItem.residents"
                  :label="$t('home.fields.residents')"
                  type="number"
                  variant="underlined"
                  density="compact"
                ></v-text-field>
              </v-col>
              <v-row>
                <v-col cols="12" md="6">
                  <v-file-input
                    v-model="file"
                    ref="fileInput"
                    :label="$t('home.fields.image')"
                    variant="underlined"
                    density="compact"
                    name="file"
                    accept=".png, .jpg, .jpeg"
                    @change="onFileSelected"
                    prepend-icon=""
                  ></v-file-input>
                </v-col>
                <v-col cols="12" md="6">
                  <v-card elevation="6" class="mx-auto" max-width="210" max-height="120">
                    <img
                      v-if="imagenDisponible()"
                      :src="imgedit"
                      height="120"
                      width="210"
                    />
                  </v-card>
                </v-col>
              </v-row>
            </v-row>

            <!-- Paso 3: Miembros del Hogar -->
            <v-row :dense="roles.length > 4" v-if="step === 2">
              <v-col
                  v-for="role in roles"
                  :key="role.id"
                  cols="12"
                  :sm="roles.length >= 2 ? 6 : 12"
                  :md="getDynamicColSize(roles.length)"
                >
                  <v-card class="mx-auto" max-width="98%">
                    <v-list v-model:selected="selectedItems[role.id]" @update:selected="updateSelection(role, $event)"
                      select-strategy="leaf" multiple>
                      <v-list-subheader>{{ role.nameRol }}</v-list-subheader>
                      <v-list-item v-for="person in filteredPeople(role.id)" :key="`${role.id}-${person.id}`"
                        :value="person.id" active-class="text-green"
                        :prepend-avatar="`${$axios.defaults.baseURL}images/${person.imagePerson}`" class="py-3">
                        <!-- Contenido del ítem - Nueva estructura Vuetify 3 -->
                        <template v-slot:prepend>
                          <v-avatar>
                            <v-img :src="`${$axios.defaults.baseURL}images/${person.imagePerson}`" />
                          </v-avatar>
                        </template>

                        <!-- Nombre y rol -->
                        <v-list-item-title>{{ person.namePerson }}</v-list-item-title>
                        <v-list-item-subtitle class="mb-1 text-high-emphasis opacity-100">
                          {{ person.roleName }}
                        </v-list-item-subtitle>

                        <!-- Icono de selección -->
                        <template v-slot:append>
                          <v-icon v-if="isPersonSelected(person.id, role.id)" :color="
                              getRoleIcon(role.id) === 'mdi-star'
                                ? 'green-darken-3'
                                : 'green-darken-3'
                            ">
                            {{
                            getRoleIcon(role.id) === "mdi-star"
                            ? "mdi-star"
                            : "mdi-circle-slice-8"
                            }}
                          </v-icon>
                          <v-icon v-else class="opacity-30" :color="
                              getRoleIcon(role.id) === 'mdi-star'
                                ? 'green-darken-3'
                                : undefined
                            ">
                            {{
                            getRoleIcon(role.id) === "mdi-star"
                            ? "mdi-star-outline"
                            : "mdi-checkbox-blank-circle-outline"
                            }}
                          </v-icon>
                        </template>
                      </v-list-item>
                    </v-list>
                  </v-card>
                </v-col>
            </v-row>

            <div class="d-flex justify-space-between mt-8">
              <v-btn variant="text" class="text-grey-darken-1" @click="step > 0 ? step-- : close()">
                {{ step === 0 ? $t('buttons.close') : $t('buttons.previous') }}
              </v-btn>

              <v-btn 
                variant="text" 
                class="text-deep-purple-accent-3" 
                @click="nextStep" 
                :disabled="!valid || (step === 2 && !editedItem.people.length)">
                {{
                  step === 2 
                    ? $t('buttons.saveAndClose') 
                    : $t('buttons.next')
                }}
              </v-btn>
            </div>
          </v-col>
        </v-row>
      </v-card-text>
    </v-card>
  </v-form>
</v-dialog>
  <v-dialog v-model="dialogDelete" max-width="500px">
    <v-card>
      <v-toolbar color="#DA7171">
        <span class="text-subtitle-2 ml-4"> Eliminar un hogar</span>
      </v-toolbar>
      <v-card-text class="mt-2 mb-2"> ¿Desea eliminar el hogar?</v-card-text>
      <v-divider></v-divider>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn color="grey" variant="flat" @click="closeDelete">Cancelar</v-btn>
        <v-btn
          color="#03626C"
          variant="flat"
          :loading="loading"
          @click="deleteItemConfirm"
          >Aceptar</v-btn
        >
      </v-card-actions>
    </v-card>
  </v-dialog>

  <v-dialog v-model="dialogAssignedPeople" max-width="400px">
    <v-form ref="form" v-model="valid" enctype="multipart/form-data">
      <v-card>
        <v-toolbar color="#03626C">
          <span class="text-subtitle-2 ml-4">{{ formTitlePerson }}</span>
        </v-toolbar>
        <v-card-text>
          <v-container>
            <v-row>
              <v-col cols="12" md="12">
                <v-autocomplete
                  :no-data-text="'No hay datos disponibles'"
                  v-model="selectedPerson"
                  :items="people"
                  label="Personas"
                  prepend-icon="mdi-account"
                  item-title="namePerson"
                  item-value="id"
                  variant="underlined"
                  :rules="selectRules"
                >
                  <template v-slot:item="{ props, item }">
                    <v-list-item
                      v-bind="props"
                      :prepend-avatar="`${this.$axios.defaults.baseURL}images/${item.raw.imagePerson}`"
                      :title="item.raw.namePerson"
                    >
                    </v-list-item>
                  </template>
                </v-autocomplete>
                <v-select
                  v-model="selectedRole"
                  :items="roles"
                  item-title="nameRol"
                  item-value="id"
                  label="Rol"
                  variant="underlined"
                  density="compact"
                  :rules="selectRules"
                  prepend-icon="mdi-briefcase"
                >
                  <template v-slot:item="{ props, item }">
                    <v-list-item
                      v-bind="props"
                      :subtitle="item.raw.descriptionRol"
                    ></v-list-item>
                  </template>
                </v-select>
              </v-col>
            </v-row>
          </v-container>
        </v-card-text>
        <v-divider></v-divider>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="#DA7171" variant="flat" @click="closeAssignedPeople"
            >Cancelar</v-btn
          >
          <v-btn
            color="#03626C"
            variant="flat"
            @click="saveAssignedPeople"
            :disabled="!valid"
            >Aceptar</v-btn
          >
        </v-card-actions>
      </v-card>
    </v-form>
  </v-dialog>

  <v-dialog v-model="dialogAddPeople" max-width="800px">
    <v-form ref="form" v-model="valid" enctype="multipart/form-data">
      <v-card>
        <v-toolbar color="#03626C">
          <span class="text-subtitle-2 ml-4"
            ><span> {{ $t("home.steps.members.subtitle") }}</span></span
          >
        </v-toolbar>
        <v-card-text>
            <v-row :dense="roles.length > 4">
              <v-col
                  v-for="role in roles"
                  :key="role.id"
                  cols="12"
                  :sm="roles.length >= 2 ? 6 : 12"
                  :md="getDynamicColSize(roles.length)"
                   style="max-height: 450px; overflow-y: auto;"
                >
                  <v-card class="mx-auto" max-width="98%">
                    <v-list v-model:selected="selectedItems[role.id]" @update:selected="updateSelection(role, $event)"
                      select-strategy="leaf" multiple>
                      <v-list-subheader>{{ role.nameRol }}</v-list-subheader>
                      <v-list-item v-for="person in filteredPeople(role.id)" :key="`${role.id}-${person.id}`"
                        :value="person.id" active-class="text-green"
                        :prepend-avatar="`${$axios.defaults.baseURL}images/${person.imagePerson}`" class="py-3">
                        <!-- Contenido del ítem - Nueva estructura Vuetify 3 -->
                        <template v-slot:prepend>
                          <v-avatar>
                            <v-img :src="`${$axios.defaults.baseURL}images/${person.imagePerson}`" />
                          </v-avatar>
                        </template>

                        <!-- Nombre y rol -->
                        <v-list-item-title>{{ person.namePerson }}</v-list-item-title>
                        <v-list-item-subtitle class="mb-1 text-high-emphasis opacity-100">
                          {{ person.roleName }}
                        </v-list-item-subtitle>

                        <!-- Icono de selección -->
                        <template v-slot:append>
                          <v-icon v-if="isPersonSelected(person.id, role.id)" :color="
                              getRoleIcon(role.id) === 'mdi-star'
                                ? 'green-darken-3'
                                : 'green-darken-3'
                            ">
                            {{
                            getRoleIcon(role.id) === "mdi-star"
                            ? "mdi-star"
                            : "mdi-circle-slice-8"
                            }}
                          </v-icon>
                          <v-icon v-else class="opacity-30" :color="
                              getRoleIcon(role.id) === 'mdi-star'
                                ? 'green-darken-3'
                                : undefined
                            ">
                            {{
                            getRoleIcon(role.id) === "mdi-star"
                            ? "mdi-star-outline"
                            : "mdi-checkbox-blank-circle-outline"
                            }}
                          </v-icon>
                        </template>
                      </v-list-item>
                    </v-list>
                  </v-card>
                </v-col>
            </v-row>
        </v-card-text>
        <v-divider></v-divider>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="grey" variant="flat" @click="closeAddPeople">Cancelar</v-btn>
          <v-btn
            color="#03626C"
            variant="flat"
            @click="save()"
            :disabled="!this.editedItem.people.length > 0"
            :loading="loading"
            >Aceptar</v-btn
          >
        </v-card-actions>
      </v-card>
    </v-form>
  </v-dialog>
</template>

<script>
import { handleRequest } from "@/utils/api"; // Ruta al archivo
import LocalStorageService from "@/LocalStorageService";
import _ from "lodash";
export default {
  data: () => ({
    snackbar: false,
    sb_type: "",
    sb_message: "",
    showCode: false,
    sb_timeout: 2000,
    sb_title: "",
    sb_icon: "",
    valid: true,
    loading: false,
    btnLoading: false,
    dialog: false,
    dialogAssignedPeople: false,
    dialogDelete: false,
    file: null,
    imgMiniatura: "",
    homes: [],
    hometypes: [],
    status: [],
    people: [],
    tittlePerson: -1,
    persons: [],
    roles: [],
    data: {},
    selectedItems: {},
    step: 0,
    person_id: null,
    role_id: null,
    dialogAddPeople: false,
    selectedPerson: null, // Persona seleccionada en el formulario
    selectedRole: null, // Rol seleccionado en el formulario
    selectedHome: null, // Rol seleccionado en el formulario
    headers: [
      { title: "Nombre", value: "name", width: "20%" },
      { title: "Dirección", value: "address", width: "25%" },
      { title: "Ranking", value: "percent", width: "5%" },
      { title: "Personas", value: "people", width: "15%" },
      { title: "Tipo", value: "nameHomeType", width: "10%" },
      { title: "Estado", value: "nameStatus", width: "10%" },
      { title: "Acciones", value: "actions", sortable: false, width: "15%" },
    ],
    headersPeople: [
      { title: "Nombre", value: "name", width: "60%" },
      { title: "Rol", value: "roleName", width: "20%" },
      { title: "Acciones", value: "actions", sortable: false, width: "20%" },
    ],
    editedItem: {
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

    defaultItem: {
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

    originalItem: {
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

    tab: null,
    menu: false,
    menu2: false,
    input: null,
    input2: null,
    editedIndex: -1,
    search: "",
    nameRules: [
      (v) => !!v || "El campo es requerido",
      (v) => (v && v.length <= 50) || "El campo debe tener menos de 51 caracteres",
      (v) => (v && v.length >= 3) || "El campo debe tener al menos de 3 caracteres",
    ],
    selectRules: [(v) => !!v || "Seleccionar al menos un elemento"],
    codeRules: [
      (v) => !v || v.length >= 8 || "El código debe tener al menos 8 caracteres",
      //v => !v || /^[a-zA-Z0-9]+$/.test(v) || 'Solo se permiten letras y números'
    ],
  }),
  computed: {
    formTitle() {
      return this.editedIndex === -1 ? "Agregar Nuevo Hogar" : "Editar Hogar";
    },
    formTitlePerson() {
      return this.tittlePerson === -1
        ? "Asignar Personas al Hogar"
        : "Editar rol de la persona";
    },
    imgedit() {
      return this.imgMiniatura;
    },
  },
  mounted() {
    this.home_id = JSON.parse(LocalStorageService.getItem("home_id"));
    this.person_id = JSON.parse(LocalStorageService.getItem("person_id"));
    this.initialize();
  },
  methods: {
    getDynamicColSize(roleCount) {
    if (roleCount <= 2) return 6;      // 2 columnas
    if (roleCount <= 4) return 4;      // 3 columnas
    if (roleCount <= 6) return 3;      // 4 columnas
    return 2;                          // Máximo 6 columnas
  },
    nextStep() {
      if (this.step < 2) { // 0=basic, 1=details, 2=members
        this.step++
      } else {
        this.save()
      }
    },
    getTypeColor(type) {
      const colorMap = {
        Tarea: "warning",
        Meta: "purple",
        // Agrega más tipos si es necesario
      };
      return colorMap[type] || "brown"; // Color por defecto
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
    async showAssiegnedPeople() {
      this.tittlePerson = -1;
      // Filtrar las personas que no están en editedItem.people usando el 'id' para la comparación
      this.people = this.people.filter((person) => {
        // Verificar si la persona no está en editedItem.people
        return !this.editedItem.people.some(
          (editedPerson) => editedPerson.id === person.id
        );
      });
      this.dialogAssignedPeople = true;
    },
    async showAdd() {
      this.step = 0;
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
          this.showAlert("info", result.message || "No hay datos disponibles.", 3000);
        }
      } catch (error) {
        this.showAlert("error", "Ocurrió un error inesperado al cargar los datos.", 3000);
      } finally {
        // Crear el objeto de persona con el rol "Padre"
        /*const newMember = {
          id: this.person_id,
          roleId: fatherRole.id,
          roleName: fatherRole.nameRol,
        };*/
        const activeStatus = this.status.find(
            (status) => status.nameStatus === "Activa" || status.nameStatus.toLowerCase() === "activa"
          );

          if (activeStatus) {
            this.editedItem.status_id = activeStatus.id;
          }
           const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
      this.editedItem.timezone = timezone;
      this.initializeSelections();
        this.dialog = true;
      }
    },
    close() {
      this.dialog = false;
      this.$nextTick(() => {
        this.editedItem = Object.assign({}, this.defaultItem);
        this.originalItem = Object.assign({}, this.defaultItem);
      });
      this.file = null;
      this.imgMiniatura = "";
      this.editedIndex = -1;
      this.dialogAddPeople = false;
    },
      filteredPeople(roleId) {
      return this.people.filter((person) => {
        const assignedPerson = this.editedItem.people.find((p) => p.id === person.id);
        return !assignedPerson || assignedPerson.roleId === roleId;
      });
    },
     isPersonSelected(personId, roleId) {
      return this.editedItem.people.some((p) => p.id === personId && p.roleId === roleId);
    },
    getRoleIcon(roleId) {
      const role = this.roles.find((r) => r.id === roleId);
      if (!role) return "mdi-account";

      switch (role.name.toLowerCase()) {
        case "administrador":
          return "mdi-star";
        case "miembro":
          return "mdi-account-group";
        default:
          return "mdi-account";
      }
    },
    updateSelection(role, selectedIds) {
      console.log("Selection changed:", { role, selectedIds });

      // Eliminar personas de este rol que ya no están seleccionadas
      this.editedItem.people = this.editedItem.people.filter(
        (p) => p.roleId !== role.id || selectedIds.includes(p.id)
      );

      // Agregar nuevas selecciones
      selectedIds.forEach((personId) => {
        if (
          !this.editedItem.people.some((p) => p.id === personId && p.roleId === role.id)
        ) {
          const person = this.people.find((p) => p.id === personId);
          if (person) {
            this.editedItem.people.push({
              id: person.id,
              name: person.namePerson,
              image: person.imagePerson,
              roleId: role.id,
              roleName: role.nameRol,
            });
          }
        }
      });

      console.log("Updated people:", this.editedItem.people);
    },
    initializeSelections() {
      // Verificar si person_id no está en editedItem.people
      if (
        this.person_id &&
        !this.editedItem.people.some((p) => p.id === this.person_id)
      ) {
        // Buscar el rol "Responsable" en los roles disponibles
        const responsableRole = this.roles.find((role) => role.name === "Administrador");
        // Buscar la persona correspondiente al person_id (asumiendo que tienes acceso a las personas)
        const person = this.people.find((p) => p.id === this.person_id); // Asegúrate de tener this.people disponible

        if (responsableRole && person) {
          // Agregar la persona con el rol de Responsable y toda la estructura requerida
          this.editedItem.people.push({
            id: person.id,
            name: person.namePerson,
            image: person.imagePerson,
            roleId: responsableRole.id,
            roleName: responsableRole.nameRol,
          });
        }
      }

      // Inicializar selectedItems para cada rol
      this.roles.forEach((role) => {
        this.selectedItems[role.id] = this.editedItem.people
          .filter((p) => p.roleId === role.id)
          .map((p) => p.id);
      });
    },
    closeAssignedPeople() {
      this.dialogAssignedPeople = false;
      this.selectedPerson = null;
      this.selectedRole = null;
      this.tittlePerson = -1;
    },
    saveAssignedPeople() {
      if (this.selectedPerson && this.selectedRole) {
        const person = this.people.find((p) => p.id === this.selectedPerson);
        const role = this.roles.find((r) => r.id === this.selectedRole);

        if (!person || !role) {
          console.error("Persona o rol no encontrado.");
          return;
        }

        // Crear un nuevo objeto con los datos actuales
        const newPerson = {
          id: person.id,
          name: person.namePerson,
          image: person.imagePerson,
          roleId: role.id,
          roleName: role.nameRol,
        };
        // Verificar si la relación ya existe en editedItem.people
        const existingPersonIndex = this.editedItem.people.findIndex(
          (p) => p.id === newPerson.id
        );

        if (existingPersonIndex === -1) {
          // No existe, por lo tanto, se agrega uno nuevo
          this.editedItem.people.push(newPerson);
        } else {
          // Existe, por lo tanto se edita el existente
          this.editedItem.people.splice(existingPersonIndex, 1, newPerson); // Actualiza el elemento en el array
        }
      }

      // Reiniciar selección y cerrar diálogo
      this.closeAssignedPeople();
    },
    editItemPeople(item) {
      this.selectedPerson = item.id;
      this.selectedRole = item.roleId;
      this.dialogAssignedPeople = true;
      this.tittlePerson = 1;
    },
    deleteItemPeople(item) {
      const index = this.editedItem.people.findIndex((p) => p.id === item.id);
      if (index !== -1) {
        this.editedItem.people.splice(index, 1);
      }
    },
    async initialize() {
      this.data = {};
      try {
        this.loading = true;
        const result = await handleRequest({
          endpoint: "person-homes",
          method: "POST",
        });

        if (result.success) {
          // Si la solicitud es exitosa, asignamos las sucursales
          this.homes = result.data?.homes || []; // Si no hay roles, asigna un arreglo vacío
        } else {
          // Si no hay datos, asignamos un array vacío
          this.homes = [];
          this.showAlert(
            "success",
            result.message || "No hay hogares disponibles.",
            3000
          );
        }
      } catch (error) {
        this.loading = false;
        // Captura de errores no controlados
        this.showAlert(
          "error",
          "Ocurrió un error inesperado al cargar las tareas.",
          3000
        );
      } finally {
        this.loading = false;
      }
    },
    getTypeIcon(type) {
      switch (type) {
        case "home":
          return "mdi-clipboard-text"; // Ícono para tareas
        case "Sistema":
          return "mdi-cog"; // Ícono para productos
        case "Home":
          return "mdi-home"; // Ícono para hogar
        default:
          return "mdi-help-circle"; // Ícono por defecto
      }
    },
    getTypeDetails(type) {
      switch (type) {
        case "home":
          return { icon: "mdi-clipboard-text", name: "Tarea" }; // Ícono y nombre para tareas
        case "Sistema":
          return { icon: "mdi-cog", name: "Sistema" }; // Ícono y nombre para sistema
        case "Home":
          return { icon: "mdi-home", name: "Hogar" }; // Ícono y nombre para hogar
        default:
          return { icon: "mdi-help-circle", name: "Desconocido" }; // Ícono y nombre por defecto
      }
    },
    /*getTypeColor(type) {
      switch (type) {
        case "Task":
          return "#FFB300"; // Color sugerente para tareas (amarillo)
        case "Sistema":
          return "#43A047"; // Color sugerente para productos (verde)
        case "Home":
          return "#03626C"; // Color base para hogar
        default:
          return "#E0E0E0"; // Color gris claro para otros tipos
      }
    },*/
    async save() {
      this.loading = true;
      if (this.editedIndex === -1) {
        this.valid = false;
        const fieldsToUpdate = [
          "name",
          "address",
          "home_type_id",
          "status_id",
          "category_id",
          "residents",
          "geo_location",
          "timezone",
          "people",
          "image",
        ];
        let updatedFields = Object.keys(this.editedItem)
          .filter(
            (key) =>
              fieldsToUpdate.includes(key) &&
              this.editedItem[key] !== this.originalItem[key]
          )
          .reduce((obj, key) => {
            if (key === "people") {
              // Transformar el campo `people`
              obj[key] = this.editedItem.people.map((person) => ({
                person_id: Number(person.id), // Asegurar que sea un número
                role_id: Number(person.roleId),
                roleName: person.roleName,
              }));
            } else {
              obj[key] = this.editedItem[key];
            }
            return obj;
          }, {});

        // Agregar campos adicionales si es necesario
        if (Object.keys(updatedFields).length > 0) {
          if (this.file) {
            updatedFields.image = this.editedItem.image;
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
              endpoint: "home",
              method: "POST",
              data: formData,
            });

            // Manejo de la respuesta según el resultado
            if (result.success) {
              this.loading = false;
              this.showAlert("success", result.message, 3000);
              this.initialize();
            } else {
              this.loading = false;
              this.showAlert("warning", result.message, 3000);
            }
          } catch (error) {
            this.loading = false;
            // Este bloque captura errores inesperados fuera del manejo estándar
            this.showAlert(
              "error",
              "Ocurrió un error inesperado al procesar la solicitud.",
              3000
            );
          }
        } else {
          this.loading = false;
          this.showAlert("success", "Debe completar los datos del hogar.", 3000);
        }
      } else {
        this.valid = false;
        const fieldsToUpdate = [
          "name",
          "address",
          "home_type_id",
          "status_id",
          "category_id",
          "residents",
          "geo_location",
          "timezone",
          "people",
          "image",
        ];

        let updatedFields = Object.keys(this.editedItem)
          .filter(
            (key) =>
              fieldsToUpdate.includes(key) &&
              (key !== "people"
                ? this.editedItem[key] !== this.originalItem[key]
                : this.arePeopleDifferent(this.originalItem[key], this.editedItem[key])) // Compara el array people
          )
          .reduce((obj, key) => {
            if (key === "people") {
              // Transformar el campo `people`
              obj[key] = this.editedItem.people.map((person) => ({
                person_id: person.id ? Number(person.id) : Number(person.id), // Asegurar que sea un número
                role_id: Number(person.roleId), // Asegurar que sea un número
                roleName: person.roleName,
              }));
            } else {
              obj[key] = this.editedItem[key];
            }
            return obj;
          }, {});
        if (Object.keys(updatedFields).length > 0) {
          updatedFields.id = this.editedItem.id;
          if (this.file) {
            updatedFields.image = this.editedItem.image;
          }
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
              endpoint: "home-update",
              method: "POST",
              data: formData,
            });

            // Manejo de la respuesta según el resultado
            if (result.success) {
              this.loading = false;
              this.showAlert("success", result.message, 3000);
              this.initialize();
            } else {
              this.loading = false;
              this.editedIndex = -1;
              this.showAlert("warning", result.message, 3000);
            }
          } catch (error) {
            this.loading = false;
            this.editedIndex = -1;
            // Este bloque captura errores inesperados fuera del manejo estándar
            this.showAlert(
              "error",
              "Ocurrió un error inesperado al procesar la solicitud.",
              3000
            );
          }
        } else {
          this.editedIndex = -1;
          this.loading = false;
          this.showAlert("success", "No se realizaron cambios.", 3000);
        }
      }
      this.close();
    },
    arePeopleDifferent(originalPeople, editedPeople) {
      // Convertir ambos arrays en cadenas de texto para una comparación profunda
      const sortedOriginal = [...originalPeople].sort((a, b) => a.id - b.id);
      const sortedEdited = [...editedPeople].sort((a, b) => a.id - b.id);
      // Comparar las cadenas generadas
      return JSON.stringify(sortedOriginal) !== JSON.stringify(sortedEdited);
    },
    async editItem(item) {
      this.editedIndex = 1;
      this.btnLoading = true;
      this.step = 0;
      // Filtrar las personas que tengan 'select' igual a 1
      //const selectedPeople = item.people.filter(person => person.select === 1);

      // Asignar a originalItem y editedItem solo las personas seleccionadas
      this.originalItem = _.cloneDeep(item);
      this.editedItem = _.cloneDeep(item);

      // Asignamos las personas seleccionadas a las propiedades 'people' de los dos objetos
      //this.originalItem.people = _.cloneDeep(selectedPeople); // Aseguramos una copia profunda
      //this.editedItem.people = _.cloneDeep(selectedPeople); // Aseguramos una copia profunda
      this.file = null;
      // Crear la imagen y configurar el src
      const img = new Image();
      img.src = `${this.$axios.defaults.baseURL}images/${item.image}`; // Se asume que item.image_url es la URL de la imagen

      // Usar una función asíncrona para manejar la carga de la imagen
      img.onload = async () => {
        try {
          // Asignar la imagen cargada a imgMiniatura
          this.imgMiniatura = `${this.$axios.defaults.baseURL}images/${item.image}`;
        } catch (error) {
          this.showAlert("error", "Error al cargar la imagen.", 3000);
        }
      };
      this.data = {};
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
          this.btnLoading = false;
          this.showAlert("info", result.message || "No hay datos disponibles.", 3000);
        }
      } catch (error) {
        this.btnLoading = false;
        this.showAlert("error", "Ocurrió un error inesperado al cargar los datos.", 3000);
      } finally {
        if (this.editedItem.timezone === null) {
         const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
          this.editedItem.timezone = timezone; 
        }
        this.initializeSelections();
        this.dialog = true;
        this.btnLoading = false;
      }
    },
    deleteItem(item) {
      this.editedIndex = 1;
      this.editedItem.id = item.id;
      this.dialogDelete = true;
    },
    closeDelete() {
      this.dialogDelete = false;
      this.$nextTick(() => {
        this.editedItem = Object.assign({}, this.defaultItem);
        this.originalItem = Object.assign({}, this.defaultItem);
      });
    },
    async deleteItemConfirm() {
      this.loading = true;
      try {
        let request = {
          id: this.editedItem.id,
        };
        const result = await handleRequest({
          endpoint: "home-destroy",
          method: "POST",
          data: request,
        });

        // Manejo de la respuesta según el resultado
        if (result.success) {
          this.showAlert("success", result.message, 3000);
          this.initialize();
        } else {
          this.loading = false;
          this.showAlert("warning", result.message, 3000);
        }
      } catch (error) {
        // Este bloque captura errores inesperados fuera del manejo estándar
        this.showAlert(
          "error",
          "Ocurrió un error inesperado al procesar la solicitud.",
          3000
        );
      } finally {
        this.loading = false;
        this.closeDelete();
      }
    },
    showAlert(sb_type, sb_message, sb_timeout) {
      this.sb_type = sb_type;

      if (sb_type == "success") {
        this.sb_title = "Éxito";
        this.sb_icon = "mdi-check-circle";
      }

      if (sb_type == "error") {
        this.sb_title = "Error";
        this.sb_icon = "mdi-check-circle";
      }

      if (sb_type == "warning") {
        this.sb_title = "Advertencia";
        this.sb_icon = "mdi-alert-circle";
      }
      this.sb_message = sb_message;
      this.sb_timeout = sb_timeout;
      this.snackbar = true;
    },
    imagenDisponible() {
      if (this.imgedit !== undefined && this.imgedit !== "") {
        // Intenta cargar la imagen en un elemento oculto para verificar si está disponible
        let img = new Image();
        img.src = this.imgedit;
        return true; // Devuelve true si la imagen está disponible
      }
      return false; // Si la URL de la imagen no está definida o está vacía, devuelve false
    },
    onFileSelected(event) {
      let file = event.target.files[0];
      // Validar el tamaño del archivo (500 KB máximo)
      const maxSize = 500 * 1024; // 500 KB en bytes
      if (file && file.size > maxSize) {
        this.showAlert("warning", "El archivo de imagen debe ser de máximo 500 KB", 3000);
        return; // Detener el proceso si el archivo es demasiado grande
      }
      this.editedItem.image = file;
      //console.log(this.editedItem.image_cardgift);
      this.cargarImage(file);
    },
    cargarImage(file) {
      let reader = new FileReader();
      reader.onload = (e) => {
        this.imgMiniatura = e.target.result;
      };
      reader.readAsDataURL(file);
    },
    //asignar personas
    async addPeople(item) {
      this.editedIndex = 1;
      this.selectedHome = item.id;
        this.originalItem = _.cloneDeep(item);
        this.editedItem = _.cloneDeep(item);

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
          this.showAlert("info", result.message || "No hay datos disponibles.", 3000);
        }
      } catch (error) {
        this.showAlert("error", "Ocurrió un error inesperado al cargar los datos.", 3000);
      } finally {
        this.initializeSelections();
        this.dialogAddPeople = true;
      }
    },
    closeAddPeople() {
      this.person_id = null;
      this.role_id = null;
      this.selectedHome = null;
      this.dialogAddPeople = false;
    },
    async saveAddPeople() {
      this.valid = false;
      this.data = {};
      this.data.person_id = this.person_id;
      this.data.role_id = this.role_id;
      this.data.home_id = this.selectedHome;
      // Buscar el rol correspondiente en el array roles
      const selectedRole = this.roles.find((role) => role.id === this.role_id);

      // Agregar el nombre del rol a this.data
      if (selectedRole) {
        this.data.roleName = selectedRole.nameRol;
      } else {
        this.data.roleName = "Rol no encontrado"; // O algún valor por defecto
      }
      try {
        const result = await handleRequest({
          endpoint: "home-person",
          method: "POST",
          data: this.data,
        });

        // Manejo de la respuesta según el resultado
        if (result.success) {
          this.showAlert("success", result.message, 3000);
          this.initialize();
        } else {
          this.showAlert("warning", result.message, 3000);
          this.closeAddPeople();
        }
      } catch (error) {
        // Este bloque captura errores inesperados fuera del manejo estándar
        this.showAlert(
          "error",
          "Ocurrió un error inesperado al procesar la solicitud.",
          3000
        );
        this.closeAddPeople();
      } finally {
        this.closeAddPeople();
      }
    },
  },
};
</script>
<style scoped>
.icono-concavo {
  width: 50px;
  height: 50px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 10px;
  margin-right: 2px;
  color: white;
  /* Mantenemos solo el efecto cóncavo en el ícono 
  box-shadow: inset;*/
  position: relative;
  overflow: hidden;
  transition: all 0.3s ease;
  cursor: pointer;
  z-index: 1;
}

.icono-concavo::after {
  content: "";
  position: absolute;
  top: 2px;
  left: 2px;
  right: 2px;
  bottom: 2px;
  border-radius: 8px;
  background: transparent;
}
.icono-concavo:hover .img-concava {
  filter: brightness(1.1);
}
.img-concava {
  width: 100%;
  height: 100%;
  object-fit: cover; /* Asegura que la imagen cubra el espacio */
  border-radius: 8px; /* Para que coincida con el contenedor */
}
.modal-imagen {
  background: transparent !important;
  box-shadow: none !important;
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
  border: 2px solid #4caf50;
  /* Cambia el color del borde según desees */
  border-radius: 50%;
  transition: transform 0.2s ease, box-shadow 0.2s ease;
  /* Para que siga siendo redondo */
  box-sizing: border-box;
  /* Asegura que el borde no afecte el tamaño del avatar */
  /* Optional: reduce the space even further between avatars */
}

.avatar-item.hover-expand:hover {
  transform: scale(1.5);
  box-shadow: 0 0 0 rgba(0, 0, 0, 0.3);
}

.text-secondary {
  color: #6c757d;
  /* Color gris claro */
  font-size: 0.85rem;
  /* Tamaño de texto más pequeño */
}

.custom-tooltip {
  background-color: #f5f5f5 !important;
  /* Fondo claro */
  color: #e5e5e5 !important;
  /* Texto oscuro */
  border-radius: 8px;
  /* Bordes redondeados */
  padding: 8px;
  /* Espaciado interno */
  box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.1);
  /* Sombra suave */
}

.selected-tab {
  background-color: #03626c;
  /* Fondo del tab seleccionado */
  color: white;
  /* Texto blanco */
  border-radius: 4px;
  /* Esquinas redondeadas, opcional */
}

.star-rating {
  display: flex;
  align-items: center;
  margin-top: 4px;
  /* Espacio entre el rol y las estrellas */
}
</style>
