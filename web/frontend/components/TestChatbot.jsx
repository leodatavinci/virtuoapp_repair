import { useState } from 'react';
import { Button, Form, FormLayout, TextField, RadioButton, ChoiceList, ColorPicker } from '@shopify/polaris';

export default function BotConfiguration() {
  const [robotName, setRobotName] = useState('Virtuo');
  const [introSentence, setIntroSentence] = useState('');
  const [robotCharacter, setRobotCharacter] = useState('Competent');
  const [color, setColor] = useState({hue: 120, brightness: 1, saturation: 1});
  const [supportAgentName, setSupportAgentName] = useState('');
  const [supportAgentPhoneNumber, setSupportAgentPhoneNumber] = useState('');

  const handleSubmit = () => {
    // handle your form submission here
  };

  return (
    <Form onSubmit={handleSubmit}>
      <FormLayout>
        <TextField label="Robot Name" value={robotName} onChange={setRobotName} />
        <TextField label="Intro Sentence" value={introSentence} onChange={setIntroSentence} multiline={3} />
        
        <ChoiceList
          title="Robot Character"
          choices={[
            {label: 'Competent', value: 'Competent'},
            {label: 'Bubbly', value: 'Bubbly'},
            {label: 'Warm', value: 'Warm'}
          ]}
          selected={robotCharacter}
          onChange={value => setRobotCharacter(value)}
        />

        <ColorPicker color={color} onChange={setColor} />
        <TextField label="Support Agent Name" value={supportAgentName} onChange={setSupportAgentName} />
        <TextField label="Support Agent Phone Number" value={supportAgentPhoneNumber} onChange={setSupportAgentPhoneNumber} />

        <Button primary submit>Save2</Button>
      </FormLayout>
    </Form>
  );
}
