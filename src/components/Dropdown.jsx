import { useEffect, useState } from 'react'

function Dropdown() {
    const [telemetry, setTelemetry] = useState(null)
    
    useEffect(() => {
    const fetchTelemetry = async () => {
        const res = await fetch(
        'https://api.openf1.org/v1/team_radio?session_key=9158'
        )
        const data = await res.json()
        setTelemetry(data.slice(0, 5)) // limit to 5 rows for demo
    }

    fetchTelemetry()
    }, [])

  return (
    <>
    <h1 className="text-xl font-bold mb-4">Telemetry Data</h1>
        {telemetry ? (
            telemetry.map((entry, index) => (
            <div
                key={index}
                className="mb-3 p-2 border border-gray-300 rounded bg-gray-50"
            >
                {/* Customize fields you want to show here */}
                <p><strong>Session Ky:</strong> {entry.session_key}</p>
                <p><strong>Driver Number:</strong> {entry.driver_number}</p>
                <p><strong>Speed:</strong> {entry.speed} km/h</p>
                <p><strong>Throttle:</strong> {entry.throttle}%</p>
                <p><strong>Brake:</strong> {entry.brake}%</p>
                <p><strong>UTC Time:</strong> {entry.utc}</p>
            </div>
            ))
        ) : (
            'Loading...'
        )}
    </>
  )
}

export default Dropdown