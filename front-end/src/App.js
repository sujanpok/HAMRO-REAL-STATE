import HomePage from './Components/HomePage';
import AboutPage from './Components/AboutPage';
import ContactPage from './Components/ContactPage';
import LoginPage from './Components/LoginPage';
import Dashboard from './Components/Dashboard';
import Footer from './Components/Footer';
import Navbar from './Components/NavBar';
import ConfirmationPage from './Components/ConfirmationPage';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from 'styled-components';
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';
import './CSS/Common/Common.css';

function App() {
  const theme = {
    colors: {
      bg: "#fff",
    },
    media: {
      mobile: "768px",
      tab: "998px",
    }
  };
  return (
    <>
    <ThemeProvider theme={theme}>
    <BrowserRouter>
        <Navbar />
        <Routes>
          <Route exact path='/' element={<HomePage />} />
          <Route exact path='/about' element={<AboutPage />} />
          <Route exact path='/contact' element={<ContactPage />} />
          <Route exact path='/login' element={<LoginPage />} />
          <Route exact path="/confirm" element={<ConfirmationPage />} />
          <Route exact path='/dashboard' element={<Dashboard />} /> {/* <-- Added this */}
        </Routes>
        <Footer />
    </BrowserRouter>
    </ThemeProvider>
    </>
  );
}

export default App;