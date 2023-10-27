import React from 'react';
import logo from './logo.svg';
import './App.css';
import { MascaApi, enableMasca, Result, QueryCredentialsRequestResult } from '@blockchain-lab-um/masca-connector';

const url = 'http://localhost:3001/send';
const accounts = await (window as any).ethereum.request({ method: 'eth_requestAccounts' });
const address = accounts[0];
let api: MascaApi;
const enableResult = await enableMasca(address, {
  snapId: 'npm:@blockchain-lab-um/masca', version: '1.0.0', supportedMethods: ['did:ethr'],
});

if (enableResult.success)
  api = await enableResult.data.getMascaApi();
// type newDictionary = Record<string, [Record<string, { attribute: string, dataType: string, value:string }>]>;

type attributesDictionary = Record<string, Record<string, { attribute: string, dataType: string, value: string }[]>>;
const attributes: attributesDictionary =
{
  "https://beta.api.schemas.serto.id/v1/public/program-completion-certificate/1.0/json-schema.json":
  {
    "#1": [{
      attribute: "credentialSubject.achievement",
      dataType: "http://www.w3.org/2001/XMLSchema#string",
      value: "Certified Solidity Developer 2"
    }],
    "#2": [{
      attribute: "credentialSubject.achievement",
      dataType: "http://www.w3.org/2001/XMLSchema#string",
      value: "Certified Java Developer"
    }
    ]
  }
};

function buildQueries(dictionary: attributesDictionary) {
  const queryList: string[] = [];

  Object.keys(dictionary).forEach((CategoryKey) => {
    const category = dictionary[CategoryKey];

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

  async function request() {

    if (enableResult.success) {
      const vcList: (QueryCredentialsRequestResult)[] = [];
      const queryList = buildQueries(attributes);

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
        const request = { vp: vp.data }
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
        <button onClick={request}>Resource 1</button>
      </header>
    </div>
  );
}

export default App;
