let highestZ = 1;

function spawnHeart(x, y) {
  const heart = document.createElement('div');
  heart.className = 'heart-pop';
  heart.innerText = '💖';
  heart.style.left = x + 'px';
  heart.style.top = y + 'px';
  document.body.appendChild(heart);
  setTimeout(() => heart.remove(), 1000);
}

class Paper {
  holdingPaper = false;
  mouseX = 0;
  mouseY = 0;
  prevMouseX = 0;
  prevMouseY = 0;
  velX = 0;
  velY = 0;
  rotation = Math.random() * 30 - 15;
  currentPaperX = 0;
  currentPaperY = 0;
  inertiaFrame = null;

  init(paper) {

    document.addEventListener('mousemove', (e) => {
      this.mouseX = e.clientX;
      this.mouseY = e.clientY;

      if (!this.holdingPaper) return;

      this.velX = this.mouseX - this.prevMouseX;
      this.velY = this.mouseY - this.prevMouseY;

      this.currentPaperX += this.velX;
      this.currentPaperY += this.velY;

      // subtle tilt while dragging
      this.rotation += this.velX * 0.02;

      this.prevMouseX = this.mouseX;
      this.prevMouseY = this.mouseY;

      paper.style.transform = `
        translateX(${this.currentPaperX}px)
        translateY(${this.currentPaperY}px)
        rotateZ(${this.rotation}deg)
      `;

      // random hearts while dragging
      if (Math.random() > 0.92) {
        spawnHeart(this.mouseX, this.mouseY);
      }
    });

    paper.addEventListener('mousedown', (e) => {
      this.holdingPaper = true;
      paper.classList.add('active');

      paper.style.zIndex = highestZ++;

      this.prevMouseX = e.clientX;
      this.prevMouseY = e.clientY;

      // stop old inertia
      if (this.inertiaFrame) cancelAnimationFrame(this.inertiaFrame);
    });

    window.addEventListener('mouseup', () => {
      if (!this.holdingPaper) return;

      this.holdingPaper = false;
      paper.classList.remove('active');

      // start inertia
      this.applyInertia(paper);

      spawnHeart(this.mouseX, this.mouseY);
    });
  }

  applyInertia(paper) {
    let friction = 0.92;

    const animate = () => {
      this.velX *= friction;
      this.velY *= friction;

      this.currentPaperX += this.velX;
      this.currentPaperY += this.velY;

      paper.style.transform = `
        translateX(${this.currentPaperX}px)
        translateY(${this.currentPaperY}px)
        rotateZ(${this.rotation}deg)
      `;

      if (Math.abs(this.velX) > 0.3 || Math.abs(this.velY) > 0.3) {
        this.inertiaFrame = requestAnimationFrame(animate);
      }
    };

    animate();
  }
}

document.querySelectorAll('.paper').forEach(paper => {
  const p = new Paper();
  p.init(paper);
});
