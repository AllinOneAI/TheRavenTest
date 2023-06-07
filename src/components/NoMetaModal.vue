<script setup>
	const props = defineProps({
		show: Boolean
	});
</script>

<template>
	<div class="modal-wrapper" v-if="show">
		<div class="modal-content">
			<div class="modal-header">
				<h1>MetaMask is not installed 🦊</h1>
			</div>
			<div class="modal-body">
				<h2>Please proceed to metamask.io and install the application to continue</h2>
			</div>
			<button class="modal-close" @click="$emit('close')">Got it</button>
		</div>
			
	</div>
</template>

<style scoped>
	.modal-wrapper {
		position: fixed; 
  		z-index: 1; 
  		left: 0;
  		top: 0;
  		width: 100%; 
  		height: 100%; 
    	background:rgba(0,0,0,0.4);
    	animation: fadeIn 0.4s;
	}

	.modal-header {
  		padding: 2px 16px;
  		background-color: #CF5C36;
	}

	.modal-body {
		padding: 2px 16px;
	}

	.modal-content {
		background-color: #EFC88B;
		margin: 5% auto;
		padding: 0px;
		border: 2px solid #888;
		width: 40%;
		box-shadow: 0 4px 8px 0 rgba(0,0,0,0.2),0 6px 20px 0 rgba(0,0,0,0.19);
		animation-name: animatetop;
  		animation-duration: 0.4s;
	}

	.modal-close {
  		background-color: #EFC88B;
  		font-family: "Open Sans", sans-serif;
  		font-size: 16px;
  		letter-spacing: 2px;
  		text-decoration: none;
  		text-transform: uppercase;
  		color: #000;
  		cursor: pointer;
  		border: 3px solid;
  		padding: 0.25em 0.5em;
  		box-shadow: 1px 1px 0px 0px, 2px 2px 0px 0px, 3px 3px 0px 0px, 4px 4px 0px 0px, 5px 5px 0px 0px;
  		position: relative;
  		margin-left: 1%;
  		margin-bottom: 2%;
  		user-select: none;
  		-webkit-user-select: none;
	}


	@keyframes animatetop {
  		from {top: -500px; opacity: 0.5}
  		to {top: 0; opacity: 1}
	}

	@keyframes fadeIn {
  		0% { opacity: 0; }
  		100% { opacity: 1; }
	}	
</style>