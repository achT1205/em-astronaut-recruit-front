import React from "react";
import "./index.css";
import Slider from "react-slick";

class LevelSlider extends React.Component {
    render() {
        var settings = {
            dots: false,
            arrows: false,
            infinite: false,
            speed: 500,
            slidesToShow: 3,
            slidesToScroll: 4,
            initialSlide: 0,
            responsive: [{
                    breakpoint: 1024,
                    settings: {
                        slidesToShow: 3,
                        slidesToScroll: 3,
                    }
                },
                {
                    breakpoint: 600,
                    settings: {
                        slidesToShow: 2,
                        slidesToScroll: 2,
                        initialSlide: 2
                    }
                },
                {
                    breakpoint: 480,
                    settings: {
                        slidesToShow: 1,
                        slidesToScroll: 1
                    }
                }
            ]
        };


        return ( 
            <div>
                <Slider {...settings } className = "level-slider">
                    <img src = "/images/avatar-img1.png" alt = "" />
                    <img src = "/images/avatar-img2.png" alt = "" />
                    <img src = "/images/avatar-img3.png" alt = "" />
                    <img src = "/images/avatar-img4.png" alt = "" />
                </Slider>
            </div>
        )
    }
}
export default LevelSlider