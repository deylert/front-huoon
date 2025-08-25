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
  <!--<v-container style="min-width: 100%; min-height: 100%;">-->
    <v-card elevation="6" class="mx-2">
      <v-toolbar color="#03626C">
        <v-row align="center">
          <v-col cols="12" md="8" class="grow ml-4">
            <span class="text-subtitle-1"><strong>Finanzas</strong></span>
          </v-col>
          <v-col cols="12" md="3" class="text-right">
            <v-btn class="text-subtitle-1 ml-12" color="white" variant="tonal" elevation="2"
              prepend-icon="mdi-plus-circle" @click="showAdd">
              Agregar Finanza
            </v-btn>
          </v-col>
        </v-row>
      </v-toolbar>

      <v-card-text>
        <v-tabs v-model="tab" vertical>
          <v-tab value="personal" :class="tab === 'personal' ? 'selected-tab' : ''">Personales</v-tab>
          <v-tab value="hogar" :class="tab === 'hogar' ? 'selected-tab' : ''">Hogar</v-tab>
          <v-tab value="todas" :class="tab === 'todas' ? 'selected-tab' : ''">Todas</v-tab>
        </v-tabs>

        <v-window v-model="tab" min-height="50vh" class="mt-2">
          <v-window-item value="personal">
            <v-text-field class="mt-1 mb-1" v-model="search" append-icon="mdi-magnify" label="Buscar" single-line
              hide-details>
            </v-text-field>
            <v-data-table :headers="headers" :search="search" :items="filteredPersonalFinances" class="elevation-1"
              style="max-height: 68vh; overflow-y: auto;" :items-per-page-text="'Elementos por páginas'"
              no-data-text="No hay datos disponibles" :loading="loading" loading-text="Cargando datos...">
              <template v-slot:item.actions="{ item }">
                <v-btn density="comfortable" icon="mdi-pencil" @click="editItem(item)" color="#1976D2" variant="tonal"
                  elevation="1" title="Editar Finanza"></v-btn>
                <v-btn density="comfortable" icon="mdi-delete" @click="deleteItem(item)" color="#DA7171" variant="tonal"
                  elevation="1" title="Eliminar Finanza"></v-btn>
              </template>
              <template v-slot:item.plate="{ item }">
                <v-avatar class="mr-1" elevation="3" color="grey-lighten-4" size="small">
                  <v-img :src="`${this.$axios.defaults.baseURL}images/${item.image}?t=${Date.now()}`"
                    alt="image"></v-img>
                </v-avatar>
                {{ item.plate }}
              </template>
              <template v-slot:item.income="{ item }">
                <span class="text-success font-weight-bold">{{ item.income }}</span>
              </template>
              <template v-slot:item.spent="{ item }">
                <span class="text-error font-weight-bold">{{ item.spent }}</span>
              </template>
              <template v-slot:item.image="{ item }">
                <v-btn density="comfortable" icon="mdi-eye" color="green"
                  v-if="item.image && item.image !== 'finances/default.jpg'" @click="openModal(item.image)"
                  variant="tonal" elevation="1" class="mr-1 mt-1 mb-1" title="Ver detalles"></v-btn>
              </template>
            </v-data-table>
          </v-window-item>
          <v-window-item value="hogar" class="mt-4">
            <v-text-field class="mt-1 mb-1" v-model="search" append-icon="mdi-magnify" label="Buscar" single-line
          hide-details>
        </v-text-field>
        <v-data-table :headers="headers" :search="search" :items="filteredHomeFinances" class="elevation-1"
          style="max-height: 68vh; overflow-y: auto;" :items-per-page-text="'Elementos por páginas'"
          no-data-text="No hay datos disponibles" :loading="loading" loading-text="Cargando datos...">
          <template v-slot:item.actions="{ item }">
            <v-btn density="comfortable" icon="mdi-pencil" @click="editItem(item)" color="#1976D2" variant="tonal"
              elevation="1" title="Editar Finanza"></v-btn>
            <v-btn density="comfortable" icon="mdi-delete" @click="deleteItem(item)" color="#DA7171" variant="tonal"
              elevation="1" title="Eliminar Finanza"></v-btn>
          </template>
          <template v-slot:item.plate="{ item }">
            <v-avatar class="mr-1" elevation="3" color="grey-lighten-4" size="small">
              <v-img :src="`${this.$axios.defaults.baseURL}images/${item.image}?t=${Date.now()}`" alt="image"></v-img>
            </v-avatar>
<<<<<<< Updated upstream
            {{ item.plate }}
=======
            <div>
              <div class="text-body-2 font-weight-bold mb-1">
                {{ $t("finances.header.title") }}
              </div>
              <div class="text-body-2 text-grey-darken-1">
                {{ $t("finances.header.subtitle") }}
              </div>
            </div>
          </v-col>


          <!-- Columna de la tarjeta de sugerencia -->
          <v-col cols="12" sm="3" md="3">
            <v-card class="pa-2 d-flex align-center signo-card"
              elevation="1"
              rounded="lg"
              @click="dialogAlerta = true"
              style="cursor: pointer">
              <v-avatar size="40" class="me-3" color="purple-lighten-4" variant="tonal">
                <v-icon color="purple">mdi-lightbulb-on-outline</v-icon>
              </v-avatar>
              <div>
                <div class="text-body-2 font-weight-medium">
                  {{ $t("finances.suggestions.title") }}
                </div>
                <div class="text-caption text-grey-darken-1">
                  {{
                    $t("finances.suggestions.alerts.message", this.suggestions.length, {
                      count: this.suggestions.length,
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
              <v-list-item @click="showAddBuget()">
                <v-list-item-title class="text-red">
                  <v-icon start color="red">mdi-minus</v-icon>
                  Agregar Presupuesto
                </v-list-item-title>
              </v-list-item>
            </v-list>
          </v-menu>
          
        </v-row>
        <v-card elevation="1"  border class="mb-2 pa-1"  rounded="lg">
            <v-btn
              v-for="tool in tools"
              :key="tool.name"
              @click="tool.action"
              color="teal"
              variant="text"
              :prepend-icon="tool.icon"
              class="text-capitalize text-subtitle-2"
            >
              {{ tool.name }}
            </v-btn>
          </v-card>


        <!-- todo 712-->

        
<v-row dense>
<v-col cols="12" sm="12" md="12">
       <v-card class="mx-auto" elevation="1" rounded="lg" border flat>
    <v-list-item height="60">
      <template v-slot:prepend>
         <v-avatar size="40"
      color="teal"
      
    >
      <v-icon icon="mdi-calendar"></v-icon>
    </v-avatar>
      </template>



      <template v-slot:title>      Día {{ todayDay }} de 31 </template>
      <template v-slot:subtitle>   {{ fullDate }}  </template>
      <template v-slot:append>


       <v-chip
      class="ma-2"
      color="teal"
      label
      rounded="lg"
      
    >
      <v-icon icon="mdi-emoticon" start></v-icon>
      <div class="text-subtitle-2">
      Excelente!!
      </div> 
     
    </v-chip>
      </template>
    </v-list-item>

    <v-divider></v-divider>

    <v-card-text class="text-medium-emphasis pa-2 ">

  <v-sheet
    max-width="2150"
    rounded="lg"
  >
   
     <div class="pa-1">
    <div class="text-subtitle-2 font-weight-bold">Presupuesto del mes de agosto de 2025</div>
 <div class="d-flex justify-space-between mt-2">
      <div class="text-caption grey--text"></div>
      <div class="text-caption font-weight-medium">     <v-chip
     
      color="teal-darken-2"
      label
      rounded="lg"
       variant="text" 
      
    >
      <v-icon icon="mdi-trending-up" ></v-icon>
      <div class="text-subtitle-2">
       40.000 CLP disponibles
      </div> 
    </v-chip></div>
    </div>
      <div class=" ">
      <div class="text-subtitle-2 grey--text">
      
      </div>
      <div class="text-subtitle-2  font-weight-medium">
      
    </div>
    </div>
  <v-progress-linear
      :location="null"
      bg-color="red-darken-4"
      buffer-color="teal  "
      buffer-opacity="3"
      buffer-value="12"
      color="red-darken-2"
      height="16"
      max="10"
      min="0"
    
      model-value="6"
      rounded
    >
    <!-- Indicador dinámico -->
        <template v-slot:default>
          <div
            
          >
            <div class="indicator-label text-subtitle-2 text-white font-weight-black">
              {{ 60 }}%
            </div>
          
          </div>
        </template>
  
  
  
  </v-progress-linear>
    <!-- Barra de progreso -->


    <!-- Texto detalle -->
    <div class=" ">
      <div class="text-subtitle-2 grey--text">
          <v-chip
     
      color="red-darken-4"
      label
      rounded="lg"
       variant="text" 
      
    >
      <v-icon icon="mdi-trending-down" ></v-icon>
      <div class="text-subtitle-2">
       60.000 CLP consumidos
      </div> 
    </v-chip> 
      </div>
      <div class="text-subtitle-2  font-weight-medium">
      
    </div>
    </div>
  </div>
  



        </v-sheet>
   

     <v-alert
  color="warning"
  icon="mdi-alert-circle"
  variant="outlined"
  theme="dark"
  border
  density="compact"
  class="py-1 px-4"
>
  <div class="text-body2 text-black">
    Alerta si estoy gastando más rápido de lo esperado.
  </div>
</v-alert>
    </v-card-text>
  </v-card>



          </v-col>


 <v-col cols="12" md="6">
   
         <v-card class="mx-auto" elevation="1" rounded="lg" border flat>
      <v-card-title class="d-flex align-center justify-space-between">
        <div class="mr-6 text-subtitle-2">
         Gastos por categorías
        </div>
        <v-select
          v-model="selectedGroup"
          :items="['Transactions', 'Other']"
          density="compact"
          max-width="200"
          variant="solo-filled"
          flat
          hide-details
          single-line
        />
      </v-card-title>

      <v-pie
        :key="selectedGroup"
        :items="currentItems"
        :legend="{ position: $vuetify.display.mdAndUp ? 'right' : 'bottom' }"
        :tooltip="{ subtitleFormat: '[value]%' }"
        
        gap="4"
        inner-cut="70"
        item-key="id"
        rounded="1"
        animation
        hide-slice
        reveal
        size="200"
      >
        <!-- Centro del gráfico -->
        <template v-slot:center>
          <div class="text-center">
            <div class="text-h3 font-weight-bold">130</div>
            <div class="opacity-70 mt-1 mb-n1">Total</div>
          </div>
        </template>

        <!-- Leyenda personalizada -->
        <template v-slot:legend="{ items, toggle, isActive }">
          <v-list
            class="py-0 mb-n5 mb-md-0 bg-transparent"
            density="compact"
            width="250"
          >
            <v-list-item
              v-for="item in items"
              :key="item.key"
              :class="['my-1', { 'opacity-40': !isActive(item) }]"
              :title="item.title"
              rounded="lg"
              link
              @click="toggle(item)"
            >
              <template v-slot:prepend>
                <v-avatar :color="item.color" :size="16" />
              </template>
              <template v-slot:append>
                <div class="font-weight-bold">{{ item.value }}%</div>
              </template>
            </v-list-item>
          </v-list>
        </template>
      </v-pie>
    </v-card>
  </v-col>

  <v-col cols="12" md="6">
   
         <v-card class="mx-auto" elevation="1" rounded="lg" border flat>
      <v-card-title class="d-flex align-center justify-space-between">
       <div class="mr-6 text-subtitle-2">
         Evolución mensual de ingresos vs. gastos
        </div>
        <v-select
          v-model="selectedGroup"
          :items="['Transactions', 'Other']"
          density="compact"
          max-width="200"
          variant="solo-filled"
          flat
          hide-details
          single-line
        />
      </v-card-title>

      <v-pie
        :key="selectedGroup"
        :items="currentItems"
        :legend="{ position: $vuetify.display.mdAndUp ? 'right' : 'bottom' }"
        :tooltip="{ subtitleFormat: '[value]%' }"
        
        gap="4"
        inner-cut="70"
        item-key="id"
        rounded="1"
        animation
        hide-slice
        reveal
        size="200"
      >
        <!-- Centro del gráfico -->
        <template v-slot:center>
          <div class="text-center">
            <div class="text-h3 font-weight-bold">130</div>
            <div class="opacity-70 mt-1 mb-n1">Total</div>
          </div>
        </template>

        <!-- Leyenda personalizada -->
        <template v-slot:legend="{ items, toggle, isActive }">
          <v-list
            class="py-0 mb-n5 mb-md-0 bg-transparent"
            density="compact"
            width="250"
          >
            <v-list-item
              v-for="item in items"
              :key="item.key"
              :class="['my-1', { 'opacity-40': !isActive(item) }]"
              :title="item.title"
              rounded="lg"
              link
              @click="toggle(item)"
            >
              <template v-slot:prepend>
                <v-avatar :color="item.color" :size="12" />
              </template>
              <template v-slot:append>
                <div class="font-weight-bold">{{ item.value }}%</div>
              </template>
            </v-list-item>
          </v-list>
        </template>
      </v-pie>
    </v-card>
  </v-col>

       <v-alert
  color="warning"
  icon="mdi-alert-circle"
  variant="outlined"
  theme="dark"
  border
  density="compact"
  class="py-1 px-4"
>
  <div class="text-body2 text-black">
     Comparación rápida: “Este mes gastaste 15% más en supermercado que el anterior”..
  </div>
</v-alert>


</v-row>


<br>

  <div class="h-0">
    <svg height="0" version="1.1" width="0" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <pattern
          id="pattern-0"
          height="20"
          patternTransform="rotate(145) scale(.2)"
          patternUnits="userSpaceOnUse"
          width="20"
        >
          <path d="M0 10h20zm0 20h20zm0 20h20zm0 20h20z" fill="none" stroke="rgb(var(--v-theme-surface))" stroke-width="3" />
        </pattern>
      </defs>
    </svg>
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
            <v-card class="pa-3 d-flex align-center" elevation="1" rounded="lg" @click="showAddIncomeSpent()">
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
            <v-card
              class="pa-3 d-flex align-center"
              elevation="1"
              rounded="lg"
              @click="showAddBuget()"
            >
              <v-avatar
                size="40"
                class="me-3"
                :color="`${budget.color}-lighten-4`"
                variant="tonal"
              >
                <v-icon :color="budget.color">{{ budget.icon }}</v-icon>
              </v-avatar>
              <div>
                <div class="text-body-2 font-weight-medium">
                  {{ $t("finances.sections.budget") }}
                </div>
                <div class="text-subtitle-2">
                  <strong :class="`text-${budget.color}`"
                    >${{ formatCurrency(budget.current) }}</strong
                  >
                  <span v-if="parseFloat(budget.currentUsage) > 0">
                    (+{{ budget.currentUsage }}%)</span
                  >
                  <span v-else-if="parseFloat(budget.currentUsage) < 0">
                    ({{ budget.currentUsage }}%)</span
                  >
                </div>

                <!-- todo 711-->
                <div class="text-caption text-grey-darken-1">
                  vs <strong>${{ formatCurrency(budget.lastUsage) }} </strong>
                  {{ $t("finances.comparison.lastMonth") }}
                </div>
              </div>
            </v-card>
          </v-col>
        </v-row>

        <v-divider class="my-4" />

        <SuggestionsList
          :items="suggestions"
          :title="$t('finances.sections.suggestions')"
          icon="mdi-finance"
        >
          <template #detail="{ taskData, onClose }">
            <ChatTask :taskData="taskData" @close-dialog="onClose" />
>>>>>>> Stashed changes
          </template>
          <template v-slot:item.income="{ item }">
            <span class="text-success font-weight-bold">{{ item.income }}</span>
          </template>
          <template v-slot:item.spent="{ item }">
            <span class="text-error font-weight-bold">{{ item.spent }}</span>
          </template>
          <template v-slot:item.image="{ item }">
            <v-btn density="comfortable" icon="mdi-eye" color="green"
              v-if="item.image && item.image !== 'finances/default.jpg'" @click="openModal(item.image)" variant="tonal"
              elevation="1" class="mr-1 mt-1 mb-1" title="Ver detalles"></v-btn>
          </template>
        </v-data-table>
          </v-window-item>
          <v-window-item value="todas">
            <v-text-field class="mt-1 mb-1" v-model="search" append-icon="mdi-magnify" label="Buscar" single-line
          hide-details>
        </v-text-field>
        <v-data-table :headers="headers" :search="search" :items="finances" class="elevation-1"
          style="max-height: 68vh; overflow-y: auto;" :items-per-page-text="'Elementos por páginas'"
          no-data-text="No hay datos disponibles" :loading="loading" loading-text="Cargando datos...">
          <template v-slot:item.actions="{ item }">
            <v-btn density="comfortable" icon="mdi-pencil" @click="editItem(item)" color="#1976D2" variant="tonal"
              elevation="1" title="Editar Finanza"></v-btn>
            <v-btn density="comfortable" icon="mdi-delete" @click="deleteItem(item)" color="#DA7171" variant="tonal"
              elevation="1" title="Eliminar Finanza"></v-btn>
          </template>
          <template v-slot:item.plate="{ item }">
            <v-avatar class="mr-1" elevation="3" color="grey-lighten-4" size="small">
              <v-img :src="`${this.$axios.defaults.baseURL}images/${item.image}?t=${Date.now()}`" alt="image"></v-img>
            </v-avatar>
            {{ item.plate }}
          </template>
          <template v-slot:item.income="{ item }">
            <span class="text-success font-weight-bold">{{ item.income }}</span>
          </template>
          <template v-slot:item.spent="{ item }">
            <span class="text-error font-weight-bold">{{ item.spent }}</span>
          </template>
          <template v-slot:item.image="{ item }">
            <v-btn density="comfortable" icon="mdi-eye" color="green"
              v-if="item.image && item.image !== 'finances/default.jpg'" @click="openModal(item.image)" variant="tonal"
              elevation="1" class="mr-1 mt-1 mb-1" title="Ver detalles"></v-btn>
          </template>
        </v-data-table>
          </v-window-item>
        </v-window>
      </v-card-text>
    </v-card>
  <!--</v-container>-->
  <v-dialog v-model="dialog" max-width="600px">
    <v-form ref="form" v-model="valid" enctype="multipart/form-data">
      <v-card>
        <v-toolbar color="#03626C">
          <span class="text-subtitle-2 ml-4">{{ formTitle }}</span>
        </v-toolbar>
        <v-card-text>
          <v-container>
            <v-row>
              <v-col cols="12" md="6">
                <v-select v-model="finance" :items="typeOptions" item-value="value" item-title="text" label="Finanza"
                  prepend-icon="mdi-check-circle" variant="underlined" @update:model-value="clearFields"
                  density="compact"></v-select>
              </v-col>

              <!-- Campo para Ingreso -->
              <v-col cols="12" md="6" v-if="showType">
                <v-text-field v-model="editedItem.income" clearable label="Ingreso" prepend-icon="mdi-currency-usd"
                  variant="underlined" :rules="priceRules" type="number" density="compact"></v-text-field>
              </v-col>

              <!-- Campo para Gasto -->
              <v-col cols="12" md="6" v-if="!showType">
                <v-text-field v-model="editedItem.spent" clearable label="Gasto" prepend-icon="mdi-currency-usd"
                  variant="underlined" :rules="priceRules" type="number" density="compact"></v-text-field>
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
                <v-select v-model="editedItem.type" :items="Options" item-value="value" item-title="text" label="Tipo"
                  prepend-icon="mdi-check-circle" variant="underlined" density="compact"></v-select>
              </v-col>
              <v-col cols="12" md="12">
                <v-textarea v-model="editedItem.description" clearable label="Descripción" prepend-icon="mdi-note"
                  variant="underlined"></v-textarea>
              </v-col>
            </v-row>
            <v-row>
              <v-col cols="12" md="6">
                <v-file-input clearable v-model="file" ref="fileInput" label="Imagen de la Dispositivo"
                  variant="underlined" density="compact" name="file" accept=".png, .jpg, .jpeg"
                  @change="onFileSelected">
                </v-file-input>
              </v-col>
              <v-col cols="12" md="6">
                <v-card elevation="6" class="mx-auto" max-width="210" max-height="120">
                  <img v-if="imagenDisponible()" :src="imgedit" height="120" width="210">
                </v-card>


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
  </v-dialog>
  <v-dialog v-model="dialogDelete" max-width="500px">
    <v-card>

      <v-toolbar color="#DA7171">
        <span class="text-subtitle-2 ml-4"> Eliminar Finanza</span>
      </v-toolbar>

      <v-card-text class="mt-2 mb-2"> ¿Desea eliminar la finanza?</v-card-text>
      <v-divider></v-divider>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn color="#DA7171" variant="flat" @click="closeDelete">
          Cancelar
        </v-btn>
        <v-btn color="#1976D2" variant="flat" @click="deleteItemConfirm">
          Aceptar
        </v-btn>

      </v-card-actions>
    </v-card>
  </v-dialog>
  <v-dialog v-model="dialogPhoto" persistent max-width="600px">
    <v-card>
      <v-toolbar color="#03626C">
        <span class="text-subtitle-2 ml-4">Detalle</span> <v-spacer></v-spacer>
        <v-btn @click="dialogPhoto = false">
          <v-icon>mdi-close</v-icon>
        </v-btn>
      </v-toolbar>

      <v-card-text>
        <template v-if="loadingImage">
          <!-- Centro el cargador dentro de su contenedor y aumento su tamaño -->
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
  </v-dialog>
</template>

<script>
import LocalStorageService from "@/LocalStorageService";
import { handleRequest } from "@/utils/api"; // Ruta al archivo
<<<<<<< Updated upstream
export default {
  data: () => ({
    snackbar: false,
    sb_type: '',
    sb_message: '',
    sb_timeout: 2000,
    sb_title: '',
    sb_icon: '',
    valid: true,
    person_id: '',
    tab: null,
    loading: false,
    mostrar: false,
    file: null,
    imgMiniatura: '',
    dialog: false,
    dialogDelete: false,
    finances: [],
    filteredPersonalFinances: [],
    filteredHomeFinances: [],
    data: {},
    home_id: '',
    finance: 'Ingreso',
    showType: true,
    dialogPhoto: false,
    loadingImage: false,
    selectedImageUrl: '',
    headers: [
      //{ title: 'Sucursal', value: 'branchName', width: '20%' },
      { title: 'Ingreso', value: 'income', width: '10%' },
      { title: 'Gasto', value: 'spent', width: '10%' },
      { title: 'Fecha', value: 'date', width: '10%' },
      { title: 'Tipo', value: 'type', width: '10%' },
      { title: 'Método', value: 'method', width: '10%' },
      { title: 'Descripción', value: 'description', width: '30%' },
      { title: 'Detalle', value: 'image', width: '5%' },
      { title: 'Acciones', value: 'actions', sortable: false, width: '15%' },
    ],
    typeOptions: [
      { text: 'Ingreso', value: 'Ingreso' },
      { text: 'Gasto', value: 'Gasto' },
    ],
    Options: [
      { text: 'Personal', value: 'Personal' },
      { text: 'Hogar', value: 'Hogar' },
    ],
    editedItem: {
      id: '',
      home_id: '',
      spent: '',
      income: '',
      image: '',
      date: '',
      description: '',
      type: '',
      method: '',
    },
    originalItem: {
      id: '',
      home_id: '',
      spent: '',
      income: '',
      image: '',
      date: '',
      description: '',
      type: '',
      method: '',
    },
    defaultItem: {
      id: '',
      home_id: '',
      spent: '',
      income: '',
      image: '',
      date: '',
      description: '',
      type: '',
      method: '',
    },
    editedIndex: -1,
    search: '',
    menu: false,
    input: null,
    nameRules: [
      (v) => !!v || "El campo es requerido",
      (v) => (v && v.length <= 50) ||
        "El campo debe tener menos de 51 caracteres",
      (v) => (v && v.length >= 3) ||
        "El campo debe tener al menos de 3 caracteres",
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
=======
import Income from "./Income.vue";
import Spent from "./Spent.vue";
import _ from "lodash";
import Budget from "./Budget.vue";
import ChatTask from "../chat/ChatTask.vue";
import SuggestionsList from "../suggestion/SuggestionsList.vue";
import IncomeSpent from "./IncomeSpent.vue";




export default {
  components: {
    Income,
    Spent,
    Budget,
    ChatTask,
    SuggestionsList,
    IncomeSpent
  },
  data() {
    return {


tools:[
      {
        name: "Ingresos",
        icon:"mdi-trending-up",
        action: () =>
          this.messages.push({
            text: "📝 ¿Cuál es la tarea que deseas crear?",
            from: "bot",
          }),
      },
      {
        name: "Gastos",
         icon:"mdi-trending-down",
        action: () =>
          this.messages.push({
            text: "⏰ ¿Qué quieres que te recuerde y cuándo?",
            from: "bot",
          }),
      },
      {
        name: "Balance",
        icon:"mdi-cash",
        action: () =>
          this.messages.push({
            text: "🌦️ Por favor indícame tu ciudad para consultar el clima.",
            from: "bot",
          }),
      },
      {
        name: "Presupuestos",
        icon:"mdi-cash",
        action: () =>
          this.messages.push({
            text: "📋 Hoy tienes 3 tareas pendientes y 1 recordatorio programado.",
            from: "bot",
          }),
      },
    ],
      budget1: 100000,
      spent1: 80000,
      currency: "CLP",
      locale: "es-CL",
      timeZone: "America/Santiago",
      now: new Date(),

      selectedGroup: 'Transactions',
      dialogAlerta: false,
      dialogChatTask: false,
      dialogIncomeSpent: false,
      chatDialog: false,
      dialogBugets: false,
      currentTask: null,
      selectedSuggestion: null,
      showSuggestedTasksDialog: false,
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
        budget_id: "",
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
        budget_id: "",
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
        budget_id: "",
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
      budgets: [],
      suggestedTasks: [],
      home_id: "",
      suggestions: [],
      statusuggestions: [],
      people: [],
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
      budget: {},
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

       remaining() {
      return this.budget1 - this.spent1
    },
    progress() {
      if (this.budget1 <= 0) return 0
      const pct = (this.spent1 / this.budget1) * 100
      return Math.max(0, Math.min(150, pct)) // hasta 150% si se pasa
    },
    statusColor() {
      if (this.progress >= 100) return "error"
      if (this.progress >= 80) return "warning"
      return "primary"
    },
    todayDay() {
      return this.now.toLocaleDateString(this.locale, { day: "numeric", timeZone: this.timeZone })
    },
    fullDate() {
      return this.now.toLocaleDateString(this.locale, {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
        timeZone: this.timeZone
      })
    },

currentItems() {
      if (this.selectedGroup === 'Transactions') {
        return [
          { id: 1, title: 'House & Bills', value: 40, color: 'rgba(var(--v-theme-on-surface), .2)', pattern: 'url(#pattern-0)' },
          { id: 2, title: 'Transportation', value: 25, color: 'rgba(255, 151, 215, .4)' },
          { id: 3, title: 'Entertainment', value: 20, color: 'rgba(255, 151, 215, .6)' },
          { id: 4, title: 'Food', value: 10, color: 'rgba(255, 151, 215, .8)' },
          { id: 5, title: 'Other', value: 5, color: 'rgba(255, 151, 215, 1)' },
        ];
      } else {
        return [
          { id: 1, title: 'OSS Donations', value: 37, color: '#767119' },
          { id: 2, title: 'Travel', value: 22, color: '#9e850d' },
          { id: 3, title: 'Investment', value: 20, color: '#cb9700' },
          { id: 4, title: 'Books', value: 11, color: '#ffa600' },
        ];
      }
    },

    selectedSuggestedTasksCount() {
      return this.suggestedTasks?.filter((task) => task.selected).length || 0;
    },
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
>>>>>>> Stashed changes
    formTitle() {
      return this.editedIndex === -1 ? 'Agregar Finanza' : 'Editar Finanza';
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
  },
  mounted() {
    this.person_id = JSON.parse(LocalStorageService.getItem('person_id'));
    this.home_id = JSON.parse(LocalStorageService.getItem('home_id'));
    this.initialize();
  },
  methods: {
<<<<<<< Updated upstream
    openModal(imageUrl) {
=======

    fmt(n) {
      return new Intl.NumberFormat(this.locale, {
        style: "currency",
        currency: this.currency,
        maximumFractionDigits: this.currency === "CLP" ? 0 : 2
      }).format(n || 0)
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
    enrichPeopleData(taskPeople) {
      // 1. Verificar y extraer datos del Proxy
      const peopleProxy = this.people; // El Proxy recibido
      const rawPeople = peopleProxy
        ? peopleProxy.__v_raw || JSON.parse(JSON.stringify(peopleProxy))
        : [];

      // 2. Validar que taskPeople sea un array
      if (!Array.isArray(taskPeople)) {
        //console.error('taskPeople no es un array válido:', taskPeople);
        return [];
      }

      // 3. Recorrer y enriquecer los datos
      return taskPeople.map((person) => {
        // 3.1. Verificar que tenga person_id
        if (!person.person_id) {
          //console.warn('Persona sin person_id:', person);
          return person;
        }

        // 3.2. Buscar en los datos reales
        const fullPersonData = rawPeople.find((p) => p.id === Number(person.person_id));

        // 3.3. Mostrar información de debug si no se encuentra
        /*if (!fullPersonData) {
      console.warn(`No se encontró persona con ID ${person.person_id}`);
      console.log('IDs disponibles:', rawPeople.map(p => p.id));
    }*/

        // 3.4. Retornar objeto enriquecido
        return {
          ...person,
          name: fullPersonData?.namePerson || person.name || "Sin nombre",
          image: fullPersonData?.imagePerson || person.image || "default.jpg",
        };
      });
    },
    formatTime(timeString) {
      if (!timeString) return "";
      // Asume formato HH:mm
      return timeString;
    },

    formatDuration(duration) {
      if (!duration) return "";

      // Si es un número (horas)
      if (typeof duration === "number") {
        return `${duration} ${duration === 1 ? "hora" : "horas"}`;
      }

      // Si es un string con formato de tiempo
      if (typeof duration === "string") {
        // Puedes añadir lógica para formatear strings como "2 hours" o "120 mins"
        return duration;
      }

      return "Duración no especificada";
    },

    // Método para debug (puedes eliminarlo después)
    logTaskPeople(task) {
      console.log("People data for task:", task.people);
    },
    getPersonAvatar(person) {
      // Si la persona tiene imagen, usarla, sino una por defecto
      return person.image
        ? `${this.$axios.defaults.baseURL}images/${person.image}`
        : require("@/assets/default-avatar.png");
    },

    async sendSuggestedTasksToAPI() {
      try {
        this.loading = true;

        // Filtrar y formatear las tareas seleccionadas
        const tasksToCreate = this.suggestedTasks
          .filter((task) => task.selected)
          .map((task) => {
            const { selected, statusDialog, ...cleanTask } = task;

            // Convertir campos numéricos
            return {
              ...cleanTask,
              home_id: Number(cleanTask.home_id) || 0,
              parent_id: Number(cleanTask.parent_id) || null,
              priority_id: Number(cleanTask.priority_id) || 0,
              status_id: Number(cleanTask.status_id) || 1,
              estimated_time: this.convertEstimatedTime(cleanTask.estimated_time),
              people: cleanTask.people
                ? cleanTask.people.map((person) => ({
                    home_id: Number(person.home_id) || 0,
                    person_id: Number(person.person_id) || 0,
                    role_id: Number(person.role_id) || 0,
                    roleName: person.roleName,
                  }))
                : [],
            };
          });

        // Enviar al endpoint que maneja la creación múltiple
        const result = await handleRequest({
          endpoint: "task-bulk",
          method: "POST",
          data: { tasks: tasksToCreate },
        });

        if (result.success) {
          this.showAlert(
            "success",
            `${tasksToCreate.length} tareas creadas exitosamente`,
            3000
          );
          this.showSuggestedTasksDialog = false;
          this.initialize(); // Refrescar datos
        } else {
          this.showAlert("warning", result.message, 3000);
        }
      } catch (error) {
        this.showAlert("error", "Error al crear las tareas", 3000);
        console.error("Error creating tasks:", error);
      } finally {
        this.loading = false;
      }
    },
    convertEstimatedTime(time) {
      if (!time) return 0;

      // Si ya es un número, devolverlo
      if (typeof time === "number") return time;

      // Si es string con formato "X horas"
      const match = time.toString().match(/(\d+)\s*horas?/i);
      if (match) return parseInt(match[1], 10);

      // Si es string con formato "HH:mm"
      const timeParts = time.toString().split(":");
      if (timeParts.length === 2) {
        return parseInt(timeParts[0], 10) + parseInt(timeParts[1], 10) / 60;
      }

      // Intentar convertir a número
      return Number(time) || 0;
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
    openChatbot(task) {
      this.currentTask = null;
      this.$nextTick(() => {
        const taskData =
          typeof task.taskData === "string" ? JSON.parse(task.taskData) : task.taskData;

        this.currentTask = _.cloneDeep(taskData);
        this.dialogChatTask = true;
      });
    },
    async handleTaskCompleted(payload) {
      const taskData = payload.taskData || {};
      const people = payload.people || [];
      //console.log("Tarea completada:", taskData);
      //console.log("Personas asignadas:", people);
      (this.people = []), (this.people = _.cloneDeep(people));
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
              roleName: person.roleName,
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
        updatedFields.type = this.editedItemTask.type
          ? this.editedItemTask.type
          : "Tarea";

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
            if (
              result.data &&
              result.data.suggestedTasks &&
              result.data.suggestedTasks.length > 0
            ) {
              // Aquí puedes manejar las sugerencias de tareas
              // Por ejemplo, mostrarlas en un diálogo o procesarlas automáticamente
              console.log("Tareas sugeridas:", result.data.suggestedTasks);

              this.suggestedTasks = result.data.suggestedTasks.map((task) => ({
                ...task,
                people: this.enrichPeopleData(task.people || []),
              }));
              this.showSuggestedTasksDialog = true;
            }
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
>>>>>>> Stashed changes
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
    },
    formatNumber(value) {
      // Si el valor es menor que 1000, devuelve el valor original con dos decimales
      if (value < 1000) {
        return (Math.round((value + Number.EPSILON) * 100) / 100).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
      }

      // Primero, redondea el valor a dos decimales
      value = Math.round((value + Number.EPSILON) * 100) / 100;

      // Convierte el valor a cadena con formato de número local (en-US)
      let formattedValue = value.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });

      return formattedValue;
    },
    clearFields() {
      // Limpiar los valores de ingreso y gasto al cambiar el tipo
      this.editedItem.income = '';
      this.editedItem.spent = '';
      this.showType = !this.showType;
    },
    updateDate(val) {
      this.input = val;
      this.editedItem.date = this.dateFormatted;
      this.menu = false;
    },
    async showAdd() {
      this.dialog = true;
      this.editedItem.home_id = this.home_id;
    },
    close() {
      this.dialog = false;
      this.$nextTick(() => {
        this.editedItem = Object.assign({}, this.defaultItem);
        this.originalItem = Object.assign({}, this.defaultItem);
      });
      this.editedIndex = -1
      this.file = null;
      this.imgMiniatura = '';
    },
    async initialize() {
      try {
        this.data = {};
        this.data.home_id = this.home_id;
        this.data.type = 'Todas';
        this.loading = true;
        const result = await handleRequest({
          endpoint: 'get-type-finance',
          method: 'POST',
          data: this.data
        });

        if (result.success) {
          // Si la solicitud es exitosa, asignamos las sucursales
          this.finances = result.data?.finances || [];
          // Filtro 1: donde person_id sea igual a this.person_id y type sea igual a 'Personal'
          this.filteredPersonalFinances = this.finances.filter(finance =>
            finance.idType === 'Personal')

          // Filtro 2: donde home_id sea igual a this.home_id
          this.filteredHomeFinances = this.finances.filter(finance =>
            finance.idType === 'Hogar');
        } else {
          // Si no hay datos, asignamos un array vacío
          this.finances = [];
          this.showAlert('info', 'No hay finanzas disponibles.', 3000);
        }
      } catch (error) {
        this.loading = false;
        // Captura de errores no controlados
        this.showAlert('error', 'Ocurrió un error inesperado al cargar las finanzas.', 3000);
      } finally {
        this.loading = false;
      }
    },
    async save() {
      this.loading = true;
      if (this.editedIndex === -1) {
        this.valid = false;
        const fieldsToUpdate = ['home_id', 'spent', 'income', 'image', 'date', 'description', 'image', 'type', 'method'];

        let updatedFields = Object.keys(this.editedItem)
          .filter((key) => fieldsToUpdate.includes(key) && this.editedItem[key] !== this.originalItem[key])
          .reduce((obj, key) => {
            obj[key] = this.editedItem[key];
            return obj;
          }, {});
        if (Object.keys(updatedFields).length > 0) {
          updatedFields.date = this.editedItem.date ? this.editedItem.date : new Date();
          updatedFields.home_id = this.editedItem.home_id;
          if (this.file) {
            updatedFields.image = this.editedItem.image;
          }
          const formData = new FormData();
          for (let key in updatedFields) {
            formData.append(key, updatedFields[key]);
          }

          try {
            const result = await handleRequest({
              endpoint: 'finance',
              method: 'POST',
              data: formData
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
            this.showAlert("error", "Ocurrió un error inesperado al procesar la solicitud.", 3000);
          }
        } else {
          this.loading = false;
          this.showAlert("success", "Debe completar los datos de producto.", 3000);
        }
      } else {
        this.valid = false;
        const fieldsToUpdate = ['home_id', 'spent', 'income', 'image', 'date', 'description', 'image', 'type', 'method'];
        let updatedFields = Object.keys(this.editedItem)
          .filter((key) => fieldsToUpdate.includes(key) && this.editedItem[key] !== this.originalItem[key])
          .reduce((obj, key) => {
            obj[key] = this.editedItem[key];
            return obj;
          }, {});
        if (Object.keys(updatedFields).length > 0) {
          updatedFields.id = this.editedItem.id;
          if (this.file) {
            updatedFields.image = this.editedItem.image;
          }
          const formData = new FormData();
          for (let key in updatedFields) {
            formData.append(key, updatedFields[key]);
          }
          try {
            const result = await handleRequest({
              endpoint: 'finance-update',
              method: 'POST',
              data: formData
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
            this.showAlert("error", "Ocurrió un error inesperado al procesar la solicitud.", 3000);
          }
        } else {
          this.loading = false;
          this.showAlert("success", "No se realizaron cambios.", 3000);
        }
      }
      this.close();
    },
    async editItem(item) {
      this.editedIndex = 1;
      this.originalItem = Object.assign({}, item);
      this.editedItem = Object.assign({}, item);
      if (this.editedItem.finance === 'Ingreso') {
        this.finance = 'Ingreso';
        this.showType = true;
      }
      else {
        this.finance = 'Gasto';
        this.showType = false;
      }
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
          console.error('Error al cargar la imagen', error);
          this.showAlert('error', 'Error al cargar la imagen.', 3000);
        }
      };
      this.dialog = true;
      console.log('this.type');
      console.log(this.type);
    },
    deleteItem(item) {
      this.editedIndex = 1;
      this.editedItem.id = item.id;
      this.dialogDelete = true;
    },
    closeDelete() {
      this.dialogDelete = false
      this.$nextTick(() => {
        this.editedItem = Object.assign({}, this.defaultItem)
      })
    },
    async deleteItemConfirm() {
      try {
        let request = {
          id: this.editedItem.id
        };
        const result = await handleRequest({
          endpoint: 'finance-destroy',
          method: 'POST',
          data: request
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
        this.showAlert("error", "Ocurrió un error inesperado al procesar la solicitud.", 3000);
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
    imagenDisponible() {
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
    },
  },
};
</script>

<style scoped>
.selected-tab {
  background-color: #03626C;
  /* Fondo del tab seleccionado */
  color: white;
  /* Texto blanco */
  border-radius: 4px;
  /* Esquinas redondeadas, opcional */
}
<<<<<<< Updated upstream
</style>
=======

.text-red {
  color: #c62828;
}

.text-blue {
  color: #1565c0;
}

/* Estilos para el texto en tareas seleccionadas */
.selected-task {
  background-color: #03626c;
}

.selected-task .date-time-text,
.selected-task .font-weight-semibold,
.selected-task .text-caption,
.selected-task .text-grey-darken-1,
.selected-task .v-icon {
  color: white !important;
}

.selected-task .text-caption {
  opacity: 0.9;
}

/* Opcional: para mantener consistencia en el hover */
.selected-task:hover .date-time-text {
  opacity: 0.95;
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

.hover-expand {
  transition: transform 0.2s;
}

.hover-expand:hover {
  transform: scale(1.2);
  z-index: 2;
}

/* Estilo para el texto de duración */
.text-caption.text-grey-darken-1 {
  font-size: 0.7rem;
}

.dot-wrapper {
  position: absolute;
  top: -28px; /* sube el texto */
  display: flex;
  flex-direction: column;
  align-items: center;
}

.dot-label {
  font-size: 12px;
  font-weight: bold;
  color: black;
  margin-bottom: 4px;
}

.dot {
  width: 12px;
  height: 12px;
  border-radius: 50%;
  background-color: red;
}
</style>

>>>>>>> Stashed changes
