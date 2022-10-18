let fileInput = document.getElementById("file-upload-input");
let fileSelect = document.getElementsByClassName("file-upload-select")[0];
fileSelect.onclick = function() {
	fileInput.click();
}
fileInput.onchange = function() {
	let filename = fileInput.files[0].name;
	let selectName = document.getElementsByClassName("file-select-name")[0];
	selectName.innerText = filename;
}





// -------------- THIS CODE TO CONVERT THE EXCEL FILE TO JSON -----------------------//



let selectedFile;
console.log(window.XLSX);
document.getElementById('file-upload-input').addEventListener("change", (event) => {
    selectedFile = event.target.files[0];
})

let data=[{
    "name":"jayanth",
    "data":"scd",
    "abc":"sdef"
}]


document.getElementById('convert').addEventListener("click", () => {
    XLSX.utils.json_to_sheet(data, 'out.xlsx');
    if(selectedFile){
        let fileReader = new FileReader();
        fileReader.readAsBinaryString(selectedFile);
        fileReader.onload = (event)=>{
         let data = event.target.result;
         let workbook = XLSX.read(data,{type:"binary"});
        //  console.log(workbook);
         let temp;
         workbook.SheetNames.forEach(sheet => {
              let rowObject = XLSX.utils.sheet_to_row_object_array(workbook.Sheets[sheet]);
              console.log(rowObject);
              //document.getElementById("jsondata").innerHTML = JSON.stringify(rowObject,undefined,4)
              temp = JSON.stringify(rowObject,undefined,4)
         });

         localStorage.setItem('quiz', temp);
         var obj = JSON.parse(localStorage.getItem('quiz'));
        //  document.getElementById("jsondata").innerHTML = obj;
        
    }
    document.querySelector('.my-container').style.visibility = "hidden";
    }
});

// -------------------------------------------------------------------------------------

const sound = new Audio('assets/countdown.mp3');
const inputs = document.querySelector('.inputs');
const input = document.querySelector('.input');
const btn = document.querySelector('.btn');
const questions = document.querySelector('.questions');
const test = document.createElement('h2');
const myContainer = document.querySelector('.my-container')
test.style.visibility = "hidden"
let remainingTime;
let clicked = false;
let crimsons;
if(localStorage.getItem('crimsons')){
    crimsons = JSON.parse(localStorage.getItem('crimsons'))
}else{
    crimsons = [];
}

// --------------  SWITCH BETWEEN PAGES -----------------------//

function switchPage(){
   if( myContainer.style.visibility === "hidden"){
    myContainer.style.visibility = "visible";
   }else {

       myContainer.style.visibility = "hidden"
   }
  
   
}

// --------------  CHECK IF QUIZES STORED IN BROWSER SO NO NEED TO UPLOAD THE QUIZES -----------------------//
function quizExisting(){
    if(localStorage.getItem('quiz')){
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

function playCountdown(){
    sound.loop = false;
    sound.play();
}

function stopCountdown(){
   
    sound.pause();
    sound.currentTime = 0;
}




//------------------ SET TIMER -------------------------------//

function setTimer(sec){
    console.log('hi')
    console.log(sec)
    return remainingTime= parseInt(sec);
}

//------------------ STOPWATCH -------------------------------//

function stopWatch(){
    clicked = false;
    var timer = setInterval(countdown, 1000); //set the countdown to every second
    function countdown() {

        if(clicked){
            clearTimeout(timer);
            return;
        }

     if(remainingTime ){
        if (remainingTime == -1) {
            clearTimeout(timer);
           
          }else {
              
            
                remainingTime--; //we subtract the second each iteration
                document.getElementById('time').innerHTML = remainingTime ;

                if(remainingTime === 10){
                    playCountdown();
                }

              if (remainingTime < 11){
                  document.getElementById('time').style.color = "crimson"
                
                }
      
           
            }
     }else{

         clearTimeout(timer);
     }
     
      
    }
     
}



//------------------ DISPLAY   QUESTIOINS -------------------------------//
function showQuestion(quiz,sec, answer){

    test.innerHTML = "";
    test.style.visibility = "hidden"
    

    const question = document.querySelector('.question');
    const timer = document.createElement('div');
    const start = document.createElement('button');
    const time = document.createElement('div');
    timer.id = "timer"
    start.id = "start";
    start.addEventListener('click', stopWatch,{once:true})
    time.id="time";
    time.appendChild(document.createTextNode(sec));
    start.appendChild(document.createTextNode('ابدا'));
    timer.appendChild(start);
    timer.appendChild(time)

    
    question.appendChild(timer);
    const qa = document.createElement('h2');
    // const an = document.createElement('h2');
    const back = document.createElement('button');
    const show = document.createElement('button')
    qa.appendChild(document.createTextNode(quiz));
    test.appendChild(document.createTextNode(answer))
    question.appendChild(qa);
    question.appendChild(test)
    back.appendChild(document.createTextNode('ارجع'));
    back.className = "back";
    back.addEventListener('click', backToMenu,{once:true})
    show.appendChild(document.createTextNode('اكشف'));
    show.className = "show-answer";
    show.addEventListener('click', displayAnswer,{once:true})
    
    question.appendChild(back);
    question.appendChild(show);
    question.classList.add('show');
    

}

//------------------ BACK FUNCTION -------------------------------//


function backToMenu(){
    stopCountdown()
    document.querySelector('.question').classList.remove('show');
    document.querySelector('.question').innerHTML = "";
    //document.querySelector('#time').innerHTML = "";
    remainingTime = "";
    test.innerHTML = "";
    
    questions.style.visibility= "visible";

}


function displayAnswer(){
    test.style.visibility = "visible"
    clicked = true;
    stopCountdown()
    
}

function checkCrimsons(ele){

  if(localStorage.getItem('crimsons')){
    const ids = JSON.parse(localStorage.getItem('crimsons'));
    if(ids.includes(ele)){
     console.log('pass')
     return true;
    }else{
     return false;
    }
  }
}


//------------------ GENERATE   QUESTIOINS -------------------------------//

function inputValue(){

let data =   JSON.parse(localStorage.getItem('quiz'));  


    
data.forEach((ele, i) =>{
    // console.log(ele.id)
    const button = document.createElement('button');
     button.className = "box";
     button.appendChild(document.createTextNode(i + 1))
     questions.appendChild(button)
     console.log(ele.id)
     console.log(checkCrimsons(ele.id))

     if(checkCrimsons(ele.id)){
        console.log('here')
        button.style.backgroundColor = "crimson";
        return
     }else{
        button.addEventListener('click', () => {
       
            questions.style.visibility= "hidden";
             showQuestion(ele.description, ele.duration, ele.answer)
             setTimer(ele.duration);
            
            
            button.style.transform = "transform: scale(1)";
            button.style.backgroundColor = "crimson"
            crimsons.push(ele.id);
            localStorage.setItem('crimsons', JSON.stringify(crimsons))
          },{once:true})
     }
     
    
    

})

//  input.value ="";
 inputs.style.visibility = "hidden"


}



btn.addEventListener('click', inputValue);