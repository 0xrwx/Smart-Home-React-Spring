import React, { useState } from 'react';

const UserForm = ({setUserId, setIsModalAuthorizationOn, setIsAuthorized}) => {
    const [message, setMessage] = useState("")

    const [user, setUser] = useState({
        name: '',
        password: ''
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setUser({ ...user, [name]: value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (user.name && user.password) {
            fetch(`http://localhost:8080/api/auth`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ name: user.name, password: user.password }),
            })
                .then((response) => response.json())
                .then((data) => {
                    if (data.id === 0) {
                        // console.log("User not founded!");
                        setMessage("User not founded!")
                    } else {
                        setUserId(data.id);
                        setIsModalAuthorizationOn(false);
                        setIsAuthorized(true);
                        // console.log('User founded!');
                        setMessage("")
                    }
                })
                .then(() => {
                    user.name = "";
                    user.password = "";
                    setUser({ name: user.name, password: user.password });})
                .catch((error) => console.log(error));
        } else {
            setMessage("One of the fields is empty")
        }
    };

    return (
        <>
            <form onSubmit={handleSubmit} className={'authForm'}>
                <input
                    type="text"
                    name="name"
                    placeholder="Name"
                    value={user.name}
                    onChange={handleChange}
                    className={'authFormInput'}
                />
                <input
                    type="password"
                    name="password"
                    placeholder="Password"
                    value={user.password}
                    onChange={handleChange}
                    className={'authFormInput'}
                />
                <button className={'authFormButton'} type="submit">Sign In</button>
            </form>
            <p className={'formMessage'}>{message}</p>
        </>
    );
};

export default UserForm;
