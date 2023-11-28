import * as React from "react";
import { Routes, Route } from "react-router-dom"
import AuthLayout from "../pages/AuthLayout/AuthLayout";
import ChatLayout from "../pages/ChatLayout/ChatLayout";

const RouterConfig = () => {

    return (
        <>
            <Routes>
                <Route path="/" element={<AuthLayout />} />
                <Route path="chats" element={<ChatLayout/>} />
            </Routes>
        </>
    )
}

export default RouterConfig