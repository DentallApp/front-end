import { FaStar, FaRegStar } from "react-icons/fa";
import { addFavoriteDentist, removeFavoriteDentist } from '../../../../../services/FavoriteDentistService';
import styles from './FavoriteButton.module.css';

const FavoriteButton = ({dentist, setAlert, isChange, setIsChange, setIsLoading}) => {

    const handleErrors = (result) => {
        if(result.success === undefined && (result.status === 0 || result.status === 400 || 
            result.status === 404 || result.status === 405 ||
            result.status === 500)) {
            setAlert({success: false, message: 'Error inesperado. Refresque la página o intente más tarde'});
            setIsLoading({success: false});
        }
    }

    const addFavorite = async () => {
        const result = await addFavoriteDentist(dentist.dentistId);
        if(result.success === true) setIsChange(!isChange);
        
        setIsLoading({success: result.success}); 

        return result;
    }

    const removeFavorite = async () => {
        const result = await removeFavoriteDentist(dentist.dentistId);
        if(result.success === true) setIsChange(!isChange);
        
        setIsLoading({success: result.success}); 

        return result;
    }

    const eventFavorite = async() => {
        let result = null;
        setIsLoading({success: undefined});

        if(dentist.isFavorite === false) {
            result = await addFavorite();
            result.success === true ? setAlert({success: true, message: 'Se ha agregado a favoritos'}) : setAlert(result);
        }
        else {
            result = await removeFavorite();
            setAlert({success: true, message: 'Se ha quitado de favoritos'});
        }

        handleErrors(result);
    }

    return (
        <span onClick={eventFavorite}>
            {dentist.isFavorite === true ? <FaStar className={styles.favorite_button} /> : 
            <FaRegStar className={styles.favorite_button}/>}
        </span>
    );
}


export default FavoriteButton;