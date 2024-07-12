import { FastifyInstance } from "fastify";
import { ZodTypeProvider } from "fastify-type-provider-zod";
import z from "zod";
import { Prisma } from "../lib/prisma";
import { ClientError } from "../errors/client-error";
export async function createLink(app: FastifyInstance) {
  app.withTypeProvider<ZodTypeProvider>().post(
    "/trips/:tripId/links",
    {
      schema: {
        params: z.object({
          tripId: z.string().uuid(),
        }),
        body: z.object({
          title: z.string().min(4),
          url: z.string().url(),
        }),
      },
    },
    async (request) => {
      const { url, title } = request.body;

      const { tripId } = request.params;

      const trip = await Prisma.trip.findUnique({
        where: { id: tripId },
      });

      if (!trip) {
        throw new ClientError("Trip not found");
      }

      const link = await Prisma.link.create({
        data: {
          title,
          url,
          trip_id: tripId,
        },
      });
      return { linkId: link.id };
    }
  );
}
