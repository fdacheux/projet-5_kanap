const API_URL = "http://localhost:3000/api/products";

// Get cart from localStorage :
const CART = JSON.parse(localStorage.getItem('cart'));


// Create cards for products : 
const CART_ITEMS_CARDS = document.getElementById('cart__items');
const TEMPLATE = document.querySelector("#cart__item-card");
// const cartProductImage = document.querySelector('img');

// Function that creates API URL pointing to one product
const createApiUrlForElement = (id) => {
    let apiForElement = `${API_URL}/${id}`;
    return apiForElement;
}

// Function that selects a specific card using data-id and data-colour attributes
const selectProductCard = (id, color) => {
    let productCard = document.querySelector(`[data-id="${id}"][data-color="${color}"]`);
    return productCard;
}


// Create cards

for (element of CART){
    let clone = TEMPLATE.content.cloneNode(true);
    let cartItem = clone.querySelector('article');
    let quantityInput = clone.querySelector('input');
    // let totalProductParagraph = document.querySelector('.cart__item__content__description :nth-child(2)');
    
    cartItem.dataset.id = `${element.id}`;
    cartItem.dataset.color = `${element.color}`;
    quantityInput.setAttribute('value', `${element.quantity}`);
    // totalProductParagraph.textContent = `${price * quantities}`;
    
    CART_ITEMS_CARDS.appendChild(clone);
}

// Fetch url for each product (!!! send promise => need to be solved)

async function insertElementProperties (url){
    try {
        let response = await fetch(url);
        let productObject = await response.json();
        return productObject;
    }
    catch (err) {
        console.error(err.stack);
    }
}

// Insert properties in each card
const calculatePrice = (price, quantity) => {
    return price*quantity
}


const addAllTotals = (total, x) => {
    total += x;
    return total
}

var total = 0; 

for (element of CART){

    // Get elements from CART array

    let id = element.id; //get id of element
    let color = element.color; // get colour of element
    let quantities = element.quantity; // get quantity of element 
    let totalPrice;
    let total = 0;
    let selectedCard = selectProductCard(id, color); //get card using data-id end data-color attributes
    let url = createApiUrlForElement(id); // create the url to fecth the right data in API
    

    // Get the elements that need to be filled with API data

    let cartProductImage = selectedCard.querySelector('img'); //get image
    let itemContentDescription = selectedCard.querySelector('.cart__item__content__description');// Get parent element for description
    let productName = itemContentDescription.querySelector('h2'); //Name
    let productColor = itemContentDescription.querySelector(':nth-child(2)');//colour 
    let priceParagraph = itemContentDescription.querySelector(':nth-child(3)');//price (= price*quantity)
    // let totalParagraph = document.getElementById('totalPrice');
    
    // Set attributes and/or text for each property of the selected product

    productColor.textContent = element.color; //Colour
    insertElementProperties(url) // fetch api, get product properties
        .then(function(res) { // set attributes of elements
            cartProductImage.setAttribute('src', `${res.imageUrl}`); //Image URL
            productName.textContent = res.name; // Name of product
            totalPrice = calculatePrice(res.price, quantities);
            console.log(totalPrice);
            priceParagraph.textContent = `${totalPrice} €` // Total price for the product 
        });
    
}

// Calculate total price and quantity :

    
document.getElementById('totalPrice').textContent = `${total}`;

let quantitiesArray = [];

for (element of CART){
    quantitiesArray.push(element.quantity);
}

const totalQuantity = quantitiesArray.reduce((previousValue, currentValue) => previousValue + currentValue, 0);
document.getElementById('totalQuantity').textContent = totalQuantity;
console.log(totalQuantity); 