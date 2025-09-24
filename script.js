// Sample product list (12 watches)
const products = [
  // DIGITAL
  { id: 1, name: "Casio Digital Watch", type: "Digital", price: 2999, image: "11.jpg" },
  { id: 2, name: "Fastrack Sports Digital", type: "Digital", price: 1999, image: "12.jpg" },
  { id: 3, name: "Timex LED Digital Watch", type: "Digital", price: 2499, image: "13.jpg" },
  { id: 4, name: "Sonata Trendy Digital", type: "Digital", price: 1499, image: "14.jpg" },
  // ANALOG
  { id: 5, name: "Rolex Classic Analog", type: "Analog", price: 1500, image: "15.jpg" },
  { id: 6, name: "Titan Classic Silver", type: "Analog", price: 4999, image: "16.jpg"},
  { id: 7, name: "Fossil Premium Analog", type: "Analog", price: 2999, image: "17.jpg"},
  { id: 8, name: "Daniel Wellington Minimalist", type: "Analog", price: 3999, image:"18.jpg" },
  ];

let cart = JSON.parse(localStorage.getItem('cart')) || [];

// STORE PAGE  //
function displayProducts(filter='all'){
  const list = document.getElementById('productList');
  if(!list) return; // if not on store page
  list.innerHTML = '';
  const filtered = filter === 'all' ? products : products.filter(p => p.type===filter);
  filtered.forEach(p => {
    list.innerHTML += `
      <div class="product-card">
        <img src="${p.image}" alt="${p.name}">
        <h3>${p.name}</h3>
        <p>${p.type} - ₹${p.price.toLocaleString('en-IN')}</p>
        <button onclick="addToCart(${p.id})">Add to Cart</button>
      </div>
    `;
  });
}

function filterProducts(type){ displayProducts(type); }
function searchProducts(){
  const query = document.getElementById('search').value.toLowerCase();
  const filtered = products.filter(p => p.name.toLowerCase().includes(query));
  const list = document.getElementById('productList');
  if(!list) return;
  list.innerHTML = '';
  filtered.forEach(p => {
    list.innerHTML += `
      <div class="product-card">
        <img src="${p.image}" alt="${p.name}">
        <h3>${p.name}</h3>
        <p>${p.type} - ₹${p.price.toLocaleString('en-IN')}</p>
        <button onclick="addToCart(${p.id})">Add to Cart</button>
      </div>
    `;
  });
}

function addToCart(id){
  const product = products.find(p=>p.id===id);
  const existing = cart.find(i=>i.id===id);
  if(existing) existing.quantity++;
  else cart.push({...product, quantity:1});
  saveCart(); updateCartCount();
}

function updateCartCount(){
  const count = cart.reduce((sum,i)=>sum+i.quantity,0);
  const el = document.getElementById('cartCount');
  if(el) el.textContent = count;
}

function viewCart(){
  const cartSection = document.getElementById('cartSection');
  if(cartSection) { cartSection.style.display='block'; renderCart(); }
}
function closeCart(){ const cartSection = document.getElementById('cartSection'); if(cartSection) cartSection.style.display='none'; }

function renderCart(){
  const cartItems = document.getElementById('cartItems');
  if(!cartItems) return;
  cartItems.innerHTML='';
  let total = 0;
  cart.forEach(item=>{
    total += item.price * item.quantity;
    cartItems.innerHTML += `
      <div class="cart-item">
        <strong>${item.name}</strong> - ₹${item.price.toLocaleString('en-IN')}
        <input type="number" min="1" value="${item.quantity}" onchange="updateQuantity(${item.id}, this.value)">
        <button onclick="removeFromCart(${item.id})">Remove</button>
      </div>
    `;
  });
  const totalEl = document.getElementById('totalPrice');
  if(totalEl) totalEl.textContent = total.toLocaleString('en-IN');
}

function updateQuantity(id, qty){
  const item = cart.find(i=>i.id===id);
  if(item) item.quantity=parseInt(qty);
  saveCart(); renderCart(); updateCartCount();
}

function removeFromCart(id){
  cart = cart.filter(i=>i.id!==id);
  saveCart(); renderCart(); updateCartCount();
}

function proceedToCheckout(){
  if(cart.length===0){ alert("Your cart is empty!"); return; }
  saveCart(); window.location.href="checkout.html";
}

function saveCart(){ localStorage.setItem('cart', JSON.stringify(cart)); }

// CHECKOUT PAGE //
document.addEventListener('DOMContentLoaded', ()=>{
  updateCartCount();
  displayProducts();

  // Render order summary if checkout page
  const orderSummary = document.getElementById('orderSummary');
  if(orderSummary){
    const checkoutCart = JSON.parse(localStorage.getItem('cart')) || [];
    let total=0;
    checkoutCart.forEach(item=>{
      total += item.price*item.quantity;
      orderSummary.innerHTML += `<p>${item.name} x ${item.quantity} - ₹${item.price.toLocaleString('en-IN')}</p>`;
    });
    const summaryTotal = document.getElementById('summaryTotal');
    if(summaryTotal) summaryTotal.textContent = total.toLocaleString('en-IN');

    // Handle form submission
    const checkoutForm = document.getElementById('checkoutForm');
    if(checkoutForm){
      checkoutForm.addEventListener('submit', function(e){
        e.preventDefault();
        const name = document.getElementById('name').value;
        const address = document.getElementById('address').value;
        const phone = document.getElementById('phone').value;
        const payment = document.getElementById('payment').value;
        if(!name || !address || !phone || !payment){ alert("Please fill all fields!"); return; }
        document.getElementById('orderMessage').textContent = `Thank you, ${name}! Your order has been placed successfully.`;
        localStorage.removeItem('cart');
        setTimeout(()=>{ window.location.href="index.html"; },5000);
      });
    }
  }
});
