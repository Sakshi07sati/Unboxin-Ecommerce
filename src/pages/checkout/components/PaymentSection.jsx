// src/pages/checkout/components/PaymentSection.jsx
import React from "react";
import { motion } from "framer-motion";
import { Lock, CreditCard, ShieldCheck, Loader2, AlertCircle } from "lucide-react";

const PaymentSection = ({
  isFormValid,
  processingPayment,
  finalAmount,
  onPaymentClick,
  formData,
  formErrors,
  isBuyNow = false,
}) => {
  // Count unfilled required fields
  const requiredFields = ["name", "email", "phone", "address", "city", "state", "pincode"];
  const errorCount = Object.keys(formErrors).filter((k) => requiredFields.includes(k)).length;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
      className="bg-white rounded-2xl shadow-lg p-6"
    >
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <div className="bg-indigo-100 p-2 rounded-lg">
          <CreditCard className="w-5 h-5 text-indigo-600" />
        </div>
        <h2 className="text-xl font-bold text-gray-900">Place Your Order</h2>
      </div>

      {/* Form validation warning */}
      {!isFormValid && errorCount > 0 && (
        <div className="flex items-start gap-3 bg-amber-50 border border-amber-200 rounded-xl p-3 mb-4">
          <AlertCircle className="w-5 h-5 text-amber-600 mt-0.5 flex-shrink-0" />
          <p className="text-sm text-amber-700">
            Please fill in all required shipping details before placing your order.
          </p>
        </div>
      )}

      {/* Order total */}
      <div className="bg-gray-50 rounded-xl p-4 mb-5 flex items-center justify-between border border-gray-200">
        <span className="text-gray-600 font-medium">Amount to Pay</span>
        <span className="text-2xl font-bold text-gray-900">₹{finalAmount.toFixed(0)}</span>
      </div>

      {/* Place Order Button */}
      <button
        onClick={onPaymentClick}
        disabled={processingPayment}
        className={`w-full flex items-center justify-center gap-3 py-4 rounded-xl font-bold text-base transition-all duration-200 ${
          processingPayment
            ? "bg-gray-400 cursor-not-allowed text-white"
            : isFormValid
            ? "bg-gray-900 hover:bg-gray-800 active:scale-[0.98] text-white shadow-lg"
            : "bg-gray-300 cursor-not-allowed text-gray-500"
        }`}
      >
        {processingPayment ? (
          <>
            <Loader2 className="w-5 h-5 animate-spin" />
            Processing Payment...
          </>
        ) : (
          <>
            <Lock className="w-5 h-5" />
            {isBuyNow ? "Quick Buy Now" : "Place Order"} · ₹{finalAmount.toFixed(0)}
          </>
        )}
      </button>

      {/* Security badge */}
      <div className="flex items-center justify-center gap-2 mt-4 text-sm text-gray-500">
        <ShieldCheck className="w-4 h-4 text-green-500" />
        <span>Pay safely with Cash on Delivery</span>
      </div>

      {/* Terms */}
      <p className="text-xs text-gray-400 text-center mt-3 leading-relaxed">
        By placing your order, you agree to our{" "}
        <span className="underline cursor-pointer hover:text-gray-600">Terms of Service</span> and{" "}
        <span className="underline cursor-pointer hover:text-gray-600">Privacy Policy</span>.
      </p>
    </motion.div>
  );
};

export default PaymentSection;
