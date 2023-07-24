import "./Sidebar.css"

function Sidebar({ isOpen }) {
    return (
        <aside className={`sidebar ${isOpen ? 'open' : ''}`}>
        </aside>
    );
}

export default Sidebar;