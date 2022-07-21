const apiUrl = "http://localhost:3000/api/products";
let itemCards = document.getElementById('items'); 

//Fetch all products
fetch(apiUrl)

  .then(response => {
  
    if(response.ok){
      
      response.json().then(function(data) {
  
        let productArray = data;

        //Use a map to create cards : 
        return productArray.map(function(product) {
          
          const {_id, imageUrl, altTxt, name, description} = {...product};

          // Locate DOM elements and clone them
          let template = document.querySelector("#item-card");
          let clone = document.importNode(template.content, true);
          let itemLink = clone.querySelector('a');
          let itemImage = clone.querySelector('img');
          let productName = clone.querySelector('.productName');
          let productDescription = clone.querySelector('.productDescription');
    
        // Inject the API elements inside the clones
          itemLink?.setAttribute ("href",`./product.html?id=${_id}`);
          itemImage?.setAttribute ("src", `${imageUrl}`);
          itemImage?.setAttribute ("alt", `${altTxt}`);
          productName.textContent = name;
          productDescription.textContent = description;
    
        // Generate the cards
          itemCards.appendChild(clone);
        })
      })
    }
    else{
      console.error('Retour du serveur : ', response.status);
      document.querySelector('h1').textContent = "Oups ...";
      document.querySelector('h2').textContent = `Une erreur ${response.status} est survenue !`
    }
  })
  .catch(err => {
    console.error(err.stack);
    document.querySelector('h1').textContent = "Oups ...";
    document.querySelector('h2').textContent = `Une erreur est survenue !`
  });
