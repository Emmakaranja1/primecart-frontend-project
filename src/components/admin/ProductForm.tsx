import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { X, Upload, Save, Package, DollarSign, Tag, Info } from 'lucide-react';
import { Button } from '@/ui/Button';
import { Input } from '@/ui/Input';
import { Card, CardContent, CardHeader, CardTitle } from '@/ui/Card';
import { useProductStore } from '../../stores/productStore';
import { toast } from 'sonner';
import { CATEGORIES, BRANDS } from '../../constants/categories';
import type { Product } from '../../api/productService';
import type { AdminCreateProductRequest, AdminUpdateProductRequest } from '../../api/productService';

interface ProductFormProps {
  onClose: () => void;
  initialData?: Product;
}


type ProductFormData = Omit<AdminCreateProductRequest, 'description' | 'category' | 'brand' | 'image'> & {
  description: string;
  category: string;
  brand: string;
  image: string;
};

export default function ProductForm({ onClose, initialData }: ProductFormProps) {
  const { 
    createProduct, 
    updateProduct, 
    listAdminProducts,
    isLoading,
    error,
    message,
    clearErrors 
  } = useProductStore();
  
  const [formData, setFormData] = useState<ProductFormData>({
    title: initialData?.title || '',
    description: initialData?.description || '',
    price: initialData?.price || '',
    quantity: initialData?.quantity || '',
    category: initialData?.category || '',
    brand: initialData?.brand || '',
    image: initialData?.image || '',
    is_active: initialData?.is_active ?? true,
    featured: initialData?.featured ?? false,
  });

  
  useEffect(() => {
    clearErrors();
    return () => clearErrors();
  }, [clearErrors]);

  
  useEffect(() => {
    if (message) {
      toast.success(message);
    }
    if (error) {
      toast.error(error.message || 'An error occurred');
    }
  }, [message, error]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.title || !formData.price || !formData.quantity) {
      toast.error('Please fill in all required fields');
      return;
    }

    clearErrors();
    
    try {
      if (initialData) {
        
        const updateData: AdminUpdateProductRequest = {
          title: formData.title,
          description: formData.description || null,
          price: Number(formData.price),
          quantity: Number(formData.quantity),
          category: formData.category || null,
          brand: formData.brand || null,
          image: formData.image || null,
          is_active: formData.is_active,
          featured: formData.featured,
        };
        
        await updateProduct(initialData.id, updateData);
        toast.success('Product updated successfully');
      } else {
        
        const createData: AdminCreateProductRequest = {
          title: formData.title,
          description: formData.description || null,
          price: Number(formData.price),
          quantity: Number(formData.quantity),
          category: formData.category || null,
          brand: formData.brand || null,
          image: formData.image || null,
          is_active: formData.is_active,
          featured: formData.featured,
        };
        
        await createProduct(createData);
        toast.success('Product created successfully');
      }
      
      
      await listAdminProducts();
      
      onClose();
    } catch (error) {
      
      console.error('Product form submission error:', error);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value
    }));
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm"
    >
      <motion.div
        initial={{ scale: 0.9, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.9, y: 20 }}
        className="w-full max-w-2xl"
      >
        <Card className="border-none shadow-2xl dark:bg-slate-900 rounded-[2.5rem] overflow-hidden">
          <CardHeader className="p-8 border-b border-slate-100 dark:border-slate-800 flex flex-row items-center justify-between bg-white dark:bg-slate-900 sticky top-0 z-10">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary">
                <Package className="w-6 h-6" />
              </div>
              <div>
                <CardTitle className="text-2xl font-black tracking-tight dark:text-white">
                  {initialData ? 'Edit Product' : 'Add New Product'}
                </CardTitle>
                <p className="text-sm text-slate-500 dark:text-slate-400 font-medium">
                  {initialData ? 'Update existing product details' : 'Fill in the details for your new product'}
                </p>
              </div>
            </div>
            <button 
              onClick={onClose}
              className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl text-slate-400 transition-all"
            >
              <X className="w-6 h-6" />
            </button>
          </CardHeader>

          <CardContent className="p-8 max-h-[70vh] overflow-y-auto custom-scrollbar">
            <form id="product-form" onSubmit={handleSubmit} className="space-y-8">
              {/* Basic Info */}
              <div className="space-y-4">
                <label className="text-xs font-black uppercase tracking-widest text-slate-400 dark:text-slate-500 flex items-center">
                  <Info className="w-3 h-3 mr-2" />
                  Basic Information
                </label>
                <div className="grid grid-cols-1 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-slate-700 dark:text-slate-300 ml-1">Product Title *</label>
                    <Input
                      name="title"
                      value={formData.title}
                      onChange={handleChange}
                      placeholder="e.g. Premium Wireless Headphones"
                      className="rounded-2xl h-12 bg-slate-50 dark:bg-slate-800 border-none dark:text-white"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-slate-700 dark:text-slate-300 ml-1">Description</label>
                    <textarea
                      name="description"
                      value={formData.description}
                      onChange={handleChange}
                      placeholder="Tell customers about this product..."
                      className="w-full min-h-[120px] p-4 rounded-2xl bg-slate-50 dark:bg-slate-800 border-none dark:text-white text-sm focus:ring-2 focus:ring-primary outline-none transition-all resize-none"
                    />
                  </div>
                </div>
              </div>

              {/* Pricing & Stock */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-4">
                  <label className="text-xs font-black uppercase tracking-widest text-slate-400 dark:text-slate-500 flex items-center">
                    <DollarSign className="w-3 h-3 mr-2" />
                    Pricing
                  </label>
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-slate-700 dark:text-slate-300 ml-1">Price *</label>
                    <Input
                      type="number"
                      name="price"
                      value={formData.price}
                      onChange={handleChange}
                      placeholder="0.00"
                      className="rounded-2xl h-12 bg-slate-50 dark:bg-slate-800 border-none dark:text-white"
                      required
                    />
                  </div>
                </div>
                <div className="space-y-4">
                  <label className="text-xs font-black uppercase tracking-widest text-slate-400 dark:text-slate-500 flex items-center">
                    <Package className="w-3 h-3 mr-2" />
                    Inventory
                  </label>
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-slate-700 dark:text-slate-300 ml-1">Stock Quantity *</label>
                    <Input
                      type="number"
                      name="quantity"
                      value={formData.quantity}
                      onChange={handleChange}
                      placeholder="0"
                      className="rounded-2xl h-12 bg-slate-50 dark:bg-slate-800 border-none dark:text-white"
                      required
                    />
                  </div>
                </div>
              </div>

              {/* Category & Brand */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-4">
                  <label className="text-xs font-black uppercase tracking-widest text-slate-400 dark:text-slate-500 flex items-center">
                    <Tag className="w-3 h-3 mr-2" />
                    Categorization
                  </label>
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-slate-700 dark:text-slate-300 ml-1">Category</label>
                    <select
                      name="category"
                      value={formData.category}
                      onChange={handleChange}
                      className="w-full px-4 py-3 rounded-2xl bg-slate-50 dark:bg-slate-800 border-none dark:text-white text-sm focus:ring-2 focus:ring-primary outline-none transition-all"
                    >
                      <option value="">Select a category</option>
                      {CATEGORIES.map((category) => (
                        <option key={category} value={category}>
                          {category}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
                <div className="space-y-4">
                  <label className="text-xs font-black uppercase tracking-widest text-slate-400 dark:text-slate-500 flex items-center invisible">
                    Brand
                  </label>
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-slate-700 dark:text-slate-300 ml-1">Brand</label>
                    <select
                      name="brand"
                      value={formData.brand}
                      onChange={handleChange}
                      className="w-full px-4 py-3 rounded-2xl bg-slate-50 dark:bg-slate-800 border-none dark:text-white text-sm focus:ring-2 focus:ring-primary outline-none transition-all"
                    >
                      <option value="">Select a brand</option>
                      {BRANDS.map((brand) => (
                        <option key={brand} value={brand}>
                          {brand}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>

              {/* Image URL */}
              <div className="space-y-4">
                <label className="text-xs font-black uppercase tracking-widest text-slate-400 dark:text-slate-500 flex items-center">
                  <Upload className="w-3 h-3 mr-2" />
                  Media
                </label>
                <div className="space-y-2">
                  <label className="text-sm font-bold text-slate-700 dark:text-slate-300 ml-1">Image URL</label>
                  <Input
                    name="image"
                    value={formData.image}
                    onChange={handleChange}
                    placeholder="https://example.com/image.jpg"
                    className="rounded-2xl h-12 bg-slate-50 dark:bg-slate-800 border-none dark:text-white"
                  />
                </div>
              </div>

              {/* Status & Featured */}
              <div className="flex flex-wrap gap-6 p-6 rounded-3xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800">
                <label className="flex items-center space-x-3 cursor-pointer group">
                  <div className="relative">
                    <input
                      type="checkbox"
                      name="is_active"
                      checked={formData.is_active}
                      onChange={handleChange}
                      className="sr-only peer"
                    />
                    <div className="w-12 h-6 bg-slate-200 dark:bg-slate-700 rounded-full peer peer-checked:bg-green-500 transition-all"></div>
                    <div className="absolute left-1 top-1 w-4 h-4 bg-white rounded-full peer-checked:translate-x-6 transition-all"></div>
                  </div>
                  <span className="text-sm font-bold text-slate-700 dark:text-slate-300">Active Listing</span>
                </label>

                <label className="flex items-center space-x-3 cursor-pointer group">
                  <div className="relative">
                    <input
                      type="checkbox"
                      name="featured"
                      checked={formData.featured}
                      onChange={handleChange}
                      className="sr-only peer"
                    />
                    <div className="w-12 h-6 bg-slate-200 dark:bg-slate-700 rounded-full peer peer-checked:bg-primary transition-all"></div>
                    <div className="absolute left-1 top-1 w-4 h-4 bg-white rounded-full peer-checked:translate-x-6 transition-all"></div>
                  </div>
                  <span className="text-sm font-bold text-slate-700 dark:text-slate-300">Featured Product</span>
                </label>
              </div>
            </form>
          </CardContent>

          <div className="p-8 border-t border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900 flex items-center justify-end space-x-4">
            <Button 
              variant="outline" 
              onClick={onClose}
              className="rounded-2xl h-12 px-8 font-bold dark:border-slate-800 dark:text-slate-300"
            >
              Cancel
            </Button>
            <Button 
              form="product-form"
              type="submit"
              disabled={isLoading}
              className="rounded-2xl h-12 px-10 font-black shadow-xl shadow-primary/20"
            >
              {isLoading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2" />
                  Saving...
                </>
              ) : (
                <>
                  <Save className="w-5 h-5 mr-2" />
                  {initialData ? 'Update Product' : 'Create Product'}
                </>
              )}
            </Button>
          </div>
        </Card>
      </motion.div>
    </motion.div>
  );
}