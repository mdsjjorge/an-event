import { Check } from "lucide-react";
import type { GiftItem } from "@/types/api";

interface GiftCardProps {
  item: GiftItem;
  selected: boolean;
  onSelect: (item: GiftItem) => void;
}

const GiftCard = ({ item, selected, onSelect }: GiftCardProps) => {
  return (
    <button
      onClick={() => onSelect(item)}
      className={`group relative bg-card rounded-lg overflow-hidden shadow-card hover:shadow-elevated transition-all duration-300 text-left w-full ${
        selected ? "ring-2 ring-primary" : ""
      }`}
    >
      {selected && (
        <div className="absolute top-3 right-3 z-10 w-7 h-7 rounded-full bg-primary flex items-center justify-center">
          <Check className="w-4 h-4 text-primary-foreground" />
        </div>
      )}
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
      <div className="p-4">
        <h3 className="font-heading text-lg font-semibold text-card-foreground">
          {item.name}
        </h3>
        <p className="font-body text-sm text-muted-foreground mt-1 line-clamp-2">
          {item.description}
        </p>
        <p className="font-heading text-xl font-bold text-primary mt-3">
          R$ {item.price.toFixed(2).replace(".", ",")}
        </p>
      </div>
    </button>
  );
};

export default GiftCard;
