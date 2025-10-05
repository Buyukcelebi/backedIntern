import React, { useEffect, useState } from "react";

function ProductsList() {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    fetch("http://localhost:5001/products")//local
      .then((res) => res.json())
      .then((data) => setProducts(data))
      .catch((err) => console.error(err));
  }, []);

  return (
    <div>
      <h1>Engagement Rings</h1>
      <ul>
        {products.map((product, index) => (
          <li key={index}>
            <h2>{product.name}</h2>
            <p>Weight: {product.weight} g</p>
            <p>Popularity: {product.popularityScore}</p>
            <img src={product.images.yellow} alt={product.name} width={150} />
            <img src={product.images.rose} alt={product.name} width={150} />
            <img src={product.images.white} alt={product.name} width={150} />
          </li>
        ))}
      </ul>
    </div>
  );
}

export default ProductsList;
