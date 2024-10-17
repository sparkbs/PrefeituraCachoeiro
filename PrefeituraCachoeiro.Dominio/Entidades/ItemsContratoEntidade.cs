namespace PrefeituraCachoeiro.Dominio.Entidades
{
    public class ItemsContratoEntidade: EntidadeBase
    {
        public int IdItemContrato { get; set; }
        public int ContratosId { get; set; }
        public ContratosEntidade Contrato { get; set; }
        public int ItemId { get; set; }
        public ItemEntidade Item { get; set; }
        public int QuantidadeId { get; set; }
        public QuantidadeEntidade Quantidade { get; set; }
        public decimal Unidade { get; set; }
        public decimal ValorSemBdi { get; set; }
        public decimal ValorComBdi { get; set; }
        public decimal ValorTotalComBdi { get; set; }
        public List<ItemsMedicoesProjetoEntidade> ItemsMedicoesProjeto { get; set; }

        public ItemsContratoEntidade(int idContrato, int idItem, int idQuantidade, decimal unidade,
            decimal valorSemBdi, decimal valorComBdi, decimal valorTotalComBdi): base()
        {
            this.ContratosId = idContrato;
            this.ItemId = idItem;
            this.QuantidadeId = idQuantidade;
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