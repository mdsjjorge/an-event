import EventNav from "@/components/EventNav";
import HeroSection from "@/components/HeroSection";
import GiftList from "@/components/GiftList";
import RsvpSection from "@/components/RsvpSection";
import { Heart } from "lucide-react";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <EventNav />
      <HeroSection
        eventTitle="Ajude-nos a construir nosso novo lar"
        eventSubtitle="Preparamos esta lista com muito carinho para equipar nossa casinha. Fique à vontade para escolher um item ou contribuir com qualquer valor!"
      />
      <GiftList />
      <RsvpSection />
      <footer className="py-8 text-center border-t border-border">
        <p className="font-body text-sm text-muted-foreground flex items-center justify-center gap-1">
          Feito com <Heart className="w-4 h-4 text-primary fill-current" /> para nosso grande dia
        </p>
      </footer>
    </div>
  );
};

export default Index;
