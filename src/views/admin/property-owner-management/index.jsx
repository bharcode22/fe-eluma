import NavbarAdmin from '../../../components/NavbarAdmin.jsx';
import { useState, useEffect } from 'react';
import OwnerList from './ownerList.jsx'

export default function PropertyOwnerManagement() {
    return (
        <div className='flex'>
            <div>
                <NavbarAdmin />
            </div>
            <div className='w-full'>
                <OwnerList />
            </div>
        </div>
    )
}
