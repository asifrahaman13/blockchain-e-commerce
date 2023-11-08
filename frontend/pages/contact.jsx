import React, { useState } from "react";
import axios from "axios";

const contact = () => {
  const [contactDetails, setContactDetails] = useState({
    name: "",
    email: "",
    product_id: "",
    concern: "",
  });

  function handleChange(e) {
    setContactDetails((prevContactDetails) => ({
      ...prevContactDetails,
      [e.target.name]: e.target.value
    }));
  }
  

  async function handleContact(e) {
    e.preventDefault();
    try {
      const response = await axios.post("http://localhost:8000/contact",contactDetails);
    } catch (err) {
      console.log(err);
    }
  }

  return (
    <>
      <center>
        <div className="bg-gray-900 min-h-screen flex items-center justify-center">
          <div className="bg-gray-800 text-white rounded-lg shadow-lg p-8 w-full sm:w-4/5 md:w-3/4 lg:w-2/4">
            <h1 className="text-3xl font-semibold text-center mb-4">
              Contact Us
            </h1>
            <form>
              <div className="mb-4">
                <label htmlFor="name" className="text-sm">
                  Your Name
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  className="form-input-dark w-full mt-2 bg-gray-600 h-11 rounded"
                  placeholder="Enter your name"
                  required
                  onChange={(e)=>{handleChange(e)}}
                />
              </div>
              <div className="mb-4">
                <label htmlFor="name" className="text-sm">
                  Your email address
                </label>
                <input
                  type="text"
                  id="email"
                  name="email"
                  className="form-input-dark w-full mt-2 bg-gray-600 h-11 rounded"
                  placeholder="Enter your email address"
                  required
                  onChange={(e)=>{handleChange(e)}}
                />
              </div>
              <div className="mb-4">
                <label htmlFor="productId" className="text-sm">
                  Product ID
                </label>
                <input
                  type="text"
                  id="productId"
                  name="product_id"
                  className="form-input-dark w-full mt-2 bg-gray-600 h-11 rounded"
                  placeholder="Enter the product ID"
                  required
                  onChange={(e)=>{handleChange(e)}}
                />
              </div>
              <div className="mb-6">
                <label htmlFor="concerns" className="text-sm ">
                  Your Concern
                </label>
                <textarea
                  id="concerns"
                  name="concern"
                  className="form-textarea-dark w-full mt-2 bg-gray-600 rounded"
                  rows="4"
                  placeholder="Enter your concern"
                  required
                  onChange={(e)=>{handleChange(e)}}
                ></textarea>
              </div>
              <button
                type="submit"
                className="w-full bg-gray-900 text-white font-medium text-sm py-3 rounded hover:bg-purple-500 focus:outline-none"
                onClick={(e) => {
                  handleContact(e);
                }}
              >
                Send Concern
              </button>
            </form>
          </div>
        </div>
      </center>
    </>
  );
};

export default contact;
