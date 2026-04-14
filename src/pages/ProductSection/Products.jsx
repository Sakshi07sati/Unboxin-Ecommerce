import { useSelector, useDispatch } from "react-redux";
import { useEffect } from "react";
import { fetchProducts } from "../../global_redux/features/product/productThunks";
import ProductCard from "../components/Products/ProductCard"; // adjust path

function Products() {
  const dispatch = useDispatch();

  const { products, loading } = useSelector(
    (state) => state.products
  );

  useEffect(() => {
    dispatch(fetchProducts());
  }, [dispatch]);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      {products?.map((product) => (
        <ProductCard key={product._id} product={product} />
      ))}
    </div>
  );
}

export default Products;