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

  init(paper) {

    document.addEventListener('mousemove', (e) => {
      this.mouseX = e.clientX;
      this.mouseY = e.clientY;

      if (!this.holdingPaper) return;

      this.velX = this.mouseX - this.prevMouseX;
      this.velY = this.mouseY - this.prevMouseY;

      this.currentPaperX += this.velX;
      this.currentPaperY += this.velY;

      this.prevMouseX = this.mouseX;
      this.prevMouseY = this.mouseY;

      paper.style.transform = `
        translateX(${this.currentPaperX}px)
        translateY(${this.currentPaperY}px)
        rotateZ(${this.rotation}deg)
      `;
    });

    paper.addEventListener('mousedown', (e) => {
      this.holdingPaper = true;
      paper.classList.add('active');

      paper.style.zIndex = highestZ++;

      this.prevMouseX = e.clientX;
      this.prevMouseY = e.clientY;
    });

    window.addEventListener('mouseup', () => {
      if (!this.holdingPaper) return;

      this.holdingPaper = false;
      paper.classList.remove('active');

      this.currentPaperX += this.velX * 2;
      this.currentPaperY += this.velY * 2;

      paper.style.transform = `
        translateX(${this.currentPaperX}px)
        translateY(${this.currentPaperY}px)
        rotateZ(${this.rotation}deg)
      `;

      spawnHeart(this.mouseX, this.mouseY);
    });
  }
}

document.querySelectorAll('.paper').forEach(paper => {
  const p = new Paper();
  p.init(paper);
});
