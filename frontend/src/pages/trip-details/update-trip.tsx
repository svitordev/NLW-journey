import { format } from "date-fns";
import { Calendar, MapPin, X } from "lucide-react";
import { FormEvent, useEffect, useState } from "react";
import { DateRange, DayPicker } from "react-day-picker";
import { useParams } from "react-router-dom";
import { BoxInput } from "../../components/boxInput";
import { Button } from "../../components/button";
import { Modal } from "../../components/modal";
import { api } from "../../lib/axios";

interface UpdateTripModalProps {
  closeUpdateTripModal: () => void;
}
interface Trip {
  id: string;
  destination: string;
  start_at: string;
  ends_at: string;
  is_confirmed: boolean;
}
export function UpdateTripModal({
  closeUpdateTripModal,
}: UpdateTripModalProps) {
  const [isDatePickerOpen, setIsDatePickerOpen] = useState(false);

  function openDatePicker() {
    return setIsDatePickerOpen(true);
  }
  function closeDatePicker() {
    return setIsDatePickerOpen(false);
  }
  const { tripId } = useParams();
  const [eventStartAndEndDates, setEventStartAndEndDates] = useState<
    DateRange | undefined
  >();

  async function updateTrip(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const data = new FormData(event.currentTarget);
    const destination = data.get("destination")?.toString();
    
    if (!destination) {
      return;
    }
    if (!eventStartAndEndDates?.from || !eventStartAndEndDates?.to) {
      return;
    }
    await api.put(`/trips/${tripId}`, {
      destination,
      start_at: eventStartAndEndDates.from,
      ends_at: eventStartAndEndDates.to,
    });
    window.document.location.reload();
  }

  const [trip, setTrip] = useState<Trip | undefined>();
  useEffect(() => {
    api.get(`/trips/${tripId}`).then((response) => setTrip(response.data.trip));
  }, [tripId]);
  const displayedDatePrevious = trip
    ? format(trip.start_at, "d' de 'LLL")
        .concat(" até ")
        .concat(format(trip.ends_at, "d' de 'LLL"))
    : null;
  const displayedDate =
    eventStartAndEndDates &&
    eventStartAndEndDates.from &&
    eventStartAndEndDates.to
      ? format(eventStartAndEndDates.from, "d' de 'LLL")
          .concat(" até ")
          .concat(format(eventStartAndEndDates.to, "d' de 'LLL"))
      : null;
  return (
    <Modal
      closeModal={closeUpdateTripModal}
      title="Cadastrar atividade"
      paragraph="Todos convidados podem visualizar as atividades."
    >
      <form onSubmit={updateTrip} className="space-y-3">
        <BoxInput>
          <MapPin className="size-5 text-zinc-400" />
          <input
            type="text"
            name="destination"
            placeholder={
              trip?.destination ? trip.destination : "Para onde você vai?"
            }
            className="bg-transparent text-lg placeholder-zinc-400 outline-none flex-1"
          />
        </BoxInput>
        <BoxInput>
          <button
            onClick={openDatePicker}
            className="flex items-center gap-2 text-left w-60"
          >
            <Calendar className="size-5 text-zinc-400" />
            {displayedDate ? (
              <span className=" text-lg text-zinc-100 w-40 flex-1">
                {displayedDate}
              </span>
            ) : (
              <span className=" text-lg text-zinc-400 w-40 flex-1">
                {displayedDatePrevious}
              </span>
            )}
          </button>
        </BoxInput>
        {isDatePickerOpen && (
          <div className="fixed inset-0 bg-black/60 flex items-center justify-center">
            <div className="rounded-xl py-5 px-6 shadow-shape bg-zinc-900 space-y-5">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <h2 className="text-lg font-semibold">Selecione a data</h2>
                  <button type="button" onClick={closeDatePicker}>
                    <X className="size-5 text-zinc-400" />
                  </button>
                </div>
              </div>
              <DayPicker
                mode="range"
                selected={eventStartAndEndDates}
                onSelect={setEventStartAndEndDates}
              />
            </div>
          </div>
        )}

        <Button type="submit" variant="primary" size="full">
          Salvar atividade
        </Button>
      </form>
    </Modal>
  );
}
