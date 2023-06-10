import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";

const OrderList = () => {
    const [orders, setOrders] = useState([]);
    const [bookItems, setBookItems] = useState({});

    useEffect(() => {
        fetchOrders();
    }, []);

    const fetchOrders = async () => {
        try {
            const userId = localStorage.getItem("userId");
            const response = await fetch(`http://localhost:8080/orders/id?userId=${userId}`);
            const data = await response.json();
            setOrders(data);
            fetchBooks(data);
        } catch (error) {
            console.log(error);
        }
    };

    const fetchBooks = async (orders) => {
        try {
            const bookIds = orders.map((order) => order.idBook);
            const bookPromises = bookIds.map((idBook) => fetch(`http://localhost:8080/book/${idBook}`));
            const bookResponses = await Promise.all(bookPromises);
            const bookData = await Promise.all(bookResponses.map((response) => response.json()));
            const books = bookData.reduce((acc, curr) => {
                acc[curr.id] = curr; // Lưu thông tin sách dựa trên id vào object bookItems
                return acc;
            }, {});
            setBookItems(books);
        } catch (error) {
            console.log(error);
        }
    };

    const handleCancelOrder = (orderId) => {
        const confirmed = window.confirm("Are you sure you want to cancel this order?");

        if (confirmed) {
            fetch(`http://localhost:8080/orders/${orderId}`, {
                method: 'DELETE'
              })
                .then(response => {
                  if (response.ok) {
                    console.log(`Order with ID ${orderId} has been canceled.`);
                    // Nếu hủy thành công, cập nhật lại danh sách đơn hàng
                    fetchOrders();
                  } else {
                    console.log(`Failed to cancel order with ID ${orderId}.`);
                  }
                })
                .catch(error => {
                  console.log("Error canceling order:", error);
                });
        }
    };


    return (
        <div className="container">
            <br></br>
            <table className="table table-striped table-bordered table-hover">
                <thead className="table-dark">
                    <tr>
                        <th className="text-center">Book Image</th>
                        <th className="text-center">Book Title</th>
                        <th className="text-center"> Author</th>
                        <th className="text-center">Quantity</th>
                        <th className="text-center">Action</th>
                    </tr>
                </thead>
                <tbody>
                    {orders.map((order) => (
                        <tr key={order.id}>
                            <td>
                                <div className="d-flex justify-content-center align-items-center" style={{ height: "100px" }}>
                                    <img src={bookItems[order.idBook]?.cover} alt="Book Cover" style={{ maxWidth: "100%", maxHeight: "100%" }} />
                                </div>
                            </td>
                            <td>{bookItems[order.idBook]?.title}</td>
                            <td>{bookItems[order.idBook]?.author}</td>
                            <td className="text-center">{order.sum}</td>
                            <td>
                                <div className="d-flex justify-content-center align-items-center" >
                                    <Link to={`/library/book/${order.idBook}`} className="btn btn-primary">
                                        View
                                    </Link>
                                    <button className="btn btn-danger" onClick={() => handleCancelOrder(order.id)}>
                                        Cancel
                                    </button>
                                </div>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default OrderList;