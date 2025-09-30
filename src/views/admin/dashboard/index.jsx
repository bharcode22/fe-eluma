import NavbarAdmin from '../../../components/NavbarAdmin.jsx';
import DashboardPage from './dashboardPage.jsx';

export default function Dashboard() {
    return (
        <div className="flex flex-col h-screen">
            <NavbarAdmin />
            <DashboardPage />
        </div>
    );
}
