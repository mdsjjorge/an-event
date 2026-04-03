import { QRCodeSVG } from "qrcode.react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import type { GiftItem } from "@/types/api";

interface QrCodeModalProps {
  open: boolean;
  onClose: () => void;
  item: GiftItem | null;
  pixKey: string;
  pixCity: string;
  supportPhone: string;
}

const QrCodeModal = ({
  open,
  onClose,
  item,
  pixKey,
  pixCity,
  supportPhone,
}: QrCodeModalProps) => {
  if (!item) return null;

  const pixPayload = `00020126580014BR.GOV.BCB.PIX01${String(
    pixKey.length + 4
  ).padStart(2, "0")}${pixKey}5204000053039865404${item.price
    .toFixed(2)
    .padStart(6, "0")}5802BR60${String(pixCity.length)
    .padStart(2, "0")}${pixCity}62070503***6304`;

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md bg-card">
        <DialogHeader>
          <DialogTitle className="font-heading text-2xl text-center text-card-foreground">
            QR Code Pix
          </DialogTitle>
          <DialogDescription className="text-center font-body text-muted-foreground">
            Escaneie o código abaixo para presentear com{" "}
            <strong className="text-foreground">{item.name}</strong>
          </DialogDescription>
        </DialogHeader>
        <div className="flex flex-col items-center gap-6 py-6">
          <div className="bg-background p-4 rounded-lg">
            <QRCodeSVG
              value={pixPayload}
              size={220}
              level="M"
              fgColor="hsl(220, 20%, 18%)"
              bgColor="transparent"
            />
          </div>
          <div className="text-center">
            <p className="font-heading text-3xl font-bold text-primary">
              R$ {item.price.toFixed(2).replace(".", ",")}
            </p>
            <p className="font-body text-sm text-muted-foreground mt-1">
              {item.name}
            </p>
          </div>
          <p className="font-body text-xs text-muted-foreground text-center max-w-xs">
            Apos o pagamento, envie o comprovante pelo WhatsApp para confirmarmos o presente: {supportPhone}
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default QrCodeModal;
