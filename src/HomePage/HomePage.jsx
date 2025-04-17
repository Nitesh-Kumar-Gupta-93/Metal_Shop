import React from 'react'
import ImageSlider from '../pages/Image-Slider/image_slider'
import HomeCart from '../pages/cart_section/home_cart'
import Navebar from '../pages/Navebar'
import Footer from '../pages/Footer-Section/footer'
import Navebar2 from '../pages/Navbar2'



function HomePage() {
  return (
    <>
      <Navebar />
      {/* <Navebar2 /> */}
      <ImageSlider />
      <HomeCart/>
    
    </>
  )
}

export default HomePage
