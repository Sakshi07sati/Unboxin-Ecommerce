
import { BrowserRouter } from "react-router-dom"
import "./index.css";
import { Toaster } from "react-hot-toast";
import ScrollToTop from './components/common/ScrollToTop';
import AllRoutes from '../src/routes/Routes';
// import { useEffect, useState } from "react";

// import { CategoryProvider } from "./context/CategoryContext";
// import 'swiper/css';
// import 'swiper/css/effect-coverflow';
// import 'swiper/css/pagination';



const App = () => {

  return (
    <div>
      {/* <CategoryProvider> */}
        <BrowserRouter>
         {/* {isLoading && <TeezinesLoader />} */}
        <ScrollToTop />

          <AllRoutes />
           <Toaster
        position="bottom-right"   // 👈 this sets the toast position
        reverseOrder={false}
        toastOptions={{
          duration: 5000, // auto close after 3 sec
          style: {
            background: "#fff",
            color: "#000",
            borderRadius: "10px",
            padding: "10px 16px",
            fontSize: "15px",
          },
          success: {
            iconTheme: {
              primary: "#4ade80",
              secondary: "#fff",
            },
          },
          error: {
            iconTheme: {
              primary: "#f87171",
              secondary: "#fff",
            },
          },
        }}
      />
        </BrowserRouter>
      {/* </CategoryProvider> */}
    </div>
  )
}

export default App

