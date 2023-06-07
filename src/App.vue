<script setup>
	import CalculateSection from "./components/CalculateSection.vue"
	import UsedSection from "./components/UsedSection.vue"
	import NoMetaModal from "./components/NoMetaModal.vue"
	

	import { ref, onMounted } from "vue"
	import { useStore } from "./stores/Store.js"

	import { ethers } from "./lib/ethers-5.6.esm.min.js"

	const store = useStore();

	const showMetaModal = ref(false);
	const showUsedSection = ref(false);

	async function connectMeta() {
		try {
			const provider = new ethers.providers.Web3Provider(window.ethereum);
  			provider.send("eth_requestAccounts", []);
  		} catch(error) {
  			console.log(error);
  		}
	}

	function detectMeta() {
		if(!window.ethereum?.isMetaMask) {
			showMetaModal.value = true;
			store.calculateButtonDisabled = true;
			store.metaIsInstalled = false;
		} else { 
			store.metaIsInstalled = true;
			showUsedSection.value = true;
		}
	}

	onMounted(() => {
  		detectMeta();  
	})

</script>

<template>
	<img src="./assets/meta.webp
	" 
		class="meta-img"
		v-if="showUsedSection"
		@click="connectMeta"	>
	
	<div class="calculate-section">
		<CalculateSection  />
	</div>

	<div class="used-section">
		<UsedSection v-if="showUsedSection"/>
	</div>

		<Teleport to="body">
			<Transition>
    			<NoMetaModal :show="showMetaModal" @close="showMetaModal = false" />
  			</Transition>
  		</Teleport>
  	
</template>

<style scoped>

	*{
		font-family: Rubik;
	}

	.meta-img{
		position: absolute;
		margin: 10px 10px;

		width: 100px;
		height: 100px;

		cursor: pointer;  
	}

	.calculate-section{
		height: 90%;
		margin-top: 20vh;
	}

	.used-section{
		height: 10%;
	}

	.v-enter-active,
	.v-leave-active {
  		transition: opacity 0.5s ease;
	}

	.v-enter-from,
	.v-leave-to {
		opacity: 0;
	}

	.headline {   
	    animation: color-change 1s infinite alternate;
    }
    @keyframes color-change {
    0% { color: red; }
    50% { color: blue; }
    75% { color: greenyellow; }
    100% { color:blueviolet; }
}
</style>

