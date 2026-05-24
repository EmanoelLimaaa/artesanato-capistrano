import { useState, useEffect } from "react";
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
  Upload,
} from "lucide-react";
import { supabase } from "../lib/supabase";
import logo from "../assets/logo.png";

const formatPrice = (value) =>
  new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(value);

export default function Painel() {
  // Estados do Banco de Dados
  const [user, setUser] = useState(null);
  const [artesao, setArtesao] = useState(null);
  const [produtos, setProdutos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [uploadingFotoPerfil, setUploadingFotoPerfil] = useState(false);
  const [fotoPerfil, setFotoPerfil] = useState("");

  // Estados dos Modais e Telas
  const [mostrarEdicao, setMostrarEdicao] = useState(false);
  const [mostrarNovoProduto, setMostrarNovoProduto] = useState(false);
  const [produtoSelecionado, setProdutoSelecionado] = useState(null);

  // Formulários
  const [formPerfil, setFormPerfil] = useState({
    nome: "",
    especialidade: "ARGILA E CERÂMICA",
    biografia: "",
    telefone: "",
  });

  const [novoProduto, setNovoProduto] = useState({
    nome: "",
    descricao: "",
    categoria: "ARGILA E CERÂMICA",
    preco: "",
    imagem: "",
  });

  // Carrega os dados do usuário autenticado ao montar o componente
  useEffect(() => {
    async function carregarDados() {
      try {
        setLoading(true);
        
        // 1. Pega o usuário logado no Auth do Supabase
        const { data: { user: sessionUser }, error: userError } = await supabase.auth.getUser();
        if (userError || !sessionUser) {
          window.location.href = "/login";
          return;
        }
        setUser(sessionUser);

        // 2. Busca o perfil do artesão na tabela pública
        const { data: perfilData, error: perfilError } = await supabase
          .from("artesaos")
          .select("*")
          .eq("id", sessionUser.id)
          .single();

        if (perfilError) throw perfilError;
        setArtesao(perfilData);
        setFormPerfil({
          nome: perfilData.nome,
          especialidade: perfilData.especialidade,
          biografia: perfilData.biografia || "",
          telefone: perfilData.whatsapp || "",
        });
        setFotoPerfil(perfilData.foto_perfil || "");

        // 3. Busca apenas as peças do artesão específico
        const { data: produtosData, error: produtosError } = await supabase
          .from("produtos")
          .select("*")
          .eq("artesao_id", sessionUser.id);

        if (produtosError) throw produtosError;
        setProdutos(produtosData || []);

      } catch (err) {
        console.error("Erro ao carregar dados do painel:", err);
      } finally {
        setLoading(false);
      }
    }

    carregarDados();
  }, []);

  // Inicial do nome do Artesão para o avatar
  const iniciais = artesao?.nome
    ? artesao.nome
        .split(" ")
        .slice(0, 2)
        .map((palavra) => palavra.charAt(0))
        .join("")
        .toUpperCase()
    : "AR";

  // Logout do sistema
  const handleLogout = async () => {
    await supabase.auth.signOut();
    window.location.href = "/login";
  };

  // Salvar alterações de foto de perfil para o bucket imagens
  const handleUploadFotoPerfil = async (e) => {
    const file = e.target.files?.[0];
    if (!file) {
      alert("Nenhum arquivo selecionado.");
      return;
    }


    try {
      setUploadingFotoPerfil(true);

      const fileExt = file.name ? file.name.split(".").pop().toLowerCase() : "jpg";
      const fileName = `perfis/${user.id}_${Date.now()}_${Math.random().toString(36).substring(2, 7)}.${fileExt}`;
      const detectType = file.type || `image/${fileExt === "png" ? "png" : "jpeg"}`;

      // Aponta para o bucket imagens
      const { error: uploadError } = await supabase.storage
        .from("imagens")
        .upload(fileName, file, {
          contentType: detectType,
          cacheControl: "3600",
          upsert: true,
        });

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from("imagens")
        .getPublicUrl(fileName);

      const { error: updateError } = await supabase
        .from("artesaos")
        .update({ foto_perfil: publicUrl })
        .eq("id", user.id);

      if (updateError) throw updateError;

      setFotoPerfil(publicUrl);
      setArtesao((prev) => ({
        ...prev,
        foto_perfil: publicUrl,
      }));

      alert("Foto do perfil atualizada com sucesso!");
    } catch (err) {
      console.error("Erro ao atualizar foto do perfil:", err);
      alert("Erro ao atualizar foto do perfil: " + err.message);
    } finally {
      if (e.target) e.target.value = "";
      setUploadingFotoPerfil(false);
    }
  };

  const salvarPerfil = async (e) => {
    e.preventDefault();
    try {
      const { error } = await supabase
        .from("artesaos")
        .update({
          nome: formPerfil.nome,
          especialidade: formPerfil.especialidade,
          biografia: formPerfil.biografia,
          whatsapp: formPerfil.telefone.replace(/\D/g, ""), 
        })
        .eq("id", user.id);

      if (error) throw error;

      setArtesao((prev) => ({
        ...prev,
        nome: formPerfil.nome,
        especialidade: formPerfil.especialidade,
        biografia: formPerfil.biografia,
        whatsapp: formPerfil.telefone.replace(/\D/g, ""),
      }));

      setMostrarEdicao(false);
      alert("Foto de perfil atualizada!");
    } catch (err) {
      alert("Erro ao atualizar perfil: " + err.message);
    }
  };

  // Upload da imagem
  const handleUploadImagem = async (e) => {
    const file = e.target.files?.[0];
    if (!file) {
      alert("Nenhum arquivo selecionado.");
      return;
    }


    try {
      setUploading(true);

      const fileExt = file.name ? file.name.split(".").pop().toLowerCase() : "jpg";
      const fileName = `${user.id}/${Date.now()}_${Math.random().toString(36).substring(2, 7)}.${fileExt}`;
      const detectType = file.type || `image/${fileExt === "png" ? "png" : "jpeg"}`;

      const { error: uploadError } = await supabase.storage
        .from("produtos")
        .upload(fileName, file, {
          contentType: detectType,
          cacheControl: "3600",
          upsert: true
        });

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from("produtos")
        .getPublicUrl(fileName);

      setNovoProduto((prev) => ({ ...prev, imagem: publicUrl }));
      alert("Imagem carregada com sucesso!");

    } catch (error) {
      console.error("Erro no upload:", error);
      alert("Erro no upload da imagem: " + error.message);
    } finally {
      if (e.target) e.target.value = "";
      setUploading(false);
    }
  };

  // Adicionar um novo produto preenchendo 'preco' e 'preco_sugerido' para manter compatibilidade com a estrutura antiga do banco
  const adicionarProduto = async (e) => {
    e.preventDefault();
    if (!novoProduto.nome || !novoProduto.preco) {
      alert("Nome e preço são obrigatórios.");
      return;
    }

    try {
      const valorNumerico = parseFloat(novoProduto.preco);

      const { data, error } = await supabase
        .from("produtos")
        .insert([
          {
            artesao_id: user.id,
            nome: novoProduto.nome,
            descricao: novoProduto.descricao,
            categoria: novoProduto.categoria || "ARGILA E CERÂMICA",
            preco_sugerido: valorNumerico, // Mantém compatibilidade com coluna antiga
            preco: valorNumerico,          // Atualiza a nova coluna mapeada no banco
            imagem: novoProduto.imagem || null,
          },
        ])
        .select()
        .single();

      if (error) throw error;

      setProdutos((prev) => [data, ...prev]);
      setNovoProduto({ nome: "", descricao: "", categoria: "ARGILA E CERÂMICA", preco: "", imagem: "" });
      setMostrarNovoProduto(false);
      alert("Sua peça foi exposta no catálogo!");
    } catch (err) {
      console.error("Erro detalhado:", err);
      alert(`Erro ao publicar produto: ${err.message}.`);
    }
  };

  // Remover produto do banco de dados
  const removerProduto = async (id) => {
    if (!confirm("Tem certeza que deseja remover esta peça da sua vitrine?")) return;

    try {
      const { error } = await supabase.from("produtos").delete().eq("id", id);
      if (error) throw error;

      setProdutos((prev) => prev.filter((p) => p.id !== id));
    } catch (err) {
      alert("Erro ao remover produto: " + err.message);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F9F9F9] flex items-center justify-center text-[#8B5A2B] font-medium">
        Carregando seu painel de artesão...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F9F9F9] text-[#2B1B14]">
      {/* Header */}
      <header className="mx-auto max-w-6xl px-4 pt-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-4">
          <div className="flex items-center gap-5">
            <div className="flex h-16 w-16 flex-shrink-0 items-center justify-center rounded-full overflow-hidden">
              <img src={logo} alt="logo"
                className="h-full w-full rounded-full object-cover object-center"
              />
            </div>
            <div className="leading-tight">
              <div className="text-lg font-semibold">Artesanato de Capistrano</div>
              <div className="text-[11px] font-medium tracking-wide text-[#8B5A2B]">
                Capistrano - CE
              </div>
            </div>
          </div>
          <nav className="flex flex-wrap items-center gap-2 sm:gap-4 text-sm">
            <a href="/catalogo" className="font-medium text-[#8B5A2B] hover:underline">
              Catálogo Principal
            </a>

            <button className="flex items-center gap-2 rounded-full bg-[#6B3B16] px-4 py-2 text-white font-medium">
              <User size={14} />
              Painel de {artesao?.nome ? artesao.nome.split(" ").slice(-1) : ""}
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
                {fotoPerfil ? (
                  <img src={fotoPerfil} alt="Foto do perfil" className="h-full w-full object-cover" />
                ) : (
                  <span className="text-2xl font-bold text-[#6B3B16]">{iniciais}</span>
                )}
              </div>

              <div className="flex flex-col gap-3">
                <div className="flex flex-wrap items-center gap-3">
                  <h1 className="text-xl font-bold text-[#2B1B14]">{artesao?.nome}</h1>
                  <span className="inline-flex items-center rounded-full bg-[#FFF4D6] px-3 py-1 text-[10px] font-bold tracking-widest text-[#8B5A2B] uppercase">
                    {artesao?.especialidade}
                  </span>
                </div>

                <p className="max-w-xl text-sm italic leading-relaxed text-[#3B2A22]">
                  {artesao?.biografia || "Nenhuma biografia inserida ainda."}
                </p>

                <div className="flex flex-wrap items-center gap-6 text-sm text-[#8B5A2B]">
                  <a href={`https://wa.me/${artesao?.whatsapp}`} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 hover:text-[#A45A1F]">
                    <Phone size={14} strokeWidth={1.5} />
                    {artesao?.whatsapp}
                  </a>
                  <div className="flex items-center gap-2 text-[#A07A55]">
                    <Mail size={14} strokeWidth={1.5} />
                    {artesao?.email}
                  </div>
                </div>
              </div>
            </div>

            {/* Lado Direito — Ações */}
            <div className="flex flex-row flex-wrap gap-3 lg:flex-col lg:items-end">
              <button
                onClick={() => setMostrarEdicao(true)}
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
              <button onClick={handleLogout} className="flex items-center gap-2 text-sm text-[#A07A55] hover:text-[#8B5A2B] transition-colors">
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
            <span className="text-xs text-[#A07A55]">{produtos.length} produto(s) ativo(s)</span>
          </div>

          <div className="h-px bg-[#E7D7C8]" />

          {produtos.length === 0 ? (
            <div className="mt-8 flex flex-col items-center justify-center rounded-3xl border-2 border-dashed border-[#E7D7C8] py-16">
              <Package size={48} className="text-[#E7D7C8]" strokeWidth={1} />
              <p className="mt-4 text-sm text-[#8B5A2B]">Nenhum produto cadastrado ainda.</p>
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
                <article key={produto.id} className="overflow-hidden rounded-2xl border border-[#E7D7C8] bg-white">
                  <div className="relative">
                    <div className="h-48 min-h-[12rem] w-full bg-[#F5EFE6] flex items-center justify-center text-[#A07A55] text-xs">
                      {produto.imagem ? (
                        <img src={produto.imagem} alt={produto.nome} className="h-full w-full object-cover" />
                      ) : (
                        "Sem foto da peça"
                      )}
                    </div>
                    <div className="absolute left-3 top-3 rounded-full bg-[#FFF4D6] px-3 py-1 text-[10px] font-bold text-[#8B5A2B] uppercase">
                      {produto.categoria}
                    </div>
                  </div>

                  <div className="p-4">
                    <h3 className="font-semibold text-[#2B1B14]">{produto.nome}</h3>
                    <p className="mt-1 text-xs leading-relaxed text-[#3B2A22] line-clamp-2">{produto.descricao}</p>

                    <div className="mt-4 flex flex-col gap-3 sm:flex-row items-start sm:items-center justify-between border-t border-[#E7D7C8] pt-4">
                      <div>
                        <div className="text-[10px] font-semibold text-[#7A6A60] uppercase">Valor Sugerido</div>
                        <div className="text-base font-bold text-[#A45A1F]">
                          {formatPrice(produto.preco !== undefined && produto.preco !== null ? produto.preco : produto.preco_sugerido)}
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => setProdutoSelecionado(produto)}
                          className="flex items-center gap-1.5 rounded-xl border border-[#6B3B16] px-3 py-1.5 text-xs font-medium text-[#6B3B16] hover:bg-[#FFF4D6] transition-colors"
                        >
                          Ver <ExternalLink size={12} />
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
              <button onClick={() => setMostrarEdicao(false)} className="p-2 text-[#8B5A2B] hover:text-[#A45A1F] transition-colors">
                <X size={20} />
              </button>
            </div>
            <form onSubmit={salvarPerfil} className="p-4 sm:p-6 flex flex-col gap-4 overflow-y-auto">
              <div>
                <label className="text-[10px] font-bold tracking-widest text-[#8B5A2B] uppercase block mb-1">
                  Foto do perfil
                </label>
                <div className="flex flex-col items-center gap-3 rounded-xl border border-[#E7D7C8] bg-[#F5EFE6]/30 p-4">
                  <div className="h-20 w-20 rounded-full overflow-hidden flex items-center justify-center bg-[#FFF4D6]">
                    {fotoPerfil ? (
                      <img src={fotoPerfil} alt="Foto do perfil" className="h-full w-full object-cover" />
                    ) : (
                      <span className="text-base font-bold text-[#6B3B16]">{iniciais}</span>
                    )}
                  </div>
                  <label className="flex flex-col items-center gap-2 cursor-pointer text-sm text-[#8B5A2B] hover:text-[#A45A1F]">
                    <Upload size={20} strokeWidth={1.5} />
                    <span>{uploadingFotoPerfil ? "Enviando..." : "Clique para atualizar"}</span>
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={handleUploadFotoPerfil}
                      disabled={uploadingFotoPerfil}
                    />
                  </label>
                </div>
              </div>
              <div>
                <label className="text-[10px] font-bold tracking-widest text-[#8B5A2B] uppercase">Nome Completo</label>
                <input
                  value={formPerfil.nome}
                  onChange={(e) => setFormPerfil({ ...formPerfil, nome: e.target.value })}
                  className="mt-1 w-full rounded-xl border border-[#E7D7C8] bg-white px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-[#A45A1F]/20"
                />
              </div>
              <div>
                <label className="text-[10px] font-bold tracking-widest text-[#8B5A2B] uppercase">Especialidade</label>
                <select
                  value={formPerfil.especialidade}
                  onChange={(e) => setFormPerfil({ ...formPerfil, especialidade: e.target.value })}
                  className="mt-1 w-full rounded-xl border border-[#E7D7C8] bg-white px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-[#A45A1F]/20"
                >
                  <option value="ARGILA E CERÂMICA">ARGILA E CERÂMICA</option>
                  <option value="TÊXTIL E BORDADO">TÊXTIL E BORDADO</option>
                  <option value="MADEIRA E ENTALHE">MADEIRA E ENTALHE</option>
                  <option value="PALHA E TRANÇADO">PALHA E TRANÇADO</option>
                  <option value="OUTROS">OUTROS</option>
                </select>
              </div>
              <div>
                <label className="text-[10px] font-bold tracking-widest text-[#8B5A2B] uppercase">Biografia</label>
                <textarea
                  value={formPerfil.biografia}
                  onChange={(e) => setFormPerfil({ ...formPerfil, biografia: e.target.value })}
                  rows={3}
                  className="mt-1 w-full resize-none rounded-xl border border-[#E7D7C8] bg-white px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-[#A45A1F]/20"
                />
              </div>
              <div>
                <label className="text-[10px] font-bold tracking-widest text-[#8B5A2B] uppercase">Telefone / WhatsApp</label>
                <input
                  value={formPerfil.telefone}
                  onChange={(e) => setFormPerfil({ ...formPerfil, telefone: e.target.value })}
                  className="mt-1 w-full rounded-xl border border-[#E7D7C8] bg-white px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-[#A45A1F]/20"
                />
              </div>
              <div className="flex gap-3 pt-2 shrink-0">
                <button type="button" onClick={() => setMostrarEdicao(false)} className="flex-1 rounded-xl border border-[#E7D7C8] py-3 text-sm font-medium text-[#8B5A2B] hover:bg-[#F9F9F9] transition-colors">
                  Cancelar
                </button>
                <button type="submit" className="flex-1 rounded-xl bg-[#6B3B16] py-3 text-sm font-semibold text-white hover:bg-[#5A3214] transition-colors">
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
              <button onClick={() => setMostrarNovoProduto(false)} className="p-2 text-[#8B5A2B] hover:text-[#A45A1F] transition-colors">
                <X size={20} />
              </button>
            </div>
            <form onSubmit={adicionarProduto} className="p-4 sm:p-6 flex flex-col gap-4 overflow-y-auto">
              <div>
                <label className="text-[10px] font-bold tracking-widest text-[#8B5A2B] uppercase block mb-1">
                  Foto da Peça
                </label>
                <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-[#E7D7C8] p-4 bg-[#F5EFE6]/30">
                  {novoProduto.imagem ? (
                    <div className="relative h-32 w-full rounded-lg overflow-hidden">
                      <img src={novoProduto.imagem} alt="Preview" className="h-full w-full object-cover" />
                      <button
                        type="button"
                        onClick={() => setNovoProduto({ ...novoProduto, imagem: "" })}
                        className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                      >
                        <X size={14} />
                      </button>
                    </div>
                  ) : (
                    <label className="flex flex-col items-center gap-2 cursor-pointer text-sm text-[#8B5A2B] hover:text-[#A45A1F]">
                      <Upload size={24} strokeWidth={1.5} />
                      <span>{uploading ? "Enviando arquivo..." : "Clique para selecionar a foto"}</span>
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={handleUploadImagem}
                        disabled={uploading}
                      />
                    </label>
                  )}
                </div>
              </div>
              <div>
                <label className="text-[10px] font-bold tracking-widest text-[#8B5A2B] uppercase">Nome do Produto</label>
                <input
                  value={novoProduto.nome}
                  onChange={(e) => setNovoProduto({ ...novoProduto, nome: e.target.value })}
                  placeholder="Ex: Vaso de Argila Pintado"
                  className="mt-1 w-full rounded-xl border border-[#E7D7C8] bg-white px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-[#A45A1F]/20"
                />
              </div>
              <div>
                <label className="text-[10px] font-bold tracking-widest text-[#8B5A2B] uppercase">Descrição</label>
                <textarea
                  value={novoProduto.descricao}
                  onChange={(e) => setNovoProduto({ ...novoProduto, descricao: e.target.value })}
                  placeholder="Descreva o produto..."
                  rows={3}
                  className="mt-1 w-full resize-none rounded-xl border border-[#E7D7C8] bg-white px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-[#A45A1F]/20"
                />
              </div>
              <div>
                <label className="text-[10px] font-bold tracking-widest text-[#8B5A2B] uppercase">Categoria</label>
                <select
                  value={novoProduto.categoria}
                  onChange={(e) => setNovoProduto({ ...novoProduto, categoria: e.target.value })}
                  className="mt-1 w-full rounded-xl border border-[#E7D7C8] bg-white px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-[#A45A1F]/20"
                >
                  <option value="ARGILA E CERÂMICA">ARGILA E CERÂMICA</option>
                  <option value="TÊXTIL E BORDADO">TÊXTIL E BORDADO</option>
                  <option value="MADEIRA E ENTALHE">MADEIRA E ENTALHE</option>
                  <option value="PALHA E TRANÇADO">PALHA E TRANÇADO</option>
                  <option value="OUTROS">OUTROS</option>
                </select>
              </div>
              <div>
                <label className="text-[10px] font-bold tracking-widest text-[#8B5A2B] uppercase">Preço (R$)</label>
                <input
                  value={novoProduto.preco}
                  onChange={(e) => setNovoProduto({ ...novoProduto, preco: e.target.value })}
                  placeholder="120"
                  type="number"
                  className="mt-1 w-full rounded-xl border border-[#E7D7C8] bg-white px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-[#A45A1F]/20"
                />
              </div>
              <div className="flex gap-3 pt-2 shrink-0">
                <button type="button" onClick={() => setMostrarNovoProduto(false)} className="flex-1 rounded-xl border border-[#E7D7C8] py-3 text-sm font-medium text-[#8B5A2B] hover:bg-[#F9F9F9] transition-colors">
                  Cancelar
                </button>
                <button type="submit" className="flex-1 rounded-xl bg-[#6B3B16] py-3 text-sm font-semibold text-white hover:bg-[#5A3214] transition-colors">
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
            <button onClick={() => setProdutoSelecionado(null)} className="absolute right-4 top-4 z-10 p-2 bg-white/80 hover:bg-white rounded-full transition-colors border border-[#E7D7C8]">
              <X size={20} />
            </button>

            {/* Lado Esquerdo: Imagem */}
            <div className="w-full md:w-1/2 bg-[#E7D7C8]/30 flex flex-col justify-center items-center p-6 min-h-[250px] md:min-h-full">
              {produtoSelecionado.imagem ? (
                <img src={produtoSelecionado.imagem} alt={produtoSelecionado.nome} className="h-full w-full object-cover rounded-xl" />
              ) : (
                <div className="text-[#A07A55] text-sm">Sem imagem disponível</div>
              )}
            </div>

            {/* Lado Direito: Informações */}
            <div className="w-full md:w-1/2 p-6 md:p-8 flex flex-col justify-between overflow-y-auto bg-white border-t md:border-t-0 md:border-l border-[#E7D7C8]">
              <div>
                <span className="text-[11px] font-bold tracking-widest text-[#8B5A2B] uppercase">
                  Categoria: {produtoSelecionado.categoria}
                </span>
                <h2 className="text-xl md:text-2xl font-semibold text-[#2B1B14] mt-1">{produtoSelecionado.nome}</h2>

                <div className="mt-4 border-b border-[#E7D7C8] pb-3">
                  <span className="text-[10px] font-bold text-[#7A6A60] uppercase tracking-wider block">Preço Estimado</span>
                  <div className="text-xl font-bold text-[#A45A1F] mt-0.5">
                    {formatPrice(produtoSelecionado.preco !== undefined && produtoSelecionado.preco !== null ? produtoSelecionado.preco : produtoSelecionado.preco_sugerido)}{" "}
                    <span className="text-xs font-normal text-[#7A6A60] italic">(conforme tamanho/detalhe)</span>
                  </div>
                </div>

                <div className="mt-4">
                  <h3 className="text-xs font-bold text-[#7A6A60] uppercase tracking-wider">Descrição</h3>
                  <p className="text-sm text-[#3B2A22] mt-1 leading-relaxed">{produtoSelecionado.descricao}</p>
                </div>
              </div>

              {/* Ações */}
              <div className="mt-6 pt-4 border-t border-[#E7D7C8] flex flex-col gap-3">
                <button
                  type="button"
                  onClick={() => window.open(`https://wa.me/${artesao?.whatsapp}?text=Olá, tenho interesse no seu produto ${produtoSelecionado.nome} exposto no site!`, "_blank")}
                  className="w-full py-2.5 rounded-full bg-[#8B4513] text-white text-sm font-medium hover:bg-[#6B3B16] transition-colors shadow-sm text-center"
                >
                  Visualizar como Cliente (Testar WhatsApp)
                </button>
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
        </div>
      </footer>
    </div>
  );
}