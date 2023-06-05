<script setup>
	import CalculateSection from "./components/CalculateSection.vue"
	import UsedSection from "./components/UsedSection.vue"
	import NoMetaModal from "./components/NoMetaModal.vue"
	

	import { ref, onMounted } from "vue"
	import { useButtonStore } from "./stores/buttonStore.js"

	const buttonStore = useButtonStore();

	const showMetaModal = ref(false);
	const showUsedSection = ref(false);

	function detectMeta() {
		if(!window.ethereum?.isMetaMask) {
			showMetaModal.value = true;
			buttonStore.disableCalculateButton();
		} else { 
			showUsedSection.value = true;
		}
	}

	onMounted(() => {
  		detectMeta();  
	})

</script>

<template>
		<CalculateSection />

		<UsedSection v-if="showUsedSection"/>

		<Teleport to="body">
    		<NoMetaModal :show="showMetaModal" @close="showMetaModal = false" />
  		</Teleport>
  	
</template>

<style scoped>

</style>

