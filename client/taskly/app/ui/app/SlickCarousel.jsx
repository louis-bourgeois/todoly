import Slider from "react-slick";
import "slick-carousel/slick/slick-theme.css";
import "slick-carousel/slick/slick.css";

export default function SlickCarousel({ children, settings }) {
  return (
    <div className={`overflow-hidden  h-full `}>
      <Slider {...settings}>{children}</Slider>
    </div>
  );
}
