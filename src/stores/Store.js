import { ref } from 'vue'
import { defineStore } from 'pinia'

export const useStore = defineStore('store', () => {
	const calculateButtonDisabled = ref(true);
	const metaIsInstalled = ref(false);
  

  return { calculateButtonDisabled,  metaIsInstalled}
})