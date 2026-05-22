import { supabase } from '../lib/supabase'

export const authService = {
  async cadastrar(email, password, nome, especiais) {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { nome_completo: nome }
      }
    })

    if (error) throw error

    if (data.user) {
      const { error: profileError } = await supabase
        .from('artesaos')
        .insert([{
          id: data.user.id,
          nome,
          especialidade: especiais.especialidade || 'OUTROS',
          biografia: especiais.biografia || '',
          telefone: especiais.celular || '',
          email,
        }])

      if (profileError) console.error('Erro ao criar perfil:', profileError)
    }

    return data
  },

  async login(email, password) {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password
    })
    if (error) throw error
    return data
  },

  async logout() {
    const { error } = await supabase.auth.signOut()
    if (error) throw error
  },

  async getUsuarioAtual() {
    const { data: { user } } = await supabase.auth.getUser()
    return user
  },

  onAuthStateChange(callback) {
    return supabase.auth.onAuthStateChange(callback)
  }
}