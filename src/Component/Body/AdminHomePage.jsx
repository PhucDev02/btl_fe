import React from "react";
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
const AdminHomePage = () => {
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
        <div className="d-flex justify-content-between mb-2">
          {localStorage.getItem("token") === "admin" && (
            <Link to={`/library/book/-1`} className="btn btn-primary">Add new</Link>
          )}
        </div>
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
                <td>{Book.title}</td>
                <td>{Book.author}</td>
                <td className="text-center">{Book.categoryName}</td>
                <td className="text-center">{Book.releaseDate}</td>
                <td className="text-center">{Book.pageNum}</td>
                <td className="text-center">{Book.soldNum}</td>
                <td>
                  <ActionElement id={Book.id} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
export default AdminHomePage;

const ActionElement = (props) => {
  const handleDelete = (id) => {
    const confirmDelete = window.confirm("Xác nhận xóa ?");
    if (confirmDelete) {
      fetch(`http://localhost:8080/book/${id}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
      })
        .then((response) => {
          if (response.ok) {
            window.location.reload()
          }
        })
        .catch((error) => {
          alert("Error deleting book:", error);
        });
    }
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