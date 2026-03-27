import React from 'react';
import { Check, CreditCard, ShoppingBag, Truck, Package, XCircle } from 'lucide-react';
import { cn } from '../../utils/helpers';
import { useOrders } from '../../hooks/useOrders';
import type { OrderDetailsData } from '../../api/orderService';

interface CheckoutStepsProps {
  currentStep?: number;
  orderId?: number;
  steps?: string[];
  showOrderStatus?: boolean;
}

type OrderStatus = 'pending' | 'approved' | 'rejected' | 'delivered';


const ORDER_STATUS_STEPS: Record<OrderStatus, number> = {
  pending: 1,      
  approved: 2,     
  rejected: 0,     
  delivered: 4   
};

export const CheckoutSteps: React.FC<CheckoutStepsProps> = ({
  currentStep = 1,
  orderId,
  steps = ['Cart', 'Shipping', 'Payment', 'Confirmation'],
  showOrderStatus = false,
}) => {
  const { getOrderDetails, currentOrder } = useOrders();
  const icons = [ShoppingBag, Truck, CreditCard, Check, Package];
  
  
  React.useEffect(() => {
    if (orderId && showOrderStatus) {
      getOrderDetails(orderId);
    }
  }, [orderId, showOrderStatus, getOrderDetails]);

  
  const getStepFromOrderStatus = (order: OrderDetailsData['order'] | null): number => {
    if (!order) return currentStep;
    
    return ORDER_STATUS_STEPS[order.status as OrderStatus] || currentStep;
  };

  const activeStep = showOrderStatus && currentOrder ? getStepFromOrderStatus(currentOrder) : currentStep;
  const hasError = showOrderStatus && currentOrder?.status === 'rejected';

  return (
    <div className="flex items-center justify-between w-full max-w-4xl mx-auto mb-12 relative">
      {/* Progress Line */}
      <div className="absolute top-1/2 left-0 w-full h-0.5 bg-slate-100 dark:bg-slate-800 -translate-y-1/2 -z-10" />
      <div
        className="absolute top-1/2 left-0 h-0.5 bg-primary -translate-y-1/2 -z-10 transition-all duration-500 ease-in-out"
        style={{ width: `${((activeStep - 1) / (steps.length - 1)) * 100}%` }}
      />

      {steps.map((step, index) => {
        const stepNumber = index + 1;
        const isActive = stepNumber === activeStep;
        const isCompleted = stepNumber < activeStep;
        const Icon = hasError && stepNumber === 1 ? XCircle : icons[index];

        return (
          <div key={step} className="flex flex-col items-center group">
            <div
              className={cn(
                'w-12 h-12 rounded-full flex items-center justify-center transition-all duration-300 border-2',
                hasError && stepNumber === 1
                  ? 'bg-red-500 border-red-500 text-white scale-110 shadow-lg shadow-red-20'
                  : isActive
                  ? 'bg-primary border-primary text-white scale-110 shadow-lg shadow-primary/20'
                  : isCompleted
                  ? 'bg-primary border-primary text-white'
                  : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-400 dark:text-slate-600'
              )}
            >
              {isCompleted ? <Check className="w-6 h-6" /> : <Icon className="w-5 h-5" />}
            </div>
            <span
              className={cn(
                'absolute -bottom-8 text-xs font-bold uppercase tracking-wider transition-colors duration-300 whitespace-nowrap',
                hasError && stepNumber === 1
                  ? 'text-red-500'
                  : isActive
                  ? 'text-primary'
                  : isCompleted
                  ? 'text-slate-900 dark:text-white'
                  : 'text-slate-400 dark:text-slate-600'
              )}
            >
              {step}
            </span>
          </div>
        );
      })}
    </div>
  );
};
