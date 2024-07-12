import { AtSign } from "lucide-react";
import { FormEvent } from "react";
import { useParams } from "react-router-dom";
import { BoxInput } from "../../components/boxInput";
import { Button } from "../../components/button";
import { Modal } from "../../components/modal";
import { api } from "../../lib/axios";

interface CreateGuestsModalProps {
  closeCreateGuestsModal: () => void;
}
export function CreateGuestsModal({
  closeCreateGuestsModal,
}: CreateGuestsModalProps) {
  const { tripId } = useParams();

  async function createGuests(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const data = new FormData(event.currentTarget);

    const email = data.get("email")?.toString();
    console.log(email);
    await api.post(`/trips/${tripId}/invites`, {
      email,
    });
    window.document.location.reload();
  }
  return (
    <Modal
      closeModal={closeCreateGuestsModal}
      title="Convidar mais convidados"
      paragraph="Convide mais pessoas para ter essa experiência incrível com você."
    >
      <form onSubmit={createGuests} className="space-y-3">
        <BoxInput>
          <AtSign className="text-zinc-400 size-5" />
          <input
            type="email"
            name="email"
            placeholder="Qual o e-mail da pessoa?"
            className="bg-transparent text-lg placeholder-zinc-400 w-40 outline-none flex-1"
          />
        </BoxInput>
        <Button type="submit" variant="primary" size="full">
          Convidar
        </Button>
      </form>
    </Modal>
  );
}
