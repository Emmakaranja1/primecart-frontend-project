import { ShoppingBag, ArrowRight, ShieldCheck, Truck, RotateCcw } from 'lucide-react';
import { Button } from '@/ui/Button';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/ui/Card';
import { formatCurrency, cn } from '@/utils/helpers';

interface CartSummaryProps {
  totalAmount: number;
  totalQuantity: number;
  onCheckout?: () => void;
  showCheckoutButton?: boolean;
  shippingThreshold?: number;
  shippingCost?: number;
  taxRate?: number;
}

export default function CartSummary({ 
  totalAmount, 
  totalQuantity, 
  onCheckout, 
  showCheckoutButton = true,
  shippingThreshold = 5000,
  shippingCost = 500,
  taxRate = 0.16
}: CartSummaryProps) {
  const shipping = totalAmount > shippingThreshold ? 0 : shippingCost;
  const tax = totalAmount * taxRate;
  const grandTotal = totalAmount + shipping + tax;

  return (
    <div className="space-y-8">
      <Card className="rounded-[2.5rem] border-slate-100 shadow-xl shadow-slate-200/50 overflow-hidden">
        <CardHeader className="bg-slate-50/50 border-b border-slate-100 p-8">
          <CardTitle className="flex items-center space-x-3 text-2xl font-black">
            <ShoppingBag className="w-7 h-7 text-primary" />
            <span>Order Summary</span>
          </CardTitle>
        </CardHeader>
        
        <CardContent className="p-8 space-y-6">
          <div className="flex justify-between items-center">
            <span className="text-slate-500 font-medium">Subtotal ({totalQuantity} items)</span>
            <span className="font-bold text-lg">{formatCurrency(totalAmount)}</span>
          </div>
          
          <div className="flex justify-between items-center">
            <span className="text-slate-500 font-medium">Shipping</span>
            <span className="font-bold text-lg">
              {shipping === 0 ? (
                <span className="text-emerald-500">Free</span>
              ) : (
                formatCurrency(shipping)
              )}
            </span>
          </div>
          
          <div className="flex justify-between items-center">
            <span className="text-slate-500 font-medium">Tax ({(taxRate * 100).toFixed(0)}% VAT)</span>
            <span className="font-bold text-lg">{formatCurrency(tax)}</span>
          </div>
          
          <div className="h-px bg-slate-100 my-2" />
          
          <div className="flex justify-between items-center">
            <span className="text-xl font-black">Grand Total</span>
            <span className="text-3xl font-black text-primary">{formatCurrency(grandTotal)}</span>
          </div>
        </CardContent>
        
        {showCheckoutButton && (
          <CardFooter className="p-8 pt-0">
            <Button 
              className="w-full h-16 rounded-2xl text-lg font-black shadow-xl shadow-primary/20 hover:shadow-2xl hover:shadow-primary/30 transition-all group"
              onClick={onCheckout}
            >
              <span>Proceed to Checkout</span>
              <ArrowRight className="w-6 h-6 ml-2 group-hover:translate-x-1 transition-transform" />
            </Button>
          </CardFooter>
        )}
      </Card>

      {/* Trust Badges */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {[
          { icon: ShieldCheck, label: 'Secure Payment', color: 'text-emerald-500', bg: 'bg-emerald-50' },
          { icon: Truck, label: 'Fast Delivery', color: 'text-blue-500', bg: 'bg-blue-50' },
          { icon: RotateCcw, label: 'Easy Returns', color: 'text-amber-500', bg: 'bg-amber-50' },
        ].map((item, idx) => (
          <div key={idx} className="bg-white p-4 rounded-2xl border border-slate-100 flex flex-col items-center text-center space-y-2">
            <div className={cn("w-10 h-10 rounded-xl flex items-center justify-center", item.bg, item.color)}>
              <item.icon className="w-5 h-5" />
            </div>
            <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">{item.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

