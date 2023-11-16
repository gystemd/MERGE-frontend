import React from 'react';
import logo from './logo.svg';
import './App.css';
import { MascaApi, enableMasca, Result, QueryCredentialsRequestResult } from '@blockchain-lab-um/masca-connector';

const url = 'http://localhost:3001/send';
const accounts = await (window as any).ethereum.request({ method: 'eth_requestAccounts' });
const address = accounts[0];
let api: MascaApi;
const enableResult = await enableMasca(address, {
  snapId: 'npm:@blockchain-lab-um/masca', version: '1.1.0', supportedMethods: ['did:ethr'],
});

if (enableResult.success)
  api = await enableResult.data.getMascaApi();
// type newDictionary = Record<string, [Record<string, { attribute: string, dataType: string, value:string }>]>;

type attributesList = Record<string, Record<string, { attribute: string, dataType: string, value: string }[]>>;
type resourcesList = Record<string, attributesList>;

const resources: resourcesList =
{
  "research-paper-computer-science": {
    "https://www.npoint.io/docs/b7e2e485241a04f89fdc":
    {
      "#1": [{
        attribute: "credentialSubject.degreeLevel",
        dataType: "http://www.w3.org/2001/XMLSchema#string",
        value: "PhD"
      }, {
        attribute: "credentialSubject.degreeField",
        dataType: "http://www.w3.org/2001/XMLSchema#string",
        value: "Computer Science"
      }]
    }
  }
};

function buildQueries(resource: string) {
  const queryList: string[] = [];
  const resourceAttributes: attributesList = resources[resource];
  Object.keys(resourceAttributes).forEach((CategoryKey) => {
    const category = resourceAttributes[CategoryKey];

    Object.keys(category).forEach((credentialKey) => {
      let query = '$[?(';
      const credential = category[credentialKey];

      credential.forEach((attributeEntry) => {
        query += '@.data.';
        query += attributeEntry.attribute;
        query += ' == "';
        query += attributeEntry.value + '"';
        if (credential.indexOf(attributeEntry) !== credential.length - 1) {
          query += ' && ';
        }
      });

      query += ')]';
      queryList.push(query);
    });
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

function App() {

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
        const request = { vp: vp.data, resource: resource }
        console.log(request);
        fetch(url, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(request) })
          .then(response => response.json())
          .then(data => { console.log(data); })
          .catch(error => { console.error(error); });
      }

    }
  }


  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        {Object.keys(resources).map(key => (
          <button onClick={() => request(key)} key={key}>
            {key}
          </button>
        ))}
      </header>
    </div>
  );
}

export default App;
