<script setup>
	import config from "../../config.json"

	import TransactionModal from "./TransactionModal.vue"

	import { ethers } from "../lib/ethers-5.6.esm.min.js"
	import { ref, watch } from "vue"
	import { useButtonStore } from "../stores/buttonStore.js"

	const buttonStore = useButtonStore();

	const regexp = new RegExp("^[0-9]+$");

	const inputA = ref("");
	const inputB = ref("");
	const inputOperation = ref("+");
	const result = ref("");
	const showTransactionModal = ref(false);

	watch([inputA, inputB], ([newInputA, newInputB]) => {
  		console.log(regexp.test(newInputA) && regexp.test(newInputB));
  		buttonStore.calculateButtonDisabled = !(regexp.test(newInputA) && regexp.test(newInputB));
  	}, { immediate: true })

	function getKeyByValue(object, value) {
  		return Object.keys(object).find(key => object[key] === value);
	}	

	async function setChain(){
		await window.ethereum.request({
			method: "wallet_switchEthereumChain",
			params: [{ chainId: config.chainId}],
		}); 
	}

	async function startTransaction() {
		
		const a = inputA.value;
		const b = inputB.value;
		const operation = inputOperation.value;

		await setChain();

		const provider = new ethers.providers.Web3Provider(window.ethereum);
  		await provider.send("eth_requestAccounts", []);
  		const signer = provider.getSigner();

  		const abi = [
					"function multiply(uint256 a, uint256 b) external returns (uint256)",
					"function divide(uint256 a, uint256 b) external returns (uint256)",
					"function add(uint256 a, uint256 b) external returns (uint256)",
					"function substract(uint256 a, uint256 b) external returns (uint256)",
				];
		const address = config.contractAddress;
		const contract = new ethers.Contract(address, abi, signer);

		const contractFunctions = {
			multiply: "*",
			divide: "÷",
			add: "+",
			substract: "-"
		};

		const contractFunctionsHandlers = {
			[contractFunctions.multiply]: async (_a, _b) => {
				return contract.multiply(_a, _b);
			},
			[contractFunctions.divide]: async (_a, _b) => {
				return contract.divide(_a, _b);
			},
			[contractFunctions.add]: async (_a, _b) => {
				return contract.add(_a, _b);
			},
			[contractFunctions.substract]: async (_a, _b) => {
				return contract.substract(_a, _b);
			},
		};

		const transaction = await contractFunctionsHandlers[inputOperation.value](inputA.value, inputB.value);

		showTransactionModal.value = true;
		buttonStore.disableCalculateButton();

		await provider.waitForTransaction(transaction.hash);

		showTransactionModal.value = false;
		buttonStore.enableCalculateButton();

		const events = await getEvents(
								getKeyByValue(contractFunctions, operation),
								a, b
							);
		result.value = parseInt(events.pop().args[3]._hex, 16);
	}

	async function getEvents(_operation, _a, _b){
		const provider = new ethers.providers.Web3Provider(window.ethereum);
  		await provider.send("eth_requestAccounts", []);
  		const signer = provider.getSigner();

  		const abi = [
					"event Result(string indexed operation, uint256 indexed a, uint256 indexed b, uint256 result)"
				];

		const address = config.contractAddress;
		const contract = new ethers.Contract(address, abi, signer);

		const filter = await contract.filters.Result(_operation, _a, _b);
		return contract.queryFilter(filter); 
	}

	async function testEvent(){
		const provider = new ethers.providers.Web3Provider(window.ethereum);
  		await provider.send("eth_requestAccounts", []);
  		const signer = provider.getSigner();

  		const abi = [
					"event Result(string indexed operation, uint256 indexed a, uint256 indexed b, uint256 result)"
				];

		const address = config.contractAddress;
		const contract = new ethers.Contract(address, abi, signer);

		const results = await contract.queryFilter("Result");
		results.forEach((element) => {
			if(element.pop().transactionHash == _txHash){
				result.value = element
			}
		});
	}

</script>

<template>
	<div>
		<button @click="testEvent">TEST</button>
		<input type="text" required pattern="^\d*$" 
			v-model="inputA"
		/>

		<select v-model="inputOperation">
			<option value="+">+</option>
			<option value="-">-</option>
			<option value="÷">÷</option>
			<option value="*">*</option>
		</select>

		<input type="text" required pattern="^\d*$" 
			v-model	="inputB"
		/>

		<button 
			:disabled="buttonStore.calculateButtonDisabled"
			@click="startTransaction"
		>Calculate</button>

		<label for="result">Result:</label>
		<span name="result">{{ result }}</span>
	</div>

	<Teleport to="body">
		<TransactionModal v-if="showTransactionModal"/>
	</Teleport>
</template>

<style scoped>
	
</style>