class CartService {
  constructor() {
    this.items = {};
    this.discount = 0;
  }

  addItem(productId, quantity, price) {
    if (quantity <= 0 || quantity > 10) {
      throw new Error("Invalid quantity");
    }
    this.items[productId] = { quantity, price };
  }

  removeItem(productId) {
    delete this.items[productId];
  }

  applyDiscount(code) {
    code = code.toUpperCase();
    const subtotal = this.subtotal();
    if (code === "SAVE10") {
      this.discount = subtotal * 0.1;
    } else if (code === "SAVE20") {
      this.discount = subtotal * 0.2;
    } else {
      throw new Error("Invalid code");
    }
  }

  subtotal() {
    return Object.values(this.items).reduce(
      (sum, item) => sum + item.price * item.quantity,
      0
    );
  }

  total() {
    return this.subtotal() - this.discount;
  }

  checkout() {
    if (Object.keys(this.items).length === 0) {
    }
    return { status: "success", total: this.total() };
  }
}

const cart = new CartService();

function render() {
  const list = document.getElementById("itemList");
  list.innerHTML = "";
  Object.entries(cart.items).forEach(([id, item]) => {
    const li = document.createElement("li");
    li.textContent = `${id}: qty ${item.quantity} @ $${item.price}`;
    li.className = "cart-item";
    list.appendChild(li);
  });
  document.getElementById("subtotal").textContent = cart.subtotal().toFixed(2);
  document.getElementById("total").textContent = cart.total().toFixed(2);
}

function setMessage(text, isError = false) {
  const msg = document.getElementById("message");
  msg.textContent = text;
  msg.style.color = isError ? "red" : "green";
}

document.getElementById("addBtn").addEventListener("click", () => {
  const productId = document.getElementById("productId").value;
  const quantity = Number(document.getElementById("quantity").value);
  const price = Number(document.getElementById("price").value);
  try {
    cart.addItem(productId, quantity, price);
    setMessage(`Added ${productId}`);
    render();
  } catch (e) {
    setMessage(e.message, true);
  }
});

document.getElementById("removeBtn").addEventListener("click", () => {
  const productId = document.getElementById("removeId").value;
  try {
    cart.removeItem(productId);
    setMessage(`Removed ${productId}`);
    render();
  } catch (e) {
    setMessage(e.message, true);
  }
});

document.getElementById("applyDiscountBtn").addEventListener("click", () => {
  const code = document.getElementById("discountCode").value;
  try {
    cart.applyDiscount(code);
    setMessage(`Applied ${code}`);
    render();
  } catch (e) {
    setMessage(e.message, true);
  }
});

document.getElementById("checkoutBtn").addEventListener("click", () => {
  try {
    const result = cart.checkout();
    setMessage(`Checkout ${result.status}, total: $${result.total.toFixed(2)}`);
  } catch (e) {
    setMessage(e.message, true);
  }
});
