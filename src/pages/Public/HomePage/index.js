import { Banner, SectionPatient, ServicesGrid, Offices } from './components';

const HomePage = () => {
    return (
        <>	
            <Banner />
            <h2 id="services" className="title-section">Servicios Dentales</h2>
            <div className="mx-auto underline"></div>
            <ServicesGrid /><br/><br/>
            <SectionPatient /><br/><br/>
            <Offices /><br/><br/>
        </>
    );
}

export default HomePage;