import { FastifyInstance } from "fastify";
import { ZodTypeProvider } from "fastify-type-provider-zod";
import z from "zod";
import { Prisma } from "../lib/prisma";
import { ClientError } from "../errors/client-error";
export async function getTripDetails(app: FastifyInstance) {
  app.withTypeProvider<ZodTypeProvider>().get(
    "/trips/:tripId",
    {
      schema: {
        params: z.object({
          tripId: z.string().uuid(),
        }),
      },
    },
    async (request) => {
      const { tripId } = request.params;

      const trip = await Prisma.trip.findUnique({
        select: {
          id: true,
          destination: true,
          start_at: true,
          ends_at: true,
          is_confirmed: true,
        },
        where: { id: tripId },
      });

      if (!trip) {
        throw new ClientError("Trip not found");
      }

      return { trip };
    }
  );
}
