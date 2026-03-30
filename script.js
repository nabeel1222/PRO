document.addEventListener("DOMContentLoaded", () => {
  const output = document.getElementById("output");
  const form = document.getElementById("form");
  const rocket = document.getElementById("rocket");
  const glow = document.querySelector(".cursor-glow");
  const tilt = document.querySelector(".tilt");

  // Load saved submissions from localStorage
  const saved = JSON.parse(localStorage.getItem("submissions")) || [];
  saved.forEach(entry => addToUI(entry.name, entry.email));

  // Form submit
  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const name = document.getElementById("name").value;
    const email = document.getElementById("email").value;

    // Save in localStorage
    let saved = JSON.parse(localStorage.getItem("submissions")) || [];
    saved.push({ name, email });
    localStorage.setItem("submissions", JSON.stringify(saved));

    // Show in UI
    addToUI(name, email);

    // Send to backend
    await fetch("https://xgod-backend.onrender.com/add", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, email })
    });

    form.reset();
  });

  // Typing effect
  const texts = ["Hi, I'm Nabeel!!!", "Web Developer:>", "Creative Designer:)", "I Build Cool Projects.."];
  let i = 0, j = 0, currentText = "", isDeleting = false;
  function typeEffect() {
    if (i < texts.length) {
      if (!isDeleting && j <= texts[i].length) currentText = texts[i].substring(0, j++);
      else if (isDeleting && j >= 0) currentText = texts[i].substring(0, j--);

      document.getElementById("typing").textContent = currentText;

      if (j === texts[i].length) isDeleting = true;
      if (j === 0 && isDeleting) { isDeleting = false; i = (i + 1) % texts.length; }
    }
    setTimeout(typeEffect, isDeleting ? 50 : 100);
  }
  typeEffect();

  // Cursor glow follow mouse
  document.addEventListener("mousemove", e => {
    glow.style.left = e.clientX + "px";
    glow.style.top = e.clientY + "px";
  });

  // Floating background scroll effect
  window.addEventListener("scroll", () => {
    const scrollY = window.scrollY;
    document.querySelector(".floating").style.transform = `translateY(${scrollY * 0.3}px)`;
    document.querySelector(".floating2").style.transform = `translateY(${scrollY * -0.3}px)`;
    if (rocket) rocket.style.transform = `translateY(-${scrollY}px) rotate(${scrollY * 0.1}deg)`;
  });

  // Ripple effect on buttons
  const buttons = document.querySelectorAll("button");
  buttons.forEach(btn => {
    btn.addEventListener("click", e => {
      const circle = document.createElement("span");
      circle.classList.add("ripple");
      const rect = btn.getBoundingClientRect();
      circle.style.left = e.clientX - rect.left + "px";
      circle.style.top = e.clientY - rect.top + "px";
      btn.appendChild(circle);
      setTimeout(() => circle.remove(), 500);
    });
  });

  // Tilt effect
  tilt.addEventListener("mousemove", e => {
    const rect = tilt.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    tilt.style.transform = `rotateX(${-(y - centerY)/10}deg) rotateY(${(x - centerX)/10}deg)`;
  });
  tilt.addEventListener("mouseleave", () => tilt.style.transform = "rotateX(0) rotateY(0)");

  // Particles.js
  particlesJS("particles-js", {
    particles: { number: { value: 80 }, size: { value: 3 }, move: { speed: 2 }, line_linked: { enable: true } }
  });

  // Rocket follow mouse & trail
  let mouseX = window.innerWidth/2, mouseY = window.innerHeight/2;
  let posX = mouseX, posY = mouseY;
  let hue = 0;

  document.addEventListener("mousemove", e => { mouseX = e.clientX; mouseY = e.clientY; });

  

  function animate() {
    posX += (mouseX - posX) * 0.07;
    posY += (mouseY - posY) * 0.07;
    if (rocket) {
      rocket.style.left = posX + "px";
      rocket.style.top = posY + "px";
      const angle = Math.atan2(mouseY - posY, mouseX - posX)*(180/Math.PI);
      rocket.style.transform = `translate(-50%, -50%) rotate(${angle + 90}deg)`;
      const rect = rocket.getBoundingClientRect();
      createTrail(rect.left + rect.width/2, rect.top + rect.height);
    }
    requestAnimationFrame(animate);
  }
  animate();

 
  setInterval(createStar, 800);

  // Helper: Add submission to UI
  function addToUI(name, email) {
    const p = document.createElement("p");
    p.textContent = `Name: ${name}, Email: ${email}`;
    output.appendChild(p);
  }
});