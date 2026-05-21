import { useMemo, useState } from "react";

const ESTADO_INICIAL = {
  nomeCompleto: "",
  especialidade: "Argila e Cerâmica (Barro)",
  biografia: "",
  celular: "",
  email: "",
};

export default function Cadastro() {
  const [form, setForm] = useState(ESTADO_INICIAL);
  const [errors, setErrors] = useState({});

  const especialidades = useMemo(
    () => [
      "Argila e Cerâmica (Barro)",
      "Têxtil e Bordado (Tear)",
      "Madeira e Entalhe",
      "Palha e Trançado (Carnaúba/Palha)",
      "Outros (Artesanato Variado)",
    ],
    []
  );

  const setField = (key) => (e) => {
    setForm((prev) => ({ ...prev, [key]: e.target.value }));
  };

  const validate = () => {
    const nextErrors = {};

    if (!form.nomeCompleto.trim()) nextErrors.nomeCompleto = "Obrigatório";
    if (!form.especialidade) nextErrors.especialidade = "Obrigatório";
    if (!form.biografia.trim()) nextErrors.biografia = "Obrigatório";

    const celularDigits = form.celular.replace(/\D/g, "");
    if (!celularDigits || celularDigits.length < 10) {
      nextErrors.celular = "Informe um número válido";
    }

    if (!form.email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      nextErrors.email = "E-mail inválido";
    }

    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;

    window.location.href = "/login";
  };

  const hasError = (key) => Boolean(errors[key]);

  return (
    <div className="min-h-screen bg-[#F9F9F9] text-[#2B1B14]">
      <main className="mx-auto max-w-5xl px-4 py-10">
        <section className="text-center">
          <div className="inline-flex items-center rounded-full bg-[#FFF4D6] px-5 py-2 text-xs font-semibold tracking-wide text-[#8B5A2B]">
            UNIÃO DE TALENTOS
          </div>

          <h1 className="mt-6 text-3xl md:text-4xl font-semibold tracking-tight">
            <span>Cadastre-se como </span>
            <span className="text-[#A45A1F]">Artesão Parceiro</span>
          </h1>

          <p className="mx-auto mt-4 max-w-3xl text-sm leading-relaxed text-[#3B2A22] md:text-base">
            Divulgue sua técnica, exiba suas criações regionais e facilite o contato diretode novos compradores pelo whatsapp gratuitamente. Nós promovemos a cultura local.
          </p>
        </section>

        <div className="mt-8 rounded-3xl bg-white shadow-sm border border-[#E7D7C8]">
          <form className="p-6 md:p-10" onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <label className="block text-xs font-bold tracking-widest text-[#8B5A2B] uppercase">
                  Nome completo <span className="text-[#A45A1F]">*</span>
                </label>
                <input
                  value={form.nomeCompleto}
                  onChange={setField("nomeCompleto")}
                  placeholder="Ex: Dona Antônia de Souza"
                  className={`mt-2 w-full rounded-2xl border border-[#E7D7C8] bg-white px-4 py-3 text-sm outline-none placeholder:text-[#A07A55] focus:ring-2 focus:ring-[#A45A1F]/20 transition-all ${
                    hasError("nomeCompleto") ? "border-red-400" : ""
                  }`}
                />
              </div>

              <div>
                <label className="block text-xs font-bold tracking-widest text-[#8B5A2B] uppercase">
                  Especialidade principal <span className="text-[#A45A1F]">*</span>
                </label>
                <select
                  value={form.especialidade}
                  onChange={setField("especialidade")}
                  className={`mt-2 w-full rounded-2xl border border-[#E7D7C8] bg-white px-4 py-3 text-sm outline-none placeholder:text-[#A07A55] focus:ring-2 focus:ring-[#A45A1F]/20 transition-all ${
                    hasError("especialidade") ? "border-red-400" : ""
                  }`}
                >
                  {especialidades.map((opt) => (
                    <option key={opt} value={opt}>
                      {opt}
                    </option>
                  ))}
                </select>
              </div>

              <div className="md:col-span-2">
                <label className="block text-xs font-bold tracking-widest text-[#8B5A2B] uppercase">
                  Biografia curta &amp; História de vida <span className="text-[#A45A1F]">*</span>
                </label>
                <textarea
                  value={form.biografia}
                  onChange={setField("biografia")}
                  placeholder="Fale um pouco sobre como começou a produzir artefatos, sua tradição familiar, anos de prática ativa e o que mais ama no seu trabalho artesanal."
                  rows={5}
                  className={`mt-2 w-full resize-none rounded-2xl border border-[#E7D7C8] bg-white px-4 py-3 text-sm outline-none placeholder:text-[#A07A55] focus:ring-2 focus:ring-[#A45A1F]/20 transition-all ${
                    hasError("biografia") ? "border-red-400" : ""
                  }`}
                />
                <p className="mt-2 text-xs text-[#A07A55]">
                  Ideal de 2 a 4 linhas. Essa história será exibida ao lado dos seus produtos para atrair compradores.
                </p>
              </div>

              <div>
                <label className="block text-xs font-bold tracking-widest text-[#8B5A2B] uppercase">
                  Celular / WhatsApp (DDD + número) <span className="text-[#A45A1F]">*</span>
                </label>
                <input
                  value={form.celular}
                  onChange={(e) =>
                    setForm((prev) => ({ ...prev, celular: e.target.value }))
                  }
                  placeholder="Ex: 85999991111"
                  className={`mt-2 w-full rounded-2xl border border-[#E7D7C8] bg-white px-4 py-3 text-sm outline-none placeholder:text-[#A07A55] focus:ring-2 focus:ring-[#A45A1F]/20 transition-all ${
                    hasError("celular") ? "border-red-400" : ""
                  }`}
                  inputMode="numeric"
                />
                <p className="mt-2 text-xs text-[#A07A55]">
                  Insira apenas números com o código de área do Ceará (Ex: 85).
                </p>
              </div>

              <div>
                <label className="block text-xs font-bold tracking-widest text-[#8B5A2B] uppercase">
                  E-mail de cadastro &amp; login <span className="text-[#A45A1F]">*</span>
                </label>
                <input
                  value={form.email}
                  onChange={setField("email")}
                  placeholder="Ex: nome@exemplo.com"
                  className={`mt-2 w-full rounded-2xl border border-[#E7D7C8] bg-white px-4 py-3 text-sm outline-none placeholder:text-[#A07A55] focus:ring-2 focus:ring-[#A45A1F]/20 transition-all ${
                    hasError("email") ? "border-red-400" : ""
                  }`}
                  inputMode="email"
                />
                <p className="mt-2 text-xs text-[#A07A55]">
                  Este e-mail será usado para fazer login no sistema e gerenciar suas peças.
                </p>
              </div>
            </div>

            <div className="mt-7 grid grid-cols-1 md:grid-cols-2 items-center gap-5">
              <div className="flex items-start gap-3 text-sm text-[#8B5A2B]">
                <div className="mt-0.5 h-5 w-5 rounded-full bg-[#FFF4D6] flex items-center justify-center text-[#A45A1F] font-bold">
                  i
                </div>
                <div>
                  Campos marcados com <span className="font-bold text-[#A45A1F]">*</span> são indispensáveis.
                </div>
              </div>

              <button
                type="submit"
                className="w-full md:w-auto px-8 py-4 rounded-2xl bg-[#6B3B16] text-white font-semibold shadow-sm hover:bg-[#5A3214] transition-colors"
              >
                Cadastrar Grátis &amp; Entrar
              </button>
            </div>
          </form>
        </div>
      </main>

      <footer className="mt-8 bg-[#2B1B14]">
        <div className="mx-auto max-w-6xl px-4 py-12 text-center text-white">
          <div className="text-2xl font-semibold">Artesanato de Capistrano</div>
          <p className="mx-auto mt-4 max-w-3xl text-sm leading-relaxed text-[#E9E1D9]">
            Uma vitrine digital de preservação e comércio direto para fomentar a economia criativa do interior do Ceará, conectando saberes ancestrais ao comércio solidário.
          </p>
          <div className="mt-6 text-sm font-medium">
            © 2026 Capistrano - CE.
          </div>
        </div>
      </footer>
    </div>
  );
}

