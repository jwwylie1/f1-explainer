import RaceSelectDropdown from './RaceSelectDropdown.jsx'

function Header({sessionKey, setSessionKey}) {

  return (
    <div className="header-background w100">
        <img src="./src/assets/logos/f1.png" alt="F1 Logo" className="header-logo" />
        Radio Explaination Tool
        <RaceSelectDropdown sessionKey={sessionKey} setSessionKey={setSessionKey}/>
    </div>
  );
};

export default Header