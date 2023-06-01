import React from "react";
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
const BookTableBody = () => {
    const [book, setBook] = useState([]);
    const [remain, setRemain] = useState([]);
    useEffect(() => {
        console.log("Book");
        fetch("http://localhost:8080/book")
            .then((response) => response.json())
            .then((data) => {
                console.log(data);
                setBook(data);
            })
            .catch((err) => console.log(err));
    }, []);

    useEffect(() => {
        setRemain(book);
    }, [book]);


    return (
        <div>
            <div className="container">
                <br></br>
                <table className="table table-striped table-bordered">
                    <thead className="table-dark">
                        <tr>
                            <th className="text-center">Title</th>
                            <th className="text-center">Author</th>
                            <th className="text-center">Category</th>
                            <th className="text-center">Release</th>
                            <th className="text-center">Page Num</th>
                            <th className="text-center">Sold Quantity</th>
                            <th className="text-center">Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {remain.map((Book) => (
                            <tr key={Book.id}>
                                <td >{Book.title}</td>
                                <td >{Book.author}</td>
                                <td className="text-center">{Book.category}</td>
                                <td className="text-center">{Book.releaseDate}</td>
                                <td className="text-center">{Book.pageNum}</td>
                                <td className="text-center">{Book.soldNum}</td>
                                <td>
                                    <ActionElement id={Book.id} /> </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                {
                    localStorage.getItem("token") === "admin" &&
                    (<div className="d-flex justify-content-center">

                        <Link to={`/library/book/-1`} className="btn btn-primary">Add new</Link>
                    </div>
                    )
                }


            </div>
        </div>
    );
};
export default BookTableBody;

const ActionElement = (props) => {
    const handleDelete = (id) => {
        fetch(`http://localhost:8080/deleteBook/${id}`)
            .then((response) => window.location.reload())
            .then((data) => {
                console.log(id);
            })
            .catch((err) => console.log(err));
    };
    return localStorage.getItem("token") === "admin" && (
        <>
            <div className="d-flex justify-content-center">
                <Link to={`/library/book/${props.id}`} className="btn btn-primary">View</Link>
                <button className="btn btn-danger" onClick={() => handleDelete(props.id)}>Delete</button>
            </div>
        </>
    );
};