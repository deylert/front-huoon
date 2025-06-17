<template>
  <v-container style="min-width: 100%; min-height: 100%;">
    <v-row>
      <!-- Contenido principal -->
      <v-col cols="12">
        <!-- Tarjetas de Tareas -->
        <v-row>
          <v-col cols="12" md="4" lg="3" v-for="(task, index) in taskStatus" :key="index">
            <v-card class="mx-auto" :subtitle="task.count" :title="task.name"
              style="aspect-ratio: unset; border-radius: 20px; box-shadow: inset;">
              <template v-slot:prepend>
                <v-avatar :color="task.color">
                  <v-icon :icon="task.icon"></v-icon>
                </v-avatar>
              </template>
            </v-card>
          </v-col>
        </v-row>

        <!-- Ingresos y Gastos con Mensajes -->
        <v-row>


          <v-col cols="12" md="6">
            <div class="font-weight-bold">Seguimiento de salud</div>
            <v-card class="pa-4" style="border-radius: 20px; box-shadow: inset;">
              <LineChart class="pa-6" id="my-chart-id" :options="chartOptions" :data="chartData" padding="16" />
            </v-card>
          </v-col>


          <v-col cols="12" md="6" class="d-flex flex-column">
            <!-- Título -->
            <div class="font-weight-bold mb-4">Gastos e Ingresos</div>
            <!-- Contenedor de tarjetas -->
            <v-row>
              <v-col v-for="(finance, index) in finances" :key="index" cols="12" md="6" lg="12">
                <v-card style="border-radius: 20px; box-shadow: inset; font-size: 12px;">
                  <!-- Fila Principal -->
                  <v-row align="center">
                    <!-- Avatar -->
                    <v-col cols="2" class="d-flex justify-center align-center">
                      <v-avatar size="40" :color="finance.color">
                        <v-icon :icon="finance.icon" />
                      </v-avatar>
                    </v-col>

                    <!-- Datos -->
                    <v-col cols="8">
                      <v-row>
                        <v-col cols="3" class="font-weight-bold">Tipo de Tarjeta</v-col>
                        <v-col cols="3" class="font-weight-bold">Banco</v-col>
                        <v-col cols="3" class="font-weight-bold">Número</v-col>
                        <v-col cols="3" class="font-weight-bold">Titular</v-col>
                      </v-row>
                      <v-row>
                        <v-col cols="3">{{ finance.cardType }}</v-col>
                        <v-col cols="3">{{ finance.bank }}</v-col>
                        <v-col cols="3">**** **** **** {{ finance.cardNumber.slice(-4) }}</v-col>
                        <v-col cols="3">{{ finance.cardName }}</v-col>
                      </v-row>
                    </v-col>

                    <!-- Ver Más -->
                    <v-col cols="2" class="d-flex justify-center align-center">
                      <span color="primary" class="text-decoration-underline">Ver Más</span>
                    </v-col>
                  </v-row>
                </v-card>
              </v-col>
            </v-row>
          </v-col>
        </v-row>
        <v-row>

          <!-- Mensajes (a la izquierda) -->
          <v-col cols="12" md="6">
            <div class="font-weight-bold mb-4">Mensajes</div>
            <v-card style="border-radius: 20px; box-shadow: inset;">
              <v-divider></v-divider>
              <v-card-text>
                <!-- Lista de usuarios en una fila -->
                <v-row>
                  <v-col v-for="(user, index) in users" :key="index" cols="12" sm="6" md="4"
                    class="d-flex justify-center">
                    <!-- Contenedor de cada usuario dentro de la fila -->
                    <v-card class="d-flex flex-column align-center" style="height: 100%; box-shadow: none;">
                      <v-avatar size="40">
                        <v-img :src="user.avatar"></v-img>
                      </v-avatar>
                      <div class="mt-2">
                        <div class="align-center">{{ user.name }}</div>
                        <div class="subheading">{{ user.role }}</div>
                      </div>
                    </v-card>
                  </v-col>
                </v-row>
              </v-card-text>
            </v-card>
          </v-col>
          <v-col cols="12" md="6">
            <div class="font-weight-bold mb-4">Compras Recientes</div>
            <v-card style="border-radius: 20px; box-shadow: inset; font-size: 12px;">
              <v-data-table :items="recentOrders" dense>
                <template #headers>
                  <tr>
                    <th>Tracking No</th>
                    <th>Product Name</th>
                    <th>Price</th>
                    <th>Total Order</th>
                    <th>Total Amount</th>
                  </tr>
                </template>
                <template #body="{ items }">
                  <tr v-for="item in items" :key="item.tracking">
                    <td>{{ item.tracking }}</td>
                    <td>{{ item.product }}</td>
                    <td>{{ item.price }}</td>
                    <td>{{ item.order }}</td>
                    <td>{{ item.amount }}</td>
                  </tr>
                </template>
              </v-data-table>
            </v-card>
          </v-col>
        </v-row>
      </v-col>
    </v-row>
  </v-container>
</template>


<script>
import { Line as LineChart } from 'vue-chartjs'

import { Chart as ChartJS, Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale, PointElement, LineElement } from 'chart.js'
ChartJS.register(Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale, PointElement, LineElement,)
export default {
  components: { LineChart },
  data() {
    return {
      taskStatus: [
        { name: 'Haciendo', count: 4, color: 'yellow', icon: 'mdi-run' },
        { name: 'Pendientes', count: 4, color: 'blue', icon: 'mdi-clock' },
        { name: 'Incumplidas', count: 2, color: 'red', icon: 'mdi-alert-circle' },
        { name: 'Hechas', count: 3, color: 'green', icon: 'mdi-check-circle' },
      ],
      chartData: {
        labels: ['Ene', 'Feb', 'Mar', 'Abril', 'May', 'Jun', 'Jul', 'Agost', 'Sep', 'Oct', 'Nov', 'Dic'],
        datasets: [
          {
            label: 'Salud',
            backgroundColor: ["#03626C"],
            data: [1200, 1500, 1000, 1800, 1300, 900, 1700, 5000, 3000, 1000, 300, 100] // Datos estáticos de ejemplo
          }
        ]
      },
      chartOptions: {
        responsive: true
      },
      finances: [
        {
          icon: 'mdi-credit-card', // Ícono
          cardType: 'Secondary',
          bank: 'DBL Bank',
          cardNumber: '1234567890123456',
          cardName: 'William',
          color: 'blue' // Color del avatar
        },
        {
          icon: 'mdi-credit-card-outline', // Ícono
          cardType: 'Primary',
          bank: 'BRC Bank',
          cardNumber: '9876543210987654',
          cardName: 'Michel',
          color: 'green' // Color del avatar
        },
        {
          icon: 'mdi-bank', // Ícono
          cardType: 'Saving',
          bank: 'HSBC',
          cardNumber: '1234567890',
          cardName: 'Clara Elena',
          color: 'purple' // Color del avatar
        },
        // Más objetos...
      ],
      users: [
        {
          avatar: 'https://randomuser.me/api/portraits/men/32.jpg',
          name: 'Juan Pérez',
          role: 'Administrador'
        },
        {
          avatar: 'https://randomuser.me/api/portraits/women/44.jpg',
          name: 'Ana García',
          role: 'Usuario'
        },
        {
          avatar: 'https://randomuser.me/api/portraits/men/55.jpg',
          name: 'Carlos López',
          role: 'Moderador'
        },
        
        {
          avatar: 'https://randomuser.me/api/portraits/men/70.jpg',
          name: 'Javier Fernández',
          role: 'Soporte'
        },
        {
          avatar: 'https://randomuser.me/api/portraits/women/13.jpg',
          name: 'Carla Sánchez',
          role: 'Recursos Humanos'
        },
        {
          avatar: 'https://randomuser.me/api/portraits/men/25.jpg',
          name: 'David Pérez',
          role: 'Ventas'
        }
      ],
      recentOrders: [
        { tracking: '876364', product: 'Camera Lens', price: '$178', order: 325, amount: '$1,466,660' },
        { tracking: '876368', product: 'Black Dress', price: '$14', order: 53, amount: '$46,660' },
        { tracking: '876412', product: 'Argan Oil', price: '$21', order: 78, amount: '$46,676' },
        { tracking: '876621', product: 'EAU DE Parfum', price: '$32', order: 98, amount: '$46,981' },
      ],
    };
  },
};
</script>

<style scoped>
.custom-card {
  width: 100%;
  /* Responsivo */
  max-width: 200px;
  /* Tamaño máximo */
}

.scrollable-cards {
  max-height: 400px;
  overflow-y: auto;
  /* Scroll vertical cuando el contenido exceda */
}

.ml-3 {
  margin-left: 14px;
}

.subheading {
  font-size: 0.7em;
  color: #757575;
  text-align: center;
}
</style>
