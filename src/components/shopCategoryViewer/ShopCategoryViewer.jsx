import React, { useState } from "react";
import "./ShopCategoryViewer.css";

const ShopCategoryViewer = ({ categories, shops }) => {
  const [activeCategory, setActiveCategory] = useState(null);

  const toggleCategory = (category) => {
    setActiveCategory(prev =>
      prev === category ? null : category
    );
  };

  const filteredShops = activeCategory
    ? shops.filter(shop => shop.category === activeCategory)
    : [];

  return (
    <div className="shop-cat-container">
      <h2 className="shop-cat-title">Shop Categories</h2>

      <div className="shop-cat-buttons">
        {categories.map((category, index) => (
          <button
            key={index}
            className={`shop-cat-button ${activeCategory === category ? "active" : ""}`}
            onClick={() => toggleCategory(category)}
          >
            {category}
          </button>
        ))}
      </div>

      <div className={`shop-cat-dropdown ${activeCategory ? "open" : ""}`}>
        {filteredShops.map((shop, index) => (
          <div
            key={index}
            className="shop-cat-card"
            onClick={() => alert(`Clicked on ${shop.name}`)}
          >
            <img src={shop.image} alt={shop.name} className="shop-cat-image" />
            <div className="shop-cat-info">
              <h4>{shop.name}</h4>
              <p>{shop.description}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ShopCategoryViewer;
