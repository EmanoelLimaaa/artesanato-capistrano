import { useState } from "react";
import { LogIn, ArrowLeft } from "lucide-react";
import { supabase } from "../lib/supabase";
import logo from "../assets/logo.png";

export default function Login() {
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [loading, setLoading] = useState(false);
  const [resetLoading, setResetLoading] = useState(false);
  const [resetEmail, setResetEmail] = useState("");
  const [mostrarReset, setMostrarReset] = useState(false);

  const handleResetPassword = async (e) => {
    e.preventDefault();
    const mail = resetEmail.trim() || email.trim();

    if (!mail) {
      alert("Informe seu e-mail para redefinir a senha.");
      return;
    }

    try {
      setResetLoading(true);
      const { error } = await supabase.auth.resetPasswordForEmail(mail, {
        redirectTo: window.location.origin + "/login",
      });

      if (error) throw error;

      alert("Se o e-mail existir, você receberá um link para redefinir sua senha.");
      setResetEmail("");
      setMostrarReset(false);
    } catch (err) {
      console.error(err);
      alert("Erro ao solicitar redefinição de senha. Verifique o e-mail e tente novamente.");
    } finally {
      setResetLoading(false);
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();

    if (!email.trim() || !senha) {
      alert("Por favor, preencha todos os campos.");
      return;
    }

    try {
      setLoading(true);
      const { error } = await supabase.auth.signInWithPassword({
        email: email,
        password: senha,
      });

      if (error) throw error;
      window.location.href = "/painel"; 
    } catch (err) {
      console.error(err);
      alert("Erro ao entrar: Verifique se o e-mail e a senha estão corretos.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F9F9F9] text-[#2B1B14]">
      <header className="mx-auto max-w-6xl px-4 pt-6">
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-5">
            <div className="flex h-16 w-16 flex-shrink-0 items-center justify-center rounded-full overflow-hidden">
              <img
                src={logo}
                alt="logo"
                className="h-full w-full rounded-full object-cover object-center"
              />
            </div>
            <div className="leading-tight">
              <div className="text-lg font-semibold">Artesãos de Capistrano</div>
              <div className="text-[11px] font-medium tracking-wide text-[#8B5A2B]">
                CAPISTRANO - CE
              </div>
            </div>
          </div>

          <a
            href="/catalogo"
            className="flex items-center gap-2 text-sm text-[#8B5A2B] hover:underline"
          >
            <ArrowLeft size={16} />
            Voltar
          </a>
        </div>
      </header>

      <main className="mx-auto max-w-5xl px-4 py-10">
        <div className="flex justify-center">
          <div className="w-full max-w-sm">
            <div className="rounded-3xl bg-white px-8 py-10 shadow-lg">
              <div className="flex flex-col items-center">
                <div className="flex h-14 w-14 items-center justify-center rounded-full bg-[#FFF4D6]">
                  <LogIn className="text-[#A45A1F]" size={24} strokeWidth={1.5} />
                </div>

                <h1 className="mt-6 text-xl font-bold text-[#2B1B14] tracking-tight">
                  Entrar como Artesão
                </h1>

                <p className="mt-2 text-center text-xs leading-relaxed text-[#8B5A2B]">
                  Acesse seu painel para publicar novos produtos.
                </p>
              </div>

              <form className="mt-8 flex flex-col gap-6" onSubmit={handleLogin}>
                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] font-bold tracking-widest text-[#8B5A2B] uppercase">
                    Email Cadastrado
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="email@exemplo.com"
                    className="w-full rounded-xl border border-[#E7D7C8] bg-white px-4 py-3 text-sm text-[#2B1B14] outline-none placeholder:text-[#A07A55] focus:ring-2 focus:ring-[#A45A1F]/20 transition-all"
                  />
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] font-bold tracking-widest text-[#8B5A2B] uppercase">
                    Senha
                  </label>
                  <input
                    type="password"
                    value={senha}
                    onChange={(e) => setSenha(e.target.value)}
                    placeholder="*********"
                    className="w-full rounded-xl border border-[#E7D7C8] bg-white px-4 py-3 text-sm text-[#2B1B14] outline-none placeholder:text-[#A07A55] focus:ring-2 focus:ring-[#A45A1F]/20 transition-all"
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="mt-2 w-full rounded-2xl bg-[#6B3B16] py-4 text-sm font-bold text-white hover:bg-[#5A3214] transition-colors disabled:bg-gray-400"
                >
                  {loading ? "Entrando..." : "Entrar no Painel"}
                </button>

                <div className="text-center mt-1">
                  <button
                    type="button"
                    onClick={() => setMostrarReset(!mostrarReset)}
                    className="text-xs text-[#A45A1F] underline bg-transparent border-none cursor-pointer"
                  >
                    Esqueceu sua senha de acesso?
                  </button>
                </div>
              </form>

              {mostrarReset && (
                <div className="mt-6 border-t border-[#E7D7C8] pt-6">
                  <form onSubmit={handleResetPassword} className="flex flex-col gap-3">
                    <label className="text-[10px] font-bold tracking-widest text-[#8B5A2B] uppercase">
                      Redefinir senha
                    </label>
                    <input
                      type="email"
                      value={resetEmail}
                      onChange={(e) => setResetEmail(e.target.value)}
                      placeholder="Digite seu e-mail de recuperação"
                      className="w-full rounded-xl border border-[#E7D7C8] bg-white px-4 py-3 text-sm text-[#2B1B14] outline-none placeholder:text-[#A07A55] focus:ring-2 focus:ring-[#A45A1F]/20 transition-all"
                    />
                    <button
                      type="submit"
                      disabled={resetLoading}
                      className="w-full rounded-xl bg-white py-3 text-sm font-bold text-[#8B5A2B] border border-[#E7D7C8] hover:bg-[#FFF4D6] transition-colors disabled:opacity-60"
                    >
                      {resetLoading ? "Enviando..." : "Enviar link de recuperação"}
                    </button>
                  </form>
                </div>
              )}

            </div>

            <p className="mt-6 text-center text-xs text-[#A07A55]">
              Não tem uma conta?{" "}
              <a href="/cadastro" className="text-[#A45A1F] underline">
                Cadastre-se gratuitamente
              </a>
            </p>
          </div>
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
