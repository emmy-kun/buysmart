const form = document.getElementById("checkoutForm");

if (form) {
  form.addEventListener("submit", function(e) {
    e.preventDefault();

    const order = {
      id: "BS-" + Math.floor(Math.random() * 100000),
      name: name.value,
      email: email.value,
      address: address.value,
      cart: JSON.parse(localStorage.getItem("cart"))
    };

    localStorage.setItem("order", JSON.stringify(order));
    window.location.href = "invoice.html";
  });
}

const order = JSON.parse(localStorage.getItem("order"));
if (order && document.getElementById("orderId")) {
  document.getElementById("orderId").textContent = "Order ID: " + order.id;
  document.getElementById("customerInfo").textContent =
    `${order.name} | ${order.email}`;

  let total = 0;
  order.cart.forEach(item => {
    total += item.price;
    document.getElementById("invoiceItems").innerHTML +=
      `<p>${item.name} - ₦${item.price}</p>`;
  });

  document.getElementById("invoiceTotal").textContent = total;
}
