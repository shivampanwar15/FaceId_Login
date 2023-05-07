import React, { useState, useCallback, useRef, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import Webcam from 'react-webcam'

import * as faceapi from 'face-api.js'
import Navbar from './Navbar'

const videoConstraints = {
  width: 400,
  height: 400,
  facingMode: 'user',
}

export default function Login(props) {
  const [credentials, setCredentials] = useState({ email: "", password: "" });
  const navigate = useNavigate();

  const onChange = (event) => {
    setCredentials({ ...credentials, [event.target.name]: event.target.value });
  }

  const [picture, setPicture] = useState('')
  const webcamRef = useRef(null)
  const [age, setAge] = useState('Loading..')

  // LOAD MODELS FROM FACE API
  const loadModels = () => {
    Promise.all([
      faceapi.nets.tinyFaceDetector.loadFromUri("/models"),
      faceapi.nets.ageGenderNet.loadFromUri('/models')

    ]).then(() => {
      console.log("models Loaded succesfully");
    })
  }



  const handleSubmit = async (e) => {
    e.preventDefault();

    const pictureSrc = await webcamRef.current.getScreenshot()
    setPicture(pictureSrc)

    const image = await faceapi.fetchImage(pictureSrc)
    let detections
    try {
      detections = await faceapi.detectSingleFace(image,
        new faceapi.TinyFaceDetectorOptions()).withAgeAndGender();
      setAge(Math.round(detections.age))

    } catch (error) {
      alert("Please Try Again")
      window.location.reload();

    }

    const response = await fetch("http://localhost:3000/api/loginuser/", {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ email: credentials.email, password: credentials.password, age: Math.round(detections.age) })
    });

    const json = await response.json();
    console.log(json);

    if (!json.success) {
      alert("Email or Password is incorrect");
      window.location.reload();

    }
    else if (json.childMode) {
      alert("You are under 18. You can only access child mode of the app.")
    }
    else {
      alert("Successfully loged in")
    }
  }
  useEffect(() => {
    loadModels();
  }, [])


  return (
    <>
      <Navbar></Navbar>
      <div className='container text-white' style={{ position: 'absolute', top: '20%', left: '25%', height: '40%', width: '50%' }}>
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label htmlFor="exampleInputEmail1" className="form-label">Email address</label>
            <input type="email" className="form-control" id="exampleInputEmail1" aria-describedby="emailHelp" name="email" value={credentials.email} onChange={onChange} />
            <div id="emailHelp" className="form-text">We'll never share your email with anyone else.</div>
          </div>

          <div className="mb-3">
            <label htmlFor="exampleInputPassword1" className="form-label">Password</label>
            <input type="password" className="form-control" id="exampleInputPassword1" name="password" value={credentials.password} onChange={onChange} />
          </div>
          <button type="submit" className="btn btn-primary">Submit</button>
          <Link to="/createuser" className="m-2 btn btn-danger "> I'm a new User</Link>
        </form>


        <div>
          <h2 className="mb-5 text-center">
            Your age is : {age}
          </h2>
          <div className=''>
            {picture === '' ? (
              <Webcam className='rounded-circle'
                audio={false}
                height={200}
                ref={webcamRef}
                width={200}
                screenshotFormat="image/jpeg"
                videoConstraints={videoConstraints}
              />
            ) : (
              <img src={picture} className='rounded-circle' />
            )}
          </div>

        </div>
      </div>
    </>
  )
}

