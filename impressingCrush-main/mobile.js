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
  touchStartX = 0;
  touchStartY = 0;
  touchMoveX = 0;
  touchMoveY = 0;
  prevTouchX = 0;
  prevTouchY = 0;
  velX = 0;
  velY = 0;
  rotation = Math.random() * 30 - 15;
  currentPaperX = 0;
  currentPaperY = 0;
  rotating = false;

  init(paper) {

    paper.addEventListener('touchstart', (e) => {
      if (this.holdingPaper) return;
      this.holdingPaper = true;

      paper.classList.add('active');
      paper.style.zIndex = highestZ++;

      this.touchStartX = e.touches[0].clientX;
      this.touchStartY = e.touches[0].clientY;
      this.prevTouchX = this.touchStartX;
      this.prevTouchY = this.touchStartY;
    });

    paper.addEventListener('touchmove', (e) => {
      if (!this.holdingPaper) return;
      e.preventDefault();

      this.touchMoveX = e.touches[0].clientX;
      this.touchMoveY = e.touches[0].clientY;

      this.velX = this.touchMoveX - this.prevTouchX;
      this.velY = this.touchMoveY - this.prevTouchY;

      this.currentPaperX += this.velX;
      this.currentPaperY += this.velY;

      this.prevTouchX = this.touchMoveX;
      this.prevTouchY = this.touchMoveY;

      paper.style.transform = `
        translateX(${this.currentPaperX}px)
        translateY(${this.currentPaperY}px)
        rotateZ(${this.rotation}deg)
      `;
    });

    paper.addEventListener('touchend', () => {
      this.holdingPaper = false;
      paper.classList.remove('active');

      // inertia
      this.currentPaperX += this.velX * 2;
      this.currentPaperY += this.velY * 2;

      paper.style.transform = `
        translateX(${this.currentPaperX}px)
        translateY(${this.currentPaperY}px)
        rotateZ(${this.rotation}deg)
      `;

      spawnHeart(this.prevTouchX, this.prevTouchY);
    });
  }
}

document.querySelectorAll('.paper').forEach(paper => {
  const p = new Paper();
  p.init(paper);
});
