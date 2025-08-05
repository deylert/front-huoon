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
           <h2 class="text-body-2 font-weight-bold">{{ $t("wishes.listing.title") }}</h2>
          <v-btn icon color="deep-purple-accent-4" variant="flat" class="elevation-3" @click="showAdd" :title=" this.$t('wishes.listing.addButton')">
            <v-icon>mdi-plus</v-icon>
          </v-btn>
        </v-row>
      <v-row justify="space-between" align="center" class="mb-6">
      <v-col cols="12" class="ma-0 pt-6" style="max-height: 60vh; min-height: 40vh; overflow-y: auto">
      <template v-if="wishes.length > 0">
              <v-card v-for="(wish, index) in wishes" :key="index" class="mb-4 rounded-lg pa-2"
                density="comfortable" elevation="2">
                <v-row>
                  <!-- Barra lateral de color e info -->
                  <v-col cols="1" class="d-flex justify-start">
                    <div class="icono-concavo d-flex flex-column justify-center justify-start"
                      :class="`bg-${getTypeColor(wish.type)}`">
                      <div class="date-display">
                        {{ formatIntuitiveDate(wish.date) }}
                      </div>
                    </div>
                  </v-col>
                  <v-col cols="5" class="d-flex align-center justify-start">
                    <v-row align="center" class="gap-3">
                      <div>
                        <div class="font-weight-bold text-body-2">
                          {{ wish.name }}
                        </div>
                        <div class="text-body-2 d-flex align-center text-grey-darken-1">
                          {{ wish.description }}
                          <v-tooltip activator="parent" location="bottom" max-width="350px">
                            <span style="white-space: normal; word-break: break-word">
                              {{ $t("wishes.fields.description") }}: {{ wish.description }}
                            </span>
                          </v-tooltip>
                        </div>
                        <div class="text-body-2 d-flex align-center text-grey-darken-1">
                          {{ wish.location }}
                          <v-tooltip activator="parent" location="bottom" max-width="350px">
                            <span style="white-space: normal; word-break: break-word">
                              {{ $t("wishes.fields.location") }}: {{ wish.location }}
                            </span>
                          </v-tooltip>
                        </div>
                      </div>
                    </v-row>
                  </v-col>
                  <v-col cols="1" class="d-flex align-center justify-start text-truncate">
                    <div>
                      <span class="text-body-2">
                        {{ wish.type }}</span>
                      <v-tooltip activator="parent" location="bottom" max-width="350px">
                        <span style="white-space: normal; word-break: break-word">
                          {{ $t("wishes.fields.type") }}: {{ wish.type }}
                        </span>
                      </v-tooltip>
                    </div>
                  </v-col>
                  <v-col cols="1" class="d-flex align-center justify-start text-truncate">
                    <div>
                      <span class="text-body-2">
                        {{ wish.namePriority }}</span>
                      <v-tooltip activator="parent" location="bottom" max-width="350px">
                        <span style="white-space: normal; word-break: break-word">
                          {{ $t("wishes.fields.priority") }}: {{ wish.namePriority }}
                        </span>
                      </v-tooltip>
                    </div>
                  </v-col>
                  <v-col cols="1" class="d-flex align-center justify-start text-truncate">
                    <div>
                      <span class="text-body-2">
                        {{ wish.nameStatus }}</span>
                      <v-tooltip activator="parent" location="bottom" max-width="350px">
                        <span style="white-space: normal; word-break: break-word">
                          {{ $t("wishes.fields.status") }}: {{ wish.nameStatus }}
                        </span>
                      </v-tooltip>
                    </div>
                  </v-col>
                  <v-col cols="1" class="d-flex align-center ml-auto pe-4" style="margin-left: auto !important">
                    <v-btn icon variant="text" color="green-darken-2" size="small" @click="editItem(wish)">
                      <v-icon>mdi-pencil</v-icon>
                    </v-btn>
                    <v-btn icon variant="text" color="red-darken-2" size="small" @click="deleteItem(wish)">
                      <v-icon>mdi-delete</v-icon>
                    </v-btn>
                  </v-col>
                </v-row>
              </v-card>
              <!--<v-col v-for="product in paginatedProducts" :key="product.id" cols="3" class="ml-2">
                  <v-card class="rounded-lg" max-width="35vh">
                    <v-img height="25vh" :src="`${$axios.defaults.baseURL}images/${product.image}`" cover></v-img>

                    <v-card-title>
                      <v-tooltip bottom location="top" class="custom-tooltip">
                        <template v-slot:activator="{ props }">
                          <span v-bind="props">{{ product.productName }}</span>
                        </template>
                        {{ product.productName }}
                      </v-tooltip>
                    </v-card-title>

                    <v-card-subtitle>
                      <v-tooltip bottom location="top">
                        <template v-slot:activator="{ props }">
                          <span v-bind="props">
                            {{ $t("product.listing.description") }}: {{ product.additionalNotes }}
                          </span>
                        </template>
                        {{ product.additionalNotes }}
                      </v-tooltip>
                    </v-card-subtitle>

                    <v-card-text>
                      {{ $t("product.listing.quantity") }}: {{ product.quantity }}
                    </v-card-text>

                    <v-card-actions justify="end" class="w-100">
                      <v-btn color="#DA7171" @click="deleteItem(product)">
                        {{ $t("product.listing.delete") }}
                      </v-btn>
                      <v-btn color="#03626C" @click="editItem(product)" :loading="loadingProductEdit">
                        {{ $t("product.listing.edit") }}
                      </v-btn>
                    </v-card-actions>
                  </v-card>
                </v-col>-->
            </template>
            <template v-else>
              <v-col cols="12" class="text-center py-8">
                {{ $t("wishes.listing.noData") }}
              </v-col>
            </template>
      </v-col>      
      </v-row>
        <!--<v-tabs v-model="tab" vertical>
          <v-tab value="personal" :class="tab === 'personal' ? 'selected-tab' : ''">{{
            $t("wishes.listing.types.personal")
          }}</v-tab>
          <v-tab value="hogar" :class="tab === 'hogar' ? 'selected-tab' : ''">{{
            $t("wishes.listing.types.home")
          }}</v-tab>
          <v-tab
            value="profesional"
            :class="tab === 'profesional' ? 'selected-tab' : ''"
            >{{ $t("wishes.listing.types.professional") }}</v-tab
          >
          <v-tab value="todas" :class="tab === 'todas' ? 'selected-tab' : ''">{{
            $t("wishes.listing.types.all")
          }}</v-tab>
        </v-tabs>

        <v-window v-model="tab" min-height="50vh" class="mt-2">
          <v-window-item value="personal">
            <v-text-field
              class="mt-1 mb-1"
              v-model="search"
              append-icon="mdi-magnify"
              :label="$t('wishes.listing.search')"
              single-line
              hide-details
            >
            </v-text-field>
            <v-data-table
              :headers="translatedHeaders"
              :search="search"
              :items="filteredPersonalWishes"
              class="elevation-1"
              style="max-height: 68vh; overflow-y: auto"
              :loading="loading"
            >
              <template v-slot:item.actions="{ item }">
                <v-btn
                  density="comfortable"
                  icon="mdi-pencil"
                  @click="editItem(item)"
                  color="#1976D2"
                  variant="tonal"
                  elevation="1"
                  title="Editar Deseo"
                ></v-btn>
                <v-btn
                  density="comfortable"
                  icon="mdi-delete"
                  @click="deleteItem(item)"
                  color="#DA7171"
                  variant="tonal"
                  elevation="1"
                  title="Eliminar Deseo"
                ></v-btn>
              </template>
            </v-data-table>
          </v-window-item>
          <v-window-item value="hogar" class="mt-4">
            <v-text-field
              class="mt-1 mb-1"
              v-model="search"
              append-icon="mdi-magnify"
              :label="$t('wishes.listing.search')"
              single-line
              hide-details
            >
            </v-text-field>
            <v-data-table
              :headers="translatedHeaders"
              :search="search"
              :items="filteredHomeWishes"
              class="elevation-1"
              style="max-height: 68vh; overflow-y: auto"
              :loading="loading"
            >
              <template v-slot:item.actions="{ item }">
                <v-btn
                  density="comfortable"
                  icon="mdi-pencil"
                  @click="editItem(item)"
                  color="#1976D2"
                  variant="tonal"
                  elevation="1"
                  title="Editar Deseo"
                ></v-btn>
                <v-btn
                  density="comfortable"
                  icon="mdi-delete"
                  @click="deleteItem(item)"
                  color="#DA7171"
                  variant="tonal"
                  elevation="1"
                  title="Eliminar Deseo"
                ></v-btn>
              </template>
            </v-data-table>
          </v-window-item>
          <v-window-item value="profesional" class="mt-4">
            <v-text-field
              class="mt-1 mb-1"
              v-model="search"
              append-icon="mdi-magnify"
              :label="$t('wishes.listing.search')"
              single-line
              hide-details
            >
            </v-text-field>
            <v-data-table
              :headers="translatedHeaders"
              :search="search"
              :items="filteredProfessionalWishes"
              class="elevation-1"
              style="max-height: 68vh; overflow-y: auto"
              :loading="loading"
            >
              <template v-slot:item.actions="{ item }">
                <v-btn
                  density="comfortable"
                  icon="mdi-pencil"
                  @click="editItem(item)"
                  color="#1976D2"
                  variant="tonal"
                  elevation="1"
                  title="Editar Deseo"
                ></v-btn>
                <v-btn
                  density="comfortable"
                  icon="mdi-delete"
                  @click="deleteItem(item)"
                  color="#DA7171"
                  variant="tonal"
                  elevation="1"
                  title="Eliminar Deseo"
                ></v-btn>
              </template>
            </v-data-table>
          </v-window-item>
          <v-window-item value="todas">
            <v-text-field
              class="mt-1 mb-1"
              v-model="search"
              append-icon="mdi-magnify"
              :label="$t('wishes.listing.search')"
              single-line
              hide-details
            >
            </v-text-field>
            <v-data-table
              :headers="translatedHeaders"
              :search="search"
              :items="wishes"
              class="elevation-1"
              style="max-height: 68vh; overflow-y: auto"
              :loading="loading"
            >
              <template v-slot:item.actions="{ item }">
                <v-btn
                  density="comfortable"
                  icon="mdi-pencil"
                  @click="editItem(item)"
                  color="#1976D2"
                  variant="tonal"
                  elevation="1"
                  title="Editar Deseo"
                ></v-btn>
                <v-btn
                  density="comfortable"
                  icon="mdi-delete"
                  @click="deleteItem(item)"
                  color="#DA7171"
                  variant="tonal"
                  elevation="1"
                  title="Eliminar Deseo"
                ></v-btn>
              </template>
            </v-data-table>
          </v-window-item>
        </v-window>-->
      </v-card-text>
    </v-card>
  </v-container>
  <!--<v-dialog v-model="dialog" max-width="600px">
    <v-form ref="form" v-model="valid" enctype="multipart/form-data">
      <v-card>
        <v-toolbar color="#03626C">
          <span class="text-subtitle-2 ml-4">{{ formTitle }}</span>
        </v-toolbar>
        <v-card-text>
          <v-container>
            <v-row>
              <v-col cols="12" md="6">
                <v-text-field v-model="editedItem.name" clearable label="Nombre" prepend-icon="mdi-tag-outline"
                    variant="underlined" density="compact" :rules="nameRules"></v-text-field>
              </v-col>

              <v-col cols="12" md="6">
                <v-select v-model="editedItem.type" :items="types" item-title="name" item-value="id"
                    label="Tipo de Deseo" variant="underlined" density="compact" :rules="selectRules"
                    prepend-icon="mdi-format-list-bulleted">
                  </v-select>
              </v-col>
              <v-col cols="12" md="6">
                <v-menu v-model="menu" :close-on-content-click="false" :nudge-right="40" transition="scale-transition"
                  offset-y min-width="290px">
                  <template v-slot:activator="{ props }">
                    <v-text-field v-bind="props" :modelValue="dateFormatted" variant="underlined"
                      prepend-icon="mdi-calendar" label="Fecha" density="compact"></v-text-field>
                  </template>
                  <v-locale-provider locale="es">
                    <v-date-picker header="Calendario" title="Seleccione la fecha" color="#03626C" :modelValue="input"
                      @update:model-value="updateDate" format="yyyy-MM-dd"
                      :min="new Date().toISOString().split('T')[0]"></v-date-picker>
                  </v-locale-provider>
                </v-menu>
              </v-col>
              <v-col cols="12" md="6">
                <v-menu v-model="menu1" :close-on-content-click="false" :nudge-right="40" transition="scale-transition"
                  offset-y min-width="290px">
                  <template v-slot:activator="{ props }">
                    <v-text-field v-bind="props" :modelValue="dateFormatted1" variant="underlined"
                      prepend-icon="mdi-calendar" label="Fecha de Cumplimiento" density="compact"></v-text-field>
                  </template>
                  <v-locale-provider locale="es">
                    <v-date-picker header="Calendario" title="Seleccione la fecha" color="#03626C" :modelValue="input1"
                      @update:model-value="updateDate1" format="yyyy-MM-dd"
                      :min="new Date().toISOString().split('T')[0]"></v-date-picker>
                  </v-locale-provider>
                </v-menu>
              </v-col>
              <v-col cols="12" md="6">
                  <v-select v-model="editedItem.priority_id" :items="priorities" item-title="namePriority"
                    item-value="id" label="Prioridad" variant="underlined" density="compact" :rules="selectRules"
                    prepend-icon="mdi-alert-outline">
                    <template v-slot:item="{ props, item }">
                      <v-list-item v-bind="props" :subtitle="item.raw.descriptionPriority"></v-list-item>
                    </template>
                  </v-select>
                </v-col>
                <v-col cols="12" md="6" v-if="showStatus">
                  <v-autocomplete :no-data-text="'No hay datos disponibles'" v-model="editedItem.status_id"
                    :items="status" label="Estado" prepend-icon="mdi-lock-outline" item-title="nameStatus"
                    item-value="id" variant="underlined" density="compact" :rules="selectRules">
                    <template v-slot:item="{ props, item }">
                      <v-list-item v-bind="props">
                        <template v-slot:prepend>
                          <v-avatar size="24">
                            <v-icon>{{ item.raw.iconStatus }}</v-icon>
                          </v-avatar>
                        </template>
                        <v-list-item-subtitle class="d-flex flex-column">
                          <div>Descripción: {{ item.raw.descriptionStatus }}</div>
                        </v-list-item-subtitle>
                      </v-list-item>
                    </template>
                  </v-autocomplete>
                </v-col>
                <v-col cols="12" md="12">
                <v-text-field v-model="editedItem.location" clearable label="Ubicación" prepend-icon="mdi-map-marker-outline"
                    variant="underlined" density="compact"></v-text-field>
              </v-col>
              <v-col cols="12" md="12">
                <v-textarea v-model="editedItem.description" clearable label="Descripción" prepend-icon="mdi-note"
                  variant="underlined"></v-textarea>
              </v-col>
            </v-row>
          </v-container>
        </v-card-text>
        <v-divider></v-divider>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="#DA7171" variant="flat" @click="close">Cancelar</v-btn>
          <v-btn color="#03626C" variant="flat" @click="save" :disabled="!valid" :loading="loading">Aceptar</v-btn>
        </v-card-actions>
      </v-card>
    </v-form>
  </v-dialog>-->
  <v-dialog
    v-model="dialog"
    fullscreen
    persistent
    transition="dialog-bottom-transition"
    content-class="fullscreen-dialog"
  >
    <v-form ref="form" v-model="valid" class="h-100">
      <v-card class="pa-10">
        <v-card-text class="pt-12">
          <!-- Encabezado -->
          <h5 class="text-grey-darken-2 font-weight-medium">
            {{ $t(`wishes.formTitle.${editedIndex === -1 ? "create" : "edit"}`) }}
          </h5>
          <p class="text-grey-lighten-1">{{ $t("wishes.formInstructions") }}</p>

          <v-row class="mt-12">
            <!-- Pasos laterales -->
            <v-col cols="3">
              <v-timeline align="start" side="end" dense>
                <v-timeline-item
                  v-for="(s, index) in steps"
                  :key="index"
                  :dot-color="
                    step > index
                      ? 'green'
                      : step === index
                      ? 'deep-purple'
                      : 'grey-lighten-1'
                  "
                  :icon="
                    step >= index
                      ? step === index
                        ? `mdi-numeric-${index + 1}`
                        : 'mdi-check'
                      : null
                  "
                  size="large"
                >
                  <template #opposite>
                    <div class="text-end">
                      <strong>{{ $t(`wishes.steps.${s.key}.title`) }}</strong>
                      <div class="text-caption text-grey">
                        {{ $t(`wishes.steps.${s.key}.subtitle`) }}
                      </div>
                    </div>
                  </template>
                </v-timeline-item>
              </v-timeline>
            </v-col>

            <!-- Contenido dinámico según paso -->
            <v-col cols="9">
              <h3 class="text-deep-purple-accent-3 mb-8">
                {{ $t(`wishes.steps.${steps[step].key}.title`) }}
              </h3>

              <!-- Paso 1: Información básica -->
              <v-row dense v-if="step === 0">
                <v-col cols="12" md="12">
                  <v-text-field
                    v-model="editedItem.name"
                    :label="$t('wishes.fields.name')"
                    variant="underlined"
                    :rules="[
                      (v) =>
                        !!v ||
                        $t('wishes.validation.required', {
                          field: $t('wishes.fields.name'),
                        }),
                    ]"
                  ></v-text-field>
                </v-col>

                <v-col cols="12" md="6">
                  <v-select
                    v-model="editedItem.type"
                    :items="types"
                    item-title="name"
                    item-value="id"
                    :label="$t('wishes.fields.type')"
                    variant="underlined"
                    :rules="[
                      (v) =>
                        !!v ||
                        $t('wishes.validation.required', {
                          field: $t('wishes.fields.type'),
                        }),
                    ]"
                  ></v-select>
                </v-col>
                <v-col cols="12" md="6">
                  <v-select
                    v-model="editedItem.priority_id"
                    :items="priorities"
                    item-title="namePriority"
                    item-value="id"
                    :label="$t('wishes.fields.priority')"
                    variant="underlined"
                    :rules="[
                      (v) =>
                        !!v ||
                        $t('wishes.validation.required', {
                          field: $t('wishes.fields.priority'),
                        }),
                    ]"
                  >
                    <template v-slot:item="{ props, item }">
                      <v-list-item
                        v-bind="props"
                        :subtitle="item.raw.descriptionPriority"
                      ></v-list-item>
                    </template>
                  </v-select>
                </v-col>
                <v-col cols="12" md="6">
                <v-menu v-model="menu" :close-on-content-click="false" :nudge-right="40" transition="scale-transition"
                  offset-y min-width="290px">
                  <template v-slot:activator="{ props }">
                    <v-text-field v-bind="props" :modelValue="dateFormatted" variant="underlined" :label="$t('wishes.fields.date')"></v-text-field>
                  </template>
                  <v-locale-provider>
                    <v-date-picker color="#03626C" :modelValue="input"
                      @update:model-value="updateDate" format="yyyy-MM-dd"
                      :min="new Date().toISOString().split('T')[0]"></v-date-picker>
                  </v-locale-provider>
                </v-menu>
              </v-col>
              <v-col cols="12" md="6">
                <v-menu v-model="menu1" :close-on-content-click="false" :nudge-right="40" transition="scale-transition"
                  offset-y min-width="290px">
                  <template v-slot:activator="{ props }">
                    <v-text-field v-bind="props" :modelValue="dateFormatted1" variant="underlined" :label="$t('wishes.fields.fulfillment_date')"></v-text-field>
                  </template>
                  <v-locale-provider>
                    <v-date-picker color="#03626C" :modelValue="input1"
                      @update:model-value="updateDate1" format="yyyy-MM-dd"
                      :min="new Date().toISOString().split('T')[0]"></v-date-picker>
                  </v-locale-provider>
                </v-menu>
              </v-col>
              </v-row>
              <!-- Paso 3: Información adicional -->
              <v-row dense v-if="step === 1">
              <v-col cols="12" md="12" v-if="showStatus">
                  <v-autocomplete
                    v-model="editedItem.status_id"
                    :items="status"
                    :label="$t('wishes.fields.status')"
                    item-title="nameStatus"
                    item-value="id"
                    variant="underlined"
                    :no-data-text="$t('wishes.noData')"
                  >
                    <template v-slot:item="{ props, item }">
                      <v-list-item v-bind="props">
                        <template v-slot:prepend>
                          <v-avatar size="24">
                            <v-icon>{{ item.raw.iconStatus }}</v-icon>
                          </v-avatar>
                        </template>
                        <v-list-item-subtitle>
                          {{ item.raw.descriptionStatus }}
                        </v-list-item-subtitle>
                      </v-list-item>
                    </template>
                  </v-autocomplete>
                </v-col>
                <v-col cols="12" md="12">
                  <v-text-field
                    v-model="editedItem.location"
                    :label="$t('wishes.fields.location')"
                    variant="underlined"
                  ></v-text-field>
                </v-col>

                <v-col cols="12" md="12">
                  <v-textarea
                    v-model="editedItem.description"
                    :label="$t('wishes.fields.description')"
                    variant="underlined"
                    rows="3"
                  ></v-textarea>
                </v-col>
              </v-row>

              <!-- Navegación -->
              <div class="d-flex justify-space-between mt-8">
                <v-btn
                  variant="text"
                  class="text-grey-darken-1"
                  @click="step > 0 ? step-- : close()"
                >
                  {{ step === 0 ? $t("buttons.close") : $t("buttons.previous") }}
                </v-btn>

                <v-btn
                  variant="text"
                  class="text-deep-purple-accent-3"
                  @click="nextStep"
                  :disabled="!validStep"
                >
                  {{
                    step === steps.length - 1 ? $t("buttons.saveAndClose") : $t("buttons.next")
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
          {{ $t("deleteDialog.title", { item: $t(`deleteDialog.items.wish`) }) }}</span
        >
      </v-toolbar>

      <v-card-text class="mt-2 mb-2"> {{ $t("deleteDialog.message") }}</v-card-text>
      <v-divider></v-divider>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn color="#DA7171" variant="flat" @click="closeDelete">{{
          $t("taskForm.buttons.cancel")
        }}</v-btn>
        <v-btn
          color="#03626C"
          variant="flat"
          :loading="loading"
          @click="deleteItemConfirm"
        >
          {{ $t("taskForm.buttons.confirmDelete") }}</v-btn
        >
      </v-card-actions>
    </v-card>
  </v-dialog>
  <!--<v-dialog v-model="dialogPhoto" persistent max-width="600px">
    <v-card>
      <v-toolbar color="#03626C">
        <span class="text-subtitle-2 ml-4">Detalle</span> <v-spacer></v-spacer>
        <v-btn @click="dialogPhoto = false">
          <v-icon>mdi-close</v-icon>
        </v-btn>
      </v-toolbar>

      <v-card-text>
        <template v-if="loadingImage">
          <div class="d-flex justify-center align-center" style="min-height: 200px;">
            <v-progress-circular indeterminate color="#03626C"
              style="width: 100px; height: 100px;"></v-progress-circular>
          </div>
        </template>
        <template v-else>
          <v-img :src="selectedImageUrl" aspect-ratio="1.5" contain fill-height></v-img>
        </template>
      </v-card-text>
    </v-card>
  </v-dialog>-->
</template>

<script>
import LocalStorageService from "@/LocalStorageService";
import { handleRequest } from "@/utils/api"; // Ruta al archivo
import { format } from "date-fns";
export default {
  data: () => ({
    steps: [{ key: "basic" }, { key: "additional" }],
    step: 0,
    snackbar: false,
    sb_type: "",
    sb_message: "",
    sb_timeout: 2000,
    sb_title: "",
    sb_icon: "",
    valid: true,
    person_id: "",
    tab: null,
    loading: false,
    mostrar: false,
    file: null,
    imgMiniatura: "",
    dialog: false,
    dialogDelete: false,
    wishes: [],
    priorities: [],
    types: [],
    filteredPersonalWishes: [],
    filteredHomeWishes: [],
    filteredProfessionalWishes: [],
    data: {},
    home_id: "",
    showStatus: false,
    dialogPhoto: false,
    loadingImage: false,
    selectedImageUrl: "",
    headers: [
      //{ title: 'Sucursal', value: 'branchName', width: '20%' },
      { title: "wishes.fields.name", value: "name" },
      { title: "wishes.fields.date", value: "date" },
      { title: "wishes.fields.fulfillment_date", value: "end" },
      { title: "wishes.fields.status", value: "nameStatus" },
      { title: "wishes.fields.priority", value: "namePriority" },
      { title: "wishes.fields.type", value: "type" },
      { title: "wishes.fields.description", value: "description" },
      { title: "wishes.fields.actions", value: "actions", sortable: false, width: "15%" },
    ],
    editedItem: {
      id: "",
      home_id: "",
      name: "",
      location: "",
      date: null,
      end: null,
      description: "",
      type: "",
      priority_id: "",
      status_id: "",
      parent_id: "",
    },
    originalItem: {
      id: "",
      home_id: "",
      name: "",
      location: "",
      date: null,
      end: null,
      description: "",
      type: "",
      priority_id: "",
      status_id: "",
      parent_id: "",
    },
    defaultItem: {
      id: "",
      home_id: "",
      name: "",
      location: "",
      date: null,
      end: null,
      description: "",
      type: "",
      priority_id: "",
      status_id: "",
      parent_id: "",
    },
    editedIndex: -1,
    search: "",
    menu: false,
    input: null,
    menu1: false,
    input1: null,
    nameRules: [
      (v) => !!v || "El campo es requerido",
      (v) => (v && v.length <= 50) || "El campo debe tener menos de 51 caracteres",
      (v) => (v && v.length >= 3) || "El campo debe tener al menos de 3 caracteres",
    ],
    selectRules: [(v) => !!v || "Seleccionar al menos un elemento"],
    priceRules: [
      (v) => !!v || "El precio es obligatorio", // El campo es obligatorio
      (v) =>
        /^[0-9]+(\.[0-9]{1,2})?$/.test(v) ||
        "El precio debe ser un número válido con hasta 2 decimales", // Valida el formato del precio
      (v) => v > 0 || "El precio debe ser un número positivo", // El precio debe ser positivo
    ],
  }),
  computed: {
    formTitle() {
      return this.editedIndex === -1 ? "Agregar Deseo" : "Editar Deseo";
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
    getDate() {
      return this.input ? new Date(this.input) : new Date();
    },
    dateFormatted1() {
      const date = this.input1 ? new Date(this.input1) : new Date();
      const day = date.getDate().toString().padStart(2, "0");
      const month = (date.getMonth() + 1).toString().padStart(2, "0");
      const year = date.getFullYear();
      return `${year}-${month}-${day}`;
    },
    getDate1() {
      return this.input1 ? new Date(this.input1) : new Date();
    },
    validStep() {
      // Validación específica por paso
      switch (this.step) {
        case 0:
          return (
      !!this.editedItem.name && 
      !!this.editedItem.type && 
      !!this.editedItem.priority_id
    );
        case 1:
           return true; // El último paso no requiere validación obligatoria
        default:
          return false;
      }
    },
    translatedHeaders() {
      return this.headers.map((header) => ({
        ...header,
        title: this.$t(header.title),
      }));
    },
  },
  mounted() {
    this.person_id = JSON.parse(LocalStorageService.getItem("person_id"));
    this.home_id = JSON.parse(LocalStorageService.getItem("home_id"));
    this.initialize();
  },
  methods: {
    getTypeColor(type) {
      const colorMap = {
        Personal: "deep-purple",      // Color morado para asuntos personales
        Profesional: "indigo",       // Color índigo para temas profesionales
        Hogar: "teal",               // Color verde azulado para el hogar
        // Puedes agregar más tipos si es necesario
        Regalo: "pink",              // Ejemplo adicional
        Otro: "blue-grey"            // Color neutral para otros tipos
      };
      
      // Retorna el color correspondiente o un color por defecto (primary)
      return colorMap[type] || "secondary";
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
            })
            .replace(/\./g, "");
      }
    },
    nextStep() {
      if (this.step < this.steps.length - 1) {
        this.step++;
      } else {
        this.save();
      }
    },
    openModal(imageUrl) {
      this.dialogPhoto = true;
      this.loadingImage = true;
      var img = new Image();
      img.src = `${this.$axios.defaults.baseURL}images/${imageUrl}`;

      img.onload = () => {
        this.selectedImageUrl = `${this.$axios.defaults.baseURL}images/${imageUrl}`;
        this.loadingImage = false;
        //this.dialogPhoto = true; // Abre el modal solo después de que la imagen esté cargada
      };

      img.onerror = () => {
        this.selectedImageUrl = "";
        this.dialogPhoto = false; // Abre el modal incluso si la carga falla, puede mostrar un mensaje de error o una imagen de respaldo
        this.loadingImage = false;
      };
    },
    formatNumber(value) {
      // Si el valor es menor que 1000, devuelve el valor original con dos decimales
      if (value < 1000) {
        return (Math.round((value + Number.EPSILON) * 100) / 100).toLocaleString(
          "en-US",
          { minimumFractionDigits: 2, maximumFractionDigits: 2 }
        );
      }

      // Primero, redondea el valor a dos decimales
      value = Math.round((value + Number.EPSILON) * 100) / 100;

      // Convierte el valor a cadena con formato de número local (en-US)
      let formattedValue = value.toLocaleString("en-US", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      });

      return formattedValue;
    },
    clearFields() {
      // Limpiar los valores de ingreso y gasto al cambiar el tipo
      this.editedItem.income = "";
      this.editedItem.spent = "";
      this.showType = !this.showType;
    },
    updateDate(val) {
      this.input = val;
      this.editedItem.date = this.dateFormatted;
      this.menu = false;
    },
    updateDate1(val) {
      this.input1 = val;
      this.editedItem.end = this.dateFormatted1;
      this.menu1 = false;
    },
    async showAdd() {
      this.showStatus = false;
      this.editedItem.home_id = this.home_id;
      this.editedIndex = -1;
      try {
        const result = await handleRequest({
          endpoint: "status-priority-type-apk",
          method: "POST",
          data: this.data,
        });

        if (result.success) {
          // Si la solicitud es exitosa, asignamos las sucursales
          this.priorities = result.data?.wishpriorities || [];
          this.types = result.data?.wishtype || [];
        } else {
          // Si no hay datos, asignamos un array vacío
          this.priorities = [];
          this.types = [];
          this.showAlert("info", result.message || "No hay datos disponibles.", 3000);
        }
      } catch (error) {
        this.showAlert("error", "Ocurrió un error inesperado al cargar los datos.", 3000);
      } finally {
        this.dialog = true;
      }
    },
    close() {
      this.dialog = false;
      this.showStatus = false;
      this.$nextTick(() => {
        this.editedItem = Object.assign({}, this.defaultItem);
        this.originalItem = Object.assign({}, this.defaultItem);
      });
      this.editedIndex = -1;
      this.file = null;
      this.imgMiniatura = "";
    },
    async initialize() {
      try {
        this.data = {};
        this.data.home_id = this.home_id;
        this.data.type = "Todas";
        this.loading = true;
        const result = await handleRequest({
          endpoint: "get-type-wishes",
          method: "POST",
          data: this.data,
        });

        if (result.success) {
          // Si la solicitud es exitosa, asignamos las sucursales
          this.wishes = result.data?.wishes || [];
          // Filtro 1: donde person_id sea igual a this.person_id y type sea igual a 'Personal'
          this.filteredPersonalWishes = this.wishes.filter(
            (wish) => wish.idType === "Personal"
          );

          // Filtro 2: donde home_id sea igual a this.home_id
          this.filteredHomeWishes = this.wishes.filter((wish) => wish.idType === "Hogar");

          // Filtro 3: donde home_id sea igual a this.home_id
          this.filteredProfessionalWishes = this.wishes.filter(
            (wish) => wish.idType === "Profesional"
          );
        } else {
          // Si no hay datos, asignamos un array vacío
          this.wishse = [];
        }
      } catch (error) {
        this.loading = false;
        // Captura de errores no controlados
        this.showAlert(
          "error",
          "Ocurrió un error inesperado al cargar los deseos.",
          3000
        );
      } finally {
        this.loading = false;
      }
    },
    async save() {
      this.loading = true;
      if (this.editedIndex === -1) {
        this.valid = false;
        const fieldsToUpdate = [
          "home_id",
          "name",
          "location",
          "end",
          "date",
          "description",
          "status_id",
          "priority_id",
          "parent_id",
          "type",
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
        if (Object.keys(updatedFields).length > 0) {
          updatedFields.date = this.editedItem.date
            ? this.editedItem.date
            : format(new Date(), "yyyy-MM-dd");
          updatedFields.end = this.editedItem.end
            ? this.editedItem.end
            : format(new Date(), "yyyy-MM-dd");
          updatedFields.home_id = this.editedItem.home_id;
          if (this.file) {
            updatedFields.image = this.editedItem.image;
          }

          try {
            const result = await handleRequest({
              endpoint: "wish",
              method: "POST",
              data: updatedFields,
            });

            // Manejo de la respuesta según el resultado
            if (result.success) {
              this.loading = false;
              this.showAlert("success", result.message, 3000);
              this.initialize();
            } else {
              this.close();
              this.loading = false;
              this.showAlert("warning", result.message, 3000);
            }
          } catch (error) {
            this.loading = false;
            this.close();
            // Este bloque captura errores inesperados fuera del manejo estándar
            this.showAlert(
              "error",
              "Ocurrió un error inesperado al procesar la solicitud.",
              3000
            );
          }
        } else {
          this.loading = false;
          this.close();
          this.showAlert("success", "Debe completar los datos de producto.", 3000);
        }
      } else {
        this.valid = false;
        const fieldsToUpdate = [
          "home_id",
          "name",
          "location",
          "end",
          "date",
          "description",
          "status_id",
          "priority_id",
          "parent_id",
          "type",
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
        if (Object.keys(updatedFields).length > 0) {
          updatedFields.id = this.editedItem.id;
          try {
            const result = await handleRequest({
              endpoint: "wish",
              method: "PUT",
              data: updatedFields,
            });

            // Manejo de la respuesta según el resultado
            if (result.success) {
              this.loading = false;
              this.showAlert("success", result.message, 3000);
              this.initialize();
            } else {
              this.close();
              this.loading = false;
              this.showAlert("warning", result.message, 3000);
            }
          } catch (error) {
            this.loading = false;
            this.close();
            // Este bloque captura errores inesperados fuera del manejo estándar
            this.showAlert(
              "error",
              "Ocurrió un error inesperado al procesar la solicitud.",
              3000
            );
          }
        } else {
          this.loading = false;
          this.close();
          this.showAlert("success", "No se realizaron cambios.", 3000);
        }
      }
      this.close();
    },
    async editItem(item) {
      this.editedIndex = 1;
      this.originalItem = Object.assign({}, item);
      this.editedItem = Object.assign({}, item);

      try {
        const result = await handleRequest({
          endpoint: "status-priority-type-apk",
          method: "POST",
          data: this.data,
        });

        if (result.success) {
          // Si la solicitud es exitosa, asignamos las sucursales
          this.priorities = result.data?.wishpriorities || [];
          this.types = result.data?.wishtype || [];
          this.status = result.data?.wishstatus || [];
        } else {
          // Si no hay datos, asignamos un array vacío
          this.priorities = [];
          this.types = [];
          this.status = [];
          this.showAlert("info", result.message || "No hay datos disponibles.", 3000);
        }
      } catch (error) {
        this.showAlert("error", "Ocurrió un error inesperado al cargar los datos.", 3000);
      } finally {
        this.dialog = true;
        this.showStatus = true;
      }
      /*this.file = null;
      // Crear la imagen y configurar el src
      const img = new Image();
      img.src = `${this.$axios.defaults.baseURL}images/${item.image}`; // Se asume que item.image_url es la URL de la imagen

      // Usar una función asíncrona para manejar la carga de la imagen
      img.onload = async () => {
        try {
          // Asignar la imagen cargada a imgMiniatura
          this.imgMiniatura = `${this.$axios.defaults.baseURL}images/${item.image}`;
        } catch (error) {
          console.error('Error al cargar la imagen', error);
          this.showAlert('error', 'Error al cargar la imagen.', 3000);
        }
      };*/
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
      });
    },
    async deleteItemConfirm() {
      try {
        let request = {
          id: this.editedItem.id,
        };
        const result = await handleRequest({
          endpoint: "wish-destroy",
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
        this.closeDelete();
      }
    },
    showAlert(sb_type, sb_message, sb_timeout) {
      this.sb_type = sb_type;

      if (sb_type == "success") {
        this.sb_title = "Éxito";
        this.sb_icon = "mdi-check-circle";
      }

      if (sb_type == "info") {
        this.sb_title = "Información";
        this.sb_icon = "mdi-alert-circle";
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
    /*imagenDisponible() {
      if (this.imgedit !== undefined && this.imgedit !== '') {
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
        this.valid = false;
        this.showAlert('warning', 'El archivo de imagen debe ser de máximo 500 KB', 3000);
        return; // Detener el proceso si el archivo es demasiado grande
      }
      this.valid = true;
      this.editedItem.image = file;
      //console.log(this.editedItem.image_cardgift);
      this.cargarImage(file);
    },
    cargarImage(file) {
      let reader = new FileReader();
      reader.onload = (e) => {
        this.imgMiniatura = e.target.result;
      }
      reader.readAsDataURL(file);
    },*/
  },
};
</script>

<style scoped>
.selected-tab {
  background-color: #03626c;
  /* Fondo del tab seleccionado */
  color: white;
  /* Texto blanco */
  border-radius: 4px;
  /* Esquinas redondeadas, opcional */
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

.modal-imagen {
  background: transparent !important;
  box-shadow: none !important;
}
</style>
