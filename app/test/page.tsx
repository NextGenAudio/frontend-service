"use client";

import React, { useEffect } from "react";

const Test = () => {
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      console.log("Key pressed: ", e.key);
    };
    addEventListener("keypress", handleKeyPress);

  const cache = localStorage.getItem("ally-supports-cache");
  if (cache) {
    const cacheObj = JSON.parse(cache);
    console.log(cacheObj)
    const device = cacheObj.userAgent;
    console.log(device);
  }

}, []);

  return (
    <div>
      <h1>Test Component</h1>
    </div>
  );
};

export default Test;
