// update display with digit or operator
function display(value) {
    let currVal = document.querySelector('#displaytext').textContent;
    let newExpression = '' + currVal + value;
    if (newExpression.match(/[+\-/*][+/*]/) ) {
        alert("Operators can only operate on numbers");
        return;
    } else if (newExpression.length > 16) {
        alert("Sorry, this calculator only has so much space.")
        return;
    }
    document.querySelector('#displaytext').textContent = newExpression;
}

// update display with decimal
function decimalize() {
    let currVal = document.querySelector('#displaytext').textContent;
    let lastNum = currVal.match(/[\d.]+$/)
    if (lastNum === null) {
        display('.')
    } else if (lastNum[0].includes('.')) {
        alert("There's already a decimal here :)")
        return;
    } else {
        display('.')
    }
}

function backspace() {
    let currVal = document.querySelector('#displaytext').textContent;
    document.querySelector('#displaytext').textContent = currVal.slice(0, -1);
}

function clear() { document.querySelector('#displaytext').textContent = ''; }

function add(a, b) { return (a + b); }

function subtract(a, b) { 
    return (a - b); 
}

function multiply(a, b) { 
    let x = a / b;
    x = x.toString()
    if (x.includes('.')) {
        while (x.length > 14) {
            x = rounder(x);
        }
    }
    return (a * b); }

function rounder(a) {
    let trailingDig = a.match(/\d\.\d+$/);
    if (trailingDig === null) {
        return a;
    }
    let len = trailingDig[0].length;

    // Swap out number for rounded number.
    let newEnd = Number(trailingDig[0]).toFixed(len - 3);
    a = a.replace(/\d\.\d+$/, newEnd)
    return a;
}

function divide(a, b) { 
    let x = a / b;
    x = x.toString()
    while (x.length > 14) {
        x = rounder(x);
    }
    return (parseFloat(x));
}

// choose operator
function operate(a, b, sign) {
    if (sign === "+") {
        result = add(a, b);
    } else if (sign === '-') {
        result = subtract(a, b);
    } else if (sign === '*') {
        result = multiply(a, b);
    } else if (sign === '/') {
        result = divide(a, b);
    }
    return result;
}

// prepare display string for operation
function regexMathCut(string, regexMath) {
    while(string.match(regexMath)) {
        let match = string.match(regexMath)
        if (match[1].match(/^\./)) {
            match[1] = match[1].replace(/^/, 0)
        }
        let a = Number(match[1])
        let sign = match[2]
        if (match[3].match(/^\./)) {
            match[3] = match[3].replace(/^/, 0)
        }
        let b = Number(match[3])
        result = operate(a, b, sign)
        string = string.replace(regexMath, result)
    }
    return string;
}

function equals() {
    let currEquation = document.querySelector('#displaytext').textContent;

    // get rid of erronous operators at beginning and end of string
    currEquation = currEquation.replace(/^[+/*]/, '')
    currEquation = currEquation.replace(/[-+/*]$/, '')

    // If there is an operator in the equation, work through all the operators until only a number remains.
    while (currEquation.match(/[\d.][+*/-]+[\d.]/)) {
        // beDMas 
        let dmExpress = /([-\d.]+)([*/])([-\d.]+)/
        currEquation = regexMathCut(currEquation, dmExpress)

        // bedmAS
        let asExpress = /([-\d.]+)([-+])([-\d.]+)/
        currEquation = regexMathCut(currEquation, asExpress)
    }

    if (currEquation === 'Infinity') {
        alert('No')
        clear();
    } else if (currEquation.toString().length > 15) {
        while (currEquation.toString().length > 15) {
            currEquation = rounder(currEquation);
        }
        if (currEquation.includes('.')) {
            currEquation = currEquation.replace(/0+$/, '')
        }
        document.querySelector('#displaytext').textContent = currEquation;
    } else {
        document.querySelector('#displaytext').textContent = currEquation;
    }
}

// initialize digit and operator buttons
let buttons = document.querySelectorAll('.btn');
buttons.forEach((button) => {
    button.addEventListener('click', () => {
        display(button.textContent);
    });
});

let equalSign = document.querySelector('#equals')
equalSign.addEventListener('click', () => {
    equals();
})

// initialize non-operator function buttons
let CC = document.querySelector('#clear')
CC.addEventListener('click', () => {
    clear();
});

let roundBtn = document.querySelector('#round');
roundBtn.addEventListener('click', () => {
    let currDisplay = document.querySelector('#displaytext').textContent;
    document.querySelector('#displaytext').textContent = rounder(currDisplay);
})

let deci = document.querySelector('#decimal')
deci.addEventListener('click', () => {
    decimalize();
});

let bs = document.querySelector('#backspace')
bs.addEventListener('click', () => {
    backspace();
});

// initialize keyboard functionality
window.addEventListener('keydown', function(e) {
    const buttonInput = document.querySelector(`button[value="${e.key}"]`)
    if(!buttonInput) return;
    buttonInput.click()
});