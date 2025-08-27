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
        <v-col cols="12" class="d-flex justify-space-between align-center">
      <h2 class="text-body-2 font-weight-bold">{{ $t("viewTitles.tasks") }}</h2>
      <v-btn icon color="deep-purple-accent-4" variant="flat" class="elevation-3" @click="showAdd">
        <v-icon>mdi-plus</v-icon>
      </v-btn>
      </v-col>
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
    <v-row class="no-gutters">
      <v-col cols="12" style="max-height: 60vh; min-height: 40vh; overflow-y: auto">
    <template v-if="filteredTasks.length > 0">
      <!-- Tarjetas de reuniones -->
      <v-card v-for="(meeting, index) in filteredTasks" :key="index" class="mb-4 rounded-lg pa-2" density="comfortable" elevation="2"
        :class="{ 'smooth-hover': true }">
        <v-row class="align-center">
          <!-- Barra lateral de color e info -->
          <v-col cols="1" class="d-flex justify-start">
           <div class="icono-concavo d-flex flex-column justify-center justify-start pa-0"
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
          <v-col cols="6" class="d-flex align-center justify-start pa-0">
              <v-row align="center" class="gap-3">
                <div>
                  <div class="font-weight-bold text-body-2">{{ meeting.title }}</div>
                  <div class="text-caption d-flex align-center text-grey-darken-1">
                    {{ meeting.description }}
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
                        }`" alt="avatar" />
                    </v-avatar>
                  </template>
                  <span>{{ person.name }}<br />{{ person.roleName }}</span>
                </v-tooltip>
              </div>
            </v-row>
          </v-col>
          <v-col cols="1" class="d-flex align-center justify-start pa-0">
            <div>
              <v-icon :color="getTypeColor(meeting.type)"
                style="font-size: 10px; filter: drop-shadow(0 0 2px currentColor)" icon="mdi-circle"
                class="mr-1"></v-icon>
              <span class="text-black">{{ meeting.typeName }}</span>
            </div>
          </v-col>
          <v-col cols="1" class="d-flex align-center justify-start pa-0">
            <div>
              <span class="text-black">{{ meeting.namePriority }}</span>
            </div>
          </v-col>
          <v-col cols="1" class="d-flex align-center justify-start pa-0">
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
                      <v-text-field v-bind="props" :modelValue="this.editedItem.start_date" variant="underlined"
                        :label="$t('taskForm.today')"></v-text-field>
                    </template>
                      <v-date-picker color="#03626C" :modelValue="parseDateString(this.editedItem.start_date)" @update:model-value="updateDate"
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
                        <v-text-field v-bind="props" :model-value="this.editedItem.end_date"
                          :label="$t('taskForm.fields.endDate')" variant="underlined" readonly></v-text-field>
                      </template>
                      <v-date-picker :modelValue="parseDateString(this.editedItem.end_date)" @update:model-value="updateDate1"
                        format="yyyy-MM-dd" color="#03626C"
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

export default {
  components: {
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
      module: "Tarea",
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
      type: "Tarea",
      module: "Tarea",
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
    textoEditable() {
      // Muestra texto confirmado + texto dictado en vivo
      return this.texto + this.textoTemporal;
    },
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
  },
  mounted() {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      this.compatible = false;
      return;
    }
    this.recognition = new SpeechRecognition();
    this.recognition.lang = "es-ES";
    this.recognition.continuous = true;
    this.recognition.interimResults = true;
    this.recognition.onstart = () => {
      this.escuchando = true;
      this.cargando = false;
    };
    this.recognition.onresult = (event) => {
      let interim = "";
      let final = "";
      for (let i = event.resultIndex; i < event.results.length; ++i) {
        const transcript = event.results[i][0].transcript;
        if (event.results[i].isFinal) {
          final += transcript;
        } else {
          interim += transcript;
        }
      }
      if (final) {
        this.texto += (this.texto.endsWith(" ") ? "" : " ") + final + " ";
      }
      this.textoTemporal = interim;
    };
    this.recognition.onerror = (event) => {
      console.error("Error de reconocimiento:", event.error);
      this.escuchando = false;
      this.cargando = false;
    };
    this.recognition.onend = () => {
      this.escuchando = false;
      this.textoTemporal = "";
    };
    this.name = JSON.parse(LocalStorageService.getItem("name"));
    this.user = JSON.parse(LocalStorageService.getItem("user"));
    this.user_id = JSON.parse(LocalStorageService.getItem("user_id"));
    this.home_id = JSON.parse(LocalStorageService.getItem("home_id"));
    this.imageUrl = LocalStorageService.getItem("image").replace(/['"]+/g, "");
    this.messages = [
      {
        text: `Hola 👋 ${this.name}, ¿En qué te puedo ayudar hoy?`,
        from: "ai",
      },
    ];
    this.showStatuses();
    this.tools = [
      {
        name: "Crear tarea",
        action: () =>
          this.messages.push({
            text: "📝 ¿Cuál es la tarea que deseas crear?",
            from: "bot",
          }),
      },
      {
        name: "Agregar recordatorio",
        action: () =>
          this.messages.push({
            text: "⏰ ¿Qué quieres que te recuerde y cuándo?",
            from: "bot",
          }),
      },
      {
        name: "Consultar clima",
        action: () =>
          this.messages.push({
            text: "🌦️ Por favor indícame tu ciudad para consultar el clima.",
            from: "bot",
          }),
      },
      {
        name: "Resumen del día",
        action: () =>
          this.messages.push({
            text: "📋 Hoy tienes 3 tareas pendientes y 1 recordatorio programado.",
            from: "bot",
          }),
      },
    ];
  },
  methods: {
    closeAllDialogs(sourceComponent) {
      console.log(`Cerrando todo desde: ${sourceComponent}`);
      if (sourceComponent === "ChatTarea") {
        this.$router.push("/task");
      }
      if (sourceComponent === "ChatMeta") {
        this.$router.push("/goals");
      }
      this.dialogChatTask = false;
      this.dialogChatFinance = false;
      this.dialogChatBudget = false;
      this.dialogChatWarehouse = false;
      this.dialogChatProduct = false;
      this.dialogChatDesire = false;
      this.texto = "";
      this.textoTemporal = "";
      this.currentTask = null;
      this.currentFinance = null;
      this.currentBudget = null;
      this.currentWarehouse = null;
      this.currentProduct = null;
      this.currentDesire = null;
    },
    closeDialgChat() {
      this.dialogChatTask = false;
      this.dialogChatFinance = false;
      this.dialogChatBudget = false;
      this.dialogChatWarehouse = false;
      this.dialogChatProduct = false;
      this.dialogChatDesire = false;
      this.texto = "";
      this.textoTemporal = "";
      this.currentTask = null;
      this.currentFinance = null;
      this.currentBudget = null;
      this.currentWarehouse = null;
      this.currentProduct = null;
      this.currentDesire = null;
      this.initialize();
    },
    formatIntuitiveDate(dateString) {
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
          year: "numeric", // <-- Añadido: muestra el año
        })
        .replace(/\./g, "");
      }
    },
    formatTime(timeString) {
      if (!timeString) return "";
      const [hours, minutes] = timeString.split(":");
      return `${hours}:${minutes}`;
    },
    toggleDictado() {
      if (!this.recognition) return;
      if (this.escuchando) {
        this.recognition.stop();
      } else {
        this.cargando = true;
        this.recognition.start();
      }
    },
    async sendMessage() {
      if (this.texto.trim() === "") return;
      // Guardar el texto temporal
      this.textoTemporal = this.texto;
      console.log("Texto temporal:", this.textoTemporal);
      // Abrir el diálogo con el chat
      const tempMessage = this.texto.trim();
      this.texto = "";
      // Agregar mensaje del usuario al chat
      this.messages.push({
        from: "user",
        text: tempMessage,
        timestamp: new Date().toLocaleTimeString(),
      });
      //this.dialogChatTask = true;
      this.isTyping = true;
      try {
        // Llamar a la IA
        const response = await handleRequest({
          endpoint: "ask-ai-task",
          method: "POST",
          data: {
            question: tempMessage,
            issue:
              "Eres un asistente para gestión del hogar: tareas, metas, finanzas, salud, compras y presupuestos.",
            home_id: this.home_id,
          },
        });
        this.isTyping = false;
        const {
          intentDetected,
          intent,
          task,
          answer,
          finances,
          budget,
          warehouse,
          product,
          desire,
        } = response.data;
        if (intentDetected && intent) {
          // Preparar datos comunes
          this.data = { home_id: this.home_id };
          // Si hay datos de tarea, guardarlos
          /*if (task) {
        this.taskParameters = {
          ...this.taskParameters,
          ...task,
        };
      }*/
          // Cargar datos requeridos si es necesario
          //await this.loadRequiredData();
          // Determinar qué chat mostrar según la intención
          switch (intent) {
            case "Tarea":
              this.currentTask = null;
              this.$nextTick(() => {
                const taskData =
                  typeof response.data.task === "string"
                    ? JSON.parse(response.data.task)
                    : response.data.task;
                this.currentTask = _.cloneDeep(taskData);
                this.dialogChatTask = true;
                this.scrollToBottom();
              });
              break;
            case "Meta":
              this.currentTask = null;
              this.$nextTick(() => {
                const taskData =
                  typeof response.data.task === "string"
                    ? JSON.parse(response.data.task)
                    : response.data.task;
                this.currentTask = _.cloneDeep(taskData);
                this.dialogChatTask = true;
                this.scrollToBottom();
              });
              break;
            case "Gasto":
              this.currentFinance = null;
              this.$nextTick(() => {
                const financeData =
                  typeof finances === "string" ? JSON.parse(finances) : finances;
                if (financeData.spent <= 0) {
                  this.messages.push({
                    from: "ai",
                    text:
                      /*answer ||*/
                      "Detecte que desea registrar un gasto pero no especificaste el monto, podrías ser mas especifico",
                    timestamp: new Date().toLocaleTimeString(),
                  });
                } else {
                  this.currentFinance = _.cloneDeep(financeData);
                  this.currentIntentFinance = response.data.intent;
                  this.dialogChatFinance = true;
                  this.scrollToBottom();
                }
              });
              break;
            case "Ingreso":
              this.currentFinance = null;
              this.$nextTick(() => {
                const financeData =
                  typeof finances === "string" ? JSON.parse(finances) : finances;
                if (financeData.income <= 0) {
                  this.messages.push({
                    from: "ai",
                    text:
                      /*answer ||*/
                      "Detecte que desea registrar un ingreso pero no especificaste el monto, podrías ser mas especifico",
                    timestamp: new Date().toLocaleTimeString(),
                  });
                } else {
                  this.currentFinance = _.cloneDeep(financeData);
                  this.currentIntentFinance = response.data.intent;
                  this.dialogChatFinance = true;
                  this.scrollToBottom();
                }
              });
              break;
            case "Presupuesto":
              this.currentBudget = null;
              this.$nextTick(() => {
                const budgetData =
                  typeof budget === "string" ? JSON.parse(budget) : budget;
                if (budgetData.amount <= 0) {
                  this.messages.push({
                    from: "ai",
                    text:
                      /*answer ||*/
                      "Detecte que desea registrar un presupuesto pero no especificaste el monto, podrías ser mas especifico",
                    timestamp: new Date().toLocaleTimeString(),
                  });
                } else {
                  this.currentBudget = _.cloneDeep(budgetData);
                  this.dialogChatBudget = true;
                  this.scrollToBottom();
                }
              });
              break;
            case "Warehouse":
              this.currentWarehouse = null;
              this.$nextTick(() => {
                const warehouseData =
                  typeof warehouse === "string" ? JSON.parse(warehouse) : warehouse;
                this.currentWarehouse = _.cloneDeep(warehouseData);
                this.dialogChatWarehouse = true;
                this.scrollToBottom();
              });
              break;
            case "Producto":
              this.currentProduct = null;
              this.$nextTick(() => {
                const productData =
                  typeof product === "string" ? JSON.parse(product) : product;
                if (
                  isNaN(productData.quantity) ||
                  isNaN(productData.unit_price) ||
                  productData.quantity <= 0 ||
                  productData.unit_price <= 0
                ) {
                  this.messages.push({
                    from: "ai",
                    text:
                      "⚠️ Parece que aún no has especificado bien la **cantidad** o el **precio unitario** del producto. Ambos deben ser valores numéricos mayores a cero. ¿Podrías revisarlo y corregirlo, por favor?",
                    timestamp: new Date().toLocaleTimeString(),
                  });
                  return; // Detener el flujo hasta que se corrijan
                } else {
                  this.currentProduct = _.cloneDeep(productData);
                  this.dialogChatProduct = true;
                  this.scrollToBottom();
                }
              });
              break;
            case "Deseo":
              this.currentDesire = null;
              this.$nextTick(() => {
                const desireData =
                  typeof desire === "string" ? JSON.parse(desire) : desire;
                this.currentDesire = _.cloneDeep(desireData);
                this.dialogChatDesire = true;
                this.scrollToBottom();
              });
              break;
            case "salud":
              this.currentHealthData = _.cloneDeep(task || {});
              this.dialogChatHealth = true;
              this.scrollToBottom();
              break;
            case "compra":
              this.currentShoppingData = _.cloneDeep(task || {});
              this.dialogChatShopping = true;
              this.scrollToBottom();
              break;
            default:
              // Respuesta por defecto si no se reconoce la intención
              this.messages.push({
                from: "ai",
                text:
                  answer ||
                  "No entendí muy bien tu solicitud. ¿Podrías ser más específico?",
                timestamp: new Date().toLocaleTimeString(),
              });
          }
        } else {
          this.isTyping = false;
          // No se detectó intención, solo mostrar respuesta normal
          this.messages.push({
            from: "ai",
            text: answer || "No tengo claro qué necesitas. ¿Puedes ser más específico?",
            timestamp: new Date().toLocaleTimeString(),
          });
        }
      } catch (error) {
        this.isTyping = false;
        console.error("Error al procesar el mensaje:", error);
        this.messages.push({
          from: "ai",
          text: "Ocurrió un error al procesar tu solicitud. Inténtalo nuevamente.",
          timestamp: new Date().toLocaleTimeString(),
        });
      }
    },
    scrollToBottom() {
      this.messages = [
        {
          text: `Hola 👋 ${
            this.name ? this.name + ", " : ""
          }¿En qué te puedo ayudar hoy?`,
          from: "ai",
          timestamp: new Date().toLocaleTimeString(),
        },
      ];
      // Limpiar cualquier otro estado relacionado con el chat
      this.texto = "";
      this.textoTemporal = "";
      this.$nextTick(() => {
        const chatContainer = this.$refs.chatBody;
        if (chatContainer) {
          chatContainer.scrollTop = chatContainer.scrollHeight;
        }
      });
    },
    close() {
      this.step = 0;
      this.dialog = false;
      this.$nextTick(() => {
        this.editedItem = Object.assign({}, this.defaultItem);
        this.originalItem = Object.assign({}, this.defaultItem);
      });
      this.editedIndex = -1;
    },
    async save() {
      console.log("Guardando tarea...:", this.editedItem);
      this.loading = true;
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
      this.close();
    },
    getDynamicValue(toPath) {
      console.log("path");
      console.log(toPath);
      // Aquí implementa tu lógica para obtener el valor dinámico
      // basado en el 'to' de la tarjeta
      // Ejemplo simple:
      if (toPath === "/task") return this.taskCount;
      if (toPath === "/goals") return this.goalCount;
      if (toPath === "/finance") return this.financeCount;
      //if (toPath === '/saludMenu') return '12'
      if (toPath === "/desire") return this.whishCount;
      if (toPath === "/personwarehouse") return this.personWarehousesCount;
      if (toPath === "/homes") return this.homeCount;
      if (toPath === "/file") return this.fileCount;
      if (toPath === "/product") return this.productCount;
      if (toPath === "/suggestions") return this.suggestionCount;
      // Añade más casos según tus necesidades
      return "0";
      // O puedes llamar a una API o consultar Vuex/store
      // return this.$store.getters.getValueByPath(toPath)
    },
    toggleExpanded(key) {
      this.expandedStates[key] = !this.expandedStates[key];
    },
    toggleStatus(index) {
      const task = this.tasks[index];
      task.status = task.status === "pendiente" ? "hecha" : "pendiente";
    },
    selectCategory(category) {
      if (this.selectedCategory === category.name) {
        // Si ya está seleccionada, la deseleccionamos
        this.selectedCategory = null;
      } else {
        // Seleccionamos la nueva categoría
        this.selectedCategory = category.name;
        // Aquí puedes cargar los datos específicos para esta categoría
        this.loadCategoryContent(category.name);
      }
    },
    /*getStatusColor(status) {
    const colorMap = {
      'pending': 'orange', // Más vivo que orange-lighten-3
      'in-progress': 'blue', // Más vivo que blue-lighten-3
      'completed': 'green', // Más vivo que green-lighten-3
      'cancelled': 'red' // Más vivo que red-lighten-1
    };
    return colorMap[status] || 'grey';
    },
    getStatusIcon(status) {
      const iconMap = {
        'pending': 'mdi-clock-outline',
        'in-progress': 'mdi-progress-wrench',
        'completed': 'mdi-check-bold',
        'cancelled': 'mdi-close-circle-outline'
      };
      return iconMap[status] || 'mdi-help-circle';
    },
  getStatusText(status) {
    const textMap = {
      'pending': 'Pendiente',
      'in-progress': 'En progreso',
      'completed': 'Completado',
      'cancelled': 'Cancelado'
    };
    return textMap[status] || 'Desconocido';
  },
  isCurrentStatus(task, statusValue) {
    return task.status === statusValue;
  },*/
    getTypeColor(type) {
      const colorMap = {
        // Tipos principales
        Tarea: "warning",
        Meta: "purple",
        Logros: "primary",
        Deseos: "secondary",
        // Segunda fila
        Finanzas: "success",
        Salud: "pink",
        Nutrición: "deep-orange",
        Mascotas: "blue-grey",
        // Tercera fila
        Hogar: "brown",
        Almacenes: "error",
        Archivos: "indigo",
        Sugerencias: "amber",
      };
      return colorMap[type] || "grey-lighten-1"; // Color por defecto
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
    /*changeTaskStatus(task, newStatus) {
      task.status = newStatus;
      task.statusDialog = false;
    },*/
    async showStatuses() {
      this.data = {};
      this.data.type = "Task";
      this.data.home_id = this.home_id;
      try {
        const result = await handleRequest({
          endpoint: "status-by-type",
          method: "POST",
          data: this.data,
        });
        if (result.success) {
          // Si la solicitud es exitosa, asignamos las sucursales
          this.status = result.data?.status || [];
          this.taskCount = result.data?.task || 0;
          this.goalCount = result.data?.goals || 0;
          this.whishCount = result.data?.whish || 0;
          this.financeCount = result.data?.finance || 0;
          this.personWarehousesCount = result.data?.personWarehouses || 0;
          this.homeCount = result.data?.home || 0;
          this.fileCount = result.data?.file || 0;
          this.suggestionCount = result.data.suggestion || 0;
          this.productCount = result.data?.product || 0;
        } else {
          // Si no hay datos, asignamos un array vacío
          this.status = [];
        }
      } catch (error) {
        // Captura de errores no controlados
        this.showAlert(
          "error",
          "Ocurrió un error inesperado al procesar la solicitud.",
          3000
        );
      } finally {
        this.initialize();
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
          // Filtrar tareas que coincidan con el día actual
          this.tasks = (result.data?.tasks || []).filter((task) => task.type === "Tarea");
          this.loading_task=false;
          
        } else {
          // Si no hay datos, asignamos un array vacío
          this.tasks = [];
             this.loading_task=false;
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
    //tarea
    nextStep() {
      if (this.step < this.steps.length - 1) {
        this.step++;
      } else {
        this.dialog = false;
        this.step = 0;
        this.save();
      }
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
    filteredPeople(roleId) {
      return this.people.filter((person) => {
        const assignedPerson = this.editedItem.people.find((p) => p.id === person.id);
        return !assignedPerson || assignedPerson.roleId === roleId;
      });
    },
    isPersonSelected(personId, roleId) {
      console.log("isPersonSelected", personId, roleId);
      return this.editedItem.people.some((p) => p.id === personId && p.roleId === roleId);
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
  },
};
</script>
<style scoped>
.icono-concavo {
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 8px;
 
  color: white;
  /* Mantenemos solo el efecto cóncavo en el ícono 
  box-shadow: inset;*/
  position: relative;
  overflow: hidden;
}
.icono-concavo-card-task {
  width: 60px;
  height: 60px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 8px;
 
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
.v-icon {
  font-size: 28px;
}
.status-option {
  transition: background-color 0.3s ease;
}
.status-option:hover {
  background-color: rgba(0, 0, 0, 0.05) !important;
}
.current-status {
  border-left: 4px solid;
  border-left-color: inherit;
}
.v-card-title {
  font-weight: 600;
}
.menu-card {
  cursor: pointer;
  transition: all 0.3s ease;
  border-radius: 10px;
  height: 100%;
}
.menu-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}
.v-card-title {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
/* Estilo para el menú desplegable */
.v-menu__content {
  border-radius: 8px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
}
.title-container {
  position: relative;
  display: flex;
  align-items: center;
  gap: 8px; /* Espacio entre título y círculo */
}
.dynamic-circle {
  width: 24px;
  height: 24px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 12px;
  font-weight: bold;
  color: white;
  background-color: #03626c; /* Color por defecto */
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
  flex-shrink: 0; /* Evita que se reduzca el tamaño */
}
.dynamic-circle.primary {
  background-color: #03626c; /* Color primario */
}
.chat-wrapper {
  max-width: 700px;
  height: 85vh;
  display: flex;
  flex-direction: column;
}
.chat-body {
  flex: 1;
  overflow-y: auto;
  max-height: 65vh;
  scrollbar-width: thin;
  scrollbar-color: #ddd transparent;
}
.chat-body::-webkit-scrollbar {
  width: 6px;
}
.chat-body::-webkit-scrollbar-thumb {
  background-color: #ccc;
  border-radius: 8px;
}
.chat-bubble {
  max-width: 100%;
  word-break: break-word;
  font-size: 15px;
  line-height: 1.4;
}
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
.tools-bar {
  overflow-x: auto;
  white-space: nowrap;
  gap: 8px;
}
</style>
