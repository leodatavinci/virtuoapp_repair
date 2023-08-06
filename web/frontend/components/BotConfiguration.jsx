import { useState, useEffect } from 'react';
import { Button, Form, FormLayout, TextField, RadioButton, ChoiceList, ColorPicker } from '@shopify/polaris';
import { useAuthenticatedFetch } from '../hooks'; // Update this path to match your project structure

export default function BotConfiguration() {
  
  const [robotName, setRobotName] = useState('Virtuo');
  const [introSentence, setIntroSentence] = useState('');
  const [robotCharacter, setRobotCharacter] = useState('Competent');
  const [color, setColor] = useState({hue: 120, brightness: 1, saturation: 1});
  const [supportAgentName, setSupportAgentName] = useState('');
  const [supportAgentPhoneNumber, setSupportAgentPhoneNumber] = useState('');

  const fetch = useAuthenticatedFetch();

  useEffect(() => {
    // Fetch existing configuration from the server when the component is mounted
    fetch("/api/getconfig")
      .then(response => {
        if (response.ok) return response.json();
        throw new Error('Network response was not ok.');
      })
      .then(config => {
        setRobotName(config.robotName ? config.robotName : 'Virtuo');
        setIntroSentence(config.introSentence ? config.introSentence : '');
        setColor(config.color ? config.color : {hue: 120, brightness: 1, saturation: 1, alpha: 1});
        setRobotCharacter(config.robotCharacter ? config.robotCharacter : 'Competent');
        setSupportAgentName(config.supportAgentName ? config.supportAgentName : '');
        setSupportAgentPhoneNumber(config.supportAgentPhoneNumber ? config.supportAgentPhoneNumber : '');
      })      
  }, []);

  const handleSubmit = () => {
    console.log("clicking on submit");
    // Save configuration to the server
    const configData = {
      robotName,
      introSentence,
      robotCharacter,
      color,
      supportAgentName,
      supportAgentPhoneNumber
    };

    fetch("/api/setconfig", {
      method: 'POST',
      body: JSON.stringify(configData),
      headers: { 'Content-Type': 'application/json' }
    })
    .then(response => {
      if (response.ok) return response.json();
      throw new Error('Network response was not ok.');
    })
    .then(data => console.log(data))
    .catch(err => console.error('There was a problem with the fetch operation:', err));
  };

  return (
    <Form onSubmit={handleSubmit} className="formContainer">
      <FormLayout>
        <div className="fieldContainer">
          <TextField label="Robot Name" value={robotName} onChange={setRobotName} />
        </div>
        
        <div className="fieldContainer">
          <TextField label="Intro Sentence" value={introSentence} onChange={setIntroSentence} multiline={3} />
        </div>

        <div className="fieldContainer">
          <ColorPicker color={color} onChange={setColor} />
        </div>

        <div className="fieldContainer">
          <TextField label="Messaging Service" value={supportAgentName} onChange={setSupportAgentName} />
        </div>

        <div className="fieldContainer">
          <TextField label="Support Agent Name" value={supportAgentName} onChange={setSupportAgentName} />
        </div>

        <div className="fieldContainer">
          <TextField label="Support Agent Phone Number" value={supportAgentPhoneNumber} onChange={setSupportAgentPhoneNumber} />
        </div>

        <div className="fieldContainer">
          <Button primary submit>Save</Button>
        </div>
      </FormLayout>
    </Form>
  );

}
