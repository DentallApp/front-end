import styles from './NotFoundPage.module.css';

const NotFoundPage = () => {
    return(
        <section className={styles.container_error}>
            <h2>Error 404. Página no encontrada</h2>
        </section>
    );
}

export default NotFoundPage;