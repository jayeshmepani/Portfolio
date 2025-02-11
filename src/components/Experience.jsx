"use client";

import Exp_prop from "./Exp_prop";
import Skills from "./Skills";
import AOS from "aos";
import "aos/dist/aos.css";
import { useEffect } from "react";
import CodSoft from "../assets/codsoft.png";
import WRTeam from "../assets/wrteam.jpg";
import Shreesoftech from "../assets/Shreesoftech.jpg";

const Experience = () => {
  useEffect(() => {
    AOS.init();
  }, []);

  return (
    <>
      <section
        id="Experience"
        className="p-5 mx-20 mb-10 font-medium font-['Poppins'] max-sm:p-2 max-sm:mx-5"
      >
        <div className="WRAPPER mt-12">
          <h1 className="text-[#00040f] dark:text-slate-300 font-extrabold text-5xl text-center">
            Experience
          </h1>

          <div
            className="Experience mt-16 grid gap-20 max-sm:gap-10 max-sm:grid-cols-1 grid-cols-2"
            data-aos="zoom-in-up"
            style={{ justifyItems: 'center' }}
          >
            <Exp_prop
              img={WRTeam}
              title="WRTeam"
              subtitle="PHP"
              date="May 2024 - June 2024"
            />
            <Exp_prop
              img={CodSoft}
              title="CodSoft"
              subtitle="Python Programming"
              date="May 2024 - June 2024"
            />
            <Exp_prop
              img={CodSoft}
              title="CodSoft"
              subtitle="Data Science"
              date="May 2024 - June 2024"
            />
            <Exp_prop
              img={CodSoft}
              title="CodSoft"
              subtitle="Flutter Developer"
              date="June 2024 - July 2024"
            />            
            <Exp_prop
              img={Shreesoftech}
              title="Shreesoftech"
              subtitle="Laravel Developer"
              date="Dec 2024 - Present"
            />
          </div>
        </div>
      </section>
      <Skills />
    </>
  );
};

export default Experience;
