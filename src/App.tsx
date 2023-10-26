import React, { useState } from 'react';
import logo from './logo.svg';
import './App.css';
import { MascaApi, enableMasca, Result, QueryCredentialsRequestResult } from '@blockchain-lab-um/masca-connector';

const url = 'http://localhost:3001/send';
const accounts = await (window as any).ethereum.request({
  method: 'eth_requestAccounts',
});
const address = accounts[0];
let api: MascaApi;
const enableResult = await enableMasca(address, {
  snapId: 'npm:@blockchain-lab-um/masca', // Defaults to `npm:@blockchain-lab-um/masca`
  version: '1.0.0', // Defaults to the latest released version
  supportedMethods: ['did:ethr'], // Defaults to all available methods
});

if (enableResult.success)
  api = await enableResult.data.getMascaApi();

function App() {

  async function request() {

    if (enableResult.success) {
      const query: string = '$[?(@.data.credentialSubject.achievement == "Certified Solidity Developer 2")]';

      const result: Result<QueryCredentialsRequestResult[]> = await api.queryCredentials({
        filter: {
          type: "JSONPath",
          filter: query,
        },
        options: {
          returnStore: true,
        },
      });

      if (result.success) {
        const vc: QueryCredentialsRequestResult = result.data[0];
        const vp = await api.createPresentation({
          vcs: [vc.data],
          proofFormat: 'EthereumEip712Signature2021',
        });

        if (vp.success) {
          const request = {
            vp: vp.data,
          }
          fetch(url, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify(request)
          })
            .then(response => response.json())
            .then(data => {
              console.log(data);
            })
            .catch(error => {
              console.error(error);
            });
        }
      } else {
        console.error(result.error);
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
