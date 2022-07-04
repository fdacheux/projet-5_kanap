const apiUrl = "http://localhost:3000/api/products";

// Get cart from localStorage :
let cart = JSON.parse(localStorage.getItem('cart'));


// Create cards for products : 
const cartItemCard = document.getElementById('cart__items');
const template = document.querySelector("#cart__item-card");
const cartProductImage = document.querySelector('img');

const createApiUrlForElement = (id) => {
    let apiForElement = `${apiUrl}/${id}`;
    return apiForElement;
}

const selectProductCard = (id) => {
    let productCard = document.querySelector(`[data-id="${id}"]`);
    return productCard;
}


async function insertInfo (url) {
    try {
        let response = await fetch(url);
        let product = await response.json();
        return product
    }
    catch(err){
        console.error(err.stack);
    }
    
}

// Create cards

for (element of cart){
    let clone = template.content.cloneNode(true);
    let cartItem = clone.querySelector('article');
    let quantityInput = clone.querySelector('input');
    // let totalProductParagraph = document.querySelector('.cart__item__content__description :nth-child(2)');
    
    cartItem.dataset.id = `${element.id}`;
    cartItem.dataset.color = `${element.color}`;
    quantityInput.setAttribute('value', `${element.quantity}`);
    // totalProductParagraph.textContent = `${price * quantities}`;
    
    cartItemCard.appendChild(clone);
}

// Fetch url for each product

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

for (element of cart){
    let id = element.id; //get id
    let selectedCard = selectProductCard(id); //get card using data-id attribute
    let url = createApiUrlForElement(id); // create the url to fecth right data in API
    let product = insertElementProperties(url); // fetch api, get product properties

    // Get the elements that need to be filled with API data

    let cartProductImage = selectedCard.querySelector('img'); //get image


    // Set attributes and/or text for each property of the selected product
    product.then((product) => cartProductImage.setAttribute('src', `${product.imageUrl}`));
        
}

// Put right elements in it 

let cartItemCardsObject = document.querySelectorAll('article');

