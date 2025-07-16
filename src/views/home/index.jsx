import NavbarLandingPage from "../../components/NavbarLandingPage.jsx";
import GetAllProperty from "./getAllProperty.jsx";
import Banner from "./Banner";

export default function Home() {
    return (
        <div>
            <div className="">
                <NavbarLandingPage />
            </div>
                <Banner />
            <div>

            </div>
            <div className="mt-20">
                <GetAllProperty />
            </div>
        </div>
    )
}
