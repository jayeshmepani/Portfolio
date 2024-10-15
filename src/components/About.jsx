import React, { useState, useEffect } from "react";
import Lottie from "lottie-react";
import computer from "../assets/lottie/computer.json";
import styled from "styled-components";

const Wrapper = styled.div`

  .static-txt {
    color: #fff;
    font-size: 60px;
    font-weight: 400;
  }
  .dynamic-txts {
    color: rgb(111 157 210);
    font-size: 60px;
    font-weight: 400;
    /* width:333px; */
    height: 224px; /* Adjust this value based on your font-size */
    display: flex;
    align-items: center; /* Centers text vertically */
  }
`;

const About = () => {
  const [part, setPart] = useState("");
  const [wordIndex, setWordIndex] = useState(0);
  const [offset, setOffset] = useState(0);
  const [forwards, setForwards] = useState(true);
  const [skipCount, setSkipCount] = useState(0);

  const words = ["Image Processing Expert", "Developer", "Cyber Security Enthusiast", "Data Science Enthusiast"];
  const len = words.length;
  const skipDelay = 15;
  const speed = 73;

  useEffect(() => {
    const interval = setInterval(() => {
      if (forwards) {
        if (offset >= words[wordIndex].length) {
          setSkipCount(skipCount + 1);
          if (skipCount === skipDelay) {
            setForwards(false);
            setSkipCount(0);
          }
        } else {
          setOffset(offset + 1);
        }
      } else {
        if (offset === 0) {
          setForwards(true);
          setWordIndex((wordIndex + 1) % len);
        } else {
          setOffset(offset - 1);
        }
      }
      setPart(words[wordIndex].substr(0, offset));
    }, speed);

    return () => clearInterval(interval);
  }, [offset, forwards, skipCount, wordIndex, words]);

  return (
    <section
      id="about"
      className="p-5 mx-20 mb-10 font-medium font-['Poppins'] max-sm:p-2 max-sm:mx-5"
    >
      <div className="WRAPPER mt-12 flex max-sm:flex-col gap-5">
        <div className="INTRO text-[70px] leading-[80px] font-semibold max-sm:text-[50px] max-sm:leading-[70px] max-sm:font-semibold">
          <h3 className="text-[#00040f] dark:text-white" >
            Hi, there! <br />I'm
          </h3>
          <Wrapper>
            <div className="static-txt">
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-cyan-600 dark:from-cyan-500 dark:to-slate-200">
                Jayesh Patel, a &nbsp;
              </span>
            </div>
            <div className="dynamic-txts">{part}</div>
          </Wrapper>
          <p className="ABOUT text-xl max-sm:text-[15px] bg-clip-text text-transparent bg-gradient-to-r from-[#00040f] to-slate-500 dark:from-slate-500 dark:to-slate-200 mt-5 pl-1">
            Programming enthusiast who often thinks about developing new things
            for solving real-world problems.
          </p>
        </div>

        <Lottie
          animationData={computer}
          loop={true}
          className="max-w-[650px] shadow-xl rounded-xl border border-[#00040f]"
        />
      </div>
    </section>
  );
};

export default About;
