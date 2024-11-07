import { Outlet, useLocation } from "react-router-dom"
import { Navbar } from "../components/shared/Navbar"
import Footer from "../components/shared/Footer"
import Banner from "../components/Banner"
import Sidebar from "../components/shared/Sidebar"

export const RootLayout = () => {
    const {pathname}= useLocation();
    const isAroundUserProfile = pathname.includes('/userprofile');
    const showBanner = pathname === '/';
    const isExactlyUserProfile = pathname.endsWith('/userprofile');

    return <div className='h-screen flex flex-col font-montserrat'>
        <Navbar/>

        {showBanner && (<Banner />)}
        <div className="flex flex-1">
            {isAroundUserProfile && <Sidebar />}
            <main className={`container my-8 flex-1 ${isExactlyUserProfile ? 'hidden' : ''}`}>
                {!isExactlyUserProfile && <Outlet />}
            </main>
        </div>



        <Footer/>
    </div>
}