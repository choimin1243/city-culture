import React, { useEffect, useRef } from 'react';
import './ApartmentPage.css';

const ApartmentPage = ({ onExit }) => {
  const canvasRef = useRef(null);
  const characterRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    // 복도 레이아웃 설정 (이 값들을 조정하면 전체 레이아웃이 비례적으로 변경됨)
    const layout = {
      stairsLeft: 80,        // 계단 왼쪽 여백
      stairsWidth: 200,      // 계단 너비
      corridorWallWidth: 20, // 복도 벽 두께
      doorWidth: 120,        // 문 너비
      doorGap: 40,           // 복도 벽과 문 사이 간격
      rightMargin: 300,      // 오른쪽 벽과 오른쪽 문들 사이 여백 (고정)
      corridorWidth: 600,    // 복도 너비 (이 값을 조절하면 복도 폭이 변경됨)
    };

    // 계산된 위치값들
    const leftCorridorWallX = layout.stairsLeft + layout.stairsWidth;
    const leftDoorsX = leftCorridorWallX + layout.corridorWallWidth + layout.doorGap;

    // 오른쪽은 화면 오른쪽 끝을 기준으로 배치
    const rightDoorsX = window.innerWidth - layout.rightMargin;
    const rightCorridorWallX = rightDoorsX - layout.doorGap - layout.corridorWallWidth;

    // 충돌 가능한 오브젝트들
    const collisionObjects = [
      // 외벽들 (입구 제외)
      { x: 0, y: 0, width: window.innerWidth, height: 40, type: 'wall', className: 'wall-top' },
      { x: 0, y: 0, width: 40, height: window.innerHeight, type: 'wall', className: 'wall-left' },
      { x: window.innerWidth - 40, y: 0, width: 40, height: window.innerHeight, type: 'wall', className: 'wall-right' },
      // 하단 벽은 입구를 위해 두 부분으로 나눔
      { x: 0, y: window.innerHeight - 40, width: window.innerWidth / 2 - 80, height: 40, type: 'wall', className: 'wall-bottom-left' },
      { x: window.innerWidth / 2 + 80, y: window.innerHeight - 40, width: window.innerWidth / 2 - 80, height: 40, type: 'wall', className: 'wall-bottom-right' },

      // 계단 (왼쪽)
      { x: layout.stairsLeft, y: 80, width: layout.stairsWidth, height: 400, type: 'stairs', className: 'stairs-left', direction: 'up' },

      // 복도 벽들
      // 왼쪽 복도 벽
      { x: leftCorridorWallX, y: 80, width: layout.corridorWallWidth, height: 200, type: 'corridor-wall', className: 'corridor-wall-1' },
      // 오른쪽 복도 벽
      { x: rightCorridorWallX, y: 80, width: layout.corridorWallWidth, height: 200, type: 'corridor-wall', className: 'corridor-wall-2' },

      // 방문들 (왼쪽)
      { x: leftDoorsX, y: 100, width: layout.doorWidth, height: 20, type: 'door', className: 'door-101', room: '101호' },
      { x: leftDoorsX, y: 200, width: layout.doorWidth, height: 20, type: 'door', className: 'door-102', room: '102호' },
      { x: leftDoorsX, y: 300, width: layout.doorWidth, height: 20, type: 'door', className: 'door-103', room: '103호' },
      { x: leftDoorsX, y: 400, width: layout.doorWidth, height: 20, type: 'door', className: 'door-104', room: '104호' },

      // 방문들 (오른쪽)
      { x: rightDoorsX, y: 100, width: layout.doorWidth, height: 20, type: 'door', className: 'door-105', room: '105호' },
      { x: rightDoorsX, y: 200, width: layout.doorWidth, height: 20, type: 'door', className: 'door-106', room: '106호' },
      { x: rightDoorsX, y: 300, width: layout.doorWidth, height: 20, type: 'door', className: 'door-107', room: '107호' },
      { x: rightDoorsX, y: 400, width: layout.doorWidth, height: 20, type: 'door', className: 'door-108', room: '108호' },

      // 엘리베이터 (복도 중앙)
      { x: (leftCorridorWallX + rightCorridorWallX) / 2 - 100, y: 80, width: 80, height: 100, type: 'elevator', className: 'elevator-1' },
      { x: (leftCorridorWallX + rightCorridorWallX) / 2 + 20, y: 80, width: 80, height: 100, type: 'elevator', className: 'elevator-2' },

      // 복도 장식물들 (복도 좌우 측에 비율로 배치)
      // 화분들
      { x: leftCorridorWallX + (rightCorridorWallX - leftCorridorWallX) * 0.15, y: 150, width: 40, height: 50, type: 'plant', className: 'plant-1' },
      { x: leftCorridorWallX + (rightCorridorWallX - leftCorridorWallX) * 0.25, y: 350, width: 40, height: 50, type: 'plant', className: 'plant-2' },
      { x: leftCorridorWallX + (rightCorridorWallX - leftCorridorWallX) * 0.75, y: 150, width: 40, height: 50, type: 'plant', className: 'plant-3' },
      { x: leftCorridorWallX + (rightCorridorWallX - leftCorridorWallX) * 0.65, y: 350, width: 40, height: 50, type: 'plant', className: 'plant-4' },

      // 소화기
      { x: leftCorridorWallX + (rightCorridorWallX - leftCorridorWallX) * 0.2, y: 250, width: 30, height: 60, type: 'extinguisher', className: 'extinguisher-1' },
      { x: leftCorridorWallX + (rightCorridorWallX - leftCorridorWallX) * 0.7, y: 250, width: 30, height: 60, type: 'extinguisher', className: 'extinguisher-2' },
    ];

    // 입구 영역 정의
    const entranceArea = {
      x: window.innerWidth / 2 - 80,
      y: window.innerHeight - 100,
      width: 160,
      height: 100
    };

    // 카메라 오프셋
    const camera = {
      x: 0,
      y: 0
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

        // 카메라 업데이트 - 캐릭터를 화면 중앙에 유지
        camera.x = this.x - window.innerWidth / 2;
        camera.y = this.y - window.innerHeight / 2;

        // 카메라 경계 제한 (맵이 작을 경우를 위한 처리)
        const mapWidth = Math.max(window.innerWidth, rightDoorsX + 400);
        const mapHeight = window.innerHeight;

        camera.x = Math.max(0, Math.min(camera.x, mapWidth - window.innerWidth));
        camera.y = Math.max(0, Math.min(camera.y, mapHeight - window.innerHeight));
      }

      draw(ctx) {
        // 그림자 (translate로 이미 카메라 오프셋 적용됨)
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
      // 복도 바닥 (타일) - translate로 이미 카메라 오프셋 적용됨
      const mapWidth = Math.max(window.innerWidth, rightDoorsX + 400);
      const gradient = ctx.createLinearGradient(0, 0, mapWidth, 0);
      gradient.addColorStop(0, '#E8E8E8');
      gradient.addColorStop(0.5, '#F5F5F5');
      gradient.addColorStop(1, '#E8E8E8');
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, mapWidth, canvas.height);

      // 타일 패턴
      ctx.strokeStyle = 'rgba(200, 200, 200, 0.5)';
      ctx.lineWidth = 1;
      const tileSize = 50;
      for (let x = 0; x < mapWidth; x += tileSize) {
        for (let y = 0; y < canvas.height; y += tileSize) {
          ctx.strokeRect(x, y, tileSize, tileSize);
        }
      }
    };

    const drawStairs = (obj) => {
      const { x, y, width, height } = obj;

      // 계단 그림자
      ctx.fillStyle = 'rgba(0, 0, 0, 0.2)';
      ctx.fillRect(x + 5, y + 5, width, height);

      // 계단 배경
      const stairsGradient = ctx.createLinearGradient(x, y, x + width, y);
      stairsGradient.addColorStop(0, '#A9A9A9');
      stairsGradient.addColorStop(0.5, '#C0C0C0');
      stairsGradient.addColorStop(1, '#A9A9A9');
      ctx.fillStyle = stairsGradient;
      ctx.fillRect(x, y, width, height);

      // 계단 단들
      const stepCount = 12;
      const stepHeight = height / stepCount;
      for (let i = 0; i < stepCount; i++) {
        const stepY = y + i * stepHeight;

        // 계단 면
        ctx.fillStyle = i % 2 === 0 ? '#B8B8B8' : '#C8C8C8';
        ctx.fillRect(x + 10, stepY, width - 20, stepHeight - 2);

        // 계단 가장자리
        ctx.strokeStyle = '#808080';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(x + 10, stepY + stepHeight - 2);
        ctx.lineTo(x + width - 10, stepY + stepHeight - 2);
        ctx.stroke();
      }

      // 난간
      ctx.strokeStyle = '#696969';
      ctx.lineWidth = 8;
      ctx.beginPath();
      ctx.moveTo(x + 15, y);
      ctx.lineTo(x + 15, y + height);
      ctx.stroke();

      ctx.beginPath();
      ctx.moveTo(x + width - 15, y);
      ctx.lineTo(x + width - 15, y + height);
      ctx.stroke();

      // 테두리
      ctx.strokeStyle = '#696969';
      ctx.lineWidth = 3;
      ctx.strokeRect(x, y, width, height);

      // 계단 화살표
      ctx.fillStyle = '#FFD700';
      ctx.font = 'bold 30px Arial';
      ctx.textAlign = 'center';
      ctx.fillText('▲', x + width / 2, y + height / 2);
    };

    const drawDoor = (obj) => {
      const { x, y, width, height, room } = obj;

      // 문 그림자
      ctx.fillStyle = 'rgba(0, 0, 0, 0.2)';
      ctx.fillRect(x + 3, y + 3, width, height);

      // 문 본체
      const doorGradient = ctx.createLinearGradient(x, y, x + width, y);
      doorGradient.addColorStop(0, '#8B4513');
      doorGradient.addColorStop(0.5, '#A0522D');
      doorGradient.addColorStop(1, '#8B4513');
      ctx.fillStyle = doorGradient;
      ctx.fillRect(x, y, width, height);

      // 문 패널
      ctx.strokeStyle = '#654321';
      ctx.lineWidth = 2;
      ctx.strokeRect(x + 10, y + 5, width - 20, height - 10);

      // 손잡이
      ctx.fillStyle = '#FFD700';
      ctx.beginPath();
      ctx.arc(x + width - 25, y + height / 2, 6, 0, Math.PI * 2);
      ctx.fill();

      // 호수 번호
      ctx.fillStyle = '#FFD700';
      ctx.font = 'bold 14px Arial';
      ctx.textAlign = 'center';
      ctx.fillText(room, x + width / 2, y + height / 2 + 5);
    };

    const drawElevator = (obj) => {
      const { x, y, width, height } = obj;

      // 엘리베이터 그림자
      ctx.fillStyle = 'rgba(0, 0, 0, 0.2)';
      ctx.fillRect(x + 3, y + 3, width, height);

      // 엘리베이터 문
      const elevatorGradient = ctx.createLinearGradient(x, y, x, y + height);
      elevatorGradient.addColorStop(0, '#C0C0C0');
      elevatorGradient.addColorStop(0.5, '#D3D3D3');
      elevatorGradient.addColorStop(1, '#C0C0C0');
      ctx.fillStyle = elevatorGradient;
      ctx.fillRect(x, y, width, height);

      // 문 중앙 라인
      ctx.strokeStyle = '#808080';
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.moveTo(x + width / 2, y);
      ctx.lineTo(x + width / 2, y + height);
      ctx.stroke();

      // 테두리
      ctx.strokeStyle = '#696969';
      ctx.lineWidth = 3;
      ctx.strokeRect(x, y, width, height);

      // 버튼 패널
      ctx.fillStyle = '#404040';
      ctx.fillRect(x + width - 25, y + 10, 15, 30);

      // 버튼들
      ctx.fillStyle = '#FFD700';
      ctx.beginPath();
      ctx.arc(x + width - 17, y + 18, 4, 0, Math.PI * 2);
      ctx.fill();

      ctx.fillStyle = '#C0C0C0';
      ctx.beginPath();
      ctx.arc(x + width - 17, y + 32, 4, 0, Math.PI * 2);
      ctx.fill();
    };

    const drawPlant = (obj) => {
      const { x, y, width, height } = obj;

      // 화분
      const potGradient = ctx.createLinearGradient(x, y + height - 20, x + width, y + height - 20);
      potGradient.addColorStop(0, '#8B4513');
      potGradient.addColorStop(0.5, '#A0522D');
      potGradient.addColorStop(1, '#8B4513');
      ctx.fillStyle = potGradient;
      ctx.beginPath();
      ctx.moveTo(x + width * 0.2, y + height - 20);
      ctx.lineTo(x + width * 0.8, y + height - 20);
      ctx.lineTo(x + width, y + height);
      ctx.lineTo(x, y + height);
      ctx.closePath();
      ctx.fill();

      // 식물
      ctx.fillStyle = '#228B22';
      for (let i = 0; i < 5; i++) {
        ctx.beginPath();
        ctx.ellipse(
          x + width / 2 + (Math.random() - 0.5) * 20,
          y + (Math.random()) * (height - 20),
          8, 15, Math.random() * Math.PI / 4, 0, Math.PI * 2
        );
        ctx.fill();
      }
    };

    const drawExtinguisher = (obj) => {
      const { x, y, width, height } = obj;

      // 소화기 본체
      const extGradient = ctx.createLinearGradient(x, y, x + width, y);
      extGradient.addColorStop(0, '#8B0000');
      extGradient.addColorStop(0.5, '#DC143C');
      extGradient.addColorStop(1, '#8B0000');
      ctx.fillStyle = extGradient;
      ctx.fillRect(x, y + 10, width, height - 10);

      // 노즐
      ctx.fillStyle = '#696969';
      ctx.fillRect(x + width * 0.3, y, width * 0.4, 15);

      // 손잡이
      ctx.strokeStyle = '#000000';
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.arc(x + width / 2, y + 15, 8, Math.PI, 0, true);
      ctx.stroke();

      // 테두리
      ctx.strokeStyle = '#654321';
      ctx.lineWidth = 2;
      ctx.strokeRect(x, y + 10, width, height - 10);
    };

    const drawWall = (obj) => {
      const { x, y, width, height } = obj;

      // 벽 그라디언트
      const wallGradient = ctx.createLinearGradient(x, y, x, y + height);
      wallGradient.addColorStop(0, '#D3D3D3');
      wallGradient.addColorStop(0.5, '#E8E8E8');
      wallGradient.addColorStop(1, '#D3D3D3');
      ctx.fillStyle = wallGradient;
      ctx.fillRect(x, y, width, height);

      // 테두리
      ctx.strokeStyle = '#A9A9A9';
      ctx.lineWidth = 2;
      ctx.strokeRect(x, y, width, height);
    };

    const drawCorridorWall = (obj) => {
      const { x, y, width, height } = obj;

      // 복도 벽
      const wallGradient = ctx.createLinearGradient(x, y, x + width, y);
      wallGradient.addColorStop(0, '#DCDCDC');
      wallGradient.addColorStop(0.5, '#F0F0F0');
      wallGradient.addColorStop(1, '#DCDCDC');
      ctx.fillStyle = wallGradient;
      ctx.fillRect(x, y, width, height);

      // 테두리
      ctx.strokeStyle = '#C0C0C0';
      ctx.lineWidth = 2;
      ctx.strokeRect(x, y, width, height);
    };

    const drawEntrance = () => {
      const { x, y, width, height } = entranceArea;

      // 입구 바닥
      const entranceGradient = ctx.createLinearGradient(x, y, x + width, y);
      entranceGradient.addColorStop(0, '#A9A9A9');
      entranceGradient.addColorStop(0.5, '#C0C0C0');
      entranceGradient.addColorStop(1, '#A9A9A9');
      ctx.fillStyle = entranceGradient;
      ctx.fillRect(x, y, width, height);

      // 입구 테두리
      ctx.strokeStyle = '#808080';
      ctx.lineWidth = 3;
      ctx.strokeRect(x + 5, y + 5, width - 10, height - 10);

      // 입구 표시
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

      // 카메라 변환 시작
      ctx.save();
      ctx.translate(-camera.x, -camera.y);

      // 배경 그리기
      drawBackground();

      // 입구 그리기
      drawEntrance();

      // 벽 그리기
      collisionObjects.filter(obj => obj.type === 'wall').forEach(drawWall);

      // 복도 벽 그리기
      collisionObjects.filter(obj => obj.type === 'corridor-wall').forEach(drawCorridorWall);

      // 계단 그리기
      collisionObjects.filter(obj => obj.type === 'stairs').forEach(drawStairs);

      // 엘리베이터 그리기
      collisionObjects.filter(obj => obj.type === 'elevator').forEach(drawElevator);

      // 방문 그리기
      collisionObjects.filter(obj => obj.type === 'door').forEach(drawDoor);

      // 화분 그리기
      collisionObjects.filter(obj => obj.type === 'plant').forEach(drawPlant);

      // 소화기 그리기
      collisionObjects.filter(obj => obj.type === 'extinguisher').forEach(drawExtinguisher);

      // 캐릭터 업데이트 및 그리기
      character.update();
      character.draw(ctx);

      // 카메라 변환 종료
      ctx.restore();

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
    <div className="apartment-page">
      <canvas ref={canvasRef} />
      <div className="apartment-info">
        <h2>🏢 아파트 복도</h2>
      </div>
      <div className="apartment-exit-button-container">
        <button onClick={onExit} className="exit-button">
          🚪 아파트 나가기
        </button>
      </div>
    </div>
  );
};

export default ApartmentPage;
