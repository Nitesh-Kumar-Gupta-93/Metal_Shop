import React from "react";
import { useLocation } from "react-router-dom";
import ProductSection from "./product_section";

const FilteredProductsPage = () => {
  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const selectedCategory = params.get("category");

  return (
    <div>
      <h2 style={{ textAlign: "center", margin: "20px 0" }}>
        {selectedCategory ? `Showing: ${selectedCategory.toUpperCase()}` : "All Products"}
      </h2>
      <ProductSection selectedCategory={selectedCategory} />
    </div>
  );
};

export default FilteredProductsPage;
