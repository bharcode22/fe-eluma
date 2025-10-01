import NavbarAdmin from '../../../components/NavbarAdmin.jsx';
import DashboardPage from './dashboardPage.jsx';

export default function Dashboard() {
    return (
        <div className="flex">
            <div>
                <NavbarAdmin />
            </div>
            <div className='w-full'>
                <DashboardPage />
            </div>
        </div>
    );
}
