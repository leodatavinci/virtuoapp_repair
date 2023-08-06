import { useEffect, useState } from 'react';
import { useParams } from "react-router-dom";
import {
  Card,
  Page,
  Layout,
  SkeletonBodyText,
  Button,
  Stack,
  TextContainer,
} from "@shopify/polaris";
import { Loading, TitleBar } from "@shopify/app-bridge-react";
import { useAppQuery } from "../../hooks";
import { QRCodeForm } from "../../components";
import { useAuthenticatedFetch } from "../../hooks";

export default function QRCodeEdit() {
  const authenticatedFetch = useAuthenticatedFetch();
  const [pythonResult, setPythonResult] = useState(null);

  const sendMessage = async (text, type) => {
    try {
      const response = await authenticatedFetch('/api/gpt4/send', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ text, type}),
      });

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      const data = await response.json();
      console.log("Message sent successfully:", data);
      setPythonResult(data);
    } catch (error) {
      console.error('There was a problem with the fetch operation:', error);
    }
  };

  const handleButtonClick = () => {
    console.log("sending message");
    sendMessage("Hello from frontend", "sent");
  };

  return (
    <Stack alignment="center">
      <Button onClick={handleButtonClick}>Send Message</Button>
      {pythonResult && (
        <TextContainer>
          <p>Result from Python function: {pythonResult}</p>
        </TextContainer>
      )}
    </Stack>
  );
}
