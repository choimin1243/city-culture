import React, { useEffect, useRef, useState } from 'react';
import './IranCharacter.css';
import IndianRestaurantPage from '../pages/IndianRestaurantPage';
import ParkPage from '../pages/ParkPage';
import TemplePage from '../pages/TemplePage';
import ApartmentPage from '../pages/ApartmentPage';
import CityHallPage from '../pages/CityHallPage';
import IslamMosquePage from '../pages/IslamMosquePage';
import StorePage from '../pages/StorePage';
import ConvenienceStorePage from '../pages/ConvenienceStorePage';
import ButcherShopPage from '../pages/ButcherShopPage';

const IranCharacter = () => {
  const canvasRef = useRef(null);
  const gameRef = useRef(null);
  const [showRestaurant, setShowRestaurant] = useState(false);
  const [showPark, setShowPark] = useState(false);
  const [showTemple, setShowTemple] = useState(false);
  const [showApartment, setShowApartment] = useState(false);
  const [showCityHall, setShowCityHall] = useState(false);
  const [showIslamMosque, setShowIslamMosque] = useState(false);
  const [showStore, setShowStore] = useState(false);
  const [showConvenienceStore, setShowConvenienceStore] = useState(false);
  const [showButcherShop, setShowButcherShop] = useState(false);
  const handleExitRestaurantRef = useRef(null);
  const handleExitParkRef = useRef(null);
  const handleExitTempleRef = useRef(null);
  const handleExitApartmentRef = useRef(null);
  const handleExitCityHallRef = useRef(null);
  const handleExitIslamMosqueRef = useRef(null);
  const handleExitStoreRef = useRef(null);
  const handleExitConvenienceStoreRef = useRef(null);
  const handleExitButcherShopRef = useRef(null);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isNearRestaurant, setIsNearRestaurant] = useState(false);
  const [isNearPark, setIsNearPark] = useState(false);
  const [isNearTemple, setIsNearTemple] = useState(false);
  const [isNearApartment, setIsNearApartment] = useState(false);
  const [isNearCityHall, setIsNearCityHall] = useState(false);
  const [isNearIslamMosque, setIsNearIslamMosque] = useState(false);
  const [isNearStore, setIsNearStore] = useState(false);
  const [isNearConvenienceStore, setIsNearConvenienceStore] = useState(false);
  const [isNearButcherShop, setIsNearButcherShop] = useState(false);
  const handleNearRestaurantRef = useRef(null);
  const handleNearParkRef = useRef(null);
  const handleNearTempleRef = useRef(null);
  const handleNearApartmentRef = useRef(null);
  const handleNearCityHallRef = useRef(null);
  const handleNearIslamMosqueRef = useRef(null);
  const handleNearStoreRef = useRef(null);
  const handleNearConvenienceStoreRef = useRef(null);
  const handleNearButcherShopRef = useRef(null);
  const isNearRestaurantRef = useRef(false);
  const isNearParkRef = useRef(false);
  const isNearTempleRef = useRef(false);
  const isNearApartmentRef = useRef(false);
  const isNearCityHallRef = useRef(false);
  const isNearIslamMosqueRef = useRef(false);
  const isNearStoreRef = useRef(false);
  const isNearConvenienceStoreRef = useRef(false);
  const isNearButcherShopRef = useRef(false);

  // 금액과 똥 개수 상태
  const [money, setMoney] = useState(10000);
  const [poopCount, setPoopCount] = useState(0);

  useEffect(() => {
    if (showRestaurant || showPark || showTemple || showApartment || showCityHall || showIslamMosque || showStore || showButcherShop || showConvenienceStore) return; // 레스토랑이나 공원, 사원, 아파트, 시청, 이슬람 사원, 매점, 정육점, 편의점이 표시 중이면 게임 루프 시작하지 않음

    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');

    // 캔버스를 전체 화면 크기로 설정
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    // 레스토랑 이미지 DOM 요소 찾기
    const getRestaurantImageBounds = () => {
      const restaurantImg = document.querySelector('.house-image.indian-restaurant');
      if (restaurantImg) {
        const rect = restaurantImg.getBoundingClientRect();
        return {
          x: rect.left + rect.width / 2,
          y: rect.top + rect.height / 2,
          width: rect.width,
          height: rect.height
        };
      }
      return null;
    };

    // 공원 이미지 DOM 요소 찾기
    const getParkImageBounds = () => {
      const parkElements = document.querySelectorAll('.green-block-top-center-left .house-image');
      if (parkElements.length > 0) {
        const parkImg = parkElements[0]; // 첫 번째 요소가 공원
        const rect = parkImg.getBoundingClientRect();
        return {
          x: rect.left + rect.width / 2,
          y: rect.top + rect.height / 2,
          width: rect.width,
          height: rect.height
        };
      }
      return null;
    };

    // 사원 이미지 DOM 요소 찾기
    const getTempleImageBounds = () => {
      const templeElements = document.querySelectorAll('.green-block-middle-left .house-image');
      if (templeElements.length > 0) {
        const templeImg = templeElements[0]; // 첫 번째 요소가 사원
        const rect = templeImg.getBoundingClientRect();
        return {
          x: rect.left + rect.width / 2,
          y: rect.top + rect.height / 2,
          width: rect.width,
          height: rect.height
        };
      }
      return null;
    };

    // 아파트 이미지 DOM 요소 찾기
    const getApartmentImageBounds = () => {
      const apartmentElements = document.querySelectorAll('.green-block-middle-center-left .apartment-building');
      if (apartmentElements.length > 0) {
        const apartmentImg = apartmentElements[0]; // 첫 번째 요소가 아파트
        const rect = apartmentImg.getBoundingClientRect();
        return {
          x: rect.left + rect.width / 2,
          y: rect.top + rect.height / 2,
          width: rect.width,
          height: rect.height
        };
      }
      return null;
    };

    // 시청 이미지 DOM 요소 찾기
    const getCityHallImageBounds = () => {
      const cityHallElements = document.querySelectorAll('.green-block-middle-center-right .house-image');
      if (cityHallElements.length > 0) {
        const cityHallImg = cityHallElements[0]; // 첫 번째 요소가 시청
        const rect = cityHallImg.getBoundingClientRect();
        return {
          x: rect.left + rect.width / 2,
          y: rect.top + rect.height / 2,
          width: rect.width,
          height: rect.height
        };
      }
      return null;
    };

    // 이슬람 사원 이미지 DOM 요소 찾기
    const getIslamMosqueImageBounds = () => {
      const islamMosqueImg = document.querySelector('.house-image.islam-mosque');
      if (islamMosqueImg) {
        const rect = islamMosqueImg.getBoundingClientRect();
        return {
          x: rect.left + rect.width / 2,
          y: rect.top + rect.height / 2,
          width: rect.width,
          height: rect.height
        };
      }
      return null;
    };

    // 매점 이미지 DOM 요소 찾기
    const getStoreImageBounds = () => {
      const storeImg = document.querySelector('.house-image.store-building');
      if (storeImg) {
        const rect = storeImg.getBoundingClientRect();
        return {
          x: rect.left + rect.width / 2,
          y: rect.top + rect.height / 2,
          width: rect.width,
          height: rect.height
        };
      }
      return null;
    };

    const getButcherShopImageBounds = () => {
      const butcherShopImg = document.querySelector('.house-image.butcher-shop');
      if (butcherShopImg) {
        const rect = butcherShopImg.getBoundingClientRect();
        return {
          x: rect.left + rect.width / 2,
          y: rect.top + rect.height / 2,
          width: rect.width,
          height: rect.height
        };
      }
      return null;
    };

    const getConvenienceStoreImageBounds = () => {
      const convenienceStoreImg = document.querySelector('.house-image.convenience-store');
      if (convenienceStoreImg) {
        const rect = convenienceStoreImg.getBoundingClientRect();
        return {
          x: rect.left + rect.width / 2,
          y: rect.top + rect.height / 2,
          width: rect.width,
          height: rect.height
        };
      }
      return null;
    };

    // 캐릭터 클래스
    class Character {
      constructor(canvasWidth, canvasHeight, initialX, initialY, getRestaurantBounds) {
        // 레스토랑 입구 근처를 기본 위치로 설정
        let defaultX = canvasWidth * 0.10;
        let defaultY = canvasHeight * 0.28 + 100;

        // 실제 레스토랑 이미지 위치가 있으면 그걸 사용
        if (getRestaurantBounds) {
          const bounds = getRestaurantBounds();
          if (bounds) {
            defaultX = bounds.x;
            defaultY = bounds.y + bounds.height / 2 + 80; // 레스토랑 아래쪽
          }
        }

        this.x = initialX !== undefined ? initialX : defaultX;
        this.y = initialY !== undefined ? initialY : defaultY;
        this.width = 60;
        this.height = 60;
        this.speed = 8;
        this.velocityX = 0;
        this.velocityY = 0;
        this.direction = 'front';
        this.isMoving = false;
        this.canvasWidth = canvasWidth;
        this.canvasHeight = canvasHeight;

        // 이미지 로드
        this.images = {};
        this.imagesLoaded = 0;
        this.totalImages = 6;
        this.loadImages();

        // 키 입력
        this.keys = {};
        this.setupEventListeners();

        // 애니메이션 프레임
        this.animationFrame = 0;
        this.animationSpeed = 6;
        this.animationCounter = 0;
      }

      loadImages() {
        const imageNames = [
          'front1_no_bg',
          'front222',
          'left1_no_bg',
          'left2-removebg-preview',
          'right1_no_bg',
          'right2_no_bg'
        ];

        imageNames.forEach(name => {
          const img = new Image();
          img.crossOrigin = 'anonymous';
          img.onload = () => {
            this.imagesLoaded++;
          };
          img.onerror = () => {
            console.error(`Failed to load image: ${name}`);
            this.imagesLoaded++;
          };
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

      update(onNearRestaurant, onNearPark, onNearTemple, onNearApartment, onNearCityHall, onNearIslamMosque, onNearStore, onNearButcherShop, onNearConvenienceStore, getRestaurantBounds, getParkBounds, getTempleBounds, getApartmentBounds, getCityHallBounds, getIslamMosqueBounds, getStoreBounds, getButcherShopBounds, getConvenienceStoreBounds) {
        // 이동 처리
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

        // 즉각적인 반응 (가속도 제거하고 직접 설정)
        this.velocityX = targetVelX;
        this.velocityY = targetVelY;

        // 이동 여부 확인
        this.isMoving = Math.abs(this.velocityX) > 0.1 || Math.abs(this.velocityY) > 0.1;

        if (this.isMoving) {
          this.direction = newDirection;
        }

        // 위치 업데이트
        this.x += this.velocityX;
        this.y += this.velocityY;

        // 경계 체크
        this.x = Math.max(this.width / 2, Math.min(this.canvasWidth - this.width / 2, this.x));
        this.y = Math.max(this.height / 2, Math.min(this.canvasHeight - this.height / 2, this.y));

        // 레스토랑 근처 여부 체크 (실제 DOM 이미지 위치 기반)
        let isNearRestaurant = false;
        if (getRestaurantBounds) {
          const restaurantBounds = getRestaurantBounds();
          if (restaurantBounds) {
            const dx = this.x - restaurantBounds.x;
            const dy = this.y - restaurantBounds.y;
            const distance = Math.sqrt(dx * dx + dy * dy);
            // 레스토랑 이미지 크기의 절반 + 여유 공간
            const triggerDistance = Math.max(restaurantBounds.width, restaurantBounds.height) / 2 + 50;
            isNearRestaurant = distance < triggerDistance;
          }
        }

        if (onNearRestaurant) {
          onNearRestaurant(isNearRestaurant);
        }

        // 공원 근처 여부 체크 (실제 DOM 이미지 위치 기반)
        let isNearPark = false;
        if (getParkBounds) {
          const parkBounds = getParkBounds();
          if (parkBounds) {
            const dx = this.x - parkBounds.x;
            const dy = this.y - parkBounds.y;
            const distance = Math.sqrt(dx * dx + dy * dy);
            // 공원 이미지 크기의 절반 + 여유 공간
            const triggerDistance = Math.max(parkBounds.width, parkBounds.height) / 2 + 50;
            isNearPark = distance < triggerDistance;
          }
        }

        if (onNearPark) {
          onNearPark(isNearPark);
        }

        // 사원 근처 여부 체크 (실제 DOM 이미지 위치 기반)
        let isNearTemple = false;
        if (getTempleBounds) {
          const templeBounds = getTempleBounds();
          if (templeBounds) {
            const dx = this.x - templeBounds.x;
            const dy = this.y - templeBounds.y;
            const distance = Math.sqrt(dx * dx + dy * dy);
            // 사원 이미지 크기의 절반 + 여유 공간
            const triggerDistance = Math.max(templeBounds.width, templeBounds.height) / 2 + 50;
            isNearTemple = distance < triggerDistance;
          }
        }

        if (onNearTemple) {
          onNearTemple(isNearTemple);
        }

        // 아파트 근처 여부 체크 (실제 DOM 이미지 위치 기반)
        let isNearApartment = false;
        if (getApartmentBounds) {
          const apartmentBounds = getApartmentBounds();
          if (apartmentBounds) {
            const dx = this.x - apartmentBounds.x;
            const dy = this.y - apartmentBounds.y;
            const distance = Math.sqrt(dx * dx + dy * dy);
            // 아파트 이미지 크기의 절반 + 여유 공간
            const triggerDistance = Math.max(apartmentBounds.width, apartmentBounds.height) / 2 + 50;
            isNearApartment = distance < triggerDistance;
          }
        }

        if (onNearApartment) {
          onNearApartment(isNearApartment);
        }

        // 시청 근처 여부 체크 (실제 DOM 이미지 위치 기반)
        let isNearCityHall = false;
        if (getCityHallBounds) {
          const cityHallBounds = getCityHallBounds();
          if (cityHallBounds) {
            const dx = this.x - cityHallBounds.x;
            const dy = this.y - cityHallBounds.y;
            const distance = Math.sqrt(dx * dx + dy * dy);
            // 시청 이미지 크기의 절반 + 여유 공간
            const triggerDistance = Math.max(cityHallBounds.width, cityHallBounds.height) / 2 + 50;
            isNearCityHall = distance < triggerDistance;
          }
        }

        if (onNearCityHall) {
          onNearCityHall(isNearCityHall);
        }

        // 이슬람 사원 근처 여부 체크 (실제 DOM 이미지 위치 기반)
        let isNearIslamMosque = false;
        if (getIslamMosqueBounds) {
          const islamMosqueBounds = getIslamMosqueBounds();
          if (islamMosqueBounds) {
            const dx = this.x - islamMosqueBounds.x;
            const dy = this.y - islamMosqueBounds.y;
            const distance = Math.sqrt(dx * dx + dy * dy);
            // 이슬람 사원 이미지 크기의 절반 + 여유 공간
            const triggerDistance = Math.max(islamMosqueBounds.width, islamMosqueBounds.height) / 2 + 50;
            isNearIslamMosque = distance < triggerDistance;
          }
        }

        if (onNearIslamMosque) {
          onNearIslamMosque(isNearIslamMosque);
        }

        // 매점 근처 여부 체크 (실제 DOM 이미지 위치 기반)
        let isNearStore = false;
        if (getStoreBounds) {
          const storeBounds = getStoreBounds();
          if (storeBounds) {
            const dx = this.x - storeBounds.x;
            const dy = this.y - storeBounds.y;
            const distance = Math.sqrt(dx * dx + dy * dy);
            // 매점 이미지 크기의 절반 + 여유 공간
            const triggerDistance = Math.max(storeBounds.width, storeBounds.height) / 2 + 50;
            isNearStore = distance < triggerDistance;
          }
        }

        if (onNearStore) {
          onNearStore(isNearStore);
        }

        // 정육점 근처 여부 체크 (실제 DOM 이미지 위치 기반)
        let isNearButcherShop = false;
        if (getButcherShopBounds) {
          const butcherShopBounds = getButcherShopBounds();
          if (butcherShopBounds) {
            const dx = this.x - butcherShopBounds.x;
            const dy = this.y - butcherShopBounds.y;
            const distance = Math.sqrt(dx * dx + dy * dy);
            const triggerDistance = Math.max(butcherShopBounds.width, butcherShopBounds.height) / 2 + 50;
            isNearButcherShop = distance < triggerDistance;
          }
        }

        if (onNearButcherShop) {
          onNearButcherShop(isNearButcherShop);
        }

        // 편의점 근처 여부 체크
        let isNearConvenienceStore = false;
        if (getConvenienceStoreBounds) {
          const convenienceStoreBounds = getConvenienceStoreBounds();
          if (convenienceStoreBounds) {
            const dx = this.x - convenienceStoreBounds.x;
            const dy = this.y - convenienceStoreBounds.y;
            const distance = Math.sqrt(dx * dx + dy * dy);
            const triggerDistance = Math.max(convenienceStoreBounds.width, convenienceStoreBounds.height) / 2 + 50;
            isNearConvenienceStore = distance < triggerDistance;
          }
        }

        if (onNearConvenienceStore) {
          onNearConvenienceStore(isNearConvenienceStore);
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

      setPosition(x, y) {
        this.x = x;
        this.y = y;
        this.velocityX = 0;
        this.velocityY = 0;
      }

      draw(ctx) {
        // 그림자
        ctx.fillStyle = 'rgba(0, 0, 0, 0.3)';
        ctx.beginPath();
        ctx.ellipse(
          this.x,
          this.y + this.height / 2 + 5,
          this.width * 0.3,
          this.height * 0.1,
          0, 0, Math.PI * 2
        );
        ctx.fill();

        // 캐릭터 이미지 선택
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
          const targetWidth = this.width;
          const targetHeight = this.height;
          const imgRatio = img.width / img.height;
          const targetRatio = targetWidth / targetHeight;

          let drawWidth, drawHeight, offsetX, offsetY;

          if (imgRatio > targetRatio) {
            drawWidth = targetWidth;
            drawHeight = targetWidth / imgRatio;
            offsetX = 0;
            offsetY = (targetHeight - drawHeight) / 2;
          } else {
            drawHeight = targetHeight;
            drawWidth = targetHeight * imgRatio;
            offsetX = (targetWidth - drawWidth) / 2;
            offsetY = 0;
          }

          ctx.drawImage(
            img,
            this.x - this.width / 2 + offsetX,
            this.y - this.height / 2 + offsetY,
            drawWidth,
            drawHeight
          );
        }
      }
    }

    // 이전 캐릭터의 이벤트 리스너 정리
    if (gameRef.current && gameRef.current.cleanup) {
      gameRef.current.cleanup();
    }

    const character = new Character(canvas.width, canvas.height, undefined, undefined, getRestaurantImageBounds);
    gameRef.current = character;

    // handleNearRestaurant를 ref에 저장
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

    // handleNearPark를 ref에 저장
    handleNearParkRef.current = (isNear) => {
      isNearParkRef.current = isNear;
      // 상태가 실제로 변경될 때만 setState 호출
      setIsNearPark(prev => {
        if (prev !== isNear) {
          return isNear;
        }
        return prev;
      });
    };

    // handleNearTemple를 ref에 저장
    handleNearTempleRef.current = (isNear) => {
      isNearTempleRef.current = isNear;
      // 상태가 실제로 변경될 때만 setState 호출
      setIsNearTemple(prev => {
        if (prev !== isNear) {
          return isNear;
        }
        return prev;
      });
    };

    // handleNearApartment를 ref에 저장
    handleNearApartmentRef.current = (isNear) => {
      isNearApartmentRef.current = isNear;
      // 상태가 실제로 변경될 때만 setState 호출
      setIsNearApartment(prev => {
        if (prev !== isNear) {
          return isNear;
        }
        return prev;
      });
    };

    // handleNearCityHall를 ref에 저장
    handleNearCityHallRef.current = (isNear) => {
      isNearCityHallRef.current = isNear;
      // 상태가 실제로 변경될 때만 setState 호출
      setIsNearCityHall(prev => {
        if (prev !== isNear) {
          return isNear;
        }
        return prev;
      });
    };

    // handleNearIslamMosque를 ref에 저장
    handleNearIslamMosqueRef.current = (isNear) => {
      isNearIslamMosqueRef.current = isNear;
      // 상태가 실제로 변경될 때만 setState 호출
      setIsNearIslamMosque(prev => {
        if (prev !== isNear) {
          return isNear;
        }
        return prev;
      });
    };

    // handleNearStore를 ref에 저장
    handleNearStoreRef.current = (isNear) => {
      isNearStoreRef.current = isNear;
      // 상태가 실제로 변경될 때만 setState 호출
      setIsNearStore(prev => {
        if (prev !== isNear) {
          return isNear;
        }
        return prev;
      });
    };

    handleNearButcherShopRef.current = (isNear) => {
      isNearButcherShopRef.current = isNear;
      setIsNearButcherShop(prev => {
        if (prev !== isNear) {
          return isNear;
        }
        return prev;
      });
    };

    handleNearConvenienceStoreRef.current = (isNear) => {
      isNearConvenienceStoreRef.current = isNear;
      setIsNearConvenienceStore(prev => {
        if (prev !== isNear) {
          return isNear;
        }
        return prev;
      });
    };

    // Exit handler들을 ref에 저장
    handleExitRestaurantRef.current = () => {
      // 레스토랑 닫기
      setShowRestaurant(false);
    };

    handleExitParkRef.current = () => {
      // 공원 닫기
      setShowPark(false);
    };

    handleExitTempleRef.current = () => {
      // 사원 닫기
      setShowTemple(false);
    };

    handleExitApartmentRef.current = () => {
      // 아파트 닫기
      setShowApartment(false);
    };

    handleExitCityHallRef.current = () => {
      // 시청 닫기
      setShowCityHall(false);
    };

    handleExitIslamMosqueRef.current = () => {
      // 이슬람 사원 닫기
      setShowIslamMosque(false);
    };

    handleExitStoreRef.current = () => {
      // 매점 닫기
      setShowStore(false);
    };

    const gameLoop = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // ref를 통해 호출, DOM 요소 위치 함수도 전달
      if (handleNearRestaurantRef.current && handleNearParkRef.current && handleNearTempleRef.current && handleNearApartmentRef.current && handleNearCityHallRef.current && handleNearIslamMosqueRef.current && handleNearStoreRef.current && handleNearButcherShopRef.current && handleNearConvenienceStoreRef.current) {
        character.update(
          handleNearRestaurantRef.current,
          handleNearParkRef.current,
          handleNearTempleRef.current,
          handleNearApartmentRef.current,
          handleNearCityHallRef.current,
          handleNearIslamMosqueRef.current,
          handleNearStoreRef.current,
          handleNearButcherShopRef.current,
          handleNearConvenienceStoreRef.current,
          getRestaurantImageBounds,
          getParkImageBounds,
          getTempleImageBounds,
          getApartmentImageBounds,
          getCityHallImageBounds,
          getIslamMosqueImageBounds,
          getStoreImageBounds,
          getButcherShopImageBounds,
          getConvenienceStoreImageBounds
        );
      }

      character.draw(ctx);

      requestAnimationFrame(gameLoop);
    };

    gameLoop();

    // 윈도우 리사이즈 처리
    const handleResize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      if (gameRef.current) {
        gameRef.current.canvasWidth = canvas.width;
        gameRef.current.canvasHeight = canvas.height;
      }
    };

    window.addEventListener('resize', handleResize);

    // 마우스 위치 추적
    const handleMouseMove = (e) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };

    window.addEventListener('mousemove', handleMouseMove);

    return () => {
      // 클린업
      if (character && character.cleanup) {
        character.cleanup();
      }
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, [showRestaurant, showPark, showTemple, showApartment, showCityHall, showIslamMosque, showStore, showButcherShop, showConvenienceStore]); // 건물 표시 상태가 변경되면 useEffect 재실행

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
            rect.left + rect.width / 2,
            rect.bottom + 80
          );
        }
      }
    }, 100);
  };

  const handleExitPark = () => {
    if (handleExitParkRef.current) {
      handleExitParkRef.current();
    }
    // 공원 아래쪽으로 캐릭터 위치 이동
    setTimeout(() => {
      if (gameRef.current) {
        const parkBounds = document.querySelectorAll('.green-block-top-center-left .house-image');
        if (parkBounds.length > 0) {
          const rect = parkBounds[0].getBoundingClientRect();
          gameRef.current.setPosition(
            rect.left + rect.width / 2,
            rect.bottom + 80
          );
        }
      }
    }, 100);
  };

  const handleEnterRestaurant = () => {
    setShowRestaurant(true);
  };

  const handleEnterPark = () => {
    setShowPark(true);
  };

  const handleExitTemple = () => {
    if (handleExitTempleRef.current) {
      handleExitTempleRef.current();
    }
    // 사원 아래쪽으로 캐릭터 위치 이동
    setTimeout(() => {
      if (gameRef.current) {
        const templeBounds = document.querySelectorAll('.green-block-middle-left .house-image');
        if (templeBounds.length > 0) {
          const rect = templeBounds[0].getBoundingClientRect();
          gameRef.current.setPosition(
            rect.left + rect.width / 2,
            rect.bottom + 80
          );
        }
      }
    }, 100);
  };

  const handleEnterTemple = () => {
    setShowTemple(true);
  };

  const handleExitApartment = () => {
    if (handleExitApartmentRef.current) {
      handleExitApartmentRef.current();
    }
    // 아파트 아래쪽으로 캐릭터 위치 이동
    setTimeout(() => {
      if (gameRef.current) {
        const apartmentBounds = document.querySelector('.green-block-middle-center-left .apartment-building');
        if (apartmentBounds) {
          const rect = apartmentBounds.getBoundingClientRect();
          gameRef.current.setPosition(
            rect.left + rect.width / 2,
            rect.bottom + 80
          );
        }
      }
    }, 100);
  };

  const handleEnterApartment = () => {
    setShowApartment(true);
  };

  const handleExitCityHall = () => {
    if (handleExitCityHallRef.current) {
      handleExitCityHallRef.current();
    }
    // 시청 아래쪽으로 캐릭터 위치 이동
    setTimeout(() => {
      if (gameRef.current) {
        const cityHallBounds = document.querySelectorAll('.green-block-middle-center-right .house-image');
        if (cityHallBounds.length > 0) {
          const rect = cityHallBounds[0].getBoundingClientRect();
          gameRef.current.setPosition(
            rect.left + rect.width / 2,
            rect.bottom + 80
          );
        }
      }
    }, 100);
  };

  const handleEnterCityHall = () => {
    setShowCityHall(true);
  };

  const handleExitIslamMosque = () => {
    if (handleExitIslamMosqueRef.current) {
      handleExitIslamMosqueRef.current();
    }
    // 이슬람 사원 아래쪽으로 캐릭터 위치 이동
    setTimeout(() => {
      if (gameRef.current) {
        const islamMosqueImg = document.querySelector('.house-image.islam-mosque');
        if (islamMosqueImg) {
          const rect = islamMosqueImg.getBoundingClientRect();
          gameRef.current.setPosition(
            rect.left + rect.width / 2,
            rect.bottom + 80
          );
        }
      }
    }, 100);
  };

  const handleEnterIslamMosque = () => {
    setShowIslamMosque(true);
  };

  const handleExitStore = () => {
    if (handleExitStoreRef.current) {
      handleExitStoreRef.current();
    }
    // 매점 아래쪽으로 캐릭터 위치 이동
    setTimeout(() => {
      if (gameRef.current) {
        const storeImg = document.querySelector('.house-image.store-building');
        if (storeImg) {
          const rect = storeImg.getBoundingClientRect();
          gameRef.current.setPosition(
            rect.left + rect.width / 2,
            rect.bottom + 80
          );
        }
      }
    }, 100);
  };

  const handleEnterStore = () => {
    setShowStore(true);
  };

  const handleExitButcherShop = () => {
    if (handleExitButcherShopRef.current) {
      handleExitButcherShopRef.current();
    }
    setTimeout(() => {
      if (gameRef.current) {
        const butcherShopImg = document.querySelector('.house-image.butcher-shop');
        if (butcherShopImg) {
          const rect = butcherShopImg.getBoundingClientRect();
          gameRef.current.setPosition(
            rect.left + rect.width / 2,
            rect.top + rect.height / 2 + 80
          );
        }
      }
    }, 0);
    setShowButcherShop(false);
  };

  const handleEnterButcherShop = () => {
    setShowButcherShop(true);
  };

  const handleExitConvenienceStore = () => {
    if (handleExitConvenienceStoreRef.current) {
      handleExitConvenienceStoreRef.current();
    }
    setTimeout(() => {
      if (gameRef.current) {
        const convenienceStoreImg = document.querySelector('.house-image.convenience-store');
        if (convenienceStoreImg) {
          const rect = convenienceStoreImg.getBoundingClientRect();
          gameRef.current.setPosition(
            rect.left + rect.width / 2,
            rect.top + rect.height / 2 + 80
          );
        }
      }
    }, 0);
    setShowConvenienceStore(false);
  };

  const handleEnterConvenienceStore = () => {
    setShowConvenienceStore(true);
  };

  if (showRestaurant) {
    return <IndianRestaurantPage onExit={handleExitRestaurant} />;
  }

  if (showPark) {
    return <ParkPage onExit={handleExitPark} poopCount={poopCount} setPoopCount={setPoopCount} />;
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

  if (showIslamMosque) {
    return <IslamMosquePage onExit={handleExitIslamMosque} />;
  }

  if (showStore) {
    return <StorePage onExit={handleExitStore} />;
  }

  if (showButcherShop) {
    return <ButcherShopPage onExit={handleExitButcherShop} />;
  }

  if (showConvenienceStore) {
    return <ConvenienceStorePage onExit={handleExitConvenienceStore} />;
  }

  return (
    <>
      <canvas
        ref={canvasRef}
        className="iran-character-canvas-fullscreen"
      />

      {/* 금액과 똥 개수 표시 */}
      <div className="stats-overlay">
        <div className="stat-item">
          <span className="stat-icon">💰</span>
          <span className="stat-value">{money.toLocaleString()}원</span>
        </div>
        <div className="stat-item">
          <span className="stat-icon">💩</span>
          <span className="stat-value">{poopCount}개</span>
        </div>
      </div>

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
      {isNearIslamMosque && (
        <div className="islam-mosque-entrance-button-overlay">
          <button onClick={handleEnterIslamMosque} className="islam-mosque-entrance-button">
            🕌 이슬람 사원 들어가기
          </button>
        </div>
      )}
      {isNearStore && (
        <div className="store-entrance-button-overlay">
          <button onClick={handleEnterStore} className="store-entrance-button">
            🧕 히잡 가게 들어가기
          </button>
        </div>
      )}

      {isNearButcherShop && (
        <div className="store-entrance-button-overlay">
          <button onClick={handleEnterButcherShop} className="store-entrance-button">
            🥩 정육점 들어가기
          </button>
        </div>
      )}

      {isNearConvenienceStore && (
        <div className="store-entrance-button-overlay">
          <button onClick={handleEnterConvenienceStore} className="store-entrance-button">
            🏪 편의점 들어가기
          </button>
        </div>
      )}

    </>
  );
};

export default IranCharacter;
