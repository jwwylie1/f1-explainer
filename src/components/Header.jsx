import RaceSelectDropdown from './RaceSelectDropdown.jsx'
import { Link } from 'react-router-dom';
import { logo } from '../assets/logos/pitwall.png';


function Header({sessionKey, setSessionKey, title, showChange=true}) {

  return (
    <div className="header-background w100 white">
        <Link to="/">
          <img src={logo} alt="Pitwall Logo" className="header-logo" />

        </Link>
        {title}
        {showChange && <RaceSelectDropdown sessionKey={sessionKey} setSessionKey={setSessionKey}/>}
    </div>
  );
};

export default Header