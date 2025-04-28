import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css'; // Ensure to import Bootstrap

function ConfirmationPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const [formData, setFormData] = useState(location.state?.formData || null);
  const [statusMessage, setStatusMessage] = useState('');
  const [isEditing, setIsEditing] = useState({
    firstName: false,
    lastName: false,
    phoneNumber: false,
    email: false,
    address: false,
    gender: false,
    profileImage: false,
  });
  const [profileImagePreview, setProfileImagePreview] = useState(null);

  useEffect(() => {
    // If formData is not available from navigation state, redirect
    if (!formData) {
      navigate('/');
    } else {
      // Initialize local state based on the passed formData
      setFormData(prevData => ({ ...prevData, profileImage: null }));
      // If there was a profile image URL (though not directly passed now), handle it here if needed
    }
  }, [navigate, location.state?.formData]);

  const handleConfirm = async () => {
    if (!formData) return;

    const apiFormData = new FormData();
    apiFormData.append('USER_ID', formData.userId); // Assuming you might want to add this later
    apiFormData.append('FULL_NAME', `${formData.firstName} ${formData.lastName}`);
    apiFormData.append('PHONE_NUMBER', formData.phoneNumber);
    apiFormData.append('EMAIL', formData.email);
    apiFormData.append('ADDRESS', formData.address);
    apiFormData.append('GENDER', formData.gender);
    if (formData.profileImage) {
      apiFormData.append('PROFILE_IMAGE', formData.profileImage);
    }

    try {
      const response = await fetch('https://api.hamrorealstate.store/register', {
        method: 'POST',
        body: apiFormData,
      });

      if (response.ok) {
        setStatusMessage('Registration successful!');
        // Optionally navigate to another page upon successful registration
        // navigate('/registration-success');
      } else {
        const errorData = await response.json();
        setStatusMessage(errorData.message || 'Failed to register. Please try again later.');
      }
    } catch (error) {
      console.error('API Connection Error:', error);
      setStatusMessage('Cannot connect to API');
    }
  };

  // Go back to the AuthPage
  const handleGoBack = () => {
    navigate('/LoginPage'); 
  };

  const handleEdit = (field) => {
    setIsEditing({ ...isEditing, [field]: true });
  };

  const handleChange = (e, field) => {
    if (field === 'profileImage') {
      const file = e.target.files[0];
      setFormData({ ...formData, [field]: file });
      if (file) {
        setProfileImagePreview(URL.createObjectURL(file));
      } else {
        setProfileImagePreview(null);
      }
    } else {
      setFormData({
        ...formData,
        [field]: e.target.value,
      });
    }
  };

  const handleSave = (field) => {
    setIsEditing({ ...isEditing, [field]: false });
  };

  if (!formData) {
    return <div style={{ textAlign: 'center', padding: '20px' }}>Loading...</div>;
  }

  return (
    <div style={{ background: 'linear-gradient(135deg, #1d2b64, #f8cdda)', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ backgroundColor: 'white', borderRadius: '12px', boxShadow: '0 4px 15px rgba(0, 0, 0, 0.1)', padding: '30px', width: '100%', maxWidth: '600px', margin: '20px', fontFamily: 'Arial, sans-serif' }}>
        <h3 style={{ fontSize: '2rem', color: '#333', textAlign: 'center', marginBottom: '20px', fontWeight: 'bold' }}>Confirm Your Details</h3>

        {Object.entries(formData).map(([key, value]) => {
          if (key === 'firstName' || key === 'lastName') {
            const fullNameKey = 'fullName';
            const fullNameValue = `${formData.firstName} ${formData.lastName}`;
            return (
              <div key={fullNameKey} style={{ backgroundColor: '#f8f9fa', border: '1px solid #ddd', borderRadius: '8px', padding: '15px', margin: '15px 0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <strong style={{ fontWeight: 'bold', marginRight: '10px', flexShrink: 0, width: '120px' }}>FULL NAME:</strong>
                <div style={{ display: 'flex', alignItems: 'center', flexGrow: 1, justifyContent: 'flex-end' }}>
                  {isEditing[fullNameKey] ? (
                    <div style={{ display: 'flex', alignItems: 'center', width: '100%' }}>
                      <input
                        type="text"
                        value={fullNameValue || ''}
                        onChange={(e) => {
                          const [first, ...rest] = e.target.value.split(' ');
                          handleChange({ target: { name: 'firstName', value: first } }, 'firstName');
                          handleChange({ target: { name: 'lastName', value: rest.join(' ') } }, 'lastName');
                        }}
                        style={{ width: '100%', padding: '12px', margin: '8px 0', borderRadius: '6px', border: '1px solid #ccc' }}
                      />
                      <button onClick={() => handleSave(fullNameKey)} style={{ backgroundColor: '#28a745', color: 'white', padding: '6px 12px', borderRadius: '4px', cursor: 'pointer', marginLeft: '10px', fontSize: '0.9rem' }}>
                        Save
                      </button>
                    </div>
                  ) : (
                    <div style={{ display: 'flex', alignItems: 'center' }}>
                      <p style={{ marginRight: '10px' }}>{fullNameValue || 'No name provided'}</p>
                      <button onClick={() => handleEdit(fullNameKey)} style={{ backgroundColor: '#007bff', color: 'white', padding: '6px 12px', borderRadius: '4px', cursor: 'pointer', marginLeft: '10px', fontSize: '0.9rem' }}>
                        Edit
                      </button>
                    </div>
                  )}
                </div>
              </div>
            );
          }
          if (key === 'profileImage') {
            return (
              <div key={key} style={{ backgroundColor: '#f8f9fa', border: '1px solid #ddd', borderRadius: '8px', padding: '15px', margin: '15px 0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <strong style={{ fontWeight: 'bold', marginRight: '10px', flexShrink: 0, width: '120px' }}>PROFILE IMAGE:</strong>
                <div style={{ display: 'flex', alignItems: 'center', flexGrow: 1, justifyContent: 'flex-end' }}>
                  {isEditing[key] ? (
                    <div style={{ display: 'flex', alignItems: 'center', width: '100%' }}>
                      <input
                        type="file"
                        onChange={(e) => handleChange(e, key)}
                        style={{ width: '100%', padding: '8px 0' }}
                      />
                      {profileImagePreview && (
                        <img
                          src={profileImagePreview}
                          alt="Profile Preview"
                          style={{ maxWidth: '80px', maxHeight: '80px', borderRadius: '50%', marginRight: '10px' }}
                        />
                      )}
                      <button onClick={() => handleSave(key)} style={{ backgroundColor: '#28a745', color: 'white', padding: '6px 12px', borderRadius: '4px', cursor: 'pointer', marginLeft: '10px', fontSize: '0.9rem' }}>
                        Save
                      </button>
                    </div>
                  ) : (
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', flexGrow: 1 }}>
                      {profileImagePreview && (
                        <img
                          src={profileImagePreview}
                          alt="Profile Preview"
                          style={{ maxWidth: '100px', maxHeight: '100px', borderRadius: '50%', marginRight: '10px' }}
                        />
                      )}
                      <button onClick={() => handleEdit(key)} style={{ backgroundColor: '#007bff', color: 'white', padding: '6px 12px', borderRadius: '4px', cursor: 'pointer', marginLeft: '10px', fontSize: '0.9rem' }}>
                        Edit
                      </button>
                    </div>
                  )}
                </div>
              </div>
            );
          }
          return (
            <div key={key} style={{ backgroundColor: '#f8f9fa', border: '1px solid #ddd', borderRadius: '8px', padding: '15px', margin: '15px 0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <strong style={{ fontWeight: 'bold', marginRight: '10px', flexShrink: 0, width: '120px' }}>{key.replace(/([A-Z])/g, ' $1').toUpperCase()}:</strong>
              <div style={{ display: 'flex', alignItems: 'center', flexGrow: 1, justifyContent: 'flex-end' }}>
                {isEditing[key] ? (
                  <div style={{ display: 'flex', alignItems: 'center', width: '100%' }}>
                    <input
                      type="text"
                      value={value || ''}
                      onChange={(e) => handleChange(e, key)}
                      style={{ width: '100%', padding: '12px', margin: '8px 0', borderRadius: '6px', border: '1px solid #ccc' }}
                    />
                    <button onClick={() => handleSave(key)} style={{ backgroundColor: '#28a745', color: 'white', padding: '6px 12px', borderRadius: '4px', cursor: 'pointer', marginLeft: '10px', fontSize: '0.9rem' }}>
                      Save
                    </button>
                  </div>
                ) : (
                  <div style={{ display: 'flex', alignItems: 'center' }}>
                    <p style={{ marginRight: '10px' }}>{value || 'No value provided'}</p>
                    <button onClick={() => handleEdit(key)} style={{ backgroundColor: '#007bff', color: 'white', padding: '6px 12px', borderRadius: '4px', cursor: 'pointer', marginLeft: '10px', fontSize: '0.9rem' }}>
                      Edit
                    </button>
                  </div>
                )}
              </div>
            </div>
          );
        })}

        {statusMessage && <div style={{ marginTop: '20px', textAlign: 'center', backgroundColor: '#d1ecf1', color: '#0c5460', padding: '15px', borderRadius: '8px', fontWeight: 'bold' }}>{statusMessage}</div>}

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px', marginTop: '20px' }}>
          <button
            onClick={handleConfirm}
            className="btn btn-success"
            style={{ padding: '12px', fontSize: '1.1rem', borderRadius: '8px' }}
          >
            Confirm and Register
          </button>

          <button
            onClick={handleGoBack}
            className="btn btn-warning"
            style={{ padding: '12px', fontSize: '1.1rem', borderRadius: '8px' }}
          >
            Back To Signup
          </button>
        </div>
      </div>
    </div>
  );
}

export default ConfirmationPage;