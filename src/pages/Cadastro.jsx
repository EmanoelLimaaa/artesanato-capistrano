import { useMemo, useState } from "react";
import { supabase } from "../lib/supabase";

const ESTADO_INICIAL = {
  nomeCompleto: "",
  especialidade: "ARGILA E CERÂMICA",
  biografia: "",
  celular: "",
  email: "",
  senha: "",
};

const MAP_BANCO = {
  "Argila e Cerâmica (Barro)": "ARGILA E CERÂMICA",
  "Têxtil e Bordado (Tear)": "TÊXTIL E BORDADO",
  "Madeira e Entalhe": "MADEIRA E ENTALHE",
  "Palha e Trançado (Carnaúba/Palha)": "PALHA E TRANÇADO",
  "Outros (Artesanato Variado)": "OUTROS",
};

export default function Cadastro() {
  const [form, setForm] = useState(ESTADO_INICIAL);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const [fotoPreviewUrl, setFotoPreviewUrl] = useState("");

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

    if (!form.senha || form.senha.length < 6) {
      nextErrors.senha = "A senha precisa ter no mínimo 6 caracteres";
    }

    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const handleFotoPerfilChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) {
      setFotoPreviewUrl("");
      return;
    }

    // Preview local da imagem selecionada 
    const url = URL.createObjectURL(file);
    setFotoPreviewUrl(url);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate() || loading) return;

    // File selecionado para upload (preview já está feito)
    const inputEl = document.querySelector('input[name="foto_perfil"]');
    const file = (inputEl && inputEl.files && inputEl.files[0]) ? inputEl.files[0] : null;

    try {
      setLoading(true);

      // 1) Cria a autenticação do usuário
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: form.email,
        password: form.senha,
      });

      if (authError) throw authError;

      const user = authData?.user;

      // Compatibilidade com confirmação de email: se o usuário não existir ainda,
      // não tentamos inserir perfil nem upload.
      if (!user) {
        alert(
          "Cadastro criado com sucesso! Confirme seu e-mail para ativar sua conta. Depois disso você poderá fazer login e gerenciar suas peças."
        );
        window.location.href = "/login";
        return;
      }

      let fotoPerfilUrl = null;

      // 2) Upload automático para Storage (bucket: imagens)
      if (file) {
        try {
          const fileExt = file.name ? file.name.split(".").pop().toLowerCase() : "jpg";
          const fileName = `perfis/${user.id}_${Date.now()}_${Math.random().toString(36).substring(2, 7)}.${fileExt}`;
          const detectType = file.type || `image/${fileExt === "png" ? "png" : "jpeg"}`;

          const { error: uploadError } = await supabase.storage
            .from("imagens")
            .upload(fileName, file, {
              contentType: detectType,
              cacheControl: "3600",
              upsert: true,
            });

          if (uploadError) throw uploadError;

          const { data } = supabase.storage.from("imagens").getPublicUrl(fileName);
          fotoPerfilUrl = data?.publicUrl || null;
        } catch (uploadErr) {
          console.error("Erro ao fazer upload da foto no cadastro:", uploadErr);
          alert("Erro ao enviar a foto de perfil: " + uploadErr.message);
          throw uploadErr;
        }
      }

      // 3) Insert automático na tabela `artesaos`
      const { error: perfilError } = await supabase
        .from("artesaos")
        .insert([
          {
            id: user.id,
            nome: form.nomeCompleto,
            email: form.email,
            whatsapp: form.celular.replace(/\D/g, ""),
            biografia: form.biografia,
            especialidade: MAP_BANCO[form.especialidade] || "OUTROS",
            foto_perfil: fotoPerfilUrl,
          },
        ]);

      if (perfilError) throw perfilError;

      alert("Cadastro realizado com sucesso! Faça seu login para gerenciar suas peças.");
      window.location.href = "/login";
    } catch (err) {
      console.error(err);
      alert("Erro ao cadastrar: " + err.message);
    } finally {
      setLoading(false);
    }
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
            Divulgue sua técnica, exiba suas criações regionais e facilite o contato direto de novos compradores pelo WhatsApp gratuitamente. Nós promovemos a cultura local.
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

              <div className="flex flex-col gap-2">
                <label className="block text-xs font-bold tracking-widest text-[#8B5A2B] uppercase">
                  Foto de perfil (opcional)
                </label>

                <div className="mt-2 rounded-2xl border border-[#E7D7C8] bg-white px-4 py-3">
                  <label className="flex items-center justify-center cursor-pointer rounded-xl border border-[#E7D7C8] px-4 py-3 text-sm font-medium text-[#8B5A2B] hover:bg-[#FFF4D6] transition-colors select-none">
                    <span>Selecionar imagem</span>
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      disabled={loading}
                      name="foto_perfil"
                      onChange={handleFotoPerfilChange}
                    />
                  </label>

                  {fotoPreviewUrl ? (
                    <div className="mt-3 flex items-center justify-center">
                      <img
                        src={fotoPreviewUrl}
                        alt="Prévia da foto de perfil"
                        className="h-24 w-24 rounded-full object-cover border border-[#E7D7C8] bg-[#FFF4D6]"
                      />
                    </div>
                  ) : null}

                  <p className="mt-2 text-xs text-[#A07A55]">
                    (A foto será usada quando você atualizar o perfil no painel.)
                  </p>
                </div>
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
              </div>

              <div>
                <label className="block text-xs font-bold tracking-widest text-[#8B5A2B] uppercase">
                  Senha de Acesso <span className="text-[#A45A1F]">*</span>
                </label>
                <input
                  type="password"
                  value={form.senha}
                  onChange={setField("senha")}
                  placeholder="Mínimo 6 caracteres"
                  className={`mt-2 w-full rounded-2xl border border-[#E7D7C8] bg-white px-4 py-3 text-sm outline-none placeholder:text-[#A07A55] focus:ring-2 focus:ring-[#A45A1F]/20 transition-all ${
                    hasError("senha") ? "border-red-400" : ""
                  }`}
                />
                <p className="mt-2 text-xs text-[#A07A55]">
                  Guarde essa senha! Ela servirá para atualizar seu painel no futuro.
                </p>
              </div>
            </div>

            <div className="mt-7 grid grid-cols-1 md:grid-cols-2 items-center gap-5">
              <div className="flex items-start gap-3 text-sm text-[#8B5A2B]">
                <div className="mt-0.5 h-5 w-5 rounded-full bg-[#FFF4D6] flex items-center justify-center text-[#A45A1F] font-bold text-xs">
                  i
                </div>
                <div>
                  Campos marcados com <span className="font-bold text-[#A45A1F]">*</span> são indispensáveis.
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full md:w-auto px-8 py-4 rounded-2xl bg-[#6B3B16] text-white font-semibold shadow-sm hover:bg-[#5A3214] transition-colors disabled:bg-gray-400"
              >
                {loading ? "Cadastrando..." : "Cadastrar Grátis & Entrar"}
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
          <div className="mt-6 text-sm font-medium">© 2026 Capistrano - CE.</div>
        </div>
      </footer>
    </div>
  );
}