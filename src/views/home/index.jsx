import NavbarLandingPage from "../../components/NavbarLandingPage.jsx";
import Algoritma from "./homeComponents/Algoritma";
import Banner from "./homeComponents/Banner";
import Dataset from "./homeComponents/Dataset";
import Deployment from "./homeComponents/Deployment";
import FooterLandingPage from "./homeComponents/FooterLandingPage";

export default function Home() {
    return (
        <div>
            <div>
                <NavbarLandingPage />
            </div>
            <div>
                <section id="about">
                    <h1>about</h1>
                </section>
                <section id="dataset">
                    <h1>dataset</h1>
                </section>
                <section id="algoritma">
                    <h1>algoritma</h1>
                </section>
                <section id="deployment">
                    <h1>deployment</h1>
                </section>
                <section>
                    <h1>footer</h1>
                </section>
            </div>
        </div>
    )
}
