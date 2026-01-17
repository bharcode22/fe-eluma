import React from 'react'
import NavbarUser from "../../../components/NavbarUser.jsx";
import Service from './service';

function servicePageUser() {
    return (
        <div>
            <div>
                <NavbarUser />
            </div>
            <div>
                <Service />
            </div>
        </div>
    )
}

export default servicePageUser
