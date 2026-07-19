import React from "react";
import ServiceHero from "../components/Services/Servicehero.jsx";
import PremiumCTA from "../components/Services/PremiumCTA.jsx";
import Process from "../components/Services/Process.jsx"
import WhyChooseUs from "../components/Services/WhyChooseus.jsx";
import Services from "../components/Services/Services.jsx";

const Service = () => {
  return (
    <section id="services" className="pt-18 bg-white">
      <ServiceHero />
      <Services />
        <WhyChooseUs />
        <Process/>
      <PremiumCTA />
    </section>
  );
};

export default Service;