
import { Route, Routes } from "react-router-dom";

import NotFound from "../pages/NotFound";
import Layout from "@/components/layout/Layout";
import  Home  from "@/pages/Home";

import Game from "@/pages/GamePlay";


const AppRoutes = () => {
  return (
    <Routes>
      {/* <Route element={<Layout />}> */}
      <Route path="/" element={<Home />} />
            <Route path="/play/:pin" element={<Game />} />
      
                {/* </Route> */}
      
      {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

export default AppRoutes;
