import Image from "next/image";
import { ReactNode } from "react";

// images
import NexGenBackground from "@/public/nexgen-background.jpg";

interface BackgroundLayoutProps {
  children: ReactNode;
}

const BackgroundLayout = ({ children }: BackgroundLayoutProps) => {
  return (
    <div className="relative min-h-screen w-full overflow-hidden">
      {/* Background Image with dark overlay */}
      <div className="absolute inset-0 z-0">
        <Image
          src={NexGenBackground}
          alt="NexGen Background"
          fill
          className="object-cover"
          priority
        />
        {/* Black tint overlay */}
        <div className="absolute inset-0 bg-black opacity-55" />
      </div>

      {/* Foreground Content */}
      <div className="relative z-10 flex min-h-svh flex-col items-center justify-center p-6 md:p-10">
        <div className="flex w-full max-w-sm flex-col items-center gap-8 md:max-w-3xl">
          {children}
        </div>
      </div>
    </div>
  );
};

export default BackgroundLayout;
