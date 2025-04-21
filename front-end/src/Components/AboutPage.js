import React from 'react';
import styled from 'styled-components';


function AboutPage() {
  return (
    <Wrapper>
    <div className="">
            <div className=''>
              About page
            </div>
        </div>
    </Wrapper>
  );
}
const Wrapper = styled.section`



@media (max-width: ${({theme}) => theme.media.mobile}) {
    
  }

`

export default AboutPage;