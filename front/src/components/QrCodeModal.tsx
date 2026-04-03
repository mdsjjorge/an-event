import { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [cpf, setCpf] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [pixData, setPixData] = useState<{
    qrCode: string;
    qrCodeBase64: string;
    ticketUrl: string;
  } | null>(null);

  useEffect(() => {
    if (!open) {
      setFirstName("");
      setLastName("");
      setEmail("");
      setCpf("");
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
      const identificationNumber = cpf.replace(/\D/g, "");

      const response = await createPixPayment({
        transactionAmount: item.price,
        description: item.name,
        payer: {
          email,
          firstName,
          lastName,
          identificationType: "CPF",
          identificationNumber,
        },
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
              <div className="bg-background p-4 rounded-lg">
                <img
                  src={`data:image/png;base64,${pixData.qrCodeBase64}`}
                  alt={`QR Code Pix para ${item.name}`}
                  className="w-[220px] h-[220px] object-contain"
                />
              </div>
              <div className="w-full space-y-2">
                <Label htmlFor="pix-code" className="font-body text-foreground">
                  Codigo Pix copia e cola
                </Label>
                <Input id="pix-code" readOnly value={pixData.qrCode} />
              </div>
              <a
                href={pixData.ticketUrl}
                target="_blank"
                rel="noreferrer"
                className="font-body text-sm text-primary underline"
              >
                Abrir comprovante do Mercado Pago
              </a>
            </div>
          ) : (
            <div className="w-full space-y-4">
              <div className="space-y-2">
                <Label htmlFor="pix-first-name" className="font-body text-foreground">
                  Nome
                </Label>
                <Input
                  id="pix-first-name"
                  value={firstName}
                  onChange={(event) => setFirstName(event.target.value)}
                  placeholder="Seu nome"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="pix-last-name" className="font-body text-foreground">
                  Sobrenome
                </Label>
                <Input
                  id="pix-last-name"
                  value={lastName}
                  onChange={(event) => setLastName(event.target.value)}
                  placeholder="Seu sobrenome"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="pix-email" className="font-body text-foreground">
                  E-mail
                </Label>
                <Input
                  id="pix-email"
                  type="email"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  placeholder="voce@email.com"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="pix-cpf" className="font-body text-foreground">
                  CPF
                </Label>
                <Input
                  id="pix-cpf"
                  value={cpf}
                  onChange={(event) => setCpf(event.target.value)}
                  placeholder="Somente numeros"
                />
              </div>
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
