import { Link2, Plus } from "lucide-react";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Button } from "../../components/button";
import { api } from "../../lib/axios";
import { CreateLinkModal } from "./create-links-modal";
interface Link {
  id: string;
  title: string;
  url: string;
}
export function ImportantLinks() {
  const [isCreateLinkModalOpen, setIsCreateLinkModalOpen] = useState(false);
  function openCreateLinkModal() {
    setIsCreateLinkModalOpen(true);
  }
  function closeCreateLinkModal() {
    setIsCreateLinkModalOpen(false);
  }

  const { tripId } = useParams();
  const [links, setLinks] = useState<Link[]>([]);
  console.log(links);
  useEffect(() => {
    api
      .get(`/trips/${tripId}/links`)
      .then((response) => setLinks(response.data.links));
  }, [tripId]);
  return (
    <div className="space-y-6">
      <h2 className="font-semibold text-xl">Links importantes</h2>
      <div>
        {links.length > 0 ? (
          <div className="space-y-5">
            {links.map((link) => {
              return (
                <div
                  key={link.id}
                  className="flex items-center justify-between gap-4"
                >
                  <div className="space-y-1.5 ">
                    <span className="block font-medium text-zinc-100">
                      {link.title}
                    </span>
                    <a
                      href="#"
                      className="block text-xs text-zinc-400 truncate hover:text-zinc-200"
                    >
                      {link.url}
                    </a>
                  </div>
                  <Link2 className="text-zinc-400 size-5 shrink-0" />
                </div>
              );
            })}
          </div>
        ) : (
          <p className="text-sm text-zinc-500">Nenhuma link cadastrado</p>
        )}
      </div>
      <Button onClick={openCreateLinkModal} variant="secondary" size="full">
        <Plus className="size-5" />
        Cadastrar novo link
      </Button>
      {isCreateLinkModalOpen && (
        <CreateLinkModal closeCreateLinkModal={closeCreateLinkModal} />
      )}
    </div>
  );
}
