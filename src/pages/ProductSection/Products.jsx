import { useSelector ,useDispatch} from "react-redux";
import { useEffect } from "react";
import {fetchProducts} from "../../global_redux/features/products/productSlice";
import { useScrollToTop } from '../../hooks/useScrollToTop';

function Products() {
  useScrollToTop();
  const dispatch = useDispatch();


  const {products,loading} = useSelector(
    (state) => state.products.products
  );

  useEffect(()=>{
    dispatch(fetchProducts());
  },[dispatch])

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      {products.map((product) => (
        <div key={product.id}>
          <h2>{product.title}</h2>
          <p>${product.price}</p>
        </div>
      ))}
    </div>
  );
}

export default Products;