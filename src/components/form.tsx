import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.min.js';
import { resources } from '../db/db';
import { MascaApi, enableMasca, Result, QueryCredentialsRequestResult } from '@blockchain-lab-um/masca-connector';
const url = 'http://localhost:3001/send';
const accounts = await (window as any).ethereum.request({ method: 'eth_requestAccounts' });
const address = accounts[0];
let api: MascaApi;
const enableResult = await enableMasca(address, {
    snapId: 'npm:@blockchain-lab-um/masca', version: '1.1.0', supportedMethods: ['did:ethr'],
});

type attributesList = Record<string, Record<string, { attribute: string, dataType: string, value: string }[]>>;

if (enableResult.success)
    api = await enableResult.data.getMascaApi();


function buildQueries(resource: string) {
    const queryList: string[] = [];
    const resourceAttributes: attributesList = resources[resource];
    Object.keys(resourceAttributes).forEach((CategoryKey) => {
        // const category = resourceAttributes[CategoryKey];
        let query = '$[?(' + '@.data.credentialSchema.id == "' + CategoryKey + '")]';
        queryList.push(query);
        // Object.keys(category).forEach((credentialKey) => {
        //     let query = '$[?(';
        //     const credential = category[credentialKey];

        //     credential.forEach((attributeEntry) => {
        //         query += '@.data.';
        //         query += attributeEntry.attribute;
        //         query += ' == "';
        //         query += attributeEntry.value + '"';
        //         if (credential.indexOf(attributeEntry) !== credential.length - 1) {
        //             query += ' && ';
        //         }
        //     });

        //     query += ')]';
        //     queryList.push(query);
        // });
    });

    return queryList;
}

async function mascaRequest(query: string) {
    console.log(query);
    const result: Result<QueryCredentialsRequestResult[]> = await api.queryCredentials({
        filter: { type: "JSONPath", filter: query, }, options: { returnStore: true, },
    });
    return result;
}


function Form() {
    const [value, setValue] = useState('');
    const [showModal, setShowModal] = useState(false);
    const location = useLocation();
    const queryParams = new URLSearchParams(location.search);

    const key = queryParams.get('key'); // replace 'param1' with your parameter name
    if (key === null || resources[key] === undefined)
        return <h1>Invalid Resource</h1>;

    async function request(resource: string) {

        if (enableResult.success) {
            const vcList: (QueryCredentialsRequestResult)[] = [];
            const queryList = buildQueries(resource);

            for (const query of queryList) {
                const result = await mascaRequest(query);
                if (result.success && result.data)
                    vcList.push(result.data[0]);
            }

            const vp = await api.createPresentation({
                vcs: vcList.map(vc => vc.data),
                proofFormat: 'EthereumEip712Signature2021',
            });

            if (vp.success) {
                console.log(vp.data);
                setValue(JSON.stringify(vp.data));
                const request = { vp: vp.data, resource: resource }
                // fetch(url, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(request) })
                //     .then(response => response.json())
                //     .then(data => { console.log(data); })
                //     .catch(error => { console.error(error); });
            }

        }
    }


    return (
        <div className="bg-dark text-white min-vh-100">
            <div className="container ">
                {showModal && (
                    <div className="modal fade show text-dark" id="exampleModal" style={{ display: 'block' }} tabIndex={-1} role="dialog" aria-hidden="true">
                        <div className="modal-dialog">
                            <div className="modal-content">
                                <div className="modal-header">
                                    <h5 className="modal-title" id="exampleModalLabel">Required VCs</h5>
                                </div>
                                <div className="modal-body">
                                    <ul>
                                        {Object.keys(resources[key]).map((CategoryKey) => {
                                            const numEntries = Object.keys(resources[key][CategoryKey]).length;
                                            return <li>({numEntries}) {CategoryKey}</li>
                                        })}
                                    </ul>
                                </div>
                                <div className="modal-footer">
                                    <button type="button" className="btn btn-secondary" onClick={() => setShowModal(false)}>
                                        Close
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
                <div className="row justify-content-center">
                    <div className="col-md-6">
                        <h3 className="text-center">Resource id: {key}</h3>
                        <div className="d-flex justify-content-between mt-3 mb-3">
                            <button onClick={() => request(key)} className="btn btn-success">Try automatic filling</button>
                            <button type="button" className="btn btn-primary" onClick={() => setShowModal(true)}>
                                View required VCs
                            </button>
                            <button className="btn btn-light">View XACML Policy</button>
                        </div>
                        <form onSubmit={(event) => {
                            event.preventDefault();
                            request(key);
                        }}>
                            <div className="form-group mt-4">
                                <label className="h5 text-center" htmlFor="message">Verifiable Presentation</label>
                                <textarea
                                    className="form-control"
                                    id="message"
                                    value={value}
                                    onChange={event => setValue(event.target.value)}
                                    placeholder="Paste your Verifiable Presentation here"
                                    rows={10}
                                />
                            </div>
                            <div className="text-center">
                                <button type="submit" className="btn btn-primary mt-3" style={{ width: '200px', fontSize: '20px' }}>Submit</button>
                            </div>
                        </form>
                    </div>
                </div>
            </div >
        </div>

    );
}

export default Form;


// <form onSubmit={(event) => {
//     event.preventDefault();
//     request(key);
// }}></form>