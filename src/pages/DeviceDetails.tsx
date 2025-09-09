import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ArrowLeft, Search, AlertTriangle, Shield, CheckCircle } from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";
import { ShieldIcon } from "@/components/ui/icons";

interface Device {
  id: string;
  name: string;
  ipAddress: string;
  deviceType: string;
  confidence: number;
  lastSeen: string;
  threatLevel: "HIGH" | "MEDIUM" | "LOW" | "CLEAN";
}

const generateDevices = (fileName: string, totalDevices: number, blockedDevices: number) => {
  const devices: Device[] = [];
  const deviceTypes = ["Smart TV", "IoT Sensor", "Router", "Wearable", "Camera", "Smart Lock"];
  const threatLevels: Device["threatLevel"][] = ["HIGH", "MEDIUM", "LOW"];
  
  // Create hash for consistent device generation
  const hash = fileName.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
  
  // Generate blocked devices with varied names based on hash
  for (let i = 0; i < blockedDevices; i++) {
    const deviceIndex = (hash + i) % deviceTypes.length;
    const ipOctet3 = ((hash + i * 7) % 254) + 1;
    const ipOctet4 = ((hash + i * 13) % 254) + 1;
    
    devices.push({
      id: `threat_device_${i + 1}`,
      name: `${deviceTypes[deviceIndex]} ${i + 1}`,
      ipAddress: `192.168.${ipOctet3}.${ipOctet4}`,
      deviceType: deviceTypes[deviceIndex],
      confidence: 70 + ((hash + i * 3) % 30),
      lastSeen: `9/${((hash + i) % 4) + 1}/2025`,
      threatLevel: threatLevels[(hash + i * 5) % threatLevels.length]
    });
  }
  
  // Generate clean devices (show more based on total)
  const cleanDevices = totalDevices - blockedDevices;
  const cleanDevicesToShow = Math.min(cleanDevices, Math.max(10, Math.floor(cleanDevices * 0.1))); // Show at least 10, or 10% of clean devices
  
  for (let i = 0; i < cleanDevicesToShow; i++) {
    const deviceIndex = (hash + i + blockedDevices) % deviceTypes.length;
    const ipOctet3 = ((hash + i * 11 + blockedDevices) % 254) + 1;
    const ipOctet4 = ((hash + i * 17 + blockedDevices) % 254) + 1;
    
    devices.push({
      id: `clean_device_${i + 1}`,
      name: `${deviceTypes[deviceIndex]} ${i + blockedDevices + 1}`,
      ipAddress: `192.168.${ipOctet3}.${ipOctet4}`,
      deviceType: deviceTypes[deviceIndex],
      confidence: 80 + ((hash + i * 7) % 20),
      lastSeen: `9/${((hash + i) % 4) + 1}/2025`,
      threatLevel: "CLEAN"
    });
  }
  
  return devices;
};

const DeviceDetails = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { fileName = "default.csv", mockData } = location.state || { 
    mockData: { totalDevices: 287, blockedDevices: 14 } 
  };
  
  const [searchTerm, setSearchTerm] = useState("");
  const [devices] = useState(() => 
    generateDevices(fileName, mockData.totalDevices, mockData.blockedDevices)
  );
  
  const blockedDevices = devices.filter(d => d.threatLevel !== "CLEAN");
  const cleanDevices = devices.filter(d => d.threatLevel === "CLEAN");
  const cleanDevicesToShow = cleanDevices.length;
  
  const filteredDevices = (deviceList: Device[]) => 
    deviceList.filter(device => 
      device.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      device.ipAddress.includes(searchTerm) ||
      device.deviceType.toLowerCase().includes(searchTerm.toLowerCase())
    );

  const getThreatIcon = (threatLevel: Device["threatLevel"]) => {
    switch (threatLevel) {
      case "HIGH":
        return <AlertTriangle className="h-4 w-4 text-destructive" />;
      case "MEDIUM":
        return <AlertTriangle className="h-4 w-4 text-warning" />;
      case "LOW":
        return <Shield className="h-4 w-4 text-muted-foreground" />;
      case "CLEAN":
        return <CheckCircle className="h-4 w-4 text-success" />;
    }
  };

  const getThreatBadgeVariant = (threatLevel: Device["threatLevel"]) => {
    switch (threatLevel) {
      case "HIGH":
        return "destructive";
      case "MEDIUM":
        return "secondary";
      case "LOW":
        return "outline";
      case "CLEAN":
        return "default";
      default:
        return "outline";
    }
  };

  const DeviceCard = ({ device }: { device: Device }) => (
    <Card className="p-4 cyber-glow border-border bg-card/80 backdrop-blur hover:bg-card/90 transition-all">
      <div className="flex items-start justify-between">
        <div className="space-y-2 flex-1">
          <div className="flex items-center gap-2">
            {getThreatIcon(device.threatLevel)}
            <h3 className="font-semibold">{device.name}</h3>
            {device.threatLevel !== "CLEAN" && (
              <Badge variant={getThreatBadgeVariant(device.threatLevel)} className="cyber-glow">
                {device.threatLevel}
              </Badge>
            )}
          </div>
          
          <div className="space-y-1 text-sm text-muted-foreground">
            <div><span className="font-medium">IP Address:</span> {device.ipAddress}</div>
            <div><span className="font-medium">Device Type:</span> {device.deviceType}</div>
            <div><span className="font-medium">Confidence:</span> {device.confidence}%</div>
            <div><span className="font-medium">Last Seen:</span> {device.lastSeen}</div>
          </div>
        </div>
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
            <Button 
              variant="ghost" 
              onClick={() => navigate('/results', { state: { fileName } })}
              className="flex items-center gap-2"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to Results
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="container mx-auto px-6 py-8 cyber-grid min-h-screen">
        {/* Header Section */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
          <div>
            <h1 className="text-3xl font-bold text-foreground text-glow">Device Details</h1>
            <p className="text-muted-foreground mt-1">
              Dataset Analysis Complete: Processed {fileName} containing IoT network traffic data. 
              Showing {Math.min(devices.length, cleanDevicesToShow + blockedDevices.length)} devices from total dataset of {mockData.totalDevices} analyzed devices.
            </p>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search devices..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 w-80"
              />
            </div>
            <Badge variant="outline" className="whitespace-nowrap">
              All Threats
            </Badge>
          </div>
        </div>

        {/* Tabs */}
        <Tabs defaultValue="all" className="w-full">
          <TabsList className="grid w-full grid-cols-3 bg-secondary/50 backdrop-blur">
            <TabsTrigger value="all" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
              All Devices ({devices.length})
            </TabsTrigger>
            <TabsTrigger value="blocked" className="text-destructive data-[state=active]:bg-destructive data-[state=active]:text-destructive-foreground">
              ⚠ Blocked ({blockedDevices.length})
            </TabsTrigger>
            <TabsTrigger value="clean" className="text-success data-[state=active]:bg-success data-[state=active]:text-success-foreground">
              ✓ Clean ({cleanDevices.length})
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="all" className="space-y-4 mt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredDevices(devices).map((device) => (
                <DeviceCard key={device.id} device={device} />
              ))}
            </div>
          </TabsContent>
          
          <TabsContent value="blocked" className="space-y-4 mt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredDevices(blockedDevices).map((device) => (
                <DeviceCard key={device.id} device={device} />
              ))}
            </div>
          </TabsContent>
          
          <TabsContent value="clean" className="space-y-4 mt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredDevices(cleanDevices).map((device) => (
                <DeviceCard key={device.id} device={device} />
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default DeviceDetails;