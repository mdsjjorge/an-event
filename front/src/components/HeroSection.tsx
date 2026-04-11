import { Heart, Home, ScrollText } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import heroImage from "@/assets/casa_nova.png";

interface HeroSectionProps {
  eventTitle: string;
  eventSubtitle: string;
}

const HeroSection = ({ eventTitle, eventSubtitle }: HeroSectionProps) => {
  const [isStoryOpen, setIsStoryOpen] = useState(false);

  return (
    <>
      <section className="px-4 pb-16 pt-24 md:pb-24 md:pt-32">
        <div className="mx-auto w-full max-w-6xl lg:max-w-[60vw]">
          <div className="grid items-stretch gap-6 lg:grid-cols-[40%_1fr]">
            <div className="relative overflow-hidden rounded-[2rem] bg-secondary shadow-elevated min-h-[320px] lg:min-h-[520px]">
              <img
                src={heroImage}
                alt="Casal"
                className="absolute inset-0 h-full w-full object-cover"
                width={1920}
                height={1080}
              />
              <div
                className="absolute inset-0"
                style={{
                  background:
                    "linear-gradient(180deg, hsla(220, 20%, 10%, 0.08) 0%, hsla(220, 20%, 10%, 0.22) 100%)",
                }}
              />
              <div className="absolute inset-x-0 bottom-0 p-6 text-primary-foreground">
                <p className="font-body text-sm uppercase tracking-[0.28em] text-primary-foreground/80">
                  Projeto luxo raiz
                </p>
                <p className="mt-2 font-heading text-3xl font-semibold">
                  Um monumento a superacao com acabamento de humilde vencedor.
                </p>
              </div>
            </div>

            <div className="flex flex-col justify-center rounded-[2rem] border border-border bg-card p-8 shadow-card md:p-10 lg:p-12">
              <div className="mb-5 inline-flex w-fit items-center gap-2 rounded-full bg-primary/10 px-4 py-2 text-sm text-primary">
                <Home className="h-4 w-4" />
                Celebracao de casa nova
              </div>
              <h1 className="font-heading text-4xl font-bold leading-tight text-foreground md:text-5xl lg:text-6xl">
                {eventTitle}
              </h1>
              <p className="mt-5 max-w-2xl font-body text-base leading-7 text-muted-foreground md:text-lg">
                {eventSubtitle}
              </p>
              <p className="mt-4 max-w-2xl font-body text-base leading-7 text-muted-foreground">
                Venha fazer parte dessa conquista tambem: um espetaculo visual em
                que a foto entrega palafita premium, mas o discurso promete
                legado, sucesso, resiliencia e uma trajetoria digna de documentario
                motivacional patrocinado por parcelamento em 12 vezes.
              </p>
              <p className="mt-4 max-w-2xl font-body text-base leading-7 text-muted-foreground">
                A proposta e simples: voce entra com o carinho, o Pix e o senso
                de humor; nos entramos com a narrativa grandiosa de quem venceu
                tudo, inclusive a decoracao provisoria e o reboco emocional.
              </p>
              <div className="mt-8 flex flex-col gap-4 sm:flex-row">
                <Button
                  size="lg"
                  variant="outline"
                  className="gap-2 rounded-full px-8 py-6"
                  onClick={() => setIsStoryOpen(true)}
                >
                  <ScrollText className="h-5 w-5" />
                  Historia
                </Button>
                <Button
                  size="lg"
                  className="gap-2 rounded-full px-8 py-6"
                  onClick={() =>
                    document
                      .getElementById("lista")
                      ?.scrollIntoView({ behavior: "smooth" })
                  }
                >
                  <Heart className="h-5 w-5" />
                  Ver lista de presentes
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Dialog open={isStoryOpen} onOpenChange={setIsStoryOpen}>
        <DialogContent className="max-h-[85vh] overflow-y-auto bg-card sm:max-w-3xl">
          <DialogHeader>
            <DialogTitle className="font-heading text-3xl text-card-foreground">
              Nossa historia com a casa nova
            </DialogTitle>
            <DialogDescription className="font-body text-base text-muted-foreground">
              Um resumo dramaticamente inspirador dessa fase de luxo conceitual.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 font-body text-sm leading-7 text-muted-foreground">
            <p>Depois de muito sonhar, pesquisar, recalcular e fingir maturidade financeira, finalmente chegamos ao ponto de chamar um teto de projeto de vida.</p>
            <p>A foto pode sugerir "simplicidade estrategica", mas preferimos enxergar como uma estetica documental de quem venceu sem perder a dramaticidade.</p>
            <p>Cada parede dessa jornada foi levantada com esforco, expectativa e aquele classico pensamento: "isso aqui vai virar um lar ou uma licao?"</p>
            <p>No meio do caminho teve planilha, teve ansiedade, teve otimismo irresponsavel e teve a conviccao de que alguma hora tudo ficaria minimamente apresentavel.</p>
            <p>Agora chegou a fase mais nobre de toda conquista: convidar pessoas queridas para admirar o resultado e, se possivel, financiar simbolicamente o brilho dessa operacao.</p>
            <p>Nosso sonho e simples: transformar esse cenario de superacao cenica em um lar funcional, acolhedor e menos dependente da boa vontade dos amigos.</p>
            <p>Queremos cafe passado, conversa boa, sala cheia e a liberdade de dizer "foi dificil, mas olha como ficou conceitual".</p>
            <p>Se voce esta lendo isso, ja e parte da plateia VIP dessa grande narrativa de sucesso com toques de improviso e bom humor.</p>
            <p>Obrigado por acompanhar, rir com a gente e considerar seriamente participar dessa conquista com a ferramenta mais poderosa do afeto moderno: o Pix.</p>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default HeroSection;
