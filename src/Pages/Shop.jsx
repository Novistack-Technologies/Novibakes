import React from "react";
import BannerCarousel from "../components/products/BannerCarousel";
import ScrollingBanner from "../components/products/ScrollingBanner";
import Products from "../components/products/Products";
import OrderDetails from "../components/products/OrderDetails";

const Shop = () => {
  return (
    <section id="products" className="py-18 bg-white">
      <ScrollingBanner />
      <BannerCarousel />
        <Products />
      <OrderDetails />
    </section>
  );
};

export default Shop;