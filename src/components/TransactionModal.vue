<script setup>

</script>

<template>
	<div class="modal-wrapper">
		<div class="modal-body">
			<div class="modal-loading"><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div></div>
		</div>
		<h2 class="modal-text">Pending the transaction</h2>	
	</div>
</template>

<style scoped>

	.modal-loading {
	  display: inline-block;
	  position: relative;
	  width: 80px;
	  height: 80px;
	  transform: scale(1.3) 
	}
	.modal-loading div {
	  animation: modal-loading 1.2s cubic-bezier(0.5, 0, 0.5, 1) infinite;
	  transform-origin: 40px 40px;
	}
	.modal-loading div:after {
	  content: " ";
	  display: block;
	  position: absolute;
	  width: 7px;
	  height: 7px;
	  border-radius: 50%;
	  background: #fff;
	  margin: -4px 0 0 -4px;
	}
	.modal-loading div:nth-child(1) {
	  animation-delay: -0.036s;
	}
	.modal-loading div:nth-child(1):after {
	  top: 63px;
	  left: 63px;
	}
	.modal-loading div:nth-child(2) {
	  animation-delay: -0.072s;
	}
	.modal-loading div:nth-child(2):after {
	  top: 68px;
	  left: 56px;
	}
	.modal-loading div:nth-child(3) {
	  animation-delay: -0.108s;
	}
	.modal-loading div:nth-child(3):after {
	  top: 71px;
	  left: 48px;
	}
	.modal-loading div:nth-child(4) {
	  animation-delay: -0.144s;
	}
	.modal-loading div:nth-child(4):after {
	  top: 72px;
	  left: 40px;
	}
	.modal-loading div:nth-child(5) {
	  animation-delay: -0.18s;
	}
	.modal-loading div:nth-child(5):after {
	  top: 71px;
	  left: 32px;
	}
	.modal-loading div:nth-child(6) {
	  animation-delay: -0.216s;
	}
	.modal-loading div:nth-child(6):after {
	  top: 68px;
	  left: 24px;
	}
	.modal-loading div:nth-child(7) {
	  animation-delay: -0.252s;
	}
	.modal-loading div:nth-child(7):after {
	  top: 63px;
	  left: 17px;
	}
	.modal-loading div:nth-child(8) {
	  animation-delay: -0.288s;
	}
	.modal-loading div:nth-child(8):after {
	  top: 56px;
	  left: 12px;
	}
	@keyframes modal-loading {
	  0% {
	    transform: rotate(0deg);
	  }
	  100% {
	    transform: rotate(360deg);
	  }
	}

	.modal-body{
		margin: auto;
		margin-top: 10%;
		width: max-content;
	}

	.modal-wrapper {
		position: fixed; 
  		z-index: 1; 
  		left: 0;
  		top: 0;
  		width: 100%; 
  		height: 100%; 
    	background:rgba(0,0,0,0.5);
    	backdrop-filter: blur(5px); 
    	animation: fadeIn 0.4s;
	}

	.modal-text {
		color:#fff;

		text-align: center;
	}

	@keyframes fadeIn {
  		0% { opacity: 0; }
  		100% { opacity: 1; }
	}	


</style>
