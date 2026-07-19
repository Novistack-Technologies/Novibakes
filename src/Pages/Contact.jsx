import React from "react";
import Support from "../components/Contact/Support";
import FAQSection from "../components/Contact/FAQSection.jsx";
import Contactus from "../components/Contact/ContactUs.jsx"

const Service = () => {
  return (
    <section id="contactus" className="pt-18 bg-white">
      <Support />
      <Contactus />
        <FAQSection />
    </section>
  );
};

export default Service;