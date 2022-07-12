const apiUrl = "http://localhost:3000/api/products";
let itemCards = document.getElementById('items'); 

//fetch products
fetch(apiUrl)
  .then(response => response.json())
  .then(function(data) {

    let productArray = data;
    console.log(productArray);
    //use a map to create cards : 
    return productArray.map(function(productArray) {

      //check if template element is available for browser
      //if ("content" in document.createElement("template")) {

      // Locate DOM elements and clone them
      let template = document.querySelector("#item-card");
      let clone = document.importNode(template.content, true);
      let itemLink = clone.querySelector('a');
      let itemImage = clone.querySelector('img');
      let productName = clone.querySelector('.productName');
      let productDescription = clone.querySelector('.productDescription');

    // Inject the API elements inside the clones
      itemLink.setAttribute ("href",`./product.html?id=${productArray._id}`);
      itemImage.setAttribute ("src", `${productArray.imageUrl}`);
      itemImage.setAttribute ("alt", `${productArray.altTxt}`);
      productName.textContent = productArray.name;
      productDescription.textContent = productArray.description;

    //generate the cards
      itemCards.appendChild(clone);
      
    /*}*/
    })
  })

  .catch(err => console.error(err.stack));
