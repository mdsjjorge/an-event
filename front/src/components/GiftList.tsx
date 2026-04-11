import { useState } from "react";
import { Gift, Laugh, Users } from "lucide-react";
import GiftCard from "@/components/GiftCard";
import QrCodeModal from "@/components/QrCodeModal";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import type { EventContent, GiftItem, RsvpItem } from "@/types/api";

interface GiftListProps {
  items: GiftItem[];
  event: EventContent;
  rsvps: RsvpItem[];
}

const GiftList = ({ items, event, rsvps }: GiftListProps) => {
  const [selectedItem, setSelectedItem] = useState<GiftItem | null>(null);
  const [showQr, setShowQr] = useState(false);
  const [showConfirmedGuests, setShowConfirmedGuests] = useState(false);

  const totalConfirmedGuests = rsvps.reduce(
    (total, rsvp) => total + 1 + rsvp.guests,
    0
  );

  const handleGift = (item: GiftItem) => {
    setSelectedItem(item);
    setShowQr(true);
  };

  return (
    <section id="lista" className="py-20 px-4">
      <div className="mx-auto w-full max-w-6xl lg:max-w-[60vw]">
        <div className="text-center mb-12">
          <Gift className="w-10 h-10 text-primary mx-auto mb-4" />
          <h2 className="font-heading text-3xl md:text-4xl font-bold text-foreground mb-3">
            {event.giftSectionTitle}
          </h2>
          <p className="font-body text-muted-foreground max-w-2xl mx-auto">
            {event.giftSectionDescription} Aqui voce encontra a chance de participar
            oficialmente da nossa epopeia imobiliaria em estilo "humildade
            cenografica, ambicao de capa de revista e boleto vencendo em silencio".
          </p>
          <div className="mt-6 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <div className="flex items-center gap-3 rounded-2xl border border-border bg-card px-4 py-3 shadow-card">
              <div className="rounded-full bg-primary/10 p-2 text-primary">
                <Users className="h-4 w-4" />
              </div>
              <div className="text-left">
                <p className="font-body text-xs uppercase tracking-[0.2em] text-muted-foreground">
                  Ja confirmados
                </p>
                <p className="font-heading text-lg text-foreground">
                  {totalConfirmedGuests} convidados
                </p>
              </div>
              <Badge variant="secondary" className="rounded-full">
                {rsvps.length} confirma{rsvps.length === 1 ? "cao" : "coes"}
              </Badge>
            </div>
            <Button
              type="button"
              variant="outline"
              className="rounded-full"
              onClick={() => setShowConfirmedGuests(true)}
            >
              <Laugh className="mr-2 h-4 w-4" />
              Ver quem ja caiu nessa
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {items.map((item) => (
            <GiftCard
              key={item.id}
              item={item}
              onGift={handleGift}
            />
          ))}
        </div>
      </div>

      <QrCodeModal
        open={showQr}
        onClose={() => {
          setShowQr(false);
          setSelectedItem(null);
        }}
        item={selectedItem}
        supportPhone={event.supportPhone}
      />

      <Dialog open={showConfirmedGuests} onOpenChange={setShowConfirmedGuests}>
        <DialogContent className="bg-card sm:max-w-lg">
          <DialogHeader>
            <DialogTitle className="font-heading text-2xl text-card-foreground">
              Convidados que ja confirmaram
            </DialogTitle>
            <DialogDescription className="font-body text-muted-foreground">
              Gente que topou prestigiar essa narrativa de superacao premium com
              acabamento de realidade.
            </DialogDescription>
          </DialogHeader>
          <ScrollArea className="max-h-[320px] pr-4">
            <div className="space-y-3">
              {rsvps.length ? (
                rsvps.map((rsvp) => (
                  <div
                    key={rsvp.id}
                    className="flex items-center justify-between rounded-2xl border border-border bg-background/70 px-4 py-3"
                  >
                    <div>
                      <p className="font-body font-medium text-foreground">
                        {rsvp.name}
                      </p>
                      <p className="font-body text-sm text-muted-foreground">
                        {rsvp.guests
                          ? `Levando mais ${rsvp.guests} pessoa${rsvp.guests > 1 ? "s" : ""} para testemunhar essa conquista.`
                          : "Vai solo, como quem confia no proprio julgamento."}
                      </p>
                    </div>
                    <Badge variant="outline" className="rounded-full">
                      {1 + rsvp.guests} total
                    </Badge>
                  </div>
                ))
              ) : (
                <div className="rounded-2xl border border-dashed border-border px-4 py-8 text-center">
                  <p className="font-body text-muted-foreground">
                    Ainda ninguem confirmou. O povo segue observando essa
                    oportunidade historica com cautela.
                  </p>
                </div>
              )}
            </div>
          </ScrollArea>
        </DialogContent>
      </Dialog>
    </section>
  );
};

export default GiftList;
