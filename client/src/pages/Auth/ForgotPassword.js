import React, { useState } from "react";
import Layout from "../../components/Layout/Layout";
import axios from 'axios';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import '../../styles/AuthStyles.css';

const ForgotPassword = () => {
    const [email, setEmail] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [answer, setAnswer] = useState("");

    const navigate = useNavigate();

    const submitHandler = async (e) => {
        e.preventDefault();
        try {
            const res = await axios.post(`${process.env.REACT_APP_API}/api/v1/auth/forgot-password`, {
                email, newPassword, answer
            });

            if (res.data.success) {
                toast.success(res.data.message);
                navigate('/login');

            } else {
                toast.error(res.data.message);
            }


        } catch (error) {
            console.log(error);
            toast.error("Something went wrong");
        }
    };
    return (
        <Layout title={"Forgot password - E-commerce App"}>
            <div className="form-container">
                <h1>Reset Password</h1>
                <form onSubmit={submitHandler}>
                    <div className="mb-3">
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="form-control"
                            id="exampleInputEmail"
                            placeholder="Enter your email"
                            required
                        />
                    </div>
                    <div className="mb-3">
                        <input
                            type="password"
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)}
                            className="form-control"
                            id="exampleInputNewPassword"
                            placeholder="Enter new password"
                            required
                        />
                    </div>
                    <div className="mb-3">
                        <input
                            type="text"
                            value={answer}
                            onChange={(e) => setAnswer(e.target.value)}
                            className="form-control"
                            id="exampleInputNewAnswer"
                            placeholder="Enter your favorite sport?"
                            required
                        />
                    </div>
                    <button type="submit" className="btn btn-primary">
                        Reset
                    </button>
                </form>
            </div>
        </Layout>
    );
};

export default ForgotPassword;