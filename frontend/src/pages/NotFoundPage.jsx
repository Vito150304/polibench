import { Link } from 'react-router-dom';

function NotFoundPage() {
    return (
        <div>
            <h1>Error 404: Page not found</h1>
            <p>The address you were looking for does not exist on Polibench.</p>
            <Link to="/">Go back to Home</Link>
        </div>
    );
}
export default NotFoundPage;