import { Shield, Truck, Award, Headphones } from 'lucide-react';
import { motion } from 'framer-motion';

const benefits = [
  {
    icon: Shield,
    title: 'Quality Guaranteed',
    description: 'All products are sourced from trusted manufacturers with quality certifications.',
  },
  {
    icon: Truck,
    title: 'Fast Delivery',
    description: 'Quick and reliable delivery to your location with real-time tracking.',
  },
  {
    icon: Award,
    title: 'Genuine Brands',
    description: 'We partner only with authorized distributors for authentic products.',
  },
  {
    icon: Headphones,
    title: 'Expert Support',
    description: 'Our technical team is available to help you choose the right equipment.',
  },
];

const BenefitsSection = () => {
  return (
    <section className="py-16 md:py-24 bg-navy text-primary-foreground">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Why Choose Us?
          </h2>
          <p className="text-primary-foreground/80 text-lg max-w-2xl mx-auto">
            We're committed to providing the best industrial equipment and service
          </p>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {benefits.map((benefit, index) => (
            <motion.div
              key={benefit.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: index * 0.1 }}
              className="text-center"
            >
              <div className="w-16 h-16 bg-accent rounded-2xl flex items-center justify-center mx-auto mb-4">
                <benefit.icon className="h-8 w-8 text-accent-foreground" />
              </div>
              <h3 className="text-xl font-semibold mb-2">{benefit.title}</h3>
              <p className="text-primary-foreground/80 text-sm leading-relaxed">
                {benefit.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default BenefitsSection;
