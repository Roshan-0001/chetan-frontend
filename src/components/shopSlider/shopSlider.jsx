import React, { useEffect, useRef, useState } from "react";
import "./shopSlider.css";

export default function ShopSlider({ shops, onCardClick }) {
  const scrollRef = useRef(null);
  const [shopList, setShopList] = useState([]);

// Whenever `shops` changes (from props), update `shopList`
useEffect(() => {
  if (shops && shops.length > 0) {
    setShopList([...shops, ...shops]); // duplicate for smooth infinite scroll
  }
}, [shops]);


  // Auto-scroll card by card
  useEffect(() => {
    const container = scrollRef.current;
    const card = container?.querySelector(".shop-card");
    if (!card) return;

    const cardWidth = card.offsetWidth + 16;

    const interval = setInterval(() => {
      container.scrollBy({ left: cardWidth, behavior: "smooth" });

      // If near the end, append the original shops
      const maxScrollLeft = container.scrollWidth - container.clientWidth;
      if (container.scrollLeft >= maxScrollLeft - cardWidth * 2) {
        setShopList((prev) => [...prev, ...shops]);
      }
    }, 3000);

    return () => clearInterval(interval);
  }, [shops]);

  const scroll = (direction) => {
    const container = scrollRef.current;
    const card = container?.querySelector(".shop-card");
    if (!card) return;

    const cardWidth = card.offsetWidth + 16;
    container.scrollBy({
      left: direction === "left" ? -cardWidth : cardWidth,
      behavior: "smooth",
    });

    // If manually near end, duplicate
    if (direction === "right") {
      const maxScrollLeft = container.scrollWidth - container.clientWidth;
      if (container.scrollLeft >= maxScrollLeft - cardWidth * 2) {
        setShopList((prev) => [...prev, ...shops]);
      }
    }
  };

  return (
    <div className="shop-slider-container">
      <button className="scroll-button left" onClick={() => scroll("left")}>⬅️</button>

      <div className="shop-slider" ref={scrollRef}>
        {shopList.map((shop, index) => (
          <div className="shop-card" key={index} onClick={() => onCardClick?.(shop)}>
            <img src={shop.profileImage} alt={shop.username} className="shop-image" />
            <h3 className="shop-name">{shop.username}</h3>
            <p className="shop-description">{shop.description}</p>
          </div>
        ))}
      </div>

      <button className="scroll-button right" onClick={() => scroll("right")}>➡️</button>
    </div>
  );
}
