"use client";

import Exp_prop from "./Exp_prop";
import Skills from "./Skills";
import AOS from "aos";
import "aos/dist/aos.css";
import { useEffect } from "react";
import CodSoft from "../assets/codsoft.png";
import DIT from "../assets/dit.jpg";
import WRTeam from "../assets/wrteam.jpg";

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
              date="May 6, 2024 - June 8, 2024"
            />
            <Exp_prop
              img={CodSoft}
              title="CodSoft"
              subtitle="Python Programming"
              date="May 5, 2024 - June 5, 2024"
            />
            <Exp_prop
              img={CodSoft}
              title="CodSoft"
              subtitle="Data Science"
              date="May 20, 2024 - June 20, 2024"
            />
            <Exp_prop
              img={CodSoft}
              title="CodSoft"
              subtitle="Flutter Developer"
              date="June 20, 2024 - July 20, 2024"
            />
          </div>
        </div>
      </section>
      <Skills />
    </>
  );
};

export default Experience;
