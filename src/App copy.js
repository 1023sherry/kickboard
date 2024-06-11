import "mapbox-gl/dist/mapbox-gl.css";
import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";

import Splash from "./components/Splash";
import Trip from "./components/Trip";
import "./css/app.css";

const fetchData = (FilE_NAME) => {
  const res = axios.get(
    `https://raw.githubusercontent.com/1023sherry/kickboard/main/kickboard/src/data/${FilE_NAME}.json`
  );
  const data = res.then((r) => r.data);
  return data;
};

const App = () => {
  const [icon, setIcon] = useState([]);
  const [line, setLine] = useState([]);
  const [kickboard, setKickboard] = useState([]);

  const [trips, setTrips] = useState([]);

  const [isloaded, setIsLoaded] = useState(false);

  const getData = useCallback(async () => {

    const TRIPS =  await Promise.all([
      fetchData("kick_OO_40"),
      fetchData("kick_DD_40"),
      fetchData("walk_OO_40"),
      fetchData("walk_DD_40"),
      fetchData("pt_OD_40")
    ])
    
    const KICKBOARD = await fetchData("people_location_40");
    
    const ICON = await Promise.all([
      fetchData("bus_icon"),
      fetchData("trail_icon"),
    ]);

    const LINE = await Promise.all([
      fetchData("bus_line"),
      fetchData("trail_line"),
    ]);


    setIcon((prev) => ICON.flat());
    setLine((prev) => LINE.flat());
    setTrips((prev) => TRIPS.flat())

    setKickboard((prev) => KICKBOARD);
 

    setIsLoaded(true);
  }, []);

  useEffect(() => {
    getData();
  }, [getData]);

  return (
    <div className="container">
      {!isloaded && <Splash />}
      {isloaded && (
        <Trip 
              trips = {trips}

              icon={icon}
              line={line}
              kickboard={kickboard}
              />
      )}
    </div>
  );
};

export default App;