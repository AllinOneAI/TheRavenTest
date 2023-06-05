<script setup>
	const props = defineProps({
		show: Boolean
	});
</script>

<template>
	<div class="modal-wrapper" v-if="show">
		<div class="header">
			<h2>MetaMask not Installed</h2>
		</div>
		<div>
			<h3>Please proceed to metamask.io and install the application to continue working</h3>
		</div>
			<button class="button" @click="$emit('close')">Got it</button>
	</div>
</template>

<style scoped>
	.modal-wrapper {
    	height:100%;
    	width:100%;
    	background:#f00;
    	color:#fff;
    	position: absolute;
	}
</style>