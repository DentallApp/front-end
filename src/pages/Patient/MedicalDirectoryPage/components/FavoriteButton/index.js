import { useState, useEffect } from 'react';
import { FaStar, FaRegStar } from "react-icons/fa";
import styles from './FavoriteButton.module.css';

const FavoriteButton = ({dentistSelected, setAlert}) => {
    const [isFavourited, setIsFavourited] = useState(false);

    const eventFavorite = () => {
        setIsFavourited(!isFavourited);

        if(isFavourited === true)
            setAlert({success: true, message: 'Se ha quitado de favoritos'});
        else
            setAlert({success: true, message: 'Se ha agregado a favoritos'});    
    }

    return (
        <span onClick={eventFavorite}>
            {isFavourited === true ? <FaStar className={styles.favorite_button} /> : 
            <FaRegStar className={styles.favorite_button}/>}
        </span>
    );
}


export default FavoriteButton;