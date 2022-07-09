import { Banner, SectionPatient, ServicesGrid } from './components';

const HomePage = () => {
    return (
        <>
            <Banner />
            <h2 id="services" className="title-section">Especialidades</h2>
            <div className="mx-auto underline"></div>
            <ServicesGrid />
            <SectionPatient />
        </>
    );
}

export default HomePage;