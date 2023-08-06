import React, { useState } from 'react';
import { AppProvider, Page, Card, Layout, Frame } from '@shopify/polaris';
import NavBar from '../components/Navbar';  // Import the NavBar component
import BotConfiguration from '../components/BotConfiguration';
import Documents from '../components/Documents';
import Settings from '../components/Settings';

export default function App() {
  const [selected, setSelected] = useState(0);
  
  const tabPanels = [
    <BotConfiguration key="bot-configuration" />,
    <Documents key="documents" />,
    <Settings key="settings" />,
    // Add other panels as required
  ];

  return (
    <AppProvider i18n={{}}>
      <Frame navigation={<NavBar setSelected={setSelected} />}>
        <Page title="Virtuo Updated">
          <Layout>
            <Layout.Section>
              <Card>
                <div style={{ padding: '16px 0' }}>
                  {tabPanels[selected]}
                </div>
              </Card>
            </Layout.Section>
          </Layout>
        </Page>
      </Frame>
    </AppProvider>
  );
}
