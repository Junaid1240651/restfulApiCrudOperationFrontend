import React, { useEffect, useState } from "react";
import { MailOutlined, PhoneOutlined, GlobalOutlined } from "@ant-design/icons";
import axios from "axios";
import edit from "../../Icons/edit.png";
import deleteImg from "../../Icons/delete.png";
import LoadingScreen from "../LoadingScreen/LoadingScreen";
import "./Cart.css";

const Cart = () => {
  const [apidata, setApiData] = useState();
  const [isOpen, setIsOpen] = useState(false);
  const [addBtnCheck, setAddBtnCheck] = useState(false);
  const [editId, setEditId] = useState("");
  const [updateUser, setupdateUser] = useState({
    name: "",
    email: "",
    phone: "",
    website: "",
    avatar: "",
  });

  const inputHandler = (e) => {
    const { name, value } = e.target;
    setupdateUser((prevUser) => ({ ...prevUser, [name]: value }));
  };

  const updateUserData = async () => {
    setAddBtnCheck(true);
    const updatedData = {
      name: updateUser.name,
      email: updateUser.email,
      phone: updateUser.phone,
      website: updateUser.website,
      avatar: updateUser.avatar,
    };

    try {
      const response = await axios.put(
        `http://localhost:3000/update/${editId}`,
        updatedData
      );
      const updatedApidata = apidata.map((data) =>
        data._id === editId ? response.data : data
      );
      setApiData(updatedApidata);
      setIsOpen(false);
    } catch (error) {
      console.error("Error updating data:", error);
    }
  };

  const editHandler = (e) => {
    e.preventDefault();
    setIsOpen(!isOpen);
    setEditId(e.target.id);
    const selectedData = apidata.find((data) => data._id === e.target.id);
    setupdateUser({
      name: selectedData.name,
      email: selectedData.email,
      phone: selectedData.phone,
      website: selectedData.website,
      avatar: selectedData.avatar,
    });
  };

  const deleteHandler = async (e) => {
    const itemId = e.target.id;

    try {
      await axios.delete(`http://localhost:3000/delete/${itemId}`);
      const updatedApidata = apidata.filter((data) => data._id !== itemId);
      setApiData(updatedApidata);
    } catch (error) {
      console.error("Error deleting data:", error);
    }
  };

  const addDataHandler = () => {
    setAddBtnCheck(true);

    setIsOpen(!isOpen);
    setupdateUser({
      name: "",
      email: "",
      phone: "",
      website: "",
      avatar: "",
    });
  };
  const canclePopUpBtnHandler = () => {
    setIsOpen(!isOpen);
    setAddBtnCheck(false);
  };
  const addUserData = async (e) => {
    e.preventDefault();

    const newData = {
      name: updateUser.name,
      email: updateUser.email,
      phone: updateUser.phone,
      website: updateUser.website,
      avatar: updateUser.avatar,
    };

    try {
      const response = await axios.post(
        "http://localhost:3000/create",
        newData
      );
      setApiData([...apidata, response.data]);
      setIsOpen(false);
    } catch (error) {
      console.error("Error creating data:", error);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get("http://localhost:3000/");
        setApiData(response.data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  const [searchQuery, setSearchQuery] = useState(""); // State variable to store search query

  // ...
  const searchBackend = async (query) => {
    try {
      const response = await axios.get(`http://localhost:3000/search/${query}`);
      setApiData(response.data);
    } catch (error) {
      console.error("Error searching data:", error);
    }
  };

  // Event handler for input change (typing in the search input field)
  const handleInputChange = (e) => {
    const { value } = e.target;
    setSearchQuery(value); // Update search query state
    searchBackend(value); // Send search query to the backend
  };

  console.log(apidata);

  return (
    <>
      {apidata ? (
        <div className="mainDiv">
          <div className="SearchDiv">
            <button onClick={addDataHandler} className="addBtnData">
              Add Cart Data
            </button>
            <input onChange={handleInputChange} placeholder="Search" />
          </div>

          <div className="container">
            <div className="row">
              {apidata.map((data, index) => (
                <div key={data._id} className="column">
                  <div className="card">
                    <div>
                      <div>
                        <img alt="" src={data.avatar}></img>
                      </div>
                      <div>
                        <p>{data.name}</p>
                        <div className="commonCLass">
                          <MailOutlined />
                          <p>{data.email}</p>
                        </div>
                        <div className="commonCLass">
                          <PhoneOutlined />
                          <p>{data.phone}</p>
                        </div>
                        <div className="commonCLass">
                          <GlobalOutlined />
                          <p>{data.website}</p>
                        </div>
                      </div>
                      <div className="iconDiv">
                        <img
                          alt=""
                          id={data._id}
                          className="editImg"
                          src={edit}
                          onClick={editHandler}
                        />
                        <div className="slashDiv"></div>
                        <img
                          alt=""
                          id={data._id}
                          className="editImg"
                          src={deleteImg}
                          onClick={deleteHandler}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            {isOpen && (
              <div className="popup-overlay">
                <div>
                  <form
                    onSubmit={
                      addBtnCheck === true ? addUserData : updateUserData
                    }
                  >
                    <div className="popup">
                      <div className="popupChildDiv">
                        <p>Basic Modal </p>
                        <button onClick={() => setIsOpen(!isOpen)}>X</button>
                      </div>
                      <hr />
                      <div className="labelDiv">
                        <div className="label">
                          <label>✶Avatar Link:</label>
                          <label>✶Name:</label>
                          <label>✶Email:</label>
                          <label>✶Phone:</label>
                          <label>✶Website:</label>
                        </div>
                        <div className="inputDiv">
                          <input
                            required
                            onChange={inputHandler}
                            name="avatar"
                            value={updateUser.avatar}
                          />

                          <input
                            required
                            onChange={inputHandler}
                            name="name"
                            value={updateUser.name}
                          />
                          <input
                            value={updateUser.email}
                            required
                            onChange={inputHandler}
                            name="email"
                          />
                          <input
                            value={updateUser.phone}
                            required
                            onChange={inputHandler}
                            name="phone"
                          />
                          <input
                            value={updateUser.website}
                            required
                            onChange={inputHandler}
                            name="website"
                          />
                        </div>
                      </div>
                      <hr />
                      <div className="submitDiv">
                        <button onClick={canclePopUpBtnHandler}>Cancel</button>
                        <button type="submit">
                          {addBtnCheck === true ? "Add Data" : "OK"}
                        </button>
                      </div>
                    </div>
                  </form>
                </div>
              </div>
            )}
          </div>
        </div>
      ) : (
        <LoadingScreen />
      )}
    </>
  );
};

export default Cart;
