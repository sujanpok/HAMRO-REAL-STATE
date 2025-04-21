import React from 'react';
import styled from 'styled-components';
import slide1 from '../images/slide1.jpg';
import slide2 from '../images/slide2.jpg';
import slide3 from '../images/slide3.jpg';

function HomePage() {
  return (
    <Wrapper>
    <div className="">
            <div className=''>
              <img src={slide1} className="img-fluid" alt="loading..." />
            </div>
        </div>
    </Wrapper>
  );
}
const Wrapper = styled.section`

img {
    height: 550px;
    width: 100%;
}

.herosection p {
    margin-bottom: 0px;
}

@media (max-width: ${({theme}) => theme.media.mobile}) {
    .hero {
        flex-direction: column-reverse;
    }
    .herosection {
        width: 100%;
    }
    img {
        height: auto;
        width: 100%;
    }
    .herosection1 {
        margin-top: 10%;
    }
  }

`

export default HomePage;
