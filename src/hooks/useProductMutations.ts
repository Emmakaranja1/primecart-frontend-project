import { useCallback } from 'react';
import { useProductStore } from '@/stores/productStore';
import { productService } from '@/api/productService';
import type { AdminCreateProductRequest, AdminUpdateProductRequest } from '@/api/productService';

export function useProductMutations() {
  const { listProducts, setLoading } = useProductStore();

  const createProduct = useCallback(async (data: AdminCreateProductRequest) => {
    setLoading(true);
    try {
      await productService.createProduct(data);
      await listProducts(); 
      return { success: true };
    } catch (error) {
      console.error('Failed to create product:', error);
      return { success: false, error };
    }
  }, [listProducts, setLoading]);

  const updateProduct = useCallback(async (id: number, data: AdminUpdateProductRequest) => {
    setLoading(true);
    try {
      await productService.updateProduct(id, data);
      await listProducts(); 
      return { success: true };
    } catch (error) {
      console.error('Failed to update product:', error);
      return { success: false, error };
    }
  }, [listProducts, setLoading]);

  const deleteProduct = useCallback(async (id: number) => {
    setLoading(true);
    try {
      await productService.deleteProduct(id);
      await listProducts(); 
      return { success: true };
    } catch (error) {
      console.error('Failed to delete product:', error);
      return { success: false, error };
    }
  }, [listProducts, setLoading]);

  return {
    createProduct,
    updateProduct,
    deleteProduct,
  };
}
