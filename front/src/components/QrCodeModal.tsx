import { useEffect, useState } from "react";
import { QRCodeSVG } from "qrcode.react";
import { CheckCircle2, Copy, LoaderCircle } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { createPixPayment, getPaymentAccessStatus } from "@/lib/api";
import type { GiftItem, PaymentAccessStatus } from "@/types/api";
import { toast } from "sonner";

const PAYMENT_ACCESS_TOKEN_KEY = "an-event-payment-access-token";

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
    accessToken: string;
    qrMode: "static" | "dynamic" | "hybrid";
    qrData: string | null;
    usesStaticPosQr: boolean;
    staticQrConfigured: boolean;
    instructions: string;
    ticketUrl: string | null;
  } | null>(null);
  const [paymentStatus, setPaymentStatus] = useState<PaymentAccessStatus | null>(
    null
  );
  const [hasAnnouncedApproval, setHasAnnouncedApproval] = useState(false);

  const amountReaction = (() => {
    if (!item) {
      return "";
    }

    if (item.price < 20) {
      return "Abaixo de R$ 20 e com coragem de olhar no espelho. Isso nao e contribuicao, e uma assinatura premium do clube dos pao-duro.";
    }

    if (item.price < 50) {
      return "Entre R$ 20 e R$ 49,99: o famoso gesto de carinho com freio de mao puxado. Nao chega a ser mesquinharia, mas flerta perigosamente.";
    }

    if (item.price > 200) {
      return "Acima de R$ 200 voce nao e convidado, e patrocinador oficial da nossa saga. Estamos a um passo de erguer um busto seu na sala.";
    }

    return "Valor equilibrado: nem mao de vaca, nem personagem bilionario. Um cidadao funcional contribuindo para a historia.";
  })();

  useEffect(() => {
    if (!open) {
      setIsLoading(false);
      setError(null);
      setPixData(null);
      setPaymentStatus(null);
      setHasAnnouncedApproval(false);
    }
  }, [open]);

  useEffect(() => {
    if (!open || !pixData?.accessToken) {
      return;
    }

    let isMounted = true;
    let intervalId: number | null = null;

    const checkStatus = async () => {
      try {
        const response = await getPaymentAccessStatus(pixData.accessToken);

        if (!isMounted) {
          return;
        }

        setPaymentStatus(response);
        window.dispatchEvent(new Event("payment-access-updated"));

        if (response.authorized && !hasAnnouncedApproval) {
          setHasAnnouncedApproval(true);
        }

        if (response.authorized && intervalId) {
          window.clearInterval(intervalId);
        }
      } catch {
        if (isMounted) {
          setPaymentStatus(null);
        }
      }
    };

    void checkStatus();
    intervalId = window.setInterval(() => {
      void checkStatus();
    }, 3000);

    return () => {
      isMounted = false;

      if (intervalId) {
        window.clearInterval(intervalId);
      }
    };
  }, [hasAnnouncedApproval, open, pixData?.accessToken]);

  if (!item) return null;

  const handleGoToRsvp = () => {
    onClose();
    document.getElementById("rsvp")?.scrollIntoView({ behavior: "smooth" });
  };

  const handleGeneratePix = async () => {
    try {
      setIsLoading(true);
      setError(null);

      const response = await createPixPayment({
        giftId: item.id,
      });

      localStorage.setItem(PAYMENT_ACCESS_TOKEN_KEY, response.accessToken);
      window.dispatchEvent(new Event("payment-access-updated"));
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

  const handleCopyPix = async () => {
    if (!pixData?.qrData) {
      return;
    }

    try {
      await navigator.clipboard.writeText(pixData.qrData);
      toast.success("Pix copia e cola copiado para a area de transferencia.");
    } catch {
      toast.error("Nao foi possivel copiar o codigo Pix.");
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
              {pixData.qrData ? (
                <Button
                  type="button"
                  variant="outline"
                  className="w-full"
                  onClick={handleCopyPix}
                >
                  <Copy className="mr-2 h-4 w-4" />
                  Copiar Pix copia e cola
                </Button>
              ) : null}
              <div className="w-full rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-center text-amber-950">
                <p className="font-body text-sm">{amountReaction}</p>
              </div>
              {paymentStatus?.authorized ? (
                <div className="w-full rounded-lg border border-primary/30 bg-primary/10 p-4 text-center">
                  <CheckCircle2 className="mx-auto mb-2 h-8 w-8 text-primary" />
                  <p className="font-body text-sm font-semibold text-foreground">
                    Pagamento recebido com sucesso.
                  </p>
                  <p className="font-body text-sm text-muted-foreground">
                    O botao de confirmar presenca ja foi liberado abaixo na pagina.
                  </p>
                  <Button
                    type="button"
                    className="mt-4 w-full"
                    onClick={handleGoToRsvp}
                  >
                    Ir para confirmar presenca
                  </Button>
                </div>
              ) : (
                <div className="flex w-full items-center justify-center gap-2 rounded-lg border border-border bg-background/60 p-3">
                  <LoaderCircle className="h-4 w-4 animate-spin text-muted-foreground" />
                  <p className="font-body text-sm text-muted-foreground">
                    Aguardando confirmacao do pagamento pelo webhook...
                  </p>
                </div>
              )}
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
                Gere uma order Pix no Mercado Pago para este presente e desbloqueie
                sua participacao oficial nesse marco da ascensao domestica.
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
            Assim que o Mercado Pago confirmar o pagamento via webhook, a confirmacao de presenca sera liberada automaticamente. Se precisar de ajuda, fale no WhatsApp: {supportPhone}
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default QrCodeModal;
