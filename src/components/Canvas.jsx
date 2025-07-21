import React, { useEffect, useState, useRef } from 'react';

function rotate(x, y, scale, rotation, flips) {
  // Convert rotation from degrees to radians
  const radians = (rotation * Math.PI) / 90;

  // Calculate the new x and y values
  const newX = x * Math.cos(radians) - y * Math.sin(radians);
  const newY = x * Math.sin(radians) + y * Math.cos(radians);

  return { x: scale*flips[0]*newX, y: scale*flips[1]*newY };
}

function Canvas() {
  const canvasRef = useRef(null);
  const [canvasSize, setCanvasSize] = useState([])
  const [image, setImage] = useState(null);
  const [driver, setDriver] = useState({ 'x': 490, 'y': 360 })
  const [car1Data, setCar1Data] = useState(null)
  const [car2Data, setCar2Data] = useState(null)
  const [ctx, setCtx] = useState(null)
  const startTime = useRef(null)
  let frameIndex = 0;

  useEffect(() => {
    const fetchData = async () => {
      const [car1Res, car2Res] = await Promise.all([
        fetch('https://api.openf1.org/v1/location?session_key=9693&driver_number=81&date%3C2025-03-16T05:23:13.683000+00:00&date%3E2025-03-16T05:21:02.688000+00:00'),
        fetch('https://api.openf1.org/v1/location?session_key=9693&driver_number=27&date%3C2025-03-16T05:23:13.683000+00:00&date%3E2025-03-16T05:21:02.688000+00:00')
      ]);

      const [car1Data, car2Data] = await Promise.all([
        car1Res.json(),
        car2Res.json()
      ]);

      setCar1Data(car1Data);
      setCar2Data(car2Data);
    }
    fetchData()
  }, [])

  useEffect(() => {
    if (car1Data && car2Data) {
      const img = new Image();
      img.src = './src/assets/Image.png';
      img.onload = () => {
        const canvasWidth = window.innerWidth * 0.8; // 80% of the page width
        const aspectRatio = img.naturalWidth / img.naturalHeight;
        const canvasHeight = canvasWidth / aspectRatio;
        setCanvasSize([canvasWidth, canvasHeight]);

        const canvas = canvasRef.current; // Get the canvas element directly
        canvas.width = canvasWidth;
        canvas.height = canvasHeight;

        const context = canvas.getContext('2d');  // Get the 2D context
        setCtx(context); //Now you assign it to the state

        context.drawImage(img, 0, 0, canvasWidth, canvasHeight);
        const pixels = context.getImageData(0, 0, canvasWidth, canvasHeight);
        for (let i = 0; i < pixels.data.length; i += 4) {
          if (pixels.data[i] >= 200 && pixels.data[i + 1] >= 200 && pixels.data[i + 2] >= 200) {
            // do nothing, keep the pixel white
          } else {
            pixels.data[i] = 0;
            pixels.data[i + 1] = 0;
            pixels.data[i + 2] = 0;
          }
        }
        context.putImageData(pixels, 0, 0);

        setInterval(() => {
          animate(context, canvas)
        }, 200)
      }
    }
  }, [car1Data]);



  const animate = (ctx, canvas) => {
    drawCar(ctx, canvas, driver)
  }

  const drawCar = (ctx, canvas, driver) => {
    /* ctx.fillStyle = 'blue';
    ctx.beginPath();
    ctx.arc(driver.x, driver.y, 2, 0, 2 * Math.PI);
    ctx.fill(); */

    ctx.strokeStyle = 'orange';


    const newCoords = rotate((car1Data[frameIndex+1].x - car1Data[frameIndex].x), (car1Data[frameIndex+1].y - car1Data[frameIndex].y), 0.0204, 112, [-1,1])
    ctx.beginPath(); // Start a new path
    ctx.moveTo(driver.x, driver.y); // Move the "pen" to the starting point
    ctx.lineTo(driver.x+newCoords.x, driver.y+newCoords.y); // Draw a line to the ending point
    ctx.stroke(); // Actually draw the line (use ctx.fill() for filled lines)
    ctx.closePath(); // Close the path
    driver.x+=newCoords.x; driver.y+=newCoords.y
    setImage(canvas.toDataURL());
    frameIndex++
  }

  return (
    <>
      <div className='canvas-background'>
        <canvas ref={canvasRef} style={{ display: image ? 'none' : 'block' }} />
        {image && <img src={image} alt="Image" />}
      </div>
    </>
  )
  }
  
  export default Canvas

/*useEffect(() => {
  const ctx = canvasRef.current.getContext('2d');
  const animate = (timestamp) => {
    if (!startTime.current) {
      startTime.current = timestamp;
    }

    const elapsed = timestamp - startTime.current

    while (
      currentFrameIndex.current < raceData.length - 2 &&
      elapsed > raceData[currentFrameIndex.current+1].timestamp
    ) {
      currentFrameIndex.current++
    }

    const frameA = raceData[currentFrameIndex.current]
    const frameB = raceData[currentFrameIndex.current + 1]

    const frameDelta = frameB.timestamp - frameA.timestamp;
    const timeIntoFrame = elapsed - frameA.timestamp;
    const t = frameDelta > 0 ? timeIntoFrame / frameDelta : 0

    ctx.clearRect(0, 0, canvasSize.width, canvasSize.height);

    requestAnimationFrame(animate);
  };
  requestAnimationFrame(animate);
}, []);*/


/*import React, { useRef, useEffect, useState } from 'react';
const TRACK_WIDTH = 1000;
const TRACK_HEIGHT = 600;

function Canvas() {
 const canvasRef = useRef(null);
 const [carPositions, setCarPositions] = useState({});
 const lastFrameTime = useRef(Date.now());
 const lastCoordsRef = useRef({});
 const targetCoordsRef = useRef({});
 // Fetch new positions every 300ms
 useEffect(() => {
   const interval = setInterval(async () => {
     const data1 = await fetch('https://api.openf1.org/v1/location?session_key=9693&driver_number=81&date%3C2025-03-16T04:23:13.683000+00:00&date%3E2025-03-16T04:21:13.683000+00:00'); // Your API call here
     const data = await data1.json()
     // data = [{ driver_number: "22", x: 123.4, y: 432.1 }, ...]
     const newCoords = {};
     data.forEach(car => {
       newCoords[car.driver_number] = { x: car.x, y: car.y };
     });
     lastCoordsRef.current = { ...targetCoordsRef.current }; // store old
     targetCoordsRef.current = newCoords;
     lastFrameTime.current = Date.now();
   }, 300);
   return () => clearInterval(interval);
 }, []);
 // Animation loop
 useEffect(() => {
   const ctx = canvasRef.current.getContext('2d');
   const animate = () => {
     const now = Date.now();
     const elapsed = now - lastFrameTime.current;
     const t = Math.min(elapsed / 300, 1); // interpolation factor [0, 1]
     ctx.clearRect(0, 0, TRACK_WIDTH, TRACK_HEIGHT);
     // Interpolate positions and draw cars
     Object.keys(targetCoordsRef.current).forEach(driver => {
       const last = lastCoordsRef.current[driver] || targetCoordsRef.current[driver];
       const target = targetCoordsRef.current[driver];
       const x = last.x + (target.x - last.x) * t;
       const y = last.y + (target.y - last.y) * t;
       drawCar(ctx, x, y, driver);
     });
     requestAnimationFrame(animate);
   };
   animate();
 }, []);
 const drawCar = (ctx, x, y, label) => {
   ctx.fillStyle = 'red'; // Customize per driver if desired
   ctx.beginPath();
   ctx.arc(x, y, 5, 0, Math.PI * 2);
   ctx.fill();
   ctx.fillStyle = 'white';
   ctx.font = '10px Arial';
   ctx.fillText(label, x + 6, y);
 };
 return <canvas ref={canvasRef} width={TRACK_WIDTH} height={TRACK_HEIGHT} />;
}

export default Canvas*/