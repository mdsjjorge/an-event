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
                  Casa nova
                </p>
                <p className="mt-2 font-heading text-3xl font-semibold">
                  Um novo comeco para compartilhar.
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
                Estamos abrindo as portas do nosso novo lar e queremos dividir esse momento com quem fez parte da nossa caminhada.
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
              Um resumo carinhoso dessa nova etapa.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 font-body text-sm leading-7 text-muted-foreground">
            <p>Depois de muito tempo sonhando, finalmente chegou o momento de abrir a porta de um lugar que podemos chamar de nosso.</p>
            <p>Entre plantas rabiscadas, pesquisas de fim de noite e conversas sobre cada detalhe, a ideia da casa nova foi crescendo aos poucos.</p>
            <p>Antes mesmo das chaves chegarem, ja existia um desejo enorme de construir um espaco leve, acolhedor e cheio de memórias.</p>
            <p>Foram meses escolhendo o canto da mesa, imaginando a cor das paredes e decidindo como cada ambiente poderia refletir quem somos.</p>
            <p>Teve expectativa, teve correria e tambem aqueles dias em que parecia que tudo ainda estava longe demais.</p>
            <p>Mas a cada pequena etapa concluida, a casa deixava de ser projeto e passava a ter cheiro de recomeço.</p>
            <p>O que mais emociona nessa fase nao e apenas organizar moveis ou abrir caixas.</p>
            <p>E perceber que cada conquista tem historia, esforco e a presenca de pessoas queridas que caminharam conosco.</p>
            <p>Esse novo lar nasce como um lugar de encontros simples e sinceros.</p>
            <p>Um lugar para o cafe passado sem pressa, para as conversas demoradas e para os domingos em volta da mesa.</p>
            <p>Queremos que a casa tenha vida, risadas e aquela sensacao boa de porta aberta para quem chega com carinho.</p>
            <p>Mais do que paredes novas, estamos celebrando um ciclo inteiro de amadurecimento e parceria.</p>
            <p>Cada detalhe foi pensado para representar aconchego.</p>
            <p>Cada escolha carrega um pouco da nossa personalidade e muito do nosso desejo de receber bem.</p>
            <p>Temos sonhado com uma rotina mais calma, mais bonita e mais cheia de significado.</p>
            <p>Sonhamos com jantares improvisados, visitas inesperadas e pequenos rituais que transformam uma casa em lar.</p>
            <p>Sonhamos com um espaço onde os dias comuns tambem sejam especiais.</p>
            <p>Ao longo do caminho, aprendemos que construir um lar vai muito alem da estrutura.</p>
            <p>Envolve cuidado, presenca, intencao e a vontade de criar um refúgio onde o amor possa morar com tranquilidade.</p>
            <p>Por isso, essa celebracao tem um significado tao especial para nos.</p>
            <p>Ela marca o inicio de uma fase cheia de gratidão e expectativa boa.</p>
            <p>Estamos felizes por poder compartilhar esse momento com pessoas que torcem por nos e fazem parte da nossa historia.</p>
            <p>Cada gesto de carinho ajuda a preencher essa nova casa com afeto desde o primeiro dia.</p>
            <p>Cada presença reforça o quanto essa conquista fica ainda mais bonita quando dividida.</p>
            <p>Preparamos tudo com muito cuidado para que esse encontro tenha a nossa cara.</p>
            <p>Queremos receber voces de forma simples, afetiva e memoravel.</p>
            <p>Queremos brindar as pequenas vitórias que, somadas, nos trouxeram até aqui.</p>
            <p>Queremos olhar ao redor e sentir que essa casa ja começa cheia de boas energias.</p>
            <p>Esse e o tipo de conquista que pede comemoração tranquila, abraços sinceros e muitos desejos bons para o futuro.</p>
            <p>Nos imaginamos enchendo os ambientes com historias novas, rotinas gostosas e projetos que crescem com o tempo.</p>
            <p>E nos anima saber que pessoas queridas farão parte das primeiras lembranças desse lugar.</p>
            <p>Talvez seja isso que mais importa nessa etapa.</p>
            <p>Transformar uma mudança em celebração.</p>
            <p>Transformar um endereço novo em ponto de encontro.</p>
            <p>Transformar um sonho antigo em um presente cheio de vida.</p>
            <p>Estamos começando com o coração aberto e muita vontade de construir dias felizes por aqui.</p>
            <p>Com calma, com afeto e com espaço para tudo aquilo que faz sentido para a nossa vida.</p>
            <p>Se voce chegou ate aqui, ja faz parte dessa historia.</p>
            <p>E por isso queremos agradecer por acompanhar, incentivar e celebrar conosco.</p>
            <p>Essa casa nova representa estabilidade, parceria e o prazer de viver uma nova fase com mais profundidade.</p>
            <p>Representa tambem a beleza dos começos que nascem depois de muito planejamento e paciencia.</p>
            <p>Que ela seja palco de encontros felizes, noites tranquilas e muitos motivos para agradecer.</p>
            <p>Que as paredes guardem lembranças leves.</p>
            <p>Que a cozinha seja cheia de conversa boa.</p>
            <p>Que a sala receba gente querida.</p>
            <p>Que cada canto tenha aconchego.</p>
            <p>Que cada detalhe lembre que valeu a pena esperar.</p>
            <p>Estamos prontos para viver essa nova etapa.</p>
            <p>E mais felizes ainda por poder dividi-la com voce.</p>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default HeroSection;
