import Navbar from '../components/Navbar';
import Hero from '../components/Hero';
import WhyChoose from '../components/WhyChoose';
import MenuFavorit from '../components/MenuFavorit';
import ProcessOrder from '../components/ProcessOrder';
import Testimonial from '../components/Testimonial';
import PreOrder from '../components/PreOrder';
import Footer from '../components/Footer';

export default function HomePage() {
  return (
    <div className="scroll-smooth min-h-screen bg-quaternary text-tertiary">
      <Navbar />
      <Hero />
      <WhyChoose />
      <MenuFavorit />
      <ProcessOrder />
      <Testimonial />
      <PreOrder />
      <Footer />
    </div>
  );
}
