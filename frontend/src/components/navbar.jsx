import React, { useState, useRef, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import "../home.css";
import { doSignOut } from "../firebase/auth";
import { useAuth } from "../context";

const Header = () => {
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const { userLoggedIn } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const dropdownRef = useRef(null);

  const onLogout = async (e) => {
    e.preventDefault();
    await doSignOut();
    setIsMenuOpen(false);
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsMenuOpen(false);
      }
    };

    // Add when mounted
    document.addEventListener("mousedown", handleClickOutside);
    // Return function to be called when unmounted
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const getInitials = () => {
    if (!currentUser?.email) return "U";
    
    const name = currentUser.displayName || currentUser.email.split('@')[0];
    const parts = name.split(' ');
    
    if (parts.length > 1) {
      return `${parts[0][0]}${parts[parts.length - 1][0]}`.toUpperCase();
    }
    return name[0].toUpperCase();
  };

  return (
    <nav>
      <div className="navleft">BRAIN TUMOR DETECTION</div>
      <div className="navright">
        <ul>
          <Link to={"/"}>
            <li>Home</li>
          </Link>
          <Link to={"/history"}>
            {userLoggedIn && <li>History</li>}
          </Link>
          {userLoggedIn && (
            <li className="avatar-container" ref={dropdownRef}>
              <div 
                className="avatar" 
                onClick={() => setIsMenuOpen(!isMenuOpen)}
              >
                {getInitials()}
              </div>
              {isMenuOpen && (
                <div className="dropdown-menu">
                  <div className="menu-header">
                    Hello, {currentUser.displayName || currentUser.email.split('@')[0]}
                  </div>
                  <button className="menu-item" onClick={onLogout}>
                    Logout
                  </button>
                </div>
              )}
            </li>
          )}
        </ul>
      </div>
    </nav>
  );
};

export default Header;