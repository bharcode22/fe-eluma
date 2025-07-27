import NavbarUsers from "../../../../components/NavbarUser.jsx";
import GetAllPropertyUser from "./GetAllPropertyByUsers.jsx";

export default function Home() {
    return (
        <div>
            <div>
                <NavbarUsers />
            </div>
            <div className="mt-12">
                <GetAllPropertyUser />
            </div>
        </div>
    )
}
