import { Button } from "@/components/ui/button";
import { ShieldIcon, BrainIcon } from "@/components/ui/icons";
import { Play } from "lucide-react";
import { useNavigate } from "react-router-dom";
import cyberBg from "@/assets/cyber-bg.jpg";

const Home = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Background */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: `url(${cyberBg})` }}
      >
        <div className="absolute inset-0 bg-gradient-to-br from-background/95 via-background/90 to-background/95" />
      </div>

      {/* Content */}
      <div className="relative z-10 flex min-h-screen items-center justify-center px-4">
        <div className="text-center space-y-8 max-w-4xl mx-auto">
          {/* Icons */}
          <div className="flex justify-center items-center gap-8 mb-12">
            <div className="animate-cyber-pulse">
              <ShieldIcon size={64} />
            </div>
            <div className="animate-cyber-pulse" style={{ animationDelay: '1s' }}>
              <BrainIcon size={64} />
            </div>
          </div>

          {/* Title */}
          <div className="space-y-6">
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold text-foreground">
              IoT Botnet Detection
            </h1>
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-primary">
              Using Deep Learning
            </h2>
          </div>

          {/* Description */}
          <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            Convolutional neural network analysis for identifying and preventing botnet attacks in 
            Internet of Things devices. Powered by ResNet architecture for threat detection.
          </p>

          {/* CTA Button */}
          <div className="pt-8">
            <Button 
              size="lg"
              className="text-lg px-8 py-6 cyber-glow animate-cyber-pulse"
              onClick={() => navigate('/analysis')}
            >
              <Play className="mr-3 h-5 w-5" />
              Start Simulation
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;