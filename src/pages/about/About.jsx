import React, { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { Shirt, Sparkles, Heart, Package, ArrowRight } from 'lucide-react';
import Navbar from '../../components/common/Navbar';
import Footer from '../../components/common/Footer';
import { Link } from 'react-router-dom';

const About = () => {
  const heroRef = useRef(null);
  const isHeroInView = useInView(heroRef, { once: true });

  const features = [
    {
      icon: Shirt,
      title: "Premium Quality",
      description: "Soft, durable fabrics made for everyday comfort."
    },
    {
      icon: Sparkles,
      title: "Unique Designs",
      description: "Original artwork inspired by mythology and pop culture."
    },
    {
      icon: Heart,
      title: "Made For Expression",
      description: "Modern oversized fits crafted for confidence."
    },
    {
      icon: Package,
      title: "Fast Delivery",
      description: "Reliable shipping with careful packaging."
    }
  ];

  return (
    <>
    <Navbar />
    <div className="min-h-screen bg-gradient-to-b from-slate-50 via-white to-slate-100/60">
      {/* Hero Section */}
      <motion.section 
        ref={heroRef}
        className="relative flex min-h-[45vh] items-center justify-center overflow-hidden bg-gradient-to-b from-primary/30 via-lime-50 to-white md:min-h-[55vh]"
      >
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_right,_rgba(255,255,255,0.7),_transparent_45%)]" />
        <div className="container relative z-10 mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={isHeroInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6 }}
            className="mx-auto max-w-4xl rounded-3xl border border-white/70 bg-white/90 px-6 py-10 text-center shadow-xl backdrop-blur md:px-10"
          >
            <h2 className="mb-4 text-5xl font-black tracking-tight text-slate-900 md:text-7xl">
              About Unboxing
            </h2>
            <motion.p
              initial={{ opacity: 0 }}
              animate={isHeroInView ? { opacity: 1 } : {}}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="mb-3 text-xl text-slate-800 md:text-2xl"
            >
              Every Print Tells a Story
            </motion.p>
            <motion.div
              initial={{ opacity: 0 }}
              animate={isHeroInView ? { opacity: 1 } : {}}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="text-base font-semibold text-slate-600 md:text-lg"
            >
              Where Stories Meet Streetwear
            </motion.div>
          </motion.div>
        </div>
      </motion.section>

      {/* Our Story Section */}
      <section className="bg-white py-12 md:py-20">
        <div className="container mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="mx-auto max-w-4xl rounded-3xl border border-slate-100 bg-white p-6 shadow-sm md:p-10"
          >
            <h2 className="mb-8 text-center text-4xl font-black tracking-tight text-slate-900 md:mb-10 md:text-5xl">
              Our Story
            </h2>
            <div className="space-y-5 text-base leading-relaxed text-slate-700 md:text-lg">
              <p>
                Welcome to <span className="font-bold text-slate-900">Unboxing</span>, where fashion becomes a canvas for stories.
              </p>
              <p>
                We are more than a clothing brand. We blend art, history, and individuality into every collection so each piece feels meaningful, not just trendy.
              </p>
              <p>
                From mythology and folklore to comics and modern pop culture, our graphics are inspired by narratives that connect with identity and self-expression.
              </p>
              <p>
                Every product is crafted with care, designed for comfort, and made to stand out in your everyday wardrobe.
              </p>
              <p className="text-lg font-semibold text-slate-900">
                We believe great style is not just about trends - it is about confidence, expression, and connection.
              </p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="bg-slate-50 py-16 md:py-20">
        <div className="container mx-auto px-6">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="mb-12 text-center text-4xl font-black tracking-tight text-slate-900 md:text-5xl"
          >
            Why Choose Us
          </motion.h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-5xl mx-auto">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="rounded-2xl border border-slate-200 bg-white p-6 text-center shadow-sm transition-all hover:-translate-y-1 hover:shadow-md"
              >
                <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-xl bg-primary/15">
                  <feature.icon className="h-6 w-6 text-slate-900" strokeWidth={2} />
                </div>
                <h3 className="mb-2 text-lg font-bold text-slate-900">{feature.title}</h3>
                <p className="text-sm text-slate-600">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Mission Statement */}
      <section className="bg-slate-900 py-16 text-white md:py-20">
        <div className="container mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="max-w-3xl mx-auto text-center"
          >
            <h2 className="mb-6 text-4xl font-black tracking-tight md:text-5xl">
              Our Mission
            </h2>
            <p className="mb-4 text-xl font-bold md:text-2xl">
              Turning Timeless Tales Into Wearable Statements
            </p>
            <p className="text-base leading-relaxed text-slate-300 md:text-lg">
              We transform powerful stories into premium streetwear that helps you express your identity with confidence, comfort, and originality.
            </p>
          </motion.div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-white py-14 md:py-18">
        <div className="container mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="mx-auto max-w-3xl rounded-3xl border border-slate-200 bg-slate-50 p-8 text-center shadow-sm"
          >
            <h2 className="mb-4 text-3xl font-black tracking-tight text-slate-900 md:text-4xl">
              Ready to Wear Your Story?
            </h2>
            <p className="mb-7 text-slate-600">
              Explore the latest drops and find designs that match your vibe.
            </p>
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Link
                to="/products"
                className="inline-flex items-center gap-2 rounded-full bg-slate-900 px-7 py-3 text-sm font-bold uppercase tracking-wide text-white transition hover:bg-slate-800 md:text-base"
              >
                Shop Now
                <ArrowRight className="h-4 w-4" />
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Contact Info */}
      <section className="bg-slate-50 py-16">
        <div className="container mx-auto px-6">
          <div className="mx-auto max-w-2xl rounded-3xl border border-slate-200 bg-white p-8 text-center shadow-sm">
            <h3 className="mb-8 text-3xl font-bold tracking-tight text-slate-900">Get In Touch</h3>
            <div className="space-y-3 text-slate-700">
              <p className="text-base md:text-lg">
                <span className="font-semibold">Founder:</span> ....
              </p>
              
              <p className="text-base md:text-lg">
                <span className="font-semibold">Email:</span> support@Unboxing.com
              </p>
              <p className="text-base md:text-lg">
                <span className="font-semibold">Address:</span> Indore, Madhya Pradesh
              </p>
            </div>
          </div>
        </div>
      </section>

    </div>
    <Footer />
    </>
  );
};

export default About;