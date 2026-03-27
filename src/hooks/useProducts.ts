import { useProductStore } from '../stores/productStore';

export function useProducts() {
  const { 
    products, 
    currentProduct, 
    pagination, 
    adminProducts,
    isLoading, 
    isLoadingProduct,
    error,
    productError,
    message,
    listProducts, 
    getProductById,
    clearCurrentProduct,
    clearErrors,
    setLoading,
    listAdminProducts,
    createProduct,
    updateProduct,
    deleteProduct
  } = useProductStore();

  return {
    products,
    currentProduct,
    pagination,
    adminProducts,
    isLoading,
    isLoadingProduct,
    error,
    productError,
    message,
    listProducts,
    getProduct: getProductById,
    clearCurrentProduct,
    clearErrors,
    setLoading,
    // Admin methods
    listAdminProducts,
    createProduct,
    updateProduct,
    deleteProduct
  };
}
