// src/pages/Checkout/CheckoutForm.jsx
import React from "react";
import { User, Mail, Phone, MapPin, Navigation, Map } from "lucide-react";

const CheckoutForm = ({ 
  formData, 
  formErrors, 
  touchedFields, 
  onInputChange, 
  onFieldBlur 
}) => {
  const inputFields = [
    {
      id: "name",
      label: "Full Name",
      type: "text",
      placeholder: "Enter your full name",
      icon: User,
      required: true,
    },
    {
      id: "email",
      label: "Email Address",
      type: "email",
      placeholder: "Enter your email",
      icon: Mail,
      required: true,
    },
    {
      id: "phone",
      label: "Phone Number",
      type: "tel",
      placeholder: "Enter your 10-digit phone number",
      icon: Phone,
      required: true,
    },
    {
      id: "address",
      label: "Street Address",
      type: "text",
      placeholder: "Enter your complete address",
      icon: MapPin,
      required: true,
      textarea: true,
    },
    {
      id: "landmark",
      label: "Landmark (Optional)",
      type: "text",
      placeholder: "Nearby landmark",
      icon: Navigation,
      required: false,
    },
    {
      id: "city",
      label: "City",
      type: "text",
      placeholder: "Enter your city",
      icon: Map,
      required: true,
    },
    {
      id: "state",
      label: "State",
      type: "text",
      placeholder: "Enter your state",
      icon: Map,
      required: true,
    },
    {
      id: "pincode",
      label: "Pincode",
      type: "text",
      placeholder: "Enter 6-digit pincode",
      icon: MapPin,
      required: true,
    },
  ];

  // ✅ Only show error if field has been touched
  const shouldShowError = (fieldId) => {
    return touchedFields[fieldId] && formErrors[fieldId];
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {inputFields.map((field) => (
        <div
          key={field.id}
          className={field.textarea ? "md:col-span-2" : ""}
        >
          <label htmlFor={field.id} className="block text-sm font-medium text-gray-700 mb-2">
            {field.label} {field.required && <span className="text-red-500">*</span>}
          </label>
          
          <div className="relative">
            <field.icon className="absolute left-3 top-3.5 h-5 w-5 text-gray-400" />
            
            {field.textarea ? (
              <textarea
                id={field.id}
                value={formData[field.id]}
                onChange={(e) => onInputChange(field.id, e.target.value)}
                onBlur={() => onFieldBlur(field.id)}
                placeholder={field.placeholder}
                rows={3}
                className={`w-full pl-10 pr-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition ${
                  shouldShowError(field.id) ? "border-red-300 bg-red-50" : "border-gray-300"
                }`}
              />
            ) : (
              <input
                id={field.id}
                type={field.type}
                value={formData[field.id]}
                onChange={(e) => onInputChange(field.id, e.target.value)}
                onBlur={() => onFieldBlur(field.id)}
                placeholder={field.placeholder}
                className={`w-full pl-10 pr-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition ${
                  shouldShowError(field.id) ? "border-red-300 bg-red-50" : "border-gray-300"
                }`}
              />
            )}
          </div>
          
          {/* ✅ Only show error message if field is touched */}
          {shouldShowError(field.id) && (
            <p className="mt-1 text-sm text-red-600 flex items-center gap-1 animate-fadeIn">
              <span>⚠</span> {formErrors[field.id]}
            </p>
          )}
        </div>
      ))}
    </div>
  );
};

export default CheckoutForm;