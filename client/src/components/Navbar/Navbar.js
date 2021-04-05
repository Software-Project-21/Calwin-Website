import React, { useState} from 'react';
import { Button } from '../Button';
import { Link,useHistory } from 'react-router-dom';
import './Navbar.css';
import { MdFingerprint } from 'react-icons/md';
import { FaBars, FaTimes } from 'react-icons/fa';
import { IconContext } from 'react-icons/lib';
import {useAuth} from '../Auth/AuthContext';

function Navbar() {
  const [click, setClick] = useState(false);
  const [button, setButton] = useState(true);
  const [error,setError] = useState("");
  const history = useHistory();
  const {logOut,currentUser} = useAuth();

  const handleClick = () => setClick(!click);
  const closeMobileMenu = () => setClick(false);

  const showButton = () => {
    if (window.innerWidth <= 960) {
      setButton(false);
    } else {
      setButton(true);
    }
  };

  async function handleLogOut(){
    setError('');
    try {
      await logOut();
      history.push('/login');
    } catch {
      setError("Failed to Log Out");
    }
    
  }
  async function handleLogOutM(){
    setClick(false);
    setError('');
    try {
      await logOut();
      history.push('/login');
    } catch {
      setError("Failed to Log Out");
    }
    
  }

  // useEffect(() => {
  //   showButton();
  //   window.addEventListener('resize', showButton);
  //   return {
  //     window.removeEventListener('resize', showButton)
  //   }
  // }, []);


  return (
    <>
      <IconContext.Provider value={{ color: '#fff' }}>
        <nav className='navbar'>
          <div className='navbar-container container'>
            <Link to='/' className='navbar-logo' onClick={closeMobileMenu}>
              <MdFingerprint className='navbar-icon' />
              CalWin
            </Link>
            <div className='menu-icon' onClick={handleClick}>
              {click ? <FaTimes /> : <FaBars />}
            </div>
            <ul className={click ? 'nav-menu active' : 'nav-menu'}>
              <li className='nav-item'>
                <Link to='/' className='nav-links' onClick={closeMobileMenu}>
                  Home
                </Link>
              </li>
              {/* <li className='nav-item'>
                <Link
                  to='/services'
                  className='nav-links'
                  onClick={closeMobileMenu}
                >
                  About
                </Link>
              </li>
              <li className='nav-item'>
                <Link
                  to='/services'
                  className='nav-links'
                  onClick={closeMobileMenu}
                >
                  Gallery
                </Link>
              </li> */}
              <li className='nav-item'>
              {currentUser &&
                (<Link
                  to={`/calendar/${currentUser.providerData[0].uid}`}
                  className='nav-links'
                  onClick={closeMobileMenu}
                >Calendar</Link>) 
              }
              </li>
              <li className='nav-btn'>
                {button ? (
                  !currentUser ? (
                   <Link to='/login' className='btn-link'>
                    <Button buttonStyle='btn--outline'>SIGN IN</Button>
                  </Link> ) : (
                      <Button buttonStyle='btn--outline' onClick={handleLogOut}>Log Out</Button>
                  )
                ) : (
                  !currentUser ? (
                  <Link to='/login' className='btn-link'>
                    <Button
                      buttonStyle='btn--outline'
                      buttonSize='btn--mobile'
                      onClick={closeMobileMenu}
                    >
                      SIGN IN
                    </Button>
                  </Link> ) : (
                    <Button
                      buttonStyle='btn--outline'
                      buttonSize='btn--mobile'
                      onClick={handleLogOutM}
                    >
                      Log Out
                    </Button>
                  )
                  
                )}
              </li>
              {/* <li>
                <Button buttonStyle='btn--outline' onClick={logOut}>Log Out</Button>
              </li> */}
            </ul>
          </div>
        </nav>
      </IconContext.Provider>
    </>
  );
}

export default Navbar;
