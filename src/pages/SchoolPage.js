import React, { useEffect, useRef } from 'react';
import './SchoolPage.css';

const SchoolPage = ({ onExit }) => {
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

      // 책상들 (왼쪽 줄)
      { x: 150, y: 150, width: 100, height: 60, type: 'desk', label: '책상 1' },
      { x: 150, y: 250, width: 100, height: 60, type: 'desk', label: '책상 2' },
      { x: 150, y: 350, width: 100, height: 60, type: 'desk', label: '책상 3' },

      // 책상들 (오른쪽 줄)
      { x: window.innerWidth - 250, y: 150, width: 100, height: 60, type: 'desk', label: '책상 4' },
      { x: window.innerWidth - 250, y: 250, width: 100, height: 60, type: 'desk', label: '책상 5' },
      { x: window.innerWidth - 250, y: 350, width: 100, height: 60, type: 'desk', label: '책상 6' },

      // 칠판
      { x: window.innerWidth / 2 - 200, y: 80, width: 400, height: 120, type: 'blackboard' },

      // 교탁
      { x: window.innerWidth / 2 - 80, y: 220, width: 160, height: 80, type: 'teacher-desk' },
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
      gradient.addColorStop(0, '#FFF8E7');
      gradient.addColorStop(0.5, '#FFFAED');
      gradient.addColorStop(1, '#FFF8E7');
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // 타일 패턴
      ctx.strokeStyle = 'rgba(200, 200, 180, 0.3)';
      ctx.lineWidth = 1;
      const tileSize = 50;
      for (let x = 0; x < canvas.width; x += tileSize) {
        for (let y = 0; y < canvas.height; y += tileSize) {
          ctx.strokeRect(x, y, tileSize, tileSize);
        }
      }
    };

    const drawDesk = (obj) => {
      const { x, y, width, height } = obj;

      // 책상 그림자
      ctx.fillStyle = 'rgba(0, 0, 0, 0.2)';
      ctx.fillRect(x + 3, y + 3, width, height);

      // 책상 본체
      const deskGradient = ctx.createLinearGradient(x, y, x, y + height);
      deskGradient.addColorStop(0, '#D2691E');
      deskGradient.addColorStop(0.5, '#CD853F');
      deskGradient.addColorStop(1, '#D2691E');
      ctx.fillStyle = deskGradient;
      ctx.fillRect(x, y, width, height);

      // 책상 서랍
      ctx.strokeStyle = '#8B4513';
      ctx.lineWidth = 2;
      ctx.strokeRect(x + 10, y + height - 20, width - 20, 15);

      // 테두리
      ctx.strokeStyle = '#8B4513';
      ctx.lineWidth = 3;
      ctx.strokeRect(x, y, width, height);

      // 책
      ctx.fillStyle = '#4169E1';
      ctx.fillRect(x + 15, y + 10, 30, 20);
      ctx.fillStyle = '#DC143C';
      ctx.fillRect(x + 50, y + 15, 30, 20);
    };

    const drawBlackboard = (obj) => {
      const { x, y, width, height } = obj;

      // 칠판 그림자
      ctx.fillStyle = 'rgba(0, 0, 0, 0.2)';
      ctx.fillRect(x + 3, y + 3, width, height);

      // 칠판 본체
      const blackboardGradient = ctx.createLinearGradient(x, y, x, y + height);
      blackboardGradient.addColorStop(0, '#1B4D3E');
      blackboardGradient.addColorStop(0.5, '#2F5D4F');
      blackboardGradient.addColorStop(1, '#1B4D3E');
      ctx.fillStyle = blackboardGradient;
      ctx.fillRect(x, y, width, height);

      // 테두리
      ctx.strokeStyle = '#654321';
      ctx.lineWidth = 8;
      ctx.strokeRect(x, y, width, height);

      // 칠판 글씨
      ctx.fillStyle = '#FFFFFF';
      ctx.font = 'bold 32px Arial';
      ctx.textAlign = 'center';
      ctx.fillText('🏫 학교에 오신 것을 환영합니다', x + width / 2, y + height / 2 - 10);
      ctx.font = '20px Arial';
      ctx.fillText('배움의 즐거움을 느껴보세요!', x + width / 2, y + height / 2 + 20);
    };

    const drawTeacherDesk = (obj) => {
      const { x, y, width, height } = obj;

      // 교탁 그림자
      ctx.fillStyle = 'rgba(0, 0, 0, 0.2)';
      ctx.fillRect(x + 3, y + 3, width, height);

      // 교탁 본체
      const teacherDeskGradient = ctx.createLinearGradient(x, y, x, y + height);
      teacherDeskGradient.addColorStop(0, '#8B4513');
      teacherDeskGradient.addColorStop(0.5, '#A0522D');
      teacherDeskGradient.addColorStop(1, '#8B4513');
      ctx.fillStyle = teacherDeskGradient;
      ctx.fillRect(x, y, width, height);

      // 상판
      ctx.fillStyle = '#654321';
      ctx.fillRect(x, y, width, 15);

      // 교탁 라벨
      ctx.fillStyle = '#FFD700';
      ctx.font = 'bold 20px Arial';
      ctx.textAlign = 'center';
      ctx.fillText('📚 교탁', x + width / 2, y + height / 2 + 5);

      // 테두리
      ctx.strokeStyle = '#654321';
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
      collisionObjects.filter(obj => obj.type === 'blackboard').forEach(drawBlackboard);
      collisionObjects.filter(obj => obj.type === 'teacher-desk').forEach(drawTeacherDesk);
      collisionObjects.filter(obj => obj.type === 'desk').forEach(drawDesk);

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
    <div className="school-page">
      <canvas ref={canvasRef} />
      <div className="school-info">
        <h2>🏫 학교</h2>
        <p>지식의 전당에 오신 것을 환영합니다</p>
      </div>
      <div className="school-exit-button-container">
        <button onClick={onExit} className="exit-button">
          🚪 학교 나가기
        </button>
      </div>
    </div>
  );
};

export default SchoolPage;
