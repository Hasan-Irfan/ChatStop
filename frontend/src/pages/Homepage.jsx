import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/effect-fade";
import { EffectFade, Autoplay } from "swiper/modules";
import { ToastContainer } from "react-toastify";
import freinds from "../images/friends.jpg";

export const Homepage = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <main className="flex-grow">
        {/* Hero Section with Background Slider */}
        <section className="relative h-[70vh] flex items-center justify-center text-white overflow-hidden">
          {/* Background Slider */}
          <div className="absolute inset-0 z-0">
            <Swiper
              modules={[EffectFade, Autoplay]}
              effect="fade"
              autoplay={{ delay: 3000, disableOnInteraction: false }}
              loop={true}
              className="w-full h-full"
            >
              <SwiperSlide>
                <img
                  src="https://images.unsplash.com/photo-1529156069898-49953e39b3ac?ixlib=rb-1.2.1&auto=format&fit=crop&w=1950&q=80"
                  alt="Slide 1"
                  className="w-full h-full object-cover"
                />
              </SwiperSlide>
              <SwiperSlide>
                <img
                  src="https://images.unsplash.com/photo-1495837174058-628aafc7d610?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
                  alt="Slide 2"
                  className="w-full h-full object-cover"
                />
              </SwiperSlide>
              <SwiperSlide>
                <img
                  src="https://images.unsplash.com/photo-1529333166437-7750a6dd5a70?q=80&w=2069&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
                  alt="Slide 3"
                  className="w-full h-full object-cover"
                />
              </SwiperSlide>
            </Swiper>
            {/* Overlay to darken the background */}
            <div className="absolute inset-0 bg-black bg-opacity-50"></div>
          </div>

          {/* Hero Content */}
          <div className="container mx-auto text-center px-4 relative z-10">
            <h1 className=" text-4xl md:text-6xl font-bold mb-6 animate-fade-in">
              Welcome to CHAT STOP!
            </h1>
            <p className="text-lg md:text-xl mb-8 animate-fade-in delay-100">
              Connecting you with friends and making communication simple.
            </p>
            <button className="bg-orange-500 hover:bg-orange-600 text-white font-semibold py-3 px-8 rounded-lg shadow-lg transition-all transform hover:scale-105 animate-fade-in delay-200">
              Get Started
            </button>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-20 bg-gray-50">
          <div className="container mx-auto text-center px-4">
            <h2 className="text-4xl font-bold mb-12 text-gray-800 animate-fade-in">
              Features
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {/* Feature 1 */}
              <div className="bg-white shadow-lg p-8 rounded-lg transform transition-all hover:scale-105 hover:shadow-xl animate-fade-in delay-100">
                <h3 className="text-2xl font-semibold mb-4 text-gray-800">
                  Easy Chatting
                </h3>
                <p className="text-gray-600">
                  Start conversations with your friends easily and stay
                  connected anytime, anywhere.
                </p>
              </div>
              {/* Feature 2 */}
              <div className="bg-white shadow-lg p-8 rounded-lg transform transition-all hover:scale-105 hover:shadow-xl animate-fade-in delay-200">
                <h3 className="text-2xl font-semibold mb-4 text-gray-800">
                  Customizable Profiles
                </h3>
                <p className="text-gray-600">
                  Personalize your profile to express yourself and stand out
                  among friends.
                </p>
              </div>
              {/* Feature 3 */}
              <div className="bg-white shadow-lg p-8 rounded-lg transform transition-all hover:scale-105 hover:shadow-xl animate-fade-in delay-300">
                <h3 className="text-2xl font-semibold mb-4 text-gray-800">
                  Secure Messaging
                </h3>
                <p className="text-gray-600">
                  Enjoy end-to-end encrypted messages to ensure your privacy and
                  safety.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Image + Text Section */}
        <section className="bg-white py-20">
          <div className="container mx-auto flex flex-col md:flex-row items-center px-4 gap-12">
            {/* Left Section: Image */}
            <div className="w-full md:w-1/2">
              <img
                src={freinds}
                alt="Friends"
                className="w-full rounded-lg shadow-2xl transform transition-all hover:scale-105"
              />
            </div>

            {/* Right Section: Features */}
            <div className="w-full md:w-1/2 text-left">
              <div className="flex flex-col gap-8">
                <div className="animate-fade-in">
                  <h2 className="text-3xl font-bold mb-4 text-gray-800">
                    Add Friends
                  </h2>
                  <p className="text-gray-600">
                    Discover and connect with friends in just a few clicks—search by username and build your circle effortlessly.
                  </p>
                </div>
                <div className="animate-fade-in delay-100">
                  <h2 className="text-3xl font-bold mb-4 text-gray-800">
                    Real-time Messaging
                  </h2>
                  <p className="text-gray-600">
                    Experience lightning-fast communication with seamless, real-time chats that keep you connected always.
                  </p>
                </div>
                <div className="animate-fade-in delay-200">
                  <h2 className="text-3xl font-bold mb-4 text-gray-800">
                    Pending Friend Requests
                  </h2>
                  <p className="text-gray-600">
                    Stay in control—view, accept, or manage friend requests with just a tap.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Toast Container */}
      <ToastContainer />
    </div>
  );
};