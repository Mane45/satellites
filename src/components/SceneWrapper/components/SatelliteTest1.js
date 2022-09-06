import { useState, useEffect } from "react";
import { loadModules } from "esri-loader";
import { getSatelliteLocation } from "../../../helpers/satelliteCoords";
import { twoline2satrec } from "satellite.js";

const SatelliteTest1 = (props) => {
  let line1 = props.graphicProperties.line1;
  let line2 = props.graphicProperties.line2;
  let satrec = twoline2satrec(line1, line2);
  const [polygonState, setPolygonState] = useState(null);
  const [lineState, setLineState] = useState(null);
  
  useEffect(() => {
    let interval;
    loadModules(["esri/Graphic"])
      .then(([Graphic]) => {
        interval = setInterval(() => {
          let loc = getSatelliteLocation(satrec, new Date());
          let x1, x2, y1, y2;
          let width = 10,
            height = 5;
          if (loc.x < 0) {
            x1 = loc.x + +width;
            x2 = loc.x - +width;
          } else {
            x1 = loc.x - +width;
            x2 = loc.x + +width;
          }
          if (loc.y < 0) {
            y1 = loc.y - height;
            y2 = loc.y + height;
          } else {
            y1 = loc.y + height;
            y2 = loc.y - height;
          }
          const polygontest = new Graphic({
            geometry: {
              type: "polygon",
              rings: [
                [x1, y2],
                [x1, y1],
                [x2, y1],
                [x2, y2]
              ]
            },
            symbol: {
              type: "simple-fill",
              color: [227, 139, 79, 0],
              outline: {
                color: [176, 252, 56],
                //color: [Math.floor(Math.random() * 250), Math.floor(Math.random() * 250), Math.floor(Math.random() * 250), 0.7],
                width: 2
              }
            }
          })

          const polyline = new Graphic({
            geometry: {
              type: "polyline",
              paths: [
                [loc.x, loc.y, 0],
                [loc.x, loc.y, loc.z]
              ],
            },
            symbol: {
              type: "simple-line",
              color: [176, 252, 56, 1],
              width: 3
            }
          })
          setLineState(polyline);
          setPolygonState(polygontest);

        }, 500);
        polygonState && props.view.graphics.add(polygonState);
        lineState && props.view.graphics.add(lineState);

      })
      .catch((err) => console.error(err));

    setInterval(
      () => {
        polygonState && props.view.graphics.remove(polygonState);
        lineState && props.view.graphics.remove(lineState);
      },
      500
    );
    return () => {
      clearInterval(interval);
      clearInterval(
        () => {
          polygonState && props.view.graphics.remove(polygonState);
          lineState && props.view.graphics.remove(lineState);
        },
        500
      );
    };
  }, [polygonState, lineState, props.view.graphics, satrec]);

  return null;
};

export default SatelliteTest1;
