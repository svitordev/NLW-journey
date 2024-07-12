import { Link2, Tag } from "lucide-react";
import { FormEvent } from "react";
import { useParams } from "react-router-dom";
import { BoxInput } from "../../components/boxInput";
import { Button } from "../../components/button";
import { Modal } from "../../components/modal";
import { api } from "../../lib/axios";

interface CreateLinkModalProps {
  closeCreateLinkModal: () => void;
}
export function CreateLinkModal({
  closeCreateLinkModal,
}: CreateLinkModalProps) {
  const { tripId } = useParams();
 
  async function createLink(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const data = new FormData(event.currentTarget);

    const title = data.get("title")?.toString();
    const url = data.get("url")?.toString();
    console.log(title, url);
    await api.post(`/trips/${tripId}/links`, {
      title,
      url,
    });
    window.document.location.reload();
  }
  return (
    <Modal
      closeModal={closeCreateLinkModal}
      title="Cadastrar link"
      paragraph="Todos convidados podem visualizar os links importantes."
    >
      <form onSubmit={createLink} className="space-y-3">
        <BoxInput>
          <Tag className="text-zinc-400 size-5" />
          <input
            name="title"
            placeholder="Título do link"
            className="bg-transparent text-lg placeholder-zinc-400 w-40 outline-none flex-1"
          />
        </BoxInput>
        <BoxInput>
          <Link2 className="text-zinc-400 size-5" />
          <input
            name="url"
            placeholder="URL"
            className="bg-transparent text-lg placeholder-zinc-400 w-40 outline-none flex-1"
          />
        </BoxInput>
        <Button type="submit" variant="primary" size="full">
          Salvar link
        </Button>
      </form>
    </Modal>
  );
}
