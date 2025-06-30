
import { Route, Routes, Navigate } from "react-router-dom";

import NotFound from "../pages/NotFound";
import Layout from "@/components/layout/Layout";
import  {Home}  from "@/pages/Home";
import {Login} from "@/pages/Login";
import {Register} from "@/pages/Register";
import {Profile} from "@/pages/Profile";
import {GamePlay} from "@/pages/GamePlay";
import AuthSuccess from "@/pages/AuthSuccess";


const AppRoutes = () => {
  return (
     <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/game/:quizId" element={<GamePlay />} />
            <Route path="/play/:pinId" element={<GamePlay />} />
             <Route path="/auth-success" element={<AuthSuccess />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
  );
};

export default AppRoutes;
