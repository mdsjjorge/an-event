import { Gift } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { GiftItem } from "@/types/api";

interface GiftCardProps {
  item: GiftItem;
  onGift: (item: GiftItem) => void;
}

const GiftCard = ({ item, onGift }: GiftCardProps) => {
  return (
    <article className="group overflow-hidden rounded-[1.5rem] border border-border bg-card text-left shadow-card transition-all duration-300 hover:-translate-y-1 hover:shadow-elevated">
      <div className="aspect-square overflow-hidden bg-secondary">
        <img
          src={item.imageUrl}
          alt={item.name}
          loading="lazy"
          width={512}
          height={512}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
      </div>
      <div className="p-5">
        <h3 className="font-heading text-lg font-semibold text-card-foreground">
          {item.name}
        </h3>
        <p className="font-body text-sm text-muted-foreground mt-1 line-clamp-2">
          {item.description}
        </p>
        <div className="mt-5 flex items-center justify-between gap-4">
          <p className="font-heading text-xl font-bold text-primary">
            R$ {item.price.toFixed(2).replace(".", ",")}
          </p>
          <Button
            type="button"
            className="rounded-full px-5"
            onClick={() => onGift(item)}
          >
            <Gift className="mr-2 h-4 w-4" />
            Presentear
          </Button>
        </div>
      </div>
    </article>
  );
};

export default GiftCard;
