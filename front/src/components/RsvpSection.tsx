import { useEffect, useState } from "react";
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
import { createRsvp, getPaymentAccessStatus } from "@/lib/api";
import type { EventContent, PaymentAccessStatus } from "@/types/api";

const PAYMENT_ACCESS_TOKEN_KEY = "an-event-payment-access-token";

interface RsvpSectionProps {
  event: EventContent;
}

const RsvpSection = ({ event }: RsvpSectionProps) => {
  const [name, setName] = useState("");
  const [guests, setGuests] = useState("");
  const [confirmed, setConfirmed] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [accessToken, setAccessToken] = useState("");
  const [paymentStatus, setPaymentStatus] = useState<PaymentAccessStatus | null>(
    null
  );
  const [isCheckingPayment, setIsCheckingPayment] = useState(true);

  useEffect(() => {
    const syncAccessToken = () => {
      const nextToken = localStorage.getItem(PAYMENT_ACCESS_TOKEN_KEY) ?? "";
      setAccessToken(nextToken);
    };

    syncAccessToken();
    window.addEventListener("payment-access-updated", syncAccessToken);

    return () => {
      window.removeEventListener("payment-access-updated", syncAccessToken);
    };
  }, []);

  useEffect(() => {
    let isMounted = true;
    let intervalId: number | null = null;

    const checkStatus = async () => {
      if (!accessToken) {
        if (isMounted) {
          setPaymentStatus(null);
          setIsCheckingPayment(false);
        }
        return;
      }

      try {
        const response = await getPaymentAccessStatus(accessToken);

        if (!isMounted) {
          return;
        }

        setPaymentStatus(response);
        setIsCheckingPayment(false);

        if (response.authorized && intervalId) {
          window.clearInterval(intervalId);
        }
      } catch {
        if (isMounted) {
          setIsCheckingPayment(false);
        }
      }
    };

    setIsCheckingPayment(true);
    void checkStatus();

    if (accessToken) {
      intervalId = window.setInterval(() => {
        void checkStatus();
      }, 5000);
    }

    return () => {
      isMounted = false;

      if (intervalId) {
        window.clearInterval(intervalId);
      }
    };
  }, [accessToken]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      toast.error("Por favor, informe seu nome.");
      return;
    }

    if (!paymentStatus?.authorized || !accessToken) {
      toast.error("O RSVP sera liberado quando o pagamento Pix for aprovado.");
      return;
    }

    try {
      setIsSubmitting(true);
      const guestsCount = guests ? Number(guests) : 0;
      const response = await createRsvp({
        name,
        guests: guestsCount,
        accessToken,
      });
      setConfirmed(true);
      toast.success(response.message);
    } catch (error) {
      toast.error(
        error instanceof Error
          ? error.message
          : "Nao foi possivel confirmar sua presenca."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section id="rsvp" className="py-20 px-4 bg-secondary">
      <div className="mx-auto w-full max-w-lg lg:max-w-[60vw]">
        <div className="text-center mb-10">
          <CalendarHeart className="w-10 h-10 text-primary mx-auto mb-4" />
          <h2 className="font-heading text-3xl md:text-4xl font-bold text-foreground mb-3">
            {event.rsvpTitle}
          </h2>
          <p className="font-body text-muted-foreground">
            {event.rsvpDescription}
          </p>
          <p className="font-body text-sm text-muted-foreground mt-3">
            {!accessToken
              ? "Primeiro realize o pagamento do Pix na lista de presentes para liberar a confirmacao."
              : isCheckingPayment
                ? "Consultando o status do pagamento..."
                : paymentStatus?.authorized
                  ? "Pagamento aprovado. Agora voce pode confirmar presenca."
                  : "Pagamento ainda nao aprovado. Esta tela verifica automaticamente quando o webhook chegar."}
          </p>
        </div>

        {confirmed ? (
          <div className="bg-card rounded-lg p-8 text-center shadow-card animate-fade-in-up">
            <CalendarHeart className="w-12 h-12 text-primary mx-auto mb-4" />
            <h3 className="font-heading text-2xl font-bold text-foreground mb-2">
              Presença Confirmada!
            </h3>
            <p className="font-body text-muted-foreground">
              Obrigado, <strong className="text-foreground">{name}</strong>! Estamos ansiosos para celebrar com voce.
            </p>
          </div>
        ) : !paymentStatus?.authorized ? (
          <div className="rounded-[1.5rem] border border-border bg-card p-8 text-center shadow-card">
            <CalendarHeart className="mx-auto mb-4 h-12 w-12 text-primary" />
            <h3 className="font-heading text-2xl font-bold text-foreground">
              Confirmacao liberada apos o Pix
            </h3>
            <p className="mt-3 font-body text-muted-foreground">
              Assim que o pagamento do presente for aprovado, esta area sera liberada automaticamente para voce confirmar sua presenca.
            </p>
            <Button
              type="button"
              variant="outline"
              className="mt-6 rounded-full"
              onClick={() =>
                document
                  .getElementById("lista")
                  ?.scrollIntoView({ behavior: "smooth" })
              }
            >
              Voltar para a lista de presentes
            </Button>
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
              disabled={isSubmitting || !paymentStatus?.authorized}
              className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-body text-base py-6 rounded-full gap-2"
            >
              <Send className="w-5 h-5" />
              {isSubmitting
                ? "Enviando..."
                : paymentStatus?.authorized
                  ? "Confirmar Presenca"
                  : "Aguardando pagamento Pix"}
            </Button>
          </form>
        )}
      </div>
    </section>
  );
};

export default RsvpSection;
