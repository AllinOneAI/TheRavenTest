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

  		
		const address = config.contractAddress;
		const contract = new ethers.Contract(address, config.abi, signer);

		const contractFunctions = {
			multiply: "*",
			divide: "÷",
			add: "+",
			subtract: "-"
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
			[contractFunctions.subtract]: async (_a, _b) => {
				return contract.subtract(_a, _b);
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
	<div class="calculate-section">
		
		<input type="text" required pattern="^\d*$" 
			v-model="inputA"
			class="input"
		/> 
	
		<div class="selection-holder">
			<select class="selection" v-model="inputOperation" size="4">
				<option value="+">+</option>
				<option value="-">-</option>
				<option value="÷">÷</option>
				<option value="*">*</option>
			</select>
		</div>

		<input type="text" required pattern="^\d*$" 
			v-model	="inputB"
			class="input"
		/>
		
		<button 
			:disabled="buttonStore.calculateButtonDisabled"
			@click="startTransaction"
			class="calculate-button"
		>Calculate</button>

		<div class="result">
			<label for="result">Result:</label>
			<span name="result">{{ result }}</span>
		</div>

	</div>

	<Teleport to="body">
		<TransactionModal v-if="showTransactionModal"/>
	</Teleport>

</template>

<style scoped>
	
	.calculate-section {
		width: 100%;
		height: 80%;
		padding-top: 10vh;
	}

	.input {
		display: block;
		margin: auto;
	}

	.calculate-button{
		display: block;
		margin: auto;
	}

	.result{
		width: max-content;
		margin: auto;
	}

	*:focus {
    	outline: none;
	}

	.selection {
		height: 50px;
		appearance: none;
		-webkit-appearance: none;
		background-color: transparent;
		border: 0;
	}
	
	option {
		display:inline-block;
		width: 50px;
		height: 50px;
		text-align: center;
		vertical-align: text-top;
	}
	
	.selection-holder {
		margin: auto;
		height: max-content;
		width: max-content;
		overflow:hidden;
	}
</style>