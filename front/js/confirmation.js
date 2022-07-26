var parsedUrl = new URL(window.location.href); // Get an object containing url info
const ORDER_ID = parsedUrl.searchParams.get("orderId"); // Use get method to find searchParams property and return the order id value from URL;

document.getElementById('orderId').textContent = ORDER_ID; // Displays order id