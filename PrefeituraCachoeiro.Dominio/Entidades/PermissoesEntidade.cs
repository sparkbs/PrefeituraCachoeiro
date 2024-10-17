namespace PrefeituraCachoeiro.Dominio.Entidades
{
    public class PermissoesEntidade: EntidadeBase
    {
        public int IdPermissao { get; set; }
        public int IdTipoPermissao { get; set; }
        public TipoPermissoesEntidade TipoPermissao { get; set; }
        public int IdGrupo { get; set; }
        public GruposEntidade Grupo { get; set; }

        public PermissoesEntidade(): base()
        {

        }

        public PermissoesEntidade(int idTipoPermissao, int idGrupo): base()
        {
            this.IdTipoPermissao = idTipoPermissao;
            this.IdGrupo = idGrupo;
        }
    }
}