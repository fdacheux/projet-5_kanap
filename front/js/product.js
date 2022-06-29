// Get the product Id in url :

var parsedUrl = new URL(window.location.href);
console.log(parsedUrl.searchParams.get("id"));
const selectedProductId = parsedUrl.searchParams.get("id");
console.log(selectedProductId);


// 

const productApiUrl = `http://localhost:3000/api/products/${selectedProductId}`;
console.log(productApiUrl);



fetch(productApiUrl) 
    .then(response => response.json())
    .then(function(data) {
        console.log(data);

        // ÉTAPE 1 : Insert photo  
        const itemImageBox = document.querySelector('.item__img'); //get node
        /* console.log(itemImageBox); */

        // CREATE IMG TAGS
        const newImgTag = document.createElement('img'); 
        newImgTag.src = data.imageUrl;
        newImgTag.alt = data.altTxt;

        //ADD IMG TAGS
        itemImageBox.appendChild(newImgTag);


        // ÉTAPE 2 : Insert description elements
        document.getElementById('title').textContent = data.name;
        document.getElementById('price').textContent = data.price;
        document.getElementById('description').textContent = data.description;


        // 3) ÉTAPE 3 : Insert colors options
        let colorsArray = data.colors;   
        const colorSelectTag = document.getElementById('colors');
        /*Check values :
        // console.log(colorsArray);
        // console.log(colorSelectElement);*/
        
        //CREATE NEW OPTION TAGS
        for (const element of colorsArray) {
            const newOptionTag = document.createElement('option');
            // console.log(newOptionElement);
            newOptionTag.value = element;
            newOptionTag.text = element;
            colorSelectTag.appendChild(newOptionTag);
        }

    })

    .catch(err => console.error(err.stack));