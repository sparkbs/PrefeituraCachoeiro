namespace PrefeituraCachoeiro.Dominio.Entidades
{
    public class AditivosEntidade : EntidadeBase
    {
        public int IdAditivo { get; set; }
        public int ContratoId { get; set; }
        public string TipoAditivo { get; set; }
        public DateTime DataAssinatura { get; set; }
        public DateTime DataValidade { get; set; }
        public List<ItemsAditivoEntidade> Items { get; set; }
        public List<ArquivosAditivoEntidade> ArquivosAditivos { get; set; }
        public string Descricao { get; set; }

        public AditivosEntidade() : base()
        {

        }
    }
}