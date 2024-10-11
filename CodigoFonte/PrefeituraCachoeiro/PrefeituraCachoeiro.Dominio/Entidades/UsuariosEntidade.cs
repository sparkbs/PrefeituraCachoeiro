namespace PrefeituraCachoeiro.Dominio.Entidades
{
    public class UsuariosEntidade: EntidadeBase
    {
        public int IdUsuario { get; set; }
        public string? Login { get; set; }
        public string? Nome { get; set; }
        public string? Senha { get; set; }
        public List<UsuariosGruposEntidade> Grupos { get; set; }

        public UsuariosEntidade(): base()
        {

        }

        public UsuariosEntidade(string login, string nome, string senha)
        {
            Login = login;
            Nome = nome;
            Senha = senha;
        }
    }
}