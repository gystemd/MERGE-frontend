
import { Link } from 'react-router-dom';
import '../App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import { resources } from '../db/db';

function Resources() {
    return (
        <div className="bg-dark text-white min-vh-100">
            <div className="container" style={{ maxWidth: '600px' }}>

            <center><h1>List of resources</h1></center>
                <div className="list-group">
                    {Object.keys(resources).map(key => (
                        <div className="list-group-item">
                            <div className="d-flex justify-content-between align-items-center">
                                <h5 className="mb-2">{key}</h5>
                                <Link to={`/form?key=${key}`} className="btn btn-primary">Access</Link>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

export default Resources;

