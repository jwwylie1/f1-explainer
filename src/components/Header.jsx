import RaceSelectDropdown from './RaceSelectDropdown.jsx'

function Header({sessionKey, setSessionKey, title}) {

  return (
    <div className="header-background w100 white">
        <img src="./src/assets/logos/f1.png" alt="F1 Logo" className="header-logo" />
        {title}
        <RaceSelectDropdown sessionKey={sessionKey} setSessionKey={setSessionKey}/>
    </div>
  );
};

export default Header