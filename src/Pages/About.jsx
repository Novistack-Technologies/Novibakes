import React from "react";
import TeamSection from "../components/About/TeamSection";
import AboutHero from "../components/About/AboutHero";
import OurValues from "../components/About/OurValues";
import TimeLine from "../components/About/TimeLine";
import Aboutus from "../components/About/AboutUs";

const About = () => {
  return (
    <section id="aboutus" className="py-18 bg-white">
      <AboutHero />
      <Aboutus />
        <TimeLine />
      <OurValues />
    </section>
  );
};

export default About;