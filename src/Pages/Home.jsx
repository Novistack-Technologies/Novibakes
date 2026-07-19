import Hero from "../components/Home/Hero";
import FeaturedSection from "../components/Home/FeaturedSection";
import AboutUs from "../components/Home/AboutusPreview"
import Testimonials from "../components/Home/TestimonialSection";
import FeaturedProducts from "../components/Home/FeaturedProduct";
import CallToAction from "../components/Home/CalltoAction";



const Home = () => {
  return (
    <>
   <Hero/>
   <AboutUs/>
   <FeaturedProducts/>
   <FeaturedSection/>
   <Testimonials/>
   <CallToAction/>
   </>
  )
}

export default Home