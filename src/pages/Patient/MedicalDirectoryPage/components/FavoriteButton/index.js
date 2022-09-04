import { FaStar, FaRegStar } from "react-icons/fa";
import { addFavoriteDentist, removeFavoriteDentist } from 'services/FavoriteDentistService';
import { ADD_FAVORITE, REMOVE_FAVORITE } from "constants/InformationMessage";
import { handleErrors } from "utils/handleErrors";
import styles from './FavoriteButton.module.css';

const FavoriteButton = ({dentist, setAlert, setIsLoading}) => {

    const addFavorite = async () => {
        const result = await addFavoriteDentist(dentist.dentistId);
        if(result.success === true) {
            dentist.isFavorite = true;
        }
        
        setIsLoading({success: result.success}); 

        return result;
    }

    const removeFavorite = async () => {
        const result = await removeFavoriteDentist(dentist.dentistId);
        if(result.success === true) {
            dentist.isFavorite = false;
        }
        
        setIsLoading({success: result.success}); 

        return result;
    }

    const eventFavorite = async() => {
        let result = null;
        setIsLoading({success: undefined});

        if(dentist.isFavorite === false) {
            result = await addFavorite();
            result.success === true ? setAlert({success: true, message: ADD_FAVORITE}) : setAlert(result);
        }
        else {
            result = await removeFavorite();
            result.success === true ? setAlert({success: true, message: REMOVE_FAVORITE}) : setAlert(result);
        }

        handleErrors(result, setAlert, setIsLoading);
    }

    return (
        <span onClick={eventFavorite}>
            {dentist.isFavorite === true ? <FaStar className={styles.favorite_button} /> : 
            <FaRegStar className={styles.favorite_button}/>}
        </span>
    );
}


export default FavoriteButton;