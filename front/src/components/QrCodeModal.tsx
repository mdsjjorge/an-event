import { useEffect, useState } from "react";
import { QRCodeSVG } from "qrcode.react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { createPixPayment } from "@/lib/api";
import type { GiftItem } from "@/types/api";

interface QrCodeModalProps {
  open: boolean;
  onClose: () => void;
  item: GiftItem | null;
  supportPhone: string;
}

const QrCodeModal = ({
  open,
  onClose,
  item,
  supportPhone,
}: QrCodeModalProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [pixData, setPixData] = useState<{
    qrMode: "static" | "dynamic" | "hybrid";
    qrData: string | null;
    usesStaticPosQr: boolean;
    staticQrConfigured: boolean;
    instructions: string;
    ticketUrl: string | null;
  } | null>(null);

  useEffect(() => {
    if (!open) {
      setIsLoading(false);
      setError(null);
      setPixData(null);
    }
  }, [open]);

  if (!item) return null;

  const handleGeneratePix = async () => {
    try {
      setIsLoading(true);
      setError(null);

      const response = await createPixPayment({
        giftId: item.id,
      });

      setPixData(response);
    } catch (requestError) {
      setError(
        requestError instanceof Error
          ? requestError.message
          : "Nao foi possivel gerar o Pix."
      );
    } finally {
      setIsLoading(false);
    }
  };

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
          {pixData ? (
            <div className="flex flex-col items-center gap-6 w-full">
              {pixData.qrData ? (
                <div className="bg-background p-4 rounded-lg">
                  <QRCodeSVG
                    value={pixData.qrData}
                    size={220}
                    level="M"
                    fgColor="hsl(220, 20%, 18%)"
                    bgColor="transparent"
                  />
                </div>
              ) : null}
              <p className="font-body text-sm text-muted-foreground text-center">
                {pixData.instructions}
              </p>
              {pixData.usesStaticPosQr && !pixData.staticQrConfigured ? (
                <p className="font-body text-sm text-destructive text-center">
                  Configure `MP_STATIC_QR_DATA` no backend com o QR do caixa para exibir o QR estatico aqui.
                </p>
              ) : null}
              {pixData.ticketUrl ? (
                <a
                  href={pixData.ticketUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="font-body text-sm text-primary underline"
                >
                  Abrir comprovante do Mercado Pago
                </a>
              ) : null}
            </div>
          ) : (
            <div className="w-full space-y-4">
              <p className="font-body text-sm text-muted-foreground text-center">
                Gere uma order Pix no Mercado Pago para este presente.
              </p>
              {error ? (
                <p className="font-body text-sm text-destructive">{error}</p>
              ) : null}
              <Button
                type="button"
                className="w-full"
                disabled={isLoading}
                onClick={handleGeneratePix}
              >
                {isLoading ? "Gerando Pix..." : "Gerar Pix no Mercado Pago"}
              </Button>
            </div>
          )}
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
