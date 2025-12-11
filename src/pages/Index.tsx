import Layout from '@/components/layout/Layout';
import HeroSection from '@/components/home/HeroSection';
import CategoryGrid from '@/components/home/CategoryGrid';
import FeaturedProducts from '@/components/home/FeaturedProducts';
import BenefitsSection from '@/components/home/BenefitsSection';

const Index = () => {
  return (
    <Layout>
      <HeroSection />
      <CategoryGrid />
      <FeaturedProducts />
      <BenefitsSection />
    </Layout>
  );
};

export default Index;
