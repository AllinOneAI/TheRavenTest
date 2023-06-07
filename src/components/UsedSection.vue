<script setup>
	import config from "../../config.json"
	import { ethers } from "../lib/ethers-5.6.esm.min.js"
	import { ref, onMounted } from "vue"

	const usageCount = ref("Pending...");

	const abi = config.abi
	const address = config.contractAddress;
	const provider = new ethers.providers.Web3Provider(window.ethereum);

	async function setChain(){
		await window.ethereum.request({
			method: "wallet_switchEthereumChain",
			params: [{ chainId: config.chainId}],
		}); 
	}

	async function getUsageCount(){
		if(window.ethereum.chainId == config.chainId){
			
  			await provider.send("eth_requestAccounts", []);

  			const signer = provider.getSigner();
			const contract = new ethers.Contract(address, abi, signer);
			
			usageCount.value = "Pending..."
			const count = await contract.usageCount();
			usageCount.value = count;

		}
	} 
	

	onMounted(()=> {
		getUsageCount();
		setChain();

		window.ethereum.on("chainChanged", getUsageCount)
		window.ethereum.on("accountsChanged", getUsageCount)

		const signer = provider.getSigner();
		const contract = new ethers.Contract(address, abi, signer);
		contract.on("Result", getUsageCount);
					
	})

</script>

<template>
	<div class="usage-section">
		<label for="usage">Calculator used: </label>
		<span name="usage">{{ usageCount }}</span>
	</div>
</template>

<style scoped>
	.usage-section {
		color: white;
		font-weight: 600;
		font-size: 30px; 

		position: absolute;
		left: 10px;
		bottom: 10px;

	}
</style>
