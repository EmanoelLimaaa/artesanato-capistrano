import { useState } from "react";
import {
  Package,
  User,
  LogOut,
  Phone,
  Mail,
  Edit2,
  Plus,
  Trash2,
  ExternalLink,
  X,
} from "lucide-react";

const ARTESAO_INITIAL = {
  avatar: "",
  nome: "Dona Maria de Lourdes",
  especialidade: "ARGILA E CERÂMICA",
  biografia:
    '"Trabalho com argila há mais de 43 anos, moldando o barro vermelho e criando peças que carregam a alma do sertão cearense. Cada criação nasce das mãos e do coração."',
  telefone: "5585999991111",
  email: "marialourdes@capistrano.com",
};

const PRODUTOS = [
  {
    id: 1,
    nome: "Vaso de Argila Terracota Sagitário",
    descricao:
      "Vaso cilíndrico moldado inteiramente com as mãos e queimado em forno a lenha tradicional de barro.",
    categoria: "Argila",
    preco: 120,
  },
  {
    id: 2,
    nome: "Fruteira de Barro Rústica Escovada",
    descricao:
      "Forma rústica e escovada, feita para decorar e servir com autenticidade regional.",
    categoria: "Argila",
    preco: 95,
  },
];

const formatPrice = (value) =>
  new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(value);

export default function Painel() {
  const [produtos, setProdutos] = useState(PRODUTOS);
  const [mostrarEdicao, setMostrarEdicao] = useState(false);
  const [mostrarNovoProduto, setMostrarNovoProduto] = useState(false);
  const [produtoSelecionado, setProdutoSelecionado] = useState(null);
  const [artesao, setArtesao] = useState(ARTESAO_INITIAL);

  const iniciais = artesao.nome
    .split(" ")
    .slice(0, 2)
    .map((n) => n[0])
    .join("")
    .toUpperCase();

  const [formPerfil, setFormPerfil] = useState({
    avatar: ARTESAO_INITIAL.avatar,
    nome: ARTESAO_INITIAL.nome,
    especialidade: ARTESAO_INITIAL.especialidade,
    biografia: ARTESAO_INITIAL.biografia,
    telefone: ARTESAO_INITIAL.telefone,
    email: ARTESAO_INITIAL.email,
  });

  const [novoProduto, setNovoProduto] = useState({
    nome: "",
    descricao: "",
    categoria: "Argila",
    preco: "",
    imagem: "",
  });

  const removerProduto = (id) => {
    setProdutos((prev) => prev.filter((p) => p.id !== id));
  };

  const salvarPerfil = (e) => {
    e.preventDefault();
    setArtesao({
      avatar: formPerfil.avatar,
      nome: formPerfil.nome,
      especialidade: formPerfil.especialidade,
      biografia: formPerfil.biografia,
      telefone: formPerfil.telefone,
      email: formPerfil.email,
    });
    setMostrarEdicao(false);
  };

  const adicionarProduto = (e) => {
    e.preventDefault();
    if (!novoProduto.nome || !novoProduto.preco) return;
    const produto = {
      id: Date.now(),
      nome: novoProduto.nome,
      descricao: novoProduto.descricao,
      categoria: novoProduto.categoria,
      preco: parseFloat(novoProduto.preco),
      imagem: novoProduto.imagem,
    };
    setProdutos((prev) => [...prev, produto]);
    setNovoProduto({ nome: "", descricao: "", categoria: "Argila", preco: "", imagem: "" });
    setMostrarNovoProduto(false);
  };

  return (
    <div className="min-h-screen bg-[#F9F9F9] text-[#2B1B14]">
      {/* Header */}
      <header className="mx-auto max-w-6xl px-4 pt-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-4">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-full overflow-hidden">
              <img src="/src/assets/logo.png" alt="Logo"
                className="h-full w-full rounded-full object-cover object-center"
                style={{ imageRendering: "auto" }}
              />
            </div>
            <div className="leading-tight">
              <div className="text-lg font-semibold">Artesanato de Capistrano</div>
              <div className="text-[11px] font-medium tracking-wide text-[#8B5A2B]">
                SERRAS DE BATURITÉ - CE
              </div>
            </div>
          </div>

          <nav className="flex flex-wrap items-center gap-2 sm:gap-4 text-sm">
            <a
              href="/catalogo"
              className="font-medium text-[#8B5A2B] hover:underline"
            >
              Catálogo Principal
            </a>

            <button className="flex items-center gap-2 rounded-full bg-[#6B3B16] px-4 py-2 text-white font-medium">
              <User size={14} />
              Painel de {artesao.nome.split(" ").slice(-1)[0]}
            </button>
          </nav>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-4 py-8 space-y-8">
        {/* Card de Perfil do Artesão */}
        <section className="rounded-3xl border border-[#E7D7C8] bg-white p-6 md:p-8">
          <div className="flex flex-col gap-6 md:gap-8 lg:flex-row lg:items-start lg:justify-between">
            {/* Lado Esquerdo */}
            <div className="flex items-start gap-4 md:gap-6">
              <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-full bg-[#FFF4D6] overflow-hidden">
                <img
                  src={artesao.avatar || ""}
                  alt={artesao.nome}
                  className="h-full w-full object-cover"
                />
                {!artesao.avatar && (
                  <span className="text-2xl font-bold text-[#6B3B16]">
                    {iniciais}
                  </span>
                )}
              </div>

              <div className="flex flex-col gap-3">
                <div className="flex flex-wrap items-center gap-3">
                  <h1 className="text-xl font-bold text-[#2B1B14]">
                    {artesao.nome}
                  </h1>
                  <span className="inline-flex items-center rounded-full bg-[#FFF4D6] px-3 py-1 text-[10px] font-bold tracking-widest text-[#8B5A2B] uppercase">
                    {artesao.especialidade}
                  </span>
                </div>

                <p className="max-w-xl text-sm italic leading-relaxed text-[#3B2A22]">
                  {artesao.biografia}
                </p>

                <div className="flex flex-wrap items-center gap-6 text-sm text-[#8B5A2B]">
                  <a
                    href={`https://wa.me/${artesao.telefone}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 hover:text-[#A45A1F]"
                  >
                    <Phone size={14} strokeWidth={1.5} />
                    {artesao.telefone}
                  </a>
                  <a
                    href={`mailto:${artesao.email}`}
                    className="flex items-center gap-2 hover:text-[#A45A1F]"
                  >
                    <Mail size={14} strokeWidth={1.5} />
                    {artesao.email}
                  </a>
                </div>
              </div>
            </div>

            {/* Lado Direito — Ações */}
            <div className="flex flex-row flex-wrap gap-3 lg:flex-col lg:items-end">
              <button
                onClick={() => {
                  setFormPerfil({
                    avatar: artesao.avatar,
                    nome: artesao.nome,
                    especialidade: artesao.especialidade,
                    biografia: artesao.biografia,
                    telefone: artesao.telefone,
                    email: artesao.email,
                  });
                  setMostrarEdicao(true);
                }}
                className="flex items-center gap-2 rounded-xl border border-[#6B3B16] bg-white px-6 py-3 text-sm font-medium text-[#6B3B16] hover:bg-[#FFF4D6] transition-colors"
              >
                <Edit2 size={16} strokeWidth={1.5} />
                Editar Dados do Perfil
              </button>
              <button
                onClick={() => setMostrarNovoProduto(true)}
                className="flex items-center gap-2 rounded-xl bg-[#6B3B16] px-6 py-3 text-sm font-semibold text-white hover:bg-[#5A3214] transition-colors"
              >
                <Plus size={16} />
                Expor Peça Nova
              </button>
              <button
                onClick={() => (window.location.href = "/login")}
                className="flex items-center gap-2 text-sm text-[#A07A55] hover:text-[#8B5A2B] transition-colors"
              >
                <LogOut size={14} strokeWidth={1.5} />
                Desconectar
              </button>
            </div>
          </div>
        </section>

        {/* Seção Minhas Peças Expostas */}
        <section>
          <div className="mb-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <Package size={18} className="text-[#8B5A2B]" strokeWidth={1.5} />
              <h2 className="text-lg font-semibold">Minhas Peças Expostas</h2>
            </div>
            <span className="text-xs text-[#A07A55]">
              {produtos.length} produto(s) ativo(s)
            </span>
          </div>

          <div className="h-px bg-[#E7D7C8]" />

          {produtos.length === 0 ? (
            <div className="mt-8 flex flex-col items-center justify-center rounded-3xl border-2 border-dashed border-[#E7D7C8] py-16">
              <Package size={48} className="text-[#E7D7C8]" strokeWidth={1} />
              <p className="mt-4 text-sm text-[#8B5A2B]">
                Nenhum produto cadastrado ainda.
              </p>
              <button
                onClick={() => setMostrarNovoProduto(true)}
                className="mt-4 flex items-center gap-2 rounded-full border border-[#8B5A2B] px-5 py-2 text-sm text-[#8B5A2B] hover:bg-[#FFF4D6] transition-colors"
              >
                <Plus size={16} />
                Publique seu primeiro produto
              </button>
            </div>
          ) : (
            <div className="mt-6 grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-3">
              {produtos.map((produto) => (
                <article
                  key={produto.id}
                  className="overflow-hidden rounded-2xl border border-[#E7D7C8] bg-white"
                >
                  <div className="relative">
                    <img src={produto.imagem || ""}
                      alt={produto.nome}
                      className="h-48 min-h-[12rem] w-full object-cover bg-[#F5EFE6]"
                    />
                    <div className="absolute left-3 top-3 rounded-full bg-[#FFF4D6] px-3 py-1 text-[10px] font-bold text-[#8B5A2B]">
                      {produto.categoria}
                    </div>
                  </div>

                  <div className="p-4">
                    <h3 className="font-semibold text-[#2B1B14]">{produto.nome}</h3>
                    <p className="mt-1 text-xs leading-relaxed text-[#3B2A22] line-clamp-2">
                      {produto.descricao}
                    </p>

                    <div className="mt-4 flex flex-col gap-3 sm:flex-row items-start sm:items-center justify-between border-t border-[#E7D7C8] pt-4">
                      <div>
                        <div className="text-[10px] font-semibold text-[#7A6A60] uppercase">
                          Valor Sugerido
                        </div>
                        <div className="text-base font-bold text-[#A45A1F]">
                          {formatPrice(produto.preco)}
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => setProdutoSelecionado(produto)}
                          className="flex items-center gap-1.5 rounded-xl border border-[#6B3B16] px-3 py-1.5 text-xs font-medium text-[#6B3B16] hover:bg-[#FFF4D6] transition-colors"
                        >
                          Ver
                          <ExternalLink size={12} />
                        </button>
                        <button
                          onClick={() => removerProduto(produto.id)}
                          className="flex items-center justify-center rounded-xl border border-red-200 p-1.5 text-red-400 hover:bg-red-50 transition-colors"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          )}
        </section>
      </main>

      {/* Modal Editar Perfil */}
        {mostrarEdicao && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm px-4">
            <div className="w-full max-w-lg rounded-3xl bg-white shadow-2xl max-h-[95vh] flex flex-col">
              <div className="flex items-center justify-between border-b border-[#E7D7C8] p-4 sm:p-6 shrink-0">
                <h2 className="text-base sm:text-lg font-semibold">Editar Dados do Perfil</h2>
                <button
                  onClick={() => setMostrarEdicao(false)}
                  className="p-2 text-[#8B5A2B] hover:text-[#A45A1F] transition-colors"
                >
                  <X size={20} />
                </button>
              </div>
              <form onSubmit={salvarPerfil} className="p-4 sm:p-6 flex flex-col gap-4 overflow-y-auto">
                <div>
                  <label className="text-[10px] font-bold tracking-widest text-[#8B5A2B] uppercase">
                    Foto do Perfil
                  </label>
                  <label className="mt-1 flex items-center gap-3 w-full rounded-xl border border-[#E7D7C8] bg-white px-4 py-3 text-sm text-[#A07A55] cursor-pointer hover:bg-[#F9F9F9] transition-colors">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => {
                        const file = e.target.files[0];
                        if (file) {
                          setFormPerfil({ ...formPerfil, avatar: URL.createObjectURL(file) });
                        }
                      }}
                      className="hidden"
                    />
                    <span className="text-[10px] font-medium text-[#A07A55] truncate">
                      {formPerfil.avatar ? "Foto selecionada ✓" : "Clique para selecionar uma foto"}
                    </span>
                  </label>
                </div>
                <div>
                  <label className="text-[10px] font-bold tracking-widest text-[#8B5A2B] uppercase">
                    Nome Completo
                  </label>
                  <input
                    value={formPerfil.nome}
                    onChange={(e) => setFormPerfil({ ...formPerfil, nome: e.target.value })}
                    className="mt-1 w-full rounded-xl border border-[#E7D7C8] bg-white px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-[#A45A1F]/20"
                  />
                </div>
                <div>
                  <label className="text-[10px] font-bold tracking-widest text-[#8B5A2B] uppercase">
                    Especialidade
                  </label>
                  <select
                    value={formPerfil.especialidade}
                    onChange={(e) => setFormPerfil({ ...formPerfil, especialidade: e.target.value })}
                    className="mt-1 w-full rounded-xl border border-[#E7D7C8] bg-white px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-[#A45A1F]/20"
                  >
                    <option>ARGILA E CERÂMICA</option>
                    <option>TÊXTIL E BORDADO</option>
                    <option>MADEIRA E ENTALHE</option>
                    <option>PALHA E TRANÇADO</option>
                    <option>OUTROS</option>
                  </select>
                </div>
                <div>
                  <label className="text-[10px] font-bold tracking-widest text-[#8B5A2B] uppercase">
                    Biografia
                  </label>
                  <textarea
                    value={formPerfil.biografia}
                    onChange={(e) => setFormPerfil({ ...formPerfil, biografia: e.target.value })}
                    rows={3}
                    className="mt-1 w-full resize-none rounded-xl border border-[#E7D7C8] bg-white px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-[#A45A1F]/20"
                  />
                </div>
                <div>
                  <label className="text-[10px] font-bold tracking-widest text-[#8B5A2B] uppercase">
                    Telefone / WhatsApp
                  </label>
                  <input
                    value={formPerfil.telefone}
                    onChange={(e) => setFormPerfil({ ...formPerfil, telefone: e.target.value })}
                    className="mt-1 w-full rounded-xl border border-[#E7D7C8] bg-white px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-[#A45A1F]/20"
                  />
                </div>
                <div>
                  <label className="text-[10px] font-bold tracking-widest text-[#8B5A2B] uppercase">
                    E-mail
                  </label>
                  <input
                    value={formPerfil.email}
                    onChange={(e) => setFormPerfil({ ...formPerfil, email: e.target.value })}
                    className="mt-1 w-full rounded-xl border border-[#E7D7C8] bg-white px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-[#A45A1F]/20"
                  />
                </div>
                <div className="flex gap-3 pt-2 shrink-0">
                  <button
                    type="button"
                    onClick={() => setMostrarEdicao(false)}
                    className="flex-1 rounded-xl border border-[#E7D7C8] py-3 text-sm font-medium text-[#8B5A2B] hover:bg-[#F9F9F9] transition-colors"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    className="flex-1 rounded-xl bg-[#6B3B16] py-3 text-sm font-semibold text-white hover:bg-[#5A3214] transition-colors"
                  >
                    Salvar Alterações
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Modal Novo Produto */}
        {mostrarNovoProduto && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm px-4">
            <div className="w-full max-w-lg rounded-3xl bg-white shadow-2xl max-h-[95vh] flex flex-col">
              <div className="flex items-center justify-between border-b border-[#E7D7C8] p-4 sm:p-6 shrink-0">
                <h2 className="text-base sm:text-lg font-semibold">Expor Nova Peça</h2>
                <button
                  onClick={() => setMostrarNovoProduto(false)}
                  className="p-2 text-[#8B5A2B] hover:text-[#A45A1F] transition-colors"
                >
                  <X size={20} />
                </button>
              </div>
              <form onSubmit={adicionarProduto} className="p-4 sm:p-6 flex flex-col gap-4 overflow-y-auto">
                <div>
                  <label className="text-[10px] font-bold tracking-widest text-[#8B5A2B] uppercase">
                    Foto do Produto
                  </label>
                  <label className="mt-1 flex items-center gap-3 w-full rounded-xl border border-[#E7D7C8] bg-white px-4 py-3 text-sm text-[#A07A55] cursor-pointer hover:bg-[#F9F9F9] transition-colors">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => {
                        const file = e.target.files[0];
                        if (file) {
                          setNovoProduto({ ...novoProduto, imagem: URL.createObjectURL(file) });
                        }
                      }}
                      className="hidden"
                    />
                    <span className="text-[10px] font-medium text-[#A07A55] truncate">
                      {novoProduto.imagem ? "Foto selecionada ✓" : "Clique para selecionar uma foto"}
                    </span>
                  </label>
                </div>
                <div>
                  <label className="text-[10px] font-bold tracking-widest text-[#8B5A2B] uppercase">
                    Nome do Produto
                  </label>
                  <input
                    value={novoProduto.nome}
                    onChange={(e) => setNovoProduto({ ...novoProduto, nome: e.target.value })}
                    placeholder="Ex: Vaso de Argila Pintado"
                    className="mt-1 w-full rounded-xl border border-[#E7D7C8] bg-white px-4 py-3 text-sm outline-none placeholder:text-[#A07A55] focus:ring-2 focus:ring-[#A45A1F]/20"
                  />
                </div>
                <div>
                  <label className="text-[10px] font-bold tracking-widest text-[#8B5A2B] uppercase">
                    Descrição
                  </label>
                  <textarea
                    value={novoProduto.descricao}
                    onChange={(e) => setNovoProduto({ ...novoProduto, descricao: e.target.value })}
                    placeholder="Descreva o produto..."
                    rows={3}
                    className="mt-1 w-full resize-none rounded-xl border border-[#E7D7C8] bg-white px-4 py-3 text-sm outline-none placeholder:text-[#A07A55] focus:ring-2 focus:ring-[#A45A1F]/20"
                  />
                </div>
                <div>
                  <label className="text-[10px] font-bold tracking-widest text-[#8B5A2B] uppercase">
                    Categoria
                  </label>
                  <select
                    value={novoProduto.categoria}
                    onChange={(e) => setNovoProduto({ ...novoProduto, categoria: e.target.value })}
                    className="mt-1 w-full rounded-xl border border-[#E7D7C8] bg-white px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-[#A45A1F]/20"
                  >
                    <option>Argila</option>
                    <option>Tecido</option>
                    <option>Madeira</option>
                    <option>Palha</option>
                    <option>Outros</option>
                  </select>
                </div>
                <div>
                  <label className="text-[10px] font-bold tracking-widest text-[#8B5A2B] uppercase">
                    Preço (R$)
                  </label>
                  <input
                    value={novoProduto.preco}
                    onChange={(e) => setNovoProduto({ ...novoProduto, preco: e.target.value })}
                    placeholder="120"
                    type="number"
                    className="mt-1 w-full rounded-xl border border-[#E7D7C8] bg-white px-4 py-3 text-sm outline-none placeholder:text-[#A07A55] focus:ring-2 focus:ring-[#A45A1F]/20"
                  />
                </div>
                <div className="flex gap-3 pt-2 shrink-0">
                  <button
                    type="button"
                    onClick={() => setMostrarNovoProduto(false)}
                    className="flex-1 rounded-xl border border-[#E7D7C8] py-3 text-sm font-medium text-[#8B5A2B] hover:bg-[#F9F9F9] transition-colors"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    className="flex-1 rounded-xl bg-[#6B3B16] py-3 text-sm font-semibold text-white hover:bg-[#5A3214] transition-colors"
                  >
                    Publicar Peça
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

      {/* Modal Detalhes do Produto */}
        {produtoSelecionado && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm px-4">
            <div className="relative w-full max-w-4xl rounded-3xl bg-[#F9F9F9] shadow-2xl border border-[#E7D7C8] overflow-hidden max-h-[90vh] flex flex-col md:flex-row">
              <button
                onClick={() => setProdutoSelecionado(null)}
                className="absolute right-4 top-4 z-10 p-2 bg-white/80 hover:bg-white rounded-full transition-colors border border-[#E7D7C8]"
              >
                <X size={20} />
              </button>

              {/* Lado Esquerdo: Imagem */}
              <div className="w-full md:w-1/2 bg-[#E7D7C8]/30 flex flex-col justify-center items-center p-6 min-h-[250px] md:min-h-full">
                <img
                  src={produtoSelecionado.imagem || ""}
                  alt={produtoSelecionado.nome}
                  className="h-full w-full object-cover bg-[#F5EFE6] text-[#A07A55] flex items-center justify-center"
                />
              </div>

              {/* Lado Direito: Informações */}
              <div className="w-full md:w-1/2 p-6 md:p-8 flex flex-col justify-between overflow-y-auto bg-white border-t md:border-t-0 md:border-l border-[#E7D7C8]">
                <div>
                  <span className="text-[11px] font-bold tracking-widest text-[#8B5A2B] uppercase">
                    Categoria: {produtoSelecionado.categoria}
                  </span>
                  <h2 className="text-xl md:text-2xl font-semibold text-[#2B1B14] mt-1">
                    {produtoSelecionado.nome}
                  </h2>

                  <div className="mt-4 border-b border-[#E7D7C8] pb-3">
                    <span className="text-[10px] font-bold text-[#7A6A60] uppercase tracking-wider block">
                      Preço Estimado
                    </span>
                    <div className="text-xl font-bold text-[#A45A1F] mt-0.5">
                      {formatPrice(produtoSelecionado.preco)}{" "}
                      <span className="text-xs font-normal text-[#7A6A60] italic">
                        (conforme tamanho/detalhe)
                      </span>
                    </div>
                  </div>

                  <div className="mt-4">
                    <h3 className="text-xs font-bold text-[#7A6A60] uppercase tracking-wider">
                      Descrição
                    </h3>
                    <p className="text-sm text-[#3B2A22] mt-1 leading-relaxed">
                      {produtoSelecionado.descricao}
                    </p>
                  </div>

                  <div className="mt-5 p-4 rounded-xl bg-[#FFF4D6]/50 border border-[#FFF4D6]">
                    <h3 className="text-xs font-bold text-[#8B5A2B] uppercase tracking-wider">
                      Artesão Criador
                    </h3>
                    <div className="text-sm font-semibold text-[#2B1B14] mt-0.5">
                      {artesao.nome}
                    </div>
                    <div className="text-[11px] text-[#8B5A2B] font-medium mt-0.5">
                      {artesao.especialidade}
                    </div>
                    <p className="text-xs text-[#3B2A22] italic mt-1.5 leading-relaxed">
                      "{artesao.biografia}"
                    </p>
                  </div>
                </div>

                {/* Ações */}
                <div className="mt-6 pt-4 border-t border-[#E7D7C8] flex flex-col gap-3">
                  <button
                    type="button"
                    onClick={() => window.open(`https://wa.me/00?text=Olá, gostaria de saber mais sobre o ${produtoSelecionado.nome}.! Tenho interesse no ${produtoSelecionado.nome}`, "_blank")}
                    className="w-full py-2.5 rounded-full bg-[#8B4513] text-white text-sm font-medium hover:bg-[#6B3B16] transition-colors shadow-sm text-center"
                  >
                    Entrar em Contato direto via WhatsApp
                  </button>
                  <div className="text-center text-xs text-[#7A6A60]">
                    E-mail: <span className="font-medium text-[#2B1B14]">{artesao.email}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

      {/* Footer */}
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