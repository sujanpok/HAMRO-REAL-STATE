import React from 'react';
import styled from 'styled-components';

function ContactPage() {
  return (
    <Wrapper>
    <div className="">
            <div className=''>
              Contact page
            </div>
        </div>
    </Wrapper>
  );
}
const Wrapper = styled.section`



@media (max-width: ${({theme}) => theme.media.mobile}) {
    
  }

`

export default ContactPage;
