import { useState } from "react"
import Header from "../components/Header"
import Sidebar from "../components/global/Sidebar"

const MainLayout = ({ children }) => {
    const [activeTab, setActiveTab] = useState("dashbaord")
    return (
        <div className="flex">
            <div className="h-screen">
                <Sidebar setActiveTab={setActiveTab} activeTab={activeTab} />
            </div>
            <div className="w-full">
                <Header />
                {children}
            </div>
        </div>
    )
}

export default MainLayout
