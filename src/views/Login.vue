<template>
  <v-snackbar v-model="snackbar" :timeout="sb_timeout" :color="sb_type" location="top right" elevation="24" multi-line>
    <v-row no-gutters align="center">
      <v-col cols="auto">
        <v-avatar :icon="sb_icon" :color="sb_type" size="40" class="me-3"></v-avatar>
      </v-col>
      <v-col>
        <strong>{{ sb_title }}</strong><br />
        {{ sb_message }}
      </v-col>
    </v-row>
  </v-snackbar>

  <v-container fluid class="login-wrapper pa-0" style="height: 100vh;">
  <v-row no-gutters class="flex-column flex-md-row" style="min-height: 100vh;">
    <!-- PANEL IZQUIERDO (Onboarding) -->
    <v-col cols="12" md="7" class="d-flex flex-column justify-center align-center px-5 dark-panel">


      <!-- Logo -->
      <v-img src="@/assets/logo-verde.png" max-width="80" class="mb-6" />

      <!-- Carrusel -->
      <div style="max-width: 100%; width: 100%; overflow: hidden;">
      <v-carousel 
          height="150px" 
          show-arrows="hover" 
          hide-delimiter-background 
          cycle 
          interval="5000"
          class="onboarding-carousel"
          style="
        max-width: 100%;
        margin: 0 auto;
      "
        >
          <v-carousel-item 
            v-for="(slide, i) in slides" 
            :key="i"
            style="
              display: flex;
              justify-content: center;
              align-items: flex-start; /* Contenido al inicio vertical */
              padding-top: 20px; /* Espacio mínimo arriba */
              height: 100%;
            "
          >
            <div class="text-center" style="width: 100%">
              <h2 class="text-h5 text-white font-weight-bold mb-3">
              {{ slide.title }} <span style="color: #006064">{{ slide.emphasis }}</span><br />
              {{ slide.subtitle }}
            </h2>
            <p class="text-white text-subtitle-2" style="max-width: 360px; opacity: 0.8; margin: auto;">
              {{ slide.description }}
            </p>
          </div>
        </v-carousel-item>
      </v-carousel>
      </div>
    </v-col>

    <!-- PANEL DERECHO (Login) -->
    <v-col cols="12" md="5" class="d-flex flex-column justify-center align-center pa-4 bg-white">
      <v-card class="w-100" max-width="500" flat>

        <v-row class="mb-6 mt-2 ">

          <v-avatar class="ml-2" image="@/assets/logo-verde.png" size="60"></v-avatar>

          <span class="text-h5 font-weight-bold mt-4 ml-3 text-cyan-darken-3">huoon</span>
        </v-row>



        <p class="text-h5 font-weight-bold ">Log in to Your Account</p>

        <p class="text-subtitle-2 mb-6 font-weight-light">Welcome Back! Select method to log in:</p>

        <v-btn size="x-large" prepend-icon="mdi-google" class="flex-grow-1" variant="tonal" color="info"
          style="text-transform: none;" rounded="lg" @click="loginWithGoogle">
          Google&nbsp;&nbsp;&nbsp;&nbsp;
        </v-btn>
        <v-btn size="x-large" prepend-icon="mdi-facebook" class="flex-grow-1 ml-12" style="text-transform: none;"
          variant="tonal" color="primary" rounded="lg" @click="loginWithFacebook">
          Facebook&nbsp;&nbsp;
        </v-btn>


         <v-form ref="form" v-model="valid">
        <div class="text-center mt-6 text-caption my-2">Or sign in with</div>

        <v-text-field v-model="editedItem.name" variant="outlined" class="mb-3" v-if="this.register"
          placeholder="Name" prepend-inner-icon="mdi-account-outline" :rules="nameRules" density="comfortable"/>

        <v-text-field v-model="editedItem.email" label="Email" variant="outlined" placeholder="johndoe@mail.com"
          density="comfortable" class="mb-3" :rules="this.register ? emailRules : []"/>

        <v-text-field v-model="editedItem.password" label="Password" variant="outlined" placeholder="password"
          :type="showPassword ? 'text' : 'password'" :append-inner-icon="showPassword ? 'mdi-eye-off' : 'mdi-eye'"
          @click:append-inner="showPassword = !showPassword" density="comfortable" class="mb-5" :rules="reuquiredRules"/>

        <v-text-field v-model="editedItem.user" density="comfortable" variant="outlined" class="mb-3" v-if="this.register"
          placeholder="User" prepend-inner-icon="mdi-account" :rules="reuquiredRules"/>

        <v-btn block size="x-large" color="cyan-darken-3" class="text-white text-subtitle-1 mb-3"
          style="text-transform: none;" rounded="lg" :loading="loading" @click="login()" :disabled="this.register ? !this.valid : false">
          Sign In →
        </v-btn>
        </v-form>
        <div class="text-center mt-2">
          <span class="text-body-2 text-decoration-underline" style="cursor: pointer;">
            Forgot password?
          </span>
        </div>



        <v-row justify="center" class="mb-2 mt-4">
          <span class="text-caption">Don't have an account?
            <span class="text-primary" style="cursor: pointer;" @click="goToLogin"> Sign Up</span>
          </span>
        </v-row>

        <div class="text-caption text-grey text-center mt-10">
          © 2025 Huoon · <a href="#" class="text-primary">Privacy Policy</a> · <a href="#"
            class="text-primary">Support</a>
        </div>
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

    onboardingStep: 0,
    onboardingSlides: [
      {
        title: "Administra tu hogar",
        description: "Organiza tareas, eventos y finanzas en un solo lugar.",
        icon: "mdi-home-city-outline"
      },
      {
        title: "Comparte con tu familia",
        description: "Todos los miembros pueden colaborar y mantenerse al tanto.",
        icon: "mdi-account-group-outline"
      },
      {
        title: "Accede desde cualquier lugar",
        description: "Tu hogar virtual siempre contigo.",
        icon: "mdi-cellphone-link"
      }
    ],
    // ...lo demás ya lo tienes


    slides: [
      {
        title: "Bienvenido a",
        emphasis: "Huoon",
        subtitle: "tu hogar organizado",
        description: "Centraliza tareas, miembros, productos y documentos del hogar en un solo lugar."
      },
      {
        title: "Comparte tu casa",
        emphasis: "con tu familia",
        subtitle: "",
        description: "Crea un hogar colaborativo donde todos participan: pareja, hijos, roomies o cuidadores."
      },
      {
        title: "Tareas y recordatorios",
        emphasis: "inteligentes",
        subtitle: "",
        description: "Automatiza rutinas, recibe alertas importantes y mantén tu hogar al día fácilmente."
      },
      {
        title: "Todo bajo control",
        emphasis: "desde tu celular",
        subtitle: "",
        description: "Consulta información de compras, pagos, recetas, calendarios y más desde cualquier lugar."
      },
      {
        title: "Diseñado para ti",
        emphasis: "y tu bienestar",
        subtitle: "",
        description: "Huoon se adapta a tu estilo de vida: incluye herramientas útiles para todos los miembros del hogar, incluyendo niños y adultos mayores."
      }
    ],
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
    reuquiredRules: [
      (v) => !!v || "El campo es requerido",
      (v) => (v && v.length >= 3) ||
        "El campo debe tener al menos de 3 caracteres",
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

.dark-panel {
  background: radial-gradient(circle at center, #1d1d1d, #0a0a0a);
  color: white;
}

.login-wrapper {
  min-height: 100vh;
  background: white;
}
/* Ajustes generales */
.login-wrapper {
  min-height: 100vh;
}

/* Panel izquierdo (carrusel) */
.dark-panel {
  background: radial-gradient(circle at center, #1d1d1d, #0a0a0a);
  min-height: 40vh; /* Altura mínima en móvil */
}

/* Panel derecho (login) */
.bg-white {
  min-height: 60vh; /* Altura mínima en móvil */
}

/* Ajustes para desktop */
@media (min-width: 960px) {
  .dark-panel {
    min-height: 100vh;
  }
  
  .bg-white {
    min-height: 100vh;
  }
}

/* Ajustes del carrusel */
.onboarding-carousel {
  height: auto;
  max-height: 60vh;
  margin: 20px 0;
}
</style>