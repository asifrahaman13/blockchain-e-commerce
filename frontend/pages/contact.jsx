import React from 'react'

const contact = () => {

  return (
    <>
      <center>
        <section className="h-screen">
          <div className="container px-6 py-12 h-full">
            <div className="flex justify-center items-center flex-wrap h-full g-6 text-gray-800">
              <div className="md:w-8/12 lg:w-6/12 mb-12 md:mb-0">
                <img
                  src="https://mdbcdn.b-cdn.net/img/Photos/new-templates/bootstrap-login-form/draw2.svg"
                  className="w-full"
                  alt="Phone image"
                />
              </div>
              <div className="md:w-8/12 lg:w-5/12 lg:ml-20">
                <form>
                  <div className="mb-6">
                    <label htmlFor="name" className="leading-7 text-sm text-white">
                      Enter your name
                    </label>
                    <input
                      type="text"
                      name="Enter your name"
                      className="form-control block w-full px-4 py-2 text-xl font-normal text-gray-700  bg-clip-padding border border-solid border-gray-300 rounded transition ease-in-out m-0 focus:text-gray-700 focus:bg-white focus:border-pink-600 focus:outline-none"
                      placeholder="Enter your name"

                    />
                  </div>

                  <div className="mb-6">
                    <label htmlFor="message" className="leading-7 text-sm text-white">
                      Enter the product Id
                    </label>
                    <input
                      type="password"
                      className="form-control block w-full px-4 py-2 text-xl font-normal  text-gray-700  bg-clip-padding border border-solid border-gray-300 rounded transition ease-in-out m-0  focus:bg-white focus:border-pink-600 focus:outline-none"
                      placeholder="Product Id"
                      name="product_id"

                    />
                  </div>

                  <div className="p-2 w-full">
                    <div className="relative">
                      <label htmlFor="message" className="leading-7 text-sm text-white">
                        Enter your concern
                      </label>
                      <textarea
                        id="concerns"
                        placeholder="Enter your concern"
                        name="concerns"
                        className="w-full  rounded border border-gray-300 focus:border-indigo-500 focus:bg-white focus:ring-2 focus:ring-indigo-200 h-32 text-base outline-none text-gray-700 py-1 px-3 resize-none leading-6 transition-colors duration-200 ease-in-out"

                      ></textarea>
                    </div>
                  </div>

                  <button

                    type="submit"
                    className="inline-block px-7 py-3 bg-pink-600 text-white font-medium text-sm leading-snug uppercase rounded shadow-md hover:bg-pink-700 hover:shadow-lg focus:bg-pink-700 focus:shadow-lg focus:outline-none focus:ring-0 active:bg-pink-800 active:shadow-lg transition duration-150 ease-in-out w-full"
                    data-mdb-ripple="true"
                    data-mdb-ripple-color="light"
                  >
                    SEND CONCERN
                  </button>
                </form>
              </div>
            </div>
          </div>
        </section>
      </center>
    </>
  )
}

export default contact