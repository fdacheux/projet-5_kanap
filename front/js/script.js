const apiUrl = "http://localhost:3000/api/products";
// const apiUrl = "https://6133138b-3131-4aa0-8062-238d44139c77.mock.pstmn.io/api/products";
let itemCards = document.getElementById('items'); 


/* ************** Dynamically display all products on homepage ************** */

//Fetch all products
fetch(apiUrl)

  //when (and if) api is fetched get JSON 
  .then(response => {

    //if no exception (400, 500)...
    if(response.ok){
      
      //turn JSON into JS object and use it 
      response.json().then(function(data) { 
  
        let productArray = data;

        //Use a map to create cards : 
        return productArray.map(function(product) {
          
          const {_id, imageUrl, altTxt, name, description} = {...product}; // _id: _id = product._id 

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
    //if exception 400 or 500 handle it :
    else{
      console.error('Retour du serveur : ', response.status);
      document.querySelector('h1').textContent = "Oups ...";
      document.querySelector('h2').textContent = `Une erreur ${response.status} est survenue !`
    }
  })
  //if network error occurs, catch it
  .catch(err => {
    console.error(err.stack);
    document.querySelector('h1').textContent = "Oups ...";
    document.querySelector('h2').textContent = `Une erreur est survenue !`
  });
