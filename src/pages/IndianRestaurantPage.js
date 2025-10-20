import React, { useEffect, useRef } from 'react';
import './IndianRestaurantPage.css';

const IndianRestaurantPage = ({ onExit }) => {
  const canvasRef = useRef(null);
  const characterRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    // 충돌 가능한 오브젝트들 (className 지정)
    const collisionObjects = [
      // 벽들 (입구 제외)
      { x: 0, y: 0, width: window.innerWidth, height: 60, type: 'wall', className: 'wall-top' },
      { x: 0, y: 0, width: 60, height: window.innerHeight, type: 'wall', className: 'wall-left' },
      { x: window.innerWidth - 60, y: 0, width: 60, height: window.innerHeight, type: 'wall', className: 'wall-right' },
      // 하단 벽은 입구를 위해 두 부분으로 나눔
      { x: 0, y: window.innerHeight - 60, width: window.innerWidth / 2 - 80, height: 60, type: 'wall', className: 'wall-bottom-left' },
      { x: window.innerWidth / 2 + 80, y: window.innerHeight - 60, width: window.innerWidth / 2 - 80, height: 60, type: 'wall', className: 'wall-bottom-right' },

      // 주방 (왼쪽 상단)
      { x: 80, y: 80, width: 200, height: 150, type: 'kitchen', className: 'kitchen' },

      // 테이블들 (충돌 적용)
      { x: 400, y: 150, width: 100, height: 100, type: 'table', className: 'table-1' },
      { x: 600, y: 150, width: 100, height: 100, type: 'table', className: 'table-2' },
      { x: 400, y: 350, width: 100, height: 100, type: 'table', className: 'table-3' },
      { x: 600, y: 350, width: 100, height: 100, type: 'table', className: 'table-4' },

      // 인도 장식물들 (충돌 적용)
      // 코끼리 조각상들
      { x: window.innerWidth - 150, y: 100, width: 80, height: 80, type: 'elephant', className: 'elephant-1' },
      { x: window.innerWidth - 150, y: window.innerHeight - 180, width: 80, height: 80, type: 'elephant', className: 'elephant-2' },

      // 향로/인센스 스탠드
      { x: 320, y: 80, width: 50, height: 50, type: 'incense', className: 'incense-1' },
      { x: window.innerWidth / 2 - 200, y: window.innerHeight - 150, width: 50, height: 50, type: 'incense', className: 'incense-2' },
      { x: window.innerWidth / 2 + 150, y: window.innerHeight - 150, width: 50, height: 50, type: 'incense', className: 'incense-3' },

      // 장식 화분들
      { x: 800, y: 100, width: 60, height: 60, type: 'vase', className: 'vase-1' },
      { x: 800, y: 380, width: 60, height: 60, type: 'vase', className: 'vase-2' },

      // 탄두리 오븐 (주방 옆)
      { x: 300, y: 90, width: 70, height: 90, type: 'tandoor', className: 'tandoor' },

      // 만다라 장식 스탠드들
      { x: 120, y: 300, width: 40, height: 60, type: 'mandala-stand', className: 'mandala-1' },
      { x: window.innerWidth - 180, y: 300, width: 40, height: 60, type: 'mandala-stand', className: 'mandala-2' }
    ];

    // 충돌 없는 오브젝트들 (의자 - className만 적용)
    const nonCollisionObjects = [
      // 테이블 1 주변 의자
      { x: 370, y: 170, width: 30, height: 30, type: 'chair', className: 'chair-1-1' },
      { x: 500, y: 170, width: 30, height: 30, type: 'chair', className: 'chair-1-2' },
      { x: 435, y: 120, width: 30, height: 30, type: 'chair', className: 'chair-1-3' },
      { x: 435, y: 250, width: 30, height: 30, type: 'chair', className: 'chair-1-4' },

      // 테이블 2 주변 의자
      { x: 570, y: 170, width: 30, height: 30, type: 'chair', className: 'chair-2-1' },
      { x: 700, y: 170, width: 30, height: 30, type: 'chair', className: 'chair-2-2' },
      { x: 635, y: 120, width: 30, height: 30, type: 'chair', className: 'chair-2-3' },
      { x: 635, y: 250, width: 30, height: 30, type: 'chair', className: 'chair-2-4' },

      // 테이블 3 주변 의자
      { x: 370, y: 370, width: 30, height: 30, type: 'chair', className: 'chair-3-1' },
      { x: 500, y: 370, width: 30, height: 30, type: 'chair', className: 'chair-3-2' },
      { x: 435, y: 320, width: 30, height: 30, type: 'chair', className: 'chair-3-3' },
      { x: 435, y: 450, width: 30, height: 30, type: 'chair', className: 'chair-3-4' },

      // 테이블 4 주변 의자
      { x: 570, y: 370, width: 30, height: 30, type: 'chair', className: 'chair-4-1' },
      { x: 700, y: 370, width: 30, height: 30, type: 'chair', className: 'chair-4-2' },
      { x: 635, y: 320, width: 30, height: 30, type: 'chair', className: 'chair-4-3' },
      { x: 635, y: 450, width: 30, height: 30, type: 'chair', className: 'chair-4-4' }
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

        // 즉각적인 반응 (가속도 제거)
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
      // 메인 바닥 (대리석 효과)
      const gradient = ctx.createRadialGradient(
        canvas.width / 2, canvas.height / 2, 0,
        canvas.width / 2, canvas.height / 2, canvas.width * 0.7
      );
      gradient.addColorStop(0, '#FFF8DC');
      gradient.addColorStop(0.5, '#FFE4B5');
      gradient.addColorStop(1, '#F4A460');
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // 화려한 타일 패턴
      ctx.strokeStyle = 'rgba(218, 165, 32, 0.3)';
      ctx.lineWidth = 1;
      const tileSize = 60;
      for (let x = 0; x < canvas.width; x += tileSize) {
        for (let y = 0; y < canvas.height; y += tileSize) {
          // 다이아몬드 패턴
          ctx.beginPath();
          ctx.moveTo(x + tileSize / 2, y);
          ctx.lineTo(x + tileSize, y + tileSize / 2);
          ctx.lineTo(x + tileSize / 2, y + tileSize);
          ctx.lineTo(x, y + tileSize / 2);
          ctx.closePath();
          ctx.stroke();

          // 중앙 점
          ctx.fillStyle = 'rgba(218, 165, 32, 0.5)';
          ctx.beginPath();
          ctx.arc(x + tileSize / 2, y + tileSize / 2, 3, 0, Math.PI * 2);
          ctx.fill();
        }
      }
    };

    const drawKitchen = (obj) => {
      const { x, y, width, height } = obj;

      // 주방 그림자
      ctx.fillStyle = 'rgba(0, 0, 0, 0.2)';
      ctx.fillRect(x + 5, y + 5, width, height);

      // 주방 배경 (스테인리스 스틸 느낌)
      const kitchenGradient = ctx.createLinearGradient(x, y, x + width, y);
      kitchenGradient.addColorStop(0, '#C0C0C0');
      kitchenGradient.addColorStop(0.5, '#D3D3D3');
      kitchenGradient.addColorStop(1, '#C0C0C0');
      ctx.fillStyle = kitchenGradient;
      ctx.fillRect(x, y, width, height);

      // 주방 테두리
      ctx.strokeStyle = '#696969';
      ctx.lineWidth = 4;
      ctx.strokeRect(x, y, width, height);

      // 조리대 (위쪽)
      ctx.fillStyle = '#A9A9A9';
      ctx.fillRect(x + 10, y + 10, width - 20, 40);

      // 가스레인지 (아래쪽)
      ctx.fillStyle = '#000000';
      ctx.fillRect(x + 20, y + 70, 60, 60);

      // 버너들
      ctx.fillStyle = '#FF4500';
      ctx.beginPath();
      ctx.arc(x + 35, y + 85, 8, 0, Math.PI * 2);
      ctx.fill();
      ctx.beginPath();
      ctx.arc(x + 65, y + 85, 8, 0, Math.PI * 2);
      ctx.fill();
      ctx.beginPath();
      ctx.arc(x + 35, y + 115, 8, 0, Math.PI * 2);
      ctx.fill();
      ctx.beginPath();
      ctx.arc(x + 65, y + 115, 8, 0, Math.PI * 2);
      ctx.fill();

      // 주방 라벨
      ctx.fillStyle = '#FFD700';
      ctx.font = 'bold 16px Arial';
      ctx.fillText('KITCHEN', x + 100, y + 90);
    };

    const drawTable = (obj) => {
      const { x, y, width, height } = obj;

      // 테이블 그림자
      ctx.fillStyle = 'rgba(0, 0, 0, 0.2)';
      ctx.fillRect(x + 5, y + 5, width, height);

      // 테이블 상판 (나무 느낌)
      const tableGradient = ctx.createLinearGradient(x, y, x + width, y + height);
      tableGradient.addColorStop(0, '#8B4513');
      tableGradient.addColorStop(0.5, '#A0522D');
      tableGradient.addColorStop(1, '#8B4513');
      ctx.fillStyle = tableGradient;
      ctx.fillRect(x, y, width, height);

      // 테이블 테두리
      ctx.strokeStyle = '#654321';
      ctx.lineWidth = 3;
      ctx.strokeRect(x, y, width, height);

      // 나무 결 패턴
      ctx.strokeStyle = 'rgba(101, 67, 33, 0.3)';
      ctx.lineWidth = 2;
      for (let i = 0; i < 5; i++) {
        ctx.beginPath();
        ctx.moveTo(x + 10, y + 20 + i * 15);
        ctx.lineTo(x + width - 10, y + 20 + i * 15);
        ctx.stroke();
      }
    };

    const drawChair = (obj) => {
      const { x, y, width, height } = obj;

      // 의자 등받이
      const chairGradient = ctx.createLinearGradient(x, y, x + width, y);
      chairGradient.addColorStop(0, '#8B4513');
      chairGradient.addColorStop(0.5, '#A0522D');
      chairGradient.addColorStop(1, '#8B4513');
      ctx.fillStyle = chairGradient;
      ctx.fillRect(x + 5, y, width - 10, 10);

      // 의자 좌석
      ctx.fillRect(x, y + 10, width, height - 10);

      // 의자 테두리
      ctx.strokeStyle = '#654321';
      ctx.lineWidth = 2;
      ctx.strokeRect(x, y + 10, width, height - 10);
    };

    const drawElephant = (obj) => {
      const { x, y, width, height } = obj;

      // 그림자
      ctx.fillStyle = 'rgba(0, 0, 0, 0.2)';
      ctx.fillRect(x + 5, y + 5, width, height);

      // 코끼리 몸체
      const elephantGradient = ctx.createLinearGradient(x, y, x + width, y + height);
      elephantGradient.addColorStop(0, '#B8860B');
      elephantGradient.addColorStop(0.5, '#DAA520');
      elephantGradient.addColorStop(1, '#B8860B');
      ctx.fillStyle = elephantGradient;
      ctx.fillRect(x, y + height * 0.3, width, height * 0.7);

      // 코끼리 머리
      ctx.beginPath();
      ctx.arc(x + width / 2, y + height * 0.3, width * 0.4, 0, Math.PI * 2);
      ctx.fill();

      // 코 (trunk)
      ctx.fillStyle = '#B8860B';
      ctx.fillRect(x + width / 2 - 8, y + height * 0.3, 16, height * 0.5);

      // 상아 장식
      ctx.fillStyle = '#FFFACD';
      ctx.fillRect(x + width * 0.2, y + height * 0.4, 8, 25);
      ctx.fillRect(x + width * 0.7, y + height * 0.4, 8, 25);

      // 장식 패턴
      ctx.fillStyle = '#FF6347';
      for (let i = 0; i < 3; i++) {
        ctx.fillRect(x + 10, y + height * 0.5 + i * 12, width - 20, 4);
      }

      // 테두리
      ctx.strokeStyle = '#8B4513';
      ctx.lineWidth = 2;
      ctx.strokeRect(x, y + height * 0.3, width, height * 0.7);
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
      incenseGradient.addColorStop(0, '#FFD700');
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
          y
        );
        ctx.stroke();
      }

      // 테두리
      ctx.strokeStyle = '#B8860B';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.arc(x + width / 2, y + height / 2, width * 0.35, 0, Math.PI * 2);
      ctx.stroke();
    };

    const drawVase = (obj) => {
      const { x, y, width, height } = obj;

      // 그림자
      ctx.fillStyle = 'rgba(0, 0, 0, 0.2)';
      ctx.fillRect(x + 5, y + 5, width, height);

      // 화분 몸체
      const vaseGradient = ctx.createLinearGradient(x, y, x + width, y);
      vaseGradient.addColorStop(0, '#DC143C');
      vaseGradient.addColorStop(0.5, '#FF6347');
      vaseGradient.addColorStop(1, '#DC143C');
      ctx.fillStyle = vaseGradient;

      // 화분 모양
      ctx.beginPath();
      ctx.moveTo(x + width * 0.3, y);
      ctx.lineTo(x + width * 0.7, y);
      ctx.lineTo(x + width, y + height);
      ctx.lineTo(x, y + height);
      ctx.closePath();
      ctx.fill();

      // 금색 장식 패턴
      ctx.fillStyle = '#FFD700';
      for (let i = 0; i < 4; i++) {
        ctx.fillRect(x + 10, y + 10 + i * 12, width - 20, 3);
      }

      // 꽃들
      ctx.fillStyle = '#FF1493';
      ctx.beginPath();
      ctx.arc(x + width / 2 - 10, y - 5, 8, 0, Math.PI * 2);
      ctx.fill();
      ctx.beginPath();
      ctx.arc(x + width / 2 + 10, y - 8, 8, 0, Math.PI * 2);
      ctx.fill();
      ctx.beginPath();
      ctx.arc(x + width / 2, y - 12, 8, 0, Math.PI * 2);
      ctx.fill();

      // 테두리
      ctx.strokeStyle = '#8B0000';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(x + width * 0.3, y);
      ctx.lineTo(x + width * 0.7, y);
      ctx.lineTo(x + width, y + height);
      ctx.lineTo(x, y + height);
      ctx.closePath();
      ctx.stroke();
    };

    const drawTandoor = (obj) => {
      const { x, y, width, height } = obj;

      // 그림자
      ctx.fillStyle = 'rgba(0, 0, 0, 0.3)';
      ctx.fillRect(x + 5, y + 5, width, height);

      // 탄두리 오븐 몸체
      const tandoorGradient = ctx.createLinearGradient(x, y, x, y + height);
      tandoorGradient.addColorStop(0, '#8B4513');
      tandoorGradient.addColorStop(0.5, '#A0522D');
      tandoorGradient.addColorStop(1, '#654321');
      ctx.fillStyle = tandoorGradient;

      // 원통형 모양
      ctx.fillRect(x, y + 10, width, height - 10);
      ctx.beginPath();
      ctx.ellipse(x + width / 2, y + 10, width / 2, 10, 0, 0, Math.PI * 2);
      ctx.fill();

      // 오븐 입구
      ctx.fillStyle = '#000000';
      ctx.fillRect(x + width * 0.25, y + height * 0.4, width * 0.5, height * 0.3);

      // 불꽃 효과
      ctx.fillStyle = '#FF4500';
      ctx.beginPath();
      ctx.moveTo(x + width / 2, y + height * 0.5);
      ctx.lineTo(x + width / 2 - 8, y + height * 0.65);
      ctx.lineTo(x + width / 2 + 8, y + height * 0.65);
      ctx.closePath();
      ctx.fill();

      ctx.fillStyle = '#FFD700';
      ctx.beginPath();
      ctx.arc(x + width / 2, y + height * 0.55, 5, 0, Math.PI * 2);
      ctx.fill();

      // 테두리
      ctx.strokeStyle = '#654321';
      ctx.lineWidth = 3;
      ctx.strokeRect(x, y + 10, width, height - 10);

      // 라벨
      ctx.fillStyle = '#FFD700';
      ctx.font = 'bold 10px Arial';
      ctx.textAlign = 'center';
      ctx.fillText('TANDOOR', x + width / 2, y + height - 5);
    };

    const drawMandalaStand = (obj) => {
      const { x, y, width, height } = obj;

      // 스탠드 기둥
      ctx.fillStyle = '#8B4513';
      ctx.fillRect(x + width / 2 - 5, y + 30, 10, height - 30);

      // 만다라 원반
      const mandalaGradient = ctx.createRadialGradient(
        x + width / 2, y + 20, 5,
        x + width / 2, y + 20, 20
      );
      mandalaGradient.addColorStop(0, '#FFD700');
      mandalaGradient.addColorStop(0.5, '#FF6347');
      mandalaGradient.addColorStop(1, '#9370DB');
      ctx.fillStyle = mandalaGradient;
      ctx.beginPath();
      ctx.arc(x + width / 2, y + 20, 20, 0, Math.PI * 2);
      ctx.fill();

      // 만다라 패턴
      ctx.strokeStyle = '#FFFFFF';
      ctx.lineWidth = 1.5;
      for (let i = 0; i < 8; i++) {
        const angle = (Math.PI * 2 * i) / 8;
        ctx.beginPath();
        ctx.moveTo(x + width / 2, y + 20);
        ctx.lineTo(
          x + width / 2 + Math.cos(angle) * 20,
          y + 20 + Math.sin(angle) * 20
        );
        ctx.stroke();
      }

      // 중앙 원
      ctx.fillStyle = '#FFD700';
      ctx.beginPath();
      ctx.arc(x + width / 2, y + 20, 5, 0, Math.PI * 2);
      ctx.fill();

      // 받침
      ctx.fillStyle = '#654321';
      ctx.fillRect(x, y + height - 10, width, 10);
    };

    const drawWall = (obj) => {
      const { x, y, width, height } = obj;

      // 화려한 벽 그라디언트
      const wallGradient = ctx.createLinearGradient(x, y, x, y + height);
      wallGradient.addColorStop(0, '#DC143C');
      wallGradient.addColorStop(0.5, '#FF6347');
      wallGradient.addColorStop(1, '#DC143C');
      ctx.fillStyle = wallGradient;
      ctx.fillRect(x, y, width, height);

      // 금색 테두리
      ctx.strokeStyle = '#FFD700';
      ctx.lineWidth = 4;
      ctx.strokeRect(x, y, width, height);

      // 만다라 패턴
      ctx.fillStyle = 'rgba(255, 215, 0, 0.3)';
      const patternSpacing = 40;
      for (let i = x + 20; i < x + width; i += patternSpacing) {
        for (let j = y + 20; j < y + height; j += patternSpacing) {
          ctx.beginPath();
          ctx.arc(i, j, 8, 0, Math.PI * 2);
          ctx.fill();
          ctx.strokeStyle = '#FFD700';
          ctx.lineWidth = 1;
          ctx.stroke();
        }
      }
    };

    const drawEntrance = () => {
      const { x, y, width, height } = entranceArea;

      // 입구 바닥 (카펫 효과)
      const carpetGradient = ctx.createLinearGradient(x, y, x + width, y);
      carpetGradient.addColorStop(0, '#8B0000');
      carpetGradient.addColorStop(0.5, '#DC143C');
      carpetGradient.addColorStop(1, '#8B0000');
      ctx.fillStyle = carpetGradient;
      ctx.fillRect(x, y, width, height);

      // 카펫 패턴
      ctx.strokeStyle = '#FFD700';
      ctx.lineWidth = 2;
      ctx.strokeRect(x + 5, y + 5, width - 10, height - 10);
      ctx.strokeRect(x + 10, y + 10, width - 20, height - 20);

      // 입구 표시
      ctx.fillStyle = '#FFD700';
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

      // 배경 그리기
      drawBackground();

      // 입구 카펫 그리기
      drawEntrance();

      // 벽 그리기
      collisionObjects.filter(obj => obj.type === 'wall').forEach(drawWall);

      // 주방 그리기
      collisionObjects.filter(obj => obj.type === 'kitchen').forEach(drawKitchen);

      // 테이블 그리기
      collisionObjects.filter(obj => obj.type === 'table').forEach(drawTable);

      // 인도 장식물들 그리기
      collisionObjects.filter(obj => obj.type === 'elephant').forEach(drawElephant);
      collisionObjects.filter(obj => obj.type === 'incense').forEach(drawIncense);
      collisionObjects.filter(obj => obj.type === 'vase').forEach(drawVase);
      collisionObjects.filter(obj => obj.type === 'tandoor').forEach(drawTandoor);
      collisionObjects.filter(obj => obj.type === 'mandala-stand').forEach(drawMandalaStand);

      // 의자 그리기 (충돌 없음)
      nonCollisionObjects.filter(obj => obj.type === 'chair').forEach(drawChair);

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
    <div className="indian-restaurant-page">
      <canvas ref={canvasRef} />
      <div className="restaurant-info">
        <h2>🇮🇳 인도 레스토랑</h2>
      </div>
      <div className="restaurant-exit-button-container">
        <button onClick={onExit} className="exit-button">
          🚪 레스토랑 나가기
        </button>
      </div>
    </div>
  );
};

export default IndianRestaurantPage;
