export const addHouse = (houses, newHouse) => {
  const maxId = Math.max(...houses.map(house => house.id), 0);
  return [...houses, { ...newHouse, id: maxId + 1 }];
};

export const removeHouse = (houses, houseId) => {
  return houses.filter(house => house.id !== houseId);
};

export const updateHouse = (houses, houseId, updates) => {
  return houses.map(house =>
    house.id === houseId ? { ...house, ...updates } : house
  );
};

export const getHousesByType = (houses, type) => {
  return houses.filter(house => house.type === type);
};

export const validateHousePosition = (position, containerSize) => {
  const { x, y } = position;
  const { width = 1000, height = 600 } = containerSize;

  return {
    x: Math.max(0, Math.min(x, width - 100)),
    y: Math.max(0, Math.min(y, height - 100))
  };
};