import React, { useState } from 'react';
import { Link } from "react-router-dom";
import logo from "../images/logo.jpg";
import styled from 'styled-components';
import { FiShoppingCart} from 'react-icons/fi';
import { CgMenu } from "react-icons/cg";
//import { useAddCartContext } from './context/AddCartContext';

const Navbar = () => {

  //const { total_cart_item } = useAddCartContext();
  const [activeLink, setActiveLink] = useState('');
  const [activeMobile, setActiveMobile] = useState(false);
  const handleLinkClick = (path) => {
    setActiveLink(path);
    setActiveMobile(false);
  };

  const navbarToggle = () =>{
    if (activeMobile === false) {
      setActiveMobile(true);
    } else {
      setActiveMobile(false);
    }
  }

  return (

    <Wrapper >
      <div className="containter-fluid main_menu">
        <div>
                <nav className="navbar navbar-expand-lg">
                <Link className="navbar-brand" to="/">
                <img src = {logo}  alt='logo'/></Link>
                    <div className='mobile-navbar-btn'>
                        <CgMenu name= 'menu-outline' className='mobile-nav-icon menu-outline' onClick={() => navbarToggle()} />
                    </div>  
                    <div className= {`navbar-collapse ${activeMobile === false ? 'collapse' : ''}`} id="navbarSupportedContent">
                      <ul className="navbar-nav ml-auto">
                       <li className={`nav-link ${activeLink === '/' ? 'active' : ''}`}>
                         <Link className="nav-link" to="/" onClick={() => handleLinkClick('/')}>Home</Link>
                       </li>
                       <li className={`nav-link ${activeLink === '/about' ? 'active' : ''}`}>
                         <Link className="nav-link" to="/about" onClick={() => handleLinkClick('/about')}>About</Link>
                       </li>
                       <li className={`nav-link ${activeLink === '/contact' ? 'active' : ''}`}>
                         <Link className="nav-link" to="/contact" onClick={() => handleLinkClick('/contact')}>Contact</Link>
                       </li>
                       <li className={`nav-link ${activeLink === '/product' ? 'active' : ''}`}>
                         <Link className="nav-link" to="/product" onClick={() => handleLinkClick('/product')}>Product</Link>
                       </li>
                       <li className={`nav-link ${activeLink === '/signup' ? 'active' : ''}`}>
                         <Link className="nav-link" to="/logout" onClick={() => handleLinkClick('/logout')}>Logout</Link>
                       </li>
                       <li>
                         <Link className="nav-link cart-trolley-link" to="/cart" ><FiShoppingCart className='cart-trolley'/>
                        {/* <span className='cart-total-item'>{total_cart_item}</span>*/}
                        </Link>
                       </li>
                      </ul>  
                                 
                    </div>
                  </nav>
            </div>
        </div>
    </Wrapper>
  )
}
const Wrapper = styled.section`
img {
    height: 50px;
};
.navbar {
    background-color: #E8E8E8;
    padding: 0 30px;
}
.cart-trolley-link {
  position: relative;
}
.cart-total-item {
    width: 1.4rem;
    height: 1.4rem;
    position: absolute;
    background-color: #cff1ee;
    color: #000;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    top: -1%;
    margin-left: 1rem;
}
.cart-trolley {
  height: 2.5em;
  width: 1.5em;
  position:relative;
}
.mobile-navbar-btn {
  display: none;
  cursor: pointer;
  border: none;
}
.menu-outline {
  display: none;
}
{/*
@media (max-width: ${({theme}) => theme.media.mobile}) {
  .mobile-navbar-btn {
    display: inline-block;
    z-index: 9999;
    font-size: 2.2rem;
  }
  .menu-outline {
    display: inline-block;
  }
}
  */}
`
export default Navbar