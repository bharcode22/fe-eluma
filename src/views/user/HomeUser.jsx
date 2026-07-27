import NavbarUsers from "../../components/NavbarUser.jsx";
import GetMyProperty from "./propertyManagement/GetMyProperty.jsx";
import FooterLandingPage from "../../components/FooterLandingPage.jsx";

export default function Home() {
    return (
        <div>
            <div>
                <NavbarUsers />
            </div>
            <div>
                <GetMyProperty />
            </div>
            <div>
                <FooterLandingPage />
            </div>
        </div>
    )
}
