import Navbar from '../../components/layout/Navbar';
import Hero from '../../components/landing/Hero';
import Features from '../../components/landing/Features';
import FeaturedAuctions from '../../components/landing/FeaturedAuctions';
import HowItWorks from '../../components/landing/HowItWorks';
import Footer from '../../components/layout/Footer';

function Landing() {
  return (
    <>
      <Navbar />
      <Hero />
      <Features />
      <FeaturedAuctions />
      <HowItWorks />
      <Footer />
    </>
  );
}

export default Landing;