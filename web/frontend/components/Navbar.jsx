import React, { useCallback, useState, useEffect } from 'react';
import { Navigation, Icon, TextStyle, Stack } from '@shopify/polaris';
import { BuyButtonMajor } from '@shopify/polaris-icons';
import { useAuthenticatedFetch } from '../hooks';
import './NavBar.css';

export default function NavBar({ setSelected }) {
  const [shopInfo, setShopInfo] = useState({});
  const authenticatedFetch = useAuthenticatedFetch();

  useEffect(() => {
    // your useEffect code
  }, []);

  const tabs = [
    {
      id: 'bot-configuration',
      content: 'Bot Configuration',
      icon: BuyButtonMajor,
      panelID: 'bot-configuration-content',
    },
    {
      id: 'documents',
      content: 'Documents',
      icon: BuyButtonMajor,
      panelID: 'documents-content',
    },
    {
      id: 'database',
      content: 'Database',
      icon: BuyButtonMajor,
      panelID: 'database-content',
    },
    {
      id: 'conversations',
      content: 'Conversations',
      icon: BuyButtonMajor,
      panelID: 'conversations-content',
    },
    {
      id: 'contact',
      content: 'Contact',
      icon: BuyButtonMajor,
      panelID: 'contact-content',
    }
  ];

  return (
    <Navigation location="/">
      {tabs.map((tab, index) => (
        <div
          className="nav-button"
          style={{ cursor: 'pointer' }}
          onClick={() => setSelected(index)}
          key={tab.id}
        >
          <Stack alignment="center" spacing="tight">
            <Icon source={tab.icon} color="subdued" />
            <TextStyle variation="subdued">{tab.content}</TextStyle>
          </Stack>
        </div>
      ))}
    </Navigation>
  );
}
