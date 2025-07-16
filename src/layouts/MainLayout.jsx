import Header from "../components/Header"
import Sidebar from "../components/global/Sidebar"

const MainLayout = ({ children }) => {
    return (
        <div className="flex">
            <div className="w-1/5">
                <Sidebar />
            </div>
            <div className="w-full">
                <Header />
                {children}
            </div>
        </div>
    )
}

export default MainLayout
