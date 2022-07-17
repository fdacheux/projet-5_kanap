/************************* FETCH API *************************/


//I) FETCH ALL  

const API_URL = "http://localhost:3000/api/products"; //global

async function fetchAllProducts (API_URL){
    try {
        let response = await fetch(API_URL);
        if (response.ok){
            let productsArray = await response.json();
            return productsArray;
        }
        else {
            console.error('Retour du serveur : ', response.status);
        }
    }
    catch (err) {
        console.error(err.stack);
    }
}

//II) FETCH ONE PRODUCT

// Function that fetches one product
async function fetchProduct (id){
    try {
        let response = await fetch(`${API_URL}/${id}`);
        if(response.ok){
            let productObject = await response.json();
            return productObject;
        }
        else{
            console.error('Retour du serveur : ', response.status)
        }
    }
    catch (err) {
        console.error(err.stack);
    }
}

/************************* GET CART CONTENT FROM LOCAL STORAGE *************************/

const CART = localStorage && localStorage.getItem('cart') ? JSON.parse(localStorage.getItem('cart')) : [];

/************************* CREATE CART ON DOM *************************/

// I) CREATE CARD FOR EACH PRODUCT: 

const CART_ITEMS_CARDS = document.getElementById('cart__items'); //select parent div where clone elements will be added
const TEMPLATE = document.querySelector("#cart__item-card"); //select template for clone purposes

// Colors translation 

function translateColour (colour) { //take a string (the colour from API) and translate it in French
    switch(colour) {
        case "White":
            return "Blanc";
        case "Black":
            return "Noir";
        case "Blue":
            return "Bleu";
        case "Green":
            return "Vert";
        case "Red":
            return "Rouge";
        case "Orange":
            return "Orange";
        case "Pink":
            return "Rose";
        case "Grey":
            return "Gris";
        case "Purple":
            return "Violet";
        case "Navy":
            return "Bleu marine";
        case "Silver":
            return "Argenté";
        case "Brown":
            return "Marron";
        case "Yellow":
            return "Jaune";
        case "Black/Yellow":
            return "Noir/Jaune";
        case "Black/Red":
            return "Noir/Rouge";
        default : 
            return "Inconnu";        
    }
}

// Function that selects a specific card using data-id and data-colour attributes
const selectProductCard = (id, color) => {
    let productCard = document.querySelector(`[data-id="${id}"][data-color="${color}"]`);
    return productCard;
}

// A) Create a model of card and clone it : 

const cloneProductCardTemplate = () => {
            let clone = TEMPLATE.content.cloneNode(true);
            let cartItem = clone.querySelector('article');
            let quantityInput = clone.querySelector('input');
            let colorName = clone.querySelector('.cart__item__content__description p:first-of-type');
            
            cartItem.dataset.id = `${element.id}`;
            cartItem.dataset.color = `${element.color}`;
            quantityInput.setAttribute('value', `${element.quantity}`);
            colorName.textContent = translateColour(element.color); 
            
            CART_ITEMS_CARDS.appendChild(clone);   
}

// B) Get properties from api and insert it in the right element : 

const calculatePrice = (price, quantity) => { //calculate total price for each article
    return price*quantity
}

async function insertPropertiesFromApi () { //fecth properties of product and insert them inside the cards
    
        // Get elements from CART array
    
        let id = element.id;  
        let color = element.color; 
        let quantities = element.quantity; 
        let totalPrice = 0;
        let selectedCard = selectProductCard(id, color); //get card using data-id end data-color attributes 
    
        // Get the elements that need to be filled with API data
    
        let cartProductImage = selectedCard.querySelector('img'); //get image
        let itemContentDescription = selectedCard.querySelector('.cart__item__content__description');// Get parent element for description
        let productName = itemContentDescription.querySelector('h2'); //Name
        let priceParagraph = itemContentDescription.querySelector('p:nth-of-type(2)');//price (= price*quantity)
        
        // Set attributes and/or text for each property of the selected product
    
        let result = await fetchProduct(id); // fetch api, get product properties
        cartProductImage.setAttribute('src', `${result.imageUrl}`); //Image URL
        productName.textContent = result.name; // Name of product
        totalPrice += calculatePrice(result.price, quantities);
        priceParagraph.textContent = `${totalPrice} €` // Total price for the product 
            
        
}

// Create cards for each element


function createCardsForProductsInCart() { // Function that creates clones of card template and fills them
    for (element of CART){
        cloneProductCardTemplate()
        insertPropertiesFromApi()
    }
    return true;
}

CART? createCardsForProductsInCart():document.getElementById('cart__items').textContent='Votre panier est vide'; //if Cart isn't null, creates and adds the cards, else warns about cart emptiness;


// II) DISPLAY TOTAL OF ALL PRICES AND QUANTITY OF ARTICLES :


// A) Calculate and display total quantity : 
    
let totalQuantity = 0; //Array to put all quantities

const getTotalQuantity = () => {
    for (element of CART){
        totalQuantity+=element.quantity; // Loop to add all articles quantities 
    }
    document.getElementById('totalQuantity').textContent = totalQuantity; // Display it 
};

getTotalQuantity()

// const TOTAL_QUANTITY = quantitiesArray.reduce((previousValue, currentValue) => previousValue + currentValue, 0); // Calculate total quantity

// B) Calculate total of all prices 

let total = 0; // total of all prices 

// Function that pushes the total of an article in an array
async function getPricePerQuantity(id, quantity) {
    const product = await fetchProduct(id);
    const price = product && product.price ? product.price : 0;
    return price*quantity;
}

async function getTotalPrice () {
    for (element of CART){ //loop on cart elements
            total += await getPricePerQuantity(element.id, element.quantity); //Sum of the totals 
        }
    document.getElementById('totalPrice').textContent = `${total}`; //Display total
}

getTotalPrice();



/************************* ADD ELEMENT IN CART FROM CART PAGE *************************/

// Elements to listen to
let idArray = [];
for (element of CART){
    idArray.push(element.id);
}

const ALL_PRODUCTS_ARTICLES = document.querySelectorAll(`[data-id]`);
// console.log(ALL_PRODUCTS_ARTICLES);

const updateQuantityInCart = (elementToUpdate, quantity) => {
    elementToUpdate.quantity = parseInt(quantity);
    return localStorage.setItem('cart', JSON.stringify(CART))
}


function inputIsValidStyle (element) {
    element.style.borderColor = "green";
    element.style.borderWidth = "3px";
    element.style.color = "green";
    element.style.fontWeight = "unset"; 
}

function inputIsNotValidStyle (element) {
    element.style.borderColor = "red";
    element.style.borderWidth = "3px";
    element.style.color = "red";
    element.style.fontWeight = "bold"; 
}

function resetInputStyle (element) {
    element.removeAttribute('style');   
}

function removeProductFromLocalStorage (productIndex) {
    CART.splice(productIndex, 1);
    return localStorage.setItem('cart', JSON.stringify(CART))
}


function removeProductFromCart(productIndex, productCard) {
    CART.length > 1 ? removeProductFromLocalStorage (productIndex) : clearCart();
    return productCard.remove();
}

function clearCart () {
    localStorage.clear();
    CART.splice(0, 1);
    return document.getElementById('cart__items').textContent = "Votre panier est vide.";
}


document.querySelectorAll('[data-id]').forEach(element => {
    let id = element.dataset.id;
    let productCard = element;
    let productColor = element.dataset.color;
    let newQuantity; 
    let paragraph = element.querySelector('p:nth-of-type(2)');
    const elementToUpdateInCart = CART.find(element =>  element.id === id && element.color === productColor);
    let productIndex = CART.indexOf(elementToUpdateInCart);
    element.addEventListener('input', event => {
        let inputNumber = event.target.value;
        if(!inputNumber || inputNumber>100 || inputNumber<0) {
            inputIsNotValidStyle(event.target);
        }
        else {
            if(inputNumber==='0'){
                let deleteProductMessage = window.confirm('Souhaitez-vous supprimer ce produit de votre panier ?');
                deleteProductMessage ? removeProductFromCart(productIndex, productCard) : event.target.value = 1;
            }
            else {
                event.target.value = Math.floor(event.target.value);
                inputIsValidStyle(event.target); // Apply a peculiar style notifying the user that the value is valid
                newQuantity = event.target.value; // Get the new quantity directly from input area
                event.target.setAttribute('value', `${newQuantity}`); //change value of input for quantity
                updateQuantityInCart(elementToUpdateInCart, newQuantity); // Change quantity value in local storage
                changePrice(id, newQuantity, paragraph); // change displayed price for an element
            }
            
            updateTotalQuantityAndPrice(); //Update total price and quantity 
            
        }
    })
    let deleteButton = element.querySelector('.cart__item__content__settings__delete');
    deleteButton.addEventListener('click', event => {
        let deleteProductMessage = window.confirm('Souhaitez-vous supprimer ce produit de votre panier ?');
        deleteProductMessage ? removeProductFromCart(productIndex, productCard) : null;
        updateTotalQuantityAndPrice();
    })
    let input = element.querySelector('input');
    input.addEventListener('blur', event => {
        event.target.value && event.target.value<100 && event.target.value>0 ? resetInputStyle(event.target): null; //when blur, if element isn't valid, apply a red style to warn there's an error 
    })
});

async function changePrice (id, quantity, paragraph) { //change price depending on quantity 
    let newPrice = await getPricePerQuantity (id, quantity);
    paragraph.textContent = `${newPrice} €`;
    return newPrice;
}

async function updateTotalQuantityAndPrice () {
    total = 0;
    totalQuantity = 0;
    getTotalQuantity();
    await getTotalPrice();
}




/************************* FORM *************************/

//Regex : 

// first name and last-name should not contain numbers but should not be case sensitive either and accepts "-" 

const NAMES_REGEX = /^[A-Za-zÀ-ÿ][a-zÀ-ÿ .'-]*$/i;
const ADDRESS_FIRST_CHARACTER_REGEX = /^[A-Za-zÀ-ÿ0-9]/
const MAIL_FIRST_CHARACTER_REGEX = /^[A-Za-z]/
const NUMBERS_REGEX = /[0-9]/;
const CONTAIN_INT_REGEX = /\d/;
const CONTAIN_CONSECUTIVE_SYMBOLS = /[.\-\' \_@]{2}/;
const CONTAIN_FORBIDDEN_SYMBOLS = /[\!\@\$\%\^\&\*\(\)\,\?\"\:\{\}\|\<\>\=\+\;\/\\]+/;
const MAIL_FORBIDDEN_SPECIAL_CHARACTERS = /[^\w\@\.\-]+/;
const ADDRESS_REGEX = /[^\w\d\[À-ÿ],\-\'\ ]+|[_]+/
const MAIL_REGEX = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;

//Select elements to listen to

// Listening to events : Input -> 

const FIRST_NAME_INPUT = document.getElementById('firstName');
const FIRST_NAME_ERROR_MESSAGE = document.getElementById('firstNameErrorMsg');
const LAST_NAME_INPUT = document.getElementById('lastName');
const LAST_NAME_ERROR_MESSAGE = document.getElementById('lastNameErrorMsg');
const ADDRESS_INPUT = document.getElementById('address');
const ADDRESS_ERROR_MESSAGE = document.getElementById('addressErrorMsg');
const CITY_INPUT = document.getElementById('city');
const CITY_ERROR_MESSAGE = document.getElementById('cityErrorMsg');
const EMAIL_INPUT = document.getElementById('email');
const EMAIL_ERROR_MESSAGE = document.getElementById('emailErrorMsg');
const ORDER_BUTTON = document.getElementById('order');
const FORM = document.getElementsByClassName('cart__order__form')[0];

function isValid (regex, value) {
    return regex.test(value);
}

// A function to indicate an error in an input depending on regex. It takes the name of the tested element, an html element to display the error, a string indicating which element
// is invalid inside the error message.
function nameErrors (element, messageBox, dataString) { 
    let isTrue = true;
    element.style.border = "red solid 3px";
    switch(isTrue) {
        case CONTAIN_INT_REGEX.test(element.value) : 
            messageBox.textContent = `${dataString} ne doit pas contenir de chiffres.`;
            break;
        case CONTAIN_CONSECUTIVE_SYMBOLS.test(element.value) :
            messageBox.textContent = `${dataString} ne doit pas contenir deux symboles \" \' \", \" - \" , ou deux espaces consécutifs.`;
            break;
        default : 
            messageBox.textContent = `${dataString} doit commencer par une lettre, et ne peut contenir que des lettres, les symboles \" - \" , \" ' \" , et des espaces.`;
    }
}



FIRST_NAME_INPUT.addEventListener('keyup', event => {
    if(event.target.value === ""){
        FIRST_NAME_ERROR_MESSAGE.textContent = "";
        resetInputStyle(event.target);  
    }
    else if(!NAMES_REGEX.test(event.target.value) || CONTAIN_INT_REGEX.test(event.target.value) || CONTAIN_CONSECUTIVE_SYMBOLS.test(event.target.value)){
        nameErrors(event.target, FIRST_NAME_ERROR_MESSAGE, "Le prénom");
    }
    else {
        event.target.style.border = "green 3px solid";
        FIRST_NAME_ERROR_MESSAGE.textContent = "";
    }
})

FIRST_NAME_INPUT.addEventListener('blur', event => {
    if(NAMES_REGEX.test(event.target.value) && !CONTAIN_CONSECUTIVE_SYMBOLS.test(event.target.value)){
        resetInputStyle(event.target);
    }
});

function onInputTextChange(event, onEmpty, onSucess, onError){
    if(event.target.value === "") {
        onEmpty(event);
    }
    else if(!NAMES_REGEX.test(event.target.value) || CONTAIN_INT_REGEX.test(event.target.value) || CONTAIN_CONSECUTIVE_SYMBOLS.test(event.target.value)){
       onError(event)
    }
    else {
       onSucess(event)
    }
}

function onLastNameSuccess(event){
    event.target.style.border = "green 3px solid";
    LAST_NAME_ERROR_MESSAGE.textContent = "";
}

function onLastNameEmpty(event){
    LAST_NAME_ERROR_MESSAGE.textContent = "";
    resetInputStyle(event.target);
}

function onLastNameSyntaxError(event){
    nameErrors(event.target, LAST_NAME_ERROR_MESSAGE, "Le nom");
}

LAST_NAME_INPUT.addEventListener('keyup', event => onInputTextChange(event, onLastNameEmpty,onLastNameSuccess, onLastNameSyntaxError));

LAST_NAME_INPUT.addEventListener('blur', event => {
    if(NAMES_REGEX.test(event.target.value) && !CONTAIN_CONSECUTIVE_SYMBOLS.test(event.target.value)){
        resetInputStyle(event.target);
    }
});

CITY_INPUT.addEventListener('keyup', event => {
    if(event.target.value === "") {
        CITY_ERROR_MESSAGE.textContent = "";
        resetInputStyle(event.target);  
    }
    else if(!NAMES_REGEX.test(event.target.value) || CONTAIN_INT_REGEX.test(event.target.value) || CONTAIN_CONSECUTIVE_SYMBOLS.test(event.target.value)){
        nameErrors(event.target, CITY_ERROR_MESSAGE, "La ville");
    }
    else {
        event.target.style.border = "green 3px solid";
        CITY_ERROR_MESSAGE.textContent = "";
    }
})

CITY_INPUT.addEventListener('blur', event => {
    if(NAMES_REGEX.test(event.target.value) && !CONTAIN_CONSECUTIVE_SYMBOLS.test(event.target.value)){
        resetInputStyle(event.target);
    }
});


ADDRESS_INPUT.addEventListener('keyup', event => {
    let target = event?.target;
    let value = target?.value;

    if (value === "") {
        ADDRESS_ERROR_MESSAGE.textContent = "";
        resetInputStyle(event.target);  
    }
    else if(!ADDRESS_FIRST_CHARACTER_REGEX.test(value)){
        ADDRESS_ERROR_MESSAGE.textContent = "L'adresse doit commencer par une lettre ou un chiffre.";
        target.style.border = "red solid 3px";    
    }
    else if(CONTAIN_FORBIDDEN_SYMBOLS.test(value)){
        ADDRESS_ERROR_MESSAGE.textContent = "L'adresse ne doit pas contenir d'autres symboles que \" \' \", \" - \" ou des espaces.";
        target.style.border = "red solid 3px";
    }
    else if(CONTAIN_CONSECUTIVE_SYMBOLS.test(value)){
        ADDRESS_ERROR_MESSAGE.textContent = "L'adresse ne doit pas contenir deux symboles \" \' \", \" - \" , ou deux espaces consécutifs.`";
        target.style.border = "red solid 3px";
    }
    else {
        ADDRESS_ERROR_MESSAGE.textContent = "";
        target.style.border = "green 3px solid";        
    }
})

ADDRESS_INPUT.addEventListener('blur', event => {
    if(ADDRESS_FIRST_CHARACTER_REGEX.test(event.target.value) && !CONTAIN_CONSECUTIVE_SYMBOLS.test(event.target.value) && !CONTAIN_FORBIDDEN_SYMBOLS.test(event.target.value)){
        resetInputStyle(event.target);
    }
});

EMAIL_INPUT.addEventListener('keyup', event => {
    if (event.target.value === "") {
        EMAIL_ERROR_MESSAGE.textContent = "";
        resetInputStyle(event.target);  
    }
    else if(!MAIL_FIRST_CHARACTER_REGEX.test(event.target.value)){
        EMAIL_ERROR_MESSAGE.textContent = "L'email doit commencer par une lettre (non acctentuée).";
        event.target.style.border = "red solid 3px";        
    }
    else if(MAIL_FORBIDDEN_SPECIAL_CHARACTERS.test(event.target.value)){
        EMAIL_ERROR_MESSAGE.textContent = "L'email ne peut contenir que les caractères spéciaux suivants : \"@\" , \"-\" , \"_\"  et \".\"  et ne peut pas contenir de lettres accentuées.";
        event.target.style.border = "red solid 3px";
    }
    else if(CONTAIN_CONSECUTIVE_SYMBOLS.test(event.target.value)){
        EMAIL_ERROR_MESSAGE.textContent = "L'email ne doit pas contenir deux caractères spéciaux consécutifs.";
        event.target.style.border = "red solid 3px";
    }
    else if(/(\w*@\w*){2,}/.test(event.target.value)){
        EMAIL_ERROR_MESSAGE.textContent = "L'email ne doit pas contenir plus d'un signe @.";
        event.target.style.border = "red solid 3px";
    }
    else {
        EMAIL_ERROR_MESSAGE.textContent = "";
        event.target.style.border = "green 3px solid";        
    }
})

// Post should not be possible until all elements of cart are valid 
function OrderForm (firstName, lastName, address, city, email) {
    this.firstName = firstName;
    this.lastName = lastName;
    this.address = address;
    this.city = city;
    this.email = email;
  }

FORM.addEventListener('submit', async event => {
    let namesRegexCondition = !NAMES_REGEX.test(FIRST_NAME_INPUT.value) || !NAMES_REGEX.test(LAST_NAME_INPUT.value) || !NAMES_REGEX.test(CITY_INPUT.value);
    let inputsConsecutiveSymbolsCondition = CONTAIN_CONSECUTIVE_SYMBOLS.test(FIRST_NAME_INPUT.value) || CONTAIN_CONSECUTIVE_SYMBOLS.test(LAST_NAME_INPUT.value) || CONTAIN_CONSECUTIVE_SYMBOLS.test(ADDRESS_INPUT.value) || CONTAIN_CONSECUTIVE_SYMBOLS.test(CITY_INPUT.value) || CONTAIN_CONSECUTIVE_SYMBOLS.test(EMAIL_INPUT.value);
    if(namesRegexCondition) {
        event.preventDefault();
    }
    else if (inputsConsecutiveSymbolsCondition) {
        event.preventDefault();
    }
    else if (!MAIL_REGEX.test(EMAIL_INPUT.value)){
        event.preventDefault(); 
    }
    else if(ADDRESS_REGEX.test(ADDRESS_INPUT.value)||!ADDRESS_FIRST_CHARACTER_REGEX.test(ADDRESS_INPUT.value)){
        event.preventDefault();
    }
    else{
        event.preventDefault();
        let form = new OrderForm(FIRST_NAME_INPUT.value, LAST_NAME_INPUT.value, ADDRESS_INPUT.value, CITY_INPUT.value, EMAIL_INPUT.value);
        const result = await submitForm(form);

        if(result && result.orderId){
            window.location.href = `/front/html/confirmation.html?orderId=${result.orderId}`;
            localStorage.clear();
        }else{
            console.error('Pas de retour du serveur')
        }
    }
})

async function submitForm (contact) {
    const products = CART.map((product)=> product.id);

    try{
        let response = await fetch("http://localhost:3000/api/products/order", {
            method: 'POST',
            headers: {
                'Accept': 'application/json', 
                'Content-Type' : 'application/json'
            },
            body: JSON.stringify({products, contact}),
        })
        if(response.ok){
            return response.json();
        }
        else{
            console.error('Retour du serveur : ', response.status)
        }
    }
    catch (err) {
        console.error(err.stack);
    }
}

