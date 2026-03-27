import React from 'react';
import { CreditCard, Smartphone, Globe, CheckCircle, Clock, Shield, Zap } from 'lucide-react';
import { motion } from 'framer-motion';
import { Card, CardContent } from '../../ui/Card';
import { usePayment } from '../../hooks/usePayment';
import { Badge } from '../../ui/Badge';
import type { PaymentMethodInfo, PaymentGateway } from '../../types/payment';

interface PaymentMethodsProps {
  selectedMethod?: string;
  onMethodSelect?: (method: string) => void;
  className?: string;
}

const methodIcons = {
  MPESA: Smartphone,
  Flutterwave: CreditCard,
  DPO: Globe,
  PesaPal: CreditCard,
};

const methodDetails: Record<PaymentGateway, {
  features: string[];
  processingTime: string;
  security: string;
  color: string;
  bgColor: string;
  textColor: string;
}> = {
  MPESA: {
    features: ['Instant payment', 'Mobile money', 'No card required'],
    processingTime: 'Instant',
    security: 'Bank-grade security',
    color: 'from-green-500 to-emerald-600',
    bgColor: 'bg-green-50',
    textColor: 'text-green-700'
  },
  Flutterwave: {
    features: ['Multiple cards', 'International payments', 'Recurring billing'],
    processingTime: '1-3 minutes',
    security: 'PCI DSS compliant',
    color: 'from-blue-500 to-cyan-600',
    bgColor: 'bg-blue-50',
    textColor: 'text-blue-700'
  },
  DPO: {
    features: ['Enterprise payments', 'Multi-currency', 'Bulk payments'],
    processingTime: '2-5 minutes',
    security: 'Enterprise security',
    color: 'from-purple-500 to-indigo-600',
    bgColor: 'bg-purple-50',
    textColor: 'text-purple-700'
  },
  PesaPal: {
    features: ['Local payments', 'Easy integration', 'Multiple methods'],
    processingTime: 'Instant',
    security: 'SSL encrypted',
    color: 'from-orange-500 to-red-600',
    bgColor: 'bg-orange-50',
    textColor: 'text-orange-700'
  }
};

export default function PaymentMethods({
  selectedMethod,
  onMethodSelect,
  className
}: PaymentMethodsProps) {
  const { paymentMethods, isLoading, getPaymentMethods } = usePayment();

  
  const typedPaymentMethods = paymentMethods as PaymentMethodInfo[] | null;

  React.useEffect(() => {
    getPaymentMethods();
  }, [getPaymentMethods]);

  if (isLoading) {
    return (
      <div className="space-y-4">
        {[...Array(4)].map((_, i) => (
          <Card key={i} className="animate-pulse">
            <CardContent className="p-6">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-slate-200 rounded-xl"></div>
                <div className="flex-1">
                  <div className="h-4 bg-slate-200 rounded mb-2"></div>
                  <div className="h-3 bg-slate-200 rounded w-3/4"></div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className={`space-y-6 ${className}`}>
      <div className="text-center">
        <h3 className="text-2xl font-bold mb-2">Choose Payment Method</h3>
        <p className="text-slate-600">Select your preferred payment gateway</p>
      </div>

      {typedPaymentMethods?.map((method) => {
        const Icon = methodIcons[method.name as keyof typeof methodIcons] || CreditCard;
        const details = methodDetails[method.name as keyof typeof methodDetails];
        const isSelected = selectedMethod === method.name;

        return (
          <motion.div
            key={method.name}
            whileHover={{ scale: 1.02, y: -2 }}
            whileTap={{ scale: 0.98 }}
            transition={{ duration: 0.2 }}
          >
            <Card
              className={`cursor-pointer transition-all duration-300 border-2 ${
                isSelected
                  ? `border-primary bg-primary/5 shadow-xl shadow-primary/10 ${details?.bgColor}`
                  : 'border-slate-200 hover:border-slate-300 hover:shadow-lg'
              }`}
              onClick={() => onMethodSelect?.(method.name)}
            >
              <CardContent className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center space-x-4">
                    <div className={`w-14 h-14 rounded-2xl flex items-center justify-center bg-gradient-to-br ${details?.color || 'from-slate-500 to-slate-600'} text-white shadow-lg`}>
                      <Icon className="w-7 h-7" />
                    </div>

                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-1">
                        <h4 className="font-bold text-xl">{method.display_name}</h4>
                        {method.active && (
                          <Badge variant="default" className="bg-emerald-500 text-xs">
                            Active
                          </Badge>
                        )}
                      </div>
                      <p className="text-slate-600 text-sm leading-relaxed">{method.description}</p>
                    </div>
                  </div>

                  {isSelected && (
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="flex items-center justify-center w-8 h-8 bg-primary rounded-full"
                    >
                      <CheckCircle className="w-5 h-5 text-white" />
                    </motion.div>
                  )}
                </div>

                {/* Unique Features for Each Method */}
                {details && (
                  <div className="mb-4">
                    <div className="flex flex-wrap gap-2 mb-3">
                      {details.features.map((feature, index) => (
                        <Badge key={index} variant="outline" className={`text-xs ${details.textColor} border-current`}>
                          {feature}
                        </Badge>
                      ))}
                    </div>

                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div className="flex items-center space-x-2">
                        <Clock className="w-4 h-4 text-slate-400" />
                        <span className="text-slate-600">{details.processingTime}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Shield className="w-4 h-4 text-slate-400" />
                        <span className="text-slate-600">{details.security}</span>
                      </div>
                    </div>
                  </div>
                )}

                {/* Currencies and Requirements */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <span className="text-sm font-medium text-slate-700">Currencies:</span>
                    <div className="flex space-x-1">
                      {method.currencies.map((currency) => (
                        <Badge key={currency} variant="secondary" className="text-xs px-2 py-0.5">
                          {currency}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  <div className="flex items-center space-x-3 text-sm text-slate-500">
                    {method.requires_phone && (
                      <div className="flex items-center space-x-1">
                        <Smartphone className="w-4 h-4" />
                        <span>Phone</span>
                      </div>
                    )}
                    {method.requires_email && (
                      <div className="flex items-center space-x-1">
                        <Zap className="w-4 h-4" />
                        <span>Email</span>
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        );
      })}

      {!typedPaymentMethods?.length && (
        <div className="text-center py-12">
          <CreditCard className="w-20 h-20 text-slate-300 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-slate-500 mb-2">No payment methods available</h3>
          <p className="text-slate-400">Please check back later or contact support</p>
        </div>
      )}
    </div>
  );
}
