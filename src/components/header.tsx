import Image from "next/image";

import Cart from "~/../public/Cart.png";
import Search from "~/../public/Search.png";

function Header() {
    return <header className="w-full h-[136px] bg-[#FFFFFF]">
        <section className="w-full h-[36px] pt-3 px-[0.5%] sm:px-[2%]">
            <ul className="flex flex-row-reverse items-center text-xs gap-x-5">
                <li>Hi, John</li>
                <li>Orders & Returns</li>
                <li>Help</li>
            </ul>
        </section>
        <section className="w-full h-[64px] pb-3 flex justify-between items-center px-[0.5%] sm:px-[2%]">
            <div className="text-xs sm:text-lg lg:text-3xl font-bold">ECOMMERCE</div>
            <nav className="font-semibold list-none flex gap-x-1 text-[10px] sm:text-sm lg:gap-x-16 lg:text-base">
                <li>Categories</li>
                <li>Sale</li>
                <li>Clearance</li>
                <li>New stock</li>
                <li>Trending</li>
            </nav>
            <section className="flex">
                <Image src={Search} alt="search" className="w-[22px] h-[22px] sm:w-[32px] sm:h-[32px]" />
                <Image src={Cart} alt="cart" className="w-[22px] h-[22px] sm:w-[32px] sm:h-[32px]" />
            </section>
        </section>
        <section className="w-full h-[36px] bg-[#F4F4F4] flex items-center justify-center font-medium text-sm">
            <span>&lt;</span>
            <span className="mx-4">Get 10% off on business sign up</span>
            <span>&gt;</span>
        </section>
    </header>
}

export default Header;