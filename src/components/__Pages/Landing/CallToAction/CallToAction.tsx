import React from "react";

export const CallToAction = () => (
  <div className="bg-white dark:bg-black py-12 px-3 w-full container mx-auto">
    <div className="flex flex-col items-center gap-2">
      <h2 className="text-3xl font-bold ">
        Lorem ipsum dolor sit amet, consectetur adipiscing elit.
      </h2>
      <p className="text-lg ">
        ed eros ante, facilisis accumsan vehicula eu, laoreet sed lacus.
        Curabitur a molestie arcu.
      </p>
    </div>
    <div className="flex mt-10 justify-center flex-col md:flex-row gap-3">
      <div
        className="bg-gray-200 dark:bg-gray-700 flex font-bold items-center justify-center text-4xl rounded-2xl w-full md:w-2/5"
        style={{ height: 400 }}
      >
        Banner
      </div>
      <div
        className="bg-gray-200 dark:bg-gray-700 flex font-bold items-center justify-center text-4xl rounded-2xl w-full md:w-2/5"
        style={{ height: 400 }}
      >
        Banner
      </div>
    </div>
  </div>
);
