function DriverList({ drivers }) {
	return (
		<>
			{drivers.map((driver, index) => {
				return (
					<>
						<div key={index} style={{color: `#${driver.team_colour}`}}>
						<img
											src={`./src/assets/drivers/${driver.name_acronym}.webp`}
											alt={driver.name_acronym}
											onError={(e) => {
												console.log('Headshot image failed to load:', driver.headshot_url);
												e.target.style.display = 'none';
											}}></img>
							{driver.full_name}
							</div>
					</>
				)
			})}
		</>
	)
}

export default DriverList