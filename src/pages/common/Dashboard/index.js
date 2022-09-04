import { useContext } from 'react';
import { Outlet } from 'react-router-dom';
import { SideBar, NavBarDashboard } from "components";
import SideBarContext from 'context/SideBarContext';
import styles from './Dashboard.module.css';

const Dashboard = () => {

    const { handleSidebar, onlyWidth, display } = useContext(SideBarContext);
    
    return (
        <div style={{"width": "100%", "height": "100%"}}>
                { (display === true || onlyWidth > 768) && <SideBar/> } 
                <NavBarDashboard />
                <div className={styles.contain}
                onClick={() => {
                    if(display === true) handleSidebar()
                }}>
                    <Outlet />
                </div>
        </div>
    );
}

export default Dashboard;