import HeroSection from '../components/HeroSection';
import TrustBadges from '../components/TrustBadges';
import CategorySection from '../components/CategorySection';
import FeaturedProduct from '../components/FeaturedProduct';
import BestSellers from '../components/BestSellers';
import PremiumBanner from '../components/PremiumBanner';
import BrandSection from '../components/BrandSection';
import DealsSection from '../components/DealsSection';
import LatestArrivals from '../components/LatestArrivals';
import MobileStoreBanner from '../components/MobileStoreBanner';
import ReviewsSection from '../components/ReviewsSection';
import BlogSection from '../components/BlogSection';

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      <HeroSection />
      <TrustBadges />
      <CategorySection />
      <FeaturedProduct />
      <BestSellers />
      <PremiumBanner />
      <BrandSection variant="cards" />
      <DealsSection />
      <LatestArrivals />
      <MobileStoreBanner />
      <ReviewsSection />
      <BlogSection />
      <BrandSection variant="logos" />
    </div>
  );
}

