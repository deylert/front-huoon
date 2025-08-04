<template>
  <v-card class="pa-2 w-100" elevation="1" style="max-width: 350px">
    <v-locale-provider>
      <v-date-picker
        color="#03626C"
        v-model="selectedDate"
        @update:modelValue="handleDateUpdate"
        :min="effectiveMinDate"
        :max="maxDate"
        show-adjacent-months
        landscape
        class="pa-0"
      />
    </v-locale-provider>
  </v-card>
</template>

<script>
export default {
  name: 'DatePicker',
  props: {
    dateValue: {
      type: String,
      default: null
    },
    fieldType: {
      type: String,
      required: true,
      validator: value => ['start_date', 'end_date', 'date', 'purchase_date', 'expiration_date'].includes(value)
    },
    minDate: {
      type: String,
      default: null
    },
    maxDate: {
      type: String,
      default: null
    }
  },
  data() {
    return {
      selectedDate: this.dateValue ? this.parseDate(this.dateValue) : null
    };
  },
  computed: {
    effectiveMinDate() {
  if (this.minDate) return this.minDate;
  if (this.fieldType === 'start_date') return this.getTodayDate();
  if (this.fieldType === 'purchase_date') return /* alguna otra lógica */;
  return null;
}
  },
  methods: {
    parseDate(dateString) {
      if (!dateString) return null;
      const [year, month, day] = dateString.split("-");
      return new Date(year, month - 1, day);
    },
    
    getTodayDate() {
      return new Date().toISOString().split('T')[0];
    },
    
    formatDate(date) {
      if (!date) return '';
      const d = new Date(date);
      const year = d.getFullYear();
      const month = String(d.getMonth() + 1).padStart(2, '0');
      const day = String(d.getDate()).padStart(2, '0');
      return `${year}-${month}-${day}`;
    },
    
    handleDateUpdate(value) {
      this.selectedDate = value;
      const formattedDate = this.formatDate(value);
      
      // Emitir el evento con la fecha seleccionada
      this.$emit('date-updated', {
        field: this.fieldType,
        value: formattedDate
      });
    },
    
    // Método para cerrar el menú sin selección
    closeWithoutSelection() {
      // Emitir el evento con la fecha actual o previa
      const currentFormattedDate = this.formatDate(this.selectedDate || this.dateValue);
      this.$emit('date-updated', {
        field: this.fieldType,
        value: currentFormattedDate
      });
    }
  }
}
</script>