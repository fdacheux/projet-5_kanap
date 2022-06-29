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
        // Insert photo
        const itemImageBox = document.querySelector('.item__img');
        console.log(itemImageBox);
        const img = document.createElement('img');
        img.src = data.imageUrl;
        img.alt = data.altTxt;
        itemImageBox.appendChild(img);

        document.getElementById('title').textContent = data.name;
        document.getElementById('price').textContent = data.price;
        document.getElementById('description').textContent = data.description;

    })

    .catch(err => console.error(err.stack));