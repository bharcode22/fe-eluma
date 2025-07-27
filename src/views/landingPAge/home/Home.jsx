import NavbarLandingPage from "../../../components/NavbarLandingPage.jsx";
import GetAllProperty from "./GetAllProperty.jsx";
import Banner from "./Banner";

export default function Home() {
    return (
        <div>
            <NavbarLandingPage />
            <Banner />
            <GetAllProperty />
        </div>
    )
}
