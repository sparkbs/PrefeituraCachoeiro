namespace PrefeituraCachoeiro.Dominio.Dto
{
    public class ItemsContratoDto
    {
        public int IdItemContrato { get; set; }
        public int ContratosId { get; set; }
        public int ItemIdItem { get; set; }
        //remover public ItemEntidade Item { get; set; }
        public int QuantidadeIdQuantidade { get; set; }
        //public QuantidadeEntidade Quantidade { get; set; }
        public decimal Unidade { get; set; }
        public decimal ValorSemBdi { get; set; }
        public decimal ValorComBdi { get; set; }
        public decimal ValorTotalComBdi { get; set; }
    }
}