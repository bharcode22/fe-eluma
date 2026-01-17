import NavbarUsers from "../../components/NavbarUser.jsx";
import GetMyProperty from "./propertyManagement/GetMyProperty.jsx";

export default function Home() {
    return (
        <div>
            <div>
                <NavbarUsers />
            </div>
            <div>
                <GetMyProperty />
            </div>
        </div>
    )
}
