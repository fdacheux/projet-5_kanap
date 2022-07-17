var parsedUrl = new URL(window.location.href);
const ORDER_ID = parsedUrl.searchParams.get("orderId"); //Get order id from URL;

document.getElementById('orderId').textContent = ORDER_ID;