import React from "react";
import Slider from "react-slick";

const AvatarSlider = () => {
  const settings = {
    dots: false,
    infinite: false,
    speed: 500,
    slidesToShow: 4,
    slidesToScroll: 4,
    initialSlide: 0,
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 3,
          slidesToScroll: 3,
          infinite: true,
          dots: true,
        },
      },
      {
        breakpoint: 600,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 2,
          initialSlide: 2,
        },
      },
      {
        breakpoint: 480,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
        },
      },
    ],
  };

  return (
    <div>
      <Slider {...settings} className="avatar-slider">
        <img src="/images/cadet-avatar.png" alt="Cadet" />

        <img src="/images/private-avatar.png" alt="Private" />

        <img src="/images/captain-avatar.png" alt="Captain" />

        <img src="/images/marine-avatar.png" alt="Marine" />
      </Slider>
    </div>
  );
};
export default AvatarSlider;