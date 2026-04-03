import { Heart } from "lucide-react";
import { Button } from "@/components/ui/button";
import heroImage from "@/assets/hero-couple.jpg";

interface HeroSectionProps {
  eventTitle: string;
  eventSubtitle: string;
}

const HeroSection = ({ eventTitle, eventSubtitle }: HeroSectionProps) => {
  return (
    <section className="relative h-[85vh] min-h-[500px] flex items-center justify-center overflow-hidden">
      <img
        src={heroImage}
        alt="Casal"
        className="absolute inset-0 w-full h-full object-cover"
        width={1920}
        height={1080}
      />
      <div
        className="absolute inset-0"
        style={{ background: "var(--hero-overlay)" }}
      />
      <div className="relative z-10 text-center px-4 max-w-3xl mx-auto">
        <h1 className="font-heading text-4xl md:text-6xl lg:text-7xl font-bold text-primary-foreground mb-6 leading-tight animate-fade-in-up">
          {eventTitle}
        </h1>
        <p
          className="font-body text-lg md:text-xl text-primary-foreground/90 mb-10 max-w-xl mx-auto animate-fade-in-up"
          style={{ animationDelay: "0.2s", opacity: 0 }}
        >
          {eventSubtitle}
        </p>
        <div
          className="flex flex-col sm:flex-row gap-4 justify-center animate-fade-in-up"
          style={{ animationDelay: "0.4s", opacity: 0 }}
        >
          <Button
            size="lg"
            className="bg-primary hover:bg-primary/90 text-primary-foreground font-body text-base px-8 py-6 rounded-full gap-2"
            onClick={() =>
              document
                .getElementById("lista")
                ?.scrollIntoView({ behavior: "smooth" })
            }
          >
            <Heart className="w-5 h-5" />
            Ver Lista de Presentes
          </Button>
          <Button
            size="lg"
            variant="outline"
            className="border-primary-foreground/40 text-primary-foreground hover:bg-primary-foreground/10 font-body text-base px-8 py-6 rounded-full"
            onClick={() =>
              document
                .getElementById("rsvp")
                ?.scrollIntoView({ behavior: "smooth" })
            }
          >
            Confirmar Presença
          </Button>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
