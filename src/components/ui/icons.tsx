import { Shield, Brain } from "lucide-react";
import { cn } from "@/lib/utils";

interface IconProps {
  className?: string;
  size?: number;
}

export const ShieldIcon = ({ className, size = 48 }: IconProps) => (
  <Shield 
    className={cn("text-primary cyber-glow", className)} 
    size={size}
    strokeWidth={1.5}
  />
);

export const BrainIcon = ({ className, size = 48 }: IconProps) => (
  <Brain 
    className={cn("text-primary cyber-glow", className)} 
    size={size}
    strokeWidth={1.5}
  />
);