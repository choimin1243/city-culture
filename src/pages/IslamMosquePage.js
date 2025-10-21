import React, { useEffect, useRef } from 'react';
import './IslamMosquePage.css';

const IslamMosquePage = ({ onExit }) => {
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
      // 벽들 (입구 제외)
      { x: 0, y: 0, width: window.innerWidth, height: 60, type: 'wall', className: 'wall-top' },
      { x: 0, y: 0, width: 60, height: window.innerHeight, type: 'wall', className: 'wall-left' },
      { x: window.innerWidth - 60, y: 0, width: 60, height: window.innerHeight, type: 'wall', className: 'wall-right' },
      // 하단 벽은 입구를 위해 두 부분으로 나눔
      { x: 0, y: window.innerHeight - 60, width: window.innerWidth / 2 - 80, height: 60, type: 'wall', className: 'wall-bottom-left' },
      { x: window.innerWidth / 2 + 80, y: window.innerHeight - 60, width: window.innerWidth / 2 - 80, height: 60, type: 'wall', className: 'wall-bottom-right' },

      // 중앙 미흐랍 (기도 방향 표시 벽감)
      { x: window.innerWidth / 2 - 120, y: 80, width: 240, height: 200, type: 'mihrab', className: 'mihrab' },

      // 양쪽 기둥들 (이슬람 양식)
      { x: 180, y: 100, width: 60, height: 350, type: 'pillar', className: 'pillar-left-1' },
      { x: window.innerWidth - 240, y: 100, width: 60, height: 350, type: 'pillar', className: 'pillar-right-1' },

      // 사원 등불들 (샹들리에)
      { x: window.innerWidth / 2 - 100, y: 100, width: 80, height: 80, type: 'chandelier', className: 'chandelier-1' },
      { x: window.innerWidth / 2 + 20, y: 100, width: 80, height: 80, type: 'chandelier', className: 'chandelier-2' },

      // 코란 거치대들
      { x: window.innerWidth / 2 - 250, y: 250, width: 80, height: 70, type: 'quran-stand', className: 'quran-stand-1' },
      { x: window.innerWidth / 2 + 170, y: 250, width: 80, height: 70, type: 'quran-stand', className: 'quran-stand-2' },

      // 기도 매트들 (초록색)
      { x: 280, y: window.innerHeight / 2 + 50, width: 120, height: 80, type: 'prayer-mat', className: 'mat-1' },
      { x: 480, y: window.innerHeight / 2 + 50, width: 120, height: 80, type: 'prayer-mat', className: 'mat-2' },
      { x: window.innerWidth - 400, y: window.innerHeight / 2 + 50, width: 120, height: 80, type: 'prayer-mat', className: 'mat-3' },
      { x: window.innerWidth - 600, y: window.innerHeight / 2 + 50, width: 120, height: 80, type: 'prayer-mat', className: 'mat-4' },

      // 향로들
      { x: window.innerWidth / 2 - 70, y: 350, width: 60, height: 60, type: 'incense', className: 'incense-1' },
      { x: window.innerWidth / 2 + 10, y: 350, width: 60, height: 60, type: 'incense', className: 'incense-2' },
    ];

    // 입구 영역 정의
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
        this.animationSpeed = 6;
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

        this.velocityX = targetVelX;
        this.velocityY = targetVelY;

        this.isMoving = Math.abs(this.velocityX) > 0.1 || Math.abs(this.velocityY) > 0.1;

        if (this.isMoving) {
          this.direction = newDirection;
        }

        // 충돌 체크
        const newX = this.x + this.velocityX;
        const newY = this.y + this.velocityY;

        if (!this.checkCollision(newX, this.y)) {
          this.x = newX;
        }
        if (!this.checkCollision(this.x, newY)) {
          this.y = newY;
        }

        // 애니메이션 프레임 업데이트
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
        // 그림자
        ctx.fillStyle = 'rgba(0, 0, 0, 0.3)';
        ctx.beginPath();
        ctx.ellipse(this.x, this.y + this.height / 2 + 5, this.width * 0.3, this.height * 0.1, 0, 0, Math.PI * 2);
        ctx.fill();

        // 캐릭터 이미지
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
      // 모스크 바닥 (카펫 패턴)
      const gradient = ctx.createRadialGradient(
        canvas.width / 2, canvas.height / 2, 0,
        canvas.width / 2, canvas.height / 2, canvas.width * 0.7
      );
      gradient.addColorStop(0, '#F0E5D8');
      gradient.addColorStop(0.5, '#E8DCC8');
      gradient.addColorStop(1, '#D4C4A8');
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // 기하학적 이슬람 패턴
      ctx.strokeStyle = 'rgba(34, 139, 34, 0.15)';
      ctx.lineWidth = 2;
      const patternSize = 80;
      for (let x = 0; x < canvas.width; x += patternSize) {
        for (let y = 0; y < canvas.height; y += patternSize) {
          // 별 모양 패턴
          ctx.beginPath();
          for (let i = 0; i < 8; i++) {
            const angle = (Math.PI * 2 * i) / 8;
            const x1 = x + patternSize / 2 + Math.cos(angle) * 20;
            const y1 = y + patternSize / 2 + Math.sin(angle) * 20;
            if (i === 0) ctx.moveTo(x1, y1);
            else ctx.lineTo(x1, y1);
          }
          ctx.closePath();
          ctx.stroke();
        }
      }
    };

    const drawWall = (obj) => {
      const { x, y, width, height } = obj;

      // 벽 그라디언트 (이슬람 스타일 - 흰색/크림색)
      const wallGradient = ctx.createLinearGradient(x, y, x, y + height);
      wallGradient.addColorStop(0, '#F5F5DC');
      wallGradient.addColorStop(0.5, '#FFFAF0');
      wallGradient.addColorStop(1, '#F5F5DC');
      ctx.fillStyle = wallGradient;
      ctx.fillRect(x, y, width, height);

      // 금색 테두리
      ctx.strokeStyle = '#FFD700';
      ctx.lineWidth = 4;
      ctx.strokeRect(x, y, width, height);

      // 이슬람 패턴
      ctx.fillStyle = 'rgba(34, 139, 34, 0.2)';
      const spacing = 40;
      for (let i = x + 15; i < x + width; i += spacing) {
        for (let j = y + 15; j < y + height; j += spacing) {
          ctx.beginPath();
          ctx.arc(i, j, 6, 0, Math.PI * 2);
          ctx.fill();
        }
      }
    };

    const drawMihrab = (obj) => {
      const { x, y, width, height } = obj;

      // 그림자
      ctx.fillStyle = 'rgba(0, 0, 0, 0.2)';
      ctx.fillRect(x + 5, y + 5, width, height);

      // 미흐랍 배경 (아치형)
      const mihrabGradient = ctx.createRadialGradient(
        x + width / 2, y + height / 2, width * 0.1,
        x + width / 2, y + height / 2, width * 0.5
      );
      mihrabGradient.addColorStop(0, '#228B22');
      mihrabGradient.addColorStop(0.5, '#2E8B57');
      mihrabGradient.addColorStop(1, '#006400');
      ctx.fillStyle = mihrabGradient;

      // 아치 모양 그리기
      ctx.beginPath();
      ctx.moveTo(x, y + height);
      ctx.lineTo(x, y + height / 2);
      ctx.quadraticCurveTo(x + width / 2, y - 20, x + width, y + height / 2);
      ctx.lineTo(x + width, y + height);
      ctx.closePath();
      ctx.fill();

      // 금색 테두리
      ctx.strokeStyle = '#FFD700';
      ctx.lineWidth = 5;
      ctx.stroke();

      // 중앙에 초승달과 별
      ctx.fillStyle = '#FFD700';
      // 초승달
      ctx.beginPath();
      ctx.arc(x + width / 2 - 10, y + height / 2, 20, 0.3 * Math.PI, 1.7 * Math.PI);
      ctx.arc(x + width / 2 - 5, y + height / 2, 15, 0.3 * Math.PI, 1.7 * Math.PI, true);
      ctx.fill();

      // 별
      ctx.fillStyle = '#FFD700';
      const starX = x + width / 2 + 15;
      const starY = y + height / 2 - 15;
      ctx.beginPath();
      for (let i = 0; i < 5; i++) {
        const angle = (Math.PI * 2 * i) / 5 - Math.PI / 2;
        const x1 = starX + Math.cos(angle) * 12;
        const y1 = starY + Math.sin(angle) * 12;
        if (i === 0) ctx.moveTo(x1, y1);
        else ctx.lineTo(x1, y1);
      }
      ctx.closePath();
      ctx.fill();
    };

    const drawPillar = (obj) => {
      const { x, y, width, height } = obj;

      // 기둥 그림자
      ctx.fillStyle = 'rgba(0, 0, 0, 0.3)';
      ctx.fillRect(x + 5, y + 5, width, height);

      // 기둥 본체 (대리석 느낌)
      const pillarGradient = ctx.createLinearGradient(x, y, x + width, y);
      pillarGradient.addColorStop(0, '#E8E8E8');
      pillarGradient.addColorStop(0.5, '#FFFFFF');
      pillarGradient.addColorStop(1, '#E8E8E8');
      ctx.fillStyle = pillarGradient;
      ctx.fillRect(x, y, width, height);

      // 금색 장식 띠
      ctx.fillStyle = '#FFD700';
      ctx.fillRect(x, y + 20, width, 15);
      ctx.fillRect(x, y + height - 35, width, 15);

      // 이슬람 패턴
      ctx.fillStyle = '#228B22';
      for (let i = 0; i < 8; i++) {
        ctx.fillRect(x + width / 4, y + 60 + i * 35, width / 2, 3);
      }

      // 테두리
      ctx.strokeStyle = '#D4AF37';
      ctx.lineWidth = 3;
      ctx.strokeRect(x, y, width, height);
    };

    const drawChandelier = (obj) => {
      const { x, y, width, height } = obj;

      // 체인
      ctx.strokeStyle = '#FFD700';
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.moveTo(x + width / 2, y - 20);
      ctx.lineTo(x + width / 2, y);
      ctx.stroke();

      // 샹들리에 본체
      const chandelierGradient = ctx.createRadialGradient(
        x + width / 2, y + height / 2, width * 0.1,
        x + width / 2, y + height / 2, width * 0.5
      );
      chandelierGradient.addColorStop(0, '#FFD700');
      chandelierGradient.addColorStop(0.5, '#FFA500');
      chandelierGradient.addColorStop(1, '#FF8C00');
      ctx.fillStyle = chandelierGradient;
      ctx.beginPath();
      ctx.arc(x + width / 2, y + height / 2, width / 2, 0, Math.PI * 2);
      ctx.fill();

      // 빛 효과
      ctx.fillStyle = 'rgba(255, 215, 0, 0.3)';
      ctx.beginPath();
      ctx.arc(x + width / 2, y + height / 2, width / 1.5, 0, Math.PI * 2);
      ctx.fill();

      // 장식 패턴
      ctx.strokeStyle = '#8B4513';
      ctx.lineWidth = 2;
      for (let i = 0; i < 8; i++) {
        const angle = (Math.PI * 2 * i) / 8;
        ctx.beginPath();
        ctx.moveTo(x + width / 2, y + height / 2);
        ctx.lineTo(
          x + width / 2 + Math.cos(angle) * width / 2,
          y + height / 2 + Math.sin(angle) * width / 2
        );
        ctx.stroke();
      }
    };

    const drawQuranStand = (obj) => {
      const { x, y, width, height } = obj;

      // 그림자
      ctx.fillStyle = 'rgba(0, 0, 0, 0.2)';
      ctx.fillRect(x + 3, y + 3, width, height);

      // 받침대
      const standGradient = ctx.createLinearGradient(x, y, x + width, y);
      standGradient.addColorStop(0, '#8B4513');
      standGradient.addColorStop(0.5, '#A0522D');
      standGradient.addColorStop(1, '#8B4513');
      ctx.fillStyle = standGradient;
      ctx.fillRect(x + width * 0.2, y + height - 20, width * 0.6, 20);

      // 받침대 기둥
      ctx.fillRect(x + width * 0.4, y + height * 0.5, width * 0.2, height * 0.5);

      // 코란 책
      ctx.fillStyle = '#228B22';
      ctx.fillRect(x + width * 0.1, y, width * 0.8, height * 0.6);

      // 금색 장식
      ctx.strokeStyle = '#FFD700';
      ctx.lineWidth = 2;
      ctx.strokeRect(x + width * 0.15, y + 5, width * 0.7, height * 0.5);

      // 아랍어 패턴 (장식)
      ctx.fillStyle = '#FFD700';
      for (let i = 0; i < 3; i++) {
        ctx.fillRect(x + width * 0.25, y + 15 + i * 12, width * 0.5, 2);
      }
    };

    const drawPrayerMat = (obj) => {
      const { x, y, width, height } = obj;

      // 그림자
      ctx.fillStyle = 'rgba(0, 0, 0, 0.2)';
      ctx.fillRect(x + 3, y + 3, width, height);

      // 매트 본체 (초록색)
      const matGradient = ctx.createLinearGradient(x, y, x + width, y);
      matGradient.addColorStop(0, '#228B22');
      matGradient.addColorStop(0.5, '#2E8B57');
      matGradient.addColorStop(1, '#228B22');
      ctx.fillStyle = matGradient;
      ctx.fillRect(x, y, width, height);

      // 테두리
      ctx.strokeStyle = '#FFD700';
      ctx.lineWidth = 3;
      ctx.strokeRect(x + 5, y + 5, width - 10, height - 10);

      // 중앙 패턴 (미흐랍 모양)
      ctx.fillStyle = '#FFD700';
      ctx.beginPath();
      ctx.moveTo(x + width / 2, y + 15);
      ctx.lineTo(x + width * 0.3, y + height * 0.4);
      ctx.lineTo(x + width * 0.3, y + height - 15);
      ctx.lineTo(x + width * 0.7, y + height - 15);
      ctx.lineTo(x + width * 0.7, y + height * 0.4);
      ctx.closePath();
      ctx.fill();
    };

    const drawIncense = (obj) => {
      const { x, y, width, height } = obj;

      // 향로 받침
      ctx.fillStyle = '#8B4513';
      ctx.fillRect(x + width * 0.2, y + height - 15, width * 0.6, 15);

      // 향로 몸체
      const incenseGradient = ctx.createRadialGradient(
        x + width / 2, y + height / 2, width * 0.1,
        x + width / 2, y + height / 2, width * 0.4
      );
      incenseGradient.addColorStop(0, '#B8860B');
      incenseGradient.addColorStop(1, '#DAA520');
      ctx.fillStyle = incenseGradient;
      ctx.beginPath();
      ctx.arc(x + width / 2, y + height / 2, width * 0.35, 0, Math.PI * 2);
      ctx.fill();

      // 연기 효과
      ctx.strokeStyle = 'rgba(200, 200, 200, 0.5)';
      ctx.lineWidth = 2;
      for (let i = 0; i < 3; i++) {
        ctx.beginPath();
        ctx.moveTo(x + width / 2, y + height / 2);
        ctx.quadraticCurveTo(
          x + width / 2 + (i % 2 === 0 ? 10 : -10),
          y + 20,
          x + width / 2,
          y - 10
        );
        ctx.stroke();
      }

      // 테두리
      ctx.strokeStyle = '#8B4513';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.arc(x + width / 2, y + height / 2, width * 0.35, 0, Math.PI * 2);
      ctx.stroke();
    };

    const drawEntrance = () => {
      const { x, y, width, height } = entranceArea;

      // 입구 바닥 (카펫)
      const entranceGradient = ctx.createLinearGradient(x, y, x + width, y);
      entranceGradient.addColorStop(0, '#228B22');
      entranceGradient.addColorStop(0.5, '#2E8B57');
      entranceGradient.addColorStop(1, '#228B22');
      ctx.fillStyle = entranceGradient;
      ctx.fillRect(x, y, width, height);

      // 테두리
      ctx.strokeStyle = '#FFD700';
      ctx.lineWidth = 4;
      ctx.strokeRect(x + 5, y + 5, width - 10, height - 10);

      // 입구 표시
      ctx.fillStyle = '#FFD700';
      ctx.font = 'bold 24px Arial';
      ctx.textAlign = 'center';
      ctx.fillText('EXIT', x + width / 2, y + height / 2 + 8);
    };

    // 캐릭터 생성
    const character = new Character();
    characterRef.current = character;

    // 게임 루프
    const gameLoop = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // 배경 그리기
      drawBackground();

      // 입구 카펫 그리기
      drawEntrance();

      // 벽 그리기
      collisionObjects.filter(obj => obj.type === 'wall').forEach(drawWall);

      // 미흐랍 그리기
      collisionObjects.filter(obj => obj.type === 'mihrab').forEach(drawMihrab);

      // 기둥 그리기
      collisionObjects.filter(obj => obj.type === 'pillar').forEach(drawPillar);

      // 샹들리에 그리기
      collisionObjects.filter(obj => obj.type === 'chandelier').forEach(drawChandelier);

      // 코란 거치대 그리기
      collisionObjects.filter(obj => obj.type === 'quran-stand').forEach(drawQuranStand);

      // 기도 매트 그리기
      collisionObjects.filter(obj => obj.type === 'prayer-mat').forEach(drawPrayerMat);

      // 향로 그리기
      collisionObjects.filter(obj => obj.type === 'incense').forEach(drawIncense);

      // 캐릭터 업데이트 및 그리기
      character.update();
      character.draw(ctx);

      requestAnimationFrame(gameLoop);
    };

    gameLoop();

    return () => {
      // 클린업 - 이벤트 리스너 제거
      if (character && character.cleanup) {
        character.cleanup();
      }
    };
  }, [onExit]);

  return (
    <div className="islam-mosque-page">
      <canvas ref={canvasRef} />
      <div className="mosque-info">
        <h2>🕌 이슬람 사원</h2>
        <p>방향키 또는 WASD로 이동</p>
      </div>
      <div className="mosque-exit-button-container">
        <button onClick={onExit} className="exit-button">
          🚪 사원 나가기
        </button>
      </div>
    </div>
  );
};

export default IslamMosquePage;
