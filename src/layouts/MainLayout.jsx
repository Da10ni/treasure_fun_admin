import { useState } from "react"
import Header from "../components/global/Header"
import Sidebar from "../components/global/Sidebar"

const MainLayout = ({ children }) => {
    const [activeTab, setActiveTab] = useState("dashboard")
    return (
        <div className="flex min-h-screen">
            <div className="h-screen relative">
                <Sidebar setActiveTab={setActiveTab} activeTab={activeTab} />
            </div>
            <div className="w-full h-screen overflow-y-scroll relative">
                <Header activeTab={activeTab} />
                {children}
            </div>
        </div>
    )
}

export default MainLayout
