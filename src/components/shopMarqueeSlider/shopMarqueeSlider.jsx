import React from "react";
import "./ShopMarqueeSlider.css";

export default function ShopMarqueeSlider({ shops = [] }) {
  // Duplicate data to achieve seamless loop effect
  const loopShops = [...shops, ...shops];

  return (
    <div className="marquee-container">
      <div className="marquee-track">
        {loopShops.map((shop, index) => (
          <div className="shop-card" key={index}>
            <img src={shop.profileImage} alt={shop.name} className="shop-image" />
            <h3 className="shop-name">{shop.username}</h3>
            <p className="shop-description">{shop.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
