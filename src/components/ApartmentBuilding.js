import React from 'react';
import './ApartmentBuilding.css';

const ApartmentBuilding = ({ className, alt }) => {
  // 각 아파트마다 1-2개 동
  const buildingCounts = {
    'apartment-1': 2,
    'apartment-2': 1,
    'apartment-3': 2,
    'apartment-4': 1
  };

  const count = buildingCounts[className] || 2;

  return (
    <div className={`apartment-complex ${className}`}>
      {[...Array(count)].map((_, buildingIndex) => (
        <div key={buildingIndex} className="apartment-building">
          <div className="building-roof"></div>
          <div className="building-body">
            {/* 12-15층 아파트 (동마다 다름) */}
            {[...Array(12 + (buildingIndex % 3))].map((_, floor) => (
              <div key={floor} className="floor">
                {/* 각 층에 4개의 창문 */}
                {[...Array(4)].map((_, window) => (
                  <div key={window} className="window"></div>
                ))}
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

export default ApartmentBuilding;
