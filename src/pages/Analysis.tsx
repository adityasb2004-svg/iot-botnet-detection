import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Input } from "@/components/ui/input";
import { Upload, ArrowLeft, Play, Settings, Info } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { ShieldIcon } from "@/components/ui/icons";

interface AnalysisConfig {
  model: string;
  confidence: number;
  batchSize: number;
}

interface UploadedFile {
  name: string;
  size: number;
  type: string;
}

const Analysis = () => {
  const navigate = useNavigate();
  const [uploadedFile, setUploadedFile] = useState<UploadedFile | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [config, setConfig] = useState<AnalysisConfig>({
    model: "resnet-50",
    confidence: 0.7,
    batchSize: 32
  });

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setUploadedFile({
        name: file.name,
        size: file.size,
        type: file.type
      });
    }
  };

  const handleStartAnalysis = async () => {
    if (!uploadedFile) return;
    
    setIsAnalyzing(true);
    
    // Simulate analysis delay
    setTimeout(() => {
      setIsAnalyzing(false);
      
      // Pass file info to results page via state
      navigate('/results', { 
        state: { 
          fileName: uploadedFile.name,
          config 
        } 
      });
    }, 3000);
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

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
              onClick={() => navigate('/')}
              className="flex items-center gap-2"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to Home
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="container mx-auto px-6 py-8 cyber-grid min-h-screen">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2 text-glow">Botnet Detection Analysis</h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Data Upload Section */}
          <Card className="p-6 space-y-6 cyber-glow border-border bg-card/80 backdrop-blur">
            <div className="flex items-center gap-3 mb-4">
              <Upload className="h-5 w-5 text-primary" />
              <h2 className="text-xl font-semibold text-primary">Data Upload</h2>
            </div>

            <div className="space-y-4">
              <div className="border-2 border-dashed border-border rounded-lg p-8 text-center">
                <Upload className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-medium mb-2">Upload IoT Traffic Data</h3>
                <p className="text-sm text-muted-foreground mb-4">Supports CSV, JSON, PCAP files</p>
                
                <input
                  type="file"
                  accept=".csv,.json,.pcap"
                  onChange={handleFileUpload}
                  className="hidden"
                  id="file-upload"
                />
                <Button asChild variant="outline">
                  <label htmlFor="file-upload" className="cursor-pointer">
                    Choose File
                  </label>
                </Button>
                
                {uploadedFile && (
                  <div className="mt-4 p-3 bg-secondary rounded-lg">
                    <div className="text-sm font-medium">{uploadedFile.name}</div>
                    <div className="text-xs text-muted-foreground">
                      {formatFileSize(uploadedFile.size)}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </Card>

          {/* Getting Started */}
          <Card className="p-6 cyber-glow border-border bg-card/80 backdrop-blur">
            <div className="flex items-center gap-3 mb-6">
              <Info className="h-5 w-5 text-primary" />
              <h2 className="text-xl font-semibold text-primary">Getting Started</h2>
            </div>

            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm font-medium">
                  1
                </div>
                <div>
                  <div className="font-medium">Upload your preprocessed IoT traffic data file</div>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-full bg-muted text-muted-foreground flex items-center justify-center text-sm font-medium">
                  2
                </div>
                <div>
                  <div className="font-medium">Adjust detection parameters if needed</div>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-full bg-muted text-muted-foreground flex items-center justify-center text-sm font-medium">
                  3
                </div>
                <div>
                  <div className="font-medium">Click "Start Analysis" to begin detection</div>
                </div>
              </div>
            </div>

            <div className="mt-8">
              <Button 
                className="w-full cyber-glow animate-cyber-pulse" 
                size="lg"
                disabled={!uploadedFile || isAnalyzing}
                onClick={handleStartAnalysis}
              >
                {isAnalyzing ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-current mr-2"></div>
                    Analyzing...
                  </>
                ) : (
                  <>
                    <Play className="mr-2 h-4 w-4" />
                    Start Analysis
                  </>
                )}
              </Button>
            </div>
          </Card>
        </div>

        {/* Configuration Section */}
        <Card className="mt-8 p-6 cyber-glow border-border bg-card/80 backdrop-blur">
          <div className="flex items-center gap-3 mb-6">
            <Settings className="h-5 w-5 text-primary" />
            <h2 className="text-xl font-semibold text-primary">Configuration</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Model Architecture */}
            <div className="space-y-2">
              <Label>Model Architecture</Label>
              <Select value={config.model} onValueChange={(value) => setConfig({...config, model: value})}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="resnet-50">ResNet-50 (Deep Residual Network)</SelectItem>
                  <SelectItem value="resnet-101">ResNet-101</SelectItem>
                  <SelectItem value="vgg-16">VGG-16</SelectItem>
                </SelectContent>
              </Select>
              <p className="text-xs text-muted-foreground">Optimized for IoT traffic pattern recognition</p>
            </div>

            {/* Detection Confidence Threshold */}
            <div className="space-y-2">
              <Label>Detection Confidence Threshold</Label>
              <div className="px-3">
                <Slider
                  value={[config.confidence]}
                  onValueChange={(value) => setConfig({...config, confidence: value[0]})}
                  max={1}
                  min={0.1}
                  step={0.1}
                  className="w-full"
                />
              </div>
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>{config.confidence}</span>
                <span>Higher values = more selective detection</span>
              </div>
            </div>

            {/* Batch Size */}
            <div className="space-y-2">
              <Label>Batch Size</Label>
              <Input
                type="number"
                value={config.batchSize}
                onChange={(e) => setConfig({...config, batchSize: parseInt(e.target.value)})}
                min={1}
                max={128}
              />
              <p className="text-xs text-muted-foreground">Larger batches = faster processing</p>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default Analysis;