import { Link, useSearchParams } from 'react-router-dom';
import { ArrowRight, Hammer, Drill, Flame, Droplets, FlaskConical, Paintbrush, Cable, CircleDot, Lock, Leaf, SprayCan, Box } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { categories } from '@/data/products';
import { motion } from 'framer-motion';
import { LucideIcon } from 'lucide-react';

const iconMap: Record<string, LucideIcon> = {
  Hammer, Drill, Flame, Droplets, FlaskConical, Paintbrush, Cable, CircleDot, Lock, Leaf, SprayCan, Box
};

const CategoryGrid = () => {
  const [, setSearchParams] = useSearchParams();

  const getIcon = (iconName: string): LucideIcon => {
    return iconMap[iconName] || Box;
  };

  return (
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
            Browse by Category
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Explore our comprehensive range of industrial tools and equipment
          </p>
        </motion.div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4 md:gap-6">
          {categories.map((category, index) => {
            const IconComponent = getIcon(category.icon);
            return (
              <motion.div
                key={category.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: index * 0.05 }}
              >
                <Link
                  to={`/products?category=${category.id}`}
                  className="group flex flex-col items-center p-6 bg-card rounded-xl border border-border shadow-card hover:shadow-card-hover hover:border-accent/50 transition-all duration-300"
                >
                  <div className="w-14 h-14 bg-primary/10 group-hover:bg-accent/20 rounded-xl flex items-center justify-center mb-4 transition-colors">
                    <IconComponent className="h-7 w-7 text-primary group-hover:text-accent transition-colors" />
                  </div>
                  <h3 className="text-sm font-medium text-center text-foreground group-hover:text-primary transition-colors">
                    {category.name}
                  </h3>
                </Link>
              </motion.div>
            );
          })}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="text-center mt-10"
        >
          <Button variant="navy-outline" size="lg" asChild>
            <Link to="/products" className="inline-flex items-center gap-2">
              View All Products
              <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
        </motion.div>
      </div>
    </section>
  );
};

export default CategoryGrid;
