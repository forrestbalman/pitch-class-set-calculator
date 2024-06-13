<script>
	import { userInput } from "$lib/pcs.js"

	//adds the number to the user input store which will end up in the pcs store
	function addToPCS(num) {
		userInput.set(num)
	}
</script>

<!-- 
	Piano keyboard layout 
	- The piano has a max-width of 500px
	- All keys 
		- contain fullwidth/fullheight buttons that add the corresponding number to the pcs store
		- are flex children so they stay inline
	- White keys are
		- positioned relatively
		- 100% width
		- 200px height
		- are ivory colored
	- Black keys are
		- positioned absolutely
			- they are nudged calc(100% / 7 * (nearest left white key) - 100% / 7 * 0.6 / 2)
				- 100% / 7 is the width of a white key
				- * (nearest left white key) is the number of white keys to the left of the black key
				- - 100% / 7 * 0.6 / 2 adjusts half the width of the black key back to the left
		- 60% width
		- 130px height
		- are somewhat ebony colored
-->
		
<div class="piano shadow w-100 rounded-2">
	<div class="piano-key white">
		<button on:click="{() => addToPCS(0)}">0</button>
	</div>
	<div class="piano-key black Db">
		<button on:click="{() => addToPCS(1)}">1</button>
	</div>
	<div class="piano-key white">
		<button on:click="{() => addToPCS(2)}">2</button>
	</div>
	<div class="piano-key black Eb">
		<button on:click="{() => addToPCS(3)}">3</button>
	</div>
	<div class="piano-key white">
		<button on:click="{() => addToPCS(4)}">4</button>
	</div>
	<div class="piano-key white">
		<button on:click="{() => addToPCS(5)}">5</button>
	</div>
	<div class="piano-key black Gb">
		<button on:click="{() => addToPCS(6)}">6</button>
	</div>
	<div class="piano-key white">
		<button on:click="{() => addToPCS(7)}">7</button>
	</div>
	<div class="piano-key black Ab">
		<button on:click="{() => addToPCS(8)}">8</button>
	</div>
	<div class="piano-key white">
		<button on:click="{() => addToPCS(9)}">9</button>
	</div>
	<div class="piano-key black Bb">
		<button on:click="{() => addToPCS(10)}">10</button>
	</div>
	<div class="piano-key white">
		<button on:click="{() => addToPCS(11)}">11</button>
	</div>
</div>

<style>
	.piano {
		display: flex;
		position: relative;
		max-width: 500px;
	}

	.piano-key {
		width: calc(100% / 7);
		height: 200px;
		border: 1px solid black;
		background-color: #FFFFF0;
		border-bottom-left-radius: 5px;
		border-bottom-right-radius: 5px;
		font-size: 1.15rem;
	}

	.piano-key.black {
		position: absolute;
		background-color: #282C35;
		width: calc(100% / 7 * 0.6);
		height: 130px;
		box-shadow: 0 0 4px 0 rgba(0, 0, 0, 0.5);
	}

	.Db {
		left: calc(100% / 7 - 100% / 7 * 0.6 / 2);
	}

	.Eb {
		left: calc(100% / 7 * 2 - 100% / 7 * 0.6 / 2);
	}

	.Gb {
		left: calc(100% / 7 * 4 - 100% / 7 * 0.6 / 2);
	}

	.Ab {
		left: calc(100% / 7 * 5 - 100% / 7 * 0.6 / 2);
	}

	.Bb {
		left: calc(100% / 7 * 6 - 100% / 7 * 0.6 / 2);
	}

	button {
		width: 100%;
		height: 100%;
		border: none;
		background: none;
		display: flex;
		align-items: end;
		justify-content: center;
		font-family: "Poppins", sans-serif;
		font-weight: 300;
	}

	.piano-key.black button {
		color: white;
	}
</style>
