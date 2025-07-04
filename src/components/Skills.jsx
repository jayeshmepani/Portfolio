import React, { useEffect } from "react";
import AOS from "aos";
import "aos/dist/aos.css";
import Img_prop from "./Img_prop";

// Import your constants
import {
  C,
  CPP,
  HTML,
  CSS,
  SCSS,
  Github,
  Git,
  Vite,
  TailwindCSS,
  react,
  Python,
  Javascript,
  Vue,
  MongoDB,
  PHP,
  NodeJS,
  ExpressJS,
  AngularJS,
  NextJS,
  Java,
  PowerShell,
  Terminal,
  VSCode,
  AndroidStudio,
  Linux,
  Flask,
  Django,
  Flutter,
  Laravel,
  Bootstrap,
  MySQL,
  SQLite,
  GitLab
} from "../constants/Constant";

const Skills = () => {
  useEffect(() => {
    AOS.init();
  }, []);

  const skillCategories = [
    {
      category: "Programming Languages",
      skills: [
        { img: C, name: "C" },
        { img: CPP, name: "C++" },
        { img: Python, name: "Python" },
        { img: Java, name: "Java" },
        { img: Javascript, name: "Javascript" },
        { img: PHP, name: "PHP" },
      ],
    },
    {
      category: "Frontend Development",
      skills: [
        { img: HTML, name: "HTML" },
        { img: CSS, name: "CSS" },
        { img: Bootstrap, name: "Bootstrap" },
        { img: TailwindCSS, name: "TailwindCSS" },
        { img: SCSS, name: "SCSS" },
        { img: react, name: "React" },
        { img: Vue, name: "Vue" },
        { img: AngularJS, name: "Angular.js" },
        { img: NextJS, name: "Next.js" },
      ],
    },
    {
      category: "Backend Development",
      skills: [
        { img: NodeJS, name: "Node.js" },
        { img: ExpressJS, name: "Express.js" },
        { img: Laravel, name: "Laravel" },
        { img: MongoDB, name: "MongoDB" },
        { img: SQLite, name: "SQLite" },
        { img: MySQL, name: "MySQL" },
      ],
    },
    {
      category: "Tools & Platforms",
      skills: [
        { img: PowerShell, name: "PowerShell" },
        { img: Terminal, name: "Terminal" },
        { img: VSCode, name: "VS Code" },
        { img: AndroidStudio, name: "Android Studio" },
        { img: Linux, name: "Linux" },
      ],
    },
    {
      category: "Technologies/Frameworks",
      skills: [
        { img: Flask, name: "Flask" },
        { img: Django, name: "Django" },
        { img: Flutter, name: "Flutter" },
        { img: Git, name: "Git" },
        { img: Github, name: "GitHub" },
        { img: GitLab, name: "GitLab" },
        { img: Vite, name: "Vite" },
      ],
    },
  ];

  return (
    <section className="Skills p-5 mx-20 mb-10 font-['Poppins'] max-sm:p-2 max-sm:mx-5">
      <h1 className="text-[#00040f] dark:text-slate-300 font-extrabold text-5xl text-center max-sm:text-4xl">
        Skills
      </h1>
      {skillCategories.map((category) => (
        <div key={category.category} className="mt-10">
          <h2 className="text-2xl font-bold mb-5 text-[#00040f] dark:text-slate-300 text-center">
            {category.category}
          </h2>
          <div
            className="IMG grid place-content-center place-items-center p-5 grid-cols-3 gap-9 max-sm:p-2"
            data-aos="zoom-out-up"
          >
            {category.skills.map((skill) => (
              <Img_prop key={skill.name} img={skill.img} name={skill.name} />
            ))}
          </div>
        </div>
      ))}
    </section>
  );
};

export default Skills;