import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination } from "swiper";
import "swiper/css";
import "swiper/css/pagination";
import { SliderContainer } from "./style.js";

const Slider = (props) => {
  const { bannerList } = props;
  return (
    <SliderContainer>
      <div className="before"></div>
      <div className="slider-container">
        <Swiper pagination={true} modules={[Pagination]} loop={true}>
          {bannerList.map((slider, index) => (
            <SwiperSlide key={index} className="swiper-slide">
              <div className="slider-nav">
                <img src={slider.imageUrl} width="100%" height="100%" />
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </SliderContainer>
  );
};

export default Slider;
