import React from 'react'
import { Link, Navigate } from 'react-router-dom'
import Navbar from './Navbar'
export default function Home() {
    return (
        <>
            <Navbar></Navbar>

            <div className='text-danger fs-4' >
                <div className='container rounded border bg-light text-white' style={{ "--bs-bg-opacity": ".1" }}>
                    <span>It is a web app designed to provide authentication functionalities, allowing users to log in and sign up securely. The app employs MongoDB as its database system to store and manage user data effectively. Additionally, it utilizes face-api.js, a JavaScript library that leverages facial recognition technology.

                        By integrating face-api.js, the web app gains the ability to estimate the age of users based on their facial characteristics. This feature enables the app to determine whether a user is a child or an adult. It is particularly useful in implementing a child mode or normal mode within the web app, offering tailored experiences based on the user's age.

                        Overall, the web app combines authentication features with age estimation using face-api.js, enhancing the user experience by delivering personalized content and functionality based on the user's age.</span>
                </div>

                <div className='d-flex ' style={{ position: "absolute", top: "50%", left: "40%" }}>
                    <Link to="/login" className="m-2 btn btn-dark  "> Log In</Link>
                    <Link to="/createuser" className="m-2 btn btn-success"> I'm a new User </Link>
                </div>



            </div>


        </>
    )
}
