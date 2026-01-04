import NavbarAdmin from '../../../components/NavbarAdmin.jsx';
import { useState, useEffect } from 'react';
import ContactList from './contactList.jsx'

export default function contactManagement() {
    return (
        <div className='flex'>
            <div>
                <NavbarAdmin />
            </div>
            <div className='w-full'>
                <ContactList />
            </div>
        </div>
    )
}
