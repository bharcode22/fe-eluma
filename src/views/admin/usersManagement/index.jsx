import NavbarAdmin from '../../../components/NavbarAdmin.jsx';
import UserList from './userList.jsx';

export default function UsersManagement() {
    return (
        <div className='flex justify-center'>
            <div>
                <NavbarAdmin />
            </div>
            <div className='w-full'>
                <UserList />
            </div>
        </div>
    )
}
