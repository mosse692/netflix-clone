import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import netflix_logo from './images/netflix_logo.png'
import "./Nav.css";

function Nav() {

  const [show, handleShow] = useState(false)
  const navigate = useNavigate()

  const transitionNavBar = () => {
    if(window.scrollY > 100) {
      handleShow(true)
    } else {
      handleShow(false)
    }
  }

  useEffect(() => {
    window.addEventListener("scroll", transitionNavBar)
    return () => window.removeEventListener("scroll", transitionNavBar)
  }, [])

  return (
    <div className={`nav ${show && "nav__black"}`}>
      <div className="nav__contents">
        <img
          src={netflix_logo}
          alt=""
          className="nav__logo"
          onClick={() => navigate("/")}
        />

        <img
          src="https://upload.wikimedia.org/wikipedia/commons/0/0b/Netflix-avatar.png"
          alt=""
          className="nav__avatar"
          onClick={() => navigate("/profile")}
        />
      </div>
    </div>
  );
}

// https://logos-world.net/wp-content/uploads/2020/04/Netflix-Logo.png
export default Nav;
