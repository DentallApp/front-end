import Alert from 'react-bootstrap/Alert';

const AlertMessage = ({type, message, setError}) => {
    return (
        <Alert key={type} variant={type} onClose={() => setError(false)} dismissible>
            { message }
        </Alert>
    )
}

export default AlertMessage;