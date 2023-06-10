
import { Route, Routes } from 'react-router-dom';
import Footer from './Component/Footer/Footer';
import Header from './Component/Header/Header';
import LoginPage from './Component/LoginPage/LoginPage';
import RegisterPage from './Component/RegisterPage/RegisterPage';
import { BookDetail } from './Component/BookDetail/BookDetail';
import OrderList from './Component/Order/OrderList';
import { BookClient } from './Component/BookClient/BookClient';
import ClientHomePage from './Component/Body/ClientHomePage';
import AdminBookTable from './Component/Body/AdminBookTable';

const App = () => {
  return (
    <>
      <Routes>
        <Route path="/library/login" element={<LoginPage />} />
        <Route path="/library/register" element={<RegisterPage />} />
        <Route path="/library" element={<MainPage />} />
        <Route path="/library/book/:id" element={<BookClient />} />
        <Route path="/admin" element={<AdminBookTable />} />
        <Route path="/admin/book/:id" element={<BookDetail />} />
        <Route path="/library/order" element={<OrderPage />} />
      </Routes>
    </>
  );
};


const MainPage = () => {
  return (
    <>
      <Header />
      {localStorage.getItem("token") === "admin" ? <AdminBookTable /> : <ClientHomePage />}
      <Footer />
    </>
  );
};

const OrderPage = () => {
  return (
    <>
      <Header />
      <OrderList />
      <Footer />
    </>
  );
};
export default App;
