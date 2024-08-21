// Obtener todos los elementos de asientos
const seatBoxes = document.querySelectorAll(".boxes_seats, .boxes2_seats, .boxes3_seats, .boxes4_seats");
const footerButton = document.querySelector(".footer_right button");

let selectedSeatCount = 0;

// Inicializar el estado del botón
updateFooterButton();

seatBoxes.forEach((seatBox) => {
  seatBox.addEventListener("click", toggleSeatSelection);
});

function toggleSeatSelection(event) {
  const selectedSeat = event.currentTarget;

  selectedSeat.classList.toggle("selected");

  if (selectedSeat.classList.contains("selected")) {
    selectedSeatCount++;
  } else {
    selectedSeatCount--;
  }

  updateFooterButton();
}

function updateFooterButton() {
  if (selectedSeatCount > 0) {
    footerButton.disabled = false;
    footerButton.classList.remove("disabled");
  } else {
    footerButton.disabled = true;
    footerButton.classList.add("disabled");
  }
}