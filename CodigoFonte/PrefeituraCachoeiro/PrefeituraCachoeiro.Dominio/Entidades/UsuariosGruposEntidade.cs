namespace PrefeituraCachoeiro.Dominio.Entidades
{
    public class UsuariosGruposEntidade: EntidadeBase
    {
        public int IdUsuarioGrupo { get; set; }
        public int IdUsuario { get; set; }
        public UsuariosEntidade Usuario { get; set; }
        public int IdGrupo { get; set; }
        public GruposEntidade Grupo { get; set; }

        public UsuariosGruposEntidade(): base()
        {

        }

        public UsuariosGruposEntidade(int idUsuario, int idGrupo): base()
        {
            this.IdUsuario = idUsuario;
            this.IdGrupo = idGrupo;
        }
    }
}