
import { Route, Routes } from "react-router-dom";

import NotFound from "../pages/NotFound";
import Layout from "@/components/layout/Layout";
import  Home  from "@/pages/Home";
import Host from "@/pages/Host";
import Lobby from "@/pages/Lobby";
import Game from "@/pages/Game";


const AppRoutes = () => {
  return (
    <Routes>
      <Route element={<Layout />}>
      <Route path="/" element={<Home />} />
      <Route path="/host/:quizId" element={<Host />} />
            <Route path="/lobby/:pin" element={<Lobby />} />
            <Route path="/game/:pin" element={<Game />} />
      
                </Route>
      
      {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

export default AppRoutes;
