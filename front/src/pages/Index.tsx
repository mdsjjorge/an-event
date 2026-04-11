import EventNav from "@/components/EventNav";
import HeroSection from "@/components/HeroSection";
import GiftList from "@/components/GiftList";
import RsvpSection from "@/components/RsvpSection";
import { Heart } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { getEventContent, getGiftItems, getRsvps } from "@/lib/api";

const Index = () => {
  const {
    data: event,
    isLoading: isLoadingEvent,
    error: eventError,
  } = useQuery({
    queryKey: ["event-content"],
    queryFn: getEventContent,
  });

  const {
    data: gifts = [],
    isLoading: isLoadingGifts,
    error: giftsError,
  } = useQuery({
    queryKey: ["gift-items"],
    queryFn: getGiftItems,
  });

  const {
    data: rsvps = [],
    isLoading: isLoadingRsvps,
    error: rsvpsError,
  } = useQuery({
    queryKey: ["rsvps"],
    queryFn: getRsvps,
    refetchInterval: 15000,
  });

  if (isLoadingEvent || isLoadingGifts || isLoadingRsvps) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center px-4">
        <p className="font-body text-muted-foreground">
          Carregando informacoes do evento...
        </p>
      </div>
    );
  }

  if (eventError || giftsError || rsvpsError || !event) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center px-4">
        <p className="font-body text-center text-muted-foreground max-w-md">
          Nao foi possivel carregar os dados do evento. Verifique se o backend esta em execucao.
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <EventNav title={event.navTitle} />
      <HeroSection
        eventTitle={event.eventTitle}
        eventSubtitle={event.eventSubtitle}
      />
      <GiftList items={gifts} event={event} rsvps={rsvps} />
      <RsvpSection event={event} />
      <footer className="py-8 text-center border-t border-border">
        <div className="mx-auto w-full max-w-6xl px-4 lg:max-w-[60vw]">
          <p className="font-body text-sm text-muted-foreground flex items-center justify-center gap-1">
            {event.footerText} <Heart className="w-4 h-4 text-primary fill-current" />
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
