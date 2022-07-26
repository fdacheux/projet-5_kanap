/* ----------------------- Fetch API info ----------------------- */ 

// I) GET THE PRODUCT ID TO CREATE API URL :

var parsedUrl = new URL(window.location.href);
const SELECTED_PRODUCT_ID = parsedUrl.searchParams.get("id"); //Get product ID
const PRODUCT_API_URL = `http://localhost:3000/api/products/${SELECTED_PRODUCT_ID}`; //Create URL to access product's properties on API

const COLOR_SELECT_TAG = document.getElementById('colors');

// Colors translation 

function translateColour (colour) { //take a string (the colour from API) and return its translation it in French
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

// II) FETCH PRODUCT IN API USING URL + ID AND INSERT ELEMENTS IN PRODUCT PAGE

fetch(PRODUCT_API_URL) 

    //Get product object
    .then(response => {
        //if no 400, 500 exceptions
        if(response.ok){
            response.json()
            .then(function(data) {
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
            console.error('Retour du serveur : ', response.status);
            document.querySelector('article').style.display = "none";
            document.querySelector('section').textContent = `Oups... une erreur ${response.status} est survenue.`;
        }
    })
    //Catch error to keep app running, get error specifications on console
    .catch(err => {
        console.error(err.stack);
        document.querySelector('article').style.display = "none";
        document.querySelector('section').textContent = `Oups... une erreur est survenue.`;
    });



/* ----------------------- Cart ----------------------- */ 
    

// I) CREATE SOME ELEMENTS FOR FURTHER USE

// Create the cart array 
const CART = localStorage && localStorage.getItem('cart') ? JSON.parse(localStorage.getItem('cart')) : [];


// Get button element and quantity input element for later use
const addToCartButton = document.getElementById('addToCart');
const quantityInput = document.getElementById('quantity');

let quantities;
let selectedColor = '';

// II) CHECK VALIDITY OF QUANTITY INPUT ON KEYUP AND CLICK EVENTS :

// Function use :  creates bold borders to highlight quantity validity or invalidity
// Parameters : an array of the dom elements that will be modified, a string with the name of the color used for the border
const createBoldBorderForElement = (array, colorString) => {
    for (element of array){
        let style = element?.style;
        style.borderColor = colorString;
        style.borderWidth = '3px';
    }
}

// Function use : removes all styles injected with js in an element
const resetInputStyle = (element) => {
    element.removeAttribute('style');   
}

//Function use : adds style properties to a dom element to indicate to user that its input is valid
function onValidQuantity () {
    let style = quantityInput?.style;
    createBoldBorderForElement([quantityInput], "green");
    style.color = "green";
    style.fontWeight = "unset"
}

//Function use : adds style properties to a dom element to indicate to user that its input is invalid
function onInvalidQuantity () {
    createBoldBorderForElement([quantityInput], "red");
    let style = quantityInput?.style;
    style.color = "red";
    style.fontWeight = "bold";
}

const IS_NUMBER = /^[0-9]*$/;

//Function use : check if quantity input is valid act accordingly 
function isValidQuantity () {
    quantities = Number.parseInt(quantityInput?.value);
    if(quantities && quantities <= 100 && quantities>0 && IS_NUMBER.test(quantities)){
        quantityInput.value = Math.floor(quantities); //prevent the use of floats for numbers above 1
        onValidQuantity();
    }
    else {
        onInvalidQuantity();
    }
}

// Function use : listens to quantity input modifications on keyup indicates validity of what is beiing typed
quantityInput.addEventListener('keyup', function(){
    isValidQuantity();
});

// Function use : listens to quantity input on blur, if quantity is valid removes style attribute
quantityInput.addEventListener('blur', function(){
    if(quantities <= 100 && quantities>0 && quantities !== null && quantities !== NaN && IS_NUMBER.test(quantities)){
        resetInputStyle(quantityInput);
    }
})


// III) STORE CART : CHECK INPUTS, IF VALID ADD IN LOCAL STORAGE

// Function use : creates new product object in array: 
const addNewProduct = () => {
    let product = {
        id : SELECTED_PRODUCT_ID,
        quantity : quantities,
        color : selectedColor
    };  
    CART.push(product);
}

// Function use : takes a number and return the difference between it and a hundred
const differenceBetweenQuantityAndHundred = (number) => {
    return 100 - number;
} 

// Function use : action to take depending on presence of product in cart => either add a new product or increase quantity property of one of them
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

// Function use : check if a product will not have more of a hundred units when increasing its quantity. If below 100 : returns true, else triggers an alert and return false
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

// Function use : warns user of color selection invalidity through use of a red warning style and by triggering an alert
function onColorAndInputInvalid () {
    alert('Merci de bien vouloir indiquer une quantité et une couleur valide pour ce produit.')
    COLOR_SELECT_TAG.focus();
    createBoldBorderForElement([quantityInput, COLOR_SELECT_TAG], "red");
}

// Function use : modifies style on QuantityInput element and triggers alert and manipulates the quantity value depending on which condition it fulfills.
function onQuantityInputInvalid() {

    resetInputStyle(quantityInput);
    createBoldBorderForElement([quantityInput], "orange");
    
    if(quantityInput.value<0){
        alert("Vous ne pouvez pas entrer une quantité négative. Merci de rentrer une quantité comprise entre 1 et 100.")
        quantityInput.value = quantityInput.value*-1;
    }
    else if(quantityInput.value>100){
        quantityInput.value = 100;
        alert('Vous avez entré une quantité supérieur à 100. Merci de rentrer une quantité comprise entre 1 et 100.');
    }
    else{
        alert(`La valeur que vous avez entré n'est pas une quantité valide. Merci de rentrer un chiffre compris entre 1 et 100.`)
        quantityInput.value = "1";
    }
}

// Function use : adds the product to local storage if quantity and color inputs are valid, else indicates what went wrong and does not add the product to cart
const storeCartLocally = () =>{

    // Get values to add :
    selectedColor = COLOR_SELECT_TAG.options[COLOR_SELECT_TAG.selectedIndex].value;
    quantities = parseInt(quantityInput.value);  
    
    // Check if they are valid before send, if not warn
    if ((quantities>100 || quantities<=0 || !quantities) && selectedColor.length<1) {
        onColorAndInputInvalid ()
    }
    else if (quantities>100 || quantities<=0 || !quantities) {
        quantityInput.focus(); 
        onQuantityInputInvalid(quantities);
    }
    else if (selectedColor.length<1) {
        alert("Merci de choisir une couleur pour cet article.");
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


//Function use : listens to select element on click, remove style attribute
COLOR_SELECT_TAG.addEventListener('click', function() {
    resetInputStyle(COLOR_SELECT_TAG);
})