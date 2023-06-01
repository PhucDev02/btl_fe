
import { Route, Routes } from 'react-router-dom';
import Footer from './Component/Footer/Footer';
import Header from './Component/Header/Header';
import LoginPage from './Component/LoginPage/LoginPage';
import RegisterPage from './Component/RegisterPage/RegisterPage';
import BookTableBody from './Component/Body/BookTableBody';
import { Book } from './Component/BookDetail/Book';

const App = () => {
  return (
    <>
      <Routes>
        <Route path="/library/login" element={<LoginPage />} />
        <Route path="/library/register" element={<RegisterPage />} />
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
      <BookTableBody />
      <Footer />
    </>
  );
};

export default App;
