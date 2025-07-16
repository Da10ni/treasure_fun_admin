import Sidebar from "../components/global/Sidebar"

const MainLayout = ({ children }) => {
    return (
        <div className="flex">
            <div>
                <Sidebar/>
            </div>
            <div>
                <div>headerdffdf</div>
                {children}
            </div>
        </div>
    )
}

export default MainLayout
