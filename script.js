"use strict";

const calcBtn = document.querySelector(".inbetween__button");

const inputD = document.querySelector(".inputs__input--d");
const inputM = document.querySelector(".inputs__input--m");
const inputY = document.querySelector(".inputs__input--y");

const resultD = document.querySelector(".computed__emp--d");
const resultM = document.querySelector(".computed__emp--m");
const resultY = document.querySelector(".computed__emp--y");

const months = {
    1: 31,
    2: 28,
    3: 31,
    4: 30,
    5: 31,
    6: 30,
    7: 31,
    8: 31,
    9: 30,
    10: 31,
    11: 30,
    12: 31
}

calcBtn.onclick = primary;

function primary() {
    const currentDate = new Date();
    const currentD = currentDate.getDate();
    const currentM = currentDate.getMonth() + 1;
    const currentY = currentDate.getFullYear();
    const userD = +inputD.value;
    const userM = +inputM.value;
    const userY = +inputY.value;

    if (isEmpty(inputD) + isEmpty(inputM) + isEmpty(inputY)) { return; }

    let pass = isMonthCorrect(userM) + isDayCorrect(userD, userM, userY) + isYearCorrect(userY);
    
    if (pass !== 3) { return; }

    if (userY === new Date().getFullYear()) {
        pass = isDateCorrect(userD, userM);
    }

    if (pass === false) { return; }

    let d = 0;
    let m = 0;
    let y = 0;

    if (userY === currentY && currentD >= userD) {
        m = currentM - userM;
        d = currentD - userD;
    } else if (userY === currentY && currentD < userD) {
        m = currentM - userM - 1;
        d = userD - currentD;
    }

    if (userY < currentY && currentD >= userD) {
        m = 12 - userM + currentM;
        d = currentD - userD;

        if (m >= 12) {
            m %= 12;
            y = currentY - userY;
        } else {
            y = currentY - userY - 1;
        }
    } else if (userY < currentY && currentD < userD) {
        m = 12 - userM + currentM - 1;

        if (userM === 2 && isLeapYear(userY)) {
            d = months[userM] + 1 - userD + currentD;
        } else {
            d = months[userM] - userD + currentD;
        }

        if (m >= 12) {
            m %= 12;
            y = currentY - userY;
        } else {
            y = currentY - userY - 1;
        }
    }

    resultD.innerHTML = d;
    resultM.innerHTML = m;
    resultY.innerHTML = y;
}

function isLeapYear(y) {
    return y % 4 === 0 && y % 100 !== 0 || y % 100 === 0 && y % 400 === 0;
}

function isEmpty(e) {
    if (e.value === "") {
        activateError(e, "This field is required");
        return true;
    } else {
        deactivateError(e);
        return false;
    }
}

function isDayCorrect(d, m, y) {
    if (isMonthCorrect(m) && isYearCorrect(y) &&
        ((isLeapYear(y) === true && m === 2 && d > months[m] + 1) ||
        (isLeapYear(y) === false && d > months[m]) ||
        d <= 0 || d > 31)) {
        activateError(inputD, "Must be a valid date");
        setTimeout(() => {
            activateError(inputM);
            activateError(inputY);
        }, 1)
        return false;
    } else if ((isLeapYear(y) === true && m === 2 && d > months[m] + 1) ||
        (isLeapYear(y) === false && d > months[m]) ||
        d <= 0 || d > 31) {
        activateError(inputD, "Must be a valid day");
        return false;
    } else {
        deactivateError(inputD);
        return true;
    }
}

function isMonthCorrect(m) {
    if (m <= 0 || m > 12) {
        activateError(inputM, "Must be a valid month");
        return false;
    } else {
        deactivateError(inputM);
        return true;
    }
}

function isYearCorrect(y) {
    if (y > new Date().getFullYear()) {
        activateError(inputY, "Must be in the past");
        return false;
    } else if (y < 0) {
        activateError(inputY, "Must be a valid year");
        return false;
    } else {
        deactivateError(inputY);
        return true;
    }
}

function isDateCorrect(d, m) {
    if (d > new Date().getDate() && m > new Date().getMonth() + 1) {
        activateError(inputM, "Must be in the past");
        activateError(inputD, "Must be in the past");
        return false;
    } else if (d > new Date().getDate() && m === new Date().getMonth() + 1) {
        activateError(inputD, "Must be in the past");
        return false;
    } else if (m > new Date().getMonth() + 1) {
        activateError(inputM, "Must be in the past");
        return false;
    } else {
        deactivateError(inputD);
        deactivateError(inputM);
        return true;
    }
}

function activateError(e, m = "") {
    const prev = e.previousElementSibling;
    const next = e.nextElementSibling;

    prev.classList.add("inputs__label--error");
    next.innerText = m;
    next.classList.add("inputs__error--active");
    e.classList.add("inputs__input--error");
}

function deactivateError(e) {
    const prev = e.previousElementSibling;
    const next = e.nextElementSibling;

    prev.classList.remove("inputs__label--error");
    next.classList.remove("inputs__error--active");
    e.classList.remove("inputs__input--error");
}