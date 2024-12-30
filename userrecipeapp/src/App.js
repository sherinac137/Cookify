import React from "react";
import Navbar from "./components/Navbar";
import Carousel from "./components/Carousel";
import Aboutus from "./components/Aboutus";
import Services from "./components/Services";
import Accordion from "./components/Accordion";
import Footer from "./components/Footer";

import "./App.css";

function App() {
  return (
    <div className='wrapper'>
      <div className='content'>
        <Navbar />
        <Carousel />
        <Aboutus />
        <Services />
        <Accordion />
        <Footer />
      </div>
    </div>
  );
}

export default App;
