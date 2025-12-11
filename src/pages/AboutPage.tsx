import { motion } from 'framer-motion';
import { Target, Users, Award, Clock, Phone, Mail } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { getCompanyInfo, getWhatsAppLink } from '@/data/companyInfo';

const AboutPage = () => {
  const companyInfo = getCompanyInfo();

  const values = [
    {
      icon: Target,
      title: 'Our Mission',
      description: 'To provide high-quality industrial tools and equipment that empower businesses to achieve their goals efficiently and safely.',
    },
    {
      icon: Users,
      title: 'Customer First',
      description: 'We prioritize customer satisfaction by offering personalized service, expert advice, and reliable after-sales support.',
    },
    {
      icon: Award,
      title: 'Quality Assurance',
      description: 'All our products are sourced from trusted manufacturers and undergo rigorous quality checks before reaching you.',
    },
    {
      icon: Clock,
      title: 'Fast Delivery',
      description: 'With our efficient logistics network, we ensure your orders reach you quickly and in perfect condition.',
    },
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-navy text-primary-foreground py-16 md:py-24">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="max-w-3xl"
          >
            <h1 className="text-4xl md:text-5xl font-bold mb-6">About Us</h1>
            <p className="text-xl text-primary-foreground/90 leading-relaxed">
              Your trusted partner for industrial equipment and tools since establishment. 
              We're committed to delivering quality products and exceptional service to businesses across the region.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Company Overview */}
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
            >
              <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-6">
                Who We Are
              </h2>
              <div className="space-y-4 text-muted-foreground leading-relaxed">
                <p>
                  <strong className="text-foreground">{companyInfo.name}</strong> is a leading supplier of industrial tools, 
                  construction equipment, and technical supplies. We serve contractors, manufacturers, 
                  and businesses of all sizes with a comprehensive range of products from globally recognized brands.
                </p>
                <p>
                  Our team of experienced professionals understands the demands of industrial work. 
                  We don't just sell products – we provide solutions that help our customers work more 
                  efficiently, safely, and productively.
                </p>
                <p>
                  With years of industry experience, we've built strong relationships with top manufacturers, 
                  enabling us to offer competitive prices without compromising on quality. Our extensive 
                  inventory and efficient logistics ensure you get what you need, when you need it.
                </p>
              </div>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="relative"
            >
              <div className="aspect-[4/3] rounded-2xl overflow-hidden bg-muted">
                <img
                  src="https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=800&h=600&fit=crop"
                  alt="Industrial warehouse"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="absolute -bottom-6 -left-6 bg-accent text-accent-foreground p-6 rounded-xl shadow-lg">
                <p className="text-3xl font-bold">10+</p>
                <p className="text-sm">Years of Experience</p>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-16 md:py-24 bg-muted/30">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              Our Values
            </h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              The principles that guide everything we do
            </p>
          </motion.div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {values.map((value, index) => (
              <motion.div
                key={value.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
                className="bg-card rounded-xl border border-border p-6 text-center"
              >
                <div className="w-14 h-14 bg-primary/10 rounded-xl flex items-center justify-center mx-auto mb-4">
                  <value.icon className="h-7 w-7 text-primary" />
                </div>
                <h3 className="text-lg font-semibold text-foreground mb-2">{value.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{value.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-16 md:py-24 bg-navy text-primary-foreground">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            {[
              { value: '1000+', label: 'Products' },
              { value: '500+', label: 'Happy Customers' },
              { value: '50+', label: 'Brand Partners' },
              { value: '24/7', label: 'Support' },
            ].map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
              >
                <p className="text-4xl md:text-5xl font-bold text-accent">{stat.value}</p>
                <p className="text-primary-foreground/80 mt-2">{stat.label}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="bg-card rounded-2xl border border-border p-8 md:p-12 text-center"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              Ready to Get Started?
            </h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto mb-8">
              Browse our product catalog or contact us directly for personalized assistance with your equipment needs.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Button variant="accent" size="lg" asChild>
                <Link to="/products">Browse Products</Link>
              </Button>
              <Button variant="navy-outline" size="lg" asChild>
                <Link to="/contact">Contact Us</Link>
              </Button>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default AboutPage;
