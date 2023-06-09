
import { Route, Routes } from 'react-router-dom';
import Footer from './Component/Footer/Footer';
import Header from './Component/Header/Header';
import LoginPage from './Component/LoginPage/LoginPage';
import RegisterPage from './Component/RegisterPage/RegisterPage';
import { Book } from './Component/BookDetail/Book';
import ClientHomePage, { BookClient } from './Component/Client/BookClient';
import AdminHomePage from './Component/Body/AdminHomePage';

const App = () => {
  return (
    <>
      <Routes>
        <Route path="/library/login" element={<LoginPage />} />
        <Route path="/library/register" element={<RegisterPage />} />
        <Route path="/library/admin" element={<MainPage />} />
        <Route path="/library" element={<MainPage />} />
        <Route path="/library/book/:id" element={<Book />} />
      </Routes>
    </>
  );
};


const MainPage = () => {
  return (
    <>
      <Header />
      {
        localStorage.getItem("token") === "admin" ?<AdminHomePage />  : <ClientHomePage />
      }
      <Footer />
    </>
  );
};

export default App;
