import React from 'react'
import { BsChevronCompactLeft,BsChevronCompactRight } from 'react-icons/bs';
import { RxDotFilled } from 'react-icons/rx';

const slides = [
    { url: 'src/assets/Tipo1.jpg' },
    { url: 'src/assets/Tipo2.jpg' },
    { url: 'src/assets/Tipo3.jpg' },
    { url: 'src/assets/Tipo4.jpg' },
];


const Carousel = () => {
    const [currentIndex, setCurrentIndex] = React.useState(0);
    const prevSlide = () => {
        const isFirstSlide = currentIndex === 0;
        const newIndex = isFirstSlide ? slides.length - 1 : currentIndex - 1;
        setCurrentIndex(newIndex);
    }
    const nextSlide = () => {
        const isLastSlide = currentIndex === slides.length - 1;
        const newIndex = isLastSlide ? 0 : currentIndex + 1;
        setCurrentIndex(newIndex);
    }
    const goToSlide = (index) => {
        setCurrentIndex(index);
    }
  return (
    <div className='max-w-[1100px] h-[350px] w-full m-auto py-[-1] px-4 relative'>
        <div style={{backgroundImage:`url(${slides[currentIndex].url})`}} className='w-full h-full rounded-2xl bg-center bg-cover duration-500'></div>
      {/* left arrow*/}
        <div className='absolute top-[50%] -translate-x-0 left-5 text-2x1 rounded-full p-2 bg-black/20 text-white cursor-pointer'>
            <BsChevronCompactLeft onClick={prevSlide} size={30}/>
        </div>
      {/* left arrow*/}
        <div className='absolute top-[50%] -translate-x-0 right-5 text-2x1 rounded-full p-2 bg-black/20 text-white cursor-pointer'>
            <BsChevronCompactRight onClick={nextSlide} size={30}/>
        </div>
        <div className='flex top-4 justify-center py-2'>
            {slides.map((slide, slideIndex)=>(
                <div key={slideIndex} onClick={()=> goToSlide(slideIndex)} className='text-2xl cursor-pointer'>
                    <RxDotFilled />
                </div>
            ))}
        </div>
    </div>
  )
}

export default Carousel
