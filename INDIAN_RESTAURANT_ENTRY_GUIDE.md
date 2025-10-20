# 인도 레스토랑 입장 가이드

## 입장 방법

### 1. 레스토랑 위치
- **위치**: 화면 왼쪽 상단 블록 (0,0 위치)
- **좌표**: 캔버스 너비의 10%, 캔버스 높이의 28% 지점
- **블록 이름**: "인도인 마을" 블록 내 레스토랑 이미지

### 2. 트리거 범위
- **트리거 영역 크기**: 250px × 250px
- **중심점**: 레스토랑 이미지 중심
- **활성화 조건**: 캐릭터가 레스토랑 중심에서 125px 이내 범위에 진입

### 3. 입장 프로세스

#### Step 1: 캐릭터 이동
```
방향키 또는 WASD 키로 캐릭터를 레스토랑 근처로 이동
- ↑ / W: 위로 이동
- ↓ / S: 아래로 이동
- ← / A: 왼쪽으로 이동
- → / D: 오른쪽으로 이동
```

#### Step 2: 입장 버튼 활성화
캐릭터가 레스토랑 근처에 도착하면:
- 화면 중앙에 **"🇮🇳 인도 레스토랑 들어가기"** 버튼이 나타남
- 버튼은 황금색 그라디언트 배경, 맥동 애니메이션 효과

#### Step 3: 입장
- 입장 버튼을 **클릭**하여 레스토랑 내부로 진입

### 4. 기술 세부사항

#### 트리거 감지 로직
```javascript
// 레스토랑 위치 계산
const restaurantX = canvasWidth * 0.10;
const restaurantY = canvasHeight * 0.28;
const triggerWidth = 250;
const triggerHeight = 250;

// 캐릭터가 범위 내에 있는지 체크
const isNear =
  character.x > restaurantX - triggerWidth / 2 &&
  character.x < restaurantX + triggerWidth / 2 &&
  character.y > restaurantY - triggerHeight / 2 &&
  character.y < restaurantY + triggerHeight / 2;
```

#### 상태 관리
- `isNearRestaurant` state: 캐릭터가 레스토랑 근처에 있는지 추적
- `showRestaurant` state: 레스토랑 페이지 표시 여부
- 버튼은 `isNearRestaurant`가 true일 때만 렌더링

#### 반응형 위치 계산
- 화면 크기에 관계없이 비율 기반으로 위치 계산
- 창 크기 변경 시에도 올바른 위치 유지

### 5. UI/UX 특징

#### 입장 버튼 스타일
```css
- 배경: 황금 그라디언트 (linear-gradient(135deg, #FFD700, #FFA500))
- 테두리: 3px solid #FF8C00
- 폰트 크기: 20px
- 패딩: 15px 30px
- 애니메이션: pulse (맥동 효과)
- 호버 효과: 1.05배 확대
```

#### 거리에 따른 동작
- **범위 내**: 버튼 표시
- **범위 밖**: 버튼 자동 숨김 (조건부 렌더링)

### 6. 퇴장 방법

레스토랑 내부에서:
- 화면 하단 중앙의 **"🚪 레스토랑 나가기"** 버튼 클릭
- 퇴장 시 캐릭터는 레스토랑 아래쪽 (restaurantY + 100px)에 배치됨

---

## 코드 파일 위치

- **입장 로직**: `C:\123\src\components\IranCharacter.js`
  - 트리거 감지: Line 150-163
  - 버튼 렌더링: Line 323-329

- **레스토랑 페이지**: `C:\123\src\pages\IndianRestaurantPage.js`
  - 퇴장 버튼: Line 501-505

- **스타일**:
  - `C:\123\src\components\IranCharacter.css` (입장 버튼)
  - `C:\123\src\pages\IndianRestaurantPage.css` (퇴장 버튼)

---

## 문제 해결

### 버튼이 나타나지 않는 경우
1. 캐릭터가 레스토랑에 충분히 가까이 있는지 확인 (250px 범위 내)
2. 브라우저 콘솔에서 에러 확인
3. `isNearRestaurant` state가 올바르게 업데이트되는지 확인

### 성능 문제
- 이전에는 상태 변경마다 useEffect가 재실행되는 문제가 있었음
- 현재는 ref 기반으로 최적화되어 해결됨
