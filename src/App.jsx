

import React, { useState } from 'react';
import { Card, CardContent, Button, Input } from '@/components/ui/card';
import { GoogleLogin } from 'react-oauth/google';
import axios from 'axios';

export default function App() {
  const [user, setUser] = useState(null);
  const [campaigns, setCampaigns] = useState([]);
  const [rules, setRules] = useState([{ condition: "spend", operator: ">", value: "5000" }]);
  const [aiMessages, setAiMessages] = useState([]);

  const handleGoogleLogin = (response) => {
    console.log(response);
    setUser({ name: 'John Doe', email: 'john@example.com' });
  };

  const handleCreateCampaign = async () => {
    const response = await axios.post('http://localhost:3000/api/ai-suggestions', { rules });
    setAiMessages(response.data.messages);
    const newCampaign = { id: campaigns.length + 1, name: "Campaign " + (campaigns.length + 1), status: "Pending", rules };
    setCampaigns([...campaigns, newCampaign]);
  };

  const addRule = () => {
    setRules([...rules, { condition: "spend", operator: ">", value: "" }]);
  };

  const updateRule = (index, field, value) => {
    const updatedRules = [...rules];
    updatedRules[index][field] = value;
    setRules(updatedRules);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <Card className="p-6 max-w-lg w-full">
        <CardContent>
          <h1 className="text-2xl font-bold mb-4">Xeno CRM Dashboard</h1>
          {!user ? (
            <GoogleLogin onSuccess={handleGoogleLogin} onError={() => alert('Login Failed')} />
          ) : (
            <div>
              <p>Welcome, {user.name}!</p>
              <div className="mt-4">
                <h2 className="text-lg font-semibold">Campaign Rule Builder</h2>
                {rules.map((rule, index) => (
                  <div key={index} className="flex gap-2 mt-2">
                    <Input type="text" value={rule.condition} onChange={(e) => updateRule(index, "condition", e.target.value)} />
                    <Input type="text" value={rule.operator} onChange={(e) => updateRule(index, "operator", e.target.value)} />
                    <Input type="text" value={rule.value} onChange={(e) => updateRule(index, "value", e.target.value)} />
                  </div>
                ))}
                <Button onClick={addRule} className="mt-2">Add Rule</Button>
              </div>
              <Button onClick={handleCreateCampaign} className="mt-4">Create Campaign</Button>

              {aiMessages.length > 0 && (
                <div className="mt-4">
                  <h2 className="text-lg font-semibold">AI-Driven Message Suggestions</h2>
                  <ul>
                    {aiMessages.map((msg, index) => (
                      <li key={index}>{msg}</li>
                    ))}
                  </ul>
                </div>
              )}

              <div className="mt-4">
                <h2 className="text-lg font-semibold">Campaign History</h2>
                <ul>
                  {campaigns.map((campaign) => (
                    <li key={campaign.id}>{campaign.name} - {campaign.status}</li>
                  ))}
                </ul>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
