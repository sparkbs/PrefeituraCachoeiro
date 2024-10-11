namespace PrefeituraCachoeiro.Dominio.Entidades
{
    public class ItemsContratoEntidade: EntidadeBase
    {
        public int IdItemContrato { get; set; }
        public int IdContrato { get; set; }
        public ContratosEntidade Contratos { get; set; }
        public int ItemIdItem { get; set; }
        public ItemEntidade Item { get; set; }
        public int QuantidadeIdQuantidade { get; set; }
        public QuantidadeEntidade Quantidade { get; set; }
        public decimal Unidade { get; set; }
        public decimal ValorSemBdi { get; set; }
        public decimal ValorComBdi { get; set; }
        public decimal ValorTotalComBdi { get; set; }

        public ItemsContratoEntidade(int idContrato, int idItem, int idQuantidade, decimal unidade,
            decimal valorSemBdi, decimal valorComBdi, decimal valorTotalComBdi): base()
        {
            this.IdContrato = idContrato;
            this.ItemIdItem = idItem;
            this.QuantidadeIdQuantidade = idQuantidade;
            this.Unidade = unidade;
            this.ValorSemBdi = valorSemBdi;
            this.ValorComBdi = valorComBdi;
            this.ValorTotalComBdi = valorTotalComBdi;
        }

        public ItemsContratoEntidade(): base()
        {

        }
    }
}