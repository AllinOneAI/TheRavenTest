import { ref, watch } from 'vue'
import { defineStore } from 'pinia'

export const useInputStore = defineStore('store', () => {
  const inputA = ref('');
  const inputB = ref('');
  const inputIsValid = ref(false)

  const regexp = new RegExp("^[0-9]+$");

  watch([inputA, inputB], ([newInputA, newInputB]) => {
  	inputIsValid = regexp.test(newInputA.value) && regexp.test(newInputB.value)
  }, { immediate: true })
  
  return { inputA, inputB, inputIsValid }
})