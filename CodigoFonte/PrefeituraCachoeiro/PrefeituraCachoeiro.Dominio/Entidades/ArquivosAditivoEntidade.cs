namespace PrefeituraCachoeiro.Dominio.Entidades
{
    public class ArquivosAditivoEntidade : EntidadeBase
    {
        public int Id { get; set; }
        public int IdAditivo { get; set; }
        public AditivosEntidade Aditivos { get; set; }
        public string ArquivoAditivo { get; set; }

        public ArquivosAditivoEntidade()
        {
            this.Create();
        }

        public ArquivosAditivoEntidade(int idAditivos, string arquivoAditivo) : this()
        {
            this.IdAditivo = idAditivos;
            this.ArquivoAditivo = arquivoAditivo;
        }
    }
}