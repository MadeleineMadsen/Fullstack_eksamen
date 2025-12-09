import { Link } from 'react-router-dom';
import '../style/app.css';

const NotFoundPage = () => {
    return (
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