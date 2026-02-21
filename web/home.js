window.addEventListener("DOMContentLoaded", () => {
  const enterBtn = document.getElementById("enter-btn");
  const card = document.getElementById("landing-card");

  enterBtn.onclick = () => {
    card.classList.add("exit-anim");
    setTimeout(() => {
      window.location.href = "/game.html";
    }, 360);
  };
});
