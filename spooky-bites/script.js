// Step 7: Variables and meal prices
const restaurantName = "Spooky Bites";
let isOpen = true;

let customerName = "";
let mealPrice = 0;
let quantity = 1;
let total = 0;

const prices = {
  "Spider Pizza": 150,
  "Pumpkin Pasta": 180,
  "Ghost Burger": 120
};

const DISCOUNT_MINIMUM = 300;
const DISCOUNT_RATE = 0.10;

// Step 8: DOM elements
const status = document.getElementById("status");
const result = document.getElementById("result");
const greeting = document.getElementById("greeting");
const discountHint = document.getElementById("discountHint");
const orderBtn = document.getElementById("orderBtn");
const toggleBtn = document.getElementById("toggleBtn");
const confirmBox = document.getElementById("confirmBox");
const confirmDetails = document.getElementById("confirmDetails");

let pendingOrder = null;

function peso(amount) {
  return "₱" + amount.toLocaleString("en-PH", { maximumFractionDigits: 2 });
}

function escapeHTML(text) {
  const div = document.createElement("div");
  div.textContent = text;
  return div.innerHTML;
}

// Step 9: Restaurant status
function displayStatus() {
  status.textContent = isOpen
    ? "We are OPEN! The cauldrons are bubbling."
    : "We are CLOSED! The kitchen ghosts are resting.";

  document.body.classList.toggle("closed", !isOpen);
  orderBtn.textContent = isOpen ? "Order Now!" : "Kitchen Closed";
  toggleBtn.textContent = isOpen ? "Close the Restaurant" : "Open the Restaurant";
}

// Enhancement 1: Personalized Greeting
function getTimeGreeting() {
  const hour = new Date().getHours();

  if (hour < 5) {
    return "You're up during the witching hour";
  } else if (hour < 12) {
    return "Good morning, early riser";
  } else if (hour < 18) {
    return "Good afternoon, wandering soul";
  } else {
    return "Good evening, creature of the night";
  }
}

function showGreeting() {
  const name = document.getElementById("customer").value.trim();

  if (!name) {
    greeting.className = "show";
    greeting.textContent = "Even ghosts have names... type yours in first!";
    return;
  }

  const spookyLines = [
    "The bats have saved you the best table.",
    "Our chef just stirred the cauldron in your honor.",
    "The jack-o'-lanterns lit up when you walked in.",
    "Rumor has it the Ghost Burger has been waiting for you.",
    "Stay a while... if you dare."
  ];
  const randomLine = spookyLines[Math.floor(Math.random() * spookyLines.length)];

  greeting.className = "show";
  greeting.textContent = getTimeGreeting() + ", " + name + "! " + randomLine;
}

// Enhancement 2: Discount Calculator
function calculateTotals(price, qty) {
  const subtotal = price * qty;
  const hasDiscount = subtotal >= DISCOUNT_MINIMUM;
  const discount = hasDiscount ? subtotal * DISCOUNT_RATE : 0;

  return {
    subtotal: subtotal,
    discount: discount,
    finalTotal: subtotal - discount,
    hasDiscount: hasDiscount
  };
}

function updateDiscountHint() {
  const meal = document.getElementById("meal").value;
  const qty = Number(document.getElementById("quantity").value);

  if (!Number.isInteger(qty) || qty < 1) {
    discountHint.textContent = "Spend ₱300 or more to unlock the 10% Witching Hour Discount.";
    return;
  }

  const subtotal = prices[meal] * qty;

  if (subtotal >= DISCOUNT_MINIMUM) {
    discountHint.textContent = "Witching Hour Discount unlocked! You save " +
      peso(subtotal * DISCOUNT_RATE) + " on this order.";
  } else {
    discountHint.textContent = "Add " + peso(DISCOUNT_MINIMUM - subtotal) +
      " more to unlock the 10% Witching Hour Discount.";
  }
}

// Enhancement 3: Meal Recommendation
function getRecommendation(finalTotal) {
  if (finalTotal < 200) {
    return {
      name: "Bat Wing Bites",
      reason: "a crunchy little side for a light-hearted appetite."
    };
  } else if (finalTotal < 500) {
    return {
      name: "Witch's Brew Soup",
      reason: "a warm green potion to go with a proper meal."
    };
  } else if (finalTotal < 900) {
    return {
      name: "Vampire Velvet Cake",
      reason: "a blood-red dessert, because a feast this big needs a sweet ending."
    };
  } else {
    return {
      name: "Graveyard Platter",
      reason: "our biggest sharing plate, for a whole coven of hungry guests."
    };
  }
}

// Step 10 + Enhancement 4: Order Confirmation and Processing
function placeOrder() {
  customerName = document.getElementById("customer").value.trim();
  const selectedMeal = document.getElementById("meal").value;
  quantity = Number(document.getElementById("quantity").value);

  result.className = "warning";

  if (!customerName) {
    result.textContent = "Please enter your name first!";
    return;
  }

  if (!Number.isInteger(quantity) || quantity < 1) {
    result.textContent = "Please enter a valid quantity.";
    return;
  }

  if (!isOpen) {
    result.textContent = "Sorry, " + customerName +
      "! The restaurant is closed. Come back when the lights are on.";
    return;
  }

  mealPrice = prices[selectedMeal];
  const totals = calculateTotals(mealPrice, quantity);

  pendingOrder = {
    name: customerName,
    meal: selectedMeal,
    qty: quantity,
    totals: totals
  };

  confirmDetails.innerHTML =
    "<p><b>" + escapeHTML(customerName) + "</b>, you're about to order:</p>" +
    "<p>" + quantity + " × " + selectedMeal + " (" + peso(mealPrice) + " each)</p>" +
    (totals.hasDiscount ? "<p>Discount: −" + peso(totals.discount) + "</p>" : "") +
    "<p><b>Total to pay: " + peso(totals.finalTotal) + "</b></p>";

  confirmBox.showModal();
}

function completeOrder() {
  confirmBox.close();
  if (!pendingOrder) return;

  const order = pendingOrder;
  const t = order.totals;
  total = t.finalTotal;
  const special = getRecommendation(total);

  result.className = "receipt";
  result.innerHTML =
    "<p><b>Order confirmed! Thank you, " + escapeHTML(order.name) + ".</b></p>" +
    "<div class='row'><span>" + order.qty + " × " + order.meal + "</span><span>" + peso(t.subtotal) + "</span></div>" +
    (t.hasDiscount
      ? "<div class='row discount'><span>Witching Hour Discount (10%)</span><span>−" + peso(t.discount) + "</span></div>"
      : "") +
    "<div class='row total'><span>Total</span><span>" + peso(total) + "</span></div>" +
    "<div class='recommend'>Chef's pick for you: <b>" + special.name + "</b>, " + special.reason + "</div>" +
    "<p>Enjoy your spooky meal!</p>";

  pendingOrder = null;
}

function cancelOrder() {
  if (confirmBox.open) confirmBox.close();
  if (!pendingOrder) return;

  result.className = "cancelled";
  result.textContent = "Order cancelled. No ghosts were harmed. Change your order whenever you're ready.";
  pendingOrder = null;
}

// Enhancement 5: Dynamic Restaurant Status
function toggleStatus() {
  isOpen = !isOpen;
  displayStatus();
}

// Step 11: Event listeners
function showMenuMessage() {
  alert("Welcome to " + restaurantName + "! Choose your spooky meal.");
}

displayStatus();
updateDiscountHint();

orderBtn.addEventListener("click", placeOrder);

document.querySelector('a[href="#menu"]')
  .addEventListener("click", showMenuMessage);

document.getElementById("greetBtn").addEventListener("click", showGreeting);
document.getElementById("meal").addEventListener("change", updateDiscountHint);
document.getElementById("quantity").addEventListener("input", updateDiscountHint);
document.getElementById("confirmBtn").addEventListener("click", completeOrder);
document.getElementById("cancelBtn").addEventListener("click", cancelOrder);
confirmBox.addEventListener("cancel", cancelOrder);
toggleBtn.addEventListener("click", toggleStatus);

// Menu ticket buttons
function pickMeal(event) {
  document.getElementById("meal").value = event.target.dataset.meal;
  updateDiscountHint();
  document.getElementById("order").scrollIntoView();
  document.getElementById("customer").focus({ preventScroll: true });
}

document.querySelectorAll(".pick").forEach(function (button) {
  button.addEventListener("click", pickMeal);
});

// Jack-o'-lantern eyes follow the mouse
const lantern = document.querySelector(".lantern");
const pupils = document.querySelectorAll(".pupil");

function moveEyes(event) {
  const box = lantern.getBoundingClientRect();
  const centerX = box.left + box.width / 2;
  const centerY = box.top + box.height / 2;

  const moveX = Math.max(-10, Math.min(10, (event.clientX - centerX) / 40));
  const moveY = Math.max(-6, Math.min(6, (event.clientY - centerY) / 40));

  pupils.forEach(function (pupil) {
    pupil.style.transform = "translate(" + moveX + "px, " + moveY + "px)";
  });
}

document.addEventListener("mousemove", moveEyes);
