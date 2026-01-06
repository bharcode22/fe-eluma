import NavbarAdmin from '../../../components/NavbarAdmin.jsx';
import ServicePage from './servicePage.jsx';

export default function ServiceManagement() {
    return (
        <div className='flex justify-center'>

            <NavbarAdmin />

            <div className='w-350'>
                <ServicePage />
            </div>
        </div>
    )
}
