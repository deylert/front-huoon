<template>
  <v-card class="pa-4 w-100" elevation="1" style="max-width: 350px">
    <v-time-picker
      v-model="selectedTime"
      format="24hr"
      color="#03626C"
      scrollable
      @update:model-value="handleTimeUpdate"
    />
    <v-text-field
      class="mt-2"
      v-model="selectedTime"
      readonly
      variant="outlined"
      density="compact"
    />
  </v-card>
</template>

<script>

export default {

  data() {
    return {
      selectedTime: this.timeValue || '00:00'
    }
  },
  watch: {
    timeValue(newVal) {
      this.selectedTime = newVal || '00:00'
    }
  },
  methods: {
    handleTimeUpdate(value) {
      this.selectedTime = value
      this.$emit('time-updated', {
        field: this.fieldType,
        value: value
      })
    }
  }
}
</script>