import { Calendar, Tag } from "lucide-react";
import { FormEvent } from "react";
import { useParams } from "react-router-dom";
import { Button } from "../../components/button";
import { BoxInput } from "../../components/boxInput";
import { Modal } from "../../components/modal";
import { api } from "../../lib/axios";

interface CreateActivityModalProps {
  closeCreateActivityModal: () => void;
}
export function CreateActivityModal({
  closeCreateActivityModal,
}: CreateActivityModalProps) {
  const { tripId } = useParams();

  async function createActivity(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const data = new FormData(event.currentTarget);

    const title = data.get("title")?.toString();
    const occurs_at = data.get("occurs_at")?.toString();

    await api.post(`/trips/${tripId}/activities`, {
      title,
      occurs_at,
    });
    window.document.location.reload();
  }
  return (
    <Modal
      closeModal={closeCreateActivityModal}
      title="Cadastrar atividade"
      paragraph="Todos convidados podem visualizar as atividades."
    >
      <form onSubmit={createActivity} className="space-y-3">
        <BoxInput>
          <Tag className="text-zinc-400 size-5" />
          <input
            name="title"
            placeholder="Qual a atividade?"
            className="bg-transparent text-lg placeholder-zinc-400 w-40 outline-none flex-1"
          />
        </BoxInput>
        <BoxInput>
          <Calendar className="text-zinc-400 size-5" />
          <input
            type="datetime-local"
            name="occurs_at"
            placeholder="Data e horário da atividade"
            className="bg-transparent text-lg placeholder-zinc-400 w-40 outline-none flex-1"
          />
        </BoxInput>
        <Button type="submit" variant="primary" size="full">
          Salvar atividade
        </Button>
      </form>
    </Modal>
  );
}
