import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Download, Filter } from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";
import { ShieldIcon } from "@/components/ui/icons";
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";

// Mock data that varies significantly based on file
const generateMockData = (fileName: string) => {
  // Create a hash from filename for consistent but varied results
  const hash = fileName.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
  
  // Use hash to create different scenarios
  const scenario = hash % 5;
  
  let baseStats;
  switch (scenario) {
    case 0: // High threat scenario
      baseStats = {
        totalDevices: 450 + (hash % 100),
        blockedDevices: 45 + (hash % 25),
        avgConfidence: 85 + (hash % 10)
      };
      break;
    case 1: // Medium threat scenario  
      baseStats = {
        totalDevices: 320 + (hash % 80),
        blockedDevices: 18 + (hash % 15),
        avgConfidence: 78 + (hash % 12)
      };
      break;
    case 2: // Low threat scenario
      baseStats = {
        totalDevices: 200 + (hash % 60),
        blockedDevices: 8 + (hash % 10),
        avgConfidence: 92 + (hash % 8)
      };
      break;
    case 3: // Large network scenario
      baseStats = {
        totalDevices: 600 + (hash % 150),
        blockedDevices: 35 + (hash % 30),
        avgConfidence: 76 + (hash % 15)
      };
      break;
    default: // Mixed scenario
      baseStats = {
        totalDevices: 287 + (hash % 90),
        blockedDevices: 14 + (hash % 18),
        avgConfidence: 82 + (hash % 18)
      };
  }
  
  const cleanDevices = baseStats.totalDevices - baseStats.blockedDevices;
  
  return {
    ...baseStats,
    cleanDevices,
    deviceStatus: [
      { name: 'Clean', value: cleanDevices, color: '#22c55e' },
      { name: 'Blocked', value: baseStats.blockedDevices, color: '#ef4444' }
    ],
    threatLevels: [
      { name: 'High', value: Math.floor(baseStats.blockedDevices * 0.6), fill: '#ef4444' },
      { name: 'Medium', value: Math.floor(baseStats.blockedDevices * 0.3), fill: '#f97316' },
      { name: 'Low', value: Math.floor(baseStats.blockedDevices * 0.1), fill: '#eab308' }
    ],
    deviceTypes: [
      { name: 'Smart TV', value: Math.floor(baseStats.totalDevices * 0.2), fill: '#22d3ee' },
      { name: 'IoT Device', value: Math.floor(baseStats.totalDevices * 0.25), fill: '#22d3ee' },
      { name: 'Router', value: Math.floor(baseStats.totalDevices * 0.15), fill: '#22d3ee' },
      { name: 'Wearable', value: Math.floor(baseStats.totalDevices * 0.12), fill: '#22d3ee' },
      { name: 'Camera', value: Math.floor(baseStats.totalDevices * 0.1), fill: '#22d3ee' },
      { name: 'Lock', value: Math.floor(baseStats.totalDevices * 0.18), fill: '#22d3ee' }
    ]
  };
};

const Results = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { fileName = "default.csv" } = location.state || {};
  
  const [mockData] = useState(() => generateMockData(fileName));

  const StatCard = ({ title, value, color, subtitle }: { title: string; value: string | number; color: string; subtitle?: string }) => (
    <Card className="p-6 cyber-glow border-border bg-card/80 backdrop-blur">
      <div className="space-y-2">
        <p className="text-sm text-muted-foreground">{title}</p>
        <p className={`text-3xl font-bold ${color}`}>{value}</p>
        {subtitle && <p className="text-xs text-muted-foreground">{subtitle}</p>}
      </div>
    </Card>
  );

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card/50 backdrop-blur">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <ShieldIcon size={32} />
              <span className="text-xl font-semibold">IoT Security</span>
            </div>
            <div className="flex items-center gap-4">
              <Button variant="outline" size="sm">
                <Download className="h-4 w-4 mr-2" />
                Export Report
              </Button>
              <Button 
                variant="ghost" 
                onClick={() => navigate('/analysis')}
                className="flex items-center gap-2"
              >
                <ArrowLeft className="h-4 w-4" />
                Back to Analysis
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="container mx-auto px-6 py-8 cyber-grid min-h-screen">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2 text-glow">Analysis Results</h1>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatCard 
            title="Total Devices" 
            value={mockData.totalDevices}
            color="text-primary text-glow"
          />
          <StatCard 
            title="Blocked Devices" 
            value={mockData.blockedDevices}
            color="text-destructive text-glow"
          />
          <StatCard 
            title="Clean Devices" 
            value={mockData.cleanDevices}
            color="text-success text-glow"
          />
          <StatCard 
            title="Avg. Confidence" 
            value={`${mockData.avgConfidence}.0%`}
            color="text-warning text-glow"
          />
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
          {/* Device Status Distribution */}
          <Card className="p-6 cyber-glow border-border bg-card/80 backdrop-blur">
            <h3 className="text-lg font-semibold mb-4 text-primary">Device Status Distribution</h3>
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie
                  data={mockData.deviceStatus}
                  cx="50%"
                  cy="50%"
                  innerRadius={40}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {mockData.deviceStatus.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
            <div className="flex justify-center gap-4 mt-4">
              {mockData.deviceStatus.map((entry) => (
                <div key={entry.name} className="flex items-center gap-2">
                  <div 
                    className="w-3 h-3 rounded-full" 
                    style={{ backgroundColor: entry.color }}
                  />
                  <span className="text-sm">{entry.name}</span>
                </div>
              ))}
            </div>
          </Card>

          {/* Threat Level Distribution */}
          <Card className="p-6 cyber-glow border-border bg-card/80 backdrop-blur">
            <h3 className="text-lg font-semibold mb-4 text-destructive">Threat Level Distribution</h3>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={mockData.threatLevels}>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis dataKey="name" stroke="#9ca3af" />
                <YAxis stroke="#9ca3af" />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#1f2937', 
                    border: '1px solid #374151',
                    borderRadius: '8px'
                  }}
                />
                <Bar dataKey="value" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </Card>

          {/* Device Types */}
          <Card className="p-6 cyber-glow border-border bg-card/80 backdrop-blur">
            <h3 className="text-lg font-semibold mb-4 text-warning">Device Types</h3>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={mockData.deviceTypes}>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis 
                  dataKey="name" 
                  stroke="#9ca3af"
                  angle={-45}
                  textAnchor="end"
                  height={80}
                />
                <YAxis stroke="#9ca3af" />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#1f2937', 
                    border: '1px solid #374151',
                    borderRadius: '8px'
                  }}
                />
                <Bar dataKey="value" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </Card>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-center gap-4">
          <Button 
            onClick={() => navigate('/device-details', { state: { fileName, mockData } })}
            className="flex items-center gap-2"
          >
            <Filter className="h-4 w-4" />
            View Device Details
          </Button>
          <Button 
            variant="outline"
            onClick={() => navigate('/analysis')}
          >
            Run New Analysis
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Results;