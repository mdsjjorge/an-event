import { Heart } from "lucide-react";

const EventNav = () => {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-md border-b border-border/50">
      <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
        <a href="#" className="flex items-center gap-2 text-primary">
          <Heart className="w-5 h-5 fill-current" />
          <span className="font-heading text-lg font-semibold text-foreground">
            Nosso Evento
          </span>
        </a>
        <div className="hidden sm:flex items-center gap-8">
          <a
            href="#lista"
            className="font-body text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            Presentes
          </a>
          <a
            href="#rsvp"
            className="font-body text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            Confirmar Presença
          </a>
        </div>
      </div>
    </nav>
  );
};

export default EventNav;
