import React, { useEffect, useRef } from 'react';
import './ParkPage.css';

const ParkPage = ({ onExit, poopCount, setPoopCount }) => {
  const canvasRef = useRef(null);
  const characterRef = useRef(null);
  const poopsRef = useRef([]);
  const characterPositionRef = useRef({ x: null, y: null });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    // 공원에 들어올 때 한 번만 똥 생성 (15-25개)
    if (poopsRef.current.length === 0) {
      const poopArray = [];
      const poopCount = 15 + Math.floor(Math.random() * 11); // 15-25개

      for (let i = 0; i < poopCount; i++) {
        // 안전한 영역에만 생성 (벽, 강, 우물 피하기)
        let x, y;
        let attempts = 0;
        do {
          x = 100 + Math.random() * (window.innerWidth - 200);
          y = 100 + Math.random() * (window.innerHeight - 200);
          attempts++;
        } while (attempts < 50 && (
          // 강 영역 피하기 (대략적으로)
          (x > window.innerWidth * 0.25 && x < window.innerWidth * 0.35 && y < window.innerHeight * 0.45) ||
          (x > window.innerWidth * 0.25 && x < window.innerWidth * 0.35 && y > window.innerHeight * 0.55) ||
          // 우물 영역 피하기
          (x > window.innerWidth * 0.6 && x < window.innerWidth * 0.7 && y > window.innerHeight * 0.4 && y < window.innerHeight * 0.6)
        ));

        poopArray.push({
          id: i,
          x: x,
          y: y,
          width: 30,
          height: 30,
          collected: false
        });
      }
      poopsRef.current = poopArray;
    }

    // 강 세그먼트 계산 (대각선으로 흐르는 강)
    const riverWidth = 120;
    const riverSegments = [];
    const bridgeY = window.innerHeight / 2;
    const bridgeWidth = 150;
    const bridgeHeight = riverWidth + 20;

    // 강을 여러 세그먼트로 나눔 (다리 부분 제외)
    for (let y = 0; y < window.innerHeight; y += 50) {
      const x = window.innerWidth * 0.3 + Math.sin(y / 100) * 30; // 곡선 효과

      // 다리 위치는 제외
      if (y < bridgeY - bridgeHeight / 2 || y > bridgeY + bridgeHeight / 2) {
        riverSegments.push({
          x: x - riverWidth / 2,
          y: y,
          width: riverWidth,
          height: 50,
          type: 'river',
          className: `river-segment-${riverSegments.length}`
        });
      }
    }

    // 충돌 가능한 오브젝트들
    const collisionObjects = [
      // 벽들
      { x: 0, y: 0, width: window.innerWidth, height: 60, type: 'wall', className: 'wall-top' },
      { x: 0, y: 0, width: 60, height: window.innerHeight, type: 'wall', className: 'wall-left' },
      { x: window.innerWidth - 60, y: 0, width: 60, height: window.innerHeight, type: 'wall', className: 'wall-right' },
      { x: 0, y: window.innerHeight - 60, width: window.innerWidth, height: 60, type: 'wall', className: 'wall-bottom' },

      // 강 세그먼트들 (충돌 적용)
      ...riverSegments,

      // 우물 (중앙 오른쪽으로 이동)
      { x: window.innerWidth * 0.65 - 60, y: window.innerHeight / 2 - 60, width: 120, height: 120, type: 'well', className: 'well' },

      // 벤치들 (강 양쪽에 배치)
      { x: 100, y: 150, width: 100, height: 50, type: 'bench', className: 'bench-1' },
      { x: window.innerWidth - 300, y: 150, width: 100, height: 50, type: 'bench', className: 'bench-2' },
      { x: 100, y: window.innerHeight - 200, width: 100, height: 50, type: 'bench', className: 'bench-3' },
      { x: window.innerWidth - 300, y: window.innerHeight - 200, width: 100, height: 50, type: 'bench', className: 'bench-4' },

      // 나무들 (강 양쪽에 배치)
      { x: 80, y: 100, width: 80, height: 100, type: 'tree', className: 'tree-1' },
      { x: window.innerWidth - 230, y: 100, width: 80, height: 100, type: 'tree', className: 'tree-2' },
      { x: 80, y: window.innerHeight - 200, width: 80, height: 100, type: 'tree', className: 'tree-3' },
      { x: window.innerWidth - 230, y: window.innerHeight - 200, width: 80, height: 100, type: 'tree', className: 'tree-4' }
    ];

    // 다리 (충돌 없음 - 지나갈 수 있음)
    const bridge = {
      x: window.innerWidth * 0.3 - bridgeWidth / 2,
      y: bridgeY - bridgeHeight / 2,
      width: bridgeWidth,
      height: bridgeHeight,
      type: 'bridge',
      className: 'bridge'
    };

    // 충돌 없는 오브젝트들 (꽃, 풀 등)
    const nonCollisionObjects = [
      // 꽃들
      { x: 350, y: 200, width: 30, height: 30, type: 'flower', className: 'flower-1' },
      { x: 450, y: 180, width: 30, height: 30, type: 'flower', className: 'flower-2' },
      { x: 550, y: 220, width: 30, height: 30, type: 'flower', className: 'flower-3' },
      { x: window.innerWidth - 450, y: 200, width: 30, height: 30, type: 'flower', className: 'flower-4' },
      { x: window.innerWidth - 350, y: 180, width: 30, height: 30, type: 'flower', className: 'flower-5' },
      { x: 350, y: window.innerHeight - 250, width: 30, height: 30, type: 'flower', className: 'flower-6' },
      { x: 450, y: window.innerHeight - 280, width: 30, height: 30, type: 'flower', className: 'flower-7' }
    ];

    class Character {
      constructor() {
        // 저장된 위치가 있으면 그 위치에서 시작, 없으면 입구에서 시작
        if (characterPositionRef.current.x !== null && characterPositionRef.current.y !== null) {
          this.x = characterPositionRef.current.x;
          this.y = characterPositionRef.current.y;
        } else {
          this.x = window.innerWidth / 2;
          this.y = window.innerHeight - 150;
        }

        this.width = 60;
        this.height = 60;
        this.speed = 8;
        this.velocityX = 0;
        this.velocityY = 0;
        this.direction = 'front';
        this.isMoving = false;
        this.isCollectingPoop = false; // 똥 수집 중 상태

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

      update(poopsArray, onPoopCollected) {
        // 똥 수집 중일 때는 움직임 멈춤
        if (this.isCollectingPoop) {
          this.velocityX = 0;
          this.velocityY = 0;
          this.isMoving = false;
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
          return;
        }

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

        // 똥 수집 체크
        if (poopsArray && onPoopCollected) {
          const characterRect = {
            x: this.x - this.width / 2,
            y: this.y - this.height / 2,
            width: this.width,
            height: this.height
          };

          poopsArray.forEach((poop, index) => {
            if (!poop.collected) {
              const poopRect = {
                x: poop.x,
                y: poop.y,
                width: poop.width,
                height: poop.height
              };

              // 충돌 감지
              if (
                characterRect.x < poopRect.x + poopRect.width &&
                characterRect.x + characterRect.width > poopRect.x &&
                characterRect.y < poopRect.y + poopRect.height &&
                characterRect.y + characterRect.height > poopRect.y
              ) {
                // 똥 수집 시작
                this.isCollectingPoop = true;
                onPoopCollected(poop.id);

                // 0.3초 후에 수집 상태 해제
                setTimeout(() => {
                  this.isCollectingPoop = false;
                }, 300);
              }
            }
          });
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
      // 잔디 배경
      const grassGradient = ctx.createRadialGradient(
        canvas.width / 2, canvas.height / 2, 0,
        canvas.width / 2, canvas.height / 2, canvas.width * 0.8
      );
      grassGradient.addColorStop(0, '#90EE90');
      grassGradient.addColorStop(0.5, '#7FBF7F');
      grassGradient.addColorStop(1, '#6B8E6B');
      ctx.fillStyle = grassGradient;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // 잔디 패턴
      ctx.strokeStyle = 'rgba(34, 139, 34, 0.2)';
      ctx.lineWidth = 2;
      for (let i = 0; i < 100; i++) {
        const x = Math.random() * canvas.width;
        const y = Math.random() * canvas.height;
        ctx.beginPath();
        ctx.moveTo(x, y);
        ctx.lineTo(x + Math.random() * 10 - 5, y - Math.random() * 15);
        ctx.stroke();
      }
    };

    const drawWalkingPath = () => {
      // 산책로 (곡선 경로)
      ctx.fillStyle = '#D2B48C';
      ctx.strokeStyle = '#8B7355';
      ctx.lineWidth = 3;

      // 가로 경로
      ctx.beginPath();
      ctx.ellipse(canvas.width / 2, canvas.height / 2, canvas.width * 0.35, 40, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();

      // 세로 경로
      ctx.beginPath();
      ctx.ellipse(canvas.width / 2, canvas.height / 2, 40, canvas.height * 0.3, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();

      // 자갈 효과
      ctx.fillStyle = 'rgba(139, 115, 85, 0.3)';
      for (let i = 0; i < 200; i++) {
        const angle = Math.random() * Math.PI * 2;
        const distance = Math.random() * canvas.width * 0.35;
        const x = canvas.width / 2 + Math.cos(angle) * distance;
        const y = canvas.height / 2 + Math.sin(angle) * 40;
        ctx.beginPath();
        ctx.arc(x, y, 2, 0, Math.PI * 2);
        ctx.fill();
      }
    };

    const drawWell = (obj) => {
      const { x, y, width, height } = obj;
      const centerX = x + width / 2;
      const centerY = y + height / 2;

      // 그림자
      ctx.fillStyle = 'rgba(0, 0, 0, 0.3)';
      ctx.beginPath();
      ctx.arc(centerX + 5, centerY + 5, width / 2, 0, Math.PI * 2);
      ctx.fill();

      // 우물 외벽 (돌)
      const wellGradient = ctx.createRadialGradient(
        centerX, centerY, width * 0.2,
        centerX, centerY, width / 2
      );
      wellGradient.addColorStop(0, '#A9A9A9');
      wellGradient.addColorStop(0.5, '#808080');
      wellGradient.addColorStop(1, '#696969');
      ctx.fillStyle = wellGradient;
      ctx.beginPath();
      ctx.arc(centerX, centerY, width / 2, 0, Math.PI * 2);
      ctx.fill();

      // 우물 내부 (물)
      const waterGradient = ctx.createRadialGradient(
        centerX, centerY, 0,
        centerX, centerY, width * 0.3
      );
      waterGradient.addColorStop(0, '#4682B4');
      waterGradient.addColorStop(0.7, '#1E90FF');
      waterGradient.addColorStop(1, '#00008B');
      ctx.fillStyle = waterGradient;
      ctx.beginPath();
      ctx.arc(centerX, centerY, width * 0.3, 0, Math.PI * 2);
      ctx.fill();

      // 물 반짝임 효과
      ctx.fillStyle = 'rgba(255, 255, 255, 0.5)';
      ctx.beginPath();
      ctx.arc(centerX - 10, centerY - 10, 8, 0, Math.PI * 2);
      ctx.fill();
      ctx.beginPath();
      ctx.arc(centerX + 15, centerY + 5, 5, 0, Math.PI * 2);
      ctx.fill();

      // 우물 테두리
      ctx.strokeStyle = '#2F4F4F';
      ctx.lineWidth = 4;
      ctx.beginPath();
      ctx.arc(centerX, centerY, width / 2, 0, Math.PI * 2);
      ctx.stroke();

      // 돌 패턴
      ctx.strokeStyle = '#A9A9A9';
      ctx.lineWidth = 2;
      for (let i = 0; i < 12; i++) {
        const angle = (Math.PI * 2 * i) / 12;
        ctx.beginPath();
        ctx.moveTo(centerX, centerY);
        ctx.lineTo(
          centerX + Math.cos(angle) * (width / 2),
          centerY + Math.sin(angle) * (width / 2)
        );
        ctx.stroke();
      }
    };

    const drawBench = (obj) => {
      const { x, y, width, height } = obj;

      // 그림자
      ctx.fillStyle = 'rgba(0, 0, 0, 0.2)';
      ctx.fillRect(x + 5, y + 5, width, height);

      // 벤치 좌석
      const benchGradient = ctx.createLinearGradient(x, y, x + width, y);
      benchGradient.addColorStop(0, '#8B4513');
      benchGradient.addColorStop(0.5, '#A0522D');
      benchGradient.addColorStop(1, '#8B4513');
      ctx.fillStyle = benchGradient;
      ctx.fillRect(x, y + height * 0.5, width, height * 0.3);

      // 벤치 등받이
      ctx.fillRect(x, y, width, height * 0.2);

      // 벤치 다리
      ctx.fillStyle = '#654321';
      ctx.fillRect(x + 10, y + height * 0.8, 8, height * 0.2);
      ctx.fillRect(x + width - 18, y + height * 0.8, 8, height * 0.2);

      // 나무 결 패턴
      ctx.strokeStyle = 'rgba(101, 67, 33, 0.4)';
      ctx.lineWidth = 2;
      for (let i = 0; i < 5; i++) {
        ctx.beginPath();
        ctx.moveTo(x + 5, y + height * 0.5 + i * 8);
        ctx.lineTo(x + width - 5, y + height * 0.5 + i * 8);
        ctx.stroke();
      }

      // 테두리
      ctx.strokeStyle = '#654321';
      ctx.lineWidth = 2;
      ctx.strokeRect(x, y, width, height * 0.2);
      ctx.strokeRect(x, y + height * 0.5, width, height * 0.3);
    };

    const drawTree = (obj) => {
      const { x, y, width, height } = obj;
      const centerX = x + width / 2;

      // 그림자
      ctx.fillStyle = 'rgba(0, 0, 0, 0.2)';
      ctx.beginPath();
      ctx.ellipse(centerX, y + height, width * 0.4, height * 0.1, 0, 0, Math.PI * 2);
      ctx.fill();

      // 나무 줄기
      const trunkGradient = ctx.createLinearGradient(centerX - 15, y, centerX + 15, y);
      trunkGradient.addColorStop(0, '#654321');
      trunkGradient.addColorStop(0.5, '#8B4513');
      trunkGradient.addColorStop(1, '#654321');
      ctx.fillStyle = trunkGradient;
      ctx.fillRect(centerX - 15, y + height * 0.4, 30, height * 0.6);

      // 나무 잎 (3단 원)
      const leafGradient = ctx.createRadialGradient(
        centerX, y + height * 0.3, width * 0.1,
        centerX, y + height * 0.3, width * 0.4
      );
      leafGradient.addColorStop(0, '#90EE90');
      leafGradient.addColorStop(0.5, '#228B22');
      leafGradient.addColorStop(1, '#006400');
      ctx.fillStyle = leafGradient;

      // 하단 잎
      ctx.beginPath();
      ctx.arc(centerX, y + height * 0.5, width * 0.4, 0, Math.PI * 2);
      ctx.fill();

      // 중간 잎
      ctx.beginPath();
      ctx.arc(centerX, y + height * 0.35, width * 0.35, 0, Math.PI * 2);
      ctx.fill();

      // 상단 잎
      ctx.beginPath();
      ctx.arc(centerX, y + height * 0.2, width * 0.25, 0, Math.PI * 2);
      ctx.fill();

      // 잎 하이라이트
      ctx.fillStyle = 'rgba(144, 238, 144, 0.5)';
      ctx.beginPath();
      ctx.arc(centerX - 10, y + height * 0.25, 12, 0, Math.PI * 2);
      ctx.fill();
    };

    const drawFlower = (obj) => {
      const { x, y, width } = obj;
      const centerX = x + width / 2;
      const centerY = y + width / 2;

      // 꽃잎들
      const petalColors = ['#FF69B4', '#FF1493', '#FFB6C1', '#FFC0CB'];
      const petalColor = petalColors[Math.floor(Math.random() * petalColors.length)];

      ctx.fillStyle = petalColor;
      for (let i = 0; i < 6; i++) {
        const angle = (Math.PI * 2 * i) / 6;
        ctx.beginPath();
        ctx.ellipse(
          centerX + Math.cos(angle) * 8,
          centerY + Math.sin(angle) * 8,
          6, 10, angle, 0, Math.PI * 2
        );
        ctx.fill();
      }

      // 꽃 중심
      ctx.fillStyle = '#FFD700';
      ctx.beginPath();
      ctx.arc(centerX, centerY, 5, 0, Math.PI * 2);
      ctx.fill();

      // 줄기
      ctx.strokeStyle = '#228B22';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(centerX, centerY);
      ctx.lineTo(centerX, centerY + 15);
      ctx.stroke();
    };

    const drawRiver = (obj) => {
      const { x, y, width, height } = obj;

      // 물 그라디언트
      const waterGradient = ctx.createLinearGradient(x, y, x + width, y);
      waterGradient.addColorStop(0, '#4682B4');
      waterGradient.addColorStop(0.3, '#5F9EA0');
      waterGradient.addColorStop(0.5, '#87CEEB');
      waterGradient.addColorStop(0.7, '#5F9EA0');
      waterGradient.addColorStop(1, '#4682B4');
      ctx.fillStyle = waterGradient;
      ctx.fillRect(x, y, width, height);

      // 물결 효과 (애니메이션)
      const time = Date.now() / 1000;
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.3)';
      ctx.lineWidth = 2;
      for (let i = 0; i < 3; i++) {
        ctx.beginPath();
        const waveY = y + height / 2 + Math.sin(time + i) * 5;
        ctx.moveTo(x, waveY);
        for (let wx = x; wx < x + width; wx += 10) {
          ctx.lineTo(wx, waveY + Math.sin((wx + time * 50) / 20) * 3);
        }
        ctx.stroke();
      }

      // 반짝임 효과
      ctx.fillStyle = 'rgba(255, 255, 255, 0.4)';
      const sparkles = 5;
      for (let i = 0; i < sparkles; i++) {
        const sx = x + (Math.sin(time * 2 + i) * 0.5 + 0.5) * width;
        const sy = y + (Math.cos(time * 3 + i) * 0.5 + 0.5) * height;
        ctx.beginPath();
        ctx.arc(sx, sy, 2, 0, Math.PI * 2);
        ctx.fill();
      }
    };

    const drawBridge = (obj) => {
      const { x, y, width, height } = obj;

      // 다리 그림자
      ctx.fillStyle = 'rgba(0, 0, 0, 0.2)';
      ctx.fillRect(x + 5, y + 5, width, height);

      // 다리 바닥 (나무 판자)
      const bridgeGradient = ctx.createLinearGradient(x, y, x, y + height);
      bridgeGradient.addColorStop(0, '#8B4513');
      bridgeGradient.addColorStop(0.5, '#A0522D');
      bridgeGradient.addColorStop(1, '#8B4513');
      ctx.fillStyle = bridgeGradient;
      ctx.fillRect(x, y, width, height);

      // 나무 판자 패턴
      ctx.strokeStyle = '#654321';
      ctx.lineWidth = 3;
      const plankSpacing = 15;
      for (let py = y; py < y + height; py += plankSpacing) {
        ctx.beginPath();
        ctx.moveTo(x, py);
        ctx.lineTo(x + width, py);
        ctx.stroke();
      }

      // 다리 난간 (왼쪽)
      ctx.fillStyle = '#654321';
      ctx.fillRect(x, y, 8, height);
      // 난간 기둥들
      for (let ry = y + 10; ry < y + height - 10; ry += 20) {
        ctx.fillRect(x, ry, 15, 5);
      }

      // 다리 난간 (오른쪽)
      ctx.fillRect(x + width - 8, y, 8, height);
      // 난간 기둥들
      for (let ry = y + 10; ry < y + height - 10; ry += 20) {
        ctx.fillRect(x + width - 15, ry, 15, 5);
      }

      // 다리 테두리
      ctx.strokeStyle = '#654321';
      ctx.lineWidth = 4;
      ctx.strokeRect(x, y, width, height);

      // 다리 라벨
      ctx.fillStyle = '#FFD700';
      ctx.font = 'bold 16px Arial';
      ctx.textAlign = 'center';
      ctx.fillText('BRIDGE', x + width / 2, y + height / 2);
    };

    const drawPoop = (poop) => {
      const { x, y, width, height, collected } = poop;
      if (collected) return;

      const centerX = x + width / 2;
      const centerY = y + height / 2;

      // 그림자
      ctx.fillStyle = 'rgba(0, 0, 0, 0.3)';
      ctx.beginPath();
      ctx.ellipse(centerX, centerY + height / 2, width * 0.4, height * 0.15, 0, 0, Math.PI * 2);
      ctx.fill();

      // 똥 본체 (3개의 원으로 구성)
      const poopGradient = ctx.createRadialGradient(
        centerX - 3, centerY - 3, 2,
        centerX, centerY, width / 2
      );
      poopGradient.addColorStop(0, '#8B4513');
      poopGradient.addColorStop(0.5, '#654321');
      poopGradient.addColorStop(1, '#3D2817');
      ctx.fillStyle = poopGradient;

      // 아래 덩어리
      ctx.beginPath();
      ctx.arc(centerX, centerY + 5, width * 0.4, 0, Math.PI * 2);
      ctx.fill();

      // 중간 덩어리
      ctx.beginPath();
      ctx.arc(centerX, centerY, width * 0.35, 0, Math.PI * 2);
      ctx.fill();

      // 위 덩어리
      ctx.beginPath();
      ctx.arc(centerX, centerY - 5, width * 0.25, 0, Math.PI * 2);
      ctx.fill();

      // 하이라이트
      ctx.fillStyle = 'rgba(139, 69, 19, 0.6)';
      ctx.beginPath();
      ctx.arc(centerX - 3, centerY - 2, 4, 0, Math.PI * 2);
      ctx.fill();

      // 테두리
      ctx.strokeStyle = '#2F1B0E';
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.arc(centerX, centerY + 5, width * 0.4, 0, Math.PI * 2);
      ctx.stroke();
      ctx.beginPath();
      ctx.arc(centerX, centerY, width * 0.35, 0, Math.PI * 2);
      ctx.stroke();
      ctx.beginPath();
      ctx.arc(centerX, centerY - 5, width * 0.25, 0, Math.PI * 2);
      ctx.stroke();
    };

    const drawWall = (obj) => {
      const { x, y, width, height } = obj;

      // 울타리 느낌의 벽
      const wallGradient = ctx.createLinearGradient(x, y, x, y + height);
      wallGradient.addColorStop(0, '#8B7355');
      wallGradient.addColorStop(0.5, '#A0826D');
      wallGradient.addColorStop(1, '#8B7355');
      ctx.fillStyle = wallGradient;
      ctx.fillRect(x, y, width, height);

      // 나무 패턴
      ctx.strokeStyle = 'rgba(101, 67, 33, 0.3)';
      ctx.lineWidth = 2;
      const spacing = 20;
      for (let i = x; i < x + width; i += spacing) {
        ctx.beginPath();
        ctx.moveTo(i, y);
        ctx.lineTo(i, y + height);
        ctx.stroke();
      }

      // 테두리
      ctx.strokeStyle = '#654321';
      ctx.lineWidth = 3;
      ctx.strokeRect(x, y, width, height);
    };

    // 캐릭터 생성
    const character = new Character();
    characterRef.current = character;

    // 똥 수집 핸들러
    const handlePoopCollected = (poopId) => {
      // poopsRef를 직접 수정
      const poop = poopsRef.current.find(p => p.id === poopId);
      if (poop && !poop.collected) {
        poop.collected = true;

        // 똥 카운트 증가 (비동기로 처리하여 즉시 렌더링 방지)
        if (setPoopCount) {
          setTimeout(() => {
            setPoopCount(prev => prev + 1);
          }, 0);
        }
      }
    };

    // 게임 루프
    const gameLoop = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // 배경 그리기
      drawBackground();

      // 산책로 그리기
      drawWalkingPath();

      // 강 그리기 (벽보다 먼저)
      collisionObjects.filter(obj => obj.type === 'river').forEach(drawRiver);

      // 다리 그리기 (강 위에)
      drawBridge(bridge);

      // 벽 그리기
      collisionObjects.filter(obj => obj.type === 'wall').forEach(drawWall);

      // 나무 그리기
      collisionObjects.filter(obj => obj.type === 'tree').forEach(drawTree);

      // 우물 그리기
      collisionObjects.filter(obj => obj.type === 'well').forEach(drawWell);

      // 벤치 그리기
      collisionObjects.filter(obj => obj.type === 'bench').forEach(drawBench);

      // 꽃 그리기 (충돌 없음)
      nonCollisionObjects.filter(obj => obj.type === 'flower').forEach(drawFlower);

      // 똥 그리기
      poopsRef.current.forEach(drawPoop);

      // 캐릭터 업데이트 및 그리기
      character.update(poopsRef.current, handlePoopCollected);
      character.draw(ctx);

      // 캐릭터 위치 저장
      characterPositionRef.current.x = character.x;
      characterPositionRef.current.y = character.y;

      requestAnimationFrame(gameLoop);
    };

    gameLoop();

    return () => {
      // 클린업
      if (character && character.cleanup) {
        character.cleanup();
      }
    };
  }, [onExit, setPoopCount]);

  return (
    <div className="park-page">
      <canvas ref={canvasRef} />
      <div className="park-info">
        <h2>🌳 공원</h2>
        <p>방향키 또는 WASD로 이동</p>
      </div>
      <div className="park-exit-button-container">
        <button onClick={onExit} className="exit-button">
          🚪 공원 나가기
        </button>
      </div>
    </div>
  );
};

export default ParkPage;
