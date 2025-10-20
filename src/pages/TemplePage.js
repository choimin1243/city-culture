import React, { useEffect, useRef } from 'react';
import './TemplePage.css';

const TemplePage = ({ onExit }) => {
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

      // 중앙 불상 제단
      { x: window.innerWidth / 2 - 150, y: 100, width: 300, height: 220, type: 'buddha-altar', className: 'buddha-altar' },

      // 양쪽 붉은 기둥들
      { x: 200, y: 100, width: 50, height: 300, type: 'pillar', className: 'pillar-left-1' },
      { x: window.innerWidth - 250, y: 100, width: 50, height: 300, type: 'pillar', className: 'pillar-right-1' },

      // 연등들
      { x: 150, y: 180, width: 50, height: 70, type: 'lantern', className: 'lantern-1' },
      { x: window.innerWidth - 200, y: 180, width: 50, height: 70, type: 'lantern', className: 'lantern-2' },
      { x: 280, y: 320, width: 50, height: 70, type: 'lantern', className: 'lantern-3' },
      { x: window.innerWidth - 330, y: 320, width: 50, height: 70, type: 'lantern', className: 'lantern-4' },

      // 향로들
      { x: window.innerWidth / 2 - 80, y: 350, width: 60, height: 60, type: 'incense', className: 'incense-1' },
      { x: window.innerWidth / 2 + 20, y: 350, width: 60, height: 60, type: 'incense', className: 'incense-2' },

      // 목탁들
      { x: window.innerWidth / 2 - 250, y: 250, width: 60, height: 60, type: 'wooden-fish', className: 'wooden-fish-1' },
      { x: window.innerWidth / 2 + 190, y: 250, width: 60, height: 60, type: 'wooden-fish', className: 'wooden-fish-2' },

      // 절 매트들 (붉은색)
      { x: 300, y: window.innerHeight / 2 + 50, width: 100, height: 80, type: 'prayer-mat', className: 'mat-1' },
      { x: 500, y: window.innerHeight / 2 + 50, width: 100, height: 80, type: 'prayer-mat', className: 'mat-2' },
      { x: window.innerWidth - 400, y: window.innerHeight / 2 + 50, width: 100, height: 80, type: 'prayer-mat', className: 'mat-3' },
      { x: window.innerWidth - 600, y: window.innerHeight / 2 + 50, width: 100, height: 80, type: 'prayer-mat', className: 'mat-4' },
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
      // 바닥 (나무 마룻바닥 느낌)
      const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
      gradient.addColorStop(0, '#8B7355');
      gradient.addColorStop(0.5, '#A0826D');
      gradient.addColorStop(1, '#8B7355');
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // 나무 마룻바닥 패턴
      ctx.strokeStyle = 'rgba(101, 67, 33, 0.3)';
      ctx.lineWidth = 2;
      const plankHeight = 60;
      for (let y = 0; y < canvas.height; y += plankHeight) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(canvas.width, y);
        ctx.stroke();

        // 나무 결 효과
        for (let x = 100; x < canvas.width; x += 200) {
          ctx.strokeStyle = 'rgba(101, 67, 33, 0.2)';
          ctx.lineWidth = 1;
          ctx.beginPath();
          ctx.moveTo(x, y);
          ctx.lineTo(x, y + plankHeight);
          ctx.stroke();
        }
      }
    };

    const drawBuddhaAltar = (obj) => {
      const { x, y, width, height } = obj;

      // 그림자
      ctx.fillStyle = 'rgba(0, 0, 0, 0.3)';
      ctx.fillRect(x + 5, y + 5, width, height);

      // 제단 기단 (금색 장식)
      const altarGradient = ctx.createLinearGradient(x, y + height - 60, x, y + height);
      altarGradient.addColorStop(0, '#DAA520');
      altarGradient.addColorStop(0.5, '#FFD700');
      altarGradient.addColorStop(1, '#DAA520');
      ctx.fillStyle = altarGradient;
      ctx.fillRect(x, y + height - 60, width, 60);

      // 제단 뒷배경 (붉은색)
      const bgGradient = ctx.createLinearGradient(x, y, x, y + height - 60);
      bgGradient.addColorStop(0, '#8B0000');
      bgGradient.addColorStop(0.5, '#DC143C');
      bgGradient.addColorStop(1, '#8B0000');
      ctx.fillStyle = bgGradient;
      ctx.fillRect(x + 10, y, width - 20, height - 60);

      // 불상 (금색)
      const buddhaGradient = ctx.createRadialGradient(
        x + width / 2, y + 60, 10,
        x + width / 2, y + 60, 50
      );
      buddhaGradient.addColorStop(0, '#FFD700');
      buddhaGradient.addColorStop(1, '#DAA520');
      ctx.fillStyle = buddhaGradient;

      // 불상 몸체
      ctx.beginPath();
      ctx.arc(x + width / 2, y + 80, 40, 0, Math.PI * 2);
      ctx.fill();

      // 불상 머리
      ctx.beginPath();
      ctx.arc(x + width / 2, y + 40, 30, 0, Math.PI * 2);
      ctx.fill();

      // 광배 (후광)
      ctx.strokeStyle = '#FFD700';
      ctx.lineWidth = 4;
      ctx.beginPath();
      ctx.arc(x + width / 2, y + 60, 65, 0, Math.PI * 2);
      ctx.stroke();

      // 연꽃 받침
      ctx.fillStyle = '#FF69B4';
      for (let i = 0; i < 8; i++) {
        const angle = (Math.PI * 2 * i) / 8;
        ctx.beginPath();
        ctx.ellipse(
          x + width / 2 + Math.cos(angle) * 30,
          y + 130,
          15, 8, angle, 0, Math.PI * 2
        );
        ctx.fill();
      }

      // 공양 촛불들 (양쪽)
      ctx.fillStyle = '#DC143C';
      ctx.fillRect(x + 30, y + height - 110, 15, 45);
      ctx.fillRect(x + width - 45, y + height - 110, 15, 45);

      // 촛불 불꽃
      ctx.fillStyle = '#FF4500';
      ctx.beginPath();
      ctx.moveTo(x + 37.5, y + height - 110);
      ctx.lineTo(x + 32.5, y + height - 120);
      ctx.lineTo(x + 42.5, y + height - 120);
      ctx.closePath();
      ctx.fill();

      ctx.beginPath();
      ctx.moveTo(x + width - 37.5, y + height - 110);
      ctx.lineTo(x + width - 42.5, y + height - 120);
      ctx.lineTo(x + width - 32.5, y + height - 120);
      ctx.closePath();
      ctx.fill();

      // 제단 테두리 (금색)
      ctx.strokeStyle = '#FFD700';
      ctx.lineWidth = 4;
      ctx.strokeRect(x + 10, y, width - 20, height - 60);
      ctx.strokeRect(x, y + height - 60, width, 60);
    };

    const drawPillar = (obj) => {
      const { x, y, width, height } = obj;

      // 그림자
      ctx.fillStyle = 'rgba(0, 0, 0, 0.2)';
      ctx.fillRect(x + 5, y + 5, width, height);

      // 기둥 몸체 (붉은색)
      const pillarGradient = ctx.createLinearGradient(x, y, x + width, y);
      pillarGradient.addColorStop(0, '#8B0000');
      pillarGradient.addColorStop(0.5, '#DC143C');
      pillarGradient.addColorStop(1, '#8B0000');
      ctx.fillStyle = pillarGradient;
      ctx.fillRect(x, y, width, height);

      // 기둥 장식 띠들 (금색)
      ctx.fillStyle = '#FFD700';
      ctx.fillRect(x, y + 20, width, 10);
      ctx.fillRect(x, y + height / 2 - 5, width, 10);
      ctx.fillRect(x, y + height - 30, width, 10);

      // 용 문양 (간단한 S자형)
      ctx.strokeStyle = '#FFD700';
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.moveTo(x + width / 2, y + 60);
      ctx.quadraticCurveTo(x + width, y + 100, x + width / 2, y + 140);
      ctx.quadraticCurveTo(x, y + 180, x + width / 2, y + 220);
      ctx.stroke();

      // 테두리
      ctx.strokeStyle = '#654321';
      ctx.lineWidth = 2;
      ctx.strokeRect(x, y, width, height);
    };

    const drawLantern = (obj) => {
      const { x, y, width, height } = obj;

      // 연등 고리
      ctx.strokeStyle = '#FFD700';
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.arc(x + width / 2, y, 8, 0, Math.PI, true);
      ctx.stroke();

      // 연등 윗부분 (지붕)
      const topGradient = ctx.createLinearGradient(x, y + 5, x + width, y + 5);
      topGradient.addColorStop(0, '#8B0000');
      topGradient.addColorStop(0.5, '#DC143C');
      topGradient.addColorStop(1, '#8B0000');
      ctx.fillStyle = topGradient;
      ctx.beginPath();
      ctx.moveTo(x + width / 2, y + 5);
      ctx.lineTo(x, y + 15);
      ctx.lineTo(x + width, y + 15);
      ctx.closePath();
      ctx.fill();

      // 연등 몸체 (빨간 천)
      const lanternGradient = ctx.createRadialGradient(
        x + width / 2, y + height / 2, 5,
        x + width / 2, y + height / 2, width / 2
      );
      lanternGradient.addColorStop(0, '#FFD700');
      lanternGradient.addColorStop(0.3, '#FFA500');
      lanternGradient.addColorStop(1, '#FF4500');
      ctx.fillStyle = lanternGradient;
      ctx.beginPath();
      ctx.ellipse(x + width / 2, y + height / 2, width / 2, height * 0.4, 0, 0, Math.PI * 2);
      ctx.fill();

      // 연등 세로줄
      ctx.strokeStyle = '#8B0000';
      ctx.lineWidth = 2;
      for (let i = 0; i < 6; i++) {
        const angle = (Math.PI * 2 * i) / 6;
        ctx.beginPath();
        ctx.moveTo(x + width / 2 + Math.cos(angle) * width / 2, y + 15);
        ctx.lineTo(x + width / 2 + Math.cos(angle) * width / 2, y + height - 10);
        ctx.stroke();
      }

      // 연등 아래 장식
      ctx.fillStyle = '#FFD700';
      ctx.beginPath();
      ctx.moveTo(x + width / 2, y + height);
      ctx.lineTo(x + width / 2 - 8, y + height - 10);
      ctx.lineTo(x + width / 2 + 8, y + height - 10);
      ctx.closePath();
      ctx.fill();
    };

    const drawIncense = (obj) => {
      const { x, y, width, height } = obj;

      // 향로 받침 (동색)
      ctx.fillStyle = '#B8860B';
      ctx.fillRect(x + width * 0.15, y + height - 15, width * 0.7, 15);

      // 향로 몸체 (청동 느낌)
      const incenseGradient = ctx.createRadialGradient(
        x + width / 2, y + height / 2, width * 0.1,
        x + width / 2, y + height / 2, width * 0.45
      );
      incenseGradient.addColorStop(0, '#B8860B');
      incenseGradient.addColorStop(0.5, '#DAA520');
      incenseGradient.addColorStop(1, '#8B6914');
      ctx.fillStyle = incenseGradient;
      ctx.beginPath();
      ctx.arc(x + width / 2, y + height / 2 + 5, width * 0.4, 0, Math.PI * 2);
      ctx.fill();

      // 향로 뚜껑 (용 문양)
      ctx.fillStyle = '#8B6914';
      ctx.beginPath();
      ctx.arc(x + width / 2, y + height * 0.3, width * 0.3, 0, Math.PI, true);
      ctx.fill();

      // 향 (여러 개의 향)
      ctx.fillStyle = '#654321';
      ctx.fillRect(x + width / 2 - 8, y + 5, 3, height * 0.3);
      ctx.fillRect(x + width / 2 - 2, y + 8, 3, height * 0.28);
      ctx.fillRect(x + width / 2 + 4, y + 7, 3, height * 0.29);

      // 향 연기 효과
      ctx.strokeStyle = 'rgba(169, 169, 169, 0.7)';
      ctx.lineWidth = 2;
      for (let i = 0; i < 3; i++) {
        ctx.beginPath();
        ctx.moveTo(x + width / 2 + (i - 1) * 6, y + 10);
        ctx.quadraticCurveTo(
          x + width / 2 + (i % 2 === 0 ? 15 : -15),
          y - 10,
          x + width / 2 + (i - 1) * 3,
          y - 30
        );
        ctx.stroke();
      }

      // 테두리
      ctx.strokeStyle = '#654321';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.arc(x + width / 2, y + height / 2 + 5, width * 0.4, 0, Math.PI * 2);
      ctx.stroke();
    };

    const drawWoodenFish = (obj) => {
      const { x, y, width, height } = obj;

      // 그림자
      ctx.fillStyle = 'rgba(0, 0, 0, 0.2)';
      ctx.fillRect(x + 3, y + 3, width, height);

      // 목탁 받침
      ctx.fillStyle = '#654321';
      ctx.fillRect(x + width * 0.2, y + height - 12, width * 0.6, 12);

      // 목탁 몸체 (물고기 모양)
      const fishGradient = ctx.createRadialGradient(
        x + width / 2, y + height / 2, width * 0.1,
        x + width / 2, y + height / 2, width * 0.4
      );
      fishGradient.addColorStop(0, '#D2691E');
      fishGradient.addColorStop(0.5, '#A0522D');
      fishGradient.addColorStop(1, '#8B4513');
      ctx.fillStyle = fishGradient;
      ctx.beginPath();
      ctx.ellipse(x + width / 2, y + height / 2, width * 0.4, height * 0.35, 0, 0, Math.PI * 2);
      ctx.fill();

      // 목탁 입 (홈)
      ctx.fillStyle = '#654321';
      ctx.beginPath();
      ctx.ellipse(x + width / 2, y + height / 2 + 5, width * 0.25, height * 0.15, 0, 0, Math.PI);
      ctx.fill();

      // 물고기 비늘 무늬
      ctx.strokeStyle = '#654321';
      ctx.lineWidth = 1.5;
      for (let i = 0; i < 3; i++) {
        for (let j = 0; j < 2; j++) {
          ctx.beginPath();
          ctx.arc(
            x + width / 2 - 10 + i * 10,
            y + height / 2 - 8 + j * 12,
            4, 0, Math.PI * 2
          );
          ctx.stroke();
        }
      }

      // 목탁채
      ctx.fillStyle = '#8B4513';
      ctx.fillRect(x + width - 12, y + height / 2 - 3, 25, 6);
      ctx.beginPath();
      ctx.arc(x + width + 13, y + height / 2, 8, 0, Math.PI * 2);
      ctx.fill();

      // 테두리
      ctx.strokeStyle = '#654321';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.ellipse(x + width / 2, y + height / 2, width * 0.4, height * 0.35, 0, 0, Math.PI * 2);
      ctx.stroke();
    };

    const drawPrayerMat = (obj) => {
      const { x, y, width, height } = obj;

      // 그림자
      ctx.fillStyle = 'rgba(0, 0, 0, 0.2)';
      ctx.fillRect(x + 3, y + 3, width, height);

      // 매트 본체
      const matGradient = ctx.createLinearGradient(x, y, x + width, y);
      matGradient.addColorStop(0, '#8B0000');
      matGradient.addColorStop(0.5, '#B22222');
      matGradient.addColorStop(1, '#8B0000');
      ctx.fillStyle = matGradient;
      ctx.fillRect(x, y, width, height);

      // 매트 패턴
      ctx.strokeStyle = '#FFD700';
      ctx.lineWidth = 2;
      ctx.strokeRect(x + 5, y + 5, width - 10, height - 10);

      // 중앙 장식
      ctx.fillStyle = '#FFD700';
      ctx.beginPath();
      ctx.arc(x + width / 2, y + height / 2, 8, 0, Math.PI * 2);
      ctx.fill();

      // 테두리
      ctx.strokeStyle = '#654321';
      ctx.lineWidth = 3;
      ctx.strokeRect(x, y, width, height);
    };

    const drawWall = (obj) => {
      const { x, y, width, height } = obj;

      // 벽 그라디언트 (붉은 주황색)
      const wallGradient = ctx.createLinearGradient(x, y, x, y + height);
      wallGradient.addColorStop(0, '#8B4513');
      wallGradient.addColorStop(0.5, '#A0522D');
      wallGradient.addColorStop(1, '#8B4513');
      ctx.fillStyle = wallGradient;
      ctx.fillRect(x, y, width, height);

      // 테두리 (금색)
      ctx.strokeStyle = '#DAA520';
      ctx.lineWidth = 4;
      ctx.strokeRect(x, y, width, height);

      // 벽 패턴 (연꽃 문양)
      ctx.fillStyle = 'rgba(218, 165, 32, 0.3)';
      const patternSpacing = 60;
      for (let i = x + 30; i < x + width; i += patternSpacing) {
        for (let j = y + 30; j < y + height; j += patternSpacing) {
          // 연꽃 꽃잎
          for (let k = 0; k < 8; k++) {
            const angle = (Math.PI * 2 * k) / 8;
            ctx.beginPath();
            ctx.ellipse(
              i + Math.cos(angle) * 8,
              j + Math.sin(angle) * 8,
              6, 3, angle, 0, Math.PI * 2
            );
            ctx.fill();
          }
          // 연꽃 중심
          ctx.fillStyle = '#FFD700';
          ctx.beginPath();
          ctx.arc(i, j, 4, 0, Math.PI * 2);
          ctx.fill();
          ctx.fillStyle = 'rgba(218, 165, 32, 0.3)';
        }
      }
    };

    const drawEntrance = () => {
      const { x, y, width, height } = entranceArea;

      // 입구 바닥
      const entranceGradient = ctx.createLinearGradient(x, y, x + width, y);
      entranceGradient.addColorStop(0, '#654321');
      entranceGradient.addColorStop(0.5, '#8B4513');
      entranceGradient.addColorStop(1, '#654321');
      ctx.fillStyle = entranceGradient;
      ctx.fillRect(x, y, width, height);

      // 입구 테두리
      ctx.strokeStyle = '#FFD700';
      ctx.lineWidth = 3;
      ctx.strokeRect(x + 5, y + 5, width - 10, height - 10);

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

      // 입구 그리기
      drawEntrance();

      // 벽 그리기
      collisionObjects.filter(obj => obj.type === 'wall').forEach(drawWall);

      // 불상 제단 그리기
      collisionObjects.filter(obj => obj.type === 'buddha-altar').forEach(drawBuddhaAltar);

      // 기둥 그리기
      collisionObjects.filter(obj => obj.type === 'pillar').forEach(drawPillar);

      // 연등 그리기
      collisionObjects.filter(obj => obj.type === 'lantern').forEach(drawLantern);

      // 향로 그리기
      collisionObjects.filter(obj => obj.type === 'incense').forEach(drawIncense);

      // 목탁 그리기
      collisionObjects.filter(obj => obj.type === 'wooden-fish').forEach(drawWoodenFish);

      // 기도 매트 그리기
      collisionObjects.filter(obj => obj.type === 'prayer-mat').forEach(drawPrayerMat);

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
    <div className="temple-page">
      <canvas ref={canvasRef} />
      <div className="temple-info">
        <h2>🏯 불교 사찰</h2>
      </div>
      <div className="temple-exit-button-container">
        <button onClick={onExit} className="exit-button">
          🚪 사원 나가기
        </button>
      </div>
    </div>
  );
};

export default TemplePage;
