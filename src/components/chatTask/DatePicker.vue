<template>
  <v-card class="pa-2 w-100" elevation="1" style="max-width: 350px">
  <v-locale-provider>
    <v-date-picker
      color="#03626C"
      locale="es"
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
      validator: value => ['start_date', 'end_date'].includes(value)
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
      return this.fieldType === 'start_date' ? this.getTodayDate() : null;
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
      
      this.$emit('date-updated', {
        field: this.fieldType,
        value: formattedDate
      });
    }
  }
}
</script>