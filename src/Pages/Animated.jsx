

function AnimatedBackground (){
  return (
    <div className="absolute inset-0 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-r from-orange-500 to-orange-300 opacity-90"></div>
      <div className="absolute inset-0 animate-slide">
        <img
          src="/images/HomeCar2.jpg"
          alt="Luxury Car"
          className="w-full h-80% object-cover"
        />
      </div>
      <div className="absolute inset-0 animate-slide-delayed">
        <img
          src='/images/HomeCar1.jpg'
          alt="Modern House"
          className="w-full h-full object-cover"
        />
      </div>
    </div>
  )
}

export default AnimatedBackground

