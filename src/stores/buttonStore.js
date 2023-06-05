import { ref } from 'vue'
import { defineStore } from 'pinia'

export const useButtonStore = defineStore('store', () => {
  const calculateButtonDisabled = ref(true)
 
  function disableCalculateButton() {
    calculateButtonDisabled.value = true;
  }

  function enableCalculateButton() {
    calculateButtonDisabled.value = false;
  }

  return { calculateButtonDisabled, disableCalculateButton, enableCalculateButton }
})