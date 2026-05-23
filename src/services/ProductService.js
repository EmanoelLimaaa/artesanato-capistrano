import { supabase } from '../lib/supabase'

export const productService = {
  // 1. ATUALIZAR PERFIL DO ARTESÃO (Painel do Usuário)
  async atualizarPerfil(id, dadosPerfil) {
    const { data, error } = await supabase
      .from('artesaos')
      .upsert({ id, ...dadosPerfil })
    
    if (error) throw error
    return data
  },

  // 2. PUBLICAR NOVA PEÇA (Expor Peça)
  async publicarPeca(artesaoId, dadosPeca) {
    const { data, error } = await supabase
      .from('produtos')
      .insert([{ artesao_id: artesaoId, ...dadosPeca }])

    if (error) throw error
    return data
  },

  // 3. ENVIAR FOTO (Para Perfil ou Produto)
  async uploadFoto(bucket, pasta, arquivo) {
    const fileExt = arquivo.name.split('.').pop()
    const fileName = `${pasta}/${Math.random()}.${fileExt}` 

    const { error: uploadError } = await supabase.storage
      .from(bucket)
      .upload(fileName, arquivo)

    if (uploadError) throw uploadError

    // Pega a URL pública da imagem enviada
    const { data } = supabase.storage.from(bucket).getPublicUrl(fileName)
    return data.publicUrl
  }
}