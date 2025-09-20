"use client";
import React, { useEffect, useState } from "react";

const IpTesting = () => {
  const [ipAddress, setIpAddress] = useState("");
  const [geoInfo, setGeoInfo] = useState({});

  // Get visitor IP on mount
  useEffect(() => {
    const getVisitorIp = async () => {
      try {
        const response = await fetch("https://api.ipify.org?format=json");
        const data = await response.json();
        setIpAddress(data.ip);
      } catch (error) {
        console.error("Failed to fetch IP:", error);
      }
    };
    getVisitorIp();
  }, []);

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setIpAddress(event.target.value);
  };

  const fetchInfo = async () => {
    try {
      const response = await fetch(`https://ipapi.co/${ipAddress}/json/`);
      const data = await response.json();
      setGeoInfo(data); // keep as object
    } catch (error) {
      console.error("Failed to fetch IP info:", error);
    }
  };

  return (
    <div className="flex min-h-screen flex-col items-center gap-4 bg-gray-50 p-6 text-gray-900">
      <h1 className="text-2xl font-bold">IP to Location Tester</h1>

      <div className="flex gap-2">
        <input
          onChange={handleInputChange}
          type="text"
          value={ipAddress}
          placeholder="Enter IP address"
          className="w-64 rounded border px-3 py-2"
        />
        <button
          onClick={fetchInfo}
          className="rounded bg-blue-500 px-4 py-2 text-white hover:bg-blue-600"
        >
          Get Info
        </button>
      </div>

      {/* Display the geoInfo object as raw key-value pairs */}
      {Object.keys(geoInfo).length > 0 && (
        <div className="mt-6 w-full max-w-xl rounded border bg-white p-4 shadow">
          <h2 className="mb-2 text-lg font-semibold">Geo Information</h2>
          <table className="w-full table-auto text-sm">
            <tbody>
              {Object.entries(geoInfo).map(([key, value]) => (
                <tr key={key} className="border-b">
                  <td className="w-1/3 p-2 font-medium">{key}</td>
                  <td className="p-2 break-words">
                    {typeof value === "object"
                      ? JSON.stringify(value)
                      : String(value)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default IpTesting;
