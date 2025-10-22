import React, { useEffect, useRef } from 'react';
import './StorePage.css';

const ButcherShopPage = ({ onExit }) => {
  const canvasRef = useRef(null);
  const characterRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    // 충돌 가능한 오브젝트들
    const collisionObjects = [
      // 외벽들
      { x: 0, y: 0, width: window.innerWidth, height: 40, type: 'wall' },
      { x: 0, y: 0, width: 40, height: window.innerHeight, type: 'wall' },
      { x: window.innerWidth - 40, y: 0, width: 40, height: window.innerHeight, type: 'wall' },
      { x: 0, y: window.innerHeight - 40, width: window.innerWidth / 2 - 80, height: 40, type: 'wall' },
      { x: window.innerWidth / 2 + 80, y: window.innerHeight - 40, width: window.innerWidth / 2 - 80, height: 40, type: 'wall' },

      // 진열대들 (왼쪽 - 고기류)
      { x: 100, y: 100, width: 250, height: 80, type: 'meat-display', label: '🥩 소고기' },
      { x: 100, y: 220, width: 250, height: 80, type: 'meat-display', label: '🐷 돼지고기' },
      { x: 100, y: 340, width: 250, height: 80, type: 'meat-display', label: '🐔 닭고기' },

      // 진열대들 (오른쪽)
      { x: window.innerWidth - 350, y: 100, width: 250, height: 80, type: 'meat-display', label: '🦆 오리고기' },
      { x: window.innerWidth - 350, y: 220, width: 250, height: 80, type: 'meat-display', label: '🐑 양고기' },
      { x: window.innerWidth - 350, y: 340, width: 250, height: 80, type: 'meat-display', label: '🦴 뼈/육수' },

      // 계산대
      { x: window.innerWidth / 2 - 150, y: 80, width: 300, height: 120, type: 'cashier' },
    ];

    // 입구 영역
    const entranceArea = {
      x: window.innerWidth / 2 - 80,
      y: window.innerHeight - 100,
      width: 160,
      height: 100
    };

    class Character {
      constructor() {
        this.x = window.innerWidth / 2;
        this.y = window.innerHeight - 150;
        this.width = 60;
        this.height = 60;
        this.speed = 8;
        this.velocityX = 0;
        this.velocityY = 0;
        this.direction = 'front';
        this.isMoving = false;

        this.images = {};
        this.imagesLoaded = 0;
        this.totalImages = 6;
        this.loadImages();

        this.keys = {};
        this.setupEventListeners();

        this.animationFrame = 0;
        this.animationSpeed = 10;
        this.animationCounter = 0;
      }

      loadImages() {
        const imageNames = [
          'front1_no_bg', 'front222',
          'left1_no_bg', 'left2-removebg-preview',
          'right1_no_bg', 'right2_no_bg'
        ];

        imageNames.forEach(name => {
          const img = new Image();
          img.crossOrigin = 'anonymous';
          img.onload = () => this.imagesLoaded++;
          img.onerror = () => this.imagesLoaded++;
          img.src = `https://cdn.jsdelivr.net/gh/choimin1243/11122212/${name}.png`;
          this.images[name] = img;
        });
      }

      setupEventListeners() {
        this.handleKeyDown = (e) => {
          this.keys[e.key.toLowerCase()] = true;
          if (e.key === 'Escape') {
            onExit();
          }
        };

        this.handleKeyUp = (e) => {
          this.keys[e.key.toLowerCase()] = false;
        };

        window.addEventListener('keydown', this.handleKeyDown);
        window.addEventListener('keyup', this.handleKeyUp);
      }

      cleanup() {
        window.removeEventListener('keydown', this.handleKeyDown);
        window.removeEventListener('keyup', this.handleKeyUp);
      }

      checkCollision(newX, newY) {
        const characterRect = {
          x: newX - this.width / 2,
          y: newY - this.height / 2,
          width: this.width,
          height: this.height
        };

        for (let obj of collisionObjects) {
          if (
            characterRect.x < obj.x + obj.width &&
            characterRect.x + characterRect.width > obj.x &&
            characterRect.y < obj.y + obj.height &&
            characterRect.y + characterRect.height > obj.y
          ) {
            return true;
          }
        }
        return false;
      }

      update() {
        let targetVelX = 0;
        let targetVelY = 0;
        let newDirection = this.direction;

        if (this.keys['arrowleft'] || this.keys['a']) {
          targetVelX = -this.speed;
          newDirection = 'left';
        }
        if (this.keys['arrowright'] || this.keys['d']) {
          targetVelX = this.speed;
          newDirection = 'right';
        }
        if (this.keys['arrowup'] || this.keys['w']) {
          targetVelY = -this.speed;
          if (!newDirection.includes('left') && !newDirection.includes('right')) {
            newDirection = 'front';
          }
        }
        if (this.keys['arrowdown'] || this.keys['s']) {
          targetVelY = this.speed;
          if (!newDirection.includes('left') && !newDirection.includes('right')) {
            newDirection = 'front';
          }
        }

        this.velocityX += (targetVelX - this.velocityX) * 0.2;
        this.velocityY += (targetVelY - this.velocityY) * 0.2;

        this.isMoving = Math.abs(this.velocityX) > 0.1 || Math.abs(this.velocityY) > 0.1;

        if (this.isMoving) {
          this.direction = newDirection;
        }

        const newX = this.x + this.velocityX;
        const newY = this.y + this.velocityY;

        if (!this.checkCollision(newX, this.y)) {
          this.x = newX;
        }
        if (!this.checkCollision(this.x, newY)) {
          this.y = newY;
        }

        if (this.isMoving) {
          this.animationCounter++;
          if (this.animationCounter >= this.animationSpeed) {
            this.animationFrame = (this.animationFrame + 1) % 2;
            this.animationCounter = 0;
          }
        } else {
          this.animationFrame = 0;
        }
      }

      draw(ctx) {
        ctx.fillStyle = 'rgba(0, 0, 0, 0.3)';
        ctx.beginPath();
        ctx.ellipse(this.x, this.y + this.height / 2 + 5, this.width * 0.3, this.height * 0.1, 0, 0, Math.PI * 2);
        ctx.fill();

        let imageName;
        if (this.direction === 'left') {
          imageName = this.animationFrame === 0 ? 'left1_no_bg' : 'left2-removebg-preview';
        } else if (this.direction === 'right') {
          imageName = this.animationFrame === 0 ? 'right1_no_bg' : 'right2_no_bg';
        } else {
          imageName = this.animationFrame === 0 ? 'front1_no_bg' : 'front222';
        }

        const img = this.images[imageName];
        if (img && img.complete) {
          ctx.drawImage(img, this.x - this.width / 2, this.y - this.height / 2, this.width, this.height);
        }
      }
    }

    // 그리기 함수들
    const drawBackground = () => {
      const gradient = ctx.createLinearGradient(0, 0, canvas.width, 0);
      gradient.addColorStop(0, '#FFE8E8');
      gradient.addColorStop(0.5, '#FFF0F0');
      gradient.addColorStop(1, '#FFE8E8');
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // 타일 패턴
      ctx.strokeStyle = 'rgba(200, 200, 200, 0.3)';
      ctx.lineWidth = 1;
      const tileSize = 50;
      for (let x = 0; x < canvas.width; x += tileSize) {
        for (let y = 0; y < canvas.height; y += tileSize) {
          ctx.strokeRect(x, y, tileSize, tileSize);
        }
      }
    };

    const drawMeatDisplay = (obj) => {
      const { x, y, width, height, label } = obj;

      // 진열대 그림자
      ctx.fillStyle = 'rgba(0, 0, 0, 0.2)';
      ctx.fillRect(x + 3, y + 3, width, height);

      // 진열대 본체 (냉장 진열대 느낌)
      const displayGradient = ctx.createLinearGradient(x, y, x, y + height);
      displayGradient.addColorStop(0, '#E8F4F8');
      displayGradient.addColorStop(0.5, '#F0F8FF');
      displayGradient.addColorStop(1, '#E8F4F8');
      ctx.fillStyle = displayGradient;
      ctx.fillRect(x, y, width, height);

      // 유리 효과
      ctx.fillStyle = 'rgba(173, 216, 230, 0.3)';
      ctx.fillRect(x + 10, y + 10, width - 20, height - 20);

      // 테두리
      ctx.strokeStyle = '#4682B4';
      ctx.lineWidth = 4;
      ctx.strokeRect(x, y, width, height);

      // 냉기 효과 선
      ctx.strokeStyle = 'rgba(135, 206, 250, 0.5)';
      ctx.lineWidth = 2;
      for (let i = 1; i < 4; i++) {
        const lineY = y + (height / 4) * i;
        ctx.beginPath();
        ctx.moveTo(x + 15, lineY);
        ctx.lineTo(x + width - 15, lineY);
        ctx.stroke();
      }

      // 라벨
      ctx.fillStyle = '#8B0000';
      ctx.font = 'bold 20px Arial';
      ctx.textAlign = 'center';
      ctx.fillText(label, x + width / 2, y + height / 2);
    };

    const drawCashier = (obj) => {
      const { x, y, width, height } = obj;

      // 계산대 그림자
      ctx.fillStyle = 'rgba(0, 0, 0, 0.2)';
      ctx.fillRect(x + 3, y + 3, width, height);

      // 계산대 본체
      const cashierGradient = ctx.createLinearGradient(x, y, x, y + height);
      cashierGradient.addColorStop(0, '#C0C0C0');
      cashierGradient.addColorStop(0.5, '#D3D3D3');
      cashierGradient.addColorStop(1, '#C0C0C0');
      ctx.fillStyle = cashierGradient;
      ctx.fillRect(x, y, width, height);

      // 카운터 상단
      ctx.fillStyle = '#A9A9A9';
      ctx.fillRect(x, y, width, 20);

      // 계산기
      ctx.fillStyle = '#404040';
      ctx.fillRect(x + width - 80, y + 30, 60, 40);

      // 계산기 버튼들
      ctx.fillStyle = '#808080';
      for (let i = 0; i < 3; i++) {
        for (let j = 0; j < 3; j++) {
          ctx.fillRect(x + width - 75 + j * 18, y + 35 + i * 12, 15, 10);
        }
      }

      // 계산대 라벨
      ctx.fillStyle = '#000000';
      ctx.font = 'bold 24px Arial';
      ctx.textAlign = 'center';
      ctx.fillText('💰 계산대', x + width / 2, y + height / 2 + 10);

      // 테두리
      ctx.strokeStyle = '#696969';
      ctx.lineWidth = 3;
      ctx.strokeRect(x, y, width, height);
    };

    const drawWall = (obj) => {
      const { x, y, width, height } = obj;

      const wallGradient = ctx.createLinearGradient(x, y, x, y + height);
      wallGradient.addColorStop(0, '#E8E8E8');
      wallGradient.addColorStop(0.5, '#F0F0F0');
      wallGradient.addColorStop(1, '#E8E8E8');
      ctx.fillStyle = wallGradient;
      ctx.fillRect(x, y, width, height);

      ctx.strokeStyle = '#C0C0C0';
      ctx.lineWidth = 2;
      ctx.strokeRect(x, y, width, height);
    };

    const drawEntrance = () => {
      const { x, y, width, height } = entranceArea;

      const entranceGradient = ctx.createLinearGradient(x, y, x + width, y);
      entranceGradient.addColorStop(0, '#A9A9A9');
      entranceGradient.addColorStop(0.5, '#C0C0C0');
      entranceGradient.addColorStop(1, '#A9A9A9');
      ctx.fillStyle = entranceGradient;
      ctx.fillRect(x, y, width, height);

      ctx.strokeStyle = '#808080';
      ctx.lineWidth = 3;
      ctx.strokeRect(x + 5, y + 5, width - 10, height - 10);

      ctx.fillStyle = '#4169E1';
      ctx.font = 'bold 20px Arial';
      ctx.textAlign = 'center';
      ctx.fillText('EXIT', x + width / 2, y + height / 2);
    };

    // 캐릭터 생성
    const character = new Character();
    characterRef.current = character;

    // 게임 루프
    const gameLoop = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      drawBackground();
      drawEntrance();

      collisionObjects.filter(obj => obj.type === 'wall').forEach(drawWall);
      collisionObjects.filter(obj => obj.type === 'meat-display').forEach(drawMeatDisplay);
      collisionObjects.filter(obj => obj.type === 'cashier').forEach(drawCashier);

      character.update();
      character.draw(ctx);

      requestAnimationFrame(gameLoop);
    };

    gameLoop();

    return () => {
      if (character && character.cleanup) {
        character.cleanup();
      }
    };
  }, [onExit]);

  return (
    <div className="store-page">
      <canvas ref={canvasRef} />
      <div className="store-info">
        <h2>🥩 정육점</h2>
        <p>신선한 고기를 구매하세요</p>
      </div>
      <div className="store-exit-button-container">
        <button onClick={onExit} className="exit-button">
          🚪 정육점 나가기
        </button>
      </div>
    </div>
  );
};

export default ButcherShopPage;
