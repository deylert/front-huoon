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
    <!--<v-container fluid fill-height>-->
    <v-card elevation="6" class="mx-2">
        <v-toolbar color="#03626C">
            <v-row align="center">
                <v-col cols="12" md="8" class="grow ml-4">
                    <span class="text-subtitle-1"><strong>Emergencias</strong></span>
                </v-col>
                <v-col cols="12" md="3" class="text-right">
                    <v-btn class="text-subtitle-1 ml-12" color="white" variant="tonal" elevation="2"
                        prepend-icon="mdi-plus-circle" @click="showAdd">
                        Agregar Emergencia
                    </v-btn>
                </v-col>
            </v-row>
        </v-toolbar>

        <v-card-text>
            <v-text-field class="mt-1 mb-1" v-model="search" append-icon="mdi-magnify" label="Buscar" single-line
                hide-details>
            </v-text-field>
            <v-data-table :headers="headers" :search="search" :items="emergencies" class="elevation-1"
                style="max-height: 68vh; overflow-y: auto;" :items-per-page-text="'Elementos por páginas'"
                no-data-text="No hay datos disponibles" :loading="loading" loading-text="Cargando datos..." dense>
                <template v-slot:item.actions="{ item }">
                    <v-btn density="comfortable" icon="mdi-pencil" @click="editItem(item)" color="primary"
                        variant="tonal" elevation="1" title="Editar Consulta Médica"></v-btn>
                    <v-btn density="comfortable" icon="mdi-delete" @click="deleteItem(item)" color="#DA7171"
                        variant="tonal" elevation="1" title="Eliminar Consulta Médica"></v-btn>
                </template>
                <!-- Columna de Vacunas -->
                <template v-slot:item.contactAlerted="{ item }">
                    <v-list dense style="max-height: 150px; overflow-y: auto;">
                        <v-list-item v-for="(contactAlerted, index) in item.contactAlerted" :key="index">
                            <v-tooltip location="top">
                                <template v-slot:activator="{ props }">
                                    <span v-bind="props">{{ contactAlerted.name }}</span>
                                </template>
                                <span>
                                    <strong>Nombre:</strong> {{ contactAlerted.name }}
                                    <br>
                                    <strong>Teléfono:</strong> {{ contactAlerted.phone }}
                                </span>
                            </v-tooltip>
                        </v-list-item>
                    </v-list>
                </template>
            </v-data-table>
        </v-card-text>
    </v-card>
    <!--</v-container>-->

    <v-dialog v-model="dialog" max-width="800px">
        <v-form ref="form" v-model="valid">
            <v-card>
                <!-- Toolbar con título -->
                <v-toolbar color="#03626C">
                    <span class="text-subtitle-2 ml-4">{{ formTitle }}</span>
                </v-toolbar>

                <!-- Campos principales -->
                <v-card-text>
                    <v-container>
                        <v-tabs v-model="tab" vertical>
                            <v-tab value="general" :class="tab === 'general' ? 'selected-tab' : ''">Datos Generales</v-tab>
                            <v-tab value="contact" :class="tab === 'contact' ? 'selected-tab' : ''">Contactos de Emergencias</v-tab>
                        </v-tabs>
                        <v-window v-model="tab" min-height="75vh" class="mt-2">
                            <v-window-item value="general">
                                <v-row>
                                    <v-col cols="12" md="6">
                                        <v-text-field v-model="editedItem.symptoms" label="Síntomas"
                                            prepend-icon="mdi-heart-pulse" variant="underlined" :rules="nameRules"></v-text-field>
                                    </v-col>
                                    <v-col cols="12" md="6">
                                        <v-text-field v-model="editedItem.location" label="Ubicación"
                                            prepend-icon="mdi-map-marker-outline" variant="underlined"></v-text-field>
                                    </v-col>
                                    <v-col cols="12" md="6">
                                        <v-menu v-model="menu" :close-on-content-click="false" :nudge-right="40"
                                            transition="scale-transition" offset-y min-width="290px">
                                            <template v-slot:activator="{ props }">
                                                <v-text-field v-bind="props" :modelValue="dateFormatted"
                                                    variant="underlined" prepend-icon="mdi-calendar" label="Fecha"
                                                    density="compact"></v-text-field>
                                            </template>
                                            <v-locale-provider locale="es">
                                                <v-date-picker header="Calendario" title="Seleccione la fecha"
                                                    color="#03626C" :modelValue="input" @update:model-value="updateDate"
                                                    format="yyyy-MM-dd"
                                                    :min="new Date().toISOString().split('T')[0]"></v-date-picker>
                                            </v-locale-provider>
                                        </v-menu>
                                    </v-col>
                                    <v-col cols="12" md="6">
                                        <v-autocomplete :no-data-text="'No hay datos disponibles'"
                                            v-model="editedItem.type_id" :items="types" label="Tipos"
                                            prepend-icon="mdi-tag-outline" item-title="name" item-value="id"
                                            variant="underlined" :rules="selectRules" density="compact">
                                            <template v-slot:item="{ props, item }">
                                                <v-list-item v-bind="props">
                                                    <v-list-item-subtitle class="d-flex flex-column">
                                                        <v-tooltip bottom>
                                                            <template v-slot:activator="{ props }">
                                                                <div class="truncate" v-bind="props"
                                                                    style="max-width: 200px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">
                                                                    <strong>Descripción:</strong> {{
                                                                        item.raw.description }}
                                                                </div>
                                                            </template>
                                                            <span>{{ item.raw.description }}</span>
                                                        </v-tooltip>
                                                    </v-list-item-subtitle>
                                                </v-list-item>
                                            </template>
                                        </v-autocomplete>
                                    </v-col>
                                    <v-col cols="12" md="12">
                                        <v-textarea v-model="editedItem.actionTaken" label="Acciones tomadas"
                                            prepend-icon="mdi-checkbox-marked-circle-outline"
                                            variant="underlined"></v-textarea>
                                    </v-col>
                                </v-row>
                            </v-window-item>
                            <v-window-item value="contact">
                                <!-- Tabla de Contactos -->
                                <v-row>
                                    <v-col cols="12">
                                        <v-card class="mb-4">
                                            <v-toolbar color="#03626C">
                                                <v-row align="center">
                                                    <v-col cols="12" md="8" class="grow ml-4">
                                                        <span class="text-subtitle-1"><strong>Contactos de
                                                                Emergencias</strong></span>
                                                    </v-col>
                                                    <v-col cols="12" md="3" class="text-right">
                                                        <v-btn class="text-subtitle-1 mr-2" color="white"
                                                            variant="tonal" elevation="2" prepend-icon="mdi-plus-circle"
                                                            @click="addContactAlerted">
                                                            Agregar Contacto
                                                        </v-btn>
                                                    </v-col>
                                                </v-row>
                                            </v-toolbar>
                                            <v-data-table :headers="contactAlertedHeaders"
                                                :items="editedItem.contactAlerted"
                                                no-data-text="No hay contactos de emergencis registradas" style="max-height: 40vh; overflow-y: auto;"
                                                :items-per-page-text="'Elementos por páginas'" dense>
                                                <template v-slot:item.actions="{ item }">
                                                    <v-btn density="comfortable" icon="mdi-pencil"
                                                        @click="editContactAlerted(item)" color="primary"
                                                        variant="tonal"></v-btn>
                                                    <v-btn density="comfortable" icon="mdi-delete"
                                                        @click="deleteContactAlerted(item)" color="error"
                                                        variant="tonal"></v-btn>
                                                </template>
                                            </v-data-table>
                                        </v-card>
                                    </v-col>
                                </v-row>
                            </v-window-item>
                        </v-window>

                    </v-container>
                </v-card-text>

                <!-- Divider y botones de acción -->
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

    <!-- Diálogo para agregar/editar vacuna -->
    <v-dialog v-model="contactAlertedDialog" max-width="500px">
        <v-card>
            <v-toolbar color="#03626C">
                <span class="text-subtitle-2 ml-4">{{ this.contactAlertedFormTitle }}</span>
            </v-toolbar>
            <v-card-text>
                <v-text-field v-model="editedContactAlerted.name" label="Nombre" variant="underlined"
                    prepend-icon="mdi-account-outline"></v-text-field>
                <v-text-field v-model="editedContactAlerted.phone" label="Teléfono" variant="underlined"
                    prepend-icon="mdi-phone-outline"></v-text-field>
            </v-card-text>
            <v-card-actions>
                <v-btn color="#DA7171" variant="flat" @click="closeContactAlertedDialog">Cancelar</v-btn>
                <v-btn color="#03626C" variant="flat" @click="saveContactAlerted">Guardar</v-btn>
            </v-card-actions>
        </v-card>
    </v-dialog>

    <v-dialog v-model="dialogDelete" max-width="500px">
        <v-card>
            <v-toolbar color="#DA7171">
                <span class="text-subtitle-2 ml-4"> Eliminar una Emergencia</span>
            </v-toolbar>
            <v-card-text class="mt-2 mb-2"> ¿Desea eliminar la Emergencia Seleccionada?</v-card-text>
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
import _ from 'lodash';
export default {
    data: () => ({
        snackbar: false,
        sb_type: '',
        sb_message: '',
        sb_timeout: 2000,
        sb_title: '',
        sb_icon: '',
        tab: null,
        valid: true,
        loading: false,
        dialog: false,
        dialogDelete: false,
        emergencies: [],
        types: [],
        data: {},
        page: 1,              // Página actual
        itemsPerPage: 5,     // Elementos por página
        totalItems: 0,        // Total de elementos disponibles
        headers: [
            { title: 'Fecha', value: 'date' },
            { title: 'Síntomas', value: 'symptoms' },
            { title: 'Acciones recomendadas', value: 'actionTaken' },
            { title: 'Ubicación', value: 'location' },
            { title: 'Contactos de emregecias', value: 'contactAlerted' },
            { title: 'Acciones', value: 'actions', sortable: false, width: '10%' },
        ],

        editedItem: {
            id: '',
            person_id: '',
            type_id: '',
            date: '',
            symptoms: '',
            contactAlerted: [],
            actionTaken: '',
            location: '',
        },
        defaultItem: {
            id: '',
            person_id: '',
            type_id: '',
            date: '',
            symptoms: '',
            contactAlerted: [],
            actionTaken: '',
            location: '',
        },
        originalItem: {
            id: '',
            person_id: '',
            type_id: '',
            date: '',
            symptoms: '',
            contactAlerted: [],
            actionTaken: '',
            location: '',
        },
        contactAlertedHeaders: [
            { title: 'Nombre', value: 'name' },
            { title: 'Teléfono', value: 'phone' },
            { title: 'Acciones', value: 'actions', sortable: false },
        ],

        contactAlertedDialog: false,
        editedContactAlerted: { id: null, name: '', phone: '' },
        contactAlertedFormTitle: 'Agregar Contacto de Emergencia',
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
    }),
    computed: {
        formTitle() {
            return this.editedIndex === -1 ? 'Agregar Emergencia' : 'Editar Emergencia';
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
        this.initialize();
    },
    methods: {
        // Método para manejar la paginación
        updatePage(page) {
            this.page = page;
            this.initialize();  // Recarga los almacenes con la nueva página
        },

        // Método para manejar el cambio de elementos por página
        updateItemsPerPage(itemsPerPage) {
            this.itemsPerPage = itemsPerPage;
            this.initialize();  // Recarga los almacenes con el nuevo número de elementos por página
        },
        async showAdd() {
            this.data = {};
            this.data.type = "Emergencia";
            try {
                const result = await handleRequest({
                    endpoint: 'get-type',
                    method: 'POST',
                    data: this.data
                });

                if (result.success) {
                    // Si la solicitud es exitosa, asignamos las sucursales
                    this.types = result.data?.types || [];
                } else {
                    // Si no hay datos, asignamos un array vacío
                    this.types = [];
                }
            } catch (error) {
                this.showAlert('error', 'Ocurrió un error inesperado al cargar los datos.', 3000);
            } finally {
                this.dialog = true;
            }
        },
        updateDate(val) {
            this.input = val;
            this.editedItem.date = this.dateFormatted;
            this.menu = false;
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
        addContactAlerted() {
            this.editedContactAlerted = { id: null, name: '', phone: '' };
            this.contactAlertedFormTitle = 'Agregar Contacto de Emergencia';
            this.contactAlertedDialog = true;
        },
        editContactAlerted(contact) {
            this.editedContactAlerted = { ...contact };
            this.contactAlertedFormTitle = 'Editar Contacto de Emergencia';
            this.contactAlertedDialog = true;
        },
        deleteContactAlerted(contact) {
            this.editedItem.contactAlerted = this.editedItem.contactAlerted.filter(v => v.id !== contact.id);
        },
        saveContactAlerted() {
            if (this.editedContactAlerted.id === null) {
                this.editedContactAlerted.id = this.editedItem.contactAlerted.length + 1;
                this.editedItem.contactAlerted.push(this.editedContactAlerted);
            } else {
                const index = this.editedItem.contactAlerted.findIndex(v => v.id === this.editedContactAlerted.id);
                this.editedItem.contactAlerted.splice(index, 1, this.editedContactAlerted);
            }
            this.closeContactAlertedDialog();
        },
        closeContactAlertedDialog() {
            this.contactAlertedDialog = false;
        },
        async initialize() {
            this.data = {};
            try {
                this.loading = true;
                const result = await handleRequest({
                    endpoint: 'get-emergency-person',
                    method: 'POST'
                });

                if (result.success) {
                    // Si la solicitud es exitosa, asignamos las sucursales
                    this.emergencies = result.data?.emergencies || [];
                } else {
                    // Si no hay datos, asignamos un array vacío
                    this.emergencies = [];
                }
            } catch (error) {
                this.loading = false;
                // Captura de errores no controlados
                this.showAlert('error', 'Ocurrió un error inesperado al cargar los roles.', 3000);
            } finally {
                this.loading = false;
            }
        },
        async save() {
            this.loading = true;
            if (this.editedIndex === -1) {
                this.editedContactAlerted = { id: null, name: '', phone: '' };
                this.valid = false;
                const fieldsToUpdate = ['person_id', 'contactAlerted', 'symptoms', 'date', 'type_id', 'actionTaken', 'location'];

                let updatedFields = Object.keys(this.editedItem)
                    .filter((key) => fieldsToUpdate.includes(key) && this.editedItem[key] !== this.originalItem[key])
                    .reduce((obj, key) => {
                        obj[key] = this.editedItem[key];
                        return obj;
                    }, {});
                if (Object.keys(updatedFields).length > 0) {
                    updatedFields.date = this.editedItem.date ? this.editedItem.date : new Date();
                    try {
                        const result = await handleRequest({
                            endpoint: 'emergency',
                            method: 'POST',
                            data: updatedFields
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
                }
                else {
                    this.loading = false;
                    this.showAlert("success", "Debe completar los datos de la emergencia.", 3000);
                }
            } else {
                const fieldsToUpdate = ['id', 'person_id', 'contactAlerted', 'symptoms', 'date', 'type_id', 'actionTaken', 'location'];
                let updatedFields = Object.keys(this.editedItem)
                    .filter((key) => fieldsToUpdate.includes(key) && (
                        key !== 'treatments' && key !== 'files' // Si no es un array, comparar directamente
                            ? this.editedItem[key] !== this.originalItem[key]
                            : this.areArraysDifferent(this.originalItem[key], this.editedItem[key]) // Comparar arrays
                    ))
                    .reduce((obj, key) => {
                        obj[key] = this.editedItem[key]; // Agregar el campo al objeto de campos actualizados
                        return obj;
                    }, {});
                if (Object.keys(updatedFields).length > 0) {
                    updatedFields.id = this.editedItem.id;
                    this.loading = true;
                    try {
                        const result = await handleRequest({
                            endpoint: 'emergency',
                            method: 'PUT',
                            data: updatedFields
                        });

                        // Manejo de la respuesta según el resultado
                        if (result.success) {
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
            this.originalItem = _.cloneDeep(item);
            this.editedItem = _.cloneDeep(item);
            this.data = {};
            this.data.type = "Emergencia";
            try {
                const result = await handleRequest({
                    endpoint: 'get-type',
                    method: 'POST',
                    data: this.data
                });

                if (result.success) {
                    // Si la solicitud es exitosa, asignamos las sucursales
                    this.types = result.data?.types || [];
                } else {
                    // Si no hay datos, asignamos un array vacío
                    this.types = [];
                }
            } catch (error) {
                this.showAlert('error', 'Ocurrió un error inesperado al cargar los datos.', 3000);
            } finally {
                this.dialog = true;
            }
        },
        // Función para comparar arrays de objetos
        areArraysDifferent(originalArray, editedArray) {
            // Ordenar ambos arrays por un campo único (por ejemplo, `id`)
            const sortedOriginal = [...originalArray].sort((a, b) => a.id - b.id);
            const sortedEdited = [...editedArray].sort((a, b) => a.id - b.id);

            // Comparar las cadenas generadas
            return JSON.stringify(sortedOriginal) !== JSON.stringify(sortedEdited);
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
                    endpoint: 'emergency-destroy',
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
    },
};
</script>
<style scoped>
/* Estilos para personalizar el scroll */
.v-list {
    scrollbar-width: thin;
    /* Para navegadores que soportan scrollbar-width */
    scrollbar-color: #888 #f1f1f1;
    /* Color del scroll */
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

.selected-tab {
    background-color: #03626C;
    /* Fondo del tab seleccionado */
    color: white;
    /* Texto blanco */
    border-radius: 4px;
    /* Esquinas redondeadas, opcional */
}
</style>