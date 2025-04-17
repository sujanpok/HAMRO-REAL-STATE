import React from 'react';
import styled from 'styled-components';

function LoginPage() {
  return (
    <Wrapper>
    <div className="">
            <div className=''>
              Login page
            </div>
        </div>
    </Wrapper>
  );
}
const Wrapper = styled.section`



@media (max-width: ${({theme}) => theme.media.mobile}) {
    
  }

`

export default LoginPage;