import { useState } from "react";
import { CalendarHeart, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";

const RsvpSection = () => {
  const [name, setName] = useState("");
  const [guests, setGuests] = useState("");
  const [confirmed, setConfirmed] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      toast.error("Por favor, informe seu nome.");
      return;
    }
    setConfirmed(true);
    toast.success("Presença confirmada! Obrigado 💚");
  };

  return (
    <section id="rsvp" className="py-20 px-4 bg-secondary">
      <div className="max-w-lg mx-auto">
        <div className="text-center mb-10">
          <CalendarHeart className="w-10 h-10 text-primary mx-auto mb-4" />
          <h2 className="font-heading text-3xl md:text-4xl font-bold text-foreground mb-3">
            Confirmar Presença
          </h2>
          <p className="font-body text-muted-foreground">
            Confirme sua presença para que possamos preparar tudo com carinho.
          </p>
        </div>

        {confirmed ? (
          <div className="bg-card rounded-lg p-8 text-center shadow-card animate-fade-in-up">
            <CalendarHeart className="w-12 h-12 text-primary mx-auto mb-4" />
            <h3 className="font-heading text-2xl font-bold text-foreground mb-2">
              Presença Confirmada!
            </h3>
            <p className="font-body text-muted-foreground">
              Obrigado, <strong className="text-foreground">{name}</strong>! Estamos ansiosos para celebrar com você.
            </p>
          </div>
        ) : (
          <form
            onSubmit={handleSubmit}
            className="bg-card rounded-lg p-8 shadow-card space-y-5"
          >
            <div className="space-y-2">
              <Label htmlFor="name" className="font-body text-foreground">
                Seu Nome
              </Label>
              <Input
                id="name"
                placeholder="Digite seu nome completo"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="font-body"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="guests" className="font-body text-foreground">
                Quantos acompanhantes?
              </Label>
              <Select value={guests} onValueChange={setGuests}>
                <SelectTrigger className="font-body">
                  <SelectValue placeholder="Selecione" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="0">Somente eu</SelectItem>
                  <SelectItem value="1">+1 acompanhante</SelectItem>
                  <SelectItem value="2">+2 acompanhantes</SelectItem>
                  <SelectItem value="3">+3 acompanhantes</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <Button
              type="submit"
              size="lg"
              className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-body text-base py-6 rounded-full gap-2"
            >
              <Send className="w-5 h-5" />
              Confirmar Presença
            </Button>
          </form>
        )}
      </div>
    </section>
  );
};

export default RsvpSection;
