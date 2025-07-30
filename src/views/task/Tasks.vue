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
  <v-container class="pa-4">
  <v-card class="pa-4" elevation="4" rounded="lg">
      <!-- Encabezado con foto y datos -->
      <v-card-text>
    <!-- Encabezado -->
    <v-row justify="space-between" align="center" class="mb-6">
      <h2 class="text-h5 font-weight-bold">{{ $t("viewTitles.tasks") }}</h2>
      <v-btn icon color="deep-purple-accent-4" variant="flat" class="elevation-3" @click="showAdd">
        <v-icon>mdi-plus</v-icon>
      </v-btn>
    </v-row>
   <div class="d-flex flex-wrap align-center gap-2">
  <v-spacer></v-spacer>
  <v-text-field
    v-model="searchDate"
    label="Buscar por fecha"
    variant="outlined"
    placeholder="DD-MM-YYYY"
    density="compact"
    style="max-width: 350px"
    clearable
    :rules="dateRules"
  >
    <template v-slot:append-inner>
      <v-locale-provider>
        <v-menu 
          v-model="dateMenu" 
          :close-on-content-click="false" 
          transition="scale-transition" 
          offset-y 
          min-width="auto"
        >
          <template v-slot:activator="{ props }">
            <v-icon
              v-bind="props"
              color="#03626C"
              @click="dateMenu = true"
            >
              mdi-calendar
            </v-icon>
          </template>
          <v-date-picker 
            color="#03626C"
            v-model="pickerDate"
            @update:model-value="updateSearchDate"
          ></v-date-picker>
        </v-menu>
      </v-locale-provider>
    </template>
  </v-text-field>
</div>
    <v-row>
      <v-col cols="12" style="max-height: 60vh; min-height: 40vh; overflow-y: auto">
    <template v-if="filteredTasks.length > 0">
      <!-- Tarjetas de reuniones -->
      <v-card v-for="(meeting, index) in filteredTasks" :key="index" class="mb-4 rounded-lg pa-2" density="comfortable" elevation="2"
        :class="{ 'smooth-hover': true }">
        <v-row>
          <!-- Barra lateral de color e info -->
          <v-col cols="1" class="d-flex justify-start">
           <div class="icono-concavo d-flex flex-column justify-center justify-start"
              :class="`bg-${getTypeColor(meeting.type)}`">
            <div class="date-display">
              {{ formatIntuitiveDate(meeting.start_date) }}
            </div>
            <div v-if="meeting.start_time" class="time-display">
              {{ formatTime(meeting.start_time) }}
            </div>
          </div>
          </v-col>

          <!-- Contenido principal -->
          <v-col cols="6" class="d-flex align-center justify-start">
              <v-row align="center" class="gap-3">
                <div>
                  <div class="font-weight-bold text-body-2">{{ meeting.title }}</div>
                  <div class="text-caption d-flex align-center text-grey-darken-1">
                    {{ meeting.description }}
                  </div>
                  <div class="text-caption d-flex align-center text-grey-darken-1">
                    {{ meeting.geo_location }}
                  </div>
                </div>
            </v-row>
          </v-col>
          <v-col cols="1" class="d-flex align-center justify-start">
            <!-- Info usuario -->
            <v-row align="center" class="gap-3">
              <div class="avatar-row d-flex flex-wrap justify-end gap-1">
                <v-tooltip v-for="person in meeting.people" :key="person.id" bottom :open-delay="300"
                  :close-delay="100">
                  <template v-slot:activator="{ props }">
                    <v-avatar class="avatar-item hover-expand" size="32" v-bind="props">
                      <v-img :src="`${this.$axios.defaults.baseURL}images/${
                          person.image
                        }?t=${Date.now()}`" alt="avatar" />
                    </v-avatar>
                  </template>
                  <span>{{ person.name }}<br />{{ person.roleName }}</span>
                </v-tooltip>
              </div>
            </v-row>
          </v-col>
          <v-col cols="1" class="d-flex align-center justify-start">
            <div>
              <v-icon :color="getTypeColor(meeting.type)"
                style="font-size: 10px; filter: drop-shadow(0 0 2px currentColor)" icon="mdi-circle"
                class="mr-0"></v-icon>
              <span class="text-black">{{ meeting.typeName }}</span>
            </div>
          </v-col>
          <v-col cols="1" class="d-flex align-center justify-start">
            <div>
              <span class="text-black">{{ meeting.namePriority }}</span>
            </div>
          </v-col>
          <v-col cols="1" class="d-flex align-center justify-end justify-start">
            <v-row>
              <!-- Fecha y estado -->
              <div class="text-end">
                <v-dialog v-model="meeting.statusDialog" width="400">
                  <template v-slot:activator="{ props }">
                    <v-btn v-bind="props" :color="
                        '#' + (getStatusById(meeting.status_id)?.colorStatus || 'grey')
                      " variant="text" size="small" :prepend-icon="
                        getStatusById(meeting.status_id)?.iconStatus || 'mdi-help-circle'
                      ">
                      {{ getStatusById(meeting.status_id)?.nameStatus || "Desconocido" }}
                    </v-btn>
                  </template>
                  <v-card>
                    <v-card-title class="pa-4 text-center">
                      {{ $t("taskForm.updateStatus") }}
                    </v-card-title>
                    <v-divider></v-divider>
                    <v-card-text class="pa-0">
                      <v-row class="px-2 pb-1" dense>
                        <v-col cols="12" v-for="(statusOption, i) in status" :key="i" class="py-1">
                          <v-card @click="changeTaskStatus(meeting, statusOption.id)" :class="[
                              'status-option mx-1',
                              { 'current-status': meeting.status_id === statusOption.id },
                            ]" :style="
                              meeting.status_id === statusOption.id
                                ? {
                                    'background-color': `#${statusOption.colorStatus}`,
                                    'border-color': `#${statusOption.colorStatus}`,
                                    color: 'white',
                                  }
                                : {}
                            " variant="outlined" :elevation="meeting.status_id === statusOption.id ? 2 : 0"
                            style="border-radius: 12px; cursor: pointer">
                            <v-card-item class="pa-2">
                              <div class="d-flex align-center">
                                <v-icon :color="
                                    meeting.status_id === statusOption.id
                                      ? 'white'
                                      : '#' + statusOption.colorStatus
                                  " :icon="statusOption.iconStatus" size="large" class="mr-3"></v-icon>
                                <v-card-title :style="{
                                    color:
                                      meeting.status_id === statusOption.id
                                        ? 'white'
                                        : 'inherit',
                                    'font-size': '1rem',
                                  }">
                                  {{ statusOption.nameStatus }}
                                </v-card-title>
                                <v-spacer></v-spacer>
                                <v-icon v-if="meeting.status_id === statusOption.id" color="white"
                                  icon="mdi-check-circle"></v-icon>
                              </div>
                            </v-card-item>
                          </v-card>
                        </v-col>
                      </v-row>
                    </v-card-text>
                    <v-divider></v-divider>
                    <v-card-actions>
                      <v-spacer></v-spacer>
                      <v-btn variant="flat" color="#03626C" @click="meeting.statusDialog = false">
                        {{ $t("buttons.cancel") }}
                      </v-btn>
                    </v-card-actions>
                  </v-card>
                </v-dialog>
              </div>
            </v-row>
          </v-col>

          <!-- Acciones -->
          <v-col cols="1" class="d-flex align-center ml-auto pe-4" style="margin-left: auto !important">
            <v-btn icon variant="text" color="green-darken-2" size="small" @click="editItem(meeting)">
              <v-icon>mdi-pencil</v-icon>
            </v-btn>
            <v-btn icon variant="text" color="red-darken-2" size="small" @click="deleteItem(meeting)">
              <v-icon>mdi-delete</v-icon>
            </v-btn>
          </v-col>
        </v-row>
      </v-card>
    </template>
    <template v-else>
      <v-col cols="12" class="text-center py-8 pa-0">
        <v-icon size="64" color="grey-lighten-1">mdi-check-circle-outline</v-icon>
        <div class="text-h6 text-grey mt-4">{{ $t("taskForm.noTasksToday") }}</div>
      </v-col>
    </template>
  </v-col>
  </v-row>
  </v-card-text>
  </v-card>
  </v-container>
  <v-dialog v-model="dialog" fullscreen persistent transition="dialog-bottom-transition"
    content-class="fullscreen-dialog">
    <v-form ref="form" v-model="valid" class="h-100">
      <v-card class="pa-10">
        <v-card-text class="pt-12">
          <!-- Pasos laterales -->

          <h5 class="text-grey-darken-2 font-weight-medium">{{ formTitle }}</h5>
          <p class="text-grey-lighten-1">{{ $t("formInstructions") }}</p>
          <v-row class="mt-12">
            <v-col cols="3">
              <v-timeline align="start" side="end" dense>
                <v-timeline-item v-for="(s, index) in steps" :key="index" :dot-color="
                    step > index
                      ? 'green'
                      : step === index
                      ? 'deep-purple'
                      : 'grey-lighten-1'
                  " :icon="
                    step >= index
                      ? step === index
                        ? `mdi-numeric-${index + 1}`
                        : 'mdi-check'
                      : null
                  " size="large">
                  <template #opposite>
                    <div class="text-end">
                      <strong>{{ $t(`steps.${s.title}.title`) }}</strong>
                      <div class="text-caption text-grey">
                        {{ $t(`steps.${s.title}.subtitle`) }}
                      </div>
                    </div>
                  </template>
                </v-timeline-item>
              </v-timeline>
            </v-col>

            <!-- Contenido dinámico según paso -->
            <v-col cols="9">
              <h3 class="text-deep-purple-accent-3 mb-8">
                {{ $t(`steps.${steps[step].title}.title`) }}
              </h3>

              <v-row dense v-if="step === 0">
                <v-col cols="12" sm="6">
                  <v-text-field v-model="editedItem.title" :label="$t('taskForm.fields.title')" variant="underlined"
                    :rules="nameRules" />
                </v-col>

                <v-col cols="12" sm="6">
                  <v-select v-model="editedItem.priority_id" :items="priorities" item-title="namePriority"
                    item-value="id" :label="$t('taskForm.fields.priority')" variant="underlined" required>
                    <!-- Cómo se muestra en la lista desplegable -->
                    <template v-slot:item="{ props, item }">
                      <v-list-item v-bind="props" :title="item.raw.namePriority"
                        :subtitle="item.raw.descriptionPriority">
                        <template v-slot:prepend>
                          <v-icon :color="'#' + item.raw.colorPriority">
                            mdi-priority-high
                          </v-icon>
                        </template>
                      </v-list-item>
                    </template>
                  </v-select>
                </v-col>
                <v-col cols="12" md="12">
                  <v-textarea v-model="editedItem.description" :label="$t('taskForm.fields.description')"
                    variant="underlined" rows="3"></v-textarea>
                </v-col>
              </v-row>
              <v-row dense v-if="step === 1">
                <v-col cols="6" v-for="role in roles" :key="role.id">
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
              <v-row dense v-if="step === 2">
                <v-col cols="12" md="6">
                    <v-locale-provider>
                  <v-menu v-model="menu" :close-on-content-click="false" :nudge-right="40" transition="scale-transition"
                    offset-y min-width="290px">
                    <template v-slot:activator="{ props }">
                      <v-text-field v-bind="props" :modelValue="dateFormatted" variant="underlined"
                        :label="$t('taskForm.today')"></v-text-field>
                    </template>
                      <v-date-picker color="#03626C" :modelValue="input" @update:model-value="updateDate"
                        format="yyyy-MM-dd"></v-date-picker>
                  </v-menu>
                    </v-locale-provider>
                </v-col>

                <v-col cols="12" md="6">
                  <v-text-field v-model="editedItem.start_time" :active="timePickerDialog" :focused="timePickerDialog"
                    :label="$t('taskForm.fields.time')" readonly variant="underlined"
                    @click="timePickerDialog = true"></v-text-field>

                  <v-dialog v-model="timePickerDialog" width="auto">
                    <v-locale-provider>
                      <v-time-picker v-model="editedItem.start_time" format="24hr" color="#03626C"
                        @update:model-value="timePickerDialog = false"></v-time-picker>
                    </v-locale-provider>
                  </v-dialog>
                </v-col>
                <v-col cols="12" md="6">
                  <v-text-field v-model="editedItem.estimated_time" type="number"
                    :label="$t('taskForm.fields.estimatedTime')" variant="underlined"
                    :rules="[(v) => v > 0 || 'Debe ser un número válido']"></v-text-field>
                </v-col>
                <v-col cols="12" md="6">
                  <v-text-field v-model="editedItem.geo_location" :label="$t('taskForm.fields.location')"
                    variant="underlined"></v-text-field>
                </v-col>
                <v-col cols="12" md="6">
                  <v-select v-model="editedItem.recurrence" :items="recurrences" item-title="name" item-value="id"
                    :label="$t('taskForm.fields.recurrence')" variant="underlined" density="compact"
                    :rules="selectRules">
                  </v-select>
                </v-col>
                <v-col cols="12" md="6" v-if="editedIndex !== -1">
                  <v-autocomplete v-model="editedItem.status_id" :items="status" :label="$t('taskForm.fields.status')"
                    item-title="nameStatus" item-value="id" variant="underlined" density="compact" :rules="selectRules">
                    <!-- Slot para el item seleccionado (en el input) -->
                    <template v-slot:selection="{ item }">
                      <div class="d-flex align-center">
                        <v-avatar size="24" :color="'#' + item.raw.colorStatus" class="mr-2">
                          <v-icon>{{ item.raw.iconStatus }}</v-icon>
                        </v-avatar>
                        <span>{{ item.raw.nameStatus }}</span>
                      </div>
                    </template>

                    <!-- Slot para los items del dropdown -->
                    <template v-slot:item="{ props, item }">
                      <v-list-item v-bind="props" :style="{
                          'background-color':
                            item.props.value === editedItem.status_id
                              ? `#${item.raw.colorStatus}20` // Aplica opacidad (20 = 12%)
                              : 'transparent',
                        }">
                        <template v-slot:prepend>
                          <v-avatar size="24" :color="'#' + item.raw.colorStatus">
                            <v-icon>{{ item.raw.iconStatus }}</v-icon>
                          </v-avatar>
                        </template>
                        <v-list-item-subtitle class="d-flex flex-column">
                          <div>{{ item.raw.descriptionStatus }}</div>
                        </v-list-item-subtitle>
                      </v-list-item>
                    </template>
                  </v-autocomplete>
                </v-col>
                <v-row v-if="editedItem.type === 'Evento'">
                  <v-col cols="12" md="6">
                   <v-locale-provider>
                    <v-menu v-model="menu2" :close-on-content-click="false" offset-y min-width="auto">
                      <template v-slot:activator="{ props }">
                        <v-text-field v-bind="props" :model-value="dateFormatted2"
                          :label="$t('taskForm.fields.endDate')" variant="underlined" readonly></v-text-field>
                      </template>
                      <v-date-picker v-model="editedItem.end_date" color="#03626C"
                        :min="editedItem.start_date"></v-date-picker>
                    </v-menu>
                    </v-locale-provider>
                  </v-col>

                  <v-col cols="12" md="6">
                    <v-select v-model="editedItem.end_time" :items="timeSlots" :label="$t('taskForm.fields.endTime')"
                      variant="underlined"></v-select>
                  </v-col>
                </v-row>
              </v-row>

              <div class="d-flex justify-space-between mt-8">
                <v-btn variant="text" class="text-grey-darken-1" @click="step > 0 ? step-- : this.close()">
                  {{ step === 0 ? $t("buttons.close") : $t("buttons.previous") }}
                </v-btn>

                <v-btn variant="text" class="text-deep-purple-accent-3" @click="nextStep" :disabled="!valid">
                  {{
                  step === steps.length - 1
                  ? $t("buttons.saveAndClose")
                  : $t("buttons.next")
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
        <span class="text-subtitle-2 ml-4">
          {{ $t("deleteDialog.title", { item: $t(`deleteDialog.items.task`) }) }}</span>
      </v-toolbar>
      <v-card-text class="mt-2 mb-2"> {{ $t("deleteDialog.message") }}</v-card-text>
      <v-divider></v-divider>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn color="grey" variant="flat" @click="closeDelete">{{
          $t("taskForm.buttons.cancel")
          }}</v-btn>
        <v-btn color="#03626C" variant="flat" :loading="loading" @click="deleteItemConfirm">
          {{ $t("taskForm.buttons.confirmDelete") }}</v-btn>
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
                <v-autocomplete :no-data-text="'No hay datos disponibles'" v-model="selectedPerson" :items="people"
                  label="Personas" prepend-icon="mdi-account" item-title="namePerson" item-value="id"
                  variant="underlined" :rules="selectRules">
                  <template v-slot:item="{ props, item }">
                    <v-list-item v-bind="props"
                      :prepend-avatar="`${this.$axios.defaults.baseURL}images/${item.raw.imagePerson}`"
                      :title="item.raw.namePerson">
                      <v-list-item-subtitle class="d-flex flex-column">
                        <div>Rol: {{ item.raw.roleName }}</div>
                      </v-list-item-subtitle>
                    </v-list-item>
                  </template>
                </v-autocomplete>
                <v-select v-model="selectedRole" :items="roles" item-title="nameRol" item-value="id" label="Rol"
                  variant="underlined" density="compact" :rules="selectRules" prepend-icon="mdi-briefcase">
                  <template v-slot:item="{ props, item }">
                    <v-list-item v-bind="props" :subtitle="item.raw.descriptionRol"></v-list-item>
                  </template>
                </v-select>
              </v-col>
            </v-row>
          </v-container>
        </v-card-text>
        <v-divider></v-divider>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="#DA7171" variant="flat" @click="closeAssignedPeople">Cancelar</v-btn>
          <v-btn color="#03626C" variant="flat" @click="saveAssignedPeople" :disabled="!valid">Aceptar</v-btn>
        </v-card-actions>
      </v-card>
    </v-form>
  </v-dialog>

  <v-dialog v-model="dialogAddPeople" max-width="400px">
    <v-form ref="form" v-model="valid" enctype="multipart/form-data">
      <v-card>
        <v-toolbar color="#03626C">
          <span class="text-subtitle-2 ml-4">Agregar Persona a la tarea</span>
        </v-toolbar>
        <v-card-text>
          <v-container>
            <v-row>
              <v-col cols="12" md="12">
                <v-autocomplete :no-data-text="'No hay datos disponibles'" v-model="person_id" :items="people"
                  label="Personas" prepend-icon="mdi-account" item-title="namePerson" item-value="id"
                  variant="underlined" :rules="selectRules">
                  <template v-slot:item="{ props, item }">
                    <v-list-item v-bind="props"
                      :prepend-avatar="`${this.$axios.defaults.baseURL}images/${item.raw.imagePerson}`"
                      :title="item.raw.namePerson">
                      <v-list-item-subtitle class="d-flex flex-column">
                        <div>Rol: {{ item.raw.roleName }}</div>
                      </v-list-item-subtitle>
                    </v-list-item>
                  </template>
                </v-autocomplete>
                <v-select v-model="role_id" :items="roles" item-title="nameRol" item-value="id" label="Rol"
                  variant="underlined" density="compact" :rules="selectRules" prepend-icon="mdi-briefcase">
                  <template v-slot:item="{ props, item }">
                    <v-list-item v-bind="props" :subtitle="item.raw.descriptionRol"></v-list-item>
                  </template>
                </v-select>
              </v-col>
            </v-row>
          </v-container>
        </v-card-text>
        <v-divider></v-divider>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="#DA7171" variant="flat" @click="closeAddPeople">Cancelar</v-btn>
          <v-btn color="#03626C" variant="flat" @click="saveAddPeople" :disabled="!valid"
            :loading="loading">Aceptar</v-btn>
        </v-card-actions>
      </v-card>
    </v-form>
  </v-dialog>
</template>

<script>
import { ref } from "vue";
import LocalStorageService from "@/LocalStorageService";
import { handleRequest } from "@/utils/api"; // Ruta al archivo
import _ from "lodash";
import { shallowRef } from "vue";
import { VTimePicker } from "vuetify/labs/components";

export default {
  components: {
    "v-time-picker": VTimePicker,
  },
  data: () => ({
    selected: shallowRef([2]),
    selected2: null,
    step: 0,
    dateMenu: false,
      searchDate: '',
      pickerDate: null,
    time: null,
    modal2: false,
    timePickerDialog: false,
    steps: [
      { title: "Información Básica", subtitle: "Ingresa el título y descripción" },
      { title: "Asignación", subtitle: "Selecciona responsables y participantes" },
      { title: "Programación", subtitle: "Elige fecha y hora de la tarea" },
    ],
    itemsPerPage: 6,
    currentPage: 1,
    snackbar: false,
    sb_type: "",
    sb_message: "",
    sb_timeout: 2000,
    sb_title: "",
    sb_icon: "",
    valid: true,
    loading: false,
    showDetails: false,
    dialog: false,
    dialogAssignedPeople: false,
    dialogDelete: false,
    file: null,
    imgMiniatura: "",
    tasks: [],
    categories: [],
    status: [],
    priorities: [],
    people: [],
    tittlePerson: -1,
    selectedItems: {}, // Almacena las selecciones por rol
    persons: [],
    recurrences: [],
    typetasks: [],
    home_id: "",
    roles: [],
    data: {},
    dialogAddPeople: false,
    person_id: "",
    role_id: "",
    task_id: "",
    timeSlots: [], // Inicialmente vacío
    selectedPerson: null, // Persona seleccionada en el formulario
    selectedRole: null, // Rol seleccionado en el formulario
    headers: [
      { title: "Título", value: "title", width: "20%" },
      { title: "Fecha", value: "start_date", width: "5%" },
      { title: "Descripción", value: "description", width: "30%" },
      { title: "Personas", value: "people", width: "30%" },
      { title: "Acciones", value: "actions", sortable: false, width: "20%" },
    ],
    headersPeople: [
      { title: "Nombre", value: "name", width: "60%" },
      { title: "Rol", value: "roleName", width: "20%" },
      { title: "Acciones", value: "actions", sortable: false, width: "20%" },
    ],
    editedItem: {
      id: "",
      title: "",
      description: "",
      start_date: null,
      end_date: null,
      start_time: null,
      end_time: null,
      type: "Tarea",
      parent_id: "",
      status_id: "",
      category_id: "",
      person_id: null,
      home_id: "",
      recurrence: "",
      estimated_time: 1,
      attachments: null,
      comments: "",
      geo_location: "",
      people: [],
    },

    defaultItem: {
      id: "",
      title: "",
      description: "",
      start_date: null,
      end_date: null,
      start_time: null,
      end_time: null,
      type: "",
      parent_id: "",
      status_id: "",
      category_id: "",
      person_id: null,
      home_id: "",
      recurrence: "",
      estimated_time: 1,
      attachments: null,
      comments: "",
      geo_location: "",
      people: [],
    },

    originalItem: {
      id: "",
      title: "",
      description: "",
      start_date: null,
      end_date: null,
      start_time: null,
      end_time: null,
      type: "",
      parent_id: "",
      status_id: "",
      category_id: "",
      person_id: null,
      home_id: "",
      recurrence: "",
      estimated_time: 1,
      attachments: null,
      comments: "",
      geo_location: "",
      people: [],
    },

    tab: "tab-1",
    tabs: [
      { text: "General", value: "general", icon: "mdi-file-document-outline" },
      { text: "Personas", value: "personas", icon: "mdi-account-group-outline" },
      { text: "Módulo", value: "modulo", icon: "mdi-view-dashboard-outline" },
      //{ text: 'Estado', value: 'estado', icon: 'mdi-progress-check' },
    ],

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

    sections: [
      { label: "General", value: "general", icon: "mdi-file-document-outline" },
      { label: "Personas", value: "personas", icon: "mdi-account-group-outline" },
      { label: "Módulo", value: "modulo", icon: "mdi-view-dashboard-outline" },
      { label: "Estado", value: "estado", icon: "mdi-progress-check" },
    ],
    dateRules: [
      value => {
        if (!value) return true;
        
        // Validación directa sin depender de this
        if (!/^\d{2}-\d{2}-\d{4}$/.test(value)) return 'Formato debe ser DD-MM-YYYY';
        
        const [day, month, year] = value.split('-').map(Number);
        
        // Validaciones básicas
        if (month < 1 || month > 12) return 'Mes inválido';
        if (day < 1 || day > 31) return 'Día inválido';
        
        // Validación de días por mes
        const monthLength = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
        
        // Ajuste para años bisiestos
        if (year % 400 === 0 || (year % 100 !== 0 && year % 4 === 0)) {
          monthLength[1] = 29;
        }
        
        return day <= monthLength[month - 1] || 'Fecha inválida para este mes';
      }
    ],
    title: "",
    description: "",
    date: "",
    module: "",
  }),
  computed: {
    formTitle() {
      return this.editedIndex === -1
        ? this.$t("taskForm.titles.new")
        : this.$t("taskForm.titles.edit");
    },
    formTitlePerson() {
      return this.tittlePerson === -1
        ? "Asignar Personas a la Tarea"
        : "Editar rol de la persona";
    },
    imgedit() {
      return this.imgMiniatura;
    },
    dateFormatted() {
      const date = this.input ? new Date(this.input) : new Date();
      const day = date.getDate().toString().padStart(2, "0");
      const month = (date.getMonth() + 1).toString().padStart(2, "0");
      const year = date.getFullYear();
      return `${year}-${month}-${day}`;
    },
    dateFormatted2() {
      const date = this.input2 ? new Date(this.input2) : new Date();
      const day = date.getDate().toString().padStart(2, "0");
      const month = (date.getMonth() + 1).toString().padStart(2, "0");
      const year = date.getFullYear();
      return `${year}-${month}-${day}`;
    },
    getDate() {
      return this.input ? new Date(this.input) : new Date();
    },
    getDate2() {
      return this.input2 ? new Date(this.input2) : new Date();
    },
    paginatedTasks() {
      if (!Array.isArray(this.tasks)) return []; // Verifica que tasks sea un array
      const start = (this.currentPage - 1) * this.itemsPerPage;
      const end = start + this.itemsPerPage;
      return this.tasks.slice(start, end);
    },
    pageCount() {
      return this.tasks?.length ? Math.ceil(this.tasks.length / this.itemsPerPage) : 0;
    },
    translatedSteps() {
      // Fallback en caso de que la traducción no esté disponible
      const defaultSteps = [
        { title: "Información Básica", subtitle: "Ingresa el título y descripción" },
        { title: "Asignación", subtitle: "Selecciona responsables y participantes" },
        { title: "Programación", subtitle: "Elige fecha y hora de la tarea" },
      ];

      return this.$t("steps") || defaultSteps;
    },
    filteredTasks() {
  return this.tasks.filter((task) => {
    // Si no hay búsqueda, mostrar todo
    if (!this.searchDate || this.searchDate.trim() === '') {
      return true;
    }

    const search = this.searchDate.trim();

    // Intentar interpretar como búsqueda de fecha parcial
    if (this.isValidDatePartial(search)) {
      // Formato esperado en task.start_date: 'YYYY-MM-DD'
      const taskDate = task.start_date; // ej: '2025-04-15'

      // Convertir búsqueda dd[-mm[-yyyy]] a patrón comparable con YYYY-MM-DD
      const parts = search.split('-');
      let pattern = '';

      if (parts.length === 1) {
        // Solo día: '15' → buscar cualquier fecha que termine en '-15' o '-15'
        const day = parts[0].padStart(2, '0');
        pattern = `-${day}`; // Coincide con cualquier mes que termine en -15
      } else if (parts.length === 2) {
        // Día y mes: '15-04' → convertir a '-04-15'
        const day = parts[0].padStart(2, '0');
        const month = parts[1].padStart(2, '0');
        pattern = `-${month}-${day}`;
      } else if (parts.length === 3) {
        // Completo: '15-04-2025' → convertir a '2025-04-15'
        const day = parts[0].padStart(2, '0');
        const month = parts[1].padStart(2, '0');
        const year = parts[2];
        if (year.length === 4) {
          pattern = `${year}-${month}-${day}`;
        } else {
          pattern = search; // fallback
        }
      }

      // Verificar si la fecha de la tarea incluye el patrón
      if (pattern && taskDate.includes(pattern)) {
        return true;
      }
    }

    // Búsqueda de texto general en otros campos (opcional)
    const matchesText = Object.values(task).some(val =>
      String(val).toLowerCase().includes(search.toLowerCase())
    );

    return matchesText;
  });
},
  },
  mounted() {
    this.home_id = JSON.parse(LocalStorageService.getItem("home_id"));
    this.person_id = JSON.parse(LocalStorageService.getItem("person_id"));
    this.initialize();
    this.timeSlots = this.generateTimeSlots(); // Genera los horarios al montar el componente
  },
  methods: {
    isValidDatePartial(dateStr) {
  const parts = dateStr.split('-');
  if (parts.length > 3) return false;

  const day = parts[0];
  const month = parts[1];
  const year = parts[2];

  // Validar día (1-31)
  if (!/^\d{1,2}$/.test(day) || parseInt(day) < 1 || parseInt(day) > 31) {
    return false;
  }

  // Si hay mes, validar (1-12)
  if (month && (!/^\d{1,2}$/.test(month) || parseInt(month) < 1 || parseInt(month) > 12)) {
    return false;
  }

  // Si hay año, validar longitud (4 dígitos)
  if (year && !/^\d{4}$/.test(year)) {
    return false;
  }

  return true;
},
   isValidDate(dateStr) {
    const rule = this.dateRules[0]; // Usamos la misma regla de validación
    const result = rule(dateStr);
    return result === true;
  },
  
  // Resto de tus métodos...
  handleManualDateInput(value) {
    if (value && this.isValidDate(value)) {
      const [day, month, year] = value.split('-');
      this.pickerDate = new Date(year, month - 1, day);
    } else {
      this.pickerDate = null;
    }
  },
  
  updateSearchDate(value) {
    if (value) {
      const day = String(value.getDate()).padStart(2, '0');
      const month = String(value.getMonth() + 1).padStart(2, '0');
      const year = value.getFullYear();
      this.searchDate = `${day}-${month}-${year}`;
    } else {
      this.searchDate = '';
    }
    this.dateMenu = false;
  },
    formatIntuitiveDate(dateString) {
      console.log("formatIntuitiveDate", dateString);
      if (!dateString) return "Sin fecha";

      // 1. Parsear la fecha de entrada (formato YYYY-MM-DD)
      const [year, month, day] = dateString.split("-");
      const inputDate = new Date(year, month - 1, day); // Mes es 0-based

      // 2. Obtener fecha actual (sin horas/minutos/segundos)
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      // 3. Normalizar ambas fechas a UTC para evitar problemas de zona horaria
      const inputUTC = Date.UTC(
        inputDate.getFullYear(),
        inputDate.getMonth(),
        inputDate.getDate()
      );
      const todayUTC = Date.UTC(today.getFullYear(), today.getMonth(), today.getDate());

      // 4. Calcular diferencia en días
      const diffDays = Math.floor((inputUTC - todayUTC) / (1000 * 60 * 60 * 24));

      // 5. Determinar el texto a mostrar
      switch (diffDays) {
        case 0:
          return "Hoy";
        case 1:
          return "Mañana";
        case -1:
          return "Ayer";
        default:
          return inputDate
            .toLocaleDateString("es-ES", {
              weekday: "short",
              day: "numeric",
              month: "short",
            })
            .replace(/\./g, "");
      }
    },
    getTypeColor(type) {
      const colorMap = {
        Tarea: "warning",
        Meta: "purple",
        // Agrega más tipos si es necesario
      };
      return colorMap[type] || "grey-lighten-1"; // Color por defecto
    },

    formatTime(timeString) {
      if (!timeString) return "";

      const [hours, minutes] = timeString.split(":");
      return `${hours}:${minutes}`;
    },
    formatDate(dateString) {
      const [year, month, day] = dateString.split("-");
      return `${day}-${month}-${year}`;
    },
    getStatusById(statusId) {
      return this.status.find((status) => status.id === statusId);
    },
    async changeTaskStatus(task, newStatusId) {
      console.log("tarea y estado");
      console.log(task.id);
      console.log(newStatusId);
      // Tu lógica para cambiar el estado
      //task.status_id = newStatusId;
      this.valid = false;
      this.data = {};
      this.data.id = task.id;
      this.data.status_id = newStatusId;

      try {
        const result = await handleRequest({
          endpoint: "task-update",
          method: "POST",
          data: this.data,
        });

        // Manejo de la respuesta según el resultado
        if (result.success) {
          this.showAlert("success", result.message, 3000);
          this.initialize();
        } else {
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
      }
      task.statusDialog = false;
      // Aquí probablemente quieras hacer una llamada API para actualizar el estado en el backend
    },
    // Filtra las personas para mostrar en cada card según el rol
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
        case "responsable":
          return "mdi-star";
        case "colaborado":
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
        const responsableRole = this.roles.find((role) => role.name === "Responsable");
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
    nextStep() {
      if (this.step < this.steps.length - 1) {
        this.step++;
      } else {
        this.dialog = false;
        this.step = 0;
        this.save();
      }
    },

    /*isPersonSelected(personId) {
      return this.editedItem.people.some((p) => p.person_id === personId);
    },*/
    togglePersonSelection(personId) {
      const index = this.editedItem.people.findIndex((p) => p.person_id === personId);

      if (index === -1) {
        // Añadir persona seleccionada
        this.editedItem.people.push({
          person_id: personId,
          home_id: this.home_id,
        });
      } else {
        // No permitir deseleccionar al usuario actual
        if (personId !== this.person_id) {
          this.editedItem.people.splice(index, 1);
        }
      }

      console.log("this.editedItem.people", this.editedItem.people);
      this.$emit("update:selected-people", this.editedItem.people);
    },
    async addPeople(item) {
      this.data = {};
      this.data.home_id = this.home_id;
      this.task_id = item.id;
      try {
        const result = await handleRequest({
          endpoint: "category-status-priority-apk",
          method: "POST",
          data: this.data,
        });

        if (result.success) {
          // Si la solicitud es exitosa, asignamos las sucursales
          this.categories = result.data?.taskcategories || [];
          this.status = result.data?.taskstatus || [];
          this.priorities = result.data?.taskpriorities || [];
          this.recurrences = result.data?.taskrecurrences || [];
          this.people = result.data?.taskpeople || [];
          this.roles = result.data?.taskroles || [];
        } else {
          // Si no hay datos, asignamos un array vacío
          this.categories = [];
          this.status = [];
          this.priorities = [];
          this.recurrences = [];
          this.people = [];
          this.roles = [];
          this.showAlert("info", result.message || "No hay datos disponibles.", 3000);
        }
      } catch (error) {
        this.showAlert("error", "Ocurrió un error inesperado al cargar los datos.", 3000);
      } finally {
        // Asignar a originalItem y editedItem solo las personas seleccionadas
        this.originalItem = _.cloneDeep(item);
        this.editedItem = _.cloneDeep(item);

        this.people = this.people.filter((person) => {
          // Verificar si la persona no está en editedItem.people
          return !this.editedItem.people.some(
            (editedPerson) => editedPerson.id === person.id
          );
        });
        this.dialogAddPeople = true;
      }
    },
    closeAddPeople() {
      this.person_id = "";
      this.role_id = "";
      this.task_id = "";
      this.dialogAddPeople = false;
    },
    async saveAddPeople() {
      this.valid = false;
      this.data = {};
      this.data.person_id = this.person_id;
      this.data.role_id = this.role_id;
      this.data.home_id = this.home_id;
      this.data.task_id = this.task_id;
      const selectedRole = this.roles.find((role) => role.id === this.role_id);

      // Agregar el nombre del rol a this.data
      if (selectedRole) {
        this.data.roleName = selectedRole.nameRol;
      } else {
        this.data.roleName = "Rol no encontrado"; // O algún valor por defecto
      }
      try {
        const result = await handleRequest({
          endpoint: "home-person-task",
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
    generateTimeSlots() {
      const now = new Date();
      const currentHour = now.getHours();
      const currentMinute = now.getMinutes();

      // Redondear a los 5 minutos más cercanos
      const roundedMinute = Math.ceil(currentMinute / 5) * 5;
      const nearestTime = new Date();
      nearestTime.setMinutes(roundedMinute, 0, 0);

      // Si pasamos de 60 minutos, ajustar hora
      if (roundedMinute >= 60) {
        nearestTime.setHours(currentHour + 1);
        nearestTime.setMinutes(0);
      }

      const formattedNearestTime =
        String(nearestTime.getHours()).padStart(2, "0") +
        ":" +
        String(nearestTime.getMinutes()).padStart(2, "0");

      // Generar todos los slots
      const allSlots = [];
      for (let hour = 0; hour < 24; hour++) {
        for (let minute = 0; minute < 60; minute += 5) {
          const formattedHour = String(hour).padStart(2, "0");
          const formattedMinute = String(minute).padStart(2, "0");
          allSlots.push(`${formattedHour}:${formattedMinute}`);
        }
      }

      // Ordenar los slots comenzando desde el más cercano
      const index = allSlots.indexOf(formattedNearestTime);
      const orderedSlots = [...allSlots.slice(index), ...allSlots.slice(0, index)];

      // Establecer el valor por defecto en editedItem
      this.editedItem.start_time = formattedNearestTime;

      return orderedSlots;
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
    updateDate(val) {
      this.input = val;
      this.editedItem.start_date = this.dateFormatted;
      this.menu = false;
    },
    updateDate1(val) {
      this.input2 = val;
      this.editedItem.end_date = this.dateFormatted2;
      this.menu2 = false;
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
      (this.file = null),
        (this.imgMiniatura = ""),
        (this.showDetails = false),
        (this.data = {});
      this.editedItem.home_id = this.home_id;
      this.data.home_id = this.editedItem.home_id;
      this.editedIndex = -1;
      try {
        const result = await handleRequest({
          endpoint: "category-status-priority-apk",
          method: "POST",
          data: this.data,
        });

        if (result.success) {
          // Si la solicitud es exitosa, asignamos las sucursales
          this.categories = result.data?.taskcategories || [];
          this.status = result.data?.taskstatus || [];
          this.priorities = result.data?.taskpriorities || [];
          const normalPriority = this.priorities.find(
            (priority) => priority.name === "Normal"
          );
          if (normalPriority) {
            this.editedItem.priority_id = normalPriority.id;
          }
          this.recurrences = result.data?.taskrecurrences || [];
          const diaryRecurrence = this.recurrences.find(
            (recurrence) => recurrence.recurrenceName === "Diaria"
          );
          if (diaryRecurrence) {
            this.editedItem.recurrence = diaryRecurrence.name;
          }
          this.people = result.data?.taskpeople || [];
          this.roles = result.data?.taskroles || [];
          this.typetasks = result.data?.tasktype || [];
          console.log("typetasks:", this.typetasks);
          //
        } else {
          // Si no hay datos, asignamos un array vacío
          this.categories = [];
          this.status = [];
          this.priorities = [];
          this.recurrences = [];
          this.people = [];
          this.roles = [];
          this.typetasks = [];
          this.showAlert("info", result.message || "No hay datos disponibles.", 3000);
        }
      } catch (error) {
        this.showAlert("error", "Ocurrió un error inesperado al cargar los datos.", 3000);
      } finally {
        this.dialog = true;
        this.initializeSelections();
        this.timeSlots = this.generateTimeSlots();
      }
    },
    close() {
      this.step = 0;
      this.dialog = false;
      this.$nextTick(() => {
        this.editedItem = Object.assign({}, this.defaultItem);
        this.originalItem = Object.assign({}, this.defaultItem);
      });
      this.file = null;
      this.imgMiniatura = "";
      this.editedIndex = -1;
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
      this.data.home_id = this.home_id;
      const today = new Date();
      const year = today.getFullYear();
      const month = String(today.getMonth() + 1).padStart(2, "0"); // Meses son 0-11
      const day = String(today.getDate()).padStart(2, "0");

      const formattedDate = `${year}-${month}-${day}`; // Formato "YYYY-MM-DD"
      this.data.start_date = formattedDate;
      try {
        this.loading = true;
        const result = await handleRequest({
          endpoint: "task-date-web",
          method: "POST",
          data: this.data,
        });

        if (result.success) {
          // Si la solicitud es exitosa, asignamos las sucursales
          this.tasks = result.data?.tasks || []; // Si no hay roles, asigna un arreglo vacío
          this.status = result.data?.status || []; // Si no hay roles, asigna un arreglo vacío
        } else {
          // Si no hay datos, asignamos un array vacío
          this.tasks = [];
          this.status = [];
          //this.showAlert('success', result.message || 'No hay tareas disponibles.', 3000);
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
        case "Task":
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
        case "Task":
          return { icon: "mdi-clipboard-text", name: "Tarea" }; // Ícono y nombre para tareas
        case "Sistema":
          return { icon: "mdi-cog", name: "Sistema" }; // Ícono y nombre para sistema
        case "Home":
          return { icon: "mdi-home", name: "Hogar" }; // Ícono y nombre para hogar
        default:
          return { icon: "mdi-help-circle", name: "Desconocido" }; // Ícono y nombre por defecto
      }
    },
    async save() {
      this.loading = true;
      if (this.editedIndex === -1) {
        this.valid = false;
        const fieldsToUpdate = [
          "title",
          "description",
          "start_date",
          "end_date",
          "parent_id",
          "status_id",
          "category_id",
          "home_id",
          "recurrence",
          "comments",
          "estimated_time",
          "attachments",
          "geo_location",
          "priority_id",
          "people",
          "start_time",
          "end_time",
          "type",
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
                home_id: Number(this.editedItem.home_id), // Asegurar que sea un número
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
          updatedFields.home_id = this.editedItem.home_id;
          updatedFields.start_date = this.editedItem.start_date
            ? this.editedItem.start_date
            : `${new Date().getFullYear()}-${String(new Date().getMonth() + 1).padStart(
                2,
                "0"
              )}-${String(new Date().getDate()).padStart(2, "0")}`;
          updatedFields.estimated_time = this.editedItem.estimated_time
            ? this.editedItem.estimated_time
            : 0;
          updatedFields.type = this.editedItem.type ? this.editedItem.type : "Tarea";

          if (this.file) {
            updatedFields.attachments = this.editedItem.attachments;
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
              endpoint: "task",
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
          this.showAlert("success", "Debe completar los datos de la tarea.", 3000);
        }
      } else {
        this.valid = false;
        const fieldsToUpdate = [
          "title",
          "description",
          "start_date",
          "end_date",
          "parent_id",
          "status_id",
          "category_id",
          "home_id",
          "recurrence",
          "comments",
          "estimated_time",
          "attachments",
          "geo_location",
          "priority_id",
          "people",
          "start_time",
          "end_time",
          "type",
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
                home_id: Number(this.editedItem.home_id), // Asegurar que sea un número
                person_id: person.id ? Number(person.id) : Number(person.id), // Asegurar que sea un número
                role_id: Number(person.roleId),
                roleName: person.roleName, // Asegurar que sea un número
              }));
            } else {
              obj[key] = this.editedItem[key];
            }
            return obj;
          }, {});
        if (Object.keys(updatedFields).length > 0) {
          updatedFields.id = this.editedItem.id;
          if (this.file) {
            updatedFields.attachments = this.editedItem.attachments;
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
              endpoint: "task-update",
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
      img.src = `${this.$axios.defaults.baseURL}images/${item.attachments}`; // Se asume que item.image_url es la URL de la imagen

      // Usar una función asíncrona para manejar la carga de la imagen
      img.onload = async () => {
        try {
          // Asignar la imagen cargada a imgMiniatura
          this.imgMiniatura = `${this.$axios.defaults.baseURL}images/${item.attachments}`;
        } catch (error) {
          console.error("Error al cargar la imagen", error);
          this.showAlert("error", "Error al cargar la imagen.", 3000);
        }
      };
      this.data = {};
      this.data.home_id = this.home_id;
      try {
        const result = await handleRequest({
          endpoint: "category-status-priority-apk",
          method: "POST",
          data: this.data,
        });

        if (result.success) {
          // Si la solicitud es exitosa, asignamos las sucursales
          this.categories = result.data?.taskcategories || [];
          this.status = result.data?.taskstatus || [];
          this.priorities = result.data?.taskpriorities || [];
          this.recurrences = result.data?.taskrecurrences || [];
          this.people = result.data?.taskpeople || [];
          this.roles = result.data?.taskroles || [];
        } else {
          // Si no hay datos, asignamos un array vacío
          this.categories = [];
          this.status = [];
          this.priorities = [];
          this.recurrences = [];
          this.people = [];
          this.roles = [];
          this.showAlert("info", result.message || "No hay datos disponibles.", 3000);
        }
      } catch (error) {
        this.showAlert("error", "Ocurrió un error inesperado al cargar los datos.", 3000);
      } finally {
        this.initializeSelections();
        //this.timeSlots = this.generateTimeSlots();
        this.dialog = true;
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
          endpoint: "task-destroy",
          method: "POST",
          data: request,
        });

        // Manejo de la respuesta según el resultado
        if (result.success) {
          this.showAlert("success", result.message, 3000);
          this.initialize();
        } else {
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
  color: white;
  /* Mantenemos solo el efecto cóncavo en el ícono 
  box-shadow: inset;*/
  position: relative;
  overflow: hidden;
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

.date-display {
  font-size: 0.75rem; /* Equivale a text-caption */
  line-height: 1.1;
  font-weight: 500;
  text-align: center;
  word-break: break-word;
  white-space: normal;
}

/* Estilos para la hora */
.time-display {
  font-size: 0.625rem;
  line-height: 1;
  margin-top: 2px;
}
.smooth-hover {
  transition: all 0.5s ease;
}

.smooth-hover:hover {
  transform: translateY(-1px);
  box-shadow: 0 3px 6px rgba(0, 0, 0, 0.12) !important;
}
.fullscreen-dialog {
  height: 100vh !important;
  max-height: 100vh !important;
  min-width: 100vh;
  margin: 0 !important;
  padding: 0 !important;
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

.avatar-item.hover-expand:hover {
  transform: scale(1.5);
  box-shadow: 0 0 0 rgba(0, 0, 0, 0.3);
}

.selected-tab {
  background-color: #03626c;
  /* Fondo del tab seleccionado */
  color: white;
  /* Texto blanco */
  border-radius: 4px;
  /* Esquinas redondeadas, opcional */
}

.people-scroll-container {
  width: 100%;
  overflow-x: auto;
  padding-bottom: 12px;
  /* Más espacio para el scroll */
  scrollbar-width: thin;
  /* Para navegadores modernos */
}

/* Estilo para la barra de scroll en WebKit */
.people-scroll-container::-webkit-scrollbar {
  height: 6px;
}

.people-scroll-container::-webkit-scrollbar-thumb {
  background-color: rgba(0, 0, 0, 0.2);
  border-radius: 3px;
}

.people-scroll-wrapper {
  display: inline-flex;
  gap: 12px;
  /* Más espacio entre cards */
  padding: 4px 8px;
  /* Padding para que no peguen a los bordes */
}

.person-card {
  cursor: pointer;
  transition: all 0.3s ease;
  width: 220px;
  /* Ancho fijo */
  flex-shrink: 0;
  /* Evita que se reduzcan */
  border-radius: 8px !important;
  /* Bordes más redondeados */
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05) !important;
  /* Sombra sutil por defecto */
}

.person-card:hover {
  transform: translateY(-3px);
  box-shadow: 0 6px 12px rgba(0, 0, 0, 0.1) !important;
}

.selected-person {
  border: 2px solid #03626c;
  background-color: rgba(3, 98, 108, 0.08) !important;
  /* Color más suave */
}

.current-user {
  border-left: 3px solid #1976d2;
  /* Indicador lateral para el usuario actual */
}

.person-info {
  max-width: calc(220px - 60px);
  /* 220px (card) - 40px (avatar) - 20px (márgenes) */
  overflow: hidden;
}

.text-truncate {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  display: block;
}

/* Mejor contraste para los subtítulos */
.v-card-subtitle {
  color: rgba(0, 0, 0, 0.7) !important;
}
.v-select input {
  color: #7e57c2;
  /* purple text input */
}

/* Estilo base para la tarjeta */
.v-card {
  transition: all 0.2s ease;
  position: relative;
  overflow: hidden;
}

/* Efecto hover más pronunciado */
.v-card:hover {
  transform: translateY(-3px);
  box-shadow: 0 6px 16px rgba(0, 0, 0, 0.1) !important;
}

/* Estilo para el tiempo de la reunión */
.meeting-time {
  min-width: 60px;
  padding-top: 2px; /* Alineación vertical */
}

/* Estilo para la sección de próximas tareas */
.next-meetings {
  background-color: rgba(245, 245, 245, 0.7);
  border-radius: 8px;
  padding: 8px;
  transition: background-color 0.3s ease;
}

.next-meetings:hover {
  background-color: rgba(245, 245, 245, 1);
}

/* Estilo para los avatares de participantes */
.v-avatar {
  transition: transform 0.2s ease;
}

.v-avatar:hover {
  transform: scale(1.1);
  z-index: 2;
}
.date-text {
  width: 100%;
  font-size: 0.75rem; /* Equivalente a text-caption */
  line-height: 1.2; /* Mejor interlineado */
  font-weight: 500; /* Medium weight */
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}
</style>
