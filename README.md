# 집과 도로 뷰어

현재 폴더의 집사진들을 도로와 함께 보여주는 React 애플리케이션입니다.

## 실행 방법

```bash
npm install
npm start
```

## 기능

- 도로가 있는 레이아웃에서 집들을 표시
- 집 타입별 색상 구분 (주거, 상업, 교육)
- 확장 가능한 구조로 새로운 집 추가 가능

## 파일 구조

- `src/components/HouseRoadViewer.js` - 메인 컴포넌트
- `src/data/housesData.js` - 집 데이터 관리
- `src/utils/houseManager.js` - 집 관리 유틸리티 함수

## 집 추가하기

새로운 집을 추가하려면 `src/data/housesData.js`의 `initialHouses` 배열에 다음 형식으로 추가하세요:

```javascript
{
  id: 4,
  name: '새 집',
  image: '/new-house.png',
  position: { x: 800, y: 200 },
  type: 'residential' // residential, commercial, educational, industrial
}
```