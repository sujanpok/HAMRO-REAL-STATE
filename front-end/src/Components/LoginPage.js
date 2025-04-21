import React from 'react';
import styled from 'styled-components';

function logPage() {
  return (
    <Wrapper className="bg-light">
      <div className="container">
        <div className="row justify-content-center align-items-center min-vh-100">
          <div className="col-md-4">
            <div className="card shadow-lg rounded">
              <div className="card-body">
                <h3 className="text-center mb-4">Login</h3>

                {/* login form */}
                <form>
                  <div className="mb-3">
                    <label htmlFor="name" className="form-label">ID</label>
                    <input type="text" className="form-control" id="name" placeholder="id/PhoneNumber" />
                  </div>
                  <div className="mb-3">
                    <label htmlFor="password" className="form-label">Password</label>
                    <input type="password" className="form-control" id="password" placeholder="Create password" />
                  </div>
                  <div className="d-grid mb-3">
                    <button type="submit" className="btn btn-primary">login</button>
                  </div>
                </form>

                {/* Divider */}
                <div className="text-center mb-3">
                  <span>or</span>
                </div>

                {/* Social Buttons */}
                <div className="d-grid gap-2">
                  <button className="btn btn-google" type="button">
                    <i className="bi bi-google"></i> login with Google
                  </button>
                  <button className="btn btn-facebook" type="button">
                    <i className="bi bi-facebook"></i>login with Facebook
                  </button>
                </div>

              </div>
            </div>
          </div>
        </div>
      </div>
    </Wrapper>
  );
}

const Wrapper = styled.section`
  .btn-google {
    background-color: #db4437;
    color: white;
  }
  .btn-facebook {
    background-color: #3b5998;
    color: white;
  }
  .btn-google:hover,
  .btn-facebook:hover {
    opacity: 0.9;
  }

  @media (max-width: ${({ theme }) => theme.media.mobile}) {
    /* Responsive styles if needed */
  }
`;

export default logPage;
