import { useState, useEffect } from 'react';
import { DentistTable, FavoriteButton, FilterOffice } from './components';
import data from './data';
import styles from './MedicalDirectoryPage.module.css';

const MedicalDirectoryPage = () => {

    const [selectOffice, setSelectOffice] = useState(null);
    const [dentists, setDentists] = useState(null);

    useEffect(() => {
        setDentists(data);
    }, []);

    return (
        <>
            <h1 className={styles.page_title}>Directorio de Odontólogos</h1>
            <div className={styles.container_header}>
                <FilterOffice setSelectOffice={setSelectOffice} />
            </div>
            
            <DentistTable dentists={data}/>
        </>
    );
}

export default MedicalDirectoryPage;