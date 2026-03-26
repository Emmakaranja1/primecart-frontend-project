import { useProductStore } from '../stores/productStore';

export function useProducts() {
  const { 
    products, 
    currentProduct, 
    pagination, 
    isLoading, 
    isLoadingProduct,
    error,
    productError,
    listProducts, 
    getProductById,
    clearCurrentProduct,
    clearErrors,
    setLoading
  } = useProductStore();

  return {
    products,
    currentProduct,
    pagination,
    isLoading,
    isLoadingProduct,
    error,
    productError,
    listProducts,
    getProduct: getProductById,
    clearCurrentProduct,
    clearErrors,
    setLoading
  };
}
