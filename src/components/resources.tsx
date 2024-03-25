
import { Link } from 'react-router-dom';
import '../App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import { resources } from '../db/db';

function Resources() {
    return (
        <div className="card-group">
            {Object.keys(resources).map(key => (
                <div className="card">
                    <div className="card-body">
                        <h5 className="card-title">{key}</h5>
                        <Link to={`/form?key=${key}`} className="btn btn-primary">Request</Link>
                        {/* <button onClick={() => request(key)} className="btn btn-primary">Request</button> */}
                    </div>
                </div>
            ))}
        </div>
    );
}

export default Resources;

