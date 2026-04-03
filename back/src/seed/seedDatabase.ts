import { EventModel } from "../models/Event.js";
import { GiftModel } from "../models/Gift.js";
import { defaultEvent, defaultGifts } from "./defaultData.js";

export const seedDatabase = async () => {
  const [eventCount, giftCount] = await Promise.all([
    EventModel.countDocuments(),
    GiftModel.countDocuments(),
  ]);

  if (eventCount === 0) {
    await EventModel.create(defaultEvent);
  }

  if (giftCount === 0) {
    await GiftModel.insertMany(defaultGifts);
    return;
  }

  for (const gift of defaultGifts) {
    await GiftModel.updateMany(
      {
        name: gift.name,
        $or: [{ imageUrl: { $exists: false } }, { imageUrl: "" }],
      },
      {
        $set: {
          description: gift.description,
          price: gift.price,
          imageUrl: gift.imageUrl,
          sortOrder: gift.sortOrder,
          active: true,
        },
        $unset: {
          imageKey: "",
        },
      }
    );
  }
};
