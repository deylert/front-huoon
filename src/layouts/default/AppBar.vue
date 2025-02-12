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
  <v-card class="mx-auto pa-3" flat style="background: transparent;">
    <div class="d-flex align-center justify-space-between" min-wdth="600">
      <!-- Título con imagen -->
      <v-img src="#" max-height="100" max-width="174" class="justify-center" style="display: block; border: 1px;"
        size="x-large"></v-img>

      <!-- Espaciador -->
      <v-spacer></v-spacer>

      <!-- Menú desplegable activado por avatar con campanita -->
      <div class="d-flex align-center">
        <v-text-field :loading="loading" :placeholder="'Bienvenido(a) ' + this.user + '. ¿En qué podemos ayudarte?'"
          density="compact" variant="outlined" hide-details single-line rounded @keydown.enter="onClick"
          class="custom-text-field" style="width: 100%; min-width: 50vh;" clearable>
          <!-- Avatar a la izquierda del campo de búsqueda -->
          <template v-slot:prepend-inner>
            <v-avatar size="24" class="mr-2" @click="onClick">
              <v-img src="@/assets/logo-verde.png" alt="Avatar" />
            </v-avatar>
          </template>
        </v-text-field>
        <!--<v-btn icon variant="text" class="mr-2" style="color: #FFC0CB; border: 2px solid #FFF;">
          <v-badge color="#FFC0CB" :content="this.cantHome" overlap>
            <v-icon size="x-large" style="color: #FFC0CB;" icon="mdi-home-outline" @click="openDialog"></v-icon>
          </v-badge>
        </v-btn>-->

        
      </div>
      
      <v-btn icon variant="text" class="mr-2" style="color: #FFC0CB; border: 2px solid #FFF;">
          <v-badge color="#FFC0CB" :content="cantHome" overlap>
            <v-icon size="x-large" style="color: #FFC0CB;" icon="mdi-home-outline" @click="openMenu"></v-icon>
          </v-badge>

          <!-- Menú desplegable -->
          <v-menu v-model="menu" :close-on-content-click="false" offset-y max-height="300" min-width="auto"
            content-class="rounded-menu">
            <template v-slot:activator="{ props }">
              <!-- Este div vacío es necesario para activar el menú -->
              <div v-bind="props"></div>
            </template>

            <!-- Contenido del menú con scroll -->
            <v-list style="max-height: 300px; overflow-y: auto;">
              <v-list-item v-for="(home, index) in homes" :key="index" @click="selectHome(home)"
                :class="{ 'selected-home': home.id === this.home_id }">
                <v-row align="center" no-gutters>
                  <!-- Avatar con efecto de superposición y ampliación -->
                  <v-col cols="auto" class="pr-2">
                    <div class="avatar-container" @mouseover="isHovered = home.id" @mouseleave="isHovered = null">
                      <v-avatar size="40" class="avatar">
                        <v-img :src="`${this.$axios.defaults.baseURL}images/${home.image}`" alt="Avatar"></v-img>
                      </v-avatar>
                    </div>
                  </v-col>

                  <!-- Nombre y rol con tooltip -->
                  <v-col style="min-width: 0;">
                    <v-tooltip top>
                      <template v-slot:activator="{ on, attrs }">
                        <v-list-item-title v-bind="attrs" v-on="on" class="text-truncate">{{ home.name
                          }}</v-list-item-title>
                      </template>
                      <span>{{ home.name }}</span>
                    </v-tooltip>
                    <v-tooltip top>
                      <template v-slot:activator="{ on, attrs }">
                        <v-list-item-subtitle v-bind="attrs" v-on="on" class="text-truncate">{{ home.nameRole
                          }}</v-list-item-subtitle>
                      </template>
                      <span>{{ home.nameRole }}</span>
                    </v-tooltip>
                  </v-col>
                </v-row>
              </v-list-item>
            </v-list>
          </v-menu>
        </v-btn>
        <!-- Campanita de notificaciones -->
        <v-btn icon variant="text" class="mr-2" style="color: #FFC0CB; border: 2px solid #FFF;" @click="notifications.length ? openNoti() : ''">
          <template v-if="countNoti">
            <!-- Mostrar badge solo si hay notificaciones -->
            <v-badge color="#FFC0CB" :content="countNoti" overlap>
              <v-icon size="x-large" style="color: #FFC0CB;" icon="mdi-bell-badge-outline"></v-icon>
            </v-badge>
          </template>

          <template v-else>
            <!-- Mostrar solo el icono (sin badge) -->
            <v-icon size="x-large" style="color: #FFC0CB;" icon="mdi-bell-outline"></v-icon>
          </template>

          <!-- Componente de menú de notificaciones -->
          <v-menu v-model="menuNoti" :close-on-content-click="false" offset-y max-height="300" min-width="350px" max-width="350px"
            content-class="rounded-menu">
            <template v-slot:activator="{ props }">
              <div v-bind="props"></div>
            </template>

            <v-list style="max-height: 300px; overflow-y: auto;" class="notification-list">
              <!-- Items de notificaciones -->
              <v-list-item v-for="(notification, index) in notifications" :key="index"
                :class="{ 'notification-unread': notification.status === 0 }" class="notification-item" @click="handleItemClickNotif(notification)">
                <v-row align="center" no-gutters>
                  <!-- Imagen -->
                  <v-col cols="auto" class="pr-1">
                    <v-avatar size="45" class="notification-image">
                      <v-img :src="`${this.$axios.defaults.baseURL}images/${notification.image}`" alt="Avatar"></v-img>
                    </v-avatar>
                  </v-col>

                  <!-- Contenido textual -->
                  <v-col style="min-width: 0;">
                    <!-- Título con tooltip -->
                    <v-tooltip top>
                      <template v-slot:activator="{ on, attrs }">
                        <v-list-item-title v-bind="attrs" v-on="on"
                          :class="{ 'unread-title': notification.status === 0 }" class="text-truncate title-text">
                          {{ notification.title }}
                        </v-list-item-title>
                      </template>
                      <span>{{ notification.title }}</span>
                    </v-tooltip>

                    <!-- Descripción con tooltip -->
                    <v-tooltip top>
                      <template v-slot:activator="{ on, attrs }">
                        <v-list-item-subtitle v-bind="attrs" v-on="on" class="text-truncate description-text">
                          {{ notification.description }}
                        </v-list-item-subtitle>
                      </template>
                      <span>{{ notification.description }}</span>
                    </v-tooltip>
                  </v-col>
                </v-row>
              </v-list-item>

              <!-- Botón de carga adicional -->
              <v-list-item v-if="hasMore" @click="getNotifications" class="load-more-item">
                <v-btn variant="text" color="primary" block class="load-more-btn">
                  Ver más
                  <v-icon right>mdi-chevron-down</v-icon>
                </v-btn>
              </v-list-item>
            </v-list>
          </v-menu>
        </v-btn>
        <!-- Menú desplegable activado por avatar -->
        <v-menu>
          <template v-slot:activator="{ props }">
            <v-avatar v-bind="props" class="mr-2">
              <v-img :src="`${this.$axios.defaults.baseURL}images/${imageUrl}`" alt="Avatar del profesional"></v-img>
            </v-avatar>
          </template>

          <!-- Lista del menú -->
          <v-list>
            <v-list-item v-for="(item, i) in items" :key="i" @click="handleItemClick(item)">
              <template v-slot:prepend>
                <v-icon :icon="item.icon"></v-icon>
              </template>
              <v-list-item-title>{{ item.title }}</v-list-item-title>
            </v-list-item>
          </v-list>
        </v-menu>
    </div>
  </v-card>
  <!--<v-app-bar scroll-threshold="0">
    <v-app-bar-title>

      <v-img src="#" class="justify-center" max-height="100" max-width="174" style="display:block;">
      </v-img>
    </v-app-bar-title>
    <v-spacer></v-spacer>
    <v-menu>
      <template v-slot:activator="{ props }">

        <v-list-item v-bind="props" variant="tonal" class="mr-4" lines="two" :title="this.name" :subtitle="this.user"
          :style="{ color: '#03626C' }">
          <template v-slot:prepend>
            <v-avatar class="mr-2">
              <v-img :src="`${this.$axios.defaults.baseURL}images/${imageUrl}`" alt="Avatar del profesional"></v-img>
            </v-avatar>
          </template>
          <template v-slot:append>
            <v-btn size="small" variant="text" icon="mdi-menu-down"></v-btn>
          </template></v-list-item>

      </template>

      <v-list>
        <v-list-item v-for="(item, i) in items" :key="i" @click="handleItemClick(item)">

          <template v-slot:prepend>
            <v-icon :icon="item.icon"></v-icon>
          </template>


          <v-list-item-title> {{ item.title }}</v-list-item-title>
        </v-list-item>
      </v-list>
    </v-menu>

  </v-app-bar>-->
  <v-dialog v-model="dialogChangePass" max-width="400px">
    <v-form ref="form" v-model="valid" enctype="multipart/form-data">
      <v-card>
        <v-toolbar color="#03626C">
          <span class="text-subtitle-2 ml-4">Actualizar Contraseña</span>
        </v-toolbar>
        <v-card-text>
          <v-container>
            <v-row>
              <v-col cols="12" md="12">
                <v-text-field :append-inner-icon="visible ? 'mdi-eye-off' : 'mdi-eye'"
                  :type="visible ? 'text' : 'password'" density="compact" placeholder="Contraseña actual"
                  prepend-inner-icon="mdi-lock-outline" variant="underlined" @click:append-inner="visible = !visible"
                  v-model="editedItem.currentPassword"></v-text-field>
              </v-col>
              <v-col cols="12" md="12">
                <v-text-field :append-inner-icon="visible1 ? 'mdi-eye-off' : 'mdi-eye'"
                  :type="visible1 ? 'text' : 'password'" density="compact" placeholder="Contraseña nueva"
                  prepend-inner-icon="mdi-lock-outline" variant="underlined" @click:append-inner="visible1 = !visible1"
                  v-model="editedItem.newPassword"></v-text-field>
              </v-col>
              <v-col cols="12" md="12">
                <v-text-field :append-inner-icon="visible2 ? 'mdi-eye-off' : 'mdi-eye'"
                  :type="visible2 ? 'text' : 'password'" density="compact" placeholder="Contraseña nueva"
                  prepend-inner-icon="mdi-lock-outline" variant="underlined" @click:append-inner="visible2 = !visible2"
                  v-model="editedItem.newPassword1"></v-text-field>
              </v-col>
              <!-- Alerta de error si las contraseñas no coinciden -->
              <v-alert v-if="editedItem.newPassword !== editedItem.newPassword1 && editedItem.newPassword1 !== ''"
                type="error" dense>
                Las contraseñas no coinciden.
              </v-alert>
            </v-row>
          </v-container>
        </v-card-text>
        <v-divider></v-divider>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="#DA7171" variant="flat" @click="close">Cancelar</v-btn>
          <v-btn color="#03626C" variant="flat" :loading="loading" @click="save"
            :disabled="editedItem.newPassword !== editedItem.newPassword1 || editedItem.newPassword === ''">Aceptar</v-btn>
        </v-card-actions>
      </v-card>
    </v-form>
  </v-dialog>
  <v-dialog v-model="dialog" max-width="500">
    <v-card>
      <v-toolbar color="#03626C">
        <span class="text-subtitle-2 ml-4">Seleccionar Hogar</span>
      </v-toolbar>
      <v-card-text>
        <v-row>
          <v-col cols="12" md="12">
            <v-autocomplete :no-data-text="'No hay datos disponibles'" v-model="this.home_id" :items="homes"
              label="Hogares" prepend-icon="mdi-home" item-title="name" item-value="id" variant="underlined"
              @update:model-value="changeHome()">
              <template v-slot:item="{ props, item }">
                <v-list-item v-bind="props" :prepend-avatar="`${this.$axios.defaults.baseURL}images/${item.raw.image}`"
                  :title="item.raw.name">
                  <v-list-item-subtitle class="d-flex flex-column">
                    <v-tooltip bottom>
                      <template v-slot:activator="{ on, attrs }">
                        <div class="description-text" v-bind="attrs" v-on="on" :title="item.raw.nameHomeType">
                          Tipo: {{ item.raw.nameHomeType }}
                        </div>
                      </template>
                      <!-- Tooltip con el texto completo -->
                    </v-tooltip>
                    <v-tooltip bottom>
                      <template v-slot:activator="{ on, attrs }">
                        <div class="description-text" v-bind="attrs" v-on="on" :title="item.raw.nameRole">
                          Rol: {{ item.raw.nameRole }}
                        </div>
                      </template>
                      <!-- Tooltip con el texto completo -->
                    </v-tooltip>
                  </v-list-item-subtitle>
                </v-list-item>
              </template>
            </v-autocomplete>
          </v-col>
        </v-row>
      </v-card-text>
      <v-card-actions>
        <v-btn color="#DA7171" variant="flat" @click="closeDialog">Cancelar</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
import LocalStorageService from "@/LocalStorageService";
import { handleRequest } from "@/utils/api"; // Ruta al archivo
import router from '@/router/index';
export default {
  data: () => ({
    loaded: false,
    drawer: false,
    menu: false,
    menuNoti: false,
    isHovered: null,
    drawerItems: [
      { title: "Inicio", icon: "mdi-home" },
      { title: "Configuración", icon: "mdi-cog" },
      { title: "Ayuda", icon: "mdi-help-circle" },
    ],
    visible: false,
    visible1: false,
    visible2: false,
    snackbar: false,
    loading: false,
    sb_type: '',
    sb_message: '',
    sb_timeout: 2000,
    sb_title: '',
    sb_icon: '',
    user: '',
    name: '',
    imageUrl: '',
    cantHome: '',
    home_id: '',
    dialogChangePass: false,
    data: {},
    homes: [],
    dialog: false,
    editedItem: {
      currentPassword: '',
      newPassword: '',
      newPassword1: '',
    },
    defaultItem: {
      currentPassword: '',
      newPassword: '',
      newPassword1: ''
    },
    cursor: null,
    hasMore: false,
    notifications: [],
    countNoti: '',
    items: [
      { title: 'Mi Perfil', icon: "mdi-account-tie-outline" },
      { title: 'Cambiar Contraseña', icon: "mdi-form-textbox-password" },
      { title: 'Cerrar Sesión', icon: "mdi-exit-to-app" },

    ],
  }),
  mounted() {
    this.name = JSON.parse(LocalStorageService.getItem('name'));
    this.user = JSON.parse(LocalStorageService.getItem('user'));
    this.user_id = JSON.parse(LocalStorageService.getItem('user_id'));
    this.home_id = JSON.parse(LocalStorageService.getItem('home_id'));
    //this.rol_id = LocalStorageService.getItem('role_id');
    //this.role = JSON.parse(LocalStorageService.getItem('role'));
    this.imageUrl = LocalStorageService.getItem('image').replace(/['"]+/g, '');
    // Aquí se debe usar una función
    this.$router.push({ path: 'home' });
    this.initialize();
    this.getNotifications();
  },
  methods: {
    async initialize() {
      try {
        const result = await handleRequest({
          endpoint: 'person-homes',
          method: 'POST'
        });

        if (result.success) {
          // Si la solicitud es exitosa, asignamos las sucursales
          this.homes = result.data?.homes || []; // Si no hay roles, asigna un arreglo vacío
        } else {
          // Si no hay datos, asignamos un array vacío
          this.homes = [];
        }
      } catch (error) {
        // Captura de errores no controlados
        this.showAlert('error', 'Ocurrió un error inesperado al cargar las hogares.', 3000);
      } finally {
        this.cantHome = this.homes.length;
        // Reiniciar el formulario
        if (!this.home_id && this.homes.length) {
          localStorage.setItem("home_id", this.homes[0].id);
          this.home_id = this.homes[0].id;
        }
      }
    },
    async getNotifications() {
      try {
        this.data = {};
        this.data.cursor = this.cursor;
        const result = await handleRequest({
          endpoint: 'get-user-notifications',
          method: 'POST',
          data: this.data
        });

        if (result.success) {
          // Si la solicitud es exitosa, asignamos las sucursales
          // Asignar todas las notificaciones al array
          this.notifications.push(...result.data?.notifications || []);
          // Filtrar las notificaciones con status 0 solo para contar
          this.countNoti = this.notifications.filter(
            notification => notification.status === 0
          ).length || 0;
          this.cursor = result.data?.nextCursor || null;
          this.hasMore = result.data?.hasMore || false;
          console.log('this.cursor');
          console.log(this.cursor);
          console.log('this.hasMore');
          console.log(this.hasMore);
        } else {
          // Si no hay datos, asignamos un array vacío
          this.notifications = [];
          this.cursor = null;
          this.hasMore = false;
        }
      } catch (error) {
        // Captura de errores no controlados
        this.showAlert('error', 'Ocurrió un error inesperado al cargar las notificaciones.', 3000);
      }
    },
    async openMenu() {
      try {
        const result = await handleRequest({
          endpoint: 'person-homes',
          method: 'POST'
        });

        if (result.success) {
          // Si la solicitud es exitosa, asignamos las sucursales
          this.homes = result.data?.homes || []; // Si no hay roles, asigna un arreglo vacío
        } else {
          // Si no hay datos, asignamos un array vacío
          this.homes = [];
        }
      } catch (error) {
        // Captura de errores no controlados
        this.showAlert('error', 'Ocurrió un error inesperado al cargar las hogares.', 3000);
      } finally {
        this.cantHome = this.homes.length;
        // Reiniciar el formulario

        this.menu = true; // Abre el menú
      }
    },
    openNoti() {
      this.menuNoti = true;
    },
    selectHome(home) {
      // Lógica para manejar la selección de un hogar
      localStorage.setItem("home_id", home.id);

      // Obtiene la ruta actual
      const currentRoute = this.$route.fullPath;
      console.log('currentRoute:', currentRoute);
      this.home_id = home.id;
      // Redirige a la ruta 'Home'
      this.$router.push({ name: 'Home' });
      this.menu = false; // Cierra el menú después de seleccionar
    },
    onClick() {
      this.loading = true

      setTimeout(() => {
        this.loading = false
        this.loaded = true
      }, 2000)
    },
    async handleItemClick(item) {
      if (item.title === 'Cambiar Contraseña') {
        this.editedItem = Object.assign({}, this.defaultItem);
        this.dialogChangePass = true;
      }
      if (item.title === 'Cerrar Sesión') {
        try {
          const result = await handleRequest({
            endpoint: 'logout',
            method: 'GET'
          });

          if (result.success) {
            // Mostrar mensaje de éxito
            this.showAlert('success', 'Sesión cerrada correctamente', 3000);
            setTimeout(() => {
              // Eliminar el token y redirigir al login
              LocalStorageService.logout();
              this.$router.push({ path: '/' });
            }, 1000);
          } else {
            // Mostrar mensaje de error
            this.showAlert('warning', result.message, 3000);
          }
        } catch (error) {
          // En caso de que algo salga mal, manejar errores adicionales aquí si es necesario
          this.showAlert('error', 'Ocurrió un error inesperado.', 3000);
        }
      }
      if (item.title === 'Mi Perfil') {
        console.log('Mi Perfil');
      }
    },
    close() {
      this.editedItem = Object.assign({}, this.defaultItem);
      this.dialogChangePass = false;
    },
    async save() {
      this.loading = true; // Iniciar loader
      try {
        // Preparar el payload
        this.data.id = this.user_id;
        this.data.currentPassword = this.editedItem.currentPassword;
        this.data.newPassword = this.editedItem.newPassword;

        // Petición al servidor utilizando handleRequest
        const result = await handleRequest({
          endpoint: 'update-password',
          method: 'POST',
          data: this.data
        });

        if (result.success) {
          // Manejo en caso de éxito
          this.showAlert('success', 'Contraseña actualizada correctamente', 3000);
          // Reiniciar el formulario
          this.editedItem = Object.assign({}, this.defaultItem);
        } else {
          // Manejo de errores definidos por la API
          this.showAlert('warning', result.message || 'Error inesperado', 3000);
        }
      } catch (error) {
        // Manejo de errores no controlados
        this.showAlert('error', 'Ocurrió un error inesperado al iniciar sesión.', 3000);
        console.error(error);
      } finally {
        this.loading = false; // Detener el loader
        this.dialogChangePass = false;
      }
    },
    showAlert(sb_type, sb_message, sb_timeout) {
      this.sb_type = sb_type

      if (sb_type == "success") {
        this.sb_title = 'Éxito'
        this.sb_icon = 'mdi-check-circle'
      }

      if (sb_type == "error") {
        this.sb_title = 'Error'
        this.sb_icon = 'mdi-check-circle'
      }
      if (sb_type == "warning") {
        this.sb_title = 'Advertencia'
        this.sb_icon = 'mdi-alert-circle'
      }
      this.sb_message = sb_message
      this.sb_timeout = sb_timeout
      this.snackbar = true
    },
    async openDialog() {
      try {
        const result = await handleRequest({
          endpoint: 'person-homes',
          method: 'POST'
        });

        if (result.success) {
          // Si la solicitud es exitosa, asignamos las sucursales
          this.homes = result.data?.homes || []; // Si no hay roles, asigna un arreglo vacío
        } else {
          // Si no hay datos, asignamos un array vacío
          this.homes = [];
        }
      } catch (error) {
        // Captura de errores no controlados
        this.showAlert('error', 'Ocurrió un error inesperado al cargar las hogares.', 3000);
      } finally {
        LocalStorageService.setItem('cantHome', this.homes.length);
        this.cantHome = this.homes.length;
        // Reiniciar el formulario

        // Redirigir al Dashboard
        /* setTimeout(() => {
           router.push({ name: 'Dashboard' });
         }, 1000);*/
      }
      this.dialog = true; // Abrir el diálogo
    },
    closeDialog() {
      this.dialog = false; // Cerrar el diálogo
    },
    changeHome() {
      this.dialog = false;
      // Guardar el home_id seleccionado en localStorage
      localStorage.setItem("home_id", this.home_id);
      const currentRoute = this.$route.fullPath;
      console.log('currentRoute');
      console.log(currentRoute);
      router.push({ name: 'Home' });
    },
    handleItemClickNotif(item) {
     //alert(item.id);
    },
  }
}
</script>

<style scope="this api replaced by slot-scope in 2.5.0+">
.v-input.custom-text-field.v-input {
  border-color: #03626C !important;
}

.text-truncate {
  white-space: nowrap;
  /* Evita que el texto se divida en varias líneas */
  overflow: hidden;
  /* Oculta el texto que desborda */
  text-overflow: ellipsis;
  /* Agrega puntos suspensivos (...) al final del texto recortado */
}

/* Estilos para el efecto de superposición y ampliación del avatar */
.avatar-container {
  position: relative;
  display: inline-block;
  cursor: pointer;
}

.avatar {
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  transform-origin: center center;
  /* Asegura que la ampliación sea desde el centro */
}

.avatar-container:hover .avatar {
  transform: scale(1.5);
  /* Amplía la imagen más */
  z-index: 10;
  /* Asegura que la imagen ampliada esté por encima de otros elementos */
}

.avatar-overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  /* Fondo semitransparente */
  border-radius: 50%;
  /* Mantiene la forma circular */
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 11;
  /* Asegura que el overlay esté por encima de la imagen */
  pointer-events: none;
  /* Permite que el hover funcione en el contenedor */
}

/* Estilos para resaltar el hogar seleccionado */
.selected-home {
  background-color: #f0f0f0;
  /* Color de fondo para el elemento seleccionado */
}


/* Estilos principales del menú */
.rounded-menu {
  border-radius: 4px !important;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.12) !important;
  border: 1px solid #eee !important;
}

/* Items de notificación */
.notification-item {
  transition: all 0.25s ease;
  padding: 12px 16px !important;
  border-bottom: 1px solid #03626C;
  cursor: pointer;
}

/* Notificación no leída */
.notification-unread {
  background-color: #f8f9fa;
  border-left: 4px solid #03626C !important;
  border-radius: 4px;
}

.notification-unread .unread-title {
  font-weight: 600 !important;
  color: #03626C !important;
}

/* Textos */
.title-text {
  font-size: 0.95rem !important;
  line-height: 1 !important;
  margin-bottom: 2px;
}

.description-text {
  font-size: 0.85rem !important;
  line-height: 1.4 !important;
  color: #616161 !important;
}

/* Imagen */
.notification-image {
  border: 2px solid #eee;
  transition: transform 0.3s ease;
}

.notification-image:hover {
  transform: scale(1.05);
}

/* Botón de carga adicional */
.load-more-item {
  padding: 2px 0 !important;
}

.load-more-btn {
  font-weight: 500 !important;
  letter-spacing: 0.5px !important;
}

/* Hover effects */
.v-list-item:hover {
  background-color: #f5f5f5 !important;
}

/* Scrollbar personalizada */
.notification-list::-webkit-scrollbar {
  width: 8px;
}

.notification-list::-webkit-scrollbar-track {
  background: #f1f1f1;
  border-radius: 4px;
}

.notification-list::-webkit-scrollbar-thumb {
  background: #c1c1c1;
  border-radius: 4px;
}

.notification-list::-webkit-scrollbar-thumb:hover {
  background: #a8a8a8;
}
</style>
