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
            <!-- Encabezado con foto y datos -->
            <v-card-text>
                <v-row dense>
                    <!-- Foto del usuario -->
                    <!-- Foto y datos de la mascota (clickeable para cambiar) -->
                    <v-col cols="12" md="6">
                        <!-- Selector de mascota (activador del menú) -->
                        <div class="d-flex align-center cursor-pointer pet-selector"
                            style="padding: 8px; border-radius: 12px; transition: background-color 0.2s"
                            @click="menuPet = !menuPet">
                            <!-- Foto del paciente -->
                            <div style="position: relative; display: inline-block;">
                                <v-avatar size="60" class="me-4">
                                    <v-img
                                        :src="`${$axios.defaults.baseURL}images/${selectedPet.image}?t=${getCacheTimestamp()}`"
                                        alt="Foto de la mascota" />
                                </v-avatar>
                                <!-- Botón de edición superpuesto -->
                                <v-btn v-if="selectedPet !== null"
                                    icon 
                                    variant="text" 
                                    size="small" 
                                    color="blue-grey" 
                                    @click.stop="editItem(selectedPet)" 
                                    style="position: absolute; bottom: 0; right: 12px;"
                                >
                                    <v-icon color="primary" size="20">mdi-pencil</v-icon>
                                </v-btn>
                            </div>

                            <!-- Datos del paciente -->
                            <div>
                                <div class="text-body-2 font-weight-bold mb-1">
                                    {{ selectedPet.name }}
                                </div>
                                <div class="text-body-2 text-grey-darken-1">
                                    {{ selectedPet.breed ? $t("petDetails.breed.withValue", { breed: selectedPet.breed
                                    }) : "" }}
                                </div>
                            </div>

                            <!-- Icono de despliegue -->
                            <v-icon v-if="selectedPet !== null" :class="{ 'rotate': menuPet }" class="ms-2 transition-fast-in-fast-out" size="20"
                                color="grey">
                                mdi-menu-down
                            </v-icon>
                        </div>

                        <!-- Menú desplegable con TARJETAS (no lista) -->
                        <v-menu v-model="menuPet" :close-on-content-click="false" location="bottom start" offset-y
                            :min-width="null" :max-width="null" class="rounded-lg">
                            <template #activator="{ props }">
                                <div v-bind="props"></div>
                            </template>
                            <v-card max-width="900px" class="mx-auto rounded-lg">
                                <v-card-text>
                                    <v-container fluid>
                                        <v-row justify="center">
                                            <v-col v-for="pet in pets" :key="pet.id" cols="auto" min-width="200px">
                                                <v-card class="text-center store-card" elevation="3" rounded="lg"
                                                    @click="selectPet(pet)"
                                                    :class="selectedPet?.id === pet.id ? 'bg-blue-lighten-5' : ''">
                                                    <div class="icon-wrapper rounded-lg mb-3">
                                                        <v-img :src="`${$axios.defaults.baseURL}images/${
                      pet.image
                    }?t=${getCacheTimestamp()}`" alt="Foto de Mascota" width="100%" height="130"  cover
    class="rounded-lg" />
                                                    </div>
                                                    <div class="store-name">{{ pet.name }}</div>
                                                    <div class="store-products">{{ pet.breed }}</div>
                                                    <v-icon v-if="selectedPet?.id === pet.id" color="primary" size="18"
                                                        class="position-absolute" style="top: 8px; right: 8px;">
                                                        mdi-check-circle
                                                    </v-icon>
                                                </v-card>
                                            </v-col>
                                        </v-row>
                                    </v-container>
                                </v-card-text>
                            </v-card>

                        </v-menu>
                    </v-col>

                    <!-- Espaciado para centrar visualmente -->
                    <v-col cols="12" md="3"></v-col>

                    <v-col cols="12" sm="6" md="3">
                        <v-card class="pa-2 d-flex align-center signo-card" elevation="1" rounded="lg"
                            @click="dialogAlerta = true" style="cursor: pointer">
                            <!-- Ícono -->
                            <v-avatar size="40" class="me-3" color="purple-lighten-4" variant="tonal">
                                <v-icon color="warning">mdi-lightbulb-on-outline</v-icon>
                            </v-avatar>

                            <!-- Texto -->
                            <div>
                                <div class="text-body-2 font-weight-medium">
                                    {{ $t("pets.alerts.title") }}
                                </div>
                                <div class="text-caption text-grey-darken-1">
                                    {{ $t("pets.alerts.count", { count: alertasHoy }) }}
                                </div>
                            </div>
                        </v-card>
                    </v-col>
                    <!-- Botón flotante de añadir (posición fija) -->
                    <v-btn icon size="large" color="deep-purple-accent-4" class="ma-4" elevation="6"
                        style="position: fixed; top: 40px; right: 260px" @click="showAdd">
                        <v-icon size="32">mdi-plus</v-icon>
                    </v-btn>
                </v-row>
                <!-- Fila completa para herramientas -->
                <v-row no-gutters class="mt-2">
                    <v-col cols="12">
                        <div class="d-flex flex-wrap gap-1">
                            <v-btn v-for="tool in tools" :key="tool.name" @click="tool.action" size="small"
                                color="primary" variant="text" prepend-icon="mdi-plus" class="text-capitalize">
                                {{ tool.name }}
                            </v-btn>
                        </div>
                    </v-col>
                </v-row>
                <v-divider class="my-4" />
                <v-row class="pa-0 ma-0">
                    <v-col v-for="(tool, index) in petTools" :key="index" cols="12" sm="6" md="6" lg="3" class="px-1">
                        <v-card class="d-flex align-center pa-2" elevation="2" rounded="lg" density="comfortable"
                            @click="tool.action()" style="cursor: pointer; height: 70px; width: 100%">
                            <v-avatar size="40" class="me-3" :color="colors[index] + ' lighten-4'" variant="tonal">
                                <v-icon :color="colors[index]">{{ tool.icon }}</v-icon>
                            </v-avatar>

                            <div style="min-width: 0; flex: 1">
                                <div class="text-body-2 font-weight-medium text-truncate">
                                    {{ tool.name }}
                                </div>

                                <template v-if="tool.count > 0">
                                    <!-- Caso 1: Solo 1 registro -->
                                    <template v-if="tool.count === 1">
                                        <v-tooltip location="bottom" v-if="tool.lastItemName">
                                            <template v-slot:activator="{ props }">
                                                <div v-bind="props"
                                                    class="text-caption text-grey-darken-1 text-truncate">
                                                    {{ tool.lastItemName }}
                                                </div>
                                            </template>
                                            <span>{{ tool.lastItemName }}</span>
                                        </v-tooltip>
                                        <div v-else class="text-caption text-grey-darken-1">
                                            {{ $t("common.no_name") }}
                                        </div>

                                        <div class="text-caption text-grey-lighten-1 mt-1">
                                            {{ formatIntuitiveDate(tool.lastDate) }}
                                        </div>
                                    </template>

                                    <!-- Caso 2: Más de 1 registro -->
                                    <template v-else>
                                        <div class="text-caption text-grey-lighten-1">
                                            <div class="font-weight-medium">
                                                {{ tool.count }} {{ $t("common.items") }}
                                            </div>
                                            <div class="mt-1">
                                                {{ formatIntuitiveDate(tool.lastDate) }}
                                            </div>
                                        </div>
                                    </template>
                                </template>
                                <template v-else>
                                    <div class="text-caption text-grey-darken-1">
                                        {{ $t("common.no_records") }}
                                    </div>
                                </template>
                            </div>
                        </v-card>
                    </v-col>
                </v-row>
                <v-divider class="my-4" />
                <!--<v-row justify="space-between" align="center" class="mb-6">
          <v-col
            cols="12"
            class="ma-0 pt-6"
            style="max-height: 60vh; min-height: 40vh; overflow-y: auto"
          >
              <template v-if="pets.length > 0">
                <v-card
                  v-for="(pet, index) in pets"
                  :key="index"
                  class="mb-4 rounded-lg pa-2"
                  :class="{ 'selected-pet-card': isSelected(pet) }"
                  density="comfortable"
                  elevation="2"
                  @click="selectPet(pet)"
                >
                  <v-row>
                    <v-col cols="1" class="d-flex justify-start">
                      <v-dialog max-width="500" class="rounded-lg">
                        <template v-slot:activator="{ props: activatorProps }">
                          <div
                            v-bind="activatorProps"
                            class="icono-concavo d-flex flex-column justify-center justify-start"
                          >
                            <v-img
                              :src="`${this.$axios.defaults.baseURL}images/${
                                pet.image
                              }?t=${getCacheTimestamp()}`"
                              cover
                              class="img-concava"
                            />
                          </div>
                        </template>

                        <template v-slot:default="{ isActive }">
                          <v-card class="modal-imagen">
                            <v-img
                              :src="`${this.$axios.defaults.baseURL}images/${pet.image}`"
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
                    <v-col cols="3" class="d-flex align-center justify-start">
                      <v-row align="center" class="gap-3">
                        <div>
                          <div class="font-weight-bold text-body-2">
                            {{ pet.name }}
                          </div>
                          <div
                            class="text-body-2 d-flex align-center text-grey-darken-1 text-truncate"
                          >
                            {{ pet.breed }}
                            <v-tooltip
                              activator="parent"
                              location="bottom"
                              max-width="350px"
                            >
                              <span style="white-space: normal; word-break: break-word">
                                {{ $t("pets.fields.breed") }}: {{ pet.breed }}
                              </span>
                            </v-tooltip>
                          </div>
                          <div
                            class="text-body-2 d-flex align-center text-grey-darken-1 text-truncate"
                          >
                            {{ pet.microship }}
                            <v-tooltip
                              activator="parent"
                              location="bottom"
                              max-width="350px"
                            >
                              <span style="white-space: normal; word-break: break-word">
                                {{ $t("pets.fields.microchip") }}: {{ pet.microship }}
                              </span>
                            </v-tooltip>
                          </div>
                        </div>
                      </v-row>
                    </v-col>
                    <v-col cols="1" class="d-flex align-center justify-start">
                      <div>
                        <span class="text-body-2"> {{ pet.categoryName }}</span>
                        <v-tooltip activator="parent" location="bottom" max-width="350px">
                          <span style="white-space: normal; word-break: break-word">
                            {{ $t("pets.fields.category") }}: {{ pet.categoryName }}
                          </span>
                        </v-tooltip>
                      </div>
                    </v-col>
                    <v-col cols="1" class="d-flex align-center justify-start">
                      <div>
                        <span class="text-body-2"> {{ pet.color }}</span>
                        <v-tooltip activator="parent" location="bottom" max-width="350px">
                          <span style="white-space: normal; word-break: break-word">
                            {{ $t("pets.fields.color") }}: {{ pet.color }}
                          </span>
                        </v-tooltip>
                      </div>
                    </v-col>
                    <v-col cols="2" class="d-flex align-center justify-start">
                      <div>
                        <span class="text-body-2">
                          {{ $vuetify.date.format(pet.date_birth, "fullDate") }}
                        </span>
                        <v-tooltip activator="parent" location="bottom" max-width="350px">
                          <span style="white-space: normal; word-break: break-word">
                            {{ $t("pets.fields.date_birth") }}:
                            {{ $vuetify.date.format(pet.date_birth, "fullDate") }}
                          </span>
                        </v-tooltip>
                      </div>
                    </v-col>
                    <v-col cols="3" class="d-flex align-center justify-start">
                      <div>
                        <span class="text-body-2"> {{ pet.signs }}</span>
                        <v-tooltip activator="parent" location="bottom" max-width="350px">
                          <span style="white-space: normal; word-break: break-word">
                            {{ $t("pets.fields.signs") }}: {{ pet.signs }}
                          </span>
                        </v-tooltip>
                      </div>
                    </v-col>
                    <v-col
                      cols="1"
                      class="d-flex align-center ml-auto pe-4"
                      style="margin-left: auto !important"
                    >
                      <v-btn
                        icon
                        variant="text"
                        color="green-darken-2"
                        size="small"
                        @click="editItem(pet)"
                      >
                        <v-icon>mdi-pencil</v-icon>
                      </v-btn>
                      <v-btn
                        icon
                        variant="text"
                        color="red-darken-2"
                        size="small"
                        @click="deleteItem(pet)"
                      >
                        <v-icon>mdi-delete</v-icon>
                      </v-btn>
                    </v-col>
                  </v-row>
                </v-card>
              </template>
              <template v-else>
                <v-col cols="12" class="text-center py-8">
                  {{ $t("pets.empty") }}
                </v-col>
              </template>
          </v-col>
        </v-row>-->
                <SuggestionsList :items="suggestions" :title="$t('finances.sections.suggestions')" icon="mdi-finance">
                    <template #detail="{ taskData, onClose }">
                        <ChatTask :taskData="taskData" @close-dialog="onClose" />
                    </template>
                </SuggestionsList>
            </v-card-text>
        </v-card>
    </v-container>

    <v-dialog v-model="dialog" fullscreen persistent transition="dialog-bottom-transition"
        content-class="fullscreen-dialog">
        <v-form ref="form" v-model="valid" class="h-100">
            <v-card class="pa-10">
                <v-card-text class="pt-12">
                    <h5 class="text-grey-darken-2 font-weight-medium">
                        {{ editedIndex === -1 ? $t("pets.actions.create") : $t("pets.actions.edit") }}
                    </h5>
                    <p class="text-grey-lighten-1">
                        {{ $t("pets.instructions") }}
                    </p>

                    <v-row class="mt-12">
                        <!-- Side steps -->
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
                                            <strong>{{ $t(`pets.steps.${s.title}.title`) }}</strong>
                                            <div class="text-caption text-grey">
                                                {{ $t(`pets.steps.${s.title}.subtitle`) }}
                                            </div>
                                        </div>
                                    </template>
                                </v-timeline-item>
                            </v-timeline>
                        </v-col>

                        <!-- Contenido dinámico según paso -->
                        <v-col cols="9">
                            <h3 class="text-deep-purple-accent-3 mb-8">
                                {{ $t(`pets.steps.${steps[step].title}.title`) }}
                            </h3>

                            <!-- Paso 1: Información básica -->
                            <v-row dense v-if="step === 0">
                                <v-col cols="12" md="6">
                                    <v-text-field v-model="editedItem.name" :label="$t('pets.fields.name')"
                                        variant="underlined" :rules="nameRules" />
                                </v-col>

                                <v-col cols="12" md="6">
                                    <v-autocomplete v-model="editedItem.category_id" :items="categories"
                                        :label="$t('pets.fields.category')" item-title="nameCategory" item-value="id"
                                        variant="underlined" :rules="selectRules">
                                        <template v-slot:item="{ props, item }">
                                            <v-list-item v-bind="props">
                                                <template v-slot:prepend>
                                                    <v-avatar size="24">
                                                        <!-- Verifica si es URL o ícono -->
                                                        <template v-if="isImage(item.raw.iconCategory)">
                                                            <img :src="`${this.$axios.defaults.baseURL}images/${item.raw.iconCategory}`"
                                                                alt="icon" />
                                                        </template>
                                                        <template v-else>
                                                            <v-icon>{{ getIconName(item.raw.iconCategory) }}</v-icon>
                                                        </template>
                                                    </v-avatar>
                                                </template>
                                                <v-list-item-subtitle class="d-flex flex-column">
                                                    <div>Descripción: {{ item.raw.descriptionCategory }}</div>
                                                </v-list-item-subtitle>
                                            </v-list-item>
                                        </template>
                                    </v-autocomplete>
                                </v-col>

                                <v-col cols="12" sm="6">
                                    <v-text-field v-model="editedItem.breed" :label="$t('pets.fields.breed')"
                                        variant="underlined" />
                                </v-col>

                                <v-col cols="12" sm="6">
                                    <v-select v-model="editedItem.sex" :label="$t('pets.fields.sex')" :items="[
                      { title: $t('pets.gender.male'), value: 'Male' },
                      { title: $t('pets.gender.female'), value: 'Female' },
                      { title: $t('pets.gender.other'), value: 'Other' },
                    ]" variant="underlined" :rules="selectRules" />
                                </v-col>

                                <v-col cols="12" sm="6">
                                    <v-text-field v-model="editedItem.age" :label="$t('pets.fields.age')"
                                        variant="underlined" type="number" min="0" />
                                </v-col>

                                <v-col cols="12" sm="6">
                                    <v-locale-provider>
                                        <v-menu v-model="menu" :close-on-content-click="false" :nudge-right="40"
                                            transition="scale-transition" offset-y min-width="290px">
                                            <template v-slot:activator="{ props }">
                                                <v-text-field v-bind="props" :modelValue="this.editedItem.date_birth"
                                                    variant="underlined"
                                                    :label="$t('pets.fields.date_birth')"></v-text-field>
                                            </template>
                                            <v-date-picker color="#03626C"
                                                :modelValue="parseDateString(this.editedItem.date_birth)"
                                                @update:model-value="updateDate" format="yyyy-MM-dd"></v-date-picker>
                                        </v-menu>
                                    </v-locale-provider>
                                </v-col>
                            </v-row>

                            <!-- Paso 2: Características físicas -->
                            <v-row dense v-if="step === 1">
                                <v-col cols="12" sm="6">
                                    <v-text-field v-model="editedItem.color" :label="$t('pets.fields.color')"
                                        variant="underlined" />
                                </v-col>

                                <v-col cols="12" sm="6">
                                    <v-text-field v-model="editedItem.microchip" :label="$t('pets.fields.microchip')"
                                        variant="underlined" />
                                </v-col>

                                <v-col cols="12">
                                    <v-textarea v-model="editedItem.signs" :label="$t('pets.fields.signs')"
                                        variant="underlined" rows="2" auto-grow />
                                </v-col>

                                <v-col cols="12" md="6">
                                    <v-file-input v-model="file" ref="fileInput" :label="$t('pets.fields.image')"
                                        variant="underlined" density="compact" name="file" accept=".png, .jpg, .jpeg"
                                        @change="onFileSelected" prepend-icon=""></v-file-input>
                                </v-col>
                                <v-col cols="12" md="6">
                                    <v-card elevation="6" class="mx-auto" max-width="210" max-height="120">
                                        <img v-if="imagenDisponible()" :src="imgedit" height="120" width="210" />
                                    </v-card>
                                </v-col>
                            </v-row>

                            <!-- Paso 3: Información de salud -->
                            <v-row dense v-if="step === 2"> </v-row>

                            <!-- Navegación -->
                            <div class="d-flex justify-space-between mt-8">
                                <v-btn variant="text" class="text-grey-darken-1" @click="step > 0 ? step-- : close()">
                                    {{ step === 0 ? $t("buttons.close") : $t("buttons.previous") }}
                                </v-btn>

                                <v-btn variant="text" class="text-deep-purple-accent-3" @click="nextStep"
                                    :disabled="!valid">
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
    <v-dialog v-model="dialogVaccination" fullscreen transition="dialog-bottom-transition">
        <v-card>
            <v-card-text>
                <!-- Aquí pasamos el 'selectedWorker' al componente dentro del diálogo -->
                <Vaccination :pet="selectedPet" />
            </v-card-text>
            <v-divider></v-divider>
            <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn text @click="closeDialogVaccination">Cerrar</v-btn>
            </v-card-actions>
        </v-card>
    </v-dialog>
    <v-dialog v-model="dialogMedication" fullscreen transition="dialog-bottom-transition">
        <v-card>
            <v-card-text>
                <!-- Aquí pasamos el 'selectedWorker' al componente dentro del diálogo -->
                <CurrentMedication :pet="selectedPet" />
            </v-card-text>
            <v-divider></v-divider>
            <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn text @click="closeDialogMedication">Cerrar</v-btn>
            </v-card-actions>
        </v-card>
    </v-dialog>
    <v-dialog v-model="dialogDeworming" fullscreen transition="dialog-bottom-transition">
        <v-card>
            <v-card-text>
                <!-- Aquí pasamos el 'selectedWorker' al componente dentro del diálogo -->
                <Deworming :pet="selectedPet" />
            </v-card-text>
            <v-divider></v-divider>
            <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn text @click="closeDialogDeworming">Cerrar</v-btn>
            </v-card-actions>
        </v-card>
    </v-dialog>
    <v-dialog v-model="dialogVetVisit" fullscreen transition="dialog-bottom-transition">
        <v-card>
            <v-card-text>
                <!-- Aquí pasamos el 'selectedWorker' al componente dentro del diálogo -->
                <VetVisit :pet="selectedPet" />
            </v-card-text>
            <v-divider></v-divider>
            <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn text @click="closeDialogVetVisit">Cerrar</v-btn>
            </v-card-actions>
        </v-card>
    </v-dialog>
    <v-dialog v-model="dialogDiet" fullscreen transition="dialog-bottom-transition">
        <v-card>
            <v-card-text>
                <!-- Aquí pasamos el 'selectedWorker' al componente dentro del diálogo -->
                <PetDiet :pet="selectedPet" />
            </v-card-text>
            <v-divider></v-divider>
            <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn text @click="closeDialogDiet">Cerrar</v-btn>
            </v-card-actions>
        </v-card>
    </v-dialog>
    <v-dialog v-model="dialogPet">
        <v-card max-width="900px" class="mx-auto">
            <v-card-title class="text-body-2"> Seleccionar Mascota </v-card-title>
            <v-card-text>
                <v-container fluid>
                    <v-row justify="center">
                        <v-col v-for="pet in pets" :key="pet.id" cols="auto" min-width="200px">
                            <v-card class="text-center store-card" elevation="3" rounded="lg" @click="selectPet(pet)">
                                <div class="icon-wrapper mb-3">
                                    <v-img :src="`${$axios.defaults.baseURL}images/${
                      pet.image
                    }?t=${getCacheTimestamp()}`" alt="Foto de Mascota" width="100%" height="150" contain />
                                </div>
                                <div class="store-name">{{ pet.name }}</div>
                                <div class="store-products">{{ pet.breed }}</div>
                            </v-card>
                        </v-col>
                    </v-row>
                </v-container>
            </v-card-text>
        </v-card>
    </v-dialog>
    <!-- Modal para ver las alertas -->
    <v-dialog v-model="dialogAlerta" max-width="500">
        <v-card rounded-lg>
            <v-card-title class="text-body-2">Alertas para Hoy</v-card-title>
            <v-card-text>
                <v-list v-if="suggestions.length">
                    <v-list-item v-for="(alerta, i) in suggestions" :key="i">
                        <template v-slot:prepend>
                            <v-icon color="deep-orange" icon="mdi-alert"></v-icon>
                        </template>

                        <v-list-item-title class="text-subtitle-2">
                            {{ alerta.title }}
                        </v-list-item-title>
                        <v-list-item-subtitle class="text-caption text-truncate">
                            {{ alerta.description }}
                            <v-tooltip activator="parent" location="bottom" max-width="350px" class="custom-tooltip">
                                <span style="white-space: normal; word-break: break-word">
                                    {{ alerta.description }}
                                </span>
                            </v-tooltip>
                        </v-list-item-subtitle>
                    </v-list-item>
                </v-list>
                <div v-else class="text-caption text-grey">No hay alertas para hoy.</div>
            </v-card-text>
            <v-card-actions>
                <v-spacer />
                <v-btn text @click="dialogAlerta = false">Cerrar</v-btn>
            </v-card-actions>
        </v-card>
    </v-dialog>
</template>

<script>
import LocalStorageService from "@/LocalStorageService";
import { handleRequest } from "@/utils/api"; // Ruta al archivo
import _ from "lodash";

import SuggestionsList from "../suggestion/SuggestionsList.vue";
import ChatTask from "../chat/ChatTask.vue";
import Vaccination from "./Vaccination.vue";
import Deworming from "./Deworming.vue";
import VetVisit from "./VetVisit.vue";
import CurrentMedication from "./CurrentMedication.vue";
import PetDiet from "./PetDiet.vue";
export default {
  components: {
    ChatTask,
    SuggestionsList,
    Vaccination,
    Deworming,
    VetVisit,
    CurrentMedication,
    PetDiet,
  },
  data: () => ({
    currentView: null,
    dialogVaccination: false,
    dialogDeworming: false,
    dialogVetVisit: false,
    dialogMedication: false,
    dialogDiet: false,
    dialogAlerta: false,
    dialogPet: false,
    selectedPet: {},
    listaAlertas: [
      {
        titulo: "Cita médica en 1 hora",
        descripcion: "Revisión nutricional con Dra. Gómez.",
      },
      {
        titulo: "Posible omisión de medicación",
        descripcion: "No se ha registrado dosis matutina.",
      },
      {
        titulo: "Síntoma fuera de rango",
        descripcion: "Temperatura detectada superior a 38.5 °C.",
      },
    ],
    petTools: [],
    dialog: false,
    nuevoValor: "",
    snackbar: false,
    sb_type: "",
    sb_message: "",
    sb_timeout: 2000,
    sb_title: "",
    sb_icon: "",
    valid: true,
    home_id: "",
    tab: null,
    loading: false,
    dialogDelete: false,
    pets: [],
    categories: [],
    types: [],
    suggestions: [],
    statusuggestions: [],
    data: {},

    steps: [
      { title: "basic", icon: "mdi-information" },
      { title: "details", icon: "mdi-dog" },
    ],
    page: 1, // Página actual
    itemsPerPage: 5, // Elementos por página
    totalItems: 0, // Total de elementos disponibles
    editedItem: {
      id: "",
      name: "",
      category_id: null,
      type: "Hogar",
      breed: "",
      sex: null,
      age: null,
      date_birth: null,
      color: "",
      microchip: "",
      signs: "",
      image: null,
      home_id: null,
    },
    defaultItem: {
      id: "",
      name: "",
      category_id: null,
      type: "Hogar",
      breed: "",
      sex: null,
      age: null,
      date_birth: null,
      color: "",
      microchip: "",
      signs: "",
      image: null,
      home_id: null,
      person_id: null,
    },
    originalItem: {
      id: "",
      name: "",
      category_id: null,
      breed: "",
      sex: null,
      age: null,
      date_birth: null,
      color: "",
      microchip: "",
      signs: "",
      image: null,
      home_id: null,
      person_id: null,
      type: "",
    },
    search: "",
    menu: false,
    menuPet: false,
    input: null,
    imageUrl: "",
    name: "",
    file: null,
    imgMiniatura: "",
    step: 0,
    colors: ["green", "orange", "blue", "red", "purple"],
    nameRules: [
      (v) => !!v || "El campo es requerido",
      (v) => (v && v.length <= 50) || "El campo debe tener menos de 51 caracteres",
      (v) => (v && v.length >= 2) || "El campo debe tener al menos de 2 caracteres",
    ],
    selectRules: [(v) => !!v || "Seleccionar al menos un elemento"],
  }),
  computed: {
    formTitle() {
      return this.editedIndex === -1
        ? "Agregar Historia Clínica"
        : "Editar Historia Clínica";
    },
    alertasHoy() {
      return this.listaAlertas.length;
    },

    dateFormatted() {
      const date = this.input ? new Date(this.input) : new Date();
      const day = date.getDate().toString().padStart(2, "0");
      const month = (date.getMonth() + 1).toString().padStart(2, "0");
      const year = date.getFullYear();
      return `${year}-${month}-${day}`;
    },
    getDate() {
      return this.input ? new Date(this.input) : new Date();
    },
    tools() {
      return [
        // 1. Vacunación
        {
          name: this.$t("petTitles.vaccines"),
          action: () => this.showVaccines(),
          icon: "mdi-needle",
        },
        // 2. Desparasitación
        {
          name: this.$t("petTitles.deworming"),
          action: () => this.showDeworming(),
          icon: "mdi-bug",
        },
        // 3. Visitas veterinarias
        {
          name: this.$t("petTitles.vetVisits"),
          action: () => this.showVetVisits(),
          icon: "mdi-medical-bag",
        },
        // 4. Medicamentos actuales
        {
          name: this.$t("petTitles.currentMedications"),
          action: () => this.showMedications(),
          icon: "mdi-pill",
        },
        // 5. Alimentación
        {
          name: this.$t("petTitles.diet"),
          action: () => this.showDiet(),
          icon: "mdi-food",
        },
      ];
    },
    imgedit() {
      return this.imgMiniatura;
    },
  },
  mounted() {
    this.name = JSON.parse(LocalStorageService.getItem("name"));
    this.imageUrl = LocalStorageService.getItem("image").replace(/['"]+/g, "");
    this.home_id = JSON.parse(LocalStorageService.getItem("home_id"));
    this.initialize();
  },
  methods: {
    getCacheTimestamp() {
      // Usamos medianoche (00:00:00) del día actual
      const now = new Date();
      const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate());
      return startOfDay.getTime(); // Ej: 1714003200000 (cambia una vez al día)
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
        default:
          return inputDate
            .toLocaleDateString("es-ES", {
              weekday: "short",
              day: "numeric",
              month: "short",
              year: "numeric", // <-- Añadido: muestra el año
            })
            .replace(/\./g, ""); // Elimina los puntos de abreviaturas (ej: "mar." → "mar")
      }
    },
    showVaccines() {
      if (!this.selectedPet.id) {
        this.showAlert("warning", "Primero selecciona una mascota.", 3000);
        return;
      }
      this.dialogVaccination = true;
    },
    closeDialogVaccination() {
      this.dialogVaccination = false; // Cerramos el diálogo
      this.initialize();
    },
    showDeworming() {
      if (!this.selectedPet.id) {
        this.showAlert("warning", "Primero selecciona una mascota.", 3000);
        return;
      }
      this.dialogDeworming = true;
    },
    closeDialogDeworming() {
      this.dialogDeworming = false; // Cerramos el diálogo
      this.initialize();
    },
    showVetVisits() {
      if (!this.selectedPet.id) {
        this.showAlert("warning", "Primero selecciona una mascota.", 3000);
        return;
      }
      this.dialogVetVisit = true;
    },
    closeDialogVetVisit() {
      this.dialogVetVisit = false; // Cerramos el diálogo
      this.initialize();
    },
    showMedications() {
      if (!this.selectedPet.id) {
        this.showAlert("warning", "Primero selecciona una mascota.", 3000);
        return;
      }
      this.dialogMedication = true;
    },
    closeDialogMedication() {
      this.dialogMedication = false; // Cerramos el diálogo
      this.initialize();
    },
    showDiet() {
      if (!this.selectedPet.id) {
        this.showAlert("warning", "Primero selecciona una mascota.", 3000);
        return;
      }
      this.dialogDiet = true;
    },
    closeDialogDiet() {
      this.dialogDiet = false; // Cerramos el diálogo
      this.initialize();
    },
    isSelected(pet) {
      return this.selectedPet.id === pet.id;
    },
    selectPet(pet) {
      // Si necesitas el objeto completo también:
      this.selectedPet = { ...pet };
      this.menuPet = false;
      this.dialogPet = false;
      this.updatePetTools();
    },
    parseDateString(dateString) {
      if (!dateString) return null;
      const [year, month, day] = dateString.split("-");
      return new Date(year, month - 1, day);
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
    nextStep() {
      if (this.step < this.steps.length - 1) {
        // 0=basic, 1=details, 2=members
        this.step++;
      } else {
        this.save();
      }
    },
    handleCloseDialog() {
      // Lógica adicional al cerrar el diálogo si es necesaria
      console.log("Diálogo cerrado");
      this.closeDialgChat();
    },
    closeDialgChat() {
      this.dialogChatTask = false;
      this.currentTask = null; // Limpia la tarea actual
      this.initialize();
    },
    formatoFecha(fecha) {
      if (!fecha) return "";

      const d = new Date(fecha);
      const locale = this.$i18n.locale;
      const options = {
        year: "numeric",
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
        timeZone: "UTC", // Forzar UTC
      };

      return d.toLocaleDateString(locale, options);
    },
    abrirModal(item) {
      switch (item.type) {
        case "physicalExam":
          this.showAddPhysicalExam();
          break;
        case "treatment":
          this.showAddTreatment();
          break;
        case "backgroundPerson":
          this.showAddPerson();
          break;
        case "backgroundFamily":
          this.showAddFamily();
          break;
        case "medicalExam":
          this.showAddExam();
          break;
        case "diagnosis":
          this.showAddDiagnosis();
          break;
        case "consultation":
          this.showAddConsultations();
          break;
        default:
          break;
      }
    },
    guardarValor() {
      if (this.signoSeleccionado) {
        this.signoSeleccionado.valor = this.nuevoValor;
        this.signoSeleccionado.fecha = new Date().toISOString().slice(0, 10);
      }
      this.dialog = false;
    },
    // Método para manejar la paginación
    updatePage(page) {
      this.page = page;
      this.initialize(); // Recarga los almacenes con la nueva página
    },

    updateDate(value) {
      const year = value.getFullYear();
      const month = String(value.getMonth() + 1).padStart(2, "0");
      const day = String(value.getDate()).padStart(2, "0");
      this.input = `${year}-${month}-${day}`;

      this.editedItem.date_birth = this.input;
      this.menu = false;
    },
    // Método para manejar el cambio de elementos por página
    updateItemsPerPage(itemsPerPage) {
      this.itemsPerPage = itemsPerPage;
      this.initialize(); // Recarga los almacenes con el nuevo número de elementos por página
    },
    async showAdd() {
      this.step = 0;
      (this.file = null), (this.editedIndex = -1);
      (this.imgMiniatura = ""), (this.data = {});
      try {
        const result = await handleRequest({
          endpoint: "category-pets",
          method: "POST",
        });

        if (result.success) {
          this.categories = result.data.categories || [];
          this.types = result.data.types || [];
        } else {
          this.categories = [];
          this.types = [];
        }
      } catch (error) {
        this.showAlert(
          "error",
          "Ocurrió un error inesperado al cargar las categorías.",
          3000
        );
      } finally {
        this.dialog = true;
      }
    },
    close() {
      this.dialog = false;
      this.loading = false;
      this.$nextTick(() => {
        this.editedItem = Object.assign({}, this.defaultItem);
        this.originalItem = Object.assign({}, this.defaultItem);
      });
      this.editedIndex = -1;
    },
    async initialize() {
      this.data = {};
      this.data.home_id = this.home_id;
      try {
        this.loading = true;
        const result = await handleRequest({
          endpoint: "get-pet-person",
          method: "POST",
          data: this.data,
        });

        if (result.success) {
          // Si la solicitud es exitosa, asignamos las sucursale
          this.pets = result.data?.pets || [];
          this.suggestions = result.data?.suggestions || [];
          this.statusuggestions = result.data?.statusuggestions || [];
          console.log("this.selectedPet");
          console.log(this.selectedPet);
          if (!this.selectedPet?.id && this.pets.length > 0) {
            this.selectedPet = { ...this.pets[0] };
          }
          this.updatePetTools();
        } else {
          // Si no hay datos, asignamos un array vací
          this.pets = [];
          this.suggestions = [];
          this.statusuggestions = [];
        }
      } catch (error) {
        this.loading = false;
        // Captura de errores no controlados
        this.showAlert("error", "Ocurrió un error inesperado al cargar los roles.", 3000);
      } finally {
        this.loading = false;
      }
    },
    updatePetTools() {
      this.petTools = [
        {
          name: this.$t("petTitles.vaccines"),
          action: () => this.showVaccines(),
          icon: "mdi-needle",
          color: "green",
          count: this.selectedPet?.vaccinations.count,
          lastDate: this.selectedPet?.vaccinations.date,
          lastItemName: this.selectedPet?.vaccinations.name || this.$t("common.no_name"),
        },
        {
          name: this.$t("petTitles.deworming"),
          action: () => this.showDeworming(),
          icon: "mdi-bug",
          color: "orange",
          count: this.selectedPet?.dewormings.count,
          lastDate: this.selectedPet?.dewormings.date,
          lastItemName: this.selectedPet?.dewormings.name || this.$t("common.no_name"),
        },
        {
          name: this.$t("petTitles.vetVisits"),
          action: () => this.showVetVisits(),
          icon: "mdi-medical-bag",
          color: "blue",
          count: this.selectedPet?.vetvisits.count,
          lastDate: this.selectedPet?.vetvisits.date,
          lastItemName: this.selectedPet?.vetvisits.name || this.$t("common.no_name"),
        },
        {
          name: this.$t("petTitles.currentMedications"),
          action: () => this.showMedications(),
          icon: "mdi-pill",
          color: "red",
          count: this.selectedPet?.medications.count,
          lastDate: this.selectedPet?.medications.date,
          lastItemName: this.selectedPet?.medications.name || this.$t("common.no_name"),
        },
        {
          name: this.$t("petTitles.diet"),
          action: () => this.showDiet(),
          icon: "mdi-food",
          color: "purple",
          count: this.selectedPet?.diets.count,
          lastDate: this.selectedPet?.diets.date,
          lastItemName: this.selectedPet?.diets.name || this.$t("common.no_name"),
        },
      ];
    },
    async save() {
      this.data = {};
      this.loading = true;
      if (this.editedIndex === -1) {
        this.valid = false;
        const fieldsToUpdate = [
          "name",
          "category_id",
          "type",
          "breed",
          "sex",
          "age",
          "date_birth",
          "color",
          "microchip",
          "signs",
          "image",
          "home_id",
        ];
        let updatedFields = Object.keys(this.editedItem)
          .filter(
            (key) =>
              fieldsToUpdate.includes(key) &&
              this.editedItem[key] !== this.originalItem[key]
          )
          .reduce((obj, key) => {
            obj[key] = this.editedItem[key];
            return obj;
          }, {});

        // Agregar campos adicionales si es necesario
        if (Object.keys(updatedFields).length > 0) {
          updatedFields.home_id = this.home_id;
          updatedFields.type = this.editedItem.type ? this.editedItem.type : "Hogar";

          if (this.file) {
            updatedFields.image = this.editedItem.image;
          }

          // Crear el objeto FormData
          const formData = new FormData();
          for (let key in updatedFields) {
            formData.append(key, updatedFields[key]);
          }

          try {
            const result = await handleRequest({
              endpoint: "pet",
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
          "name",
          "category_id",
          "type",
          "breed",
          "sex",
          "age",
          "date_birth",
          "color",
          "microchip",
          "signs",
          "image",
          "home_id",
        ];
        let updatedFields = Object.keys(this.editedItem)
          .filter(
            (key) =>
              fieldsToUpdate.includes(key) &&
              this.editedItem[key] !== this.originalItem[key]
          )
          .reduce((obj, key) => {
            obj[key] = this.editedItem[key];
            return obj;
          }, {});

        // Agregar campos adicionales si es necesario
        if (Object.keys(updatedFields).length > 0) {
          updatedFields.id = this.editedItem.id;
          if (this.file) {
            updatedFields.image = this.editedItem.image;
          }

          // Crear el objeto FormData
          const formData = new FormData();
          for (let key in updatedFields) {
            formData.append(key, updatedFields[key]);
          }

          try {
            const result = await handleRequest({
              endpoint: "pet-update",
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
      }
      this.close();
    },
    async editItem(item) {
      this.editedIndex = 1;
      this.step = 0;
      this.originalItem = _.cloneDeep(item);
      this.editedItem = _.cloneDeep(item);
      this.input = item.date_birth;
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
      try {
        const result = await handleRequest({
          endpoint: "category-pets",
          method: "POST",
        });

        if (result.success) {
          this.categories = result.data.categories || [];
          this.types = result.data.types || [];
        } else {
          this.categories = [];
          this.types = [];
        }
      } catch (error) {
        this.showAlert(
          "error",
          "Ocurrió un error inesperado al cargar las categorías.",
          3000
        );
      } finally {
        this.dialog = true;
      }
    },
    // Función para comparar arrays de objetos
    deleteItem(item) {
      this.editedIndex = 1;
      this.editedItem.id = item.id;
      this.dialogDelete = true;
    },
    closeDelete() {
      this.dialogDelete = false;
      this.$nextTick(() => {
        this.editedItem = Object.assign({}, this.defaultItem);
      });
    },
    async deleteItemConfirm() {
      this.loading = true;
      try {
        let request = {
          id: this.editedItem.id,
        };
        const result = await handleRequest({
          endpoint: "pet-destroy",
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
.store-card {
  border-radius: 20px;
  cursor: pointer;
  transition: all 0.3s ease;
  max-width: 120px;
  min-width: 120px;
  background: #ffffff;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
  padding: 5px;
}
.store-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 5px 10px rgba(0, 0, 0, 0.12);
}
.icon-wrapper {
  width: 55px;
  height: 55px;
  margin: 0 auto;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
}
.store-name {
  font-size: 15px;
  font-weight: 600;
  color: #333;
  margin-bottom: 4px;
}
.store-products {
  font-size: 13px;
  color: #777;
}
.selected-pet-card {
  background-color: rgba(76, 175, 80, 0.05); /* Fondo muy suave */
  transition: all 0.3s ease;
}
.v-btn {
  flex-shrink: 0;
}

/* Espaciado entre elementos */
.gap-1 {
  gap: 4px;
}
.tools-bar {
  overflow-x: auto;
  white-space: nowrap;
  gap: 8px;
}
/* Estilos para personalizar el scroll */
.v-list {
  scrollbar-width: thin;
  /* Para navegadores que soportan scrollbar-width */
  scrollbar-color: #888 #f1f1f1;
  /* Color del scroll */
}

.selected-tab {
  background-color: #03626c;
  /* Fondo del tab seleccionado */
  color: white;
  /* Texto blanco */
  border-radius: 4px;
  /* Esquinas redondeadas, opcional */
}

.v-list::-webkit-scrollbar {
  width: 6px;
  /* Ancho del scroll */
}

.v-list::-webkit-scrollbar-thumb {
  background-color: #888;
  /* Color del thumb */
  border-radius: 3px;
  /* Bordes redondeados */
}

.v-list::-webkit-scrollbar-track {
  background-color: #f1f1f1;
  /* Color del track */
}

.text-h6 {
  font-size: 1.2rem;
}

.signo-card {
  transition: 0.2s ease-in-out;
}

.signo-card .text-truncate {
  display: block;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  width: 100%;
}

.signo-card:hover {
  transform: scale(1.01);
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.06);
}
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
</style>
