import { useMemo, useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { MapPin, Search, X, SlidersHorizontal, UserPlus, LogIn, Menu } from 'lucide-react';
import { supabase } from "../lib/supabase";
import logo from "../assets/logo.png";


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
  const [menuOpen, setMenuOpen] = useState(false);
  
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);


  const closeModal = () => setSelectedProduct(null);

  useEffect(() => {
    async function carregarCatalogo() {
      try {
        setLoading(true);
        
        const { data, error } = await supabase
          .from('produtos')
          .select(`
            id,
            nome,
            categoria,
            descricao,
            preco,
            imagem,
            artesaos (
              nome,
              biografia,
              email,
              whatsapp,
              foto_perfil
            )
          `)
          .order('id', { ascending: false });

        if (error) throw error;

        const produtosFormatados = data.map(item => {
          let urlCompletaImagem = null;

          if (item.imagem) {
            if (item.imagem.startsWith('http')) {
              urlCompletaImagem = item.imagem;
            } else {
              const { data: publicUrlData } = supabase
                .storage
                .from('produtos')
                .getPublicUrl(item.imagem);
              urlCompletaImagem = publicUrlData?.publicUrl;
            }
          }

          return {
            id: item.id,
            title: item.nome,
            material: item.categoria ? item.categoria.toUpperCase() : "OUTROS",
            description: item.descricao || "Sem descrição disponível.",
            price: item.preco || 0,
            img: urlCompletaImagem,
            tags: [item.categoria || "Outros"],
            artisan: item.artesaos?.nome || "Artesão Desconhecido",
            artisanBio: item.artesaos?.biografia,
            email: item.artesaos?.email,
            whatsapp: item.artesaos?.whatsapp
          };
        });

        setProducts(produtosFormatados);
      } catch (err) {
        console.error("Erro ao carregar catálogo:", err.message);
      } finally {
        setLoading(false);
      }
    }

    carregarCatalogo();
  }, []);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    let list = products;

    if (activeFilter !== "Todos") {
      const normalized = activeFilter.toLowerCase();
      list = list.filter((p) => {
        if (activeFilter === "Outros") {
          return !["argila", "tecido", "madeira", "palha"].some(m => p.material.toLowerCase().includes(m));
        }
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
      <header className="mx-auto max-w-6xl px-4 pt-6">
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-5">

            <div className="flex h-16 w-16 flex-shrink-0 items-center justify-center rounded-full overflow-hidden">
              <img
                src={logo}
                alt="logo"
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

          <button
            type="button"
            className="sm:hidden inline-flex items-center justify-center rounded-full border border-[#8B5A2B] bg-white/70 p-2 text-[#8B5A2B]"
            aria-label="Abrir menu"
            onClick={() => setMenuOpen((v) => !v)}
          >
            <Menu size={20} />
          </button>

          <nav className="hidden sm:flex items-center gap-6 text-sm">
            <Link
              to="/catalogo"
              className="rounded-full bg-[#A45A1F] px-5 py-2 text-white font-medium"
            >
              Catálogo Principal
            </Link>

            <Link
              className="font-medium text-[#8B5A2B] hover:underline flex items-center gap-2"
              to="/cadastro"
            >
              <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-[#A45A1F] text-white">
                <UserPlus size={13} className="stroke-[2.5]" />
              </span>
              Quero me Cadastrar
            </Link>
            
            <Link
              to="/login"
              className="flex items-center gap-2 rounded-full border border-[#8B5A2B] px-4 py-2 font-medium hover:bg-white text-[#8B5A2B] transition-colors"
            >
              <LogIn size={16} />
              Entrar
            </Link>
          </nav>

          <div className={`sm:hidden absolute left-0 right-0 top-[88px] z-40 ${menuOpen ? 'block' : 'hidden'}`}>
            <div className="mx-auto max-w-6xl px-4 pt-3">
              <div className="rounded-3xl border border-[#E7D7C8] bg-white/95 backdrop-blur shadow-lg p-4 flex flex-col gap-3">
                <Link
                  to="/catalogo"
                  onClick={() => setMenuOpen(false)}
                  className="w-full text-center rounded-full bg-[#A45A1F] px-5 py-2 text-white font-medium"
                >
                  Catálogo Principal
                </Link>

                <Link
                  to="/cadastro"
                  onClick={() => setMenuOpen(false)}
                  className="w-full text-center font-medium text-[#8B5A2B] hover:underline flex items-center justify-center gap-2"
                >
                  <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-[#A45A1F] text-white">
                    <UserPlus size={13} className="stroke-[2.5]" />
                  </span>
                  Quero me Cadastrar
                </Link>

                <Link
                  to="/login"
                  onClick={() => setMenuOpen(false)}
                  className="w-full text-center flex items-center justify-center gap-2 rounded-full border border-[#8B5A2B] px-4 py-2 font-medium hover:bg-white text-[#8B5A2B] transition-colors"
                >
                  <LogIn size={16} />
                  Entrar
                </Link>
              </div>
            </div>
          </div>
        </div>
      </header>

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

          <div className="mt-4 flex items-center justify-between gap-4">
            <div className="text-sm text-[#3B2A22]">
              {loading ? "Carregando peças..." : `Exibindo ${filtered.length} produtos únicos`}
            </div>
            <Link
              to="/login"
              className="text-sm font-medium text-[#8B5A2B] hover:underline flex items-center gap-2"
            >
              <span aria-hidden>→</span>
              Entrar como artesão para expor peças
            </Link>
          </div>

          <div className="mt-6 md:mt-8">
            {loading ? (
              <div className="text-center py-12 text-[#8B5A2B] font-medium">Buscando obras em Capistrano...</div>
            ) : (
              <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
                {filtered.map((p) => (
                  <article
                    key={p.id}
                    className="overflow-hidden rounded-2xl bg-white border border-[#E7D7C8] shadow-sm"
                  >
                    <div className="relative h-44 w-full bg-[#E7D7C8]/40">
                      {p.img ? (
                        <img 
                          src={p.img} 
                          alt={p.title} 
                          className="h-full w-full object-cover rounded-t-2xl"
                        />
                      ) : (
                        <div className="h-full w-full flex items-center justify-center text-xs text-[#7A6A60] italic">
                          [Sem imagem]
                        </div>
                      )}
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
            )}
          </div>
        </div>
      </section>

      {selectedProduct && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="relative w-full max-w-4xl bg-[#F9F9F9] rounded-3xl overflow-hidden shadow-2xl border border-[#E7D7C8] flex flex-col md:flex-row max-h-[90vh] md:max-h-[85vh]">
            
            <button
              type="button"
              onClick={closeModal}
              className="absolute right-4 top-4 z-10 p-2 text-[#2B1B14] bg-white/80 hover:bg-white rounded-full transition-colors border border-[#E7D7C8]"
            >
              <X size={20} />
            </button>

            <div className="w-full md:w-1/2 bg-[#E7D7C8]/30 relative flex flex-col justify-between min-h-[250px] md:min-h-full">
              {selectedProduct.img ? (
                <img 
                  src={selectedProduct.img} 
                  alt={selectedProduct.title} 
                  className="absolute inset-0 h-full w-full object-cover"
                />
              ) : (
                <div className="flex-1 flex items-center justify-center text-center text-xs text-[#7A6A60] italic px-4">
                  [Sem imagem do produto]
                </div>
              )}
              <div className="absolute bottom-4 left-4 bg-[#6B3B16] text-white text-[10px] font-bold tracking-widest px-3 py-1 rounded-md shadow-sm z-10">
                SÉRIE LIMITADA
              </div>
            </div>

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
                  <p className="text-xs text-[#3B2A22] italic mt-1.5 leading-relaxed">
                    "{selectedProduct.artisanBio || "Dedica sua vida à preservação das técnicas e matérias-primas tradicionais da nossa terra."}"
                  </p>
                </div>
              </div>

              <div className="mt-6 pt-4 border-t border-[#E7D7C8] flex flex-col gap-3">
                <button
                  type="button"
                  onClick={() => {
                    const numero = selectedProduct.whatsapp ? selectedProduct.whatsapp.replace(/\D/g, '') : "00";
                    window.open(`https://wa.me/${numero}?text=Olá! Vi o seu trabalho no portal Artesãos de Capistrano e tenho interesse na peça: ${selectedProduct.title}`, "_blank");
                  }}
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
