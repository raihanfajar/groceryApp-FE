"use client";
import React, { useEffect, useState } from "react";

const IpTesting = () => {
  const [ipAddress, setIpAddress] = useState("");
  const [geoInfo, setGeoInfo] = useState({});

  const getVisitorIp = async () => {
    try {
      const response = await fetch("https://api.ipify.org");
      const data = await response.text();
      setIpAddress(data);
    } catch (error) {
      console.error("Failed to fetch IP:", error);
    }
  };

  useEffect(() => {
    getVisitorIp();
  }, []);

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setIpAddress(event.target.value);
  };

  const fetchInfo = async () => {
    try {
      const response = await fetch(`https://ipapi.co/${ipAddress}/json/`);
      const data = await response.json();
      setGeoInfo(data);
      console.log(geoInfo);
    } catch (error) {
      console.error("Failed to fetch IP info:", error);
    }
  };

  return (
    <div className="flex h-screen flex-col">
      <h1>Ip to location</h1>
      <div>
        <input onChange={handleInputChange} type="text" value={ipAddress} />
        <button onClick={fetchInfo}>get info</button>
      </div>
    </div>
  );
};

export default IpTesting;
