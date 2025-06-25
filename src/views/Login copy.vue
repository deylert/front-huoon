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
  <v-container fluid class="d-flex align-center justify-center" style="height:100%; background-color: #03626C;">
    <v-row class="w-100" style=" margin: 0;">
      <!-- Imagen de fondo -->
      <v-col cols="12" md="9" class="pa-0 position-relative">
        <v-card flat max-height="95vh">
          <v-img src="@/assets/Login.png" alt="Imagen de fondo" cover class="background-img">
            <!-- Logo en la parte superior izquierda -->
            <div class="position-absolute d-flex align-center" style="top: 50px; left: 50px;">
              <v-avatar color="#ffffff" size="50">
                <img src="@/assets/logo-verde.png" alt="Imagen de avatar" class="avatar-image" />
              </v-avatar>
              <span style="color: #03626C; font-weight: bold; font-size: 1.6rem; margin-left: 20px;">huoon</span>
            </div>
          </v-img>
        </v-card>
      </v-col>

      <!-- Formulario de registro -->
      <v-col cols="12" md="3" class="pa-0">
        <v-card flat min-height="95vh">
          <v-container>
            <v-card-text>
              <!-- Logo superior -->
              <v-row align="center" justify="center" class="mb-3">
                <v-img src="@/assets/logo-verde.png" alt="Logo" max-width="50" />
              </v-row>
              <div class="text-h6 text-center mb-5"><span v-if="this.register">Registrarse</span><span
                  v-else>Entrar</span></div>

              <v-form ref="form" v-model="valid" enctype="multipart/form-data">
                <!-- Botones de redes sociales -->
                <v-row class="mb-3">
                  <v-col cols="12" md="6">
                    <v-btn block outlined style="background-color: #f5f5f5;" color="#f5f5f5" @click="loginWithGoogle">
                      <v-icon left>mdi-google</v-icon> Google
                    </v-btn>
                  </v-col>
                  <v-col cols="12" md="6">
                    <v-btn block outlined style="background-color: #f5f5f5;" color="#f5f5f5" @click="loginWithFacebook">
                      <v-icon left>mdi-facebook</v-icon> Facebook
                    </v-btn>
                  </v-col>
                </v-row>

                <!-- Divider con texto "Or" -->
                <v-row class="align-center justify-center mb-3">
                  <v-col cols="12" md="5"><v-divider /></v-col>
                  <v-col cols="12" md="2"><span>Or</span></v-col>
                  <v-col cols="12" md="5"><v-divider /></v-col>
                </v-row>


                <!-- Campos del formulario -->
                <div class="text-body-2 text-medium-emphasis" v-if="this.register">
                  <v-text-field v-model="editedItem.name" density="compact" variant="outlined" class="mb-0"
                    placeholder="Nombre y Apellidos" prepend-inner-icon="mdi-account-outline" :rules="nameRules" />
                </div>
                <v-text-field v-model="editedItem.email" density="compact" variant="outlined" class="mb-0"
                  placeholder="Correo Electrónico" prepend-inner-icon="mdi-email-outline"
                  :rules="this.register ? emailRules : []" />
                <div class="text-body-2 text-medium-emphasis" v-if="this.register">
                  <v-text-field v-model="editedItem.user" density="compact" variant="outlined" class="mb-0"
                    placeholder="Usuario" prepend-inner-icon="mdi-account" />
                </div>
                <v-text-field v-model="editedItem.password" :type="showPassword ? 'text' : 'password'" density="compact"
                  variant="outlined" :append-inner-icon="showPassword ? 'mdi-eye-off' : 'mdi-eye'"
                  placeholder="Contraseña" prepend-inner-icon="mdi-lock-outline"
                  @click:append-inner="showPassword = !showPassword" class="mb-0" />

                <!-- Checkbox de términos -->
                <v-checkbox v-model="editedItem.agreeTerms"
                  label="Al crear una cuenta, aceptas los términos de uso y nuestra política de privacidad." dense
                  v-if="this.register" />

                <!-- Botón de envío -->
                <v-btn block color="#03626C" :disabled="this.register ?? !(this.editedItem.agreeTerms && this.valid)"
                  :loading="loading" @click="login()"><span v-if="this.register">Crear Cuenta</span>
                  <span v-else>Entrar</span>
                </v-btn>
              </v-form>

              <!-- Enlace de login -->
              <v-row class="mt-4">
                <v-col cols="12" class="text-center">
                  <span class="text-body1" v-if="this.register">
                    ¿Ya tienes una cuenta?
                    <span style="cursor: pointer; color: #1976D2;" @click="goToLogin">
                      Entrar
                    </span>
                  </span>
                  <span class="text-body1" v-else>
                    ¿Deseas crear una cuenta?
                    <span style="cursor: pointer; color: #1976D2;" @click="goToLogin">
                      Registrar
                    </span>
                  </span>
                </v-col>
              </v-row>

            </v-card-text>
          </v-container>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>


<script>
import LocalStorageService from "@/LocalStorageService";
import { handleRequest } from "@/utils/api";
import router from '@/router/index';
export default {
  data: () => ({
    loading: false,
    snackbar: false,
    sb_type: '',
    sb_message: '',
    sb_timeout: 2000,
    sb_title: '',
    sb_icon: '',
    user: null,
    homes: [],
    editedItem: {
      id: '',
      name: '',
      email: '',
      user: '',
      password: '',
      agreeTerms: false,
    },
    defaultItem: {
      id: '',
      name: '',
      email: '',
      user: '',
      password: '',
      agreeTerms: false,
    },
    register: false,
    showPassword: false,
    data: {},
    valid: true,
    nameRules: [
      (v) => !!v || "El campo es requerido",
      (v) => (v && v.length <= 50) ||
        "El campo debe tener menos de 51 caracteres",
      (v) => (v && v.length >= 3) ||
        "El campo debe tener al menos de 3 caracteres",
    ],
    emailRules: [
      (v) => !!v || "El Correo Electrónico es requerido",
      (v) => /.+@.+\..+/.test(v) || "El Correo Electrónico no es válido",
    ],
  }),
  mounted() {
    // Obtiene los datos de la URL
    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);
    const userData = urlParams.get('user');

    if (userData) {
      // Decodifica y parsea los datos
      const parsedData = JSON.parse(decodeURIComponent(userData));
      console.log('Datos recibidos:', parsedData);

      // Usa los datos según sea necesario
      this.user = parsedData;

      const user = this.user;
      LocalStorageService.setItem('token', user.token);
      LocalStorageService.setItem('authenticateUser', true);
      LocalStorageService.setItem('user_id', user.id);
      LocalStorageService.setItem('user', user.userName);
      LocalStorageService.setItem('image', user.personImage);
      LocalStorageService.setItem('name', user.personName);
      LocalStorageService.setItem('person_id', user.personId);
      LocalStorageService.setItem('home_id', user.home);
      LocalStorageService.setItem('userLocale', user.language);

      // Reiniciar el formulario
      this.editedItem = Object.assign({}, this.defaultItem);

      // Redirigir al Dashboard
      setTimeout(() => {
        router.push({ name: 'Dashboard' });
      }, 1000);
    }

    this.register = false;
  },
  methods: {
    goToLogin() {
      this.$nextTick(() => {
        this.editedItem = Object.assign({}, this.defaultItem);
      });
      // Alterna el valor de la variable 'register' entre true y false
      this.register = !this.register;
    },
    async login() {
      this.loading = true; // Iniciar loader
      if (!this.register) {
        try {
          // Preparar el payload
          this.data.email = this.editedItem.email;
          this.data.password = this.editedItem.password;
          // Petición al servidor utilizando handleRequest
          const result = await handleRequest({
            endpoint: 'login',
            method: 'POST',
            data: this.data,
            includeToken: false
          });

          if (result.success) {
            this.user = result.data;

            // Guardar datos en LocalStorage
            const user = this.user;
            //console.log('Datos recibidos:', user);
            LocalStorageService.setItem('token', user.token);
            LocalStorageService.setItem('authenticateUser', true);
            //LocalStorageService.setItem('role_id', user.roleId);
            LocalStorageService.setItem('user_id', user.id);
            LocalStorageService.setItem('user', user.userName);
            LocalStorageService.setItem('image', user.personImage);
            LocalStorageService.setItem('name', user.personName);
            //LocalStorageService.setItem('role', user.nameRole);
            LocalStorageService.setItem('person_id', user.personId);
            LocalStorageService.setItem('home_id', user.home);
            LocalStorageService.setItem('userLocale', user.language);
            // Puedes descomentar los siguientes si son necesarios
            // LocalStorageService.setItem('branch_id', user.branch_id);
            // LocalStorageService.setItem('charge', user.charge);
            // LocalStorageService.setItem('charge_id', user.charge_id);
            // LocalStorageService.setItem('nameBranch', user.nameBranch);
            // LocalStorageService.setItem('nameBusiness', user.nameBusiness);
            // LocalStorageService.setItem('imageBusiness', user.imageBusiness);
            // LocalStorageService.setItem('business_id', user.business_id);
            // LocalStorageService.setItem('permissionsUser', user.permissions);
            // Reiniciar el formulario
            this.editedItem = Object.assign({}, this.defaultItem);
            // Manejo en caso de éxito
            setTimeout(() => {
              router.push({ name: 'Dashboard' });
            }, 1000);
          } else {
            // Manejo de errores definidos por la API
            this.showAlert('warning', result.message || 'Error inesperado', 3000);
          }
        } catch (error) {
          // Manejo de errores no controlados
          this.showAlert('error', 'Ocurrió un error inesperado al iniciar sesión.', 3000);
        } finally {
          this.loading = false; // Detener el loader
        }
      } else {
        try {
          // Preparar el payload
          this.data.name = this.editedItem.name;
          this.data.email = this.editedItem.email;
          this.data.password = this.editedItem.password;
          // Petición al servidor utilizando handleRequest
          const result = await handleRequest({
            endpoint: 'register',
            method: 'POST',
            data: this.data,
            includeToken: false
          });

          if (result.success) {
            // Manejo en caso de éxito
            this.showAlert('success', 'Registrado correctamente', 1000);
            this.user = result.data;

            // Guardar datos en LocalStorage
            const user = this.user;
            LocalStorageService.setItem('token', user.token);
            LocalStorageService.setItem('authenticateUser', true);
            //LocalStorageService.setItem('role_id', user.roleId);
            LocalStorageService.setItem('user_id', user.id);
            LocalStorageService.setItem('user', user.userName);
            LocalStorageService.setItem('image', user.personImage);
            LocalStorageService.setItem('name', user.personName);
            //LocalStorageService.setItem('role', user.nameRole);
            LocalStorageService.setItem('person_id', user.personId);
            LocalStorageService.setItem('home_id', user.home);
            LocalStorageService.setItem('userLocale', user.language);
            // Puedes descomentar los siguientes si son necesarios
            // LocalStorageService.setItem('branch_id', user.branch_id);
            // LocalStorageService.setItem('charge', user.charge);
            // LocalStorageService.setItem('charge_id', user.charge_id);
            // LocalStorageService.setItem('nameBranch', user.nameBranch);
            // LocalStorageService.setItem('nameBusiness', user.nameBusiness);
            // LocalStorageService.setItem('imageBusiness', user.imageBusiness);
            // LocalStorageService.setItem('business_id', user.business_id);
            // LocalStorageService.setItem('permissionsUser', user.permissions);

            // Reiniciar el formulario
            this.editedItem = Object.assign({}, this.defaultItem);

            // Redirigir al Dashboard
            setTimeout(() => {
              router.push({ name: 'Dashboard' });
            }, 1000);
          } else {
            // Manejo de errores definidos por la API
            this.showAlert('warning', result.message || 'Error inesperado', 3000);
          }
        } catch (error) {
          // Manejo de errores no controlados
          this.showAlert('error', 'Ocurrió un error inesperado al iniciar sesión.', 3000);
        } finally {
          this.loading = false; // Detener el loader
        }
      }
    },
    loginWithGoogle() {
      // Abrir una nueva ventana emergente
      window.location.href = "http://huoon.api.wezen.cl/api/login-google";
    },
    loginWithFacebook() {
      this.showAlert('success', 'Aun no esta implementada esta funcionalidad', 1000);
    },
    togglePasswordVisibility() {
      this.showPassword = !this.showPassword;
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
  },
};
</script>

<style scoped>
.background-img {
  height: 100%;
  /* Ocupa toda la altura */
  object-fit: cover;
  /* Imagen ajustada */
}

.v-card {
  border-radius: 8px;
  /* Bordes redondeados */
}

.v-btn {
  color: white;
  /* Color blanco para texto */
}

.avatar-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  /* Ajusta la imagen para que cubra el contorno del avatar */
  border-radius: 50%;
  /* Asegura que la imagen sea circular */
}
</style>