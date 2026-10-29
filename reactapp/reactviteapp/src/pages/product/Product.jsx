import axios from "axios";
import { useEffect, useState } from "react";
import ProductCard from "../../components/cards/product/Product";

export default function Product() {
  const [products, setProduct] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [retryCount, setRetryCount] = useState(0);

  useEffect(() => {
    const controller = new AbortController();
    axios
      .get("https://fakestoreapi.com/products", { signal: controller.signal })
      .then((response) => {
        setError("");
        setProduct(response.data);
      })
      .catch((error) => {
        if (!axios.isCancel(error)) {
          console.error("Error fetching product data:", error);
          setError("Products load نہیں ہو سکے۔ دوبارہ کوشش کریں۔");
        }
      })
      .finally(() => {
        if (!controller.signal.aborted) {
          setIsLoading(false);
        }
      });

    return () => controller.abort();
  }, [retryCount]);

  return (
    <div className="page-container">
      <h1 className="main-heading">Explore Our Products</h1>

      {isLoading && (
        <div className="products-status" role="status">
          <span className="loading-spinner" aria-hidden="true" />
          <p>Products load ہو رہے ہیں...</p>
        </div>
      )}

      {!isLoading && error && (
        <div className="products-status products-error" role="alert">
          <p>{error}</p>
          <button
            type="button"
            className="retry-btn"
            onClick={() => {
              setIsLoading(true);
              setRetryCount((count) => count + 1);
            }}
          >
            دوبارہ کوشش کریں
          </button>
        </div>
      )}

      {!isLoading && !error && (
        <div className="products-grid">
          {products.map((item) => (
            <ProductCard key={item.id} product={item} />
          ))}
        </div>
      )}
    </div>
  );
}