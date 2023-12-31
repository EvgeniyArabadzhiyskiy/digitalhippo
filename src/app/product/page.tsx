"use client";

import "swiper/css";
import "swiper/css/pagination";
import 'swiper/css/navigation';
import 'swiper/css/keyboard';
import 'swiper/css/scrollbar';
import { Swiper, SwiperSlide, useSwiper } from "swiper/react";
import type SwiperType from "swiper";
import { Navigation, Pagination, Keyboard, Scrollbar } from "swiper/modules";
import { useState } from "react";
import { cn } from "@/lib/utils";

const Buttons = () => {
  const swiper = useSwiper();
  const [hasNextPage, setHasNextPage] = useState(true);
  const [hasPrevPage, setHasPrevPage] = useState(false);

  const [slideConfig, setSlideConfig] = useState({
    isBeginning: true,
    isEnd: false,
  });
  // console.log("Buttons  slideConfig:", slideConfig);

  const activeStyle =
    "active:scale-[0.97] grid opacity-100 hover:scale-105 absolute top-1/2 -translate-y-1/2 aspect-square h-8 w-8 z-50 place-items-center rounded-full border-2 bg-white border-zinc-300";
  const inactiveStyle = "hidden text-gray-400";
  return (
    <div className="flex justify-between items-center">
      <div>
        <button
          className={cn({
            hidden: slideConfig.isBeginning,
          })}
          onClick={() => {
            swiper.slidePrev();

            setSlideConfig({
              isBeginning: swiper.isBeginning,
              isEnd: swiper.isEnd,
            });
          }}
        >
          PREV
        </button>
      </div>
      <div>
        <button
          className={cn({
            hidden: slideConfig.isEnd,
          })}
          onClick={() => {
            swiper.slideNext();
            setSlideConfig({
              isBeginning: swiper.isBeginning,
              isEnd: swiper.isEnd,
            });
          }}
        >
          NEXT
        </button>
      </div>
    </div>
  );
};

const array = [1, 2, 3, 4, 5];

interface SlideConfig {
  isBeginning: boolean | undefined;
  isEnd: boolean | undefined;
}

const Page = () => {
  const [swiper, setSwiper] = useState<null | SwiperType>(null);

  const [slideConfig, setSlideConfig] = useState<SlideConfig>({
    isBeginning: true,
    isEnd: false,
  });

  return (
    <div className="w-[400px]  mx-auto px-10 bg-slate-500">
      {/* <h1>Products Slider</h1> */}

      <Swiper
        slidesPerView={1}
        spaceBetween={10}
        modules={[Pagination, Navigation, Scrollbar, Keyboard]}
        scrollbar
        keyboard
        // navigation

        pagination={{
          renderBullet: (_, className) => {
            return `<span class="${className}"></span>`
          }
        }}

        onSwiper={(swiper) => setSwiper(swiper)}
        onSlideChange={({isBeginning, isEnd}) => {
          setSlideConfig({
            isBeginning,
            isEnd,
          });
        }}
      >
        {array.map((item) => {
          return (
            <SwiperSlide key={item}>
              <div className="flex justify-center items-center h-[200px] bg-red-300">Slide {item}</div>
            </SwiperSlide>
          );
        })}

        
      </Swiper>
      <div className="flex justify-between items-center h-12">
          <div>
            <button
              className={cn({ 'hidden': slideConfig.isBeginning })}
              onClick={() => swiper?.slidePrev()}
            >
              PREV
            </button>
          </div>
          <div>
            <button
              className={cn({ 'hidden': slideConfig.isEnd })}
              onClick={() => swiper?.slideNext()}
            >
              NEXT
            </button>
          </div>
        </div>
    </div>
  );
};

export default Page;
