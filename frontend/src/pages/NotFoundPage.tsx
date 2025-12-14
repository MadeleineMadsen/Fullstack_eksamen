import { Link } from 'react-router-dom';
import '../styles/style.css';

// Vises når brugeren rammer en route der ikke findes (404)
const NotFoundPage = () => {
    return (

        // Container til hele 404-siden
        <div className="not-found-container">
            <h1 className="not-found-title">404</h1>
            <h2 className="not-found-subtitle">Side ikke fundet</h2>
            <p className="not-found-message">
                Beklager, siden du leder efter eksisterer ikke.
            </p>
            <Link to="/" className="not-found-link">
                Tilbage til forsiden
            </Link>
        </div>
    );
};

export default NotFoundPage;