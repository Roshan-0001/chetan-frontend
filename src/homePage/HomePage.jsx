
import { useState, useEffect } from "react";
import "./HomePage.css";
import ShopSlider from "../components/shopSlider/shopSlider.jsx";
import ShopMarqueeSlider from "../components/shopMarqueeSlider/shopMarqueeSlider.jsx";
import ShopCategoryViewer from "../components/shopCategoryViewer/ShopCategoryViewer.jsx";


// Welcome Section
export const WelcomeSection = () => (
  <div className="welcome-section">Welcome to Chetan Market</div>
);

// Shops Carousel
export const ShopsCarousel = ({ shops }) => {
  var settings = {
    dots: false,
    infinite: true,
    speed: 1500,
    slidesToShow: 1,
    slidesToScroll: 1,
  };

  return (
    <div className="carousel-card" style={{ width: "80%", margin: "0 auto", textAlign: "center" }}>
      <Slider {...settings}>
        {shops.map((shop, index) => (
          <div key={index} className="category-card">
            <img src={shop.image} alt={shop.name} className="category-image" />
            <div className="category-name">{shop.name}</div>
          </div>
        ))}
      </Slider>
    </div>
  );
};

// Product Categories Section
export const ProductCategories = ({ categories }) => {
  const [layout, setLayout] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setLayout((prev) => (prev + 1) % 3);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className={`categories-container layout-${layout}`}>
      {categories.map((category, index) => (
        <div key={index} className="category-card">
          <img src={category.image} alt={category.name} className="category-image" />
          <div className="category-name">{category.name}</div>
        </div>
      ))}
    </div>
  );
};

// Footer Section
export const Footer = () => (
  <footer className="footer-section">
    <div className="footer-columns">
      <div className="footer-column">
        <h3>Shopping & Categories</h3>
        <p>Men's Shopping</p>
        <p>Women's Shopping</p>
        <p>Kid's Shopping</p>
      </div>
      <div className="footer-column">
        <h3>Useful Links</h3>
        <p>Homepage</p>
        <p>About Us</p>
        <p>Help</p>
        <p>Contact Us</p>
      </div>
      <div className="footer-column">
        <h3>Help & Information</h3>
        <p>FAQ's</p>
        <p>Shipping</p>
        <p>Tracking ID</p>
      </div>
    </div>
    <p className="footer-copy">&copy; 2025 Chetan Market. All Rights Reserved.</p>
  </footer>
);

const getShopData = async () => {
  const url = import.meta.env.VITE_URL;
  try {
    const response = await fetch(`${url}/api/user/view-all-user`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      }, // Include cookies in the request
    });
    if (!response.ok) {
      console.error("Error fetching shop data:", response.statusText);
      throw new Error("Network response was not ok");
    }
    const data = await response.json();
    console.log("Fetched shop data:", data.data);

    return data.data;
  } catch (error) {
    console.error("Failed to fetch shop data:", error);
    return [];
  }
}


// Main Page Component
const HomePage = () => {
  const [shopData, setShopData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const data = await getShopData();
      console.log("Data fetched from API:", data);

      setShopData(data);
    };
    fetchData();
  }, []);

  const categories = ["Clothing", "Electronics", "Grocery"];
  const shops = [
    { name: "Tech Zone", image: "/im2.webp", description: "Best gadgets", category: "Electronics" },
    { name: "Tech Zone", image: "/im2.webp", description: "Best gadgets", category: "Electronics" },
    { name: "Tech Zone", image: "/im2.webp", description: "Best gadgets", category: "Electronics" },
    { name: "Tech Zone", image: "/im2.webp", description: "Best gadgets", category: "Electronics" },
    { name: "Fashion Point", image: "/im2.webp", description: "Latest trends", category: "Clothing" },
    { name: "Fashion Point", image: "/im2.webp", description: "Latest trends", category: "Clothing" },
    { name: "Fashion Point", image: "/im2.webp", description: "Latest trends", category: "Clothing" },
    { name: "Fashion Point", image: "/im2.webp", description: "Latest trends", category: "Clothing" },
    { name: "Fashion Point", image: "/im2.webp", description: "Latest trends", category: "Clothing" },
    { name: "Gadget Store", image: "/im2.webp", description: "Mobile & More", category: "Electronics" },
    { name: "Gadget Store", image: "/im2.webp", description: "Mobile & More", category: "Electronics" },
    { name: "Gadget Store", image: "/im2.webp", description: "Mobile & More", category: "Electronics" },
    { name: "Gadget Store", image: "/im2.webp", description: "Mobile & More", category: "Electronics" },
    { name: "Gadget Store", image: "/im2.webp", description: "Mobile & More", category: "Electronics" },
    { name: "Daily Mart", image: "/im2.webp", description: "Fresh grocery", category: "Grocery" },
    { name: "Daily Mart", image: "/im2.webp", description: "Fresh grocery", category: "Grocery" },
    { name: "Daily Mart", image: "/im2.webp", description: "Fresh grocery", category: "Grocery" },
    { name: "Daily Mart", image: "/im2.webp", description: "Fresh grocery", category: "Grocery" },
    { name: "Daily Mart", image: "/im2.webp", description: "Fresh grocery", category: "Grocery" },
    { name: "Daily Mart", image: "/im2.webp", description: "Fresh grocery", category: "Grocery" },
  ];

  return (
    <div>
      <WelcomeSection />
      <ShopSlider shops={shopData} onCardClick={(shop) => alert(`Clicked on ${shop.name}`)} />
      <ShopMarqueeSlider shops={shopData} />
      {/* <ProductCategories categories={categories} /> */}
      <ShopCategoryViewer categories={categories} shops={shops} />
      <Footer />
    </div>
  );
};


export default HomePage;
