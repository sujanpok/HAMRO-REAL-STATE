import React from 'react';
import styled from 'styled-components';
import { Button } from '../Styles/Button';
import { Link, useNavigate } from "react-router-dom";
import { FaFacebook, FaInstagram, FaYoutube } from 'react-icons/fa';


const Footer = () => {
  const history = useNavigate();
  return (
    <Wrapper>
        <footer>
            <div className='container main-footer'>
                <div className='footer-about'>
                    <h4>Aryal Ecommerce</h4>
                    <p>Welcome to the aryal ecommerce site</p>
                </div>
                <div className='footer-subscribe'>
                    <h4>Subscribe to get important updates</h4>
                    <form>
                        <input type='email' placeholder='your e-mail' /><br />
                        <Button type='submit'>subscribe</Button>
                    </form>
                </div>
                <div className='footer-social'>
                    <h4>follow us by aryal</h4>
                    <div className='footer-social-icons'>
                        <div>
                          <Link to='https://www.facebook.com' target="_blank" rel="noopener noreferrer">
                            <FaFacebook className='icons' />
                          </Link>
                        </div>
                        <div>
                          <Link to='https://www.instagram.com' target="_blank" rel="noopener noreferrer">
                            <FaInstagram className='icons' />
                          </Link>
                        </div>
                        <div>
                          <Link to='https://www.youtube.com' target="_blank" rel="noopener noreferrer">
                            <FaYoutube className='icons' />
                          </Link>
                        </div>
                    </div>
                </div>
                <div className='footer-contact'>
                    <h4>Contact Us</h4>
                    <a href='tel:775783839'>+977 775783839</a> 
                </div>
            </div>

            <div className='footer-bottom-section'>
                <hr />
                <div className='container text-center'>
                    <p className='footer-bottom-mb'>@{new Date().getFullYear()} Aryal products. All Rights Reserved</p>
                    <p className='footer-bottom-pb'>privacy policy terms & conditions</p>
                </div>
            </div>
        </footer>
    </Wrapper>
  )
}
const Wrapper = styled.section`
  .footer {
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: space-around;
    background: #E8E8E8;
    border-radius: 15px;
    margin-bottom: -30px;
    width: 80%;
    margin-left: 10%;
  }
  section {
    position: relative;
    z-index: 9999;
  }
  footer {
    background-color: black;
    color: white;
    padding-top: 80px;
  }
  .main-footer {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
  }
  .footer-social-icons {
    display: flex;
    flex-direction: row;
    justify-content: space-around;
  }
  .icons {
    height: 2rem;
    width: 2rem;
    border-radius: 20px;
    text-align: center;
  }
  .footer-bottom-mb {
    margin-bottom: 0px;
  }
  .footer-bottom-pb {
    padding-bottom: 20px;
    margin-bottom: 0px;
  }
  .footer:hover{
    color:white;
    box-shadow: 0 2rem 2rem 0 rgb(132 144 255 / 30%);
    transform: scale(0.96);
  }

  @media (max-width: ${({theme}) => theme.media.mobile}) {
    .main-footer {
      display: flex;
      flex-direction: column;
    }
    .footer {
      display: flex;
      flex-direction: column;
      height: 140px;
      margin-bottom: -60px;
    }
  }
`
export default Footer