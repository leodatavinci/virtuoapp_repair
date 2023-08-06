import { useState, useEffect } from 'react';
import { Button, Form, FormLayout, TextField } from '@shopify/polaris';
import { useAuthenticatedFetch } from '../hooks';

export default function Documents() {
  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');
  const [documents, setDocuments] = useState([]);

  const fetch = useAuthenticatedFetch();

  useEffect(() => {
    fetch("/api/getdocuments")
      .then(response => {
        if (response.ok) return response.json();
        throw new Error('Network response was not ok.');
      })
      .then(data => setDocuments(data))      
  }, []);

  const handleSubmit = () => {
    const documentData = { title, body };

    fetch("/api/setdocument", {
      method: 'POST',
      body: JSON.stringify(documentData),
      headers: { 'Content-Type': 'application/json' }
    })
    .then(response => {
      if (response.ok) return response.json();
      throw new Error('Network response was not ok.');
    })
    .then(data => {
      // Update local state with the new document
      setDocuments([...documents, documentData]);
      // Clear the form
      setTitle('');
      setBody('');
    })
    .catch(err => console.error('There was a problem with the fetch operation:', err));
  };

  const handleDocumentClick = (doc) => {
    setTitle(doc.title ? doc.title : '');
    setBody(doc.body ? doc.body : '');
  }

  return (
    <div className="documentContainer">
      <div className="documentList">
        {documents.map((doc, index) => (
          <button key={index} onClick={() => handleDocumentClick(doc)}>
            {doc.title}
          </button>
        ))}
      </div>
      <Form onSubmit={handleSubmit} className="formContainer">
        <FormLayout>
          <div className="fieldContainer">
            <TextField label="Title" value={title} onChange={setTitle} />
          </div>

          <div className="fieldContainer">
            <TextField label="Body" value={body} onChange={setBody} multiline={10} />
          </div>

          <div className="fieldContainer">
            <Button primary submit>Save</Button>
          </div>
        </FormLayout>
      </Form>
    </div>
  );
}
