namespace PrefeituraCachoeiro.Dominio.Entidades
{
    public class TipoPermissoesEntidade: EntidadeBase
    {
        public int IdTipoPermissao { get; set; }
        public string? Nome { get; set; }
        public List<PermissoesEntidade> Permissoes { get; set; }
    }
}