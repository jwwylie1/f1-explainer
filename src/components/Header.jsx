import RaceSelectDropdown from './RaceSelectDropdown.jsx'

function Header() {
    
  return (
    <div className="header-background w100">
        <img src="./src/assets/logos/f1.png" alt="F1 Logo" className="header-logo" />
        Radio Explaination Tool
        <RaceSelectDropdown />
    </div>
  );
};

export default Header