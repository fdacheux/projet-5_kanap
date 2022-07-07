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
// let cart = localStorage.getItem('cart')?CART:null;

/************************* CREATE CART ON DOM *************************/

// I) CREATE CARD FOR EACH PRODUCT: 

const CART_ITEMS_CARDS = document.getElementById('cart__items'); //select parent div where clone elements will be added
const TEMPLATE = document.querySelector("#cart__item-card"); //select template for clone purposes


// Function that selects a specific card using data-id and data-colour attributes
const selectProductCard = (id, color) => {
    let productCard = document.querySelector(`[data-id="${id}"][data-color="${color}"]`);
    return productCard;
}

// let idArray = []; // Array that will contain products' ids

// A) Create cards using cart info
const createProductsCards = () => {
    for (element of CART){
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
}

// B) Insert properties from API in each card

const calculatePrice = (price, quantity) => {
    return price*quantity
}


async function insertPropertiesFromApi () {

    for (element of CART){
    
        // Get elements from CART array
    
        let id = element.id; //get id of element
        let color = element.color;
        let quantities = element.quantity; // get quantity of element 
        let totalPrice;
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
        totalPrice = calculatePrice(result.price, quantities);
        priceParagraph.textContent = `${totalPrice} €` // Total price for the product 
            
        
        }
}

async function createCardsAndFillThem() {
    createProductsCards()
    await insertPropertiesFromApi()
}

CART? createCardsAndFillThem():document.getElementById('cart__items').textContent='Votre panier est vide';


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

// Activate the modifications of cart from cart page 

const anEvent = () => console.log('copythat');

//get elements that need to be listened : 
let arraytest = document.querySelectorAll(`[data-id]`);
for (element of arraytest){
    console.log(element.querySelector('.itemQuantity'))
    element.querySelector('.itemQuantity').addEventListener('input', function(e){
            newPrice(parseInt(element.dataset.id) , e.target.value);
            console.log(element.dataset.id);
    })
}

// document.querySelectorAll('.itemQuantity').forEach(element => {
//     console.log(document.querySelector(`[data-id="${element.id}"] .cart__item__content__description :nth-child(3)`));
// })

// document.querySelectorAll('.itemQuantity').forEach(element => {
//     element.addEventListener('input', function(e) {
//         newPrice(element.id, e.target.value);
//     })
// })



// const newPrice = (id, quantity) => {
//     fetchProduct(id)
//     .then(function(res) {
//         let newPrice = calculatePrice(res.price, quantity);
//         console.log(newPrice)
//         document.querySelector(`[data-id="${id}"] .cart__item__content__description :nth-child(3)`).textContent = newPrice;
//     })
// }

// for(element of CART){
//     document.querySelector(`[data-id="${element.id}"] input[name="itemQuantity"]`  ).setAttribute('value', 42);


// }