import React, { useEffect, useRef } from 'react';

const CityHallPage = ({ onExit }) => {
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
      // 벽들
      { x: 0, y: 0, width: window.innerWidth, height: 50, type: 'wall', className: 'wall-top' },
      { x: 0, y: 0, width: 50, height: window.innerHeight, type: 'wall', className: 'wall-left' },
      { x: window.innerWidth - 50, y: 0, width: 50, height: window.innerHeight, type: 'wall', className: 'wall-right' },

      // 입구/출구 영역은 벽 제외 (하단 중앙)
      { x: 0, y: window.innerHeight - 50, width: window.innerWidth / 2 - 100, height: 50, type: 'wall', className: 'wall-bottom-left' },
      { x: window.innerWidth / 2 + 100, y: window.innerHeight - 50, width: window.innerWidth / 2 - 100, height: 50, type: 'wall', className: 'wall-bottom-right' },

      // 리셉션 데스크
      { x: window.innerWidth / 2 - 150, y: 200, width: 300, height: 100, type: 'desk', className: 'reception-desk' },

      // 의자들 (왼쪽)
      { x: 100, y: window.innerHeight / 2, width: 50, height: 50, type: 'chair', className: 'chair-1' },
      { x: 250, y: window.innerHeight / 2, width: 50, height: 50, type: 'chair', className: 'chair-2' },

      // 의자들 (오른쪽)
      { x: window.innerWidth - 150, y: window.innerHeight / 2, width: 50, height: 50, type: 'chair', className: 'chair-3' },
      { x: window.innerWidth - 300, y: window.innerHeight / 2, width: 50, height: 50, type: 'chair', className: 'chair-4' },

      // 화분들
      { x: 80, y: 100, width: 60, height: 80, type: 'plant', className: 'plant-1' },
      { x: window.innerWidth - 140, y: 100, width: 60, height: 80, type: 'plant', className: 'plant-2' },
    ];

    // 창문들 (충돌 없음)
    const windows = [
      { x: 70, y: 120, width: 100, height: 150, type: 'window', className: 'window-left' },
      { x: window.innerWidth - 170, y: 120, width: 100, height: 150, type: 'window', className: 'window-right' },
    ];

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

      update(onNearExit) {
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

        // 즉각적인 반응
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

        // 출구 근처 체크 (하단 중앙)
        const exitZone = {
          x: window.innerWidth / 2 - 100,
          y: window.innerHeight - 100,
          width: 200,
          height: 100
        };

        const isNearExit =
          this.x > exitZone.x &&
          this.x < exitZone.x + exitZone.width &&
          this.y > exitZone.y &&
          this.y < exitZone.y + exitZone.height;

        if (onNearExit) {
          onNearExit(isNearExit);
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
    const drawFloor = () => {
      // 대리석 바닥
      const floorGradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
      floorGradient.addColorStop(0, '#E8E8E8');
      floorGradient.addColorStop(0.5, '#D3D3D3');
      floorGradient.addColorStop(1, '#C0C0C0');
      ctx.fillStyle = floorGradient;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // 타일 패턴
      ctx.strokeStyle = 'rgba(169, 169, 169, 0.3)';
      ctx.lineWidth = 2;
      const tileSize = 80;
      for (let x = 0; x < canvas.width; x += tileSize) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, canvas.height);
        ctx.stroke();
      }
      for (let y = 0; y < canvas.height; y += tileSize) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(canvas.width, y);
        ctx.stroke();
      }
    };

    const drawWall = (obj) => {
      const { x, y, width, height } = obj;

      // 벽 그라디언트
      const wallGradient = ctx.createLinearGradient(x, y, x, y + height);
      wallGradient.addColorStop(0, '#B0B0B0');
      wallGradient.addColorStop(0.5, '#D4D4D4');
      wallGradient.addColorStop(1, '#B0B0B0');
      ctx.fillStyle = wallGradient;
      ctx.fillRect(x, y, width, height);

      // 벽 테두리
      ctx.strokeStyle = '#808080';
      ctx.lineWidth = 3;
      ctx.strokeRect(x, y, width, height);
    };

    const drawDesk = (obj) => {
      const { x, y, width, height } = obj;

      // 그림자
      ctx.fillStyle = 'rgba(0, 0, 0, 0.2)';
      ctx.fillRect(x + 5, y + 5, width, height);

      // 데스크 본체
      const deskGradient = ctx.createLinearGradient(x, y, x + width, y);
      deskGradient.addColorStop(0, '#6B4423');
      deskGradient.addColorStop(0.5, '#8B4513');
      deskGradient.addColorStop(1, '#6B4423');
      ctx.fillStyle = deskGradient;
      ctx.fillRect(x, y, width, height);

      // 데스크 상판
      ctx.fillStyle = '#A0522D';
      ctx.fillRect(x + 10, y + 10, width - 20, height - 20);

      // 테두리
      ctx.strokeStyle = '#654321';
      ctx.lineWidth = 4;
      ctx.strokeRect(x, y, width, height);

      // "RECEPTION" 텍스트
      ctx.fillStyle = '#FFD700';
      ctx.font = 'bold 20px Arial';
      ctx.textAlign = 'center';
      ctx.fillText('RECEPTION', x + width / 2, y + height / 2 + 7);
    };

    const drawChair = (obj) => {
      const { x, y, width, height } = obj;

      // 그림자
      ctx.fillStyle = 'rgba(0, 0, 0, 0.2)';
      ctx.fillRect(x + 3, y + 3, width, height);

      // 의자 좌석
      const chairGradient = ctx.createLinearGradient(x, y, x + width, y);
      chairGradient.addColorStop(0, '#1E90FF');
      chairGradient.addColorStop(0.5, '#4169E1');
      chairGradient.addColorStop(1, '#1E90FF');
      ctx.fillStyle = chairGradient;
      ctx.fillRect(x, y + height * 0.5, width, height * 0.3);

      // 의자 등받이
      ctx.fillRect(x, y, width, height * 0.4);

      // 의자 다리
      ctx.fillStyle = '#2F4F4F';
      ctx.fillRect(x + 5, y + height * 0.8, 6, height * 0.2);
      ctx.fillRect(x + width - 11, y + height * 0.8, 6, height * 0.2);

      // 테두리
      ctx.strokeStyle = '#00008B';
      ctx.lineWidth = 2;
      ctx.strokeRect(x, y, width, height * 0.4);
      ctx.strokeRect(x, y + height * 0.5, width, height * 0.3);
    };

    const drawPlant = (obj) => {
      const { x, y, width, height } = obj;
      const centerX = x + width / 2;

      // 화분
      const potGradient = ctx.createLinearGradient(x, y + height * 0.6, x + width, y + height);
      potGradient.addColorStop(0, '#8B4513');
      potGradient.addColorStop(0.5, '#A0522D');
      potGradient.addColorStop(1, '#654321');
      ctx.fillStyle = potGradient;
      ctx.beginPath();
      ctx.moveTo(x + width * 0.2, y + height * 0.6);
      ctx.lineTo(x + width * 0.1, y + height);
      ctx.lineTo(x + width * 0.9, y + height);
      ctx.lineTo(x + width * 0.8, y + height * 0.6);
      ctx.closePath();
      ctx.fill();

      // 식물 잎들
      ctx.fillStyle = '#228B22';
      for (let i = 0; i < 5; i++) {
        const angle = (Math.PI * 2 * i) / 5;
        const leafX = centerX + Math.cos(angle) * width * 0.25;
        const leafY = y + height * 0.3 + Math.sin(angle) * height * 0.15;
        ctx.beginPath();
        ctx.ellipse(leafX, leafY, width * 0.15, height * 0.2, angle, 0, Math.PI * 2);
        ctx.fill();
      }

      // 중앙 잎
      ctx.fillStyle = '#32CD32';
      ctx.beginPath();
      ctx.ellipse(centerX, y + height * 0.3, width * 0.2, height * 0.25, 0, 0, Math.PI * 2);
      ctx.fill();
    };

    const drawWindow = (obj) => {
      const { x, y, width, height } = obj;

      // 창문 프레임
      ctx.fillStyle = '#696969';
      ctx.fillRect(x, y, width, height);

      // 유리
      const glassGradient = ctx.createLinearGradient(x, y, x + width, y + height);
      glassGradient.addColorStop(0, '#87CEEB');
      glassGradient.addColorStop(0.5, '#B0E0E6');
      glassGradient.addColorStop(1, '#ADD8E6');
      ctx.fillStyle = glassGradient;
      ctx.fillRect(x + 5, y + 5, width - 10, height - 10);

      // 십자 프레임
      ctx.fillStyle = '#696969';
      ctx.fillRect(x + width / 2 - 3, y + 5, 6, height - 10);
      ctx.fillRect(x + 5, y + height / 2 - 3, width - 10, 6);

      // 반사광
      ctx.fillStyle = 'rgba(255, 255, 255, 0.4)';
      ctx.fillRect(x + 10, y + 10, width * 0.3, height * 0.2);
    };

    const drawEntrance = () => {
      // 출구/입구 영역
      const entranceX = canvas.width / 2 - 100;
      const entranceY = canvas.height - 50;
      const entranceWidth = 200;
      const entranceHeight = 50;

      // 입구 바닥 (다른 색상)
      const entranceGradient = ctx.createLinearGradient(entranceX, entranceY, entranceX, entranceY + entranceHeight);
      entranceGradient.addColorStop(0, '#8B7355');
      entranceGradient.addColorStop(1, '#A0826D');
      ctx.fillStyle = entranceGradient;
      ctx.fillRect(entranceX, entranceY, entranceWidth, entranceHeight);

      // "EXIT" 텍스트
      ctx.fillStyle = '#FFD700';
      ctx.font = 'bold 24px Arial';
      ctx.textAlign = 'center';
      ctx.fillText('🚪 EXIT', canvas.width / 2, entranceY + 35);
    };

    // 캐릭터 생성
    let showExitButton = false;
    const character = new Character();
    characterRef.current = character;

    // 게임 루프
    const gameLoop = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // 배경 그리기
      drawFloor();

      // 벽 그리기
      collisionObjects.filter(obj => obj.type === 'wall').forEach(drawWall);

      // 창문 그리기
      windows.forEach(drawWindow);

      // 입구 그리기
      drawEntrance();

      // 리셉션 데스크 그리기
      collisionObjects.filter(obj => obj.type === 'desk').forEach(drawDesk);

      // 의자 그리기
      collisionObjects.filter(obj => obj.type === 'chair').forEach(drawChair);

      // 화분 그리기
      collisionObjects.filter(obj => obj.type === 'plant').forEach(drawPlant);

      // 타이틀
      ctx.fillStyle = '#2F4F4F';
      ctx.font = 'bold 32px Arial';
      ctx.textAlign = 'center';
      ctx.fillText('🏛️ 시청 내부', canvas.width / 2, 80);

      // 캐릭터 업데이트 및 그리기
      character.update((isNear) => {
        showExitButton = isNear;
      });
      character.draw(ctx);

      requestAnimationFrame(gameLoop);
    };

    gameLoop();

    return () => {
      // 클린업
      if (character && character.cleanup) {
        character.cleanup();
      }
    };
  }, [onExit]);

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      width: '100vw',
      height: '100vh',
      overflow: 'hidden',
      background: '#F5F5F5',
      zIndex: 9999
    }}>
      <canvas
        ref={canvasRef}
        style={{
          display: 'block',
          background: '#F5F5F5',
          position: 'absolute',
          top: 0,
          left: 0
        }}
      />
      <div style={{
        position: 'fixed',
        top: '20px',
        left: '50%',
        transform: 'translateX(-50%)',
        background: 'rgba(26, 31, 58, 0.9)',
        border: '2px solid #FFD700',
        borderRadius: '10px',
        padding: '10px 20px',
        color: '#FFD700',
        fontSize: '16px',
        fontWeight: 'bold',
        textAlign: 'center',
        zIndex: 1000,
        pointerEvents: 'none'
      }}>
        <p style={{ margin: 0 }}>방향키 또는 WASD로 이동</p>
      </div>
      <div style={{
        position: 'fixed',
        bottom: '80px',
        left: '50%',
        transform: 'translateX(-50%)',
        zIndex: 1000
      }}>
        <button
          onClick={onExit}
          style={{
            background: 'linear-gradient(135deg, #DC143C, #8B0000)',
            border: '3px solid #FFD700',
            borderRadius: '15px',
            padding: '15px 30px',
            fontSize: '20px',
            fontWeight: 'bold',
            color: '#FFFFFF',
            cursor: 'pointer',
            boxShadow: '0 6px 12px rgba(0, 0, 0, 0.4)',
            transition: 'all 0.3s ease'
          }}
        >
          🚪 시청 나가기
        </button>
      </div>
    </div>
  );
};

export default CityHallPage;
