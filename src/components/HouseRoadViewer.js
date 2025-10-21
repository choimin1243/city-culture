import React, { useState } from 'react';
import { initialHouses, houseTypes } from '../data/housesData';
import { addHouse, removeHouse, updateHouse } from '../utils/houseManager';
import ApartmentBuilding from './ApartmentBuilding';
import IranCharacter from './IranCharacter';
import './HouseRoadViewer.css';

const HouseRoadViewer = () => {
  const [houses, setHouses] = useState(initialHouses);

  const handleAddHouse = (newHouse) => {
    setHouses(currentHouses => addHouse(currentHouses, newHouse));
  };

  const handleRemoveHouse = (houseId) => {
    setHouses(currentHouses => removeHouse(currentHouses, houseId));
  };

  const handleUpdateHouse = (houseId, updates) => {
    setHouses(currentHouses => updateHouse(currentHouses, houseId, updates));
  };

  return (
    <div className="house-road-container">
      <IranCharacter />
      {/* 도로 */}
      <div className="road-network">
        <div className="horizontal-road road-1"></div>
        <div className="horizontal-road road-2"></div>
        <div className="vertical-road road-3"></div>
        <div className="vertical-road road-4"></div>
        <div className="vertical-road road-5"></div>
      </div>

      {/* 도로를 제외한 순수 녹색 영역들만 div로 지정 */}
      <div className="green-blocks-container">
        {/* 상단 행: 첫 번째 도로 위 */}
        <div className="green-block green-block-top-left">
          {houses.filter(h => h.block.row === 0 && h.block.col === 0).map((house, index) => (
            <div
              key={house.id}
              className="house-in-block"
              style={{
                gridArea: index === 0 ? 'house1' :
                         index === 1 ? 'house2' :
                         index === 2 ? 'house3' : 'restaurant'
              }}
            >
              <img src={house.image} alt={house.name} className={`house-image ${house.className}`} />
            </div>
          ))}
          <div className="block-label" style={{gridArea: 'label'}}>인도인 마을</div>
        </div>

        <div className="green-block green-block-top-center-left">
          <div className="block-label">공원</div>
          {houses.filter(h => h.block.row === 0 && h.block.col === 1).map((house) => (
            <div key={house.id} className="house-in-block">
              <img src={house.image} alt={house.name} className={`house-image ${house.className}`} />
            </div>
          ))}
        </div>

        <div className="green-block green-block-top-center-right">
          <div className="block-label" style={{gridArea: 'label'}}>이슬람사원</div>
          {houses.filter(h => h.block.row === 0 && h.block.col === 2).map((house) => (
            <div key={house.id} className="house-in-block" style={{gridArea: 'mosque'}}>
              <img src={house.image} alt={house.name} className={`house-image ${house.className}`} />
            </div>
          ))}
        </div>

        <div className="green-block green-block-top-right">
          
          {houses.filter(h => h.block.row === 0 && h.block.col === 3).map((house) => (
            <div key={house.id} className="house-in-block">
              <img src={house.image} alt={house.name} className={`house-image ${house.className}`} />
            </div>
          ))}
        </div>

        {/* 중간 행: 두 도로 사이 */}
        <div className="green-block green-block-middle-left">
          <div className="block-label" style={{gridArea: 'label'}}>인도사원</div>
          {houses.filter(h => h.block.row === 1 && h.block.col === 0).map((house, index) => (
            <div
              key={house.id}
              className="house-in-block"
              style={{gridArea: index === 0 ? 'temple1' : 'temple2'}}
            >
              <img src={house.image} alt={house.name} className={`house-image ${house.className}`} />
            </div>
          ))}
        </div>
        <div className="green-block green-block-middle-center-left">
          <div className="block-label">아파트</div>
          {houses.filter(h => h.block.row === 1 && h.block.col === 1).map((house, index) => (
            <div
              key={house.id}
              className="house-in-block"
              style={{
                gridArea: index === 0 ? 'apt1' :
                         index === 1 ? 'apt2' :
                         index === 2 ? 'apt3' : 'apt4'
              }}
            >
              <ApartmentBuilding className={house.className} alt={house.name} />
            </div>
          ))}
        </div>
        <div className="green-block green-block-middle-center-right">
          <div className="block-label" style={{gridArea: 'label'}}>시청</div>
          {houses.filter(h => h.block.row === 1 && h.block.col === 2).map((house) => (
            <div key={house.id} className="house-in-block" style={{gridArea: 'cityhall'}}>
              <img src={house.image} alt={house.name} className={`house-image ${house.className}`} />
            </div>
          ))}
        </div>
        <div className="green-block green-block-middle-right">
          <div className="block-label" style={{gridArea: 'label'}}>사원</div>
          {houses.filter(h => h.block.row === 1 && h.block.col === 3).map((house, index) => (
            <div
              key={house.id}
              className="house-in-block"
              style={{gridArea: index === 0 ? 'temple3' : 'temple4'}}
            >
              <img src={house.image} alt={house.name} className={`house-image ${house.className}`} />
            </div>
          ))}
        </div>

        {/* 하단 행: 두 번째 도로 아래 */}
        <div className="green-block green-block-bottom-left"></div>
        <div className="green-block green-block-bottom-center-right"></div>
        <div className="green-block green-block-bottom-right"></div>
      </div>
    </div>
  );
};

export default HouseRoadViewer;