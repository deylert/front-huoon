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
      <!-- Encabezado con foto y datos -->
      <v-card-text>
        <v-row class="mb-4" align="center" no-gutters>
          <!-- Columna ícono + texto título: ocupando un ancho fijo o proporcional -->
          <v-col cols="12" sm="9" md="9" class="d-flex align-center">
            <v-avatar size="48" class="me-3" color="grey-lighten-4" variant="tonal">
              <v-icon color="green-darken-2">mdi-finance</v-icon>
            </v-avatar>
            <div>
              <div class="text-h6 font-weight-bold mb-1">
                {{ $t("finances.header.title") }}
              </div>
              <div class="text-body-2 text-grey-darken-1">
                {{ $t("finances.header.subtitle") }}
              </div>
            </div>
          </v-col>

          <!-- Columna de la tarjeta de sugerencia -->
          <v-col cols="12" sm="3" md="3">
            <v-card class="pa-3 d-flex align-center" elevation="1" rounded="lg">
              <v-avatar size="40" class="me-3" color="purple-lighten-4" variant="tonal">
                <v-icon color="purple">mdi-lightbulb-on-outline</v-icon>
              </v-avatar>
              <div>
                <div class="text-body-2 font-weight-medium">
                  {{ $t("finances.suggestions.title") }}
                </div>
                <div class="text-caption text-grey-darken-1">
                  {{
                    $t("finances.suggestions.alerts.message", alertasHoy, {
                      count: alertasHoy,
                    })
                  }}
                </div>
              </div>
            </v-card>
          </v-col>

          <v-menu offset-y location="right">
            <template #activator="{ props }">
              <v-btn
                v-bind="props"
                icon
                size="large"
                color="purple"
                class="ma-4"
                elevation="6"
                style="position: fixed; top: 40px; right: 260px"
              >
                <v-icon size="32">mdi-plus</v-icon>
              </v-btn>
            </template>

            <v-list rounded="lg">
              <v-list-item @click="this.showAddFinance()">
                <v-list-item-title class="text-green">
                  <v-icon start color="green">mdi-plus</v-icon>
                  {{ $t("finances.titles.new.finance") }}
                </v-list-item-title>
              </v-list-item>
              <!--<v-list-item @click="showAddSpent()">
                <v-list-item-title class="text-red">
                  <v-icon start color="red">mdi-minus</v-icon>
                  {{ $t("finances.titles.new.expense") }}
                </v-list-item-title>
              </v-list-item>-->
            </v-list>
          </v-menu>
        </v-row>

        <v-divider class="my-4" />
        <div class="text-body-2 font-weight-medium mb-2">
          {{ $t("summary.title") }} {{ formattedCurrentMonth }}
        </div>
        <v-row dense>
          <v-col cols="12" sm="3" md="3">
            <v-card
              class="pa-3 d-flex align-center"
              elevation="1"
              rounded="lg"
              @click="showIncome()"
            >
              <v-avatar
                size="40"
                class="me-3"
                :color="`${income.color}-lighten-4`"
                variant="tonal"
              >
                <v-icon :color="income.color">{{ income.icon }}</v-icon>
              </v-avatar>
              <div>
                <div class="text-body-2 font-weight-medium">
                  {{ $t("finances.fields.income") }}
                </div>
                <div class="text-subtitle-2">
                  <strong :class="`text-${income.color}`"
                    >${{ formatCurrency(income.current) }}</strong
                  >
                  <span v-if="parseFloat(income.percentage) > 0">
                    (+{{ income.percentage }}%)</span
                  >
                  <span v-else-if="parseFloat(income.percentage) < 0">
                    ({{ income.percentage }}%)</span
                  >
                </div>
                <div class="text-caption text-grey-darken-1">
                  vs <strong>${{ formatCurrency(income.lastMonth) }}</strong>
                  {{ $t("finances.comparison.lastMonth") }}
                </div>
              </div>
            </v-card>
          </v-col>

          <v-col cols="12" sm="3" md="3">
            <v-card
              class="pa-3 d-flex align-center"
              elevation="1"
              rounded="lg"
              @click="showSpent()"
            >
              <v-avatar
                size="40"
                class="me-3"
                :color="`${spent.color}-lighten-4`"
                variant="tonal"
              >
                <v-icon :color="spent.color">{{ spent.icon }}</v-icon>
              </v-avatar>
              <div>
                <div class="text-body-2 font-weight-medium">
                  {{ $t("finances.fields.spent") }}
                </div>
                <div class="text-subtitle-2">
                  <strong :class="`text-${spent.color}`"
                    >${{ formatCurrency(spent.current) }}</strong
                  >
                  <span v-if="parseFloat(spent.percentage) > 0">
                    (+{{ spent.percentage }}%)</span
                  >
                  <span v-else-if="parseFloat(spent.percentage) < 0">
                    ({{ spent.percentage }}%)</span
                  >
                </div>
                <div class="text-caption text-grey-darken-1">
                  vs <strong>${{ formatCurrency(spent.lastMonth) }}</strong>
                  {{ $t("finances.comparison.lastMonth") }}
                </div>
              </div>
            </v-card>
          </v-col>

          <v-col cols="12" sm="3" md="3">
            <v-card class="pa-3 d-flex align-center" elevation="1" rounded="lg">
              <v-avatar
                size="40"
                class="me-3"
                :color="`${balance.color}`"
                variant="tonal"
              >
                <v-icon :color="balance.color">{{ balance.icon }}</v-icon>
              </v-avatar>
              <div>
                <div class="text-body-2 font-weight-medium">
                  {{ $t("finances.sections.balance") }}
                </div>
                <div class="text-subtitle-2">
                  <strong class="text-blue"
                    >${{ formatCurrency(balance.current) }}</strong
                  >
                </div>
                <div class="text-caption text-grey-darken-1">
                  {{ $t("finances.fields.income") }} - {{ $t("finances.fields.spent") }}
                  {{ $t("finances.comparison.thisMonth") }}
                </div>
              </div>
            </v-card>
          </v-col>

          <v-col cols="12" sm="3" md="3">
            <v-card class="pa-3 d-flex align-center" elevation="1" rounded="lg">
              <v-avatar size="40" class="me-3" color="amber-lighten-4" variant="tonal">
                <v-icon color="amber-darken-2">mdi-calendar-clock</v-icon>
              </v-avatar>
              <div>
                <div class="text-body-2 font-weight-medium">
                  {{ $t("finances.sections.movements") }}
                </div>

                <div class="text-subtitle-2">
                  <strong class="text-amber">${{ formatCurrency(movent.total) }}</strong>
                  {{ $t("finances.comparison.thisMonth") }}
                </div>

                <!-- Tooltip con truncado -->
                <v-tooltip location="top">
                  <template v-slot:activator="{ props }">
                    <div
                      class="text-caption text-grey-darken-1 d-flex align-center text-truncate"
                      v-bind="props"
                      style="max-width: 220px"
                    >
                      <v-icon size="14" class="me-1" color="grey"> {{ movent.lastMovement?.icon }} </v-icon>
                      ${{ movent.lastMovement?.amount ? formatCurrency(movent.lastMovement.amount) : '0' }}
      {{ movent.lastMovement?.description }}
                    </div>
                  </template>
                  <span>
                  {{ movent.lastMovement?.description }}
                  </span>
                </v-tooltip>
              </div>
            </v-card>
          </v-col>
        </v-row>

        <v-divider class="my-4" />

        <div class="text-body-2 font-weight-medium mb-2">
          {{ $t("finances.sections.suggestions") }}
        </div>

        <v-row>
          <v-col>
            <v-card
              v-for="(financeTask, index) in suggestions"
              :key="index"
              class="mb-3 rounded-lg"
              elevation="2"
              :class="{ 'smooth-hover': true }"
            >
              <v-row no-gutters class="ma-0">
                <!-- Fecha -->
                <v-col cols="1" class="pa-4 d-flex flex-column align-center">
                  <div class="date">{{ formatDate(financeTask.date) }}</div>
                </v-col>

                <!-- Contenido principal -->
                <v-col cols="7" class="d-flex align-center pe-4 gap-2">
                  <v-row align="center" no-gutters>
                    <v-icon
                      class="me-2"
                      :color="financeTask.source === 'ia' ? 'deep-purple' : 'blue'"
                      size="24"
                    >
                      {{ financeTask.source === "ia" ? "mdi-brain" : "mdi-finance" }}
                    </v-icon>
                    <div>
                      <div class="font-weight-semibold text-body-1">
                        {{ financeTask.title }}
                      </div>
                      <div class="text-caption text-grey-darken-1">
                        {{ financeTask.description }}
                      </div>
                    </div>
                  </v-row>
                </v-col>

                <!-- Estado -->
                <v-col cols="2" class="d-flex align-center justify-end pe-4">
                  <v-chip
                    :color="getFinanceStatusColor(financeTask.status)"
                    size="small"
                    variant="tonal"
                  >
                    {{ getTranslatedStatusName(financeTask.status) }}
                  </v-chip>
                </v-col>

                 <v-col cols="2" class="d-flex align-center justify-end pe-4 gap-2">
                  <div>
    <!-- Tu contenido actual de la tarjeta -->
    <v-btn
      variant="text"
      size="small"
      color="primary"
      @click="openChatbot(financeTask)"
    >
      {{ $t('buttons.seeMore') }}
    </v-btn>

    <!-- Componente del chatbot -->
    <ChatTaskDialog
      v-model="chatDialog"
      :suggestion="currentTask"
      @completed="handleTaskCompleted"
    />
  </div>
                </v-col>
              </v-row>
            </v-card>
          </v-col>
        </v-row>
      </v-card-text>
    </v-card>
  </v-container>
  <!--dialogo de ingresos-->
  <v-dialog v-model="dialogIncome" fullscreen transition="dialog-bottom-transition">
    <v-card>
      <v-card-text>
        <!-- Aquí pasamos el 'selectedWorker' al componente dentro del diálogo -->
        <Income />
      </v-card-text>
      <v-divider></v-divider>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn text @click="close">Cerrar</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>

  <!--dialogo de gastos-->
  <v-dialog v-model="dialogSpent" fullscreen transition="dialog-bottom-transition">
    <v-card>
      <v-card-text>
        <!-- Aquí pasamos el 'selectedWorker' al componente dentro del diálogo -->
        <Spent />
      </v-card-text>
      <v-divider></v-divider>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn text @click="close">Cerrar</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>

  <v-dialog
    v-model="dialogAddFinance"
    fullscreen
    persistent
    transition="dialog-bottom-transition"
    content-class="fullscreen-dialog"
  >
    <v-form ref="form" v-model="valid" class="h-100">
      <v-card class="pa-10">
        <v-card-text class="pt-12">
          <p :class="[isIncome ? 'text-green' : 'text-red', 'text-grey-lighten-1']">
            {{
              isIncome
                ? $t("finances.formInstructions.income")
                : $t("finances.formInstructions.expense")
            }}
          </p>

          <v-row class="mt-12">
            <!-- Side steps -->
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
                      <strong>{{ $t(`finances.steps.${s.title}.title`) }}</strong>
                      <div class="text-caption text-grey">
                        {{ $t(`finances.steps.${s.title}.subtitle`) }}
                      </div>
                    </div>
                  </template>
                </v-timeline-item>
              </v-timeline>
            </v-col>

            <!-- Contenido dinámico según paso -->
            <v-col cols="9">
              <h3 class="text-deep-purple-accent-3 mb-8">
                {{ $t(`finances.steps.${steps[step].title}.title`) }}
              </h3>

              <!-- Paso 1: Detalles del ingreso -->
              <v-row dense v-if="step === 0">

                <v-col cols="12" sm="12">
                  <v-switch
                    v-model="isIncome"
                    inset
                    hide-details
                    :label="''"
                    :base-color="isIncome ? 'green' : 'red'"
                    :color="isIncome ? 'green' : 'red'"
                    class="mb-4 font-weight-bold"
                  >
                    <template #label>
                      <span :class="isIncome ? 'text-green' : 'text-red'">
                        {{
                          isIncome
                            ? $t("finances.fields.income")
                            : $t("finances.fields.spent")
                        }}
                      </span>
                    </template>
                  </v-switch>
                </v-col>

                <v-col cols="12" sm="6">
                  <v-autocomplete
                    v-model="editedItem.type"
                    :items="types"
                    :label="$t('finances.fields.type')"
                    item-title="name"
                    item-value="id"
                    variant="underlined"
                    :rules="typeRules"
                  >
                    <template v-slot:item="{ props, item }">
                      <v-list-item v-bind="props">
                        <v-list-item-subtitle class="d-flex flex-column">
                          <v-tooltip bottom>
                            <template v-slot:activator="{ props: tooltipProps }">
                              <div
                                class="truncate"
                                v-bind="tooltipProps"
                                style="
                                  white-space: nowrap;
                                  overflow: hidden;
                                  text-overflow: ellipsis;
                                "
                              >
                                {{ item.raw.description }}
                              </div>
                            </template>
                            <span>{{ item.raw.description }}</span>
                          </v-tooltip>
                        </v-list-item-subtitle>
                      </v-list-item>
                    </template>
                  </v-autocomplete>
                </v-col>

                <v-col cols="12" sm="6">
                  <v-text-field
                    v-if="isIncome"
                    v-model="editedItem.income"
                    :label="$t('finances.fields.income')"
                    variant="underlined"
                    type="number"
                    step="0.01"
                    :rules="incomeRules"
                    required
                    :color="'green'"
                  />
                  <v-text-field
                    v-else
                    v-model="editedItem.spent"
                    :label="$t('finances.fields.spent')"
                    variant="underlined"
                    type="number"
                    step="0.01"
                    :rules="incomeRules"
                    required
                    :color="'red'"
                  />
                </v-col>

                <v-col cols="12" md="6">
                  <v-file-input
                    v-model="file"
                    ref="fileInput"
                    :label="$t('finances.fields.attach_file')"
                    variant="underlined"
                    name="file"
                    accept=".png, .jpg, .jpeg"
                    @change="onFileSelected"
                    :prepend-icon="false"
                  ></v-file-input>
                </v-col>
                <v-col cols="12" md="6">
                  <v-card elevation="6" class="mx-auto" max-width="210" max-height="120">
                    <img
                      v-if="imagenDisponible() && this.showImage"
                      :src="imgedit"
                      height="120"
                      :label="$t('finances.fields.file')"
                      width="210"
                    />
                    <v-icon
                      v-else
                      class="d-flex align-center justify-center"
                      style="height: 120px; width: 210px; font-size: 120px"
                      >{{ this.icono }}</v-icon
                    >
                  </v-card>
                </v-col>
              </v-row>

              <!-- Step 2: Descripción y fecha -->
              <v-row dense v-if="step === 1">
                <v-col cols="12">
                  <v-textarea
                    v-model="editedItem.description"
                    :label="$t('finances.fields.description')"
                    variant="underlined"
                    rows="3"
                    auto-grow
                    :rules="descriptionRules"
                  />
                </v-col>

                <v-col cols="12">
                  <v-menu
                    v-model="dateMenu"
                    :close-on-content-click="false"
                    transition="scale-transition"
                    offset-y
                    min-width="auto"
                  >
                    <template v-slot:activator="{ props }">
                      <v-text-field
                        v-bind="props"
                        :model-value="dateInput"
                        :label="$t('finances.fields.date')"
                        variant="underlined"
                        readonly
                      ></v-text-field>
                    </template>
                    <v-date-picker
                      color="#03626C"
                      :model-value="parseDateString(dateInput)"
                      @update:model-value="updateDate"
                    ></v-date-picker>
                  </v-menu>
                </v-col>
              </v-row>

              <!-- Navegación -->
              <div class="d-flex justify-space-between mt-8">
                <v-btn
                  variant="text"
                  class="text-grey-darken-1"
                  @click="step > 0 ? step-- : this.closeDialogFinances()"
                >
                  {{ step === 0 ? $t("buttons.close") : $t("buttons.previous") }}
                </v-btn>

                <v-btn
                  variant="text"
                  class="text-deep-purple-accent-3"
                  @click="nextStep"
                  :disabled="!valid"
                >
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

  <v-dialog
    v-model="dialogAddSpent"
    fullscreen
    persistent
    transition="dialog-bottom-transition"
    content-class="fullscreen-dialog"
  >
    <v-form ref="form" v-model="valid" class="h-100">
      <v-card class="pa-10">
        <v-card-text class="pt-12">
          <p class="text-grey-lighten-1">
            {{ $t("finances.formInstructions.expense") }}
          </p>

          <v-row class="mt-12">
            <!-- Side steps -->
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
                      <strong>{{ $t(`finances.steps.${s.title}.title`) }}</strong>
                      <div class="text-caption text-grey">
                        {{ $t(`finances.steps.${s.title}.subtitle`) }}
                      </div>
                    </div>
                  </template>
                </v-timeline-item>
              </v-timeline>
            </v-col>

            <!-- Contenido dinámico según paso -->
            <v-col cols="9">
              <h3 class="text-deep-purple-accent-3 mb-8">
                {{ $t(`finances.steps.${steps[step].title}.title`) }}
              </h3>

              <!-- Paso 1: Detalles del ingreso -->
              <v-row dense v-if="step === 0">
                <v-col cols="12" sm="6">
                  <v-autocomplete
                    v-model="editedItem.type"
                    :items="types"
                    :label="$t('finances.fields.type')"
                    item-title="name"
                    item-value="id"
                    variant="underlined"
                    :rules="typeRules"
                  >
                    <template v-slot:item="{ props, item }">
                      <v-list-item v-bind="props">
                        <v-list-item-subtitle class="d-flex flex-column">
                          <v-tooltip bottom>
                            <template v-slot:activator="{ props: tooltipProps }">
                              <div
                                class="truncate"
                                v-bind="tooltipProps"
                                style="
                                  white-space: nowrap;
                                  overflow: hidden;
                                  text-overflow: ellipsis;
                                "
                              >
                                {{ item.raw.description }}
                              </div>
                            </template>
                            <span>{{ item.raw.description }}</span>
                          </v-tooltip>
                        </v-list-item-subtitle>
                      </v-list-item>
                    </template>
                  </v-autocomplete>
                </v-col>

                <v-col cols="12" sm="6">
                  <v-text-field
                    v-model="editedItem.spent"
                    :label="$t('finances.fields.spent')"
                    variant="underlined"
                    type="number"
                    step="0.01"
                    :rules="incomeRules"
                    required
                  />
                </v-col>

                <v-col cols="12" md="6">
                  <v-file-input
                    v-model="file"
                    ref="fileInput"
                    :label="$t('finances.fields.attach_file')"
                    variant="underlined"
                    name="file"
                    accept=".png, .jpg, .jpeg"
                    @change="onFileSelected"
                    :prepend-icon="false"
                  ></v-file-input>
                </v-col>
                <v-col cols="12" md="6">
                  <v-card elevation="6" class="mx-auto" max-width="210" max-height="120">
                    <img
                      v-if="imagenDisponible() && this.showImage"
                      :src="imgedit"
                      height="120"
                      :label="$t('finances.fields.file')"
                      width="210"
                    />
                    <v-icon
                      v-else
                      class="d-flex align-center justify-center"
                      style="height: 120px; width: 210px; font-size: 120px"
                      >{{ this.icono }}</v-icon
                    >
                  </v-card>
                </v-col>
              </v-row>

              <!-- Step 2: Descripción y fecha -->
              <v-row dense v-if="step === 1">
                <v-col cols="12">
                  <v-textarea
                    v-model="editedItem.description"
                    :label="$t('finances.fields.description')"
                    variant="underlined"
                    rows="3"
                    auto-grow
                    :rules="descriptionRules"
                  />
                </v-col>

                <v-col cols="12">
                  <v-menu
                    v-model="dateMenu"
                    :close-on-content-click="false"
                    transition="scale-transition"
                    offset-y
                    min-width="auto"
                  >
                    <template v-slot:activator="{ props }">
                      <v-text-field
                        v-bind="props"
                        :model-value="dateInput"
                        :label="$t('finances.fields.date')"
                        variant="underlined"
                        readonly
                      ></v-text-field>
                    </template>
                    <v-date-picker
                      color="#03626C"
                      :model-value="parseDateString(dateInput)"
                      @update:model-value="updateDate"
                    ></v-date-picker>
                  </v-menu>
                </v-col>
              </v-row>

              <!-- Navegación -->
              <div class="d-flex justify-space-between mt-8">
                <v-btn
                  variant="text"
                  class="text-grey-darken-1"
                  @click="step > 0 ? step-- : this.closeDialogSpents()"
                >
                  {{ step === 0 ? $t("buttons.close") : $t("buttons.previous") }}
                </v-btn>

                <v-btn
                  variant="text"
                  class="text-deep-purple-accent-3"
                  @click="nextStep"
                  :disabled="!valid"
                >
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
</template>

<script>
import LocalStorageService from "@/LocalStorageService";
import { handleRequest } from "@/utils/api"; // Ruta al archivo
import Income from "./Income.vue";
import Spent from "./Spent.vue";
import ChatTaskDialog from './ChatTaskDialog.vue';
import _ from "lodash";
export default {
  components: {
    Income,
    Spent,
    ChatTaskDialog
  },
  data() {
    return {
      chatDialog: false,
      currentTask: null,
      selectedSuggestion: null,
      dialogIncome: false,
      dialogSpent: false,
      dialogAddFinance: false,
      dialogAddSpent: false,
      isIncome: true,
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
      file: null,
      showImage: false,
      icono: "mdi-file",
      imgMiniatura: "",
      step: 0,
      steps: [
        {
          title: "financialDetails",
          subtitle: "basic_information",
        },
        {
          title: "description",
          subtitle: "additional_details",
        },
      ],
      financeSuggestions: [
        {
          id: 1,
          title: "Revisa gasto en delivery",
          description:
            "Este mes gastaste $85.000 en pedidos, un 20% más que el anterior.",
          due_date: "2025-06-30",
          due_time: "09:00",
          status: "pendiente",
        },
        {
          id: 2,
          title: "Agrega gasto de luz",
          description: "No se ha registrado el gasto de electricidad este mes.",
          due_date: "2025-06-28",
          due_time: "12:00",
          status: "pendiente",
        },
        {
          id: 3,
          title: "Superaste presupuesto en transporte",
          description: "Gastos en transporte sobrepasan el límite definido por $40.000.",
          due_date: "2025-06-29",
          due_time: "18:00",
          status: "revisado",
        },

        // 🔮 Sugerencias generadas por IA
        {
          id: 4,
          title: "Podrías reducir el plan de streaming",
          description:
            "Pagas $18.000 al mes por plataformas que no se usan regularmente.",
          due_date: "2025-06-30",
          due_time: "14:00",
          status: "pendiente",
          source: "ia",
        },
        {
          id: 5,
          title: "Considera un presupuesto para vacaciones",
          description:
            "Según tus hábitos, un ahorro mensual de $50.000 permitiría viajar en verano.",
          due_date: "2025-07-01",
          due_time: "11:00",
          status: "pendiente",
          source: "ia",
        },
      ],

      filtrosActivos: false,
      filtroDesde: "",
      filtroHasta: "",
      filtroTipo: "",
      filtroEstado: "",
      filtroTexto: "",
      filtroActivo: "todos",
      filtroActivo2: "",
      cards: [
        {
          title: "Ingresos",
          icon: "mdi-cash-multiple",
          amount: "$138,500",
          lastMonth: "$128,000",
          change: "+8.20",
          changeColor: "green-lighten-4",
          changeIcon: "mdi-arrow-up",
          color: "green",
        },
        {
          title: "Gastos",
          icon: "mdi-cash-minus",
          amount: "$97,400",
          lastMonth: "$94,800",
          change: "+2.74",
          changeColor: "red-lighten-4",
          changeIcon: "mdi-arrow-up",
          color: "red",
        },
        {
          title: "Balance",
          icon: "mdi-scale-balance",
          amount: "$41,100",
          lastMonth: "$47,750",
          change: "-13.92",
          changeColor: "blue-lighten-4",
          changeIcon: "mdi-arrow-down",
          color: "blue",
        },
      ],
      modal: false,
      tipoModal: "ingreso",
      nuevo: {
        titulo: "",
        monto: null,
        categoria: "",
        fecha: "",
      },
      categorias: [
        "Alimentación",
        "Transporte",
        "Servicios",
        "Educación",
        "Salud",
        "Otros",
      ],
      transacciones: [
        { titulo: "Sueldo Juan", monto: 1200000, tipo: "ingreso", fecha: "2025-06-01" },
        { titulo: "Supermercado", monto: 95000, tipo: "gasto", fecha: "2025-06-05" },
        { titulo: "Gas", monto: 23000, tipo: "gasto", fecha: "2025-06-08" },
      ],
      loadingImage: false,
      selectedImageUrl: "",
      dateMenu: false,
      dateInput: null,
      editedItem: {
        id: "",
        type: "",
        method: "",
        income: null,
        spent: null,
        description: "",
        date: null,
        image: null,
      },
      defaultItem: {
        id: "",
        type: "",
        method: "",
        income: null,
        spent: null,
        description: "",
        date: null,
        image: null,
      },
      originalItem: {
        id: "",
        type: "",
        method: "",
        income: null,
        spent: null,
        description: "",
        date: null,
        image: null,
      },
      editedItemTask: {
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
      editedIndex: -1,
      search: "",
      types: [],
      home_id: "",
      suggestions: [],
      statusuggestions: [],
      movent: {},
      finances: {
        incomeCard: {
          current: "0",
          percentage: "0.00",
          lastMonth: "0",
          color: "green",
          icon: "mdi-cash",
        },
        spentCard: {
          current: "0",
          percentage: "0.00",
          lastMonth: "0",
          color: "red",
          icon: "mdi-cart",
        },
        balanceCard: {
          current: "0",
          color: "blue-darken-2",
          icon: "mdi-scale-balance",
        },
        movementsCard: {
          total: "0",
          lastMovement: {
            amount: "0",
            description: "No hay movimientos",
            icon: "mdi-cash",
            type: "income",
          },
          color: "amber-darken-2",
          icon: "mdi-calendar-clock",
        },
      },
      income: {},
      spent: {},
      balance: {},
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
    };
  },
  computed: {
    formattedCurrentMonth() {
      const date = new Date();
      return date.toLocaleDateString(this.$vuetify.locale.current, {
        month: "long",
        year: "numeric",
      });
    },
    typeRules() {
      return [
        (v) => !!v || this.$t("finances.validationMessages.type.required"), // Validación de requerido
        (v) =>
          !v || v.length <= 50 || this.$t("finances.validationMessages.type.maxLength"), // Validación de longitud máxima
      ];
    },
    methodRules() {
      return [
        (v) =>
          !v || v.length <= 50 || this.$t("finances.validationMessages.method.maxLength"),
      ];
    },
    incomeRules() {
      return [
        (v) =>
          v === null ||
          v === "" ||
          !isNaN(v) ||
          this.$t("finances.validationMessages.income.number"),
        (v) =>
          v === null ||
          v === "" ||
          /^-?\d+(\.\d{1,2})?$/.test(v) ||
          this.$t("finances.validationMessages.income.precision"),
      ];
    },
    spentRules() {
      return [
        (v) =>
          v === null ||
          v === "" ||
          !isNaN(v) ||
          this.$t("finances.validationMessages.spent.number"),
        (v) =>
          v === null ||
          v === "" ||
          /^-?\d+(\.\d{1,2})?$/.test(v) ||
          this.$t("finances.validationMessages.spent.precision"),
      ];
    },
    descriptionRules() {
      return [
        (v) =>
          !v ||
          v.length <= 255 ||
          this.$t("finances.validationMessages.description.maxLength"),
      ];
    },
    dateRules() {
      return [(v) => !!v || this.$t("finances.validationMessages.date.required")];
    },
    formTitle() {
      return this.editedIndex === -1
        ? this.$t("consultations.titles.new")
        : this.$t("consultations.titles.edit");
    },
    imgedit() {
      return this.imgMiniatura;
    },
  },
  mounted() {
    this.person_id = JSON.parse(LocalStorageService.getItem("person_id"));
    this.home_id = JSON.parse(LocalStorageService.getItem("home_id"));
    this.initialize();
  },
  methods: {
    openChatbot(task) {
     this.chatDialog = false;
  this.currentTask = null;
  this.$nextTick(() => {
    this.currentTask = task;
    this.chatDialog = true;
  });
    },
    async handleTaskCompleted(taskData) {
      console.log('Tarea completada:', taskData);
      this.editedItemTask = _.cloneDeep(taskData);
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
        let updatedFields = Object.keys(this.editedItemTask)
          .filter(
            (key) =>
              fieldsToUpdate.includes(key) &&
              this.editedItemTask[key] !== this.originalItem[key]
          )
          .reduce((obj, key) => {
            if (key === "people") {
              // Transformar el campo `people`
              obj[key] = this.editedItemTask.people.map((person) => ({
                home_id: Number(this.home_id), // Asegurar que sea un número
                person_id: Number(person.id), // Asegurar que sea un número
                role_id: Number(person.roleId),
                roleName: person.roleName
              }));
            } else {
              obj[key] = this.editedItemTask[key];
            }
            return obj;
          }, {});

        // Agregar campos adicionales si es necesario
        if (Object.keys(updatedFields).length > 0) {
          updatedFields.home_id = this.home_id;
          updatedFields.start_date = this.editedItemTask.start_date
            ? this.editedItemTask.start_date
            : `${new Date().getFullYear()}-${String(new Date().getMonth() + 1).padStart(
              2,
              "0"
            )}-${String(new Date().getDate()).padStart(2, "0")}`;
          updatedFields.estimated_time = this.editedItemTask.estimated_time
            ? this.editedItemTask.estimated_time
            : 0;
          updatedFields.type = this.editedItemTask.type ? this.editedItemTask.type : "Tarea";

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
      // Aquí puedes enviar los datos a tu API o hacer lo que necesites
      this.chatDialog = false;
    },
    getTranslatedStatusName(status) {
      const match = this.statusuggestions.find((s) => s.id === status);
      return match ? match.name : status;
    },
    updateDate(value) {
      // value viene como objeto Date desde el date-picker
      // Convertimos a formato YYYY-MM-DD
      const year = value.getFullYear();
      const month = String(value.getMonth() + 1).padStart(2, "0");
      const day = String(value.getDate()).padStart(2, "0");
      this.dateInput = `${year}-${month}-${day}`;
      this.editedItem.date = this.dateInput;
      this.dateMenu = false;
    },

    // Método para convertir string a Date (solo cuando sea necesario)
    parseDateString(dateString) {
      if (!dateString) return null;
      const [year, month, day] = dateString.split("-");
      return new Date(year, month - 1, day);
    },
    getFinanceStatusColor(status) {
      switch (status) {
        case "Pendiente":
          return "orange";
        case "Revisado":
          return "blue";
        case "Completado":
          return "green";
        default:
          return "grey";
      }
    },

    /*openModal(imageUrl) {
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
        this.selectedImageUrl = '';
        this.dialogPhoto = false; // Abre el modal incluso si la carga falla, puede mostrar un mensaje de error o una imagen de respaldo
        this.loadingImage = false;
      };
    },*/
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

    formatCurrency(value) {
      // Primero reemplaza los puntos (separadores de miles) si existen
      const numericValue =
        typeof value === "string"
          ? parseFloat(value.replace(/\./g, "").replace(",", "."))
          : value;

      return new Intl.NumberFormat("es-CO", {
        style: "decimal",
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
      }).format(numericValue || 0);
    },
    clearFields() {
      // Limpiar los valores de ingreso y gasto al cambiar el tipo
      this.editedItem.income = "";
      this.editedItem.spent = "";
      this.showType = !this.showType;
    },

    editFinanceTask(task) {
      // lógica para editar la tarea
      console.log("Editar", task);
    },

    deleteFinanceTask(task) {
      // lógica para eliminar la tarea
      console.log("Eliminar", task);
    },

    formatDate(dateStr) {
      const options = { day: "2-digit", month: "short" };
      const date = new Date(dateStr);
      return date.toLocaleDateString("es-CL", options);
    },

    resetFiltros() {
      this.filtroDesde = "";
      this.filtroHasta = "";
      this.filtroTipo = "";
      this.filtroEstado = "";
      this.filtroTexto = "";
    },
    aplicarFiltros() {
      console.log("Aplicando filtros:", {
        desde: this.filtroDesde,
        hasta: this.filtroHasta,
        tipo: this.filtroTipo,
        estado: this.filtroEstado,
        texto: this.filtroTexto,
      });
      this.filtrosActivos = false;
    },
    abrirModal(tipo) {
      this.tipoModal = tipo;
      this.nuevo = { titulo: "", monto: null, categoria: "", fecha: "" };
      this.modal = true;
    },
    guardarTransaccion() {
      if (this.nuevo.titulo && this.nuevo.monto && this.nuevo.fecha) {
        this.transacciones.unshift({
          ...this.nuevo,
          tipo: this.tipoModal,
        });
        this.modal = false;
      }
    },
    async initialize() {
      try {
        this.data = {};
        this.data.home_id = this.home_id;
        //this.data.type = 'Todas';
        this.loading = true;
        const result = await handleRequest({
          endpoint: "finance-statistics-month",
          method: "POST",
          data: this.data,
        });

        if (result.success) {
          // Si la solicitud es exitosa, asignamos las sucursales
          this.income = result.data?.incomeCard || [];
          this.spent = result.data?.spentCard || [];
          this.balance = result.data?.balanceCard || [];
          this.suggestions = result.data?.suggestions || [];
          this.statusuggestions = result.data?.statusuggestions || [];
          this.movent = result.data?.movementsCard || {};
          console.log("movent:", this.movent);
        } else {
          // Si no hay datos, asignamos un array vacío
          this.spent = [];
          this.income = [];
          this.balance = [];
          this.suggestions = [];
          this.movent = {};
          this.statusuggestions = [];
          //this.showAlert('info', 'No hay finanzas disponibles.', 3000);
        }
      } catch (error) {
        this.loading = false;
        // Captura de errores no controlados
        this.showAlert(
          "error",
          "Ocurrió un error inesperado al cargar las finanzas.",
          3000
        );
      } finally {
        this.loading = false;
      }
    },

    nextStep() {
      if (this.step < this.steps.length - 1) {
        this.step++;
      } else {
        this.dialogIncome = false;
        this.dialogSpent = false;
        this.step = 0;
        this.save();
      }
    },
    //Ingresos
    showIncome() {
      this.dialogIncome = true;
    },
    showSpent() {
      this.dialogSpent = true;
    },
    close() {
      this.dialogIncome = false;
      this.dialogSpent = false;
    },
    async showAddFinance() {
      this.editedIndex = 1;
      this.editedItem = Object.assign({}, this.defaultItem);
      this.originalItem = Object.assign({}, this.defaultItem);
      this.file = null;
      this.imgMiniatura = "";
      try {
        const result = await handleRequest({
          endpoint: "get-finances-data",
          method: "POST",
        });

        if (result.success) {
          this.types = result.data?.types || [];
        } else {
          this.types = [];
        }
      } catch (error) {
        this.showAlert(
          "error",
          "Ocurrió un error inesperado al cargar los tipos de consulta.",
          3000
        );
      } finally {
        this.dialogAddFinance = true; // Abrimos el diálogo
      }
      this.dialogAddFinance = true; // Abrimos el diálogo
    },
    closeDialogFinances() {
      this.dialogAddFinance = false; // Cerramos el diálogo
      this.$nextTick(() => {
        this.editedItem = Object.assign({}, this.defaultItem);
        this.originalItem = Object.assign({}, this.defaultItem);
      });
      this.editedIndex = -1;
      this.file = null;
      this.imgMiniatura = "";
      this.initialize();
    },

    //Gastos
    async showAddSpent() {
      this.editedIndex = 2;
      this.editedItem = Object.assign({}, this.defaultItem);
      this.originalItem = Object.assign({}, this.defaultItem);
      this.file = null;
      this.imgMiniatura = "";
      try {
        const result = await handleRequest({
          endpoint: "get-finances-data",
          method: "POST",
        });

        if (result.success) {
          this.types = result.data?.types || [];
        } else {
          this.types = [];
        }
      } catch (error) {
        this.showAlert(
          "error",
          "Ocurrió un error inesperado al cargar los tipos de consulta.",
          3000
        );
      } finally {
        this.dialogAddSpent = true; // Abrimos el diálogo
      }
      this.dialogAddSpent = true; // Abrimos el diálogo
    },
    closeDialogSpents() {
      this.dialogAddSpent = false; // Cerramos el diálogo
      this.$nextTick(() => {
        this.editedItem = Object.assign({}, this.defaultItem);
        this.originalItem = Object.assign({}, this.defaultItem);
      });
      this.editedIndex = -1;
      this.file = null;
      this.imgMiniatura = "";
      this.initialize();
    },
    async save() {
      this.loading = true;

      this.valid = false;
      const fieldsToUpdate = [
        "home_id",
        "spent",
        "income",
        "image",
        "date",
        "description",
        "image",
        "type",
        "method",
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
        updatedFields.date = this.editedItem.date ? this.editedItem.date : new Date();
        updatedFields.home_id = Number(this.home_id);
        if (this.file) {
          updatedFields.image = this.editedItem.image;
        }
        const formData = new FormData();
        for (let key in updatedFields) {
          formData.append(key, updatedFields[key]);
        }

        try {
          const result = await handleRequest({
            endpoint: "finance",
            method: "POST",
            data: formData,
          });

          // Manejo de la respuesta según el resultado
          if (result.success) {
            this.loading = false;
            this.showAlert("success", result.message, 3000);
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
        this.showAlert("success", "Debe completar los datos de producto.", 3000);
      }
      /*if (this.editedIndex === 1) {
        this.closeDialogIncomes();
      } else if (this.editedIndex === 2) {
        this.closeDialogSpents();
      }*/
      this.closeDialogFinances();
    },

    imagenDisponible() {
      if (this.imgedit !== undefined && this.imgedit !== "") {
        let img = new Image();
        img.src = this.imgedit;
        return true;
      }
      return false;
    },

    onFileSelected(event) {
      this.imgMiniatura = "";
      let file = event.target.files[0];
      const maxSize = 500 * 1024; // 500 KB en bytes

      if (file && file.size > maxSize) {
        this.valid = false;
        this.showAlert("warning", "El archivo de imagen debe ser de máximo 500 KB", 3000);
        return;
      }

      const mimeType = file.type;
      const extension = file.name.split(".").pop().toLowerCase();
      const imageExtensions = ["jpg", "jpeg", "png", "gif"];

      if (
        (mimeType.startsWith("image/") || imageExtensions.includes(extension)) &&
        imageExtensions.includes(extension)
      ) {
        this.cargarImage(file);
        this.showImage = true;
      } else {
        this.showImage = false;
        this.icono = "mdi-file";
      }

      this.valid = true;
      this.editedItem.image = file;
    },

    cargarImage(file) {
      let reader = new FileReader();
      reader.onload = (e) => {
        this.imgMiniatura = e.target.result;
      };
      reader.readAsDataURL(file);
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
  },
};
</script>

<style scoped>
.text-green {
  color: #2e7d32;
}

.text-red {
  color: #c62828;
}

.text-blue {
  color: #1565c0;
}
</style>
