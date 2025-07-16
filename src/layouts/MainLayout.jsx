
const MainLayout = ({ children }) => {
    return (
        <div className="flex">
            <div>
                aside bar
            </div>
            <div>
                <div>header</div>
                {children}
            </div>
        </div>
    )
}

export default MainLayout
