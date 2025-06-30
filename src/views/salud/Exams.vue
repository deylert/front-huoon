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
                    <span class="text-subtitle-1"><strong>Exámenes Médicos</strong></span>
                </v-col>
                <v-col cols="12" md="3" class="text-right">
                    <v-btn class="text-subtitle-1 ml-12" color="white" variant="tonal" elevation="2"
                        prepend-icon="mdi-plus-circle" @click="showAdd">
                        Agregar Exámen Médico
                    </v-btn>
                </v-col>
            </v-row>
        </v-toolbar>

        <v-card-text>
            <v-text-field class="mt-1 mb-1" v-model="search" append-icon="mdi-magnify" label="Buscar" single-line
                hide-details>
            </v-text-field>
            <v-data-table :headers="headers" :search="search" :items="medicalexams" class="elevation-1"
                style="max-height: 68vh; overflow-y: auto;" :items-per-page-text="'Elementos por páginas'"
                no-data-text="No hay datos disponibles" :loading="loading" loading-text="Cargando datos...">
                <template v-slot:item.actions="{ item }">
                    <v-btn density="comfortable" icon="mdi-pencil" @click="editItem(item)" color="#1976D2"
                        variant="tonal" elevation="1" title="Editar Exámen Médico"></v-btn>
                    <v-btn density="comfortable" icon="mdi-delete" @click="deleteItem(item)" color="#DA7171"
                        variant="tonal" elevation="1" title="Eliminar Exámen Médico"></v-btn>
                </template>
                <template v-slot:item.archive="{ item }">
                    <v-btn density="comfortable" icon="mdi-eye" color="green"
                        v-if="item.archive && item.archive !== 'medicalexams/default.jpg'"
                        @click="openModal(item.archive)" variant="tonal" elevation="1" class="mr-1 mt-1 mb-1"
                        title="Ver detalles"></v-btn>
                </template>
            </v-data-table>
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
                            <v-col cols="12" md="12">
                                <v-text-field v-model="editedItem.results" label="Resultado" prepend-icon="mdi-note"
                                    variant="underlined"></v-text-field>
                            </v-col>
                            <v-col cols="12" md="6">
                                <v-menu v-model="menu" :close-on-content-click="false" :nudge-right="40"
                                    transition="scale-transition" offset-y min-width="290px">
                                    <template v-slot:activator="{ props }">
                                        <v-text-field v-bind="props" :modelValue="dateFormatted" variant="underlined"
                                            prepend-icon="mdi-calendar" label="Fecha" density="compact"></v-text-field>
                                    </template>
                                    <v-locale-provider locale="es">
                                        <v-date-picker header="Calendario" title="Seleccione la fecha" color="#03626C"
                                            :modelValue="input" @update:model-value="updateDate" format="yyyy-MM-dd"
                                            :min="new Date().toISOString().split('T')[0]"></v-date-picker>
                                    </v-locale-provider>
                                </v-menu>
                            </v-col>
                            <v-col cols="12" md="6">
                                <v-autocomplete :no-data-text="'No hay datos disponibles'" v-model="editedItem.type_id"
                                    :items="types" label="Tipos" prepend-icon="mdi-shield-check" item-title="name"
                                    item-value="id" variant="underlined" :rules="selectRules" density="compact">
                                    <template v-slot:item="{ props, item }">
                                        <v-list-item v-bind="props">
                                            <v-list-item-subtitle class="d-flex flex-column">
                                                <v-tooltip bottom>
                                                    <template v-slot:activator="{ props }">
                                                        <div class="truncate" v-bind="props"
                                                            style="max-width: 200px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">
                                                            <strong>Descripción:</strong> {{ item.raw.description }}
                                                        </div>
                                                    </template>
                                                    <span>{{ item.raw.description }}</span>
                                                </v-tooltip>
                                            </v-list-item-subtitle>
                                        </v-list-item>
                                    </template>
                                </v-autocomplete>
                            </v-col>
                        </v-row>
                        <v-row>
                            <v-col cols="12" md="6">
                                <v-file-input clearable v-model="file" ref="fileInput" label="Archivo"
                                    variant="underlined" density="compact" name="file"
                                    accept=".png, .jpg, .jpeg, .docx, .pdf" @change="onFileSelected">
                                </v-file-input>
                            </v-col>
                            <v-col cols="12" md="6">
                                <v-card elevation="6" class="mx-auto" max-width="210" max-height="120">
                                    <img v-if="imagenDisponible() && this.showImage" :src="imgedit" height="120"
                                        width="210">
                                    <v-icon v-else class="d-flex align-center justify-center"
                                        style="height: 120px; width: 210px; font-size: 120px;">{{ this.icono }}</v-icon>
                                </v-card>
                            </v-col>
                        </v-row>
                    </v-container>
                </v-card-text>
                <v-divider></v-divider>
                <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn color="#DA7171" variant="flat" @click="close">Cancelar</v-btn>
                    <v-btn color="#03626C" variant="flat" @click="save" :disabled="!valid"
                        :loading="loading">Aceptar</v-btn>
                </v-card-actions>
            </v-card>
        </v-form>
    </v-dialog>
    <v-dialog v-model="dialogDelete" max-width="500px">
        <v-card>

            <v-toolbar color="#DA7171">
                <span class="text-subtitle-2 ml-4"> Eliminar Exámen</span>
            </v-toolbar>

            <v-card-text class="mt-2 mb-2"> ¿Desea eliminar el exámen seleccionado?</v-card-text>
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
        showImage: false,
        icono: 'mdi-file',
        imgMiniatura: '',
        dialog: false,
        dialogDelete: false,
        medicalexams: [],
        data: {},
        types: [],
        dialogPhoto: false,
        loadingImage: false,
        selectedImageUrl: '',
        headers: [
            { title: 'Fecha', value: 'date', },
            { title: 'Tipo', value: 'typeName', },
            { title: 'Resultado', value: 'result', },
            { title: 'Detalles', value: 'archive', },
            { title: 'Acciones', value: 'actions', sortable: false, width: '10%' },
        ],
        editedItem: {
            id: '',
            person_id: '',
            date: '',
            results: '',
            archive: '',
            type_id: ''
        },
        originalItem: {
            id: '',
            person_id: '',
            date: '',
            results: '',
            archive: '',
            type_id: ''
        },
        defaultItem: {
            id: '',
            person_id: '',
            date: '',
            results: '',
            archive: '',
            type_id: ''
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
    }),
    computed: {
        formTitle() {
            return this.editedIndex === -1 ? 'Agregar Exámen Médico' : 'Editar Examen Médico';
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
        this.initialize();
    },
    methods: {
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
                this.selectedImageUrl = '';
                this.dialogPhoto = false; // Abre el modal incluso si la carga falla, puede mostrar un mensaje de error o una imagen de respaldo
                this.loadingImage = false;
            };
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
            this.data = {};
            this.data.type = "Salud";
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
                this.data.person_id = this.person_id;
                this.loading = true;
                const result = await handleRequest({
                    endpoint: 'get-exam-person',
                    method: 'POST',
                    data: this.data
                });

                if (result.success) {
                    // Si la solicitud es exitosa, asignamos las sucursales
                    this.medicalexams = result.data?.medicalExams || [];
                } else {
                    // Si no hay datos, asignamos un array vacío
                    this.medicalexams = [];
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
                const fieldsToUpdate = ['person_id', 'result', 'archive', 'date', 'type_id'];

                let updatedFields = Object.keys(this.editedItem)
                    .filter((key) => fieldsToUpdate.includes(key) && this.editedItem[key] !== this.originalItem[key])
                    .reduce((obj, key) => {
                        obj[key] = this.editedItem[key];
                        return obj;
                    }, {});
                if (Object.keys(updatedFields).length > 0) {
                    updatedFields.date = this.editedItem.date ? this.editedItem.date : new Date();
                    if (this.file) {
                        updatedFields.archive = this.editedItem.archive;
                    }
                    const formData = new FormData();
                    for (let key in updatedFields) {
                        formData.append(key, updatedFields[key]);
                    }

                    try {
                        const result = await handleRequest({
                            endpoint: 'medical-exam',
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
                    this.showAlert("success", "Debe completar los datos del archivo.", 3000);
                }
            } else {
                this.valid = false;
                const fieldsToUpdate = ['person_id', 'result', 'archive', 'date', 'type_id'];
                let updatedFields = Object.keys(this.editedItem)
                    .filter((key) => fieldsToUpdate.includes(key) && this.editedItem[key] !== this.originalItem[key])
                    .reduce((obj, key) => {
                        obj[key] = this.editedItem[key];
                        return obj;
                    }, {});
                if (Object.keys(updatedFields).length > 0) {
                    updatedFields.id = this.editedItem.id;
                    if (this.file) {
                        updatedFields.archive = this.editedItem.archive;
                    }
                    const formData = new FormData();
                    for (let key in updatedFields) {
                        formData.append(key, updatedFields[key]);
                    }
                    try {
                        const result = await handleRequest({
                            endpoint: 'medical-exam-update',
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
            this.showImage = false;
            this.icono = 'mdi-file';
            this.editedIndex = 1;
            this.originalItem = Object.assign({}, item);
            this.editedItem = Object.assign({}, item);
            this.file = null;

            const imageExtensions = ['jpg', 'jpeg', 'png', 'gif'];
            const extension = item.archive.split('.').pop().toLowerCase(); // Obtener la extensión del archivo

            // Mapeo de tipos de archivo a iconos
            const iconMap = {
                'pdf': 'mdi-file-pdf-box',
                'doc': 'mdi-file-word',
                'docx': 'mdi-file-word',
                'txt': 'mdi-file-document-outline'
            };

            // Verificar si es una imagen
            if (imageExtensions.includes(extension) || item.type.startsWith('image/')) {
                this.showImage = true;
                const img = new Image();
                img.src = `${this.$axios.defaults.baseURL}images/${item.archive}`;
                img.onload = async () => {
                    try {
                        this.imgMiniatura = `${this.$axios.defaults.baseURL}images/${item.archive}`;
                    } catch (error) {
                        console.error('Error al cargar la imagen', error);
                        this.showAlert('error', 'Error al cargar la imagen.', 3000);
                    }
                };
            } else {
                // Asignar el icono correspondiente al tipo de archivo
                this.icono = iconMap[extension] || 'mdi-file';
            }
            this.data = {};
            this.data.type = "Salud";
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
                    endpoint: 'medical-exam-destroy',
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
            this.imgMiniatura = '';
            let file = event.target.files[0];
            // Validar el tamaño del archivo (500 KB máximo)
            const maxSize = 500 * 1024; // 500 KB en bytes
            if (file && file.size > maxSize) {
                this.valid = false;
                this.showAlert('warning', 'El archivo de imagen debe ser de máximo 500 KB', 3000);
                return; // Detener el proceso si el archivo es demasiado grande
            }
            // Obtener tipo MIME y extensión
            const mimeType = file.type;
            const extension = file.name.split('.').pop().toLowerCase();

            // Lista de extensiones permitidas
            const imageExtensions = ['jpg', 'jpeg', 'png', 'gif'];
            const documentExtensions = ['pdf', 'doc', 'docx', 'txt'];

            // Validar tipo de archivo
            if ((mimeType.startsWith('image/') || imageExtensions.includes(extension)) && imageExtensions.includes(extension)) {
                this.cargarImage(file);
                this.showImage = true;
            }
            else if (documentExtensions.includes(extension)) {
                this.showImage = false;
                // Manejar tipos MIME específicos para documentos
                if (mimeType === 'application/pdf' || extension === 'pdf') {
                    this.icono = 'mdi-file-pdf-box';
                }
                else if (mimeType === 'application/msword' || extension === 'doc') {
                    this.icono = 'mdi-file-word';
                }
                else if (mimeType === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' || extension === 'docx') {
                    this.icono = 'mdi-file-word';
                }
                else if (mimeType === 'text/plain' || extension === 'txt') {
                    this.icono = 'mdi-file-document-outline';
                }
            }

            this.valid = true;
            this.editedItem.archive = file;
            //console.log(this.editedItem.image_cardgift);
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
</style>