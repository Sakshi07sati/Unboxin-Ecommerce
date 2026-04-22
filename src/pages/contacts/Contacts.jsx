import React, { useState, useEffect } from "react";

import { motion } from "framer-motion";
import {
  Mail,
  Phone,
  MapPin,
  Send,
  MessageSquare,
  
  RefreshCw,
  Box,
} from "lucide-react";
import Navbar from "../../components/common/Navbar";
import Footer from "../../components/common/Footer";
import API from "../../global_redux/api";
import toast from "react-hot-toast";

const Contacts = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "",
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [contactPageData, setContactPageData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [errors, setErrors] = useState({});

  // Icon mapping
  const iconMap = {
    email: Mail,
    phone: Phone,
    address: MapPin,
  };

  const socialIconMap = {
    instagram: Box,
    facebook: Box,
    youtube: Box,
  };

  // Fetch contact page data
  useEffect(() => {
    const fetchContactData = async () => {
      try {
        setLoading(true);
        const response = await API.get("/contacts/data");
        // console.log(response.data);
        if (response.data?.success) {
          setContactPageData(response.data.data);
        }
      } catch (error) {
        console.error("Failed to fetch contact page data:", error);
        // Use default data if API fails
        setContactPageData({
          contactInfo: [
            {
              type: "email",
              title: "Email Us",
              detail: "support@unboxing.com",
              link: "mailto:support@unboxing.com",
            },
            {
              type: "phone",
              title: "Call Us",
              detail: "+91 9876543210",
              link: "tel:+919876543210",
            },
            {
              type: "address",
              title: "Visit Us",
              detail: "Indore, Madhya Pradesh, India",
              link: "#",
            },
          ],
          pageTitle: "Let's Connect!",
          pageSubtitle: "Got questions? We'd love to hear from you! 💬",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchContactData();
  }, []);

  const social_links = [
    {
      name: "Instagram",
      icon: "instagram",
      url: "https://www.instagram.com/unboxing.style/ ",
    },
    {
      name: "Facebook",
      icon: "facebook",
      url: " https://www.facebook.com/profile.php?id=61581739202044 ",
    },
    {
      name: "Youtube",
      icon: "youtube",
      url: " https://www.youtube.com/@unboxing_style ",
    },
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });

    // Clear error for this field when user starts typing
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: "",
      });
    }
  };

  // Validate individual field
  const validateField = (name, value) => {
    switch (name) {
      case "name":
        if (!value.trim()) {
          return "Name is required";
        }
        if (value.trim().length < 2) {
          return "Name must be at least 2 characters";
        }
        return "";

      case "email":
        if (!value.trim()) {
          return "Email is required";
        }
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(value)) {
          return "Please enter a valid email address";
        }
        return "";

      case "phone":
        // Phone is optional, but if provided, validate it
        if (value && value.trim()) {
          const phoneRegex = /^[\d\s\-\+\(\)]+$/;
          if (!phoneRegex.test(value)) {
            return "Please enter a valid phone number";
          }
          if (value.replace(/\D/g, "").length < 10) {
            return "Phone number must be at least 10 digits";
          }
        }
        return "";

      case "message":
        if (!value.trim()) {
          return "Message is required";
        }
        if (value.trim().length < 10) {
          return "Message must be at least 10 characters";
        }
        return "";

      default:
        return "";
    }
  };

  // Validate all fields
  const validateForm = () => {
    const newErrors = {};

    // Validate required fields
    newErrors.name = validateField("name", formData.name);
    newErrors.email = validateField("email", formData.email);
    newErrors.phone = validateField("phone", formData.phone);
    newErrors.message = validateField("message", formData.message);

    // Remove empty error messages
    Object.keys(newErrors).forEach((key) => {
      if (!newErrors[key]) delete newErrors[key];
    });

    setErrors(newErrors);
    return {
      isValid: Object.keys(newErrors).length === 0,
      formErrors: newErrors,
    };
  };

  const handleSubmit = async () => {
    const { isValid, formErrors } = validateForm();
    if (!isValid) {
      const firstError = Object.values(formErrors).find((err) => err);
      if (firstError) {
        toast.error(firstError);
      }
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await API.post("/contacts", {
        name: formData.name,
        email: formData.email,
        phone: formData.phone || "",
        subject: formData.subject || "",
        message: formData.message,
      });

      if (response.data?.success) {
        toast.success(response.data.message || "Message sent successfully!");
        setFormData({
          name: "",
          email: "",
          phone: "",
          subject: "",
          message: "",
        });
        setErrors({});
      } else {
        throw new Error(response.data?.message || "Failed to send message");
      }
    } catch (error) {
      console.error("Error submitting contact form:", error);
      toast.error(
        error.response?.data?.message ||
          error.message ||
          "Failed to send message. Please try again later."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  // Use API data or fallback to defaults
  const contactInfo = contactPageData?.contactInfo || [];

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gradient-to-b from-slate-50 via-white to-slate-100/70">
        {/* Hero Section */}
        <motion.section
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="relative overflow-hidden bg-gradient-to-r from-primary/25 via-lime-100 to-primary/25 py-16 md:py-20"
        >
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_right,_rgba(255,255,255,0.55),_transparent_40%)]" />
          <div className="container mx-auto px-4 text-center relative z-10">
            <motion.div
              initial={{ scale: 0.8, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="inline-block rounded-3xl border border-white/70 bg-white/90 p-7 shadow-xl backdrop-blur md:p-9"
            >
              <h1 className="mb-4 text-4xl font-black tracking-tight md:text-6xl">
                <span className="text-primary">
                  {contactPageData?.pageTitle?.split(" ")[0] || "Let's"}
                </span>{" "}
                <span className="text-slate-900">
                  {contactPageData?.pageTitle?.split(" ").slice(1).join(" ") ||
                    "Connect!"}
                </span>
              </h1>
              <p className="text-base font-medium text-slate-600 md:text-lg">
                {contactPageData?.pageSubtitle ||
                  "Got questions? We'd love to hear from you! 💬"}
              </p>
            </motion.div>
          </div>
        </motion.section>

        {/* Main Content */}
        <div className="container mx-auto px-4 py-14 md:py-16">
          <div className="mx-auto grid max-w-6xl gap-8 md:grid-cols-2 md:gap-10">
            {/* Contact Info */}
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="space-y-6 md:space-y-7"
            >
              {/* Contact Cards */}
              <div className="space-y-4">
                {contactInfo.map((item, index) => {
                  const IconComponent = iconMap[item.type] || Mail;
                  return (
                    <motion.a
                      key={index}
                      href={item.link}
                      whileHover={{ scale: 1.03, x: 5 }}
                      className="group flex cursor-pointer items-center gap-4 rounded-2xl border border-slate-100 bg-white p-5 shadow-sm transition hover:border-primary/20 hover:shadow-md md:p-6"
                    >
                      <div className="rounded-xl bg-slate-100 p-3.5 transition group-hover:bg-primary/15">
                        <IconComponent className="h-6 w-6 text-slate-800" />
                      </div>
                      <div>
                        <h3 className="text-lg font-extrabold text-slate-900">{item.title}</h3>
                        <p className="text-slate-600">{item.detail}</p>
                      </div>
                    </motion.a>
                  );
                })}
              </div>

              {/* Social Media */}

              {/* Social Media */}
              <div className="rounded-3xl border border-slate-200 bg-gradient-to-br from-slate-100 to-slate-200 p-7 shadow-md md:p-8">
                <h3 className="mb-3 text-2xl font-black text-slate-900 md:text-3xl">
                  Follow Us!
                </h3>
                <p className="mb-6 text-slate-700">
                  Stay connected for the latest drops and exclusive designs! 🔥
                </p>
                <div className="flex gap-4">
                  {social_links.map((social, index) => {
                    const SocialIcon =
                      socialIconMap[social.icon?.toLowerCase()] || Box;

                    return (
                      <motion.a
                        key={index}
                        href={social.url || "#"} // FIXED: Changed from social.hraf to social.url
                        target="_blank"
                        rel="noopener noreferrer"
                        whileHover={{ scale: 1.2, rotate: 5 }}
                        whileTap={{ scale: 0.9 }}
                        className="cursor-pointer rounded-xl bg-white p-4 shadow-sm transition hover:-translate-y-0.5 hover:shadow-lg"
                      >
                        <SocialIcon className="h-6 w-6 text-slate-900" />
                      </motion.a>
                    );
                  })}
                </div>
              </div>
            </motion.div>

            {/* Contact Form */}
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="rounded-3xl border border-slate-200 bg-white p-6 shadow-lg md:p-8"
            >
              <div className="flex items-center gap-3 mb-6">
                <div className="rounded-xl bg-primary/15 p-2.5">
                  <MessageSquare className="h-6 w-6 text-slate-900" />
                </div>
                <h2 className="text-2xl font-black text-slate-900">Send a Message</h2>
              </div>

              <div className="space-y-6">
                {/* Name Field */}
                <div>
                  <label className="mb-2 block text-sm font-bold text-slate-700">
                    Your Name *
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    className={`w-full rounded-xl border px-4 py-3 text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 transition ${
                      errors.name
                        ? "border-red-400 focus:border-red-400 focus:ring-red-100"
                        : "border-slate-300 focus:border-primary/50 focus:ring-primary/20"
                    }`}
                    placeholder="John Doe"
                  />
                  {errors.name && (
                    <p className="text-red-500 text-sm mt-1 font-medium">
                      {errors.name}
                    </p>
                  )}
                </div>

                {/* Email Field */}
                <div>
                  <label className="mb-2 block text-sm font-bold text-slate-700">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className={`w-full rounded-xl border px-4 py-3 text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 transition ${
                      errors.email
                        ? "border-red-400 focus:border-red-400 focus:ring-red-100"
                        : "border-slate-300 focus:border-primary/50 focus:ring-primary/20"
                    }`}
                    placeholder="john@example.com"
                  />
                  {errors.email && (
                    <p className="text-red-500 text-sm mt-1 font-medium">
                      {errors.email}
                    </p>
                  )}
                </div>

                {/* Phone Field */}
                <div>
                  <label className="mb-2 block text-sm font-bold text-slate-700">
                    Phone Number
                  </label>
                  <input
                    type="text"
                    maxLength={10}
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    onKeyDown={(e) => {
                      if (!/[0-9]/.test(e.key) && e.key !== "Backspace") {
                        e.preventDefault();
                      }
                    }}
                    className={`w-full rounded-xl border px-4 py-3 text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 transition ${
                      errors.phone
                        ? "border-red-400 focus:border-red-400 focus:ring-red-100"
                        : "border-slate-300 focus:border-primary/50 focus:ring-primary/20"
                    }`}
                    placeholder="+91 98765 43210"
                  />
                  {errors.phone && (
                    <p className="text-red-500 text-sm mt-1 font-medium">
                      {errors.phone}
                    </p>
                  )}
                </div>

                {/* Subject Field */}
                <div>
                  <label className="mb-2 block text-sm font-bold text-slate-700">
                    Subject
                  </label>
                  <input
                    type="text"
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    className="w-full rounded-xl border border-slate-300 px-4 py-3 text-slate-800 placeholder:text-slate-400 transition focus:border-primary/50 focus:outline-none focus:ring-2 focus:ring-primary/20"
                    placeholder="How can we help? (Optional)"
                  />
                </div>

                {/* Message Field */}
                <div>
                  <label className="mb-2 block text-sm font-bold text-slate-700">
                    Message *
                  </label>
                  <textarea
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    rows="5"
                    className={`w-full resize-none rounded-xl border px-4 py-3 text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 transition ${
                      errors.message
                        ? "border-red-400 focus:border-red-400 focus:ring-red-100"
                        : "border-slate-300 focus:border-primary/50 focus:ring-primary/20"
                    }`}
                    placeholder="Tell us more..."
                  ></textarea>
                  {errors.message && (
                    <p className="text-red-500 text-sm mt-1 font-medium">
                      {errors.message}
                    </p>
                  )}
                </div>

                {/* Submit Button */}
                <div className="inline-block w-full">
                  <motion.button
                    onClick={handleSubmit}
                    disabled={isSubmitting}
                    whileHover={!isSubmitting ? { scale: 1.02 } : {}}
                    whileTap={!isSubmitting ? { scale: 0.98 } : {}}
                    className="relative flex w-full items-center justify-center gap-3 rounded-xl bg-slate-900 px-4 py-3 text-base font-bold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-60 md:text-lg"
                  >
                    {isSubmitting ? (
                      <>
                        <RefreshCw className="w-5 h-5 animate-spin" />
                        Sending...
                      </>
                    ) : (
                      <>
                        <Send className="w-5 h-5" />
                        Send Message
                      </>
                    )}
                  </motion.button>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default Contacts;
