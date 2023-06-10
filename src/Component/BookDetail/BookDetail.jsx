import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import "./Book.css";
import { isEditable } from "@testing-library/user-event/dist/utils";
import Header from "../Header/Header";
const isNumericString = (str) => {
  return /^\d+$/.test(str);
};
const searchKeyByValue = (list, value) => {
  const foundObject = list.find((obj) => obj.name === value);
  return foundObject ? foundObject.key : undefined;
};
export const BookDetail = () => {
  const params = useParams();
  const id = params.id;
  const [isAdding, setIsAdding] = useState(id < 0 ? true : false);
  const [bookItem, setBookItem] = useState({});
  const [category, setCategory] = useState([]);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [uploadedImage, setUploadedImage] = useState("");
  const [editing, setEditing] = useState(id < 0 ? true : false);
  const [editingCover, setEditingCover] = useState(false);


  useEffect(() => {
    fetch(`http://localhost:8080/book/${id}`)
      .then((response) => response.json())
      .then((data) => {
        setBookItem(data);
        console.log("Fetch", data)
      })
      .catch((err) => console.log(err));
    fetch("http://localhost:8080/category")
      .then((response) => response.json())
      .then((data) => setCategory(data))
      .catch((err) => console.log(err));
  }, []);
  const handleAdd = () => {
    // Tạo một đối tượng chứa dữ liệu mới
    const newData = {
      title: bookItem.title,
      author: bookItem.author,
      description: bookItem.description,
      releaseDate: bookItem.releaseDate,
      pageNumber: bookItem.pageNumber,
      idCategory: bookItem.category,
      cover: bookItem.cover
    };
    console.log(newData)
    validateBookData(newData);
    // Gửi dữ liệu mới lên server
    fetch("http://localhost:8080/book", {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(newData),
    })
      .then((response) => response.json())
      .then((data) => {
        setIsAdding(false);
        window.location.href = `/admin/book/${data.id}`;
      })
      .catch((error) => {
        alert("Tên sách của tác giả này đã tồn tại ")
      });
  };



  const handleImageChange = (e) => {
    const file = e.target.files[0];
    const reader = new FileReader();
    reader.onloadend = () => {
      setUploadedImage(reader.result);
      setBookItem({ ...bookItem, cover: reader.result });
    };
    if (file) {
      reader.readAsDataURL(file);
    }
  };


  const handleEdit = () => {
    setEditing(true);
  };
  const validateBookData = (data) => {
    if (!data.title || data.title.trim() === '') {
      alert('Vui lòng nhập tiêu đề');
      return false;
    }

    if (!data.author || data.author.trim() === '') {
      alert('Vui lòng nhập tác giả');
      return false;
    }

    if (!data.releaseDate || isNaN(Date.parse(data.releaseDate))) {
      alert('Vui lòng chọn ngày phát hành');
      return false;
    }
    if (data.pageNumber < 0) {
      alert('Số trang không được nhỏ hơn 0');
      return false;
    }
    if (data.idCategory === null) { //add nhưng không chọn thể loại
      data.idCategory = 0;
      bookItem.idCategory = 0;
    }
    if (isNumericString(data.idCategory) === false) {
      // console.log( data.idCategory)
      // console.log(category)

      // data.idCategory = searchKeyByValue(category, data.idCategory);
      // console.log( data.idCategory)
      data.idCategory = 0;
    }
    return true;
  }
  const handleUpdate = () => {
    setEditing(false);
    setEditingCover(false);

    const updatedData = {
      title: bookItem.title,
      author: bookItem.author,
      description: bookItem.description,
      releaseDate: bookItem.releaseDate,
      pageNumber: bookItem.pageNumber,
      idCategory: bookItem.category,
      cover: bookItem.cover
    };

    validateBookData(updatedData);
    console.log(updatedData)
    // Gửi dữ liệu cập nhật lên server
    fetch(`http://localhost:8080/book/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(updatedData),
    })
      .then((response) => response.json())
      .then((data) => {
        // Xử lý dữ liệu phản hồi từ server (nếu cần)
        console.log('Data updated:', data, updatedData);
        window.location.href = `/admin/book/${id}`;
      })
      .catch((error) => {
       window.location.href = `/admin/book/${id}`;
        console.error('Error:', error);
      });
  };


  return (
    <>
      <Header />
      {
        localStorage.getItem("token") === "admin" &&
        (<div className="Bookdetail">
          <form className="container">
            <div className="row">
              <div className="col-6">
                <div className="title-author d-flex">
                  <div className="title">
                    <label htmlFor="Text">Tiêu đề: <span style={{ color: 'red' }}>*</span></label>
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
                    <label htmlFor="Text">Tác giả: <span style={{ color: 'red' }}>*</span></label>
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
                  <label htmlFor="Text">Mô tả về sách: </label>
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
                    <label htmlFor="text">Ngày phát hành: <span style={{ color: 'red' }}>*</span></label>
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
                  <div className="pagenumber">
                    <label htmlFor="text">Số trang:</label>
                    <input
                      type="number"
                      name="pageNumber"
                      id="pageNumber"
                      min="1"
                      value={bookItem.pageNumber} // Thay đổi tại đây
                      onChange={(e) =>
                        setBookItem({ ...bookItem, pageNumber: e.target.value })
                      }
                      disabled={!editing}
                    />
                  </div>
                </div>
                <div className="category">
                  <label htmlFor="text">Thể Loại: </label>
                  {id < 0 ? (
                    <select
                      value={bookItem.category}
                      onChange={(e) =>
                        setBookItem({ ...bookItem, category: e.target.value })
                      }>
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
                          <option value="" aria-required>{bookItem.category}</option>
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
                          value={bookItem.category}
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
                  {isAdding || (editing && editingCover) ? (
                    <div className="upload-modal">
                      <input
                        className="img-file"
                        type="file"
                        accept="image/*"
                        onChange={handleImageChange}
                      />
                      {/* <button onClick={handleUpload}>Upload</button> */}
                      {bookItem.cover && (
                        <img className="cover" src={bookItem.cover} alt="bìa sách" />
                      )}
                    </div>

                  ) : (
                    <>
                      {editing && <button onClick={() => setEditingCover(true)}>Edit Cover</button>}
                      {bookItem.cover && (
                        <img className="cover" src={bookItem.cover} alt="bìa sách" />
                      )}
                    </>
                  )}

                </div>
              </div>
            </div>
            <div className="footer d-flex justify-content-end">
              {isAdding ? (
                <button type="button" class="btn btn-success" onClick={handleAdd}>Add</button>
              ) : (
                <>
                  {editing ? (
                    <button type="button" class="btn btn-success" onClick={handleUpdate}>Update</button>
                  ) : (
                    // Kiểm tra token là "client" thì không hiển thị nút "Edit"
                    localStorage.getItem("token") !== "client" && (
                      <button type="button" class="btn btn-warning" onClick={handleEdit}>Edit</button>
                    )
                  )}
                </>
              )}
              <div className="footer-decoration"></div>
            </div>
          </form>

        </div>)
      }
    </>
  );
};