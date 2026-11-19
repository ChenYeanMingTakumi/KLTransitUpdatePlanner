// ---------- App entry point: wires buttons and boots the UI ----------
import { findRoute, resetSelection, getState } from "./router.js";
import { renderAll, openModal, closeModal } from "./ui.js";

document.getElementById("btn-check").onclick = () => {
  const s = getState();
  if (s.startLine && s.startStation && s.endLine && s.endStation) openModal(findRoute());
};
document.getElementById("btn-reset").onclick = () => {
  resetSelection();
  closeModal();
  renderAll();
};

// Journey result popout
document.getElementById("modal-close").onclick = closeModal;
document.getElementById("modal-backdrop").addEventListener("click", e => {
  if (e.target === document.getElementById("modal-backdrop")) closeModal();
});

// Map popout
const mapBackdrop = document.getElementById("map-backdrop");
document.getElementById("btn-map").onclick = () => { mapBackdrop.hidden = false; };
document.getElementById("map-modal-close").onclick = () => { mapBackdrop.hidden = true; };
mapBackdrop.addEventListener("click", e => {
  if (e.target === mapBackdrop) mapBackdrop.hidden = true;
});

// Escape closes whichever popout is open
document.addEventListener("keydown", e => {
  if (e.key === "Escape") {
    closeModal();
    mapBackdrop.hidden = true;
  }
});

renderAll();
