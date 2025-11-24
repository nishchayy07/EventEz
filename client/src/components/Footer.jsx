import React from 'react'
import { assets } from '../assets/assets'

const Footer = () => {
  const smoothScrollToTop = (e) => {
    e.preventDefault();
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  return (
    <footer className="px-6 md:px-16 lg:px-36 mt-40 w-full text-gray-300">
            <div className="flex flex-col md:flex-row justify-between w-full gap-10 border-b border-gray-500 pb-14">
                <div className="md:max-w-96">
                    <img className="w-36 h-auto" src={assets.logo} alt="logo" />
                    <p className="mt-6 text-sm">
                        Your gateway to the events you love. Skip the hassle and secure your spot at the hottest concerts, meetups, and shows with just a few clicks. Experience the ease of booking.
                    </p>
                </div>
                <div className="flex-1 flex items-start md:justify-end gap-20 md:gap-40">
                    <div>
                        <ul className="text-sm space-y-2">
                            <li><a href="#" onClick={smoothScrollToTop} className="hover:text-primary transition cursor-pointer">Back to Top</a></li>
                        </ul>
                    </div>
                </div>
            </div>
            <p className="pt-4 text-center text-sm pb-5">
                Copyright {new Date().getFullYear()} © EventEz. All Right Reserved.
            </p>
        </footer>
  )
}

export default Footer
