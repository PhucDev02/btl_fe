import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import Header from "../Header/Header";
export const BookClient = () => {
    const params = useParams();
    const id = params.id;

    const [bookItem, setBookItem] = useState({});
    const [category, setCategory] = useState([]);
    const [editing, setEditing] = useState(id < 0 ? true : false);
    const [quantity, setQuantity] = useState(1);
    const [rating, setRating] = useState(0);
    const [comment, setComment] = useState("");
    const [reviews, setReviews] = useState([]);
    const [averageRating, setAverageRating] = useState(0);
    useEffect(() => {
        fetch(`http://localhost:8080/book/${id}`)
            .then((response) => response.json())
            .then((data) => setBookItem(data))
            .catch((err) => console.log(err));

    }, []);

    useEffect(() => {
        fetchReviews();
    }, []);

    const fetchReviews = () => {
        fetch(`http://localhost:8080/ratings/book/${id}`)
            .then((response) => response.json())
            .then((data) => {
                setReviews(data)
                setAverageRating(calculateAverageRating(data))
            })
            .catch((error) => console.log("Error:", error));
    };
    const handleAddToCart = () => {
        const order = {
            idUser: localStorage.getItem("userId"),
            idBook: bookItem.id,
            sum: quantity
        };
        console.log(order);
        // Thực hiện gửi yêu cầu đặt hàng đến máy chủ
        fetch("http://localhost:8080/orders", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(order)
        })
            .then((response) => {
                if (response.ok) {
                    UpdateQuantityBE(bookItem, order)
                    alert("Order placed successfully");
                    console.log("Order placed successfully");
                    window.location.href = `/library/order`;
                } else {
                    alert("Failed to place order");
                    // Xử lý lỗi
                    console.log("Failed to place order");
                }
            })
            .catch((error) => {
                console.log("Error:", error);
            });
    };



    const handleQuantityChange = (event) => {
        setQuantity(parseInt(event.target.value));
    };

    const handleRatingChange = (e) => {
        setRating(e.target.value)
    };

    const handleCommentChange = (e) => {
        setComment(e.target.value)
    };

    const handleAddReview = () => {
        const newReview = {
            star: rating,
            idUser: localStorage.getItem("userId"),
            idBook: bookItem.id,
            review: comment
        };
        if (newReview.star === 0) {
            alert("Vui lòng rating ^^")
            return;
        }
        if (newReview.review === "") {
            alert("Vui lòng để lại một lời nhận xét ^^")
            return;
        }
        console.log(newReview);
        fetch("http://localhost:8080/ratings", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(newReview)
        })
            .then((response) => {
                if (response.ok) {
                    console.log("Review added successfully");
                    fetchReviews(); // Lấy lại danh sách đánh giá sau khi thêm thành công
                    // Xử lý thành công
                    setComment("")
                    setRating(0)
                } else {
                    console.log("Failed to add review");
                    // Xử lý lỗi
                }
            })
            .catch((error) => {
                console.log("Error:", error);
            });
    };

    return (
        <>
            <Header />
            <div style={{ marginBottom: '20px' }} >  </div>
            <div className="container">
                <div className="row">
                    <div className="col-4">
                        <img src={bookItem.cover} alt={bookItem.title} className="img-fluid" />
                    </div>
                    <div className="col-8">
                        <h1>{bookItem.title}</h1>
                        <p className="ml-4 mt-4">Author: {bookItem.author}</p>
                        <p className="ml-4">Category: {bookItem.category}</p>
                        <p className="ml-4">Description: {bookItem.description}</p>
                        <div className="d-flex align-items-center ml-4">
                            <label htmlFor="quantity" className="mr-2">Quantity:</label>
                            <input type="number" id="quantity" min="1" value={quantity} onChange={handleQuantityChange} style={{ maxWidth: "85px" }} />
                            <button className="btn btn-primary ml-2" onClick={handleAddToCart} disabled={localStorage.getItem("token") !== 'client'}>Add to cart</button>
                        </div>
                    </div>
                </div>

                <div className="row">
                    <div className="col-12">
                        <h2>Reviews</h2>
                        <p  style={{ color: "blue" }}> Average Rating: {averageRating} ★</p>
                        <div className="row">
                            <div className="col-12">
                                <ul className="list-group">
                                    {reviews.map((review) => (
                                        <li className="list-group-item" key={review.id}>
                                            {/* <p style={{ color: 'blue' }}>Username: {review.username}</p> */}
                                            <p style={{ color: "blue" }}>Rating: {review.star} ★</p>
                                            <p >{review.review}</p>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </div>
                        <div className="row">
                            <div className="col-12">
                                <div className="form-group">
                                    <label htmlFor="rating">Rating</label>
                                    <select className="form-control" id="rating" value={rating} onChange={handleRatingChange}>
                                        <option value="0">Select rating</option>
                                        <option value="1">1 star</option>
                                        <option value="2">2 stars</option>
                                        <option value="3">3 stars</option>
                                        <option value="4">4 stars</option>
                                        <option value="5">5 stars</option>
                                    </select>
                                </div>
                                <div className="form-group">
                                    <label htmlFor="comment">Comment</label>
                                    <textarea className="form-control" id="comment" rows="3" value={comment} onChange={handleCommentChange}></textarea>
                                </div>
                                <button className="btn btn-primary mt-2 mb-4" onClick={handleAddReview} disabled={localStorage.getItem("token") !== 'client'}>Add review</button>
                            </div>
                        </div>
                        <div className="row">
                            <div className="col-12">
                                <ul className="list-group">
                                    {bookItem.reviews?.map((review) => (
                                        <li className="list-group-item" key={review.id}>
                                            <p>Rating: {review.rating}</p>
                                            <p>Comment: {review.comment}</p>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
                {localStorage.getItem("token") !== 'client' ? (
                    <div className="d-flex flex-column align-items-center mt-4">
                        <p class="font-weight-bold" style={{ color: 'red', fontWeight: 'normal' }} >Please login to purchase or review !</p>
                    </div>
                ) : null}
            </div>
        </>
    );
};
const UpdateQuantityBE = (bookItem, order) => {
    fetch(`http://localhost:8080/book/purchase/${bookItem.id}?quantity=${order.sum}`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(order.sum)
    })
        .then((response) => {
            if (response.ok) {
                console.log("Quantity updated successfully");
                // Xử lý thành công
            } else {
                console.log("Failed to update quantity");
                // Xử lý lỗi
            }
        })
        .catch((error) => {
            console.log("Error:", error);
        });
}
const calculateAverageRating = (reviews) => {
    if (reviews.length === 0) {
        return 0;
    }

    const totalRating = reviews.reduce((sum, review) => sum + review.star, 0);
    return totalRating / reviews.length;
};