import React, { useEffect } from "react";
import axios from "axios";

const CorsTestComponent = () => {
  useEffect(() => {
    axios
      .get("http://localhost:5005/api/cohorts")
      .then((response) => {
        console.log("Data fetched successfully:", response.data);
      })
      .then((error) => {
        console.error("Error fetching data:", error);
      });
  }, []);
  return (
    <div>
      <h1>CORS Test</h1>
      <p>
        Check the console (F12) to see if the request was successful or blocked
        by CORS.
      </p>
    </div>
  );
};

export default CorsTestComponent;