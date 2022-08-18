import React, { useState } from "react";
import { Col, Container, Form, Row, Button } from "react-bootstrap";
import { useSignupUserMutation } from "../services/appApi";
import { Link, useNavigate } from "react-router-dom";
import "./Signup.css";
import botImg from "../assets/bot.jpeg";

function Signup() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [name, setName] = useState("");
    const [signupUser, { isLoading, error }] = useSignupUserMutation();
    const navigate = useNavigate();
    
    //image upload states
    const [image, setImage] = useState(null);
    const [upladingImg, setUploadingImg] = useState(false);
    const [imagePreview, setImagePreview] = useState(null);

    function validateImg(e) {
        const file = e.target.files[0];
        if (file.size >= 1048576) {
            return alert("Max file size is 1mb");
        } else {
            setImage(file);
            setImagePreview(URL.createObjectURL(file));
        }
    }
    
    async function uploadImage() {
      const data = new FormData();
      data.append("file", image);
      data.append("upload_preset", "brtdvrrk");
      try {
          setUploadingImg(true);
          let res = await fetch("https://api.cloudinary.com/v1_1/dvkb1jqcv/image/upload", {
              method: "post",
              body: data,
          });
          const urlData = await res.json();
          setUploadingImg(false);
          return urlData.url;
      } catch (error) {
          setUploadingImg(false);
          console.log(error);
      }
  }
    

    async function handleSignup(e) {
        e.preventDefault();
        if (!image) return alert("Lütfen profil resminizi yükleyin");
        const url = await uploadImage(image);
        console.log(url);
        // signup the user
        signupUser({ name, email, password, picture: url }).then(({ data }) => {
            if (data) {
                console.log(data);
                navigate("/chat");
            }
        });
    }

    return (
        <Container>
            <Row>
                <Col md={7} className="d-flex align-items-center justify-content-center flex-direction-column">
                    <Form style={{ width: "80%", maxWidth: 500 }} onSubmit={handleSignup}>
                        <h1 className="text-center">Hesap Oluştur</h1>
                        <div className="signup-profile-pic__container">
                            <img src={imagePreview || botImg} className="signup-profile-pic" />
                            <label htmlFor="image-upload" className="image-upload-label">
                                <i className="fas fa-plus-circle add-picture-icon"></i>
                            </label>
                            <input type="file" id="image-upload" hidden accept="image/png, image/jpeg" onChange={validateImg} />
                        </div>
                        {error && <p className="alert alert-danger">{error.data}</p>}
                        <Form.Group className="mb-3" controlId="formBasicName">
                            <Form.Label>Ad</Form.Label>
                            <Form.Control type="text" placeholder="Adınız" onChange={(e) => setName(e.target.value)} value={name} />
                        </Form.Group>
                        <Form.Group className="mb-3" controlId="formBasicEmail">
                            <Form.Label>Email addres</Form.Label>
                            <Form.Control type="email" placeholder="E-posta girin" onChange={(e) => setEmail(e.target.value)} value={email} />
                            <Form.Text className="text-muted">E-postanız doğru formatta giriniz.</Form.Text>
                        </Form.Group>

                        <Form.Group className="mb-3" controlId="formBasicPassword">
                            <Form.Label>Şifre</Form.Label>
                            <Form.Control type="password" placeholder="Sifre" onChange={(e) => setPassword(e.target.value)} value={password} />
                        </Form.Group>
                        <Button variant="primary" type="submit">
                            {upladingImg || isLoading ? "Signing you up..." : "Üye Ol"}
                        </Button>
                        <div className="py-4">
                            <p className="text-center">
                                Hesabınız yok mu? <Link to="/login">Giriş</Link>
                            </p>
                        </div>
                    </Form>
                </Col>
                <Col md={5} className="signup__bg"></Col>
            </Row>
        </Container>
    );
}

export default Signup;