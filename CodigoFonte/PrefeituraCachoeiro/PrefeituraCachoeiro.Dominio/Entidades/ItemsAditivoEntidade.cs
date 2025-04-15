namespace PrefeituraCachoeiro.Dominio.Entidades
{
    public class ItemsAditivoEntidade : EntidadeBase
    {
        public int IdItemAditivo { get; set; }
        public int AditivoId { get; set; }
        public AditivosEntidade Aditivo { get; set; }
        public int ItemId { get; set; }
        public ItemEntidade Item { get; set; }
        public int QuantidadeId { get; set; }
        public decimal Unidade { get; set; }
        public decimal ValorSemBdi { get; set; }
        public decimal ValorComBdi { get; set; }
        public decimal ValorTotalComBdi { get; set; }

        public ItemsAditivoEntidade(): base()
        {

        }
    }
}