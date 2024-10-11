namespace PrefeituraCachoeiro.Dominio.Entidades
{
    public class GruposEntidade: EntidadeBase
    {
        public int IdGrupo { get; set; }
        public string? Nome { get; set; }
        public List<PermissoesEntidade> Permissoes { get; set; }
        public List<UsuariosGruposEntidade> Usuarios { get; set; }

        public GruposEntidade() : base()
        {

        }

        public GruposEntidade(string nome) : this()
        {
            this.Nome = nome;
        }
    }
}