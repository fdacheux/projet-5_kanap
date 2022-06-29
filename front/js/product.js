var parsedUrl = new URL(window.location.href);
console.log(parsedUrl.searchParams.get("id"));
const selectedProductId = parsedUrl.searchParams.get("id");
console.log(selectedProductId);