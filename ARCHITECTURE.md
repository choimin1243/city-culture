# City Culture Simulation - 프로그램 구조 및 건물 입장 메커니즘

## 📋 프로젝트 개요

도시 문화 시뮬레이션 게임으로, 사용자가 캐릭터를 조작하여 다양한 건물을 방문하고 상호작용할 수 있는 React 기반 2D 게임입니다.

### 기술 스택
- **React 18.2.0** - UI 프레임워크
- **Canvas API** - 2D 그래픽 렌더링
- **JavaScript (ES6+)** - 게임 로직

---

## 🏗️ 전체 구조

```
city-culture/
├── src/
│   ├── App.js                          # 메인 앱 컴포넌트
│   ├── index.js                        # 엔트리 포인트
│   ├── components/
│   │   ├── HouseRoadViewer.js          # 도시 맵 뷰어 (메인 화면)
│   │   ├── IranCharacter.js            # 캐릭터 컨트롤러 및 상태 관리
│   │   └── ApartmentBuilding.js        # 아파트 건물 렌더링 컴포넌트
│   ├── pages/
│   │   ├── IndianRestaurantPage.js     # 인도 레스토랑 내부
│   │   ├── ParkPage.js                 # 공원 내부
│   │   ├── TemplePage.js               # 사원 내부
│   │   ├── ApartmentPage.js            # 아파트 복도
│   │   └── CityHallPage.js             # 시청 내부
│   ├── data/
│   │   └── housesData.js               # 건물 데이터 및 위치 정보
│   └── utils/
│       └── houseManager.js             # 건물 관리 유틸리티
```

---

## 🎮 핵심 시스템 분석

### 1. 메인 화면 구조 (`HouseRoadViewer.js`)

#### 역할
- 도시 전체 맵을 렌더링
- 건물들을 블록 단위로 배치
- 도로 네트워크 표시

#### 블록 시스템
```javascript
// 도시는 그리드 블록으로 나뉘어짐
const roadBlocks = {
  rows: [
    { start: 0, end: 40 },    // 상단 블록 (첫 번째 도로 위)
    { start: 40, end: 80 },   // 중간 블록 (도로 사이)
    { start: 80, end: 100 }   // 하단 블록 (두 번째 도로 아래)
  ],
  cols: [
    { start: 0, end: 20 },    // 좌측 블록
    { start: 20, end: 40 },   // 중앙좌 블록
    { start: 40, end: 60 },   // 중앙우 블록
    { start: 60, end: 100 }   // 우측 블록
  ]
};
```

#### 건물 배치 예시
- **인도인 마을** (row: 0, col: 0) - 좌측 상단
- **공원** (row: 0, col: 1) - 중앙좌 상단
- **아파트** (row: 1, col: 1) - 중앙좌 중간
- **시청** (row: 1, col: 2) - 중앙우 중간

---

## 🚪 건물 입장 메커니즘 (핵심)

### 전체 흐름도

```
1. 캐릭터 이동 (방향키/WASD)
        ↓
2. 거리 계산 (매 프레임마다)
        ↓
3. 근접 감지 (triggerDistance 이내)
        ↓
4. 버튼 활성화 (조건부 렌더링)
        ↓
5. 버튼 클릭
        ↓
6. 상태 변경 (showXXX = true)
        ↓
7. 페이지 전환 (조건부 렌더링)
        ↓
8. 새로운 내부 씬 렌더링
```

---

### 상세 단계별 분석

#### **Step 1: 캐릭터 시스템** (`IranCharacter.js`)

##### 캐릭터 상태 관리
```javascript
// 각 건물별 근접 상태
const [isNearRestaurant, setIsNearRestaurant] = useState(false);
const [isNearPark, setIsNearPark] = useState(false);
const [isNearTemple, setIsNearTemple] = useState(false);
const [isNearApartment, setIsNearApartment] = useState(false);
const [isNearCityHall, setIsNearCityHall] = useState(false);

// 각 건물 내부 표시 상태
const [showRestaurant, setShowRestaurant] = useState(false);
const [showPark, setShowPark] = useState(false);
const [showTemple, setShowTemple] = useState(false);
const [showApartment, setShowApartment] = useState(false);
const [showCityHall, setShowCityHall] = useState(false);
```

##### 게임 상태 관리
```javascript
// 금액과 게임 내 아이템 카운트
const [money, setMoney] = useState(10000);
const [poopCount, setPoopCount] = useState(0);
```

---

#### **Step 2: 건물 위치 감지 시스템**

##### DOM 기반 위치 추적
각 건물의 실제 DOM 요소 위치를 실시간으로 추적합니다.

```javascript
// 레스토랑 이미지 DOM 요소 찾기
const getRestaurantImageBounds = () => {
  const restaurantImg = document.querySelector('.house-image.indian-restaurant');
  if (restaurantImg) {
    const rect = restaurantImg.getBoundingClientRect();
    return {
      x: rect.left + rect.width / 2,      // 중심 X 좌표
      y: rect.top + rect.height / 2,      // 중심 Y 좌표
      width: rect.width,
      height: rect.height
    };
  }
  return null;
};
```

##### 모든 건물에 대한 위치 추적 함수들
- `getRestaurantImageBounds()` - 인도 레스토랑
- `getParkImageBounds()` - 공원
- `getTempleImageBounds()` - 사원
- `getApartmentImageBounds()` - 아파트
- `getCityHallImageBounds()` - 시청

---

#### **Step 3: 거리 계산 및 근접 감지**

##### Character 클래스의 update 메서드 내부

```javascript
update(onNearRestaurant, onNearPark, onNearTemple,
       onNearApartment, onNearCityHall,
       getRestaurantBounds, getParkBounds, getTempleBounds,
       getApartmentBounds, getCityHallBounds) {

  // 캐릭터 이동 처리...

  // 레스토랑 근처 여부 체크
  let isNearRestaurant = false;
  if (getRestaurantBounds) {
    const restaurantBounds = getRestaurantBounds();
    if (restaurantBounds) {
      // 피타고라스 정리로 거리 계산
      const dx = this.x - restaurantBounds.x;
      const dy = this.y - restaurantBounds.y;
      const distance = Math.sqrt(dx * dx + dy * dy);

      // 트리거 거리 계산 (건물 크기의 절반 + 여유 공간)
      const triggerDistance = Math.max(
        restaurantBounds.width,
        restaurantBounds.height
      ) / 2 + 50;

      isNearRestaurant = distance < triggerDistance;
    }
  }

  // 콜백 호출하여 상태 업데이트
  if (onNearRestaurant) {
    onNearRestaurant(isNearRestaurant);
  }

  // 다른 건물들도 동일한 방식으로 체크...
}
```

##### 거리 계산 수식
```
distance = √((캐릭터X - 건물X)² + (캐릭터Y - 건물Y)²)
triggerDistance = max(건물Width, 건물Height) / 2 + 50px

if (distance < triggerDistance) {
  -> 건물 근처에 있음
}
```

---

#### **Step 4: 버튼 활성화 (조건부 렌더링)**

##### 근접 상태 콜백 처리
```javascript
// Ref를 사용한 안정적인 상태 업데이트
handleNearRestaurantRef.current = (isNear) => {
  isNearRestaurantRef.current = isNear;

  // 상태가 실제로 변경될 때만 setState 호출
  setIsNearRestaurant(prev => {
    if (prev !== isNear) {
      return isNear;
    }
    return prev;
  });
};
```

##### 조건부 버튼 렌더링
```javascript
{isNearRestaurant && (
  <div className="restaurant-entrance-button-overlay">
    <button onClick={handleEnterRestaurant} className="entrance-button">
      🇮🇳 인도 레스토랑 들어가기
    </button>
  </div>
)}

{isNearPark && (
  <div className="park-entrance-button-overlay">
    <button onClick={handleEnterPark} className="park-entrance-button">
      🌳 공원 들어가기
    </button>
  </div>
)}

{isNearTemple && (
  <div className="temple-entrance-button-overlay">
    <button onClick={handleEnterTemple} className="temple-entrance-button">
      ⛪ 사원 들어가기
    </button>
  </div>
)}

{isNearApartment && (
  <div className="apartment-entrance-button-overlay">
    <button onClick={handleEnterApartment} className="apartment-entrance-button">
      🏢 아파트 들어가기
    </button>
  </div>
)}

{isNearCityHall && (
  <div className="cityhall-entrance-button-overlay">
    <button onClick={handleEnterCityHall} className="cityhall-entrance-button">
      🏛️ 시청 들어가기
    </button>
  </div>
)}
```

---

#### **Step 5: 입장 처리**

##### 입장 핸들러
```javascript
const handleEnterRestaurant = () => {
  setShowRestaurant(true);  // 레스토랑 페이지 표시
};

const handleEnterPark = () => {
  setShowPark(true);  // 공원 페이지 표시
};

const handleEnterTemple = () => {
  setShowTemple(true);  // 사원 페이지 표시
};

const handleEnterApartment = () => {
  setShowApartment(true);  // 아파트 페이지 표시
};

const handleEnterCityHall = () => {
  setShowCityHall(true);  // 시청 페이지 표시
};
```

---

#### **Step 6: 페이지 전환 (조건부 렌더링)**

##### IranCharacter.js의 렌더링 로직
```javascript
// 건물 내부를 보여줄 때는 조기 반환 (early return)
if (showRestaurant) {
  return <IndianRestaurantPage onExit={handleExitRestaurant} />;
}

if (showPark) {
  return <ParkPage
    onExit={handleExitPark}
    poopCount={poopCount}
    setPoopCount={setPoopCount}
  />;
}

if (showTemple) {
  return <TemplePage onExit={handleExitTemple} />;
}

if (showApartment) {
  return <ApartmentPage onExit={handleExitApartment} />;
}

if (showCityHall) {
  return <CityHallPage onExit={handleExitCityHall} />;
}

// 기본: 메인 맵 화면 렌더링
return (
  <>
    <canvas ref={canvasRef} className="iran-character-canvas-fullscreen" />
    {/* 버튼들... */}
  </>
);
```

---

#### **Step 7: 건물 내부 렌더링**

각 건물 페이지는 독립적인 Canvas 기반 씬을 렌더링합니다.

##### 공통 구조 (예: ApartmentPage.js)
```javascript
const ApartmentPage = ({ onExit }) => {
  const canvasRef = useRef(null);
  const characterRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    // 1. 충돌 오브젝트 정의
    const collisionObjects = [
      { x: 0, y: 0, width: window.innerWidth, height: 40, type: 'wall' },
      { x: 80, y: 80, width: 200, height: 400, type: 'stairs' },
      // ... 더 많은 오브젝트들
    ];

    // 2. 캐릭터 클래스 생성
    class Character {
      constructor() {
        this.x = window.innerWidth / 2;
        this.y = window.innerHeight - 150;
        // ... 캐릭터 설정
      }

      update() {
        // 이동 처리
        // 충돌 체크
        // 애니메이션 업데이트
      }

      draw(ctx) {
        // 캐릭터 렌더링
      }
    }

    // 3. 게임 루프
    const gameLoop = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // 배경 그리기
      drawBackground();

      // 오브젝트들 그리기
      collisionObjects.forEach(obj => {
        if (obj.type === 'wall') drawWall(obj);
        if (obj.type === 'stairs') drawStairs(obj);
        // ...
      });

      // 캐릭터 업데이트 및 그리기
      character.update();
      character.draw(ctx);

      requestAnimationFrame(gameLoop);
    };

    gameLoop();
  }, [onExit]);

  return (
    <div className="apartment-page">
      <canvas ref={canvasRef} />
      <button onClick={onExit}>🚪 아파트 나가기</button>
    </div>
  );
};
```

---

#### **Step 8: 퇴장 처리**

##### 퇴장 핸들러
```javascript
const handleExitRestaurant = () => {
  if (handleExitRestaurantRef.current) {
    handleExitRestaurantRef.current();
  }

  // 레스토랑 아래쪽으로 캐릭터 위치 이동
  setTimeout(() => {
    if (gameRef.current) {
      const restaurantBounds = document.querySelector('.house-image.indian-restaurant');
      if (restaurantBounds) {
        const rect = restaurantBounds.getBoundingClientRect();
        gameRef.current.setPosition(
          rect.left + rect.width / 2,    // 건물 중앙
          rect.bottom + 80               // 건물 아래쪽 80px
        );
      }
    }
  }, 100);
};
```

##### Exit Ref 저장
```javascript
handleExitRestaurantRef.current = () => {
  setShowRestaurant(false);  // 레스토랑 페이지 닫기
};
```

---

## 🎯 각 건물 페이지 특징

### 1. IndianRestaurantPage (인도 레스토랑)
- **위치**: `src/pages/IndianRestaurantPage.js:1`
- **특징**:
  - 주방, 테이블, 의자 배치
  - 인도 장식물 (코끼리, 향로, 화분, 탄두리 오븐)
  - 화려한 벽과 카펫
- **오브젝트**: 주방, 테이블 4개, 의자 16개, 장식물 다수
- **퇴장**: ESC 키 또는 나가기 버튼

### 2. ParkPage (공원)
- **위치**: `src/pages/ParkPage.js:1`
- **특징**:
  - 강과 다리 시스템
  - 똥 수집 미니게임 (15-25개 랜덤 생성)
  - 나무, 벤치, 우물, 꽃
- **게임플레이**:
  - 똥 수집 시 `poopCount` 증가
  - 수집 중 0.3초 동안 캐릭터 움직임 정지
- **퇴장**: 나가기 버튼

### 3. TemplePage (사원)
- **위치**: `src/pages/TemplePage.js`
- **특징**: (코드 미확인, 추정)
  - 종교 건물 인테리어
  - 기도 공간

### 4. ApartmentPage (아파트)
- **위치**: `src/pages/ApartmentPage.js:1`
- **특징**:
  - 복도 구조
  - 8개 호실 (101~108호)
  - 계단, 엘리베이터 2대
  - 복도 장식물 (화분, 소화기)
- **오브젝트**: 벽, 방문 8개, 엘리베이터, 계단, 장식물
- **퇴장**: ESC 키 또는 나가기 버튼

### 5. CityHallPage (시청)
- **위치**: `src/pages/CityHallPage.js`
- **특징**: (코드 미확인, 추정)
  - 행정 업무 공간

---

## 🔄 상태 관리 흐름

```
┌─────────────────────────────────────────────────────────┐
│                   IranCharacter.js                      │
│                 (최상위 상태 관리자)                       │
├─────────────────────────────────────────────────────────┤
│                                                         │
│  useState:                                              │
│    - isNearRestaurant / showRestaurant                  │
│    - isNearPark / showPark                              │
│    - isNearTemple / showTemple                          │
│    - isNearApartment / showApartment                    │
│    - isNearCityHall / showCityHall                      │
│    - money / poopCount                                  │
│                                                         │
│  useRef:                                                │
│    - gameRef (Character 인스턴스)                        │
│    - handleNearXXXRef (근접 콜백)                        │
│    - handleExitXXXRef (퇴장 콜백)                        │
│    - isNearXXXRef (근접 상태 ref)                       │
│                                                         │
└─────────────────────────────────────────────────────────┘
                          ↓
        ┌─────────────────┴─────────────────┐
        ↓                                   ↓
┌──────────────────┐              ┌──────────────────┐
│  Canvas + 캐릭터   │              │   건물 페이지들    │
│  (메인 맵)        │              │   (내부 씬)       │
├──────────────────┤              ├──────────────────┤
│ - Character 클래스│              │ - 독립적 Canvas  │
│ - 거리 계산       │              │ - Character 클래스│
│ - 근접 감지       │              │ - 충돌 시스템     │
│ - 버튼 표시       │              │ - 고유 게임플레이 │
└──────────────────┘              └──────────────────┘
```

---

## 🎨 렌더링 시스템

### Canvas 기반 렌더링
모든 시각적 요소는 Canvas 2D API로 직접 그려집니다.

```javascript
// 게임 루프 패턴
const gameLoop = () => {
  // 1. 캔버스 클리어
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // 2. 배경 그리기
  drawBackground();

  // 3. 정적 오브젝트 그리기
  collisionObjects.forEach(obj => drawObject(obj));

  // 4. 캐릭터 업데이트 및 그리기
  character.update();
  character.draw(ctx);

  // 5. 다음 프레임 요청
  requestAnimationFrame(gameLoop);
};
```

### 그리기 함수 예시
```javascript
const drawTable = (obj) => {
  const { x, y, width, height } = obj;

  // 그림자
  ctx.fillStyle = 'rgba(0, 0, 0, 0.2)';
  ctx.fillRect(x + 5, y + 5, width, height);

  // 테이블 상판 (그라디언트)
  const tableGradient = ctx.createLinearGradient(x, y, x + width, y + height);
  tableGradient.addColorStop(0, '#8B4513');
  tableGradient.addColorStop(0.5, '#A0522D');
  tableGradient.addColorStop(1, '#8B4513');
  ctx.fillStyle = tableGradient;
  ctx.fillRect(x, y, width, height);

  // 테두리
  ctx.strokeStyle = '#654321';
  ctx.lineWidth = 3;
  ctx.strokeRect(x, y, width, height);
};
```

---

## 🎮 캐릭터 시스템

### 캐릭터 클래스 구조
```javascript
class Character {
  constructor(canvasWidth, canvasHeight, initialX, initialY, getRestaurantBounds) {
    // 위치
    this.x = initialX || defaultX;
    this.y = initialY || defaultY;

    // 크기
    this.width = 60;
    this.height = 60;

    // 이동
    this.speed = 8;
    this.velocityX = 0;
    this.velocityY = 0;

    // 방향 및 애니메이션
    this.direction = 'front';  // front, left, right
    this.isMoving = false;
    this.animationFrame = 0;
    this.animationSpeed = 6;

    // 이미지 로드
    this.images = {};
    this.loadImages();

    // 키 입력 설정
    this.keys = {};
    this.setupEventListeners();
  }

  loadImages() {
    const imageNames = [
      'front1_no_bg', 'front222',
      'left1_no_bg', 'left2-removebg-preview',
      'right1_no_bg', 'right2_no_bg'
    ];
    // CDN에서 이미지 로드
  }

  update(...callbacks) {
    // 키 입력 처리
    // 이동 계산
    // 충돌 체크
    // 건물 근접 감지
    // 애니메이션 업데이트
  }

  draw(ctx) {
    // 그림자 그리기
    // 캐릭터 이미지 그리기
  }
}
```

### 키 입력 처리
```javascript
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

// update 메서드 내부
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
}
if (this.keys['arrowdown'] || this.keys['s']) {
  targetVelY = this.speed;
}
```

---

## 🚧 충돌 감지 시스템

### AABB (Axis-Aligned Bounding Box) 충돌 감지
```javascript
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
      return true;  // 충돌 발생
    }
  }
  return false;  // 충돌 없음
}
```

### 충돌 처리
```javascript
// X축 충돌 체크
const newX = this.x + this.velocityX;
if (!this.checkCollision(newX, this.y)) {
  this.x = newX;  // 충돌 없으면 이동
}

// Y축 충돌 체크 (별도로 처리)
const newY = this.y + this.velocityY;
if (!this.checkCollision(this.x, newY)) {
  this.y = newY;  // 충돌 없으면 이동
}
```

---

## 📊 데이터 구조

### 건물 데이터 (`housesData.js`)
```javascript
{
  id: 1,
  name: '인디언 하우스1',
  image: 'https://cdn.jsdelivr.net/gh/choimin1243/building/INDIANHOUSE.png',
  position: getBlockPosition(0, 0, 50, 20),
  type: 'residential',
  className: 'indian-house-1',
  block: { row: 0, col: 0 }
}
```

### 건물 타입
```javascript
const houseTypes = {
  residential: { color: '#FFB6C1', label: '주거' },
  commercial: { color: '#98FB98', label: '상업' },
  educational: { color: '#87CEEB', label: '교육' },
  industrial: { color: '#DDA0DD', label: '산업' },
  park: { color: '#90EE90', label: '공원' },
  religious: { color: '#F0E68C', label: '종교' },
  government: { color: '#B0C4DE', label: '행정' }
};
```

---

## 🎯 주요 기술적 특징

### 1. Ref 기반 상태 관리
- **이유**: 게임 루프 내에서 최신 상태 접근 필요
- **방법**: `useRef`로 콜백 함수 저장

```javascript
const handleNearRestaurantRef = useRef(null);

// useEffect 내부에서 ref에 함수 할당
handleNearRestaurantRef.current = (isNear) => {
  setIsNearRestaurant(prev => prev !== isNear ? isNear : prev);
};

// 게임 루프에서 ref를 통해 호출
character.update(handleNearRestaurantRef.current, ...);
```

### 2. 조건부 렌더링을 통한 씬 전환
- **장점**:
  - 단순한 상태 전환
  - 각 씬이 독립적으로 관리됨
  - 메모리 효율적 (이전 씬은 언마운트)

### 3. DOM 기반 위치 추적
- **장점**: CSS 레이아웃과 게임 로직 통합
- **방법**: `getBoundingClientRect()` 사용

### 4. Canvas 2D 렌더링
- **장점**:
  - 세밀한 그래픽 제어
  - 높은 성능
  - 커스텀 애니메이션 가능

---

## 🔧 확장 가능성

### 새로운 건물 추가하기

#### 1. 데이터 추가 (`housesData.js`)
```javascript
{
  id: 20,
  name: '새 건물',
  image: 'https://example.com/building.png',
  position: getBlockPosition(1, 3, 50, 50),
  type: 'commercial',
  className: 'new-building',
  block: { row: 1, col: 3 }
}
```

#### 2. 페이지 컴포넌트 생성 (`NewBuildingPage.js`)
```javascript
const NewBuildingPage = ({ onExit }) => {
  // Canvas 설정
  // 캐릭터 생성
  // 게임 루프

  return (
    <div className="new-building-page">
      <canvas ref={canvasRef} />
      <button onClick={onExit}>나가기</button>
    </div>
  );
};
```

#### 3. IranCharacter.js 수정
```javascript
// 상태 추가
const [isNearNewBuilding, setIsNearNewBuilding] = useState(false);
const [showNewBuilding, setShowNewBuilding] = useState(false);

// 위치 추적 함수 추가
const getNewBuildingImageBounds = () => { ... };

// Character update에 콜백 추가
character.update(..., handleNearNewBuildingRef.current, ..., getNewBuildingImageBounds);

// 버튼 렌더링
{isNearNewBuilding && <button onClick={handleEnterNewBuilding}>...</button>}

// 페이지 렌더링
if (showNewBuilding) {
  return <NewBuildingPage onExit={handleExitNewBuilding} />;
}
```

---

## 🎨 스타일링 시스템

### CSS 클래스 네이밍 규칙
- `.house-image.{building-class}` - 건물 이미지
- `.{building}-entrance-button-overlay` - 입장 버튼 컨테이너
- `.{building}-page` - 건물 내부 페이지
- `.exit-button` - 나가기 버튼

---

## 🐛 주요 버그 방지 패턴

### 1. 상태 변경 최적화
```javascript
setIsNearRestaurant(prev => {
  if (prev !== isNear) {
    return isNear;  // 실제로 변경된 경우만 업데이트
  }
  return prev;  // 같은 값이면 유지
});
```

### 2. 클린업 함수
```javascript
useEffect(() => {
  // 설정...

  return () => {
    // 이벤트 리스너 제거
    if (character && character.cleanup) {
      character.cleanup();
    }
  };
}, [dependencies]);
```

### 3. 게임 루프 중단 조건
```javascript
if (showRestaurant || showPark || showTemple || showApartment || showCityHall) {
  return;  // 건물 내부에 있으면 메인 게임 루프 중단
}
```

---

## 📈 성능 최적화

### 1. 이미지 캐싱
```javascript
this.images = {};
imageNames.forEach(name => {
  const img = new Image();
  img.crossOrigin = 'anonymous';
  img.src = `https://cdn.jsdelivr.net/gh/.../${name}.png`;
  this.images[name] = img;  // 캐시에 저장
});
```

### 2. requestAnimationFrame 사용
```javascript
const gameLoop = () => {
  // 렌더링 로직...
  requestAnimationFrame(gameLoop);  // 브라우저 최적화된 타이밍
};
```

### 3. 조건부 계산
```javascript
// 근처에 있을 때만 거리 계산
if (getRestaurantBounds) {
  const bounds = getRestaurantBounds();
  if (bounds) {
    // 거리 계산 수행
  }
}
```

---

## 🎮 게임플레이 요소

### 현재 구현된 기능
1. **자유로운 탐험**: 방향키/WASD로 도시 탐험
2. **건물 입장**: 근접 시 버튼 클릭으로 입장
3. **건물 내부 탐험**: 각 건물마다 고유한 인테리어
4. **미니게임**: 공원에서 똥 수집
5. **리소스 관리**: 금액, 아이템 카운트

### 확장 가능한 게임플레이
- NPC와의 대화
- 퀘스트 시스템
- 상점 거래
- 시간 시스템
- 날씨 효과
- 인벤토리 시스템

---

## 📝 코드 위치 참조

### 주요 파일 라인 참조
- 캐릭터 클래스: `IranCharacter.js:135-429`
- 거리 계산 로직: `IranCharacter.js:267-356`
- 버튼 렌더링: `IranCharacter.js:734-768`
- 페이지 전환: `IranCharacter.js:695-713`
- 아파트 내부: `ApartmentPage.js:1-577`
- 레스토랑 내부: `IndianRestaurantPage.js:1-749`
- 공원 내부: `ParkPage.js:1-873`
- 건물 데이터: `housesData.js:29-167`

---

## 🎯 결론

이 프로젝트는 **React + Canvas API**를 활용한 2D 탐험 게임으로, 다음과 같은 핵심 메커니즘을 구현합니다:

1. **DOM 기반 위치 추적** - 건물의 실제 위치를 실시간 추적
2. **거리 기반 상호작용** - 피타고라스 정리를 이용한 근접 감지
3. **조건부 렌더링** - 상태 기반 UI/씬 전환
4. **Canvas 렌더링** - 커스텀 2D 그래픽
5. **AABB 충돌 감지** - 사각형 기반 충돌 처리

건물 입장 메커니즘은 **거리 계산 → 버튼 활성화 → 상태 변경 → 씬 전환**의 명확한 흐름을 따르며, 각 단계가 독립적이면서도 긴밀하게 연결되어 있습니다.
