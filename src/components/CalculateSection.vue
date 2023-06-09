<script setup>
	import config from "../../config.json"

	import TransactionModal from "./TransactionModal.vue"

	import { ethers } from "../lib/ethers-5.6.esm.min.js"
	import { ref, watch } from "vue"
	import { useStore } from "../stores/Store.js"

	const store = useStore();

	const regexp = new RegExp("^[0-9]+$");

	const inputA = ref("");
	const inputB = ref("");
	const inputOperation = ref("+");
	const result = ref("");
	const hideInvalidMessageA = ref(true);
	const hideInvalidMessageB = ref(true);
	const showTransactionModal = ref(false);

	watch([inputA, inputB], ([newInputA, newInputB]) => {
  		console.log(regexp.test(newInputA) && regexp.test(newInputB));
  		if(store.metaIsInstalled) {
  			store.calculateButtonDisabled = !(regexp.test(newInputA) && regexp.test(newInputB));
  		}
  	}, { immediate: true })

	function handleInputA() {
		if(!regexp.test(inputA.value)) {
				hideInvalidMessageA.value = false;
			} else
				hideInvalidMessageA.value = true;
	}

	function handleInputB() {
		if(!regexp.test(inputB)) {
				hideInvalidMessageB.value = false;
			} else
				hideInvalidMessageB.value = true;
	}

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
		store.calculateButtonDisabled = true;

		await provider.waitForTransaction(transaction.hash);

		showTransactionModal.value = false;
		store.calculateButtonDisabled = false;

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

		const address = config.contractAddress;
		const contract = new ethers.Contract(address, config.abi, signer);

		const filter = await contract.filters.Result(_operation, _a, _b);
		return contract.queryFilter(filter); 
	}

	async function testEvent(){
		const provider = new ethers.providers.Web3Provider(window.ethereum);
  		await provider.send("eth_requestAccounts", []);
  		const signer = provider.getSigner();

		const address = config.contractAddress;
		const contract = new ethers.Contract(address, config.abi, signer);

		const results = await contract.queryFilter("Result");
		results.forEach((element) => {
			if(element.pop().transactionHash == _txHash){
				result.value = element
			}
		});
	}

</script>

<template>
		
		<a 
			href="https://sepolia.etherscan.io/address/0x1851ffbce02a134efd9ddbc91920b0c6dcefb6f5#code"
		 	class="headline"
		 	target=”_blank”
		 	>BLOCKCHAIN CALCULATOR</a>

	
		<input type="text"
			required pattern="^\d*$" 
			placeholder="First argument" 
			v-model="inputA"
			class="input"
			@input="handleInputA"/> 
		
		<div class="select-holder">
			<select class="selection" v-model="inputOperation">
				<option value="+">+</option>
				<option value="-">-</option>
				<option value="÷">÷</option>
				<option value="*">*</option>
			</select>
		</div>

		
		<input type="text" required 
			pattern="^\d*$"
			placeholder="Second argument" 
			v-model	="inputB"
			class="input"
			@input="handleInputB"
		/>

		<div class="result-wrapper" >
			<div class="result" v-if="result">
				<label for="result">Result: </label>
				<span name="result">{{ result }}</span>
			</div>
		</div>

		<button 
			:disabled="store.calculateButtonDisabled"
			@click="startTransaction"
			class="calculate-button"
		>Calculate</button>


	<Teleport to="body">
		<Transition>
			<TransactionModal v-if="showTransactionModal"/>
		</Transition>
	</Teleport>

</template>

<style scoped>
	
  	
  @import url('https://fonts.googleapis.com/css2?family=Rubik:ital,wght@0,300;0,400;0,500;0,600;0,700;0,800;0,900;1,300;1,400;1,500;1,600;1,700;1,800;1,900&display=swap');


  	*{
		font-family: Rubik;
	}

	.input {
		display: block;
		margin: auto;
		margin-bottom: 50px;
	}

	.calculate-button{
		display: block;
		margin: auto;
		margin-bottom: 50px;
	}

	.headline{ 
		margin: auto;
		width: max-content;
		display: block;
		text-decoration:none;
  		font-size: 80px;
  		letter-spacing: -3px;
  		transition: 700ms ease;
  		font-variation-settings: "wght" 311;
  		margin-bottom: 50px;
  		color: PaleGoldenRod;
  		outline: none;
  		text-align: center;
}

	.headline:hover {
  		font-variation-settings: "wght" 582; 
  		letter-spacing: 1px;
  		cursor: pointer;
	}

	.invalid-message-visible {
		visibility: visible;
	}
	.invalid-message {
		
		visibility: hidden;
	}

	.result-wrapper{
		height: 50px;
		width: max-content;
		margin: auto;
		margin-bottom: 1%;
		font-size: 30px;
		color: white;
		font-weight: 600; 
	}

	.result{
		
	}

	.selection {
	 	font-weight: 600;
		display: block;
		appearance: none;
  		outline: 0;
  		border: 0;
  		box-shadow: none;
  		padding: 0 0.8em;
  		color: #fff;
  		background-color: rgba(0, 0, 0, .2);
  		background-image: none;
  		cursor: pointer;
  		font-size: 1.5rem;
  		flex:1;
	}

	.select-holder {
		border: 2px solid white;
		margin: auto;
		margin-bottom: 50px;
  		position: relative;
  		display: flex;
  		width: 7em;
  		height: 40px;
  		border-radius: .55em;
  		overflow: hidden;
}

	.select-holder::after {
		font-size: 1rem;
	  	content: '\25BC';
	  	position: absolute;
	  	top: 0;
	  	right: 0;
	  	padding: 11px;
	  	background-color: #34495e;
	  	transition: .25s all ease;
	  	pointer-events: none;
	  	color: white;
	}

	.select-holder:hover::after {
	  color: #929292;
	}

	input{
        width: 50%;
        color: rgb(36, 35, 42);
        font-size: 16px;
        line-height: 20px;
        min-height: 28px;
        border-radius: 8px;
        padding: 8px 16px;
        border: 2px solid transparent;
        background: rgb(251, 251, 251);
        transition: all 0.1s ease 0s;
        box-shadow: rgba(255, 255, 255, 0.4) 0px 0px 50px 10px
    }
	
	.calculate-button {
		font-size: 20px; 
	  	padding: 0.6em 2em;
	  	border: none;
	  	outline: none;
	  	color: black;
	  	background: #83678C;
	  	cursor: pointer;
	  	position: relative;
	  	z-index: 0;
	  	border-radius: 10px;
	  	user-select: none;
	  	-webkit-user-select: none;
	  	touch-action: manipulation;
	}
	
	.calculate-button:before {
	  content: "";
	  background: linear-gradient(
	    45deg,
	    #ff0000,
	    #ff7300,
	    #fffb00,
	    #48ff00,
	    #00ffd5,
	    #002bff,
	    #7a00ff,
	    #ff00c8,
	    #ff0000
	  );
	  position: absolute;
	  top: -2px;
	  left: -2px;
	  background-size: 400%;
	  z-index: -1;
	  filter: blur(5px);
	  -webkit-filter: blur(5px);
	  width: calc(100% + 8px);
	  height: calc(100% + 8px);
	  animation: glowing-calculate-button 20s linear infinite;
	  transition: opacity 0.3s ease-in-out;
	  border-radius: 10px;
	}
	
	@keyframes glowing-calculate-button {
	  0% {
	    background-position: 0 0;
	  }
	  50% {
	    background-position: 400% 0;
	  }
	  100% {
	    background-position: 0 0;
	  }
	}
	
	.calculate-button:after {
	  z-index: -1;
	  content: "";
	  position: absolute;
	  width: 100%;
	  height: 100%;
	  background: white;
	  left: 0;
	  top: 0;
	  border-radius: 10px;
	}
	.calculate-button:disabled{
		color: gray;
	}
	.calculate-button:disabled:before{
		
		background: linear-gradient(
	    45deg,
	      #343434, #4b4b4b, #646464, #7e7e7e, #999999
	  ); 
	}
.v-enter-active,
	.v-leave-active {
  		transition: opacity 0.5s ease;
	}

	.v-enter-from,
	.v-leave-to {
		opacity: 0;
	}

</style>