import giftBlender from "@/assets/gift-blender.jpg";
import giftBedset from "@/assets/gift-bedset.jpg";
import giftAirfryer from "@/assets/gift-airfryer.jpg";
import giftCoffeemaker from "@/assets/gift-coffeemaker.jpg";
import giftPlates from "@/assets/gift-plates.jpg";
import giftVacuum from "@/assets/gift-vacuum.jpg";

export interface GiftItem {
  id: string;
  name: string;
  description: string;
  price: number;
  image: string;
}

export const giftItems: GiftItem[] = [
  {
    id: "1",
    name: "Liquidificador",
    description: "Liquidificador inox de alta potência, perfeito para o dia a dia na cozinha.",
    price: 189.9,
    image: giftBlender,
  },
  {
    id: "2",
    name: "Jogo de Cama",
    description: "Jogo de cama queen 400 fios, macio e elegante em algodão egípcio.",
    price: 299.9,
    image: giftBedset,
  },
  {
    id: "3",
    name: "Air Fryer",
    description: "Fritadeira elétrica sem óleo 4.2L, ideal para receitas saudáveis.",
    price: 449.9,
    image: giftAirfryer,
  },
  {
    id: "4",
    name: "Cafeteira",
    description: "Cafeteira elétrica programável com jarra de vidro e filtro permanente.",
    price: 259.9,
    image: giftCoffeemaker,
  },
  {
    id: "5",
    name: "Jogo de Pratos",
    description: "Aparelho de jantar em porcelana com 20 peças, design clássico.",
    price: 349.9,
    image: giftPlates,
  },
  {
    id: "6",
    name: "Aspirador Robô",
    description: "Aspirador robô inteligente com mapeamento e controle via app.",
    price: 899.9,
    image: giftVacuum,
  },
];
