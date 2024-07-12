import { CircleCheck, CircleDashed, UserCog } from "lucide-react";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Button } from "../../components/button";
import { api } from "../../lib/axios";
import { CreateGuestsModal } from "./create-guests-modal";

interface Participant {
  id: string;
  name: string | null;
  email: string;
  is_confirmed: boolean;
}
export function Guests() {
  const [isCreateGuestsModalOpen, setIsCreateGuestsModalOpen] = useState(false);
  function openCreateGuestsModal() {
    setIsCreateGuestsModalOpen(true);
  }
  function closeCreateGuestsModal() {
    setIsCreateGuestsModalOpen(false);
  }
  const { tripId } = useParams();
  const [participants, setParticipants] = useState<Participant[]>([]);
  useEffect(() => {
    api
      .get(`/trips/${tripId}/participants`)
      .then((response) => setParticipants(response.data.participants));
  }, [tripId]);
  return (
    <div className="space-y-6">
      <h2 className="font-semibold text-xl">Convidados</h2>
      <div className="space-y-5">
        {participants.map((participant, index) => {
          return (
            <div
              key={participant.id}
              className="flex items-center justify-between gap-4"
            >
              <div className="space-y-1.5 ">
                <span className="block font-medium text-zinc-100">
                  {participant.name ?? `Convidado ${index}`}
                </span>
                <span className="block text-sm text-zinc-400 truncate">
                  {participant.email}
                </span>
              </div>
              {participant.is_confirmed ? (
                <CircleCheck className="text-lime-300 size-5 shrink-0" />
              ) : (
                <CircleDashed className="text-zinc-400 size-5 shrink-0" />
              )}
            </div>
          );
        })}
      </div>
      <Button onClick={openCreateGuestsModal} variant="secondary" size="full">
        <UserCog className="size-5" />
        Gerenciar convidados
      </Button>
      {isCreateGuestsModalOpen && (
        <CreateGuestsModal closeCreateGuestsModal={closeCreateGuestsModal} />
      )}
    </div>
  );
}
