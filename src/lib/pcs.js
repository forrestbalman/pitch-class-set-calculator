import { writable } from "svelte/store"

let pcsArray = [] //array that is only used here in the store because writable stores can't be manipulated directly

export const userInput = writable(null) //store for the individual numbers that will go into the array
export const pcs = writable([]) //store for the entire pitch class set
export const clearArray = writable(false) //store for checking if the user wants to clear the array

userInput.subscribe((value) => {
	//if the value is already in the array, if it is not null, and if the array is less than 9 elements long...
	if (!pcsArray.includes(value) && value !== null && pcsArray.length < 10) {
		pcsArray.push(value) //add the value to the array
		pcs.set([...pcsArray]) //set the store to the array
	}
})

clearArray.subscribe((value) => {
	//if the value is set to true...
	if (value) {
		pcsArray = [] //empty the array
		pcs.set([]) //set the store to the empty array
		clearArray.set(false) //set the value back to false
	}
})

export function tenElevenFix(array) {
	//replace 10 with "t" and 11 with "e"
	array = array.map((n) => {
		if (n === 10) {
			return "t"
		} else if (n === 11) {
			return "e"
		}
		return n
	})

	return array
}

export function getNormalForm(array) {
	let arr = array.slice().sort((a, b) => a - b) //sort the array but don't mutate the original array
	let rotations = []

	//create all possible rotations of the array
	for (let i = 0; i < arr.length; i++) {
		let rotation = arr.slice(i).concat(arr.slice(0, i))
		rotations.push(rotation)
	}

	let outerIntervals = []
	for (let i = 0; i < rotations.length; i++) {
		outerIntervals.push([])
		for (let j = 0; j < rotations[i].length; j++) {
			let interval = 0
			if (j === 0) {
				outerIntervals[i].push(0)
			} else {
				interval = rotations[i][j] - rotations[i][0]
				if (interval < 0) {
					interval += 12
				}
				outerIntervals[i].push(interval)
			}
		}
	}

	let counter = outerIntervals[0].length - 1 //counter for loops inside of the while loop
	let max = outerIntervals[0].length - 1 //max number of times to loop
	while (max > 0) {
		let smallest //smallest interval in the array
		for (let i = counter; i >= 0; i--) {
			//if smallest isn't set or if the current interval is smaller than the current smallest, set the smallest to the current interval
			if (!smallest || outerIntervals[i][counter] < smallest) {
				smallest = outerIntervals[i][counter]
			}
		}

		//remove any rotations at the index shared by outerIntervals elements that have an interval greater than the smallest
		for (let i = counter; i >= 0; i--) {
			if (outerIntervals[i][counter] > smallest) {
				outerIntervals.splice(i, 1)
				rotations.splice(i, 1)
			}
		}

		//if there is only one rotation left, break out of the loop. Otherwise, reset the counter to the length of the outerIntervals array and decrement max
		if (rotations.length === 1) {
			break
		} else {
			counter = outerIntervals.length - 1
			max--
		}
	}

	//If there's still a tie, remove rotations until the only one left is the one with the smallest first interval
	if (rotations.length > 1) {
		let smallest = rotations[0][0]
		for (let i = 0; i < rotations.length; i++) {
			if (rotations[i][0] > smallest) {
				rotations.splice(i, 1)
			}
		}
	}

	return rotations[0]
}

export function getPrimeForm(array) {
	let arr = getNormalForm(array) //get the normal form of the array
	//transpose the array to start on 0 by subtracting the first element from each element
	let transposedNorm = arr.map((n) => {
		let interval = arr[0]
		if (n - interval < 0) {
			return n + 12 - interval
		}
		return n - interval
	})
	//invert the array by subtracting each element from 12
	let invertedNorm = transposedNorm.map((n) => {
		if (n !== 0) {
			return (n = 12 - n)
		}
		return 0
	})
	//get the ascending normal form of the inverted array
	let ascendingNorm = getNormalForm(invertedNorm)
	//transpose the ascending normal form to start on 0
	let transposedAscendingNorm = ascendingNorm.map((n) => {
		let interval = ascendingNorm[0]
		if (n - interval < 0) {
			return n + 12 - interval
		}
		return n - interval
	})
	//compare the transposed ascending normal form to the transposed normal form and return the smaller one from left to right rather than right to left
	let primeForm
	for (let i = 0; i < transposedAscendingNorm.length; i++) {
		if (transposedAscendingNorm[i] < transposedNorm[i]) {
			primeForm = transposedAscendingNorm
			break
		} else if (transposedAscendingNorm[i] > transposedNorm[i]) {
			primeForm = transposedNorm
			break
		}
	}

	return primeForm || transposedNorm
}

export function getIntervalVector(array) {
	let prime = getPrimeForm(array)
	let m2 = 0
	let M2 = 0
	let m3 = 0
	let M3 = 0
	let P4 = 0
	let A4 = 0

	for (let i = 0; i < prime.length; i++) {
		for (let j = i; j < prime.length; j++) {
			let interval = prime[j] - prime[i]
			switch (interval) {
				case 1:
				case 11:
					m2++
					break
				case 2:
				case 10:
					M2++
					break
				case 3:
				case 9:
					m3++
					break
				case 4:
				case 8:
					M3++
					break
				case 5:
				case 7:
					P4++
					break
				case 6:
					A4++
					break
				default:
					break
			}
		}
	}

	return [m2, M2, m3, M3, P4, A4]
}

export function getForteNumber(array) {
	let string = tenElevenFix(getPrimeForm(array)).join("")
	let fn

	switch (string) {
		//trichords
		case "012":
			fn = "3-1"
			break
		case "013":
			fn = "3-2"
			break
		case "014":
			fn = "3-3"
			break
		case "015":
			fn = "3-4"
			break
		case "016":
			fn = "3-5"
			break
		case "024":
			fn = "3-6"
			break
		case "025":
			fn = "3-7"
			break
		case "026":
			fn = "3-8"
			break
		case "027":
			fn = "3-9"
			break
		case "036":
			fn = "3-10"
			break
		case "037":
			fn = "3-11"
			break
		case "048":
			fn = "3-12"
			break
		//tetrachords
		case "0123":
			fn = "4-1"
			break
		case "0124":
			fn = "4-2"
			break
		case "0125":
			fn = "4-4"
			break
		case "0126":
			fn = "4-5"
			break
		case "0127":
			fn = "4-6"
			break
		case "0134":
			fn = "4-3"
			break
		case "0135":
			fn = "4-11"
			break
		case "0136":
			fn = "4-13"
			break
		case "0137":
			fn = "4-z29"
			break
		case "0145":
			fn = "4-7"
			break
		case "0146":
			fn = "4-z15"
			break
		case "0147":
			fn = "4-18"
			break
		case "0148":
			fn = "4-19"
			break
		case "0156":
			fn = "4-8"
			break
		case "0157":
			fn = "4-16"
			break
		case "0158":
			fn = "4-20"
			break
		case "0167":
			fn = "4-9"
			break
		case "0235":
			fn = "4-10"
			break
		case "0236":
			fn = "4-12"
			break
		case "0237":
			fn = "4-14"
			break
		case "0246":
			fn = "4-21"
			break
		case "0247":
			fn = "4-22"
			break
		case "0248":
			fn = "4-24"
			break
		case "0257":
			fn = "4-23"
			break
		case "0258":
			fn = "4-27"
			break
		case "0268":
			fn = "4-25"
			break
		case "0347":
			fn = "4-17"
			break
		case "0358":
			fn = "4-26"
			break
		case "0369":
			fn = "4-28"
			break
		//pentachords
		case "01234":
			fn = "5-1"
			break
		case "01235":
			fn = "5-2"
			break
		case "01236":
			fn = "5-4"
			break
		case "01237":
			fn = "5-5"
			break
		case "01245":
			fn = "5-3"
			break
		case "01246":
			fn = "5-9"
			break
		case "01247":
			fn = "5-z36"
			break
		case "01248":
			fn = "5-13"
			break
		case "01256":
			fn = "5-6"
			break
		case "01257":
			fn = "5-14"
			break
		case "01258":
			fn = "5-z38"
			break
		case "01267":
			fn = "5-7"
			break
		case "01268":
			fn = "5-15"
			break
		case "01346":
			fn = "5-10"
			break
		case "01347":
			fn = "5-16"
			break
		case "01348":
			fn = "5-z17"
			break
		case "01356":
			fn = "5-z12"
			break
		case "01357":
			fn = "5-24"
			break
		case "01358":
			fn = "5-27"
			break
		case "01367":
			fn = "5-19"
			break
		case "01368":
			fn = "5-29"
			break
		case "01369":
			fn = "5-31"
			break
		case "01457":
			fn = "5-z18"
			break
		case "01458":
			fn = "5-21"
			break
		case "01468":
			fn = "5-30"
			break
		case "01469":
			fn = "5-32"
			break
		case "01478":
			fn = "5-22"
			break
		case "01568":
			fn = "5-20"
			break
		case "02346":
			fn = "5-8"
			break
		case "02347":
			fn = "5-11"
			break
		case "02357":
			fn = "5-23"
			break
		case "02358":
			fn = "5-25"
			break
		case "02368":
			fn = "5-28"
			break
		case "02458":
			fn = "5-26"
			break
		case "02468":
			fn = "5-33"
			break
		case "02469":
			fn = "5-34"
			break
		case "02479":
			fn = "5-35"
			break
		case "03458":
			fn = "5-z37"
			break
		//hexachords
		case "012345":
			fn = "6-1"
			break
		case "012346":
			fn = "6-2"
			break
		case "012347":
			fn = "6-z36"
			break
		case "012356":
			fn = "6-z3"
			break
		case "012348":
			fn = "6-z37"
			break
		case "012456":
			fn = "6-z4"
			break
		case "012357":
			fn = "6-9"
			break
		case "012358":
			fn = "6-z40"
			break
		case "012457":
			fn = "6-z11"
			break
		case "012367":
			fn = "6-5"
			break
		case "012368":
			fn = "6-z41"
			break
		case "012467":
			fn = "6-z12"
			break
		case "012369":
			fn = "6-z42"
			break
		case "013467":
			fn = "6-z13"
			break
		case "012378":
			fn = "6-z38"
			break
		case "012567":
			fn = "6-z6"
			break
		case "012458":
			fn = "6-15"
			break
		case "012468":
			fn = "6-22"
			break
		case "012469":
			fn = "6-z46"
			break
		case "013468":
			fn = "6-z24"
			break
		case "012478":
			fn = "6-z17"
			break
		case "012568":
			fn = "6-z43"
			break
		case "012479":
			fn = "6-z47"
			break
		case "013568":
			fn = "6-z25"
			break
		case "012569":
			fn = "6-z44"
			break
		case "013478":
			fn = "6-z19"
			break
		case "012578":
			fn = "6-18"
			break
		case "012579":
			fn = "6-z48"
			break
		case "013578":
			fn = "6-z26"
			break
		case "012678":
			fn = "6-7"
			break
		case "013457":
			fn = "6-z10"
			break
		case "023458":
			fn = "6-z39"
			break
		case "013458":
			fn = "6-14"
			break
		case "013469":
			fn = "6-27"
			break
		case "013479":
			fn = "6-z49"
			break
		case "013569":
			fn = "6-z28"
			break
		case "013579":
			fn = "6-34"
			break
		case "013679":
			fn = "6-30"
			break
		case "023679":
			fn = "6-z29"
			break
		case "014679":
			fn = "6-z50"
			break
		case "014568":
			fn = "6-16"
			break
		case "014579":
			fn = "6-31"
			break
		case "014589":
			fn = "6-20"
			break
		case "023457":
			fn = "6-8"
			break
		case "023468":
			fn = "6-21"
			break
		case "023469":
			fn = "6-z45"
			break
		case "023568":
			fn = "6-z23"
			break
		case "023579":
			fn = "6-33"
			break
		case "024579":
			fn = "6-32"
			break
		case "02468t":
			fn = "6-35"
			break
		//septachords
		case "0123456":
			fn = "7-1"
			break
		case "0123457":
			fn = "7-2"
			break
		case "0123467":
			fn = "7-4"
			break
		case "0123567":
			fn = "7-5"
			break
		case "0123458":
			fn = "7-3"
			break
		case "0123468":
			fn = "7-9"
			break
		case "0123568":
			fn = "7-z36"
			break
		case "0124568":
			fn = "7-13"
			break
		case "0123478":
			fn = "7-6"
			break
		case "0123578":
			fn = "7-14"
			break
		case "0124578":
			fn = "7-z38"
			break
		case "0123678":
			fn = "7-7"
			break
		case "0124678":
			fn = "7-15"
			break
		case "0123469":
			fn = "7-10"
			break
		case "0123569":
			fn = "7-16"
			break
		case "0124569":
			fn = "7-z17"
			break
		case "0123479":
			fn = "7-z12"
			break
		case "0123579":
			fn = "7-24"
			break
		case "0124579":
			fn = "7-27"
			break
		case "0123679":
			fn = "7-19"
			break
		case "0124679":
			fn = "7-29"
			break
		case "0134679":
			fn = "7-31"
			break
		case "0145679":
			fn = "7-z18"
			break
		case "0124589":
			fn = "7-21"
			break
		case "0124689":
			fn = "7-30"
			break
		case "0134689":
			fn = "7-32"
			break
		case "0125689":
			fn = "7-22"
			break
		case "0125679":
			fn = "7-20"
			break
		case "0234568":
			fn = "7-8"
			break
		case "0134568":
			fn = "7-11"
			break
		case "0234579":
			fn = "7-23"
			break
		case "0234679":
			fn = "7-25"
			break
		case "0135679":
			fn = "7-28"
			break
		case "0134579":
			fn = "7-26"
			break
		case "012468t":
			fn = "7-33"
			break
		case "013468t":
			fn = "7-34"
			break
		case "013568t":
			fn = "7-35"
			break
		case "0134578":
			fn = "7-z37"
			break
		//octachords
		case "01234567":
			fn = "8-1"
			break
		case "01234568":
			fn = "8-2"
			break
		case "01234578":
			fn = "8-4"
			break
		case "01234678":
			fn = "8-5"
			break
		case "01235678":
			fn = "8-6"
			break
		case "01234569":
			fn = "8-3"
			break
		case "01234579":
			fn = "8-11"
			break
		case "01234679":
			fn = "8-13"
			break
		case "01235679":
			fn = "8-z29"
			break
		case "01234589":
			fn = "8-7"
			break
		case "01234689":
			fn = "8-z15"
			break
		case "01235689":
			fn = "8-18"
			break
		case "01245689":
			fn = "8-19"
			break
		case "01234789":
			fn = "8-8"
			break
		case "01235789":
			fn = "8-16"
			break
		case "01245789":
			fn = "8-20"
			break
		case "01236789":
			fn = "8-9"
			break
		case "02345679":
			fn = "8-10"
			break
		case "01345679":
			fn = "8-12"
			break
		case "01245679":
			fn = "8-14"
			break
		case "0123468t":
			fn = "8-21"
			break
		case "0123568t":
			fn = "8-22"
			break
		case "0124568t":
			fn = "8-24"
			break
		case "0123578t":
			fn = "8-23"
			break
		case "0124578t":
			fn = "8-27"
			break
		case "0124678t":
			fn = "8-25"
			break
		case "01345689":
			fn = "8-17"
			break
		case "0134578t":
			fn = "8-26"
			break
		case "0134679t":
			fn = "8-28"
			break
		//nonachords
		case "012345678":
			fn = "9-1"
			break
		case "012345679":
			fn = "9-2"
			break
		case "012345689":
			fn = "9-3"
			break
		case "012345789":
			fn = "9-4"
			break
		case "012346789":
			fn = "9-5"
			break
		case "01234568t":
			fn = "9-6"
			break
		case "01234578t":
			fn = "9-7"
			break
		case "01234678t":
			fn = "9-8"
			break
		case "01235678t":
			fn = "9-9"
			break
		case "01234679t":
			fn = "9-10"
			break
		case "01235679t":
			fn = "9-11"
			break
		case "01245689t":
			fn = "9-12"
			break
		default:
			fn = "Unknown"
			break
	}

	return fn
}

export function getTransposition(array, interval) {
	let tArray = array.map((n) => {
		return (n + interval) % 12
	})

	return tArray
}

export function getInversion(array, interval, axis) {
	let axisToInteger
	switch (axis) {
		case "C":
			axisToInteger = 0
			break
		case "C#/Db":
			axisToInteger = 1
			break
		case "D":
			axisToInteger = 2
			break
		case "D#/Eb":
			axisToInteger = 3
			break
		case "E":
			axisToInteger = 4
			break
		case "F":
			axisToInteger = 5
			break
		case "F#/Gb":
			axisToInteger = 6
			break
		case "G":
			axisToInteger = 7
			break
		case "G#/Ab":
			axisToInteger = 8
			break
		case "A":
			axisToInteger = 9
			break
		case "A#/Bb":
			axisToInteger = 10
			break
		case "B":
			axisToInteger = 11
			break
		default:
			axisToInteger = 0
			break
	}

	array = array.map((n) => {
		if (axisToInteger - n < 0) {
			return axisToInteger - n + 12
		}
		return axisToInteger - n
	})
	array = getNormalForm(array)
	array = getTransposition(array, interval)

	return array
}

export function wrapInBrackets(array) {
	return "[" + array.join(", ") + "]"
}
