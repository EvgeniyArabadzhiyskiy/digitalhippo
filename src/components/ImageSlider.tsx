"use client"

import { useEffect, useState } from "react";
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/keyboard";
import "swiper/css/scrollbar";
import { Swiper, SwiperSlide, useSwiper } from "swiper/react";
import type SwiperType from "swiper";
import { Navigation, Pagination, Keyboard, Scrollbar } from "swiper/modules";
import { cn } from "@/lib/utils";
import { ChevronLeft, ChevronRight } from "lucide-react";
import Image from "next/image";

interface ImageSliderProps {
  urls: string[];
}

const Buttons = () => {
  const swiper = useSwiper();
  const activeStyle =
    "active:scale-[0.97] grid  hover:scale-105 absolute top-1/2 -translate-y-1/2 aspect-square h-8 w-8 z-50 place-items-center rounded-full border-2 bg-white border-zinc-300";
  const inactiveStyle = "hidden text-gray-400";
  return (
    <div className="absolute z-10 inset-0 opacity-0 group-hover:opacity-100 transition">
      <button
        className={activeStyle}
        onClick={() => console.log("ImageSlider  swiper:", swiper.slideNext())}
      >
        &rarr;
      </button>
      {/* <button onClick={() => swiper.slidePrev()}>&larr;</button> */}
    </div>
  );
};

const ImageSlider = ({ urls }: ImageSliderProps) => {
  const [swiper, setSwiper] = useState<null | SwiperType>(null);
  // const [activeIndex, setActiveIndex] = useState<number>(0);

  const [slideConfig, setSlideConfig] = useState({
    isBeginning: true,
    isEnd: swiper?.isEnd,
    // isEnd: activeIndex === (urls.length ?? 0) - 1,
  });

  // useEffect(() => {
  //   swiper?.on("slideChange", ({activeIndex}) => {
  //     setActiveIndex(activeIndex)

  //     setSlideConfig({
  //       isBeginning: activeIndex === 0,
  //       isEnd: activeIndex === (urls.length ?? 0) - 1
  //     })
  //   })
  // },[swiper, urls.length])

  const activeStyle =
    "active:scale-[0.97] grid hover:scale-105 absolute top-1/2 -translate-y-1/2 aspect-square h-8 w-8 z-50 place-items-center rounded-full border-2 bg-white border-zinc-300";
  const inactiveStyle = "hidden text-gray-400";

  return (
    <div className="group relative bg-zinc-500 aspect-square overflow-hidden rounded-xl">
      <div className="absolute z-10 inset-0 opacity-0 group-hover:opacity-100 transition">
        <button
          className={cn(activeStyle, "right-3 transition", {
            [inactiveStyle]: slideConfig.isEnd,
            "hover:bg-blue-300 text-blue-800": !slideConfig.isEnd,
          })}
          onClick={(e) => {
            e.preventDefault();
            swiper?.slideNext(500);
          }}
          aria-label="next-image"
        >
          <ChevronRight className="h-4 w-4 text-zinc-700" />
        </button>

        <button
          className={cn(activeStyle, "left-3 transition", {
            [inactiveStyle]: slideConfig.isBeginning,
            "hover:bg-blue-300 text-blue-800": !slideConfig.isBeginning,
          })}
          onClick={(e) => {
            e.preventDefault();
            swiper?.slidePrev(500);
          }}
          aria-label="previous-image"
        >
          <ChevronLeft className="h-4 w-4 text-zinc-700" />
        </button>
      </div>

      <Swiper
        className="h-full w-full"
        onSwiper={(swiper) => setSwiper(swiper)}
        onSlideChange={({ activeIndex, isBeginning, isEnd }) => {
          // setActiveIndex(activeIndex);

          setSlideConfig({
            isBeginning,
            isEnd,
          });
        }}
        modules={[Pagination, Navigation, Keyboard, Scrollbar]}
        // scrollbar={{
        //   el: '.swiper-scrollbar',
        //   draggable: true
        // }}
        // keyboard={{
        //   enabled:true
        // }}

        pagination={{
          renderBullet: (_, className) => {
            return `<span class="${className}"></span>`
          }
        }}
        slidesPerView={1}
        spaceBetween={50}
      >
        {urls.map((url) => {
          return (
            <SwiperSlide key={url} className="-z-10 h-full w-full">
              <Image
                src={url}
                alt="Product image"
                fill
                loading="eager"
                className="-z-10 h-full w-full object-cover object-center"
              />
            </SwiperSlide>
          );
        })}
      </Swiper>
    </div>
  );
};

export default ImageSlider;
