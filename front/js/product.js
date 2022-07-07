// Debug functions

//Function to check multiple values of variables
const testMultipleValues = (array) => {
    for (e of array) {
        console.log(e)
    }   
}
// Function to test type of multiple variables 
const testTypeOfMultipleElements = (array) => {
    for (e of array) {
        console.log(typeof(e));
    }   
}




/* ----------------------- Fetch API info ----------------------- */ 

// I) GET THE PRODUCT ID TO CREATE API URL :

var parsedUrl = new URL(window.location.href);
const SELECTED_PRODUCT_ID = parsedUrl.searchParams.get("id"); //Get product ID
const PRODUCT_API_URL = `http://localhost:3000/api/products/${SELECTED_PRODUCT_ID}`; //Create URL to access product's properties on API

//testMultipleValues([SELECTED_PRODUCT_ID, PRODUCT_API_URL])


const COLOR_SELECT_TAG = document.getElementById('colors');

// II) FETCH PRODUCT IN API USING URL + ID

fetch(PRODUCT_API_URL) 

    //Get product object
    .then(response => response.json())

    // Use data when product object has been recovered
    .then(function(data) {
        console.log(data);

        // ÉTAPE 1 : Insert photo of product
        const itemImageBox = document.querySelector('.item__img img'); //get node

        // SET ATTRIBUTES FOR IMG TAGS
        itemImageBox.setAttribute('src', data.imageUrl);
        itemImageBox.setAttribute('alt', data.altTxt);


        // ÉTAPE 2 : Insert description elements
        document.getElementById('title').textContent = data.name;
        document.getElementById('price').textContent = data.price;
        document.getElementById('description').textContent = data.description;


        // 3) ÉTAPE 3 : Insert colors options
        let colorsArray = data.colors;   
        
        //Create new option tags
        for (const element of colorsArray) {
            const newOptionTag = document.createElement('option'); // create an option tag for each element in colors property
            newOptionTag.value = element; // Take color name and add it as value attribute of the option
            newOptionTag.text = element; // Same but for text
            COLOR_SELECT_TAG.appendChild(newOptionTag); // Add element inside parent element
        }

    })
    //Catch error to keep app running, get error specifications on console
    .catch(err => console.error(err.stack));



/* ----------------------- Cart ----------------------- */ 
    

// I) CREATE SOME ELEMENTS FOR FURTHER USE

// Create the cart array 
var cart = [];

// Get button element and quantity input element for later use
const addToCartButton = document.getElementById('addToCart');
const quantityInput = document.getElementById('quantity');

let quantities;
let selectedColor = '';

console.log(addToCartButton);


//  Check validity of quantity on keyup event and change style of input depending on validity

// Function that creates bold borders to highlight quantity validity or invalidity
const createBoldBorderForElement = (array, colorString) => {
    for (element of array){
        element.style.borderColor = colorString;
        element.style.borderWidth = '3px';
    }
}

const checkQuantityValidity = () => {
    quantities = quantityInput.value;
    if (quantities <= 100 && quantities>0 && quantities !== null && quantities !== NaN) {
        addToCartButton.disabled = false;
        createBoldBorderForElement([quantityInput], "green");
        quantityInput.style.color = "green";
        quantityInput.style.fontWeight = "unset";
    }
    else {
        createBoldBorderForElement([quantityInput], "red");
        quantityInput.style.color = "red";
        quantityInput.style.fontWeight = "bold";
        // addToCartButton.disabled = true;
    }
}

quantityInput.addEventListener('blur', function(){
    if(quantities <= 100 && quantities>0 && quantities !== null && quantities !== NaN){
        quantityInput.style = null;
    }
})

COLOR_SELECT_TAG.addEventListener('click', function() {
    COLOR_SELECT_TAG.style = null;
})
    
    

// Create new product object in array: 
const addNewProduct = () => {
    let product = {
        id : SELECTED_PRODUCT_ID,
        quantity : quantities,
        color : selectedColor
    };  
    cart.push(product);
}

const differenceBetweenQuantityAndHundred = (number) => {
    return 100 - number;
} 

// Action to take depending on presence of product in cart (either add a new product or increase quantity property of one of them)

const addProductInCart = () => {
    cart = JSON.parse(localStorage.getItem('cart'));
    // console.log(`Cart is  : ${cart}`);
    // console.log(selectedColor);
    for (let i=0; i<cart.length; i++){
        // console.log(`Cart element is ${i} : id : ${cart[i].id}; color : ${cart[i].color}; quantity : ${cart[i].quantity}`);
        Number.parseInt(cart[i].quantity);
        if (cart[i].id === SELECTED_PRODUCT_ID && cart[i].color === selectedColor && (cart[i].quantity+quantities>100)){
            alert(`Vous ne pouvez pas mettre plus de 100 unités d\'un même produit dans le panier. Vous pouvez ajouter encore ${differenceBetweenQuantityAndHundred(Number.parseInt(cart[i].quantity))} unités.`);
            quantityInput.value = differenceBetweenQuantityAndHundred(Number.parseInt(cart[i].quantity)); 
            createBoldBorderForElement([quantityInput], "orange");
        }
        else if(cart[i].id === SELECTED_PRODUCT_ID && cart[i].color === selectedColor) {
            cart[i].quantity += quantities;
            break
        } 
        else if (i===cart.length-1){
            addNewProduct();
            break
        }   
    }
}


// If quantity and color is a valid on click, store the product in local storage

const storeCartLocally = () =>{
    // Get values to add :
    selectedColor = COLOR_SELECT_TAG.options[COLOR_SELECT_TAG.selectedIndex].value;
    quantities = parseInt(quantityInput.value);  

    // Check if they are valid before send, if not warn
    if ((quantities>100 || quantities<=0 || !quantities) && selectedColor.length<1) {
        COLOR_SELECT_TAG.focus();
        createBoldBorderForElement([quantityInput, COLOR_SELECT_TAG], "red");
        console.log('1');
    }
    else if (quantities>100 || quantities<=0 || !quantities) {
        console.log('2');
        quantityInput.focus(); 
        createBoldBorderForElement([quantityInput], "red");
        quantityInput.value.textContent = "0";
    }
    else if (selectedColor.length<1) {
        COLOR_SELECT_TAG.focus();
        createBoldBorderForElement([COLOR_SELECT_TAG], "red");
        console.log('3');
    }
    else {
        console.log('4');
        console.log(quantities);
    // Check if there is an existing cart and act accordingly
        localStorage.getItem('cart') ? addProductInCart() : addNewProduct();
        testMultipleValues([cart, selectedColor, SELECTED_PRODUCT_ID, quantities]);
        testTypeOfMultipleElements([cart, quantities]);

    // Store the result
        return localStorage.setItem('cart', JSON.stringify(cart));
    }
}


addToCartButton.addEventListener('click', storeCartLocally);



function testFinalResult () {
    let testResult = [];
    testResult = JSON.parse(localStorage.getItem('cart'));
    console.log(testResult);
    
}

addToCartButton.addEventListener('click', testFinalResult);