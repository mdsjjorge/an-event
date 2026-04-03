import { useState } from "react";
import { Gift } from "lucide-react";
import { Button } from "@/components/ui/button";
import GiftCard from "@/components/GiftCard";
import QrCodeModal from "@/components/QrCodeModal";
import { giftItems, type GiftItem } from "@/data/giftItems";

const GiftList = () => {
  const [selectedItem, setSelectedItem] = useState<GiftItem | null>(null);
  const [showQr, setShowQr] = useState(false);

  const handleSelect = (item: GiftItem) => {
    setSelectedItem(selectedItem?.id === item.id ? null : item);
  };

  const handleSend = () => {
    if (selectedItem) {
      setShowQr(true);
    }
  };

  return (
    <section id="lista" className="py-20 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <Gift className="w-10 h-10 text-primary mx-auto mb-4" />
          <h2 className="font-heading text-3xl md:text-4xl font-bold text-foreground mb-3">
            Lista de Presentes
          </h2>
          <p className="font-body text-muted-foreground max-w-md mx-auto">
            Escolha um item para nos presentear. Ao selecionar, você receberá um QR Code Pix para pagamento.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {giftItems.map((item) => (
            <GiftCard
              key={item.id}
              item={item}
              selected={selectedItem?.id === item.id}
              onSelect={handleSelect}
            />
          ))}
        </div>

        {selectedItem && (
          <div className="mt-10 text-center animate-fade-in-up">
            <Button
              size="lg"
              className="bg-primary hover:bg-primary/90 text-primary-foreground font-body text-base px-10 py-6 rounded-full gap-2"
              onClick={handleSend}
            >
              <Gift className="w-5 h-5" />
              Presentear — R$ {selectedItem.price.toFixed(2).replace(".", ",")}
            </Button>
          </div>
        )}
      </div>

      <QrCodeModal
        open={showQr}
        onClose={() => setShowQr(false)}
        item={selectedItem}
      />
    </section>
  );
};

export default GiftList;
