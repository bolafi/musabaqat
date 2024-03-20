let fileInput = document.getElementById("file-upload-input");
let fileSelect = document.getElementsByClassName("file-upload-select")[0];
const sound = new Audio("assets/countdown.mp3");
const inputs = document.querySelector(".inputs");
const input = document.querySelector(".input");
const btn = document.querySelector(".btn");
const questions = document.querySelector(".questions");
const answer = document.createElement("h2");
const op1 = document.createElement("div");
const op2 = document.createElement("div");
const op3 = document.createElement("div");
const optionContainer = document.createElement("div");
const panel = document.querySelector(".panel");
const myContainer = document.querySelector(".my-container");
const teams = document.querySelector(".teams");
let firstTeamName = document.querySelector("#first-team-label");
let secondTeamName = document.querySelector("#second-team-label");
const firstTeamInput = document.querySelector("#first-team-input");
const secondTeamInput = document.querySelector("#second-team-input");
const firstScore = document.querySelector(".first-score");
const secondScore = document.querySelector(".second-score");
const firstTeamAdd = document.querySelector(".first-team-add");
const firstTeamUndo = document.querySelector(".first-team-undo");
const secondTeamAdd = document.querySelector(".second-team-add");
const secondTeamUndo = document.querySelector(".second-team-undo");
let fScore = [];
let sScore = [];
const names = document.querySelector(".names");
let error = false;
answer.style.visibility = "hidden";
let remainingTime;
let clicked = false;
let crimsons;
if (localStorage.getItem("crimsons")) {
	crimsons = JSON.parse(localStorage.getItem("crimsons"));
} else {
	crimsons = [];
}

fileSelect.onclick = function () {
	fileInput.click();
};
fileInput.onchange = function () {
	let filename = fileInput.files[0].name;
	let selectName = document.getElementsByClassName("file-select-name")[0];
	selectName.innerText = filename;
};

const firstInput = document.querySelector("#first-team").value;
const secondInput = document.querySelector("#second-team").value;

// -------------- THIS CODE TO CONVERT THE EXCEL FILE TO JSON -----------------------//

let selectedFile;
console.log(window.XLSX);
document
	.getElementById("file-upload-input")
	.addEventListener("change", (event) => {
		selectedFile = event.target.files[0];
	});

let data = [
	{
		name: "jayanth",
		data: "scd",
		abc: "sdef",
	},
];

document.getElementById("convert").addEventListener("click", () => {
	XLSX.utils.json_to_sheet(data, "out.xlsx");
	if (selectedFile) {
		let fileReader = new FileReader();
		fileReader.readAsBinaryString(selectedFile);
		fileReader.onload = (event) => {
			let data = event.target.result;
			let workbook = XLSX.read(data, { type: "binary" });
			//  console.log(workbook);
			let temp;
			workbook.SheetNames.forEach((sheet) => {
				let rowObject = XLSX.utils.sheet_to_row_object_array(
					workbook.Sheets[sheet]
				);
				console.log(rowObject);
				//document.getElementById("jsondata").innerHTML = JSON.stringify(rowObject,undefined,4)
				temp = JSON.stringify(rowObject, undefined, 4);
			});
			myContainer.style.visibility = "hidden";
			questions.style.display = "grid";
			localStorage.setItem("quiz", temp);
			defaultNames();

			//var obj = JSON.parse(localStorage.getItem('quiz'));
			//  document.getElementById("jsondata").innerHTML = obj;
		};
	}
});

// -------------------------------------------------------------------------------------

UPDATE();
// --------------  SWITCH BETWEEN PAGES -----------------------//

function switchPage() {
	if (myContainer.style.visibility === "hidden") {
		myContainer.style.visibility = "visible";
		questions.style.display = "none";
	} else {
		myContainer.style.visibility = "hidden";
		questions.style.display = "grid";
	}
}

function defaultNames() {
	if (
		localStorage.getItem("first-name") &&
		localStorage.getItem("second-name")
	) {
		firstTeamName.textContent = JSON.parse(localStorage.getItem("first-name"));
		secondTeamName.textContent = JSON.parse(
			localStorage.getItem("second-name")
		);
	} else {
		firstTeamName.textContent = "الاول";
		secondTeamName.textContent = "الثاني";
	}
}

// --------------  RESET -----------------------//

function clearCrimsons() {
	// selectedFile = ""
	localStorage.removeItem("crimsons");
	localStorage.removeItem("fScore");
	localStorage.removeItem("sScore");
	localStorage.removeItem("quiz");
	localStorage.removeItem("first-name");
	localStorage.removeItem("second-name");
	firstTeamName.textContent = "";
	secondTeamName.textContent = "";
	myContainer.style.visibility = "visible";
	questions.style.display = "none";
	location.reload();
}

// --------------  CHECK IF QUIZES STORED IN BROWSER SO NO NEED TO UPLOAD THE QUIZES -----------------------//
function quizExisting() {
	if (localStorage.getItem("quiz")) {
		myContainer.style.visibility = "hidden";
	}
}

quizExisting();

// ---------------------------- Switch to Full Screen  ----------------------------- //
function toggleFullScreen() {
	if (!document.fullscreenElement) {
		document.documentElement.requestFullscreen();
	} else if (document.exitFullscreen) {
		document.exitFullscreen();
		return false;
	}
}

//------------------ COUNTDOWN AUDIO -------------------------------//

function playCountdown() {
	sound.loop = false;
	sound.play();
}

function stopCountdown() {
	sound.pause();
	sound.currentTime = 0;
}

//------------------ SET TIMER -------------------------------//

function setTimer(sec) {
	return (remainingTime = parseInt(sec));
}

//------------------ STOPWATCH -------------------------------//

function stopWatch() {
	clicked = false;
	var timer = setInterval(countdown, 1000); //set the countdown to every second
	function countdown() {
		if (clicked) {
			clearTimeout(timer);
			return;
		}

		if (remainingTime) {
			if (remainingTime == -1) {
				clearTimeout(timer);
			} else {
				remainingTime--; //we subtract the second each iteration
				document.getElementById("time").innerHTML = remainingTime;

				if (remainingTime === 10) {
					playCountdown();
				}

				if (remainingTime < 11) {
					document.getElementById("time").style.color = "crimson";
				}
			}
		} else {
			clearTimeout(timer);
		}
	}
}

//------------------ Teams -------------------------------//
function setNames() {
	const firstInput = document.querySelector("#first-team").value;
	const secondInput = document.querySelector("#second-team").value;

	if (firstInput.length < 1 || secondInput.length < 1) {
		console.log(firstInput, secondInput);
		showAlert("ضيف الاسامي يا كابتن");
		error = true;
	} else {
		localStorage.setItem("first-name", JSON.stringify(firstInput));
		localStorage.setItem("second-name", JSON.stringify(secondInput));
		firstTeamName.textContent = firstInput;
		secondTeamName.textContent = secondInput;
	}
}

//------------------ SCORES -------------------------------//

function UPDATE() {
	if (localStorage.getItem("fScore") && localStorage.getItem("sScore")) {
		fScore = JSON.parse(localStorage.getItem("fScore"));
		sScore = JSON.parse(localStorage.getItem("sScore"));
	} else {
		fScore = [];
		sScore = [];
	}

	let sum = 0;
	fScore.forEach((item) => {
		sum = sum + item;
	});

	let sum2 = 0;
	sScore.forEach((item) => {
		sum2 = sum2 + item;
	});

	localStorage.setItem("fScore", JSON.stringify(fScore));
	localStorage.setItem("sScore", JSON.stringify(sScore));
	firstTeamInput.value = 0;
	secondTeamInput.value = 0;
	firstScore.textContent = sum;
	secondScore.textContent = sum2;
}

function firstTeam() {
	if (localStorage.getItem("fScore")) {
		fScore = JSON.parse(localStorage.getItem("fScore"));
	} else {
		fScore = [];
	}

	if (parseInt(firstTeamInput.value) !== 0) {
		console.log("here");

		fScore.push(parseInt(firstTeamInput.value));

		let sum = 0;
		fScore.forEach((item) => {
			sum = sum + item;
		});

		localStorage.setItem("fScore", JSON.stringify(fScore));
		firstTeamInput.value = 0;
		firstScore.textContent = sum;
	}
}

function secondTeam() {
	if (localStorage.getItem("sScore")) {
		sScore = JSON.parse(localStorage.getItem("sScore"));
	} else {
		sScore = [];
	}

	if (parseInt(secondTeamInput.value) !== 0) {
		sScore.push(parseInt(secondTeamInput.value));

		let sum = 0;
		sScore.forEach((item) => {
			sum = sum + item;
		});

		localStorage.setItem("sScore", JSON.stringify(sScore));
		secondTeamInput.value = 0;
		secondScore.textContent = sum;
	}
}

function firstTeamUpdate() {
	if (localStorage.getItem("fScore")) {
		fScore = JSON.parse(localStorage.getItem("fScore"));
	} else {
		fScore = [];
	}

	if (fScore.length === 0) {
		console.log("here");
		return;
	} else {
		fScore.splice(fScore.length - 1, 1);
		console.log(fScore);
		let sum = 0;
		fScore.forEach((item) => {
			sum = sum + item;
		});

		localStorage.setItem("fScore", JSON.stringify(fScore));
		firstTeamInput.value = 0;
		firstScore.textContent = sum;
	}
}

function secondTeamUpdate() {
	if (localStorage.getItem("sScore")) {
		sScore = JSON.parse(localStorage.getItem("sScore"));
	} else {
		sScore = [];
	}

	if (sScore.length === 0) {
		console.log("here");
		return;
	} else {
		sScore.splice(sScore.length - 1, 1);
		console.log(sScore);
		let sum = 0;
		sScore.forEach((item) => {
			sum = sum + item;
		});

		localStorage.setItem("sScore", JSON.stringify(sScore));
		secondTeamInput.value = 0;
		secondScore.textContent = sum;
	}
}

function answerWithNoOption(quiz, sec, ans, img) {
	const question = document.querySelector(".question");
	const timer = document.createElement("div");
	const start = document.createElement("button");
	const time = document.createElement("div");
	timer.id = "timer";
	start.id = "start";
	start.addEventListener("click", stopWatch, { once: true });
	time.id = "time";
	time.appendChild(document.createTextNode(sec));
	start.appendChild(document.createTextNode("ابدا"));
	timer.appendChild(start);
	timer.appendChild(time);

	question.appendChild(timer);
	const image = document.createElement("img");
	const qa = document.createElement("h2");
	const back = document.createElement("button");
	const show = document.createElement("button");
	image.setAttribute("src", `${img}`);
	image.className = "q-img";
	qa.appendChild(document.createTextNode(quiz));
	qa.className = "q";

	answer.appendChild(document.createTextNode(ans));
	question.appendChild(image);
	question.appendChild(qa);
	question.appendChild(answer);
	back.appendChild(document.createTextNode("ارجع"));
	back.className = "back";
	back.addEventListener("click", backToMenu, { once: true });
	show.appendChild(document.createTextNode("اكشف"));
	show.className = "show-answer";
	show.addEventListener("click", displayAnswer, { once: true });
	question.appendChild(back);
	question.appendChild(show);
	question.classList.add("show");
}

function answerWithOption(
	quiz,
	sec,
	option1,
	option2,
	option3,
	correctOption,
	img
) {
	const question = document.querySelector(".question");
	const timer = document.createElement("div");
	const start = document.createElement("button");
	const time = document.createElement("div");
	timer.id = "timer";
	start.id = "start";
	start.addEventListener("click", stopWatch, { once: true });
	time.id = "time";
	time.appendChild(document.createTextNode(sec));
	start.appendChild(document.createTextNode("ابدا"));
	timer.appendChild(start);
	timer.appendChild(time);

	question.appendChild(timer);
	const image = document.createElement("img");
	const qa = document.createElement("h2");
	const back = document.createElement("button");
	const show = document.createElement("button");
	const showOptions = document.createElement("button");
	image.setAttribute("src", `${img}`);
	image.className = "q-img";
	qa.appendChild(document.createTextNode(quiz));
	qa.className = "q";

	op1.appendChild(document.createTextNode(option1));
	op2.appendChild(document.createTextNode(option2));
	op3.appendChild(document.createTextNode(option3));

	//console.log(op1.innerText);
	// console.log(typeof correctOption);
	op1.className = "options";
	op2.className = "options";
	op3.className = "options";
	// answer.appendChild(document.createTextNode(ans));
	question.appendChild(image);
	question.appendChild(qa);
	optionContainer.className = "oC";
	optionContainer.appendChild(op1);
	optionContainer.appendChild(op2);
	optionContainer.appendChild(op3);
	console.log(op3);
	question.appendChild(optionContainer);
	// question.appendChild(answer);
	back.appendChild(document.createTextNode("ارجع"));
	back.className = "back";
	back.addEventListener("click", backToMenu, { once: true });
	show.appendChild(document.createTextNode("اكشف"));
	show.className = "show-answer";
	showOptions.appendChild(document.createTextNode("خيارات؟"));
	showOptions.className = "show-options";
	showOptions.addEventListener("click", displayOptions, { once: true });

	show.addEventListener(
		"click",
		function () {
			if (op1.innerText === correctOption.toString()) {
				op1.className = "options-correct";
			} else if (op2.innerText === correctOption.toString()) {
				op2.className = "options-correct";
			} else {
				op3.className = "options-correct";
			}
			displayOptionAnswer();
		},
		{ once: true }
	);
	question.appendChild(back);
	question.appendChild(show);
	question.appendChild(showOptions);
	question.classList.add("show");
}
//------------------ FIRST TEAM -------------------------------//

firstTeamAdd.addEventListener("click", firstTeam);

firstTeamUndo.addEventListener("click", firstTeamUpdate);

//------------------ SECOND TEAM -------------------------------//

secondTeamAdd.addEventListener("click", secondTeam);

secondTeamUndo.addEventListener("click", secondTeamUpdate);

//------------------ SCORES -------------------------------//

//------------------ SHOW ALERT -------------------------------//

function showAlert(msg) {
	if (error === false) {
		const warning = document.createElement("div");
		warning.className = "warning";
		warning.appendChild(document.createTextNode(msg));
		teams.before(warning);

		setTimeout(() => {
			document.querySelector(".warning").remove();
			error = false;
		}, 3000);
	}
}

//------------------ DISPLAY   QUESTIOINS -------------------------------//
function showQuestion(
	quiz,
	sec,
	ans,
	img,
	option1,
	option2,
	option3,
	correctOption
) {
	img ? img : (img = "assets/musabaqat.png");
	answer.innerHTML = "";
	answer.style.visibility = "hidden";
	optionContainer.style.visibility = "hidden";
	if (ans.toLowerCase() === "no") {
		answerWithOption(quiz, sec, option1, option2, option3, correctOption, img);
	} else {
		answerWithNoOption(quiz, sec, ans, img);
	}

	// const question = document.querySelector(".question");
	// const timer = document.createElement("div");
	// const start = document.createElement("button");
	// const time = document.createElement("div");
	// timer.id = "timer";
	// start.id = "start";
	// start.addEventListener("click", stopWatch, { once: true });
	// time.id = "time";
	// time.appendChild(document.createTextNode(sec));
	// start.appendChild(document.createTextNode("ابدا"));
	// timer.appendChild(start);
	// timer.appendChild(time);

	// question.appendChild(timer);
	// const image = document.createElement("img");
	// const qa = document.createElement("h2");
	// const back = document.createElement("button");
	// const show = document.createElement("button");
	// image.setAttribute("src", `${img}`);
	// image.className = "q-img";
	// qa.appendChild(document.createTextNode(quiz));
	// qa.className = "q";

	// answer.appendChild(document.createTextNode(ans));
	// question.appendChild(image);
	// question.appendChild(qa);
	// question.appendChild(answer);
	// back.appendChild(document.createTextNode("ارجع"));
	// back.className = "back";
	// back.addEventListener("click", backToMenu, { once: true });
	// show.appendChild(document.createTextNode("اكشف"));
	// show.className = "show-answer";
	// show.addEventListener("click", displayAnswer, { once: true });

	// question.appendChild(back);
	// question.appendChild(show);
	// question.classList.add("show");
}

//------------------ BACK FUNCTION -------------------------------//

function backToMenu() {
	stopCountdown();
	document.querySelector(".question").classList.remove("show");
	document.querySelector(".question").innerHTML = "";
	remainingTime = "";
	answer.innerHTML = "";
	``;
	questions.style.visibility = "visible";
}

function displayAnswer() {
	answer.style.visibility = "visible";
	clicked = true;
	stopCountdown();
}

function displayOptionAnswer() {
	clicked = true;
	stopCountdown();
}

function displayOptions() {
	optionContainer.style.visibility = "visible";
}
function checkCrimsons(ele) {
	if (localStorage.getItem("crimsons")) {
		const ids = JSON.parse(localStorage.getItem("crimsons"));
		if (ids.includes(ele)) {
			return true;
		} else {
			return false;
		}
	}
}

//------------------ GENERATE  & SHUFFLE QUESTIOINS -------------------------------//

function inputValue() {
	let data = JSON.parse(localStorage.getItem("quiz"));

	function shuffle(array) {
		var currentIndex = array.length,
			temporaryValue,
			randomIndex;

		// While there remain elements to shuffle...
		while (0 !== currentIndex) {
			// Pick a remaining element...
			randomIndex = Math.floor(Math.random() * currentIndex);
			currentIndex -= 1;

			// And swap it with the current element.
			temporaryValue = array[currentIndex];
			array[currentIndex] = array[randomIndex];
			array[randomIndex] = temporaryValue;
		}

		return array;
	}
	const shuffledArray = shuffle(data);

	shuffledArray.forEach((ele, i) => {
		const button = document.createElement("button");
		button.className = "box";
		button.appendChild(document.createTextNode(i + 1));
		questions.appendChild(button);

		if (checkCrimsons(ele.id)) {
			button.style.backgroundColor = "crimson";
			return;
		} else {
			button.addEventListener(
				"click",
				() => {
					questions.style.visibility = "hidden";
					showQuestion(
						ele.description,
						ele.duration,
						ele.answer,
						ele.img,
						ele.option1,
						ele.option2,
						ele.option3,
						ele.correctOption
					);
					setTimer(ele.duration);

					button.style.transform = "transform: scale(1)";
					button.style.backgroundColor = "crimson";
					crimsons.push(ele.id);
					localStorage.setItem("crimsons", JSON.stringify(crimsons));
				},
				{ once: true }
			);
		}
	});

	inputs.style.display = "none";
	names.style.display = "grid";
}

document.querySelector(".add-names").addEventListener("click", setNames);
btn.addEventListener("click", inputValue);
document
	.querySelector(".change-screen")
	.addEventListener("click", toggleFullScreen);
