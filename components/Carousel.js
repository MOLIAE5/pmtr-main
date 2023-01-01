import React, { Component } from "react";
import Slider from "react-slick";

export default class Autoplay extends Component {
  render() {
    const settings = {
      dots: true,
      infinite: true,
      slidesToShow: 4,
      slidesToScroll: 1,
      autoplay: true,
      speed: 2000,
      autoplaySpeed: 2000,
      cssEase: "linear"
    };
    return (
      <div>
        <h2>Auto Play</h2>
        <Slider {...settings}>
          <div className="mx-2">
            <img src='1.png' className="w-[100px] h-[100px]"/>
          </div>
          <div className="mx-2">
            <img src='2.png' className="w-[100px] h-[100px]"/>
          </div>
          <div className="mx-2">
            <img src='3.png' className="w-[100px] h-[100px]"/>
          </div>
          <div className="mx-2">
            <img src='4.png' className="w-[100px] h-[100px]"/>
          </div>
          <div className="mx-2">
            <img src='5.png' className="w-[100px] h-[100px]"/>
          </div>
         
        </Slider>
      </div>
    );
  }
}
