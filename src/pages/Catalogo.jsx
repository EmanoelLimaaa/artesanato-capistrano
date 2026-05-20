import { useMemo, useState } from "react";
import { MapPin, Search, X, SlidersHorizontal, UserPlus, LogIn } from 'lucide-react';

const FILTERS = ["Todos", "Argila", "Tecido", "Madeira", "Palha", "Outros"];

const formatPrice = (value) =>
  new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(value);

export default function Catalogo() {
  const [query, setQuery] = useState("");
  const [activeFilter, setActiveFilter] = useState("Todos");
  const [selectedProduct, setSelectedProduct] = useState(null);

  const closeModal = () => setSelectedProduct(null);

  // Produtos MOCK
  const products = useMemo(
    () => [
      {
        id: "vaso-argila",
        material: "ARGILA",
        artisan: "Elena Maria de Lourdes",
        title: "Vaso de Argila Terracota Sagitário",
        description:
          "Vaso cilíndrico moldado inteiramente com as mãos e queimado em forno a lenha tradicional de barro. Apresenta pigmentação natural e detalhes ranhurados inspirados no semiárido cearense.",
        price: 120,
        tags: ["Argila", "Terracota"],
        img: "",
        artisanBio: "Trabalha há mais de 43 anos moldando o barro vermelho e criando vasos e panelas que contam histórias de nossa região.",
        email: "marialourdes@capistrano.com"
      },
      {
        id: "fruteira-barro",
        material: "ARGILA",
        artisan: "Elena Maria de Lourdes",
        title: "Fruteira de Barro Rústica Escovada",
        description:
          "Forma rústica e escovada, feita para decorar e servir com autenticidade...",
        price: 95,
        img: "",
        tags: ["Barro", "Rústico"],
        artisanBio: "Trabalha há mais de 43 anos moldando o barro vermelho e criando vasos e panelas que contam histórias de nossa região.",
        email: "marialourdes@capistrano.com"
      },
      {
        id: "escultura-sao-francisco",
        material: "MADEIRA",
        artisan: "Seu Raimundo Nonato",
        title: "Escultura de São Francisco em Sabiá",
        description:
          "Escultura detalhada em madeira, inspirada na tradição e no cuidado do artesão...",
        price: 180,
        img: "",
        tags: ["Madeira", "Entalhe"],
        artisanBio: "Mestre entalhador que transforma troncos caídos de sabiá em arte sacra e figuras típicas do sertão.",
        email: "raimundo@capistrano.com"
      },
      {
        id: "caminho-renda",
        material: "TECIDO",
        artisan: "Francisca das Chagas",
        title: "Caminho de Mesa em Renda de Bilro",
        description:
          "Renda delicada com textura viva, perfeita para compor mesas e ambientes...",
        price: 110,
        img: "",
        tags: ["Tecido", "Renda"],
        artisanBio: "Rendeira tradicional que mantém viva a dança dos bilros sobre a almofada desde a sua juventude.",
        email: "francisca@capistrano.com"
      },
      {
        id: "cesto-carnauba",
        material: "PALHA",
        artisan: "Chico da Palha",
        title: "Cesto Organizador Carnaúba Trançada",
        description:
          "Trançado com carnaúba, ideal para organização e decoração com estilo natural...",
        price: 85,
        img: "",
        tags: ["Palha", "Trançado"],
        artisanBio: "Artesão especialista no trançado rígido e maleável da palha de carnaúba nativa.",
        email: "chico@capistrano.com"
      },
      {
        id: "porta-copos-mandacaru",
        material: "OUTROS",
        artisan: "Francisca das Chagas",
        title: "Porta-Copos Individuais Mandacaru",
        description:
          "Peça functional com acabamento artesanal, feita para valorizar o dia a dia...",
        price: 75,
        img: "",
        tags: ["Palha", "Mandacaru"],
        artisanBio: "Rendeira tradicional que mantém viva a dança dos bilros sobre a almofada desde a sua juventude.",
        email: "francisca@capistrano.com"
      },
    ],
    []
  );

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    let list = products;

    if (activeFilter !== "Todos") {
      const normalized = activeFilter.toLowerCase();
      list = list.filter((p) => {
        if (activeFilter === "Outros") return !["argila", "tecido", "madeira", "palha"].includes(p.material.toLowerCase());
        return p.material.toLowerCase().includes(normalized) || p.tags.some((t) => t.toLowerCase().includes(normalized));
      });
    }

    if (!q) return list;

    return list.filter((p) => {
      const haystack = `${p.material} ${p.artisan} ${p.title} ${p.description} ${p.tags.join(" ")}`.toLowerCase();
      return haystack.includes(q);
    });
  }, [products, query, activeFilter]);

  return (
    <div className="min-h-screen bg-[#F9F9F9] text-[#2B1B14]">
      {/* Header */}
      <header className="mx-auto max-w-6xl px-4 pt-6">
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-full overflow-hidden">
              <img
                src="/src/assets/logo.png"
                alt="Logo"
                className="h-full w-full rounded-full object-cover object-center"
                style={{ imageRendering: "auto" }}
              />
            </div>
            <div className="leading-tight">
              <div className="text-lg font-semibold">Artesãos de Capistrano</div>
              <div className="text-[11px] font-medium tracking-wide text-[#8B5A2B]">
                CAPISTRANO - CE
              </div>
            </div>
          </div>

          <nav className="flex items-center gap-6 text-sm">
            <button
              type="button"
              onClick={() => (window.location.href = "/catalogo")}
              className="rounded-full bg-[#A45A1F] px-5 py-2 text-white font-medium"
            >
              Catálogo Principal
            </button>

            <a className="font-medium text-[#8B5A2B] hover:underline flex items-center gap-2" href="/cadastro">
              <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-[#A45A1F] text-white">
                <UserPlus size={13} className="stroke-[2.5]" />
              </span>
              Quero me Cadastrar
            </a>
            <button
              type="button"
              onClick={() => (window.location.href = "/login")}
              className="flex items-center gap-2 rounded-full border border-[#8B5A2B] px-4 py-2 font-medium hover:bg-white text-[#8B5A2B] transition-colors"
            >
              <LogIn size={16} />
              Entrar
            </button>
          </nav>
        </div>
      </header>

      {/* Hero */}
      <section className="mx-auto max-w-6xl px-4 pb-10 pt-4">
        <div className="rounded-3xl bg-white/70 p-6 md:p-10 backdrop-blur">
          <div className="flex flex-col items-center text-center">
            <div className="mb-2 inline-flex items-center gap-2 rounded-full bg-[#FFF4D6] px-4 py-2 text-xs font-semibold tracking-wide text-[#8B5A2B]">
              <MapPin size={14} className="stroke-[2.5]" />
              CAPISTRANO, CEARÁ
            </div>

            <h1 className="mt-6 max-w-3xl text-center text-3xl font-semibold md:text-5xl">
              <span className="text-[#2B1B14]">A nobreza do barro,</span>{" "}
              <span className="text-[#A45A1F]">a maestria do tear</span>
            </h1>

            <p className="mt-4 max-w-3xl text-sm leading-relaxed text-[#3B2A22] md:text-base">
              Conecte-se diretamente com as mãos talentosas de Capistrano. Peças únicas em cerâmica, bordados delicados, palha trançada e entalhe em madeira criados por quem vive e respira tradição.
            </p>
          </div>

          {/* Search */}
          <div className="mx-auto mt-6 md:mt-8 max-w-3xl">
            <div className="flex items-center gap-3 rounded-full border border-[#8B5A2B] bg-white px-4 py-3 focus-within:ring-2 focus-within:ring-[#A45A1F]/20 transition-all">
              <Search size={20} className="text-[#8B5A2B] shrink-0" />
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="w-full bg-transparent text-sm outline-none placeholder:text-[#8B5A2B]/60 md:text-base text-[#2B1B14]"
                placeholder="Buscar peça, artesão ou técnica..."
              />
              {query && (
                <button 
                  type="button"
                  onClick={() => setQuery("")}
                  className="text-[#8B5A2B]/60 hover:text-[#8B5A2B] p-0.5 rounded-full hover:bg-[#FFF4D6] transition-colors"
                >
                  <X size={16} />
                </button>
              )}
            </div>
          </div>

          {/* Filters */}
          <div className="mt-6 md:mt-8 grid grid-cols-1 gap-4 md:grid-cols-[180px,1fr] md:items-center">
            <div className="text-sm font-semibold text-[#8B5A2B] flex items-center gap-2 tracking-wider">
              <SlidersHorizontal size={16} className="stroke-[2.5]" />
              FILTRAR CATEGORIA
            </div>

            <div className="flex flex-wrap gap-2 md:justify-end">
              {FILTERS.map((f) => {
                const active = f === activeFilter;
                return (
                  <button
                    key={f}
                    type="button"
                    onClick={() => setActiveFilter(f)}
                    className={
                      active
                        ? "rounded-full bg-[#6B3B16] px-4 py-2 text-white text-sm font-medium transition-colors"
                        : "rounded-full border border-[#8B5A2B] bg-white px-4 py-2 text-[#8B5A2B] text-sm font-medium hover:bg-[#FFF4D6] transition-colors"
                    }
                  >
                    {f}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Meta */}
          <div className="mt-4 flex items-center justify-between gap-4">
            <div className="text-sm text-[#3B2A22]">Exibindo {filtered.length} produtos únicos</div>
            <button
              type="button"
              onClick={() => (window.location.href = "/login")}
              className="text-sm font-medium text-[#8B5A2B] hover:underline flex items-center gap-2"
            >
              <span aria-hidden>→</span>
              Entrar como artesão para expor peças
            </button>
          </div>

          {/* Grid */}
          <div className="mt-6 md:mt-8">
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {filtered.slice(0, 6).map((p) => (
                <article
                  key={p.id}
                  className="overflow-hidden rounded-2xl bg-white border border-[#E7D7C8] shadow-sm"
                >
                  <div className="relative">
                    <div className="h-44 w-full rounded-t-2xl bg-[#E7D7C8]/40" aria-label="Imagem do produto" />
                    <div className="absolute left-3 top-3 rounded-full bg-[#FFF4D6] px-3 py-1 text-[11px] font-bold text-[#8B5A2B]">
                      {p.material}
                    </div>
                  </div>

                  <div className="p-4">
                    <div className="text-xs font-medium text-[#7A6A60]">
                      Por: {p.artisan}
                    </div>

                    <div className="mt-2 text-base font-semibold text-[#2B1B14]">{p.title}</div>

                    <p className="mt-2 text-sm leading-relaxed text-[#3B2A22] line-clamp-2">
                      {p.description}
                    </p>

                    <div className="mt-4 flex items-center justify-between">
                      <div>
                        <div className="text-[11px] font-semibold text-[#7A6A60]">ESTIMATIVA</div>
                        <div className="text-base font-semibold text-[#2B1B14]">
                          {formatPrice(p.price)}
                        </div>
                      </div>

                      <button
                        type="button"
                        onClick={() => setSelectedProduct(p)}
                        className="rounded-full bg-[#1B1614] px-4 py-2 text-sm font-medium text-white hover:bg-black"
                      >
                        Ver Detalhes <span aria-hidden>➔</span>
                      </button>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Dropdown de Detalhes */}
      {selectedProduct && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
          <div className="relative w-full max-w-4xl bg-[#F9F9F9] rounded-3xl overflow-hidden shadow-2xl border border-[#E7D7C8] flex flex-col md:flex-row max-h-[90vh] md:max-h-[85vh]">
            
            {/* Botão de Fechar */}
            <button
              type="button"
              onClick={closeModal}
              className="absolute right-4 top-4 z-10 p-2 text-[#2B1B14] bg-white/80 hover:bg-white rounded-full transition-colors border border-[#E7D7C8]"
            >
              <X size={20} />
            </button>

            {/* Visual da Esquerda: Imagem */}
            <div className="w-full md:w-1/2 bg-[#E7D7C8]/30 relative flex flex-col justify-between p-6 min-h-[250px] md:min-h-full">
              <div className="flex-1 flex items-center justify-center text-center text-xs text-[#7A6A60] italic px-4">
                [imagem do produto aqui]
              </div>
              <div className="absolute bottom-4 left-4 bg-[#6B3B16] text-white text-[10px] font-bold tracking-widest px-3 py-1 rounded-md shadow-sm">
                SÉRIE LIMITADA
              </div>
            </div>

            {/* Visual da Direita: Informações */}
            <div className="w-full md:w-1/2 p-6 md:p-8 flex flex-col justify-between overflow-y-auto bg-white border-t md:border-t-0 md:border-l border-[#E7D7C8]">
              <div>
                <span className="text-[11px] font-bold tracking-widest text-[#8B5A2B] uppercase">
                  CATEGORIA: {selectedProduct.material}
                </span>
                <h2 className="text-xl md:text-2xl font-semibold text-[#2B1B14] mt-1">
                  {selectedProduct.title}
                </h2>

                <div className="mt-4 border-b border-[#E7D7C8] pb-3">
                  <span className="text-[10px] font-bold text-[#7A6A60] uppercase tracking-wider block">
                    PREÇO ESTIMADO
                  </span>
                  <div className="text-xl font-bold text-[#A45A1F] mt-0.5">
                    {formatPrice(selectedProduct.price)}{" "}
                    <span className="text-xs font-normal text-[#7A6A60] italic">
                      (conforme tamanho/detalhe)
                    </span>
                  </div>
                </div>

                <div className="mt-4">
                  <h3 className="text-xs font-bold text-[#7A6A60] uppercase tracking-wider">
                    DESCRIÇÃO DO ITEM
                  </h3>
                  <p className="text-sm text-[#3B2A22] mt-1 leading-relaxed">
                    {selectedProduct.description}
                  </p>
                </div>

                <div className="mt-5 p-4 rounded-xl bg-[#FFF4D6]/50 border border-[#FFF4D6]">
                  <h3 className="text-xs font-bold text-[#8B5A2B] uppercase tracking-wider">
                    ARTESÃO CRIADOR
                  </h3>
                  <div className="text-sm font-semibold text-[#2B1B14] mt-0.5">
                    {selectedProduct.artisan}
                  </div>
                  <div className="text-[11px] text-[#8B5A2B] font-medium mt-0.5">
                    {selectedProduct.material === "ARGILA" ? "Argila e Cerâmica" : selectedProduct.material}
                  </div>
                  <p className="text-xs text-[#3B2A22] italic mt-1.5 leading-relaxed">
                    "{selectedProduct.artisanBio || "Dedica sua vida à preservação das técnicas e matérias-primas tradicionais da nossa terra."}"
                  </p>
                </div>
              </div>

              {/* Ações de Contato */}
              <div className="mt-6 pt-4 border-t border-[#E7D7C8] flex flex-col gap-3">
                <button
                  type="button"
                  onClick={() => window.open(`https://wa.me/00?text=Olá! Tenho interesse no ${selectedProduct.title}`, "_blank")}
                  className="w-full py-2.5 rounded-full bg-[#8B4513] text-white text-sm font-medium hover:bg-[#6B3B16] transition-colors shadow-sm text-center"
                >
                  Entrar em Contato direto via WhatsApp
                </button>
                <div className="text-center text-xs text-[#7A6A60]">
                  E-mail: <span className="font-medium text-[#2B1B14]">{selectedProduct.email || "contato@capistrano.com"}</span>
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