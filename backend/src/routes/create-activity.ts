import { FastifyInstance } from "fastify";
import { ZodTypeProvider } from "fastify-type-provider-zod";
import z from "zod";
import { dayjs } from "../lib/dayjs";
import { Prisma } from "../lib/prisma";
import { ClientError } from "../errors/client-error";
export async function createActivity(app: FastifyInstance) {
  app.withTypeProvider<ZodTypeProvider>().post(
    "/trips/:tripId/activities",
    {
      schema: {
        params: z.object({
          tripId: z.string().uuid(),
        }),
        body: z.object({
          title: z.string().min(4),
          occurs_at: z.coerce.date(),
        }),
      },
    },
    async (request) => {
      const { occurs_at, title } = request.body;

      const { tripId } = request.params;

      const trip = await Prisma.trip.findUnique({
        where: { id: tripId },
      });

      if (!trip) {
        throw new ClientError("Trip not found");
      }

      if (dayjs(occurs_at).isBefore(trip.start_at)) {
        throw new ClientError("invalid activity date.");
      }
      if (dayjs(occurs_at).isAfter(trip.ends_at)) {
        throw new ClientError("invalid activity date.");
      }

      const activity = await Prisma.activity.create({
        data: {
          title,
          occurs_at,
          trip_id: tripId,
        },
      });
      return { activityId: activity.id };
    }
  );
}
