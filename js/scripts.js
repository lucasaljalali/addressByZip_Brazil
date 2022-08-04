const addressForm = document.querySelector('#address-form');
const zipInput = document.querySelector('#zip');
const addressInput = document.querySelector('#address');
const cityInput = document.querySelector('#city');
const locationInput = document.querySelector('#location');
const stateInput = document.querySelector('#state');
const formInputs = document.querySelectorAll('[data-input]');

const closeButton = document.querySelector('#close-message');

const fadeElement = document.querySelector('#fade');


//validate zip input
zipInput.addEventListener('keypress', (e) => {
    const onlyNumbers = /[0-9]/;
    const key = String.fromCharCode(e.keyCode);

    //allow only number
    if (!onlyNumbers.test(key)) {
        e.preventDefault();
        return;
    }
});

//get address event 
zipInput.addEventListener('keyup', (e) => {
    const inputValue = e.target.value;
    
    //check if we have the correct length
    if (inputValue.length === 8) {
        getAddress(inputValue);
    }
});

//get customer address from API
const getAddress = async (zip) => {
    
    toggleLoader();

    zipInput.blur();

    const apiUrl = `https://viacep.com.br/ws/${zip}/json`;

    const response = await fetch(apiUrl);

    const data = await response.json();

    //show erros and reset form
    if (data.erro === 'true') {
        if (!addressInput.hasAttribute("disabled")) {
            toggleDisabled();
        }
        
        addressForm.reset();
        toggleLoader();
        toggleMessage('Invalid ZIP, try again.');
        return;
    }

    // Activate disabled attribute if form is empty
    if (addressInput.value === "") {
        toggleDisabled();
    }

    addressInput.value = data.logradouro;
    cityInput.value = data.localidade;
    locationInput.value = data.bairro;
    stateInput.value = data.uf;

    toggleLoader();
};

//show or hide loader
const toggleLoader = () => {
    const loaderElement = document.querySelector('#loader');

    fadeElement.classList.toggle('hide');
    loaderElement.classList.toggle('hide');
};

//show or hide message
const toggleMessage = (msg) => {
    const messageElement = document.querySelector('#message');
    const messageElementText = document.querySelector('#message p');

    messageElementText.innerText = msg;

    fadeElement.classList.toggle('hide');
    messageElement.classList.toggle('hide');
};

//close message modal
closeButton.addEventListener('click', () => toggleMessage());

//add or remove disabled attribute
const toggleDisabled = () => {
    if (stateInput.hasAttribute('disabled')) {
        formInputs.forEach((input) => {
            input.removeAttribute('disabled');
        });
    } else {
        formInputs.forEach((input) => {
            input.setAttribute('disabled', 'disabled');
        });
    }
};

//save address
addressForm.addEventListener('submit', (e) => {
    e.preventDefault();
    toggleLoader();
    
    setTimeout(() => {
        toggleLoader();
        toggleMessage('Address saved!');
        addressForm.reset();
        toggleDisabled();
    }, 1500);
});