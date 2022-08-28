import { useState, useEffect } from 'react';
import { FaStar, FaRegStar } from "react-icons/fa";
import styles from './FavoriteButton.module.css';

const FavoriteButton = ({dentistSelected}) => {
    const [isFavourited, setIsFavourited] = useState(false);

    const eventFavorite = () => {
        setIsFavourited(!isFavourited);
    }

    return (
        <span onClick={eventFavorite}>
            {isFavourited === true ? <FaStar className={styles.favorite_button} /> : 
            <FaRegStar className={styles.favorite_button}/>}
        </span>
    );
}


export default FavoriteButton;