import { Chatbot } from './components'; 

const AppointmentChatbotPage = () => {
    return (
        <>
		<h1 className={'page_title'}>Agendar cita</h1>
        <div className="underline mx-auto"></div>
        <div>
            <Chatbot />
        </div>
	</>
    );
}

export default AppointmentChatbotPage;