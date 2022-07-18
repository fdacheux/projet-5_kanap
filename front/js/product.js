/* ----------------------- Fetch API info ----------------------- */ 

// I) GET THE PRODUCT ID TO CREATE API URL :

var parsedUrl = new URL(window.location.href);
const SELECTED_PRODUCT_ID = parsedUrl.searchParams.get("id"); //Get product ID
const PRODUCT_API_URL = `http://localhost:3000/api/products/${SELECTED_PRODUCT_ID}`; //Create URL to access product's properties on API

const COLOR_SELECT_TAG = document.getElementById('colors');

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

// II) FETCH PRODUCT IN API USING URL + ID

fetch(PRODUCT_API_URL) 

    //Get product object
    .then(response => {
        if(response.ok){
            response.json().then(function(data) {
                const {imageUrl, altTxt, name, price, description, colors} = {...data}
                // ÉTAPE 1 : Insert photo of product
                const itemImageBox = document.querySelector('.item__img img'); //get node
        
                // SET ATTRIBUTES FOR IMG TAGS
                itemImageBox?.setAttribute('src', imageUrl);
                itemImageBox?.setAttribute('alt', altTxt);
        
        
                // ÉTAPE 2 : Insert description elements
                document.getElementById('title').textContent = name;
                document.getElementById('price').textContent = price;
                document.getElementById('description').textContent = description;
        
        
                // 3) ÉTAPE 3 : Insert colors options
                let colorsArray = colors;   
                
                //Create new option tags
                for (const element of colorsArray) {
                    const newOptionTag = document.createElement('option'); // create an option tag for each element in colors property
                    newOptionTag.value = element; // Take color name and add it as value attribute of the option
                    newOptionTag.text = translateColour(element); // Same but for text TRADUCTION
                    COLOR_SELECT_TAG.appendChild(newOptionTag); // Add element inside parent element
                }
            
            })
        }
        else {
            console.error('Retour du serveur : ', response.status)
        }
    })
    //Catch error to keep app running, get error specifications on console
    .catch(err => console.error(err.stack));



/* ----------------------- Cart ----------------------- */ 
    

// I) CREATE SOME ELEMENTS FOR FURTHER USE

// Create the cart array 
const CART = localStorage && localStorage.getItem('cart') ? JSON.parse(localStorage.getItem('cart')) : [];


// Get button element and quantity input element for later use
const addToCartButton = document.getElementById('addToCart');
const quantityInput = document.getElementById('quantity');

let quantities;
let selectedColor = '';

//  Check validity of quantity on keyup event and change style of input depending on validity

// Function that creates bold borders to highlight quantity validity or invalidity
const createBoldBorderForElement = (array, colorString) => {
    for (element of array){
        element.style.borderColor = colorString;
        element.style.borderWidth = '3px';
    }
}

let regex = /^[0-9]*$/;

function checkQuantityValidity () {
    quantities = quantityInput.value;
    if (quantities <= 100 && quantities>0 && quantities !== null && quantities !== NaN && regex.test(quantities) ) {
        createBoldBorderForElement([quantityInput], "green");
        quantityInput.style.color = "green";
        quantityInput.style.fontWeight = "unset";
    }
    else if (quantities <= 100 && quantities>0 && quantities !== null && quantities !== NaN && !regex.test(quantities)) {
        quantityInput.value = Math.floor(quantityInput.value);
        createBoldBorderForElement([quantityInput], "green");
        quantityInput.style.color = "green";
        quantityInput.style.fontWeight = "unset"
    }
    else {
        createBoldBorderForElement([quantityInput], "red");
        quantityInput.style.color = "red";
        quantityInput.style.fontWeight = "bold";
    }
}

quantityInput.addEventListener('keyup', function(){
    checkQuantityValidity();
});

quantityInput.addEventListener('blur', function(){
    if(quantities <= 100 && quantities>0 && quantities !== null && quantities !== NaN && regex.test(quantities)){
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
    CART.push(product);
}

const differenceBetweenQuantityAndHundred = (number) => {
    return 100 - number;
} 

// Action to take depending on presence of product in cart (either add a new product or increase quantity property of one of them)

const addProductInCart = () => {
    for (let i=0; i<CART.length; i++){
        Number.parseInt(CART[i].quantity);
        if(CART[i].id === SELECTED_PRODUCT_ID && CART[i].color === selectedColor) {
            CART[i].quantity += quantities;
            break
        } 
        else if (i===CART.length-1){
            addNewProduct();
            break
        }   
    }
}

const isTotalQuantityIsUnderHundred = () => {
    let success = true;
    for (let i=0; i<CART.length; i++){
        Number.parseInt(CART[i].quantity);
        if (CART[i].id === SELECTED_PRODUCT_ID && CART[i].color === selectedColor && (CART[i].quantity+quantities>100)){
            alert(`Vous ne pouvez pas mettre plus de 100 unités d\'un même produit dans le panier. Vous pouvez ajouter encore ${differenceBetweenQuantityAndHundred(Number.parseInt(CART[i].quantity))} unités.`);
            quantityInput.value = differenceBetweenQuantityAndHundred(Number.parseInt(CART[i].quantity)); 
            createBoldBorderForElement([quantityInput], "orange");
            success = false;
        }
    }
    return success;
}

// If quantity and color is valid on click, store the product in local storage

const storeCartLocally = () =>{
    // Get values to add :
    selectedColor = COLOR_SELECT_TAG.options[COLOR_SELECT_TAG.selectedIndex].value;
    quantities = parseInt(quantityInput.value);  

    // Check if they are valid before send, if not warn
    if ((quantities>100 || quantities<=0 || !quantities) && selectedColor.length<1) {
        COLOR_SELECT_TAG.focus();
        createBoldBorderForElement([quantityInput, COLOR_SELECT_TAG], "red");
    }
    else if (quantities>100 || quantities<=0 || !quantities) {
        quantityInput.focus(); 
        createBoldBorderForElement([quantityInput], "red");
        quantityInput.value.textContent = "0";
    }
    else if (selectedColor.length<1) {
        COLOR_SELECT_TAG.focus();
        createBoldBorderForElement([COLOR_SELECT_TAG], "red");
    }
    else if (isTotalQuantityIsUnderHundred()){
    // Check if there is an existing cart and act accordingly
        localStorage.getItem('cart') ? addProductInCart() : addNewProduct();
        alert("Le produit a été ajouté");

    // Store the result
        return localStorage.setItem('cart', JSON.stringify(CART));
    }
}

addToCartButton.addEventListener('click', storeCartLocally);
