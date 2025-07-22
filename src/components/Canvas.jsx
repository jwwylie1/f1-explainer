import React, { useEffect, useState, useRef } from "react";

const SCALE = 0.000038;
const ERROR_X = 0.15;
const ERROR_Y = 0.1;
const ANGLE = 200; // Increase = counterclockwise
const FLIP = [-1,1]
const SPEED_MULT = 1;

function Canvas({ race }) {
  const canvasRef = useRef(null);
  const [canvasSize, setCanvasSize] = useState([]);
  const [image, setImage] = useState(null);
  const [driver1, setDriver1] = useState({ x: 0, y: 0 });
  const [driver2, setDriver2] = useState({ x: 0, y: 0 });
  const [car1Location, setCar1Location] = useState(null);
  const [car2Location, setCar2Location] = useState(null);
  const [car1Data, setCar1Data] = useState(null);
  const [car2Data, setCar2Data] = useState(null);
  const [car1AvgData, setCar1AvgData] = useState({speed:0, throttle:0, brake:0, gear:0, rpm:0})
  const [car2AvgData, setCar2AvgData] = useState({speed:0, throttle:0, brake:0, gear:0, rpm:0})
  const [frameIndex1, setFrameIndex1] = useState(0);
  const [frameIndex2, setFrameIndex2] = useState(0);
  const [dataIndex1, setDataIndex1] = useState(0);
  const [dataIndex2, setDataIndex2] = useState(0);
  const [ctx, setCtx] = useState(null);
  const [currentTime, setCurrentTime] = useState(0);
  const playbackStart = useRef(null);
  const startTime1 = useRef(null);
  const startTime2 = useRef(null);

  function rotate(x, y, scale, deg, flips) {
    // Convert rotation from degrees to radians
    const radians = (deg * Math.PI) / 180;
    const Xs = x * Math.cos(radians) - y * Math.sin(radians);
    const Ys = x * Math.sin(radians) + y * Math.cos(radians);

    const Xw = Xs * flips[0] * scale;
    const Yw = Ys * flips[1] * scale;

    const newX = Xw + canvasSize[0]/2 + ERROR_X*canvasSize[0]
    const newY = Yw + canvasSize[1]/2 + ERROR_Y*canvasSize[1]

    return { x: newX, y: newY };
  };

  useEffect(() => {
    const fetchData = async () => {
      const [car1LocRes, car2LocRes, car1DataRes, car2DataRes] = await Promise.all([
        fetch(
          "https://api.openf1.org/v1/location?session_key=9118&driver_number=81&date%3E2023-07-02T13:38:02.735000+00:00&date%3C2023-07-02T13:40:02.735000+00:00"
        ),
        fetch(
          "https://api.openf1.org/v1/location?session_key=9118&driver_number=27&date%3E2023-07-02T13:38:42.735000+00:00&date%3C2023-07-02T13:40:42.735000+00:00"
        ),
        fetch (
          "https://api.openf1.org/v1/car_data?session_key=9998&driver_number=81&date%3E2025-03-23T07:36:38.944000+00:00&date%3C2025-03-23T07:38:16.841000+00:00",
        ),
        fetch(
          "https://api.openf1.org/v1/car_data?session_key=9998&driver_number=27&date%3E2025-03-23T07:39:16.476000+00:00&date%3C2025-03-23T07:40:54.062000+00:00"
        )
      ]);
      const [car1Location, car2Location, car1Data, car2Data] = await Promise.all([
        car1LocRes.json(),
        car2LocRes.json(),
        car1DataRes.json(),
        car2DataRes.json(),
      ]);

      setCar1Location(car1Location);
      setCar2Location(car2Location);
      setCar1Data(car1Data);
      setCar2Data(car2Data);

    };
    fetchData();
  }, []);

  useEffect(() => {
    if (car1Location && car2Location && race) {
      const img = new Image();
      console.log(race)
      //img.src = `./src/assets/circuits/${race.name}.webp`;
      img.src = `./src/assets/circuits/Austria.webp`;
      img.onload = () => {
        const canvasWidth = window.innerWidth * 0.8; // 80% of the page width
        const aspectRatio = img.naturalWidth / img.naturalHeight;
        const canvasHeight = canvasWidth / aspectRatio;
        setCanvasSize([canvasWidth, canvasHeight]);

        const canvas = canvasRef.current; // Get the canvas element directly
        canvas.width = canvasWidth;
        canvas.height = canvasHeight;

        const context = canvas.getContext("2d"); // Get the 2D context
        setCtx(context); //Now you assign it to the state

        context.drawImage(img, 0, 0, canvasWidth, canvasHeight);
        const pixels = context.getImageData(0, 0, canvasWidth, canvasHeight);
        for (let i = 0; i < pixels.data.length; i += 4) {
          if (
            pixels.data[i] >= 200 &&
            pixels.data[i + 1] >= 200 &&
            pixels.data[i + 2] >= 200
          ) {
            // do nothing, keep the pixel white
          } else {
            pixels.data[i] = 0;
            pixels.data[i + 1] = 0;
            pixels.data[i + 2] = 0;
          }
        }
        context.putImageData(pixels, 0, 0);
        context.lineWidth = 3;


        context.fillStyle = 'blue'
        context.beginPath();
        context.arc(canvasWidth/2, canvasHeight/2, 10, 0, 2 * Math.PI); // x, y, radius, startAngle, endAngle
        context.fill();

        context.fillStyle = 'red'
        context.beginPath();
        const newC = rotate(0, 0, SCALE, ANGLE, FLIP)
        context.arc(newC.x, newC.y, 10, 0, 2 * Math.PI); // x, y, radius, startAngle, endAngle
        context.fill();


        if (!startTime1.current) {
          startTime1.current = new Date(car1Location[0].date).getTime();
          playbackStart.current = Date.now();
        }

        if (!startTime2.current) {
          startTime2.current = new Date(car2Location[0].date).getTime();
          playbackStart.current = Date.now();
        }

        const interval = setInterval(() => {
          const elapsedTime = Date.now() - playbackStart.current;
          setCurrentTime(elapsedTime*SPEED_MULT);
        }, 50);

        return () => clearInterval(interval);
      };
    }
  }, [car1Location, race]);

  useEffect(() => {
    const car1Available = car1Location && car1Data && frameIndex1 < car1Location.length - 1;
    const car2Available = car2Location && car2Data && frameIndex2 < car2Location.length - 1;

    if (!ctx || (!car1Available && !car2Available)) return;

    const locTime1 = new Date(car1Location[frameIndex1]?.date).getTime() - startTime1.current;
    const locTime2 = new Date(car2Location[frameIndex2]?.date).getTime() - startTime2.current;

    const dataTime1 = new Date(car1Data[dataIndex1]?.date).getTime() - startTime1.current;
    const dataTime2 = new Date(car2Data[dataIndex2]?.date).getTime() - startTime2.current;

    if (car1Available && currentTime >= locTime1) {
      drawCar1(ctx, canvasRef.current);
      setFrameIndex1(prev => prev+1);
      console.log(car1Data[dataIndex1])
    }
    if (car2Available && currentTime >= locTime2) {
      drawCar2(ctx, canvasRef.current);
      setFrameIndex2(prev => prev+1);
    }

    if (car1Available && currentTime >= dataTime1) {
      setCar1AvgData(prevData => ({
        ...prevData,
        speed: prevData.speed + car1Data[dataIndex1]?.speed,
        throttle: prevData.throttle + car1Data[dataIndex1]?.throttle,
        brake: prevData.brake + car1Data[dataIndex1]?.brake,
        gear: prevData.gear + car1Data[dataIndex1]?.n_gear,
        rpm: prevData.rpm + car1Data[dataIndex1]?.rpm,
      }));
      setDataIndex1(prev => prev+1);
    }
    if (car2Available && currentTime >= dataTime2) {
      setCar2AvgData(prevData => ({
        ...prevData,
        speed: prevData.speed + car2Data[dataIndex2]?.speed,
        throttle: prevData.throttle + car2Data[dataIndex2]?.throttle,
        brake: prevData.brake + car2Data[dataIndex2]?.brake,
        gear: prevData.gear + car2Data[dataIndex2]?.n_gear,
        rpm: prevData.rpm + car2Data[dataIndex2]?.rpm,
      }));
      setDataIndex2(prev => prev+1);
    }

  }, [currentTime, frameIndex1, frameIndex2]);

  const drawCar1 = (ctx, canvas) => {

    ctx.strokeStyle = "orange";
    const newCoords1 = rotate(
      car1Location[frameIndex1 + 1].x,
      car1Location[frameIndex1 + 1].y,
      SCALE*canvasSize[0],
      ANGLE,
      FLIP
    );
    ctx.beginPath(); // Start a new path
    ctx.moveTo(driver1.x, driver1.y); // Move the "pen" to the starting point
    ctx.lineTo(newCoords1.x, newCoords1.y); // Draw a line to the ending point
    ctx.stroke(); // Actually draw the line (use ctx.fill() for filled lines)
    ctx.closePath(); // Close the path
    setDriver1(() => ({
      x: newCoords1.x,
      y: newCoords1.y,
    }));

    console.log(newCoords1)

    setImage(canvas.toDataURL());
  };

  const drawCar2 = (ctx, canvas) => {

    ctx.strokeStyle = "green"
    const newCoords2 = rotate(
      car2Location[frameIndex2 + 1].x,
      car2Location[frameIndex2 + 1].y,
      SCALE*canvasSize[0],
      ANGLE,
      FLIP
    );
    ctx.beginPath(); // Start a new path
    ctx.moveTo(driver2.x, driver2.y); // Move the "pen" to the starting point
    ctx.lineTo(newCoords2.x, newCoords2.y); // Draw a line to the ending point
    ctx.stroke(); // Actually draw the line (use ctx.fill() for filled lines)
    ctx.closePath(); // Close the path
    setDriver2(() => ({
      x: newCoords2.x,
      y: newCoords2.y,
    }));

    setImage(canvas.toDataURL());
  };

  return (
    <>
      <div className="canvas-background">
        <canvas ref={canvasRef} style={{ display: image ? "none" : "block" }} />
        {image && <img src={image} alt="Image" />}
      </div>

      <table className='driver-comparison-table'>
        <tbody>
          <tr>
            <td rowSpan='2'>DRIVER</td>
            <td colSpan='2'>SPEED (kmh)</td>
            <td colSpan='2'>THROTTLE (%)</td>
            <td colSpan='2'>BRAKE (on / off)</td>
            <td colSpan='2'>GEAR</td>
            {/*<td>RPM</td>*/}
          </tr>

          <tr>
            <td>LIVE</td>
            <td>AVG</td>
            <td>LIVE</td>
            <td>AVG</td>
            <td>LIVE</td>
            <td>AVG</td>
            <td>LIVE</td>
            <td>AVG</td>
          </tr>

          <tr>
            <td>Oscar PIASTRI</td>
            <td style={{ opacity: car1Data?.[dataIndex1]?.speed / 200}}>
              {car1Data?.[dataIndex1]?.speed} / {Math.floor(car1Data?.[dataIndex1]?.speed/1.609)}
            </td>
            <td style={{ opacity: car1Data?.[dataIndex1]?.speed / 200}}>
              {(car1AvgData.speed/dataIndex1).toFixed(2)}
            </td>

            <td style={{ color: `rgb(17, 
              ${Math.floor((car1Data?.[dataIndex1]?.throttle / 100) * 255)}, 17)` }}>
              {car1Data?.[dataIndex1]?.throttle}
            </td>
            <td style={{ color: `rgb(17, 
              ${Math.floor((car1AvgData.throttle/dataIndex1 / 100) * 255)}, 17)` }}>
              {(car1AvgData.throttle/dataIndex1).toFixed(2)}
            </td>

            <td style={{ color: car1Data?.[dataIndex1]?.brake === 0 ? '#111' : 'red' }}>
              BRAKE
            </td>
            <td style={{ color: `rgb(${Math.floor((car1AvgData.brake/dataIndex1 / 30) * 255)}, 
              17, 17)` }}>
              {(car1AvgData.brake/dataIndex1).toFixed(2)}
            </td>

            <td>{car1Data?.[dataIndex1]?.n_gear}</td>
            <td>{(car1AvgData.gear/dataIndex1).toFixed(2)}</td>
            {/*<td>{car1Data?.[dataIndex1]?.rpm}</td> */}
          </tr>

          <tr>
            <td>Nico HULKENBERG</td>
            <td style={{ opacity: car2Data?.[dataIndex2]?.speed / 200}}>
              {car2Data?.[dataIndex2]?.speed} / {Math.floor(car2Data?.[dataIndex2]?.speed/1.609)}
            </td>
            <td style={{ opacity: car2Data?.[dataIndex2]?.speed / 200}}>
              {(car2AvgData.speed/dataIndex2).toFixed(2)}
            </td>

            <td style={{ color: `rgb(17, 
              ${Math.floor((car2Data?.[dataIndex2]?.throttle / 100) * 255)}, 17)` }}>
              {car2Data?.[dataIndex2]?.throttle}
            </td>
            <td style={{ color: `rgb(17, 
              ${Math.floor((car2AvgData.throttle/dataIndex2 / 100) * 255)}, 17)` }}>
              {(car2AvgData.throttle/dataIndex2).toFixed(2)}
            </td>

            <td style={{ color: car2Data?.[dataIndex2]?.brake === 0 ? '#111' : 'red' }}>
              BRAKE
            </td>
            <td style={{ color: `rgb(${Math.floor((car2AvgData.brake/dataIndex2 / 30) * 255)}, 
              17, 17)` }}>
              {(car2AvgData.brake/dataIndex2).toFixed(2)}
            </td>

            <td>{car2Data?.[dataIndex2]?.n_gear}</td>
            <td>{(car2AvgData.gear/dataIndex2).toFixed(2)}</td>
{/*             <td>{currentTime.toString().slice(-6,-3)}:{currentTime.toString().slice(-3,-2)}</td>
 */}         </tr>
        </tbody>
      </table>


    </>
  );
}

export default Canvas;
