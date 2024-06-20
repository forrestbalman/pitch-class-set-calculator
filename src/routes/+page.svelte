<script>
	import Keyboard from "$lib/Keyboard.svelte"
	import {
		pcs,
		clearArray,
		tenElevenFix,
		getNormalForm,
		getPrimeForm,
		getIntervalVector,
		getForteNumber,
		getTransposition,
		getInversion,
		wrapInBrackets,
	} from "$lib/pcs.js"

	let normalForm, primeForm, intervalVector, forteNumber, transposition, inversion, pcsArray, pcsDisplay
	let submitted = false
	let error = null

	//display the pcs store's value in the input field
	pcs.subscribe((value) => {
		pcsArray = value
		if (pcsArray.length > 0) {
			pcsDisplay = wrapInBrackets(tenElevenFix(pcsArray))
		}
	})

	//clears the pcs store
	function clearInput() {
		clearArray.set(true)
		submitted = false
		error = null
		pcsDisplay = null
		pcsArray = []
	}

	function submit() {
		if (pcsArray.length < 3) {
			error = "Please input at least 3 pitch classes"
			return
		} else {
			error = null
			submitted = true
			normalForm = getNormalForm(pcsArray)
			primeForm = getPrimeForm(pcsArray)
			forteNumber = getForteNumber(pcsArray)
			intervalVector = getIntervalVector(pcsArray)
		}
	}

	function transposeNorm(num) {
		normalForm = getNormalForm(pcsArray)
		normalForm = getTransposition(normalForm, num)
		normalForm = normalForm
	}

	function transposePrime(num) {
		primeForm = getPrimeForm(pcsArray)
		primeForm = getTransposition(primeForm, num)
		primeForm = primeForm
		inversionIntervalSelect = "default"
		inversionAxisSelect = "default"
		inversionInterval = null
		inversionAxis = null
	}

	let inversionInterval, inversionAxis, transposePrimeSelect, inversionIntervalSelect, inversionAxisSelect
	function invertPrime(num, axis) {
		if (inversionInterval && inversionAxis) {
			primeForm = getPrimeForm(pcsArray)
			primeForm = getInversion(primeForm, Number(num), axis)
			primeForm = primeForm
			transposePrimeSelect = "default"
		}
	}
</script>

<div style="background: #333333;">
	<div class="container min-vh-100 d-flex justify-content-center align-items-center" style="padding-top: 100px;">
		<div class="row w-100">
			<div class="col-12 col-md-6 d-flex justify-content-center align-items-center">
				<div class="input-wrapper d-flex flex-column align-items-center gap-2">
					<div>
						<h1 class="text-light">Pitch Class Set Calculator</h1>
						<p class="text-light">
							For pitch class sets <strong>up to 9 pitches in length</strong>. Input pitch classes using the keyboard 🎹 and press
							<span class="bg-primary px-1 rounded-1">submit.</span>
						</p>
					</div>
					<div class="d-flex justify-content-center w-100">
						<Keyboard />
					</div>
					<div class="user-input d-flex w-100 shadow">
						<input class="form-control w-100" type="text" readonly bind:value="{pcsDisplay}" />
						<button class="btn btn-danger rounded-0" on:click="{clearInput}">Clear</button>
						<button class="btn btn-primary" on:click="{submit}">Submit</button>
					</div>
					<div class="align-self-start">
						{#if error}
							<p class="bg-danger text-light p-2">{error}</p>
						{:else}
							<p class="p-2">{"\u00A0"}</p>
						{/if}
					</div>
				</div>
			</div>
			<div class="col-12 col-md-6">
				{#if submitted}
					<div class="row">
						<div class="col-12 col-xxl-6 mb-4">
							<div class="d-flex flex-column gap-2 align-items-center p-4 rounded-2 h-100 shadow" style="background: #05C7F2;">
								<h2>Normal Form</h2>
								<h2>{wrapInBrackets(normalForm)}</h2>
								<select class="form-select" on:input="{(event) => transposeNorm(Number(event.target.value))}">
									<option value="default" selected disabled>Transpose Tn</option>
									{#each Array.from({ length: 12 }, (_, i) => i) as i}
										<option value="{i}">{i}</option>
									{/each}
								</select>
							</div>
						</div>
						<div class="col-12 col-xxl-6 mb-4">
							<div class="d-flex flex-column gap-2 align-items-center p-4 rounded-2 h-100 shadow" style="background: #F2B705;">
								<h2>Prime Form</h2>
								<h2>{wrapInBrackets(primeForm)}</h2>
								<select
									class="form-select"
									bind:value="{transposePrimeSelect}"
									on:input="{(event) => transposePrime(Number(event.target.value))}">
									<option selected disabled value="default">Transpose Tn</option>
									{#each Array.from({ length: 12 }, (_, i) => i) as i}
										<option value="{i}">{i}</option>
									{/each}
								</select>
								<div class="d-flex gap-3 w-100">
									<select
										class="form-select"
										bind:value="{inversionIntervalSelect}"
										on:input="{(event) => {
											inversionInterval = event.target.value
											invertPrime(inversionInterval, inversionAxis)
										}}">
										<option selected disabled value="default">Invert TnI</option>
										{#each Array.from({ length: 12 }, (_, i) => i) as i}
											<option value="{i}">{i}</option>
										{/each}
									</select>
									<select
										class="form-select"
										bind:value="{inversionAxisSelect}"
										on:input="{(event) => {
											inversionAxis = event.target.value
											invertPrime(inversionInterval, inversionAxis)
										}}">
										<option selected disabled value="default">Axis</option>
										<option value="C">C</option>
										<option value="C#/Db">C#/Db</option>
										<option value="D">D</option>
										<option value="D#/Eb">D#/Eb</option>
										<option value="E">E</option>
										<option value="F">F</option>
										<option value="F#/Gb">F#/Gb</option>
										<option value="G">G</option>
										<option value="G#/Ab">G#/Ab</option>
										<option value="A">A</option>
										<option value="A#/Bb">A#/Bb</option>
										<option value="B">B</option>
									</select>
								</div>
							</div>
						</div>
					</div>
					<div class="row">
						<div class="col-12 col-xxl-6 mb-4">
							<div class="d-flex flex-column p-4 rounded-2 h-100 shadow" style="background: #2E8C03;">
								<h2 class="text-center text-light">Forte Number</h2>
								<h2 class="text-center text-light">{forteNumber}</h2>
							</div>
						</div>
						<div class="col-12 col-xxl-6 mb-4">
							<div class="p-4 rounded-2 h-100 shadow" style="background: #E0482E;">
								<h2 class="text-center text-light">Interval Vector</h2>
								<table class="table">
									<thead>
										<tr>
											<th class="fw-normal text-center" scope="col">m2</th>
											<th class="fw-normal text-center" scope="col">M2</th>
											<th class="fw-normal text-center" scope="col">m3</th>
											<th class="fw-normal text-center" scope="col">M3</th>
											<th class="fw-normal text-center" scope="col">P4</th>
											<th class="fw-normal text-center" scope="col">A4</th>
										</tr>
									</thead>
									<tbody>
										<tr>
											{#each intervalVector as interval}
												<td class="text-center">{interval}</td>
											{/each}
										</tr>
									</tbody>
								</table>
							</div>
						</div>
					</div>
				{/if}
			</div>
		</div>
	</div>
</div>

<style>
	/* max-width is 500px, which is the max-width of the keyboard */
	.input-wrapper {
		max-width: 500px;
	}

	input {
		border-top-right-radius: 0;
		border-top-left-radius: 5px;
		border-bottom-left-radius: 5px;
		border-bottom-right-radius: 0;
	}

	.btn-primary {
		border-top-right-radius: 5px;
		border-top-left-radius: 0;
		border-bottom-left-radius: 0;
		border-bottom-right-radius: 5px;
	}

	tr,
	th,
	td,
	thead {
		background: none;
		color: #fff;
	}

	h1,
	h2,
	p,
	tr,
	th,
	td,
	button {
		font-family: "Poppins", sans-serif;
		font-weight: 300;
	}
</style>
