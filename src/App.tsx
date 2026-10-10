import { FormEvent, ReactNode, useEffect, useMemo, useState } from "react";

type Service = {
  id: string;
  name: string;
  detail: string;
  price: number;
};

type Period = "Manhã" | "Tarde";

const services: Service[] = [
  { id: "apt-rooms", name: "Apartamento", detail: "1 banheiro ", price: 220 },
  { id: "apt-bedrooms", name: "Apartamento", detail: "2 banheiros", price: 250 },
  { id: "house-rooms", name: "pós obra", detail: "", price: 320 },
  { id: "large", name: "casa dois andar / Sítio", detail: "Ambientes amplos", price: 350 },
];

const periods: { label: Period; time: string }[] = [
  { label: "Manhã", time: "08h às 12h" },
  { label: "Tarde", time: "13h às 18h" },
];

const heroImage =
  "https://images.unsplash.com/photo-1638885930125-85350348d266?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxicmlnaHQlMjBjbGVhbiUyMG1vZGVybiUyMGxpdmluZyUyMHJvb20lMjB3aGl0ZSUyMGludGVyaW9yJTIwc3VubGlnaHQlMjB0aWR5JTIwaG9tZXxlbnwxfHx8fDE3OTE1NjkwNjZ8MA&ixlib=rb-4.1.0&q=85&w=1800";

function Icon({
  children,
  className = "size-5",
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      {children}
    </svg>
  );
}

function formatCurrency(value: number) {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(value);
}

function dateKey(date: Date) {
  return date.toISOString().slice(0, 10);
}

function getAvailableDates() {
  const dates: Date[] = [];
  const today = new Date();
  today.setHours(12, 0, 0, 0);
  const end = new Date(today);
  end.setMonth(end.getMonth() + 1);

  const cursor = new Date(today);
  cursor.setDate(cursor.getDate() + 1);
  while (cursor <= end) {
    const weekday = cursor.getDay();
    if (weekday >= 1 && weekday <= 5) dates.push(new Date(cursor));
    cursor.setDate(cursor.getDate() + 1);
  }
  return dates;
}

function App() {
  const dates = useMemo(getAvailableDates, []);
  const [service, setService] = useState<Service | null>(null);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [period, setPeriod] = useState<Period | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [form, setForm] = useState({ name: "", phone: "", address: "" });
  const [bookedSlots, setBookedSlots] = useState<string[]>(() => {
    try {
      return JSON.parse(localStorage.getItem("vinhas-xavier-booked") || "[]");
    } catch {
      return [];
    }
  });

  const selectedSlot =
    selectedDate && period ? `${dateKey(selectedDate)}-${period}` : "";

  useEffect(() => {
    if (service && selectedDate && period) setShowForm(true);
  }, [service, selectedDate, period]);

  useEffect(() => {
    document.body.style.overflow = showForm || showConfirmation ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [showForm, showConfirmation]);

  const selectService = (item: Service) => {
    setService(item);
    document
      .getElementById("agenda")
      ?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const selectDate = (date: Date) => {
    setSelectedDate(date);
    setPeriod(null);
  };

  const submitBooking = (event: FormEvent) => {
    event.preventDefault();
    if (!service || !selectedDate || !period) return;

    const nextBooked = Array.from(new Set([...bookedSlots, selectedSlot]));
    setBookedSlots(nextBooked);
    localStorage.setItem("vinhas-xavier-booked", JSON.stringify(nextBooked));
    setShowForm(false);
    setShowConfirmation(true);
  };

  const whatsappUrl = useMemo(() => {
    if (!service || !selectedDate || !period) return "";
    const fullDate = selectedDate.toLocaleDateString("pt-BR", {
      weekday: "long",
      day: "2-digit",
      month: "long",
      year: "numeric",
    });
    const chosenPeriod = periods.find((item) => item.label === period);
    const message = [
      "Olá, Vinhas & Xavier! Gostaria de confirmar meu agendamento:",
      "",
      `Serviço: ${service.name} — ${service.detail}`,
      `Valor: ${formatCurrency(service.price)}`,
      `Data: ${fullDate}`,
      `Período: ${period} (${chosenPeriod?.time})`,
      `Nome: ${form.name}`,
      `WhatsApp: ${form.phone}`,
      `Endereço: ${form.address}`,
      "",
      "Aguardo a confirmação. Obrigado(a)!",
    ].join("\n");
    return `https://wa.me/5511972926909?text=${encodeURIComponent(message)}`;
  }, [service, selectedDate, period, form]);

  return (
    <main className="min-h-screen overflow-hidden bg-[#f7faf9] text-[#153c3e]">
      <section className="relative min-h-[100svh]">
        <img
          src={heroImage}
          alt="Sala de estar clara, organizada e acolhedora"
          className="absolute inset-0 h-full w-full object-cover object-center"
        />
        <div className="hero-overlay absolute inset-0" />

        <nav className="relative z-10 mx-auto flex max-w-7xl items-center justify-between px-6 py-7 lg:px-10">
          <a href="#" className="group flex items-center gap-3 text-white">
            <span className="grid size-11 place-items-center rounded-full border border-white/40 backdrop-blur-sm">
              <Icon className="size-5">
                <path d="m12 3 .8 2.6a5 5 0 0 0 3.3 3.3l2.6.8-2.6.8a5 5 0 0 0-3.3 3.3l-.8 2.6-.8-2.6a5 5 0 0 0-3.3-3.3l-2.6-.8 2.6-.8a5 5 0 0 0 3.3-3.3L12 3Z" />
                <path d="m18.5 15 .4 1.3a2.7 2.7 0 0 0 1.8 1.8l1.3.4-1.3.4a2.7 2.7 0 0 0-1.8 1.8l-.4 1.3-.4-1.3a2.7 2.7 0 0 0-1.8-1.8l-1.3-.4 1.3-.4a2.7 2.7 0 0 0 1.8-1.8l.4-1.3Z" />
              </Icon>
            </span>
            <span className="leading-none">
              <span className="block font-display text-2xl tracking-tight">
                Vinhas & Xavier
              </span>
              <span className="mt-1 block text-[9px] font-bold uppercase tracking-[0.28em] text-white/75">
                Limpeza residencial
              </span>
            </span>
          </a>
          <a
            href="#servicos"
            className="hidden items-center gap-2 border-b border-white/60 pb-1 text-sm font-semibold text-white transition hover:border-white md:flex"
          >
            Ver serviços
            <Icon className="size-4">
              <path d="M5 12h14M13 6l6 6-6 6" />
            </Icon>
          </a>
        </nav>

        <div className="relative z-10 mx-auto flex min-h-[calc(100svh-108px)] max-w-7xl items-center px-6 pb-20 lg:px-10">
          <div className="max-w-3xl">
            <p className="mb-5 flex items-center gap-3 text-xs font-bold uppercase tracking-[0.22em] text-white/85">
              <span className="h-px w-10 bg-white/70" />
              Cuidado que transforma
            </p>
            <h1 className="max-w-3xl font-display text-[clamp(3rem,7.4vw,7rem)] leading-[0.92] tracking-[-0.04em] text-white">
              Sua casa impecável sem você ter que{" "}
              <span className="italic text-[#c8e2dc]">mover um dedo.</span>
            </h1>
            <p className="mt-7 max-w-xl text-base leading-7 text-white/85 md:text-lg">
              Limpeza profissional, pontual e feita com atenção aos detalhes.
              Você escolhe o melhor dia; nós cuidamos de todo o resto.
            </p>
            <a
              href="#servicos"
              className="mt-9 inline-flex items-center gap-4 rounded-full bg-white px-7 py-4 text-sm font-extrabold text-[#0d4d50] shadow-2xl shadow-[#082f31]/20 transition hover:-translate-y-1 hover:bg-[#e8f2ef]"
            >
              Agendar minha limpeza agora
              <span className="grid size-8 place-items-center rounded-full bg-[#0d4d50] text-white">
                <Icon className="size-4">
                  <path d="M5 12h14M13 6l6 6-6 6" />
                </Icon>
              </span>
            </a>
          </div>
        </div>

        <div className="absolute bottom-7 right-8 z-10 hidden items-center gap-3 text-xs font-medium text-white/70 md:flex">
          <span>Role para descobrir</span>
          <span className="h-8 w-px bg-white/35" />
        </div>
      </section>

      <section id="servicos" className="scroll-mt-4 px-6 py-24 lg:px-10 lg:py-32">
        <div className="mx-auto max-w-7xl">
          <div className="grid gap-8 lg:grid-cols-[1fr_1.2fr] lg:items-end">
            <div>
              <p className="eyebrow">01 — Escolha seu serviço</p>
              <h2 className="mt-5 max-w-xl font-display text-5xl leading-[1.03] tracking-tight text-[#123f42] md:text-6xl">
                Tudo limpo.{" "}
                <span className="italic text-[#518581]">Sem surpresas.</span>
              </h2>
            </div>
            <p className="max-w-lg text-base leading-7 text-[#5f7574] lg:ml-auto">
              Valores transparentes para você decidir com tranquilidade.
              Escolha o tipo de imóvel e, em seguida, reserve seu melhor horário.
            </p>
          </div>

          <div className="mt-14 grid border-y border-[#cfdedb] md:grid-cols-2 lg:grid-cols-4">
            {services.map((item, index) => (
              <article
                key={item.id}
                className={`group relative flex min-h-72 flex-col justify-between px-6 py-8 transition duration-300 hover:bg-[#e8f2ef] ${
                  index < services.length - 1
                    ? "border-b border-[#cfdedb] md:border-r lg:border-b-0"
                    : ""
                } ${index === 1 ? "md:border-r-0 lg:border-r" : ""} ${
                  index === 2 ? "md:border-b-0" : ""
                }`}
              >
                <div>
                  <span className="text-xs font-bold tracking-[0.18em] text-[#78918e]">
                    0{index + 1}
                  </span>
                  <h3 className="mt-8 font-display text-3xl text-[#123f42]">
                    {item.name}
                  </h3>
                  <p className="mt-2 text-sm text-[#718583]">{item.detail}</p>
                </div>
                <div className="mt-8">
                  <p className="font-display text-3xl font-semibold text-[#0d5558]">
                    {formatCurrency(item.price)}
                  </p>
                  <button
                    type="button"
                    onClick={() => selectService(item)}
                    className={`mt-5 flex w-full items-center justify-between rounded-full border px-5 py-3 text-sm font-bold transition ${
                      service?.id === item.id
                        ? "border-[#0d5558] bg-[#0d5558] text-white"
                        : "border-[#95aeab] text-[#164f51] hover:border-[#0d5558] hover:bg-white"
                    }`}
                  >
                    {service?.id === item.id ? "Selecionado" : "Selecionar"}
                    <Icon className="size-4">
                      {service?.id === item.id ? (
                        <path d="m5 12 4 4L19 6" />
                      ) : (
                        <path d="M5 12h14M13 6l6 6-6 6" />
                      )}
                    </Icon>
                  </button>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section
        id="agenda"
        className="scroll-mt-0 bg-[#103f42] px-6 py-24 text-white lg:px-10 lg:py-32"
      >
        <div className="mx-auto max-w-7xl">
          <div className="grid gap-12 lg:grid-cols-[0.72fr_1.28fr] lg:gap-20">
            <div>
              <p className="eyebrow !text-[#9dc5bf]">02 — Escolha quando</p>
              <h2 className="mt-5 font-display text-5xl leading-none md:text-6xl">
                Sua agenda,{" "}
                <span className="italic text-[#b9d9d3]">seu ritmo.</span>
              </h2>
              <p className="mt-6 max-w-md leading-7 text-white/65">
                Atendemos de segunda a sexta. Selecione uma data e um período
                disponível para continuar.
              </p>

              <div className="mt-10 border-t border-white/15 pt-6">
                <p className="text-xs font-bold uppercase tracking-[0.2em] text-white/45">
                  Seu pedido
                </p>
                {service ? (
                  <div className="mt-4 flex items-center justify-between gap-4">
                    <div>
                      <p className="font-display text-2xl">{service.name}</p>
                      <p className="mt-1 text-sm text-white/55">{service.detail}</p>
                    </div>
                    <span className="text-sm font-bold">
                      {formatCurrency(service.price)}
                    </span>
                  </div>
                ) : (
                  <p className="mt-4 text-sm text-white/55">
                    Selecione um serviço acima para começar.
                  </p>
                )}
              </div>
            </div>

            <div className="min-w-0">
              <div className="mb-5 flex items-end justify-between gap-4">
                <div>
                  <p className="text-xs font-bold uppercase tracking-[0.18em] text-white/45">
                    Próximos 30 dias
                  </p>
                  <p className="mt-1 text-sm text-white/75">
                    Deslize para ver mais datas
                  </p>
                </div>
                <Icon className="size-5 text-[#9dc5bf]">
                  <path d="M8 2v4M16 2v4M3 9h18M5 4h14a2 2 0 0 1 2 2v14H3V6a2 2 0 0 1 2-2Z" />
                </Icon>
              </div>

              <div className="no-scrollbar flex snap-x gap-3 overflow-x-auto pb-4">
                {dates.map((date) => {
                  const isSelected = selectedDate
                    ? dateKey(date) === dateKey(selectedDate)
                    : false;
                  return (
                    <button
                      type="button"
                      key={dateKey(date)}
                      onClick={() => selectDate(date)}
                      disabled={!service}
                      className={`min-w-24 snap-start rounded-2xl border px-3 py-5 text-center transition disabled:cursor-not-allowed disabled:opacity-35 ${
                        isSelected
                          ? "border-[#c7e2dd] bg-[#c7e2dd] text-[#103f42]"
                          : "border-white/15 bg-white/[0.04] hover:border-white/40 hover:bg-white/[0.08]"
                      }`}
                    >
                      <span className="block text-[10px] font-bold uppercase tracking-[0.14em] opacity-65">
                        {date
                          .toLocaleDateString("pt-BR", { weekday: "short" })
                          .replace(".", "")}
                      </span>
                      <span className="mt-2 block font-display text-4xl">
                        {date.getDate().toString().padStart(2, "0")}
                      </span>
                      <span className="mt-1 block text-[10px] font-bold uppercase tracking-widest opacity-65">
                        {date
                          .toLocaleDateString("pt-BR", { month: "short" })
                          .replace(".", "")}
                      </span>
                    </button>
                  );
                })}
              </div>

              <div className="mt-7 grid gap-3 sm:grid-cols-2">
                {periods.map((item) => {
                  const slot = selectedDate
                    ? `${dateKey(selectedDate)}-${item.label}`
                    : "";
                  const isBooked = bookedSlots.includes(slot);
                  const isSelected = period === item.label;
                  return (
                    <button
                      type="button"
                      key={item.label}
                      disabled={!selectedDate || isBooked}
                      onClick={() => setPeriod(item.label)}
                      className={`flex items-center justify-between rounded-2xl border p-5 text-left transition disabled:cursor-not-allowed ${
                        isBooked
                          ? "border-white/5 bg-white/[0.025] text-white/25"
                          : isSelected
                            ? "border-[#c7e2dd] bg-[#c7e2dd] text-[#103f42]"
                            : "border-white/15 bg-white/[0.04] hover:border-white/40"
                      }`}
                    >
                      <span>
                        <span className="block font-display text-2xl">
                          {item.label}
                        </span>
                        <span className="mt-1 block text-xs opacity-60">
                          {isBooked ? "Horário indisponível" : item.time}
                        </span>
                      </span>
                      <span
                        className={`grid size-9 place-items-center rounded-full border ${
                          isSelected
                            ? "border-[#103f42]/20"
                            : "border-current opacity-50"
                        }`}
                      >
                        <Icon className="size-4">
                          {isBooked ? (
                            <path d="M7 7l10 10M17 7 7 17" />
                          ) : (
                            <>
                              <circle cx="12" cy="12" r="9" />
                              <path d="M12 7v5l3 2" />
                            </>
                          )}
                        </Icon>
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </section>

      <footer className="bg-[#0b3032] px-6 py-9 text-white/55 lg:px-10">
        <div className="mx-auto flex max-w-7xl flex-col gap-5 text-xs sm:flex-row sm:items-center sm:justify-between">
          <p className="font-display text-xl text-white">Vinhas & Xavier</p>
          <p>Limpeza profissional feita com cuidado.</p>
          <p>© {new Date().getFullYear()} Todos os direitos reservados.</p>
        </div>
      </footer>

      {showForm && service && selectedDate && period && (
        <div
          className="fixed inset-0 z-50 grid place-items-center overflow-y-auto bg-[#082e30]/80 p-4 backdrop-blur-md"
          role="dialog"
          aria-modal="true"
          aria-labelledby="booking-title"
        >
          <div className="my-6 w-full max-w-xl rounded-[2rem] bg-[#fbfdfc] p-6 text-[#153c3e] shadow-2xl md:p-9">
            <div className="flex items-start justify-between gap-6">
              <div>
                <p className="eyebrow">03 — Seus dados</p>
                <h2
                  id="booking-title"
                  className="mt-3 font-display text-4xl tracking-tight"
                >
                  Quase tudo pronto.
                </h2>
              </div>
              <button
                type="button"
                onClick={() => {
                  setShowForm(false);
                  setPeriod(null);
                }}
                className="grid size-10 shrink-0 place-items-center rounded-full border border-[#cadbd8] transition hover:bg-[#e8f2ef]"
                aria-label="Fechar"
              >
                <Icon className="size-5">
                  <path d="M6 6l12 12M18 6 6 18" />
                </Icon>
              </button>
            </div>

            <div className="mt-6 flex flex-wrap gap-x-5 gap-y-2 border-y border-[#dbe7e4] py-4 text-xs font-semibold text-[#597370]">
              <span>{service.name}</span>
              <span>
                {selectedDate.toLocaleDateString("pt-BR", {
                  day: "2-digit",
                  month: "long",
                })}
              </span>
              <span>
                {period} · {periods.find((item) => item.label === period)?.time}
              </span>
            </div>

            <form onSubmit={submitBooking} className="mt-6 space-y-4">
              <label className="block">
                <span className="mb-2 block text-xs font-bold uppercase tracking-[0.12em] text-[#58706e]">
                  Nome completo
                </span>
                <input
                  required
                  autoFocus
                  value={form.name}
                  onChange={(event) =>
                    setForm({ ...form, name: event.target.value })
                  }
                  placeholder="Como podemos te chamar?"
                  className="form-input"
                />
              </label>
              <label className="block">
                <span className="mb-2 block text-xs font-bold uppercase tracking-[0.12em] text-[#58706e]">
                  WhatsApp
                </span>
                <input
                  required
                  type="tel"
                  value={form.phone}
                  onChange={(event) =>
                    setForm({ ...form, phone: event.target.value })
                  }
                  placeholder="(11) 99999-9999"
                  className="form-input"
                />
              </label>
              <label className="block">
                <span className="mb-2 block text-xs font-bold uppercase tracking-[0.12em] text-[#58706e]">
                  Endereço completo
                </span>
                <textarea
                  required
                  rows={3}
                  value={form.address}
                  onChange={(event) =>
                    setForm({ ...form, address: event.target.value })
                  }
                  placeholder="Rua, número, complemento, bairro e cidade"
                  className="form-input resize-none"
                />
              </label>
              <button
                type="submit"
                className="flex w-full items-center justify-center gap-3 rounded-full bg-[#0d5558] px-6 py-4 text-sm font-extrabold text-white transition hover:bg-[#093f42]"
              >
                Avançar para o WhatsApp
                <Icon className="size-5">
                  <path d="M5 12h14M13 6l6 6-6 6" />
                </Icon>
              </button>
            </form>
            <p className="mt-4 text-center text-[11px] leading-5 text-[#7b8f8d]">
              Você poderá revisar todos os dados antes de abrir a conversa.
            </p>
          </div>
        </div>
      )}

      {showConfirmation && service && selectedDate && period && (
        <div
          className="fixed inset-0 z-50 grid place-items-center overflow-y-auto bg-[#082e30] p-4"
          role="dialog"
          aria-modal="true"
          aria-labelledby="confirmation-title"
        >
          <div className="my-6 w-full max-w-2xl text-center text-white">
            <span className="mx-auto grid size-16 place-items-center rounded-full bg-[#c7e2dd] text-[#103f42]">
              <Icon className="size-8">
                <path d="m5 12 4 4L19 6" />
              </Icon>
            </span>
            <p className="mt-7 text-xs font-bold uppercase tracking-[0.2em] text-[#9dc5bf]">
              Agendamento preparado
            </p>
            <h2
              id="confirmation-title"
              className="mt-3 font-display text-5xl tracking-tight md:text-6xl"
            >
              Tudo certo, {form.name.split(" ")[0]}.
            </h2>
            <p className="mx-auto mt-4 max-w-lg leading-7 text-white/60">
              Confira o resumo abaixo. Ao continuar, abriremos o WhatsApp com
              todos os dados preenchidos para a confirmação final.
            </p>

            <div className="mx-auto mt-8 max-w-xl rounded-3xl border border-white/15 bg-white/[0.05] p-6 text-left">
              {[
                ["Serviço", `${service.name} — ${service.detail}`],
                [
                  "Data",
                  selectedDate.toLocaleDateString("pt-BR", {
                    weekday: "long",
                    day: "2-digit",
                    month: "long",
                  }),
                ],
                [
                  "Horário",
                  `${period} · ${periods.find((item) => item.label === period)?.time}`,
                ],
                ["Endereço", form.address],
              ].map(([label, value], index) => (
                <div
                  key={label}
                  className={`grid gap-1 py-3 sm:grid-cols-[100px_1fr] ${
                    index ? "border-t border-white/10" : ""
                  }`}
                >
                  <span className="text-xs font-bold uppercase tracking-wider text-white/40">
                    {label}
                  </span>
                  <span className="text-sm font-medium capitalize text-white/85">
                    {value}
                  </span>
                </div>
              ))}
            </div>

            <a
              href={whatsappUrl}
              target="_blank"
              rel="noreferrer"
              className="mt-7 inline-flex w-full max-w-xl items-center justify-center gap-3 rounded-full bg-[#c7e2dd] px-7 py-4 text-sm font-extrabold text-[#103f42] transition hover:-translate-y-0.5 hover:bg-white"
            >
              Abrir conversa no WhatsApp
              <Icon className="size-5">
                <path d="M5 12h14M13 6l6 6-6 6" />
              </Icon>
            </a>
            <button
              type="button"
              onClick={() => {
                setShowConfirmation(false);
                setService(null);
                setSelectedDate(null);
                setPeriod(null);
                setForm({ name: "", phone: "", address: "" });
              }}
              className="mt-5 text-xs font-semibold text-white/45 underline underline-offset-4 hover:text-white"
            >
              Voltar ao início
            </button>
          </div>
        </div>
      )}
    </main>
  );
}

export default App;
