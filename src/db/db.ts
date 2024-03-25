

type attributesList = Record<string, Record<string, { attribute: string, dataType: string, value: string }[]>>;
type resourcesList = Record<string, attributesList>;
export const resources: resourcesList =
{
  "research-paper-computer-science": {
    "https://api.npoint.io/92e56cd3a26b31bfcd14":
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
  },
  "course-material": {
    "https://www.npoint.io/docs/b7e2e485241a04f89fdc":
    {
      "#1": [{
        attribute: "credentialSubject.degreeLevel",
        dataType: "http://www.w3.org/2001/XMLSchema#string",
        value: "PhD"
      }]
    }
  },
  "conference": {
    "https://www.npoint.io/docs/b7e2e485241a04f89fdc":
    {
      "#0": [{
        attribute: "credentialSubject.degreeLevel",
        dataType: "http://www.w3.org/2001/XMLSchema#string",
        value: "PhD"
      }]
    },
    "https://api.npoint.io/292a45521e356ed0174b":
    {
      "#0": [{
        attribute: "credentialSubject.vaccineType",
        dataType: "http://www.w3.org/2001/XMLSchema#string",
        value: "Full"
      }]
    }
  },
  "10.1016/J.OSNEM.2023.100265": {
    "https://beta.api.schemas.serto.id/v1/public/program-completion-certificate/1.0/json-schema.json":
    {
      "#0": [{
        attribute: "credentialSubject.achievement",
        dataType: "http://www.w3.org/2001/XMLSchema#string",
        value: "Certified Solidity Developer 2"
      }],
      "#1": [{
        attribute: "credentialSubject.achievement",
        dataType: "http://www.w3.org/2001/XMLSchema#string",
        value: "Certified Java Developer"
      }]
    }
  }
};