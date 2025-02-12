<template>
    <v-snackbar class="mt-12" location="right top" :timeout="sb_timeout" :color="sb_type" elevation="24"
        :multi-line="true" vertical v-model="snackbar">
        <v-row>
            <v-col md="2">
                <v-avatar :icon="sb_icon" color="f" size="40"></v-avatar>
            </v-col>
            <v-col md="10">
                <h4>{{ sb_title }}</h4>
                {{ sb_message }}
            </v-col>
        </v-row>
    </v-snackbar>
    <!--<v-container fluid fill-height>-->
        <v-card elevation="6" class="mx-2">
            <v-toolbar color="#03626C">
                <v-row align="center">
                    <v-col cols="12" md="8" class="grow ml-4">
                        <span class="text-subtitle-1"><strong>Listado de Estados</strong></span>
                    </v-col>
                    <v-col cols="12" md="3" class="text-right">
                        <v-btn class="text-subtitle-1 ml-12" color="white" variant="tonal" elevation="2"
                            prepend-icon="mdi-plus-circle" @click="showAddStatus">
                            Agregar Nuevo Estado
                        </v-btn>
                    </v-col>
                </v-row>
            </v-toolbar>

            <v-card-text>
                <v-text-field class="mt-1 mb-1" v-model="search" append-icon="mdi-magnify" label="Buscar" single-line
                    hide-details>
                </v-text-field>
                <v-data-table :headers="headers" :search="search" :items="statuses" class="elevation-1"
                    style="max-height: 68vh; overflow-y: auto;" :items-per-page-text="'Elementos por páginas'"
                    no-data-text="No hay datos disponibles" :loading="loading" loading-text="Cargando datos...">
                    <template v-slot:item.actions="{ item }">
                        <v-btn density="comfortable" icon="mdi-pencil" @click="editItem(item)" color="#1976D2"
                            variant="tonal" elevation="1" title="Editar Estado"></v-btn>
                        <v-btn density="comfortable" icon="mdi-delete" @click="deleteItem(item)" color="#DA7171"
                            variant="tonal" elevation="1" title="Eliminar Estado"></v-btn>
                    </template>
                    <template v-slot:item.name="{ item }">
                        <v-avatar class="mr-1" elevation="3" color="grey-lighten-4" size="small">
                            <v-icon>{{ item.icon }}</v-icon>
                        </v-avatar>
                        {{ item.name }}
                    </template>
                    <template v-slot:item.type="{ item }">
                        <v-avatar class="mr-1" elevation="3" :color="getTypeColor(item.type)" size="small">
                            <v-icon :title="item.type">
                                {{ getTypeIcon(item.type) }}
                            </v-icon>
                        </v-avatar>
                    </template>
                    <template v-slot:item.color="{ item }">
                        <v-avatar class="mr-1 avatar-border" elevation="3" size="large"
                            :color="`#${item.color}`"></v-avatar>
                    </template>
                </v-data-table>
            </v-card-text>
        </v-card>
    <!--</v-container>-->
    <v-dialog v-model="dialog" max-width="600px">
        <v-form ref="form" v-model="valid">
            <v-card>
                <v-toolbar color="#03626C">
                    <span class="text-subtitle-2 ml-4">{{ formTitle }}</span>
                </v-toolbar>
                <v-card-text>
                    <v-container>
                        <v-row>
                            <v-col cols="12" md="6">
                                <v-text-field v-model="editedItem.name" clearable label="Nombre"
                                    prepend-icon="mdi-tag-outline" variant="underlined"
                                    :rules="nameRules"></v-text-field>
                            </v-col>
                            <v-col cols="12" md="6">
                                <v-autocomplete :no-data-text="'No hay datos disponibles'" v-model="editedItem.type"
                                    :items="typeOptions" label="Tipos" prepend-icon="mdi-label-outline"
                                    item-title="name" item-value="id" variant="underlined" :rules="selectRules">
                                    <template v-slot:item="{ props, item }">
                                        <v-list-item v-bind="props" :prepend-icon="getTypeDetails(item.raw.id).icon"
                                            :title="getTypeDetails(item.raw.id).name">
                                        </v-list-item>
                                    </template>
                                </v-autocomplete>
                            </v-col>
                            <v-col cols="12" md="6">
                                <v-text-field v-model="editedItem.color" clearable label="Color"
                                    prepend-icon="mdi-palette" variant="underlined"></v-text-field>
                            </v-col>
                            <v-col cols="12" md="6">
                                <v-text-field v-model="editedItem.icon" clearable label="Ícono"
                                    prepend-icon="mdi-emoticon-outline" variant="underlined"></v-text-field>
                            </v-col>
                            <v-col cols="12" md="12">
                                <v-textarea v-model="editedItem.description" clearable label="Descripción"
                                    prepend-icon="mdi-note" variant="underlined"></v-textarea>
                            </v-col>
                        </v-row>
                    </v-container>
                </v-card-text>
                <v-divider></v-divider>
                <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn color="#DA7171" variant="flat" @click="close">Cancelar</v-btn>
                    <v-btn color="#03626C" variant="flat" :loading="loading" @click="save"
                        :disabled="!valid">Aceptar</v-btn>
                </v-card-actions>
            </v-card>
        </v-form>
    </v-dialog>

    <v-dialog v-model="dialogDelete" max-width="500px">
        <v-card>
            <v-toolbar color="#DA7171">
                <span class="text-subtitle-2 ml-4"> Eliminar un estado</span>
            </v-toolbar>
            <v-card-text class="mt-2 mb-2"> ¿Desea eliminar el estado?</v-card-text>
            <v-divider></v-divider>
            <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn color="#DA7171" variant="flat" @click="closeDelete">Cancelar</v-btn>
                <v-btn color="#03626C" variant="flat" :loading="loading" @click="deleteItemConfirm">Aceptar</v-btn>
            </v-card-actions>
        </v-card>
    </v-dialog>
</template>

<script>
import { handleRequest } from "@/utils/api"; // Ruta al archivo
export default {
    data: () => ({
        snackbar: false,
        sb_type: '',
        sb_message: '',
        sb_timeout: 2000,
        sb_title: '',
        sb_icon: '',
        valid: true,
        loading: false,
        dialog: false,
        dialogDelete: false,
        statuses: [],
        data: {},
        typeOptions: [
            {
                'name': 'Tarea',
                'id': 'Task',
                'icon': 'mdi-clipboard-text'
            },
            {
                'name': 'Producto',
                'id': 'Product',
                'icon': 'mdi-cart'
            },
            {
                'name': 'Hogar',
                'id': 'Home',
                'icon': 'mdi-home'
            }
        ],
        headers: [
            { title: 'Nombre', value: 'name', width: '25%' },
            { title: 'Color', value: 'color', width: '5%' },
            { title: 'Tipo', value: 'type', width: '10%' },
            { title: 'Descripción', value: 'description', width: '40%' },
            { title: 'Acciones', value: 'actions', sortable: false, width: '20%' },
        ],

        editedItem: {
            id: '',
            name: '',
            color: '',
            icon: '',
            description: '',
            type: '',
        },
        defaultItem: {
            id: '',
            name: '',
            color: '',
            icon: '',
            description: '',
            type: '',
        },
        editedIndex: -1,
        search: '',
        nameRules: [
            (v) => !!v || "El campo es requerido",
            (v) => (v && v.length <= 50) ||
                "El campo debe tener menos de 51 caracteres",
            (v) => (v && v.length >= 3) ||
                "El campo debe tener al menos de 3 caracteres",
        ],
        selectRules: [(v) => !!v || "Seleccionar al menos un elemento"],
    }),
    computed: {
        formTitle() {
            return this.editedIndex === -1 ? 'Agregar Nuevo Estado' : 'Editar Estado';
        }
    },
    mounted() {
        this.initialize();
    },
    methods: {
        getTypeDetails(type) {
            switch (type) {
                case 'Task':
                    return { icon: 'mdi-clipboard-text', name: 'Tarea' }; // Ícono y nombre para tareas
                case 'Product':
                    return { icon: 'mdi-cart', name: 'Producto' }; // Ícono y nombre para sistema
                case 'Home':
                    return { icon: 'mdi-home', name: 'Hogar' }; // Ícono y nombre para hogar
                default:
                    return { icon: 'mdi-help-circle', name: 'Desconocido' }; // Ícono y nombre por defecto
            }
        },
        showAddStatus() {
            this.dialog = true;
        },
        close() {
            this.dialog = false;
            this.$nextTick(() => {
                this.editedItem = Object.assign({}, this.defaultItem);
            });
            this.editedIndex = -1;
        },
        async initialize() {
            try {
                this.loading = true;
                const result = await handleRequest({
                    endpoint: 'status',
                    method: 'GET',
                });

                if (result.success) {
                    // Si la solicitud es exitosa, asignamos las sucursales
                    this.statuses = result.data?.status || [];
                } else {
                    // Si no hay datos, asignamos un array vacío
                    this.statuses = [];
                    this.showAlert('warning', result.message || 'No hay estados disponibles.', 3000);
                }
            } catch (error) {
                this.loading = false;
                // Captura de errores no controlados
                this.showAlert('error', 'Ocurrió un error inesperado al cargar los estados.', 3000);
            } finally {
                this.loading = false;
            }
        },
        getTypeIcon(type) {
            switch (type) {
                case 'Task':
                    return 'mdi-clipboard-text'; // Ícono para tareas
                case 'Product':
                    return 'mdi-cart'; // Ícono para productos
                case 'Home':
                    return 'mdi-home'; // Ícono para hogar
                default:
                    return 'mdi-help-circle'; // Ícono por defecto
            }
        },
        getTypeColor(type) {
            switch (type) {
                case 'Task':
                    return '#FFB300'; // Color sugerente para tareas (amarillo)
                case 'Product':
                    return '#43A047'; // Color sugerente para productos (verde)
                case 'Home':
                    return '#03626C'; // Color base para hogar
                default:
                    return '#E0E0E0'; // Color gris claro para otros tipos
            }
        },
        async save() {
            this.loading = true;
            if (this.editedIndex === -1) {
                this.valid = false;
                this.data.name = this.editedItem.name;
                this.data.color = this.editedItem.color;
                this.data.icon = this.editedItem.icon;
                this.data.description = this.editedItem.description;
                this.data.type = this.editedItem.type;
                try {
                    const result = await handleRequest({
                        endpoint: 'status',
                        method: 'POST',
                        data: this.data
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
                    this.loading = false;
                }
            } else {
                this.valid = false;
                this.data.id = this.editedItem.id;
                this.data.name = this.editedItem.name;
                this.data.color = this.editedItem.color;
                this.data.icon = this.editedItem.icon;
                this.data.description = this.editedItem.description;
                this.data.type = this.editedItem.type;

                try {
                    const result = await handleRequest({
                        endpoint: 'status',
                        method: 'PUT',
                        data: this.data
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
                    this.loading = false;
                }
            }
            this.close();
        },
        editItem(item) {
            this.editedIndex = 1;
            this.editedItem = Object.assign({}, item);
            this.dialog = true;
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
            this.loading = true;
            try {
                let request = {
                    id: this.editedItem.id
                };
                const result = await handleRequest({
                    endpoint: 'status-destroy',
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
                this.showAlert('warning', 'El archivo de imagen debe ser de máximo 500 KB', 3000);
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
            }
            reader.readAsDataURL(file);
        },
    },
};
</script>
<style scoped>
.avatar-border {
    border: 2px solid #000;
    /* Aquí se define el borde */
}
</style>