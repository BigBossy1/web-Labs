const formChoice=document.getElementById("form")
const btnFormChoice = document.getElementById('btnShowForm')
const inputFormDiv = document.getElementById('inputForm')
const calculateButton = document.getElementById('calculate')
const clearButton = document.getElementById('clear')
const resultsDiv= document.getElementById('results')
const selectedForm = document.getElementById('form')
const operationsSelected = document.getElementById('operations')

console.log(inputFormDiv)
btnFormChoice.addEventListener('click', () =>{
    const selectedForm=formChoice.value
    if(selectedForm==="algebraic") createAlgebraicInputFields()
    else createTrigonometricInputFields()
})

function createAlgebraicInputFields() {
    const html=`
    <div>
        <label for="real">Действительная часть (а)</label>
        <input type="text" id="real" name="real">
        <div class="error" id="realError"></div>
    </div>
    <div>
        <label for="imaginary">Мнимая часть (b)</label>
        <input type="text" id="imaginary" name="imaginary">
        <div class="error" id="imaginaryError"></div>
    </div>
    `
    inputFormDiv.innerHTML = html
}

function createTrigonometricInputFields(){
    const html=`
    <div>
        <label for="radius">Радиус (r)</label>
        <input type="text" id="radius" name="radius">
        <div class="error" id="radiusError"></div>
    </div>
    <div>
        <label for="angle">Угол (x) в радианах</label>
        <input type="text" id="angle" name="angle">
        <div class="error" id="angleError"></div>
    </div>
    `
    inputFormDiv.innerHTML = html
}

function validateAlgebraicInput(){
    const realInput = document.getElementById('real')
    const imaginaryInput = document.getElementById('imaginary')
    const realError= document.getElementById('realError')
    const imaginaryError = document.getElementById('imaginaryError')
    let isValid= true;
    const real= realInput.value.trim()
    const imaginary = imaginaryInput.value.trim()

    if(!real){
        realError.textContent="Требуется ввести действительную часть"
    } else if(isNaN(Number(real))){
        realError.textContent='Неверный формат действительной части'
        isValid=false
    } else realError.textContent=''

    if(!imaginary){
        imaginaryInput.textContent="Требуется ввести мнимую часть"
    } else if(isNaN(Number(imaginary))){
        imaginaryError.textContent='Неверный формат мнимой части'
        isValid=false
    } else imaginaryError.textContent=''
    return isValid ?{
        real: Number(real),
        imaginary: Number(imaginary)
    } : null;
}

function validateTrigonometricInput() {
    const radiusInput = document.getElementById("radius");
    const angleInput = document.getElementById("angle");
    const radiusError = document.getElementById("radiusError");
    const angleError = document.getElementById("angleError");
    let isValid = true;

    radiusError.textContent = "";
    angleError.textContent = "";

    const radius = radiusInput.value.trim();
    const angle = angleInput.value.trim();

    if (!radius) {
        radiusError.textContent = "Требуется ввести радиус.";
        isValid = false;
    } else if (isNaN(Number(radius)) || Number(radius) < 0) { // Radius must be positive
        radiusError.textContent = "Неверный радиус. Должен быть неотрицательным числом.";
        isValid = false;
    }

    if (!angle) {
        angleError.textContent = "Требуется ввести угол.";
        isValid = false;
    } else if (isNaN(Number(angle))) {
        angleError.textContent = "Неверный формат угла. Должен быть числом.";
        isValid = false;
    }

    return isValid ? {
        radius: Number(radius),
        angle: Number(angle)
    } : null;
}

function toAlgebraic(r, theta){
    const a = r * Math.cos(theta)
    const b = r * Math.sin(theta)
    return{
        real: a,
        imaginary: b
    }
}

function toTrigonometric(a, b){
    const r = Math.sqrt(a**2 + b**2)
    const theta = Math.atan2(b, a)
    return {
        r: r,
        theta: theta
    }
}

function calculateModule(a, b){
    return Math.sqrt(a**2 + b**2)
}

function calculateArgument(a, b){
    return Math.atan2(b, a);
}

function calculateImaginary(a, b){
    return b;
}


function clearInputFields(){
    const inputs = inputFormDiv.querySelectorAll('input[type="text"]')
    inputs.forEach(input =>{
        input.value=''
    })
    resultsDiv.innerHTML=''
    const errorDivs = inputFormDiv.querySelectorAll('.error');
    errorDivs.forEach(errorDivs =>{
        errorDivs.textContent=''
    })
}

clearButton.addEventListener('click', clearInputFields)

function preformCalculations(representation, inputData, selectedOperations) {
    let resultsHTML=''
    if(representation==='algebraic'){
        const a = inputData.real
        const b= inputData.imaginary
        if(selectedOperations.includes('argument')){
            const argument = calculateArgument(a, b);
            resultsHTML+=`<p>Аргумента числа: ${argument.toFixed(4)} радиан</p>`
        }
        if(selectedOperations.includes('imaginary')){
            const imaginaryPart=calculateImaginary(a, b)
            resultsHTML+=`<p>Мнимая часть числа: ${imaginaryPart}</p>`
        }
        if (selectedOperations.includes("switchForm")) {
            const trig = toTrigonometric(a, b);
            resultsHTML += `<p>Тригонометрическая форма: ${trig.r.toFixed(4)}(cos(${trig.theta.toFixed(4)}) + isin(${trig.theta.toFixed(4)}))</p>`;
        }
        if (selectedOperations.includes("module")) {
            const module = calculateModule(a, b);
            resultsHTML += `<p>Модуль числа: ${module.toFixed(4)}</p>`;
        }
    } else if(representation==='trigonometric'){
        const r = inputData.radius
        const theta = inputData.angle
        if (selectedOperations.includes("argument")) {
            resultsHTML += `<p>Аргумент числа: ${theta.toFixed(4)} радиан</p>`; //Argument is just theta in trig form
        }
        if (selectedOperations.includes("imaginary")) {
            const imaginaryPart = toAlgebraic(r, theta).imaginary;
            resultsHTML += `<p>Мнимая часть числа: ${imaginaryPart.toFixed(4)}</p>`;
        }
        if (selectedOperations.includes("switchForm")) {
            const algebraic = toAlgebraic(r, theta);
            resultsHTML += `<p>Алгебраическая форма: ${algebraic.real.toFixed(4)} + ${algebraic.imaginary.toFixed(4)}i</p>`;
        }
        if (selectedOperations.includes("module")) {
            resultsHTML += `<p>Модуль числа: ${r.toFixed(4)}</p>`; //Module is radius in trig form
        }
    }
    return resultsHTML
}

calculateButton.addEventListener('click', ()=> {
    resultsDiv.innerHTML=''
    const selectedRepresentation = selectedForm.value
    const selectedOperations = Array.from(operationsSelected.selectedOptions).map(option => option.value)
    let inputData=null
    let isValidInput=false
    if(selectedRepresentation==='algebraic'){
        inputData=validateAlgebraicInput()
        isValidInput = inputData!==null
    } else if(selectedRepresentation==='trigonometric'){
        inputData=validateTrigonometricInput()
        isValidInput = inputData !==null
    }

    if(isValidInput){
        resultsDiv.innerHTML=preformCalculations(selectedRepresentation, inputData, selectedOperations)
    }
})
createAlgebraicInputFields()