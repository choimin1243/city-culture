// 블록 기반 좌표계 정의 (도로 사이의 실제 블록)
export const roadBlocks = {
  // 실제 도로 위치: 수평도로 40%, 80% / 수직도로 20%, 40%, 60%
  // 건물이 수평도로 위쪽에 주로 배치되도록 조정
  rows: [
    { start: 0, end: 40 },    // 상단 블록들 (첫 번째 도로 위)
    { start: 40, end: 80 },   // 중간 블록들 (도로 사이)
    { start: 80, end: 100 }   // 하단 블록들 (두 번째 도로 아래)
  ],
  cols: [
    { start: 0, end: 20 },    // 좌측 블록
    { start: 20, end: 40 },   // 중앙좌 블록
    { start: 40, end: 60 },   // 중앙우 블록
    { start: 60, end: 100 }   // 우측 블록
  ]
};

// 블록 내 위치 계산 함수
export const getBlockPosition = (blockRow, blockCol, offsetX = 50, offsetY = 50) => {
  const row = roadBlocks.rows[blockRow];
  const col = roadBlocks.cols[blockCol];

  const x = col.start + (col.end - col.start) * (offsetX / 100);
  const y = row.start + (row.end - row.start) * (offsetY / 100);

  return { x: `${x}%`, y: `${y}%` };
};

export const initialHouses = [
  {
    id: 1,
    name: '인디언 하우스1',
    image: 'https://cdn.jsdelivr.net/gh/choimin1243/building/INDIANHOUSE.png',
    position: getBlockPosition(0, 0, 50, 20),
    type: 'residential',
    className: 'indian-house-1',
    block: { row: 0, col: 0 }
  },
  {
    id: 2,
    name: '인디언 하우스2',
    image: 'https://cdn.jsdelivr.net/gh/choimin1243/building/INDIANHOUSE.png',
    position: getBlockPosition(0, 0, 50, 35),
    type: 'residential',
    className: 'indian-house-2',
    block: { row: 0, col: 0 }
  },
  {
    id: 3,
    name: '인디언 하우스3',
    image: 'https://cdn.jsdelivr.net/gh/choimin1243/building/INDIANHOUSE.png',
    position: getBlockPosition(0, 0, 50, 50),
    type: 'residential',
    className: 'indian-house-3',
    block: { row: 0, col: 0 }
  },
  {
    id: 6,
    name: '인디언 레스토랑',
    image: 'https://cdn.jsdelivr.net/gh/choimin1243/building/INDIANRESTURANT.png',
    position: getBlockPosition(0, 0, 50, 70),
    type: 'commercial',
    className: 'indian-restaurant',
    block: { row: 0, col: 0 }
  },
  {
    id: 7,
    name: '학교',
    image: '/school.png',
    position: getBlockPosition(0, 3, 50, 50),
    type: 'educational',
    className: 'school-building',
    block: { row: 0, col: 3 }
  },
  {
    id: 8,
    name: '공원1',
    image: 'https://cdn.jsdelivr.net/gh/choimin1243/building/park.png',
    position: getBlockPosition(0, 1, 50, 30),
    type: 'park',
    className: 'park-building-1',
    block: { row: 0, col: 1 }
  },
  {
    id: 9,
    name: '공원2',
    image: 'https://cdn.jsdelivr.net/gh/choimin1243/building/park.png',
    position: getBlockPosition(0, 1, 50, 60),
    type: 'park',
    className: 'park-building-2',
    block: { row: 0, col: 1 }
  },
  {
    id: 10,
    name: '공원3',
    image: 'https://cdn.jsdelivr.net/gh/choimin1243/building/park.png',
    position: getBlockPosition(0, 1, 50, 70),
    type: 'park',
    className: 'park-building-3',
    block: { row: 0, col: 1 }
  },
  {
    id: 11,
    name: '사원1',
    image: 'https://cdn.jsdelivr.net/gh/choimin1243/building/temple.png',
    position: getBlockPosition(0, 0, 500, 30),
    type: 'religious',
    className: 'temple-1',
    block: { row: 0, col: 2 }
  },

  {
    id: 13,
    name: '사원3',
    image: 'https://cdn.jsdelivr.net/gh/choimin1243/building/temple.png',
    position: getBlockPosition(1, 3, 50, 30),
    type: 'religious',
    className: 'temple-3',
    block: { row: 0, col: 2 }
  },
  {
    id: 15,
    name: '아파트1',
    image: 'https://cdn.jsdelivr.net/gh/choimin1243/building/apartment.png',
    position: getBlockPosition(1, 1, 30, 30),
    type: 'residential',
    className: 'apartment-1',
    block: { row: 1, col: 1 }
  },
  {
    id: 16,
    name: '아파트2',
    image: 'https://cdn.jsdelivr.net/gh/choimin1243/building/apartment.png',
    position: getBlockPosition(1, 1, 70, 30),
    type: 'residential',
    className: 'apartment-2',
    block: { row: 1, col: 1 }
  },
  {
    id: 17,
    name: '아파트3',
    image: 'https://cdn.jsdelivr.net/gh/choimin1243/building/apartment.png',
    position: getBlockPosition(1, 1, 30, 70),
    type: 'residential',
    className: 'apartment-3',
    block: { row: 1, col: 1 }
  },
  {
    id: 18,
    name: '아파트4',
    image: 'https://cdn.jsdelivr.net/gh/choimin1243/building/apartment.png',
    position: getBlockPosition(1, 1, 70, 70),
    type: 'residential',
    className: 'apartment-4',
    block: { row: 1, col: 1 }
  },
  {
    id: 19,
    name: '시청',
    image: 'https://cdn.jsdelivr.net/gh/choimin1243/123123@main/city.png',
    position: getBlockPosition(1, 2, 50, 50),
    type: 'government',
    className: 'city-hall',
    block: { row: 1, col: 2 }
  },

];

export const houseTypes = {
  residential: { color: '#FFB6C1', label: '주거' },
  commercial: { color: '#98FB98', label: '상업' },
  educational: { color: '#87CEEB', label: '교육' },
  industrial: { color: '#DDA0DD', label: '산업' },
  park: { color: '#90EE90', label: '공원' },
  religious: { color: '#F0E68C', label: '종교' },
  government: { color: '#B0C4DE', label: '행정' }
};