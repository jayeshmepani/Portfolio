import React from "react";

const Img_prop = ({ img, name }) => {
  return (
    <div className="flex flex-col items-center w-[123px] max-sm:w-[97px] h-[123px] max-sm:h-[95px] shadow-xl shadow-slate-300 dark:shadow-lg dark:shadow-blue-500/50 bg-gradient-to-bl from-[#ccc] to-[#eee] dark:from-[#051937] dark:to-[#222] rounded-[31px] place-content-center place-items-center grid translate-x-[100px] max-sm:translate-x-1">
      <img src={img} alt={name} className="max-sm:h-[45px] h-[55px]" />
      <span className="text-sm mt-2 text-[#00040f] dark:text-slate-300 text-center">
        {name}
      </span>
    </div>
  );
};

export default Img_prop;
