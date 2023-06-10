import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './Header.css';

const Header = () => {
    const navigate = useNavigate();
    const [isLoggedIn, setIsLoggedIn] = useState(localStorage.getItem("token") !== null);
    const handleLogout = () => {
        localStorage.removeItem("token");
        setIsLoggedIn(false);
        navigate("/library");
        window.location.href = `/library`;
    };

    const handleLogoClick = () => {
        navigate("/library");
    };

    return (
        <header className="header">
            <div className="container">
                <div className="row align-items-center">
                    <div className="col-3">
                        <img
                            src="https://cdn-icons-png.flaticon.com/512/225/225932.png"
                            alt="Logo"
                            className="logo"
                            style={{ width: '60px', height: '60px', cursor: 'pointer' }}
                            onClick={handleLogoClick}
                        />
                    </div>
                    <div className="col-6 text-center">
                        <h1 className="header-title">Lê Quang Phúc - B20DCCN510</h1>
                    </div>
                    <div className="col-3 text-right">
                        {isLoggedIn ? (
                            <>
                                <h4>{localStorage.getItem("token")}</h4>
                                {
                                    localStorage.getItem("token") === "client" && (<>
                                        <Link to="/library/order" ><img
                                            src="https://cdn-icons-png.flaticon.com/512/4153/4153741.png"
                                            alt="Cart"
                                            style={{ width: '60px', height: '60px', cursor: 'pointer' }}
                                        /></Link>
                                        <span>  </span>
                                    </>)
                                }
                                <button className="btn btn-danger" onClick={handleLogout}>Logout</button>

                            </>
                        ) : (
                            <>
                                <Link to="/library/login" className="btn btn-success">Login</Link>
                                <span>  </span>
                                <Link to="/library/register" className="btn btn-primary">Register</Link>
                            </>
                        )}
                    </div>
                </div>
            </div>
        </header>
    );
};

export default Header;
