import Project_prop from "./project_prop";
import { Portfolio, Om, WeatherApp, RecipeApp, crop_recommendations, nutrient_recommendations, crm } from "../constants/Constant";
import Tooltip from "@mui/material/Tooltip";
import IconButton from "@mui/material/IconButton";
import AOS from "aos";
import "aos/dist/aos.css";
import { useEffect } from "react";
import {
  SiReact,
  SiTailwindcss,
  SiVite,
  SiHtml5,
  SiCss3,
  SiJavascript,
  SiPython,
  SiFlask,
  SiFlutter,
  SiPlotly,
  SiExpress,
  SiNodedotjs,
  SiNextdotjs
} from "react-icons/si";

const Projects = () => {
  useEffect(() => {
    AOS.init({
      duration: 1000, // Animation duration in milliseconds
      easing: 'ease-in-out', // Easing function for the animation
      once: true, // Whether animation should happen only once
      mirror: false, // Whether elements should animate out while scrolling past them
    });
  }, []);
  return (
    <section
      id="projects"
      className="Experience p-5 mx-20 min-h-screen font-['Poppins'] max-sm:p-2 max-sm:mx-5"
    >
      <div className="WRAPPER mt-10" data-aos="fade-down">
        <h1 className="text-[#00040f] dark:text-slate-300 text-center font-extrabold text-5xl mb-5 max-sm:text-4xl">
          Projects
        </h1>
        <div
          className="PROJECTS mt-16 grid gap-10 grid-cols-2 max-sm:grid-cols-1"
          data-aos="zoom-out-down"
        >
          <Project_prop
            title="Portfolio Website"
            para="Personal portfolio website created with React and Tailwind CSS."
            img={Portfolio}
            link="https://jayeshpatel-portfolio.netlify.app/"
            github_link="https://github.com/jayeshmepani/Portfolio.git"
            react={
              <Tooltip title="React" arrow>
                <IconButton>
                  <SiReact className="dark:text-slate-200 text-black" />
                </IconButton>
              </Tooltip>
            }
            tailwindcss={
              <Tooltip title="TailWind CSS" arrow>
                <IconButton>
                  <SiTailwindcss className="dark:text-slate-200 text-black" />
                </IconButton>
              </Tooltip>
            }
            css3={
              <Tooltip title="CSS" arrow>
                <IconButton>
                  <SiCss3 className="dark:text-slate-200 text-black" />
                </IconButton>
              </Tooltip>
            }
            vite={
              <Tooltip title="Vite" arrow>
                <IconButton>
                  <SiVite className="dark:text-slate-200 text-black" />
                </IconButton>
              </Tooltip>
            }
            javascript={
              <Tooltip title="JavaScript" arrow>
                <IconButton>
                  <SiJavascript className="dark:text-slate-200 text-black" />
                </IconButton>
              </Tooltip>
            }
          />
          <Project_prop
            title="Hindu Scriptures"
            para="A platform for searching Hindu scriptures, featuring full-text searches and translations."
            img={Om}
            link="https://hinduscriptures.onrender.com"
            github_link="https://github.com/jayeshmepani/HinduScriptures/"
            html5={
              <Tooltip title="HTML" arrow>
                <IconButton>
                  <SiHtml5 className="dark:text-slate-200 text-black" />
                </IconButton>
              </Tooltip>
            }
            javascript={
              <Tooltip title="JavaScript" arrow>
                <IconButton>
                  <SiJavascript className="dark:text-slate-200 text-black" />
                </IconButton>
              </Tooltip>
            }
            css3={
              <Tooltip title="CSS" arrow>
                <IconButton>
                  <SiCss3 className="dark:text-slate-200 text-black" />
                </IconButton>
              </Tooltip>
            }
            nodejs={
              <Tooltip title="Node.js" arrow>
                <IconButton>
                  <SiNodedotjs className="dark:text-slate-200 text-black" />
                </IconButton>
              </Tooltip>
            }
            express={
              <Tooltip title="Express" arrow>
                <IconButton>
                  <SiExpress className="dark:text-slate-200 text-black" />
                </IconButton>
              </Tooltip>
            }
          />
          <Project_prop
            title="Weather App"
            para="Built a web app to provide real-time weather data and forecasts using Flask."
            img={WeatherApp}
            github_link="https://github.com/jayeshmepani/Weather-App"
            python={
              <Tooltip title="Python" arrow>
                <IconButton>
                  <SiPython className="dark:text-slate-200 text-black" />
                </IconButton>
              </Tooltip>
            }
            flask={
              <Tooltip title="Flask" arrow>
                <IconButton>
                  <SiFlask className="dark:text-slate-200 text-black" />
                </IconButton>
              </Tooltip>
            }
            html5={
              <Tooltip title="HTML" arrow>
                <IconButton>
                  <SiHtml5 className="dark:text-slate-200 text-black" />
                </IconButton>
              </Tooltip>
            }
            css3={
              <Tooltip title="CSS" arrow>
                <IconButton>
                  <SiCss3 className="dark:text-slate-200 text-black" />
                </IconButton>
              </Tooltip>
            }
            javascript={
              <Tooltip title="JavaScript" arrow>
                <IconButton>
                  <SiJavascript className="dark:text-slate-200 text-black" />
                </IconButton>
              </Tooltip>
            }
            plotly={
              <Tooltip title="Plotly" arrow>
                <IconButton>
                  <SiPlotly className="dark:text-slate-200 text-black" />
                </IconButton>
              </Tooltip>
            }
          />
          <Project_prop
            title="Crop Recommendations App"
            para="Developed an web app to recommend crops based on location using Flask and Google's Gemini 1.5 Pro Model API."
            img={crop_recommendations}
            github_link="https://github.com/jayeshmepani/Crop-Recommendations-App"
            python={
              <Tooltip title="Python" arrow>
                <IconButton>
                  <SiPython className="dark:text-slate-200 text-black" />
                </IconButton>
              </Tooltip>
            }
            flask={
              <Tooltip title="Flask" arrow>
                <IconButton>
                  <SiFlask className="dark:text-slate-200 text-black" />
                </IconButton>
              </Tooltip>
            }
            html5={
              <Tooltip title="HTML" arrow>
                <IconButton>
                  <SiHtml5 className="dark:text-slate-200 text-black" />
                </IconButton>
              </Tooltip>
            }
            css3={
              <Tooltip title="CSS" arrow>
                <IconButton>
                  <SiCss3 className="dark:text-slate-200 text-black" />
                </IconButton>
              </Tooltip>
            }
            javascript={
              <Tooltip title="JavaScript" arrow>
                <IconButton>
                  <SiJavascript className="dark:text-slate-200 text-black" />
                </IconButton>
              </Tooltip>
            }
          />
          <Project_prop
            title="Nutrient Recommendations App"
            para="Created an web app to provide personalized nutrient recommendations using Flask."
            img={nutrient_recommendations}
            github_link="https://github.com/jayeshmepani/Nutrient-Recommendations-App"
            python={
              <Tooltip title="Python" arrow>
                <IconButton>
                  <SiPython className="dark:text-slate-200 text-black" />
                </IconButton>
              </Tooltip>
            }
            flask={
              <Tooltip title="Flask" arrow>
                <IconButton>
                  <SiFlask className="dark:text-slate-200 text-black" />
                </IconButton>
              </Tooltip>
            }
            html5={
              <Tooltip title="HTML" arrow>
                <IconButton>
                  <SiHtml5 className="dark:text-slate-200 text-black" />
                </IconButton>
              </Tooltip>
            }
            css3={
              <Tooltip title="CSS" arrow>
                <IconButton>
                  <SiCss3 className="dark:text-slate-200 text-black" />
                </IconButton>
              </Tooltip>
            }
            javascript={
              <Tooltip title="JavaScript" arrow>
                <IconButton>
                  <SiJavascript className="dark:text-slate-200 text-black" />
                </IconButton>
              </Tooltip>
            }
          />
          <Project_prop
            title="CRM Dashboard"
            para="Developed a responsive web app for real-time data visualization and user interaction."
            img={crm}
            github_link="https://github.com/jayeshmepani/CRM-Dashboard"
            link="https://crm-stat.netlify.app/"
            react={
              <Tooltip title="React" arrow>
                <IconButton>
                  <SiReact className="dark:text-slate-200 text-black" />
                </IconButton>
              </Tooltip>
            }
            nextjs={
              <Tooltip title="Next.js" arrow>
                <IconButton>
                  <SiNextdotjs className="dark:text-slate-200 text-black" />
                </IconButton>
              </Tooltip>
            }
            tailwindcss={
              <Tooltip title="Tailwind CSS" arrow>
                <IconButton>
                  <SiTailwindcss className="dark:text-slate-200 text-black" />
                </IconButton>
              </Tooltip>
            }
            html5={
              <Tooltip title="HTML" arrow>
                <IconButton>
                  <SiHtml5 className="dark:text-slate-200 text-black" />
                </IconButton>
              </Tooltip>
            }
            css3={
              <Tooltip title="CSS" arrow>
                <IconButton>
                  <SiCss3 className="dark:text-slate-200 text-black" />
                </IconButton>
              </Tooltip>
            }
            javascript={
              <Tooltip title="JavaScript" arrow>
                <IconButton>
                  <SiJavascript className="dark:text-slate-200 text-black" />
                </IconButton>
              </Tooltip>
            }
          />
          <Project_prop
            title="Recipe App"
            para="A recipe application built with Flutter to browse recipes."
            img={RecipeApp}
            link=""
            github_link="https://github.com/jayeshmepani/Recipe-App"
            flutter={
              <Tooltip title="Flutter" arrow>
                <IconButton>
                  <SiFlutter className="dark:text-slate-200 text-black" />
                </IconButton>
              </Tooltip>
            }
          />
        </div>
      </div>
    </section>
  );
};
export default Projects;
