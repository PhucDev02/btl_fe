import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";

const ClientHomePage = () => {
    const [books, setBooks] = useState([]);

    useEffect(() => {
        fetch("http://localhost:8080/book")
            .then((response) => response.json())
            .then((data) => {
                setBooks(data);
            })
            .catch((error) => {
                console.log("Error fetching books:", error);
            });
    }, []);


    return (
        <>
            <div className="container mt-4 " style={{ overflow: 'auto', height: '500px' }}>
                <div className="row" >
                    {books.map((book) => (
                        <div className="col-lg-3 col-md-4 mb-4" key={book.id}>
                            <div className="card h-100 border border-dark">
                                <Link to={`/library/book/${book.id}`}>
                                    <div className="position-relative">
                                        <img
                                            src={book.cover}
                                            className="card-img-top border border-3 rounded "
                                            alt="Book Cover"
                                            style={{ objectFit: "contain", height: "200px" }}
                                        />
                                        <div className="card-body d-flex flex-column justify-content-end">
                                            <h5 >{book.title}</h5>
                                            <p  >Author: {book.author}</p>
                                        </div>
                                    </div>
                                </Link>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </>

    );
};

export default ClientHomePage;
