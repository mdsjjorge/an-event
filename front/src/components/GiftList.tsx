import { useState } from "react";
import { Gift } from "lucide-react";
import GiftCard from "@/components/GiftCard";
import QrCodeModal from "@/components/QrCodeModal";
import type { EventContent, GiftItem } from "@/types/api";

interface GiftListProps {
  items: GiftItem[];
  event: EventContent;
}

const GiftList = ({ items, event }: GiftListProps) => {
  const [selectedItem, setSelectedItem] = useState<GiftItem | null>(null);
  const [showQr, setShowQr] = useState(false);

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
          <p className="font-body text-muted-foreground max-w-md mx-auto">
            {event.giftSectionDescription}
          </p>
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
    </section>
  );
};

export default GiftList;
