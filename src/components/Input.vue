<script setup>
	import { watch, toRef, ref, onMounted } from "vue"

	import { useButtonStore } from "../stores/buttonStore.js"
	import { useInputStore } from "../stores/inputStore.js"


	const buttonStore = useButtonStore();
	const inputStore = useInputStore();

	const props = defineProps(['modelValue']);
	defineEmits(['update:modelValue']);

	onMounted(()=> {
		console.log(inputStore.inputIsValid)
		
	})

</script>

<template>
	
	<input type="text" required pattern="^\d*$" 
		:value="modelValue"
    	@input="$emit('update:modelValue', $event.target.value)"
	/>

</template>

<style scoped>
	input:invalid {
   		background-color: ivory;
    	border: none;
    	outline: 2px solid red;
    	border-radius: 5px;
   }
</style>
