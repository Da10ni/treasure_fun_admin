import Header from "../components/Header"

const MainLayout = ({ children }) => {
    return (
        <div className="flex">
            <div className="w-1/5">
                aside bar
            </div>
            <div className="w-full">
                <Header />
                {children}
            </div>
        </div>
    )
}

export default MainLayout
