/************************* FETCH API *************************/


//I) FETCH ALL  

const API_URL = "http://localhost:3000/api/products"; //global

async function fetchAllProducts (API_URL){
    try {
        let response = await fetch(API_URL);
        let productsArray = await response.json();
        return productsArray;
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
        let productObject = await response.json();
        return productObject;
    }
    catch (err) {
        console.error(err.stack);
    }
}

/************************* GET CART CONTENT FROM LOCAL STORAGE *************************/

const CART = JSON.parse(localStorage.getItem('cart'));
// var cart = localStorage.getItem('cart')?CART:null;

/************************* CREATE CART ON DOM *************************/

// I) CREATE CARD FOR EACH PRODUCT: 

const CART_ITEMS_CARDS = document.getElementById('cart__items'); //select parent div where clone elements will be added
const TEMPLATE = document.querySelector("#cart__item-card"); //select template for clone purposes


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
            colorName.textContent = element.color;
            
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


//get elements that need to be listened : 


/************************* ADD ELEMENT IN CART FROM CART PAGE *************************/

// Elements to listen
let idArray = [];
for (element of CART){
    idArray.push(element.id);
}

const ALL_PRODUCTS_ARTICLES = document.querySelectorAll(`[data-id]`);
console.log(ALL_PRODUCTS_ARTICLES);

const updateQuantityInCart = (elementToUpdate, quantity) => {
    elementToUpdate.quantity = parseInt(quantity);
    return localStorage.setItem('cart', JSON.stringify(CART))
}

let regex = /^[0-9]*$/;

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
    element.style.borderColor = "unset";
    element.style.borderWidth = "unset";
    element.style.color = "unset";
    element.style.fontWeight = "unset";    
}

document.querySelectorAll('[data-id]').forEach(element => {
    let id = element.dataset.id;
    let productColor = element.dataset.color;
    let newQuantity; 
    let paragraph = element.querySelector('p:nth-of-type(2)');
    const elementToUpdateInCart = CART.find(element =>  element.id === id && element.color === productColor);
    element.addEventListener('input', event => {
        let inputNumber = event.target.value;
        if(!inputNumber || inputNumber>100 || inputNumber<0) {
            inputIsNotValidStyle(event.target)    
        }
        else {
            event.target.value = Math.floor(event.target.value);
            inputIsValidStyle(event.target);
            newQuantity = event.target.value;
            event.target.setAttribute('value', `${newQuantity}`); //change value of input for quantity
            updateQuantityInCart(elementToUpdateInCart, newQuantity);
            console.log(newQuantity);
                changePrice(id, newQuantity, paragraph); // change price
                updateTotalQuantityAndPrice();
            }
        })
    // element.addEventListener('blur', event => {
    //     event.target.value && event.target.value<100 && event.target.value>1 ? resetInputStyle(event.target) : event.target.focus();
    // })
});

async function changePrice (id, quantity, paragraph) { //change price depending on quantity 
    let newPrice = await getPricePerQuantity (id, quantity);
    paragraph.textContent = `${newPrice} €`;
    return newPrice;
}

async function updateTotalQuantityAndPrice () {
    total = 0;
    totalQuantity = 0;
    await getTotalQuantity();
    await getTotalPrice();
}

