<script setup>
	import config from "../../config.json"
	import { ethers } from "../lib/ethers-5.6.esm.min.js"
	import { ref, onMounted } from "vue"

	const usageCount = ref("Pending...");

	async function setChain(){
		await window.ethereum.request({
			method: "wallet_switchEthereumChain",
			params: [{ chainId: config.chainId}],
		}); 
	}

	async function getUsageCount(){
		if(window.ethereum.chainId == config.chainId){
			const provider = new ethers.providers.Web3Provider(window.ethereum);
  			await provider.send("eth_requestAccounts", []);
  			const signer = provider.getSigner();
	
	  		const abi = [
						"function usageCount() view returns (uint256)",
					];
			const address = config.contractAddress;
			const contract = new ethers.Contract(address, abi, signer);
			usageCount.value = "Pending..."
			const count = await contract.usageCount();
			usageCount.value = count;
		}
	} 
	const provider = new ethers.providers.Web3Provider(window.ethereum);
  		//await provider.send("eth_requestAccounts", []);
  		const signer = provider.getSigner();
	
	  	const abi = [
						"function usageCount() view returns (uint256)",
						"event Result(string indexed operation, uint256 indexed a, uint256 indexed b, uint256 result)"
					];
		const address = config.contractAddress;
		const contract = new ethers.Contract(address, abi, signer);

	onMounted(()=> {
		getUsageCount();
		setChain();
		window.ethereum.on("chainChanged", getUsageCount)
		
		
		contract.on("Result", getUsageCount);			
	})

</script>

<template>
	<div>
		<label for="usage">Calculator used:</label>
		<span name="usage">{{ usageCount }}</span>
	</div>
</template>

<style scoped>

</style>
