'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

export default function DebugCampaignsPage() {
  const [debugInfo, setDebugInfo] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const testApi = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/campaigns?page=1&limit=5');
      const data = await response.json();
      setDebugInfo({
        status: response.status,
        statusText: response.statusText,
        data: data,
        headers: Object.fromEntries(response.headers.entries())
      });
    } catch (error) {
      setDebugInfo({
        error: error instanceof Error ? error.message : 'Unknown error',
        stack: error instanceof Error ? error.stack : undefined
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-2xl font-bold mb-6">Campaign API Debug</h1>
        
        <Card className="p-6 mb-6">
          <Button onClick={testApi} disabled={loading}>
            {loading ? 'Testing...' : 'Test Campaign API'}
          </Button>
        </Card>

        {debugInfo && (
          <Card className="p-6">
            <h2 className="text-lg font-semibold mb-4">Debug Information</h2>
            <pre className="bg-slate-100 p-4 rounded overflow-auto text-sm">
              {JSON.stringify(debugInfo, null, 2)}
            </pre>
          </Card>
        )}
      </div>
    </div>
  );
}
