import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import "./Book.css";

export const Book = () => {
  const navigate = useNavigate();
  const params = useParams();
  const id = params.id;
  const [bookItem, setBookItem] = useState({});
  const [category, setCategory] = useState([]);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [uploadedImage, setUploadedImage] = useState("");
  const [editing, setEditing] = useState(id < 0 ? true : false);

  useEffect(() => {
    fetch(`http://localhost:8080/book/${id}`)
      .then((response) => response.json())
      .then((data) => setBookItem(data))
      .catch((err) => console.log(err));
    fetch("http://localhost:8080/category")
      .then((response) => response.json())
      .then((data) => setCategory(data))
      .catch((err) => console.log(err));
  }, []);

  const handleUpload = () => {
    setBookItem({ ...bookItem, cover: uploadedImage });
    setShowUploadModal(false);
  };

  const handleImageChange = (e) => {
    setBookItem({ ...bookItem, cover: e.target.value });
    const file = e.target.files[0];

    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setBookItem({ ...bookItem, cover: imageUrl });
    }
  };

  const handleEdit = () => {
    setEditing(true);
    setShowUploadModal(true);
  };

  const handleSave = () => {
    setEditing(false);
    // Thực hiện gửi dữ liệu cập nhật lên server
    // ...
  };

  const handleAdd = () => {
    if (validateFields()) {
      const confirmed = window.confirm("Xác nhận thêm sách này ?");
      if (confirmed) {
        console.log(bookItem);
        fetch(`http://localhost:8080/addBook?title=${bookItem.title}&author=${bookItem.author}&idCategory=${bookItem.idCategory}&releaseDate=${bookItem.releaseDate}&pageNum=${bookItem.pageNum}&description=${bookItem.description}&cover=${bookItem.cover}`)
          .then((response) => response.text())
          .then((data) => {
            if (data === "true") {
              navigate('/library');
            } else {
              alert("Trùng tên tác giả hoặc tên sách !!");
            }
          })
          .catch((error) => {
            alert(error);
          });
      }
    }
  };

  const validateFields = () => {
    const errors = {};

    if (!bookItem.title) {
      alert("Vui lòng nhập tiêu đề");
      return false;
    }

    if (!bookItem.author) {
      alert("Vui lòng nhập tác giả");
      return false;
    }

    if (!bookItem.releaseDate) {
      alert("Vui lòng chọn ngày phát hành");
      return false;
    }

    return true;
  };

  return (
    <div className="Bookdetail">
      <div className="container">
        <div className="row">
          <div className="col-6">
            <div className="title-author d-flex">
              <div className="title">
                <label htmlFor="Text">Tiêu đề: </label> <br />
                <input
                  type="text"
                  name="title"
                  id="title"
                  value={bookItem.title}
                  onChange={(e) =>
                    setBookItem({ ...bookItem, title: e.target.value })
                  }
                  disabled={!editing}
                  required
                />
              </div>
              <div className="author">
                <label htmlFor="Text">Tác giả: </label> <br />
                <input
                  type="text"
                  name="author"
                  id="author"
                  value={bookItem.author}
                  onChange={(e) =>
                    setBookItem({ ...bookItem, author: e.target.value })
                  }
                  disabled={!editing}
                  required
                />
              </div>
            </div>
            <div className="description">
              <label htmlFor="Text">Mô tả về sách: </label> <br />
              <textarea
                name="description"
                id="description"
                value={bookItem.description}
                onChange={(e) =>
                  setBookItem({ ...bookItem, description: e.target.value })
                }
                disabled={!editing}
              ></textarea>
            </div>
            <div className="date-pageNumber d-flex">
              <div className="date">
                <label htmlFor="text">Ngày phát hành:</label> <br />
                <input
                  type="date"
                  name="releasedate"
                  id="releasedate"
                  value={bookItem.releaseDate}
                  onChange={(e) =>
                    setBookItem({ ...bookItem, releaseDate: e.target.value })
                  }
                  disabled={!editing}
                  required
                />
              </div>
              <div className="pageNum">
                <label htmlFor="text">Số trang:</label> <br />
                <input
                  type="number"
                  name="pageNumber"
                  id="pageNumber"
                  value={bookItem.pageNum}
                  onChange={(e) =>
                    setBookItem({ ...bookItem, pageNum: e.target.value })
                  }
                  disabled={!editing}
                />
              </div>
            </div>
            <div className="category">
              <label htmlFor="text">Thể Loại: </label> <br />
              {id < 0 ? (
                <select
                  value={bookItem.category}
                  onChange={(e) =>
                    setBookItem({ ...bookItem, category: e.target.value })
                  }
                >
                  <option value="">Thể loại</option>
                  {category.map((category) => (
                    <option key={category.id} value={category.id}>
                      {category.name}
                    </option>
                  ))}
                </select>
              ) : (
                <div>
                  {editing ? (
                    <select
                      value={bookItem.category}
                      onChange={(e) =>
                        setBookItem({ ...bookItem, category: e.target.value })
                      }
                    >
                      <option value="" aria-required>
                        Thể loại
                      </option>
                      {category.map((category) => (
                        <option key={category.id} value={category.id}>
                          {category.name}
                        </option>
                      ))}
                    </select>
                  ) : (
                    <input
                      type="text"
                      name="category"
                      id="category"
                      value={bookItem.categoryName}
                      onChange={(e) =>
                        setBookItem({ ...bookItem, category: e.target.value })
                      }
                      disabled={!editing}
                    />
                  )}
                </div>
              )}
            </div>
          </div>
          <div className="col-4 text-center">
            <div className="cover d-flex flex-column">
              <span>{id < 0 ? "" : `Trang bìa`} </span>
              {id < 0 ? (
                showUploadModal ? (
                  <div className="upload-modal">
                    <input
                      className="img-url"
                      type="text"
                      placeholder="Nhập đường link hoặc kéo thả đường link ảnh"
                      value={bookItem.cover}
                      onChange={(e) => {
                        setUploadedImage(e.target.value);
                        setBookItem({ ...bookItem, cover: e.target.value });
                      }}
                    />
                    <input
                      className="img-file"
                      type="file"
                      accept="image/*"
                      onChange={handleImageChange}
                    />
                    <button onClick={handleUpload}>Upload</button>
                  </div>
                ) : (
                  <>
                    <button onClick={() => setShowUploadModal(true)}>
                      Upload
                    </button>
                    {bookItem.cover && (
                      <img
                        className="cover"
                        src={bookItem.cover}
                        alt="bìa sách"
                      />
                    )}
                  </>
                )
              ) : (
                <span>
                  <img
                    className="cover"
                    src={bookItem.cover}
                    alt="bìa sách"
                  />
                </span>
              )}
            </div>
          </div>
        </div>
      </div>
      <div
        className="footer"
        style={{ display: "flex", justifyContent: "flex-end" }}
      >
        {id < 0 ? (
          <button className="btn btn-success" onClick={handleAdd}>
            Add
          </button>
        ) : (
          <>
            {editing ? (
              <button className="btn btn-success" onClick={handleSave}>
                Save
              </button>
            ) : (
              <button className="btn btn-warning" onClick={handleEdit}>
                Edit
              </button>
            )}
          </>
        )}
        <div className="footer-decoration"></div>
      </div>
    </div>
  );
};
