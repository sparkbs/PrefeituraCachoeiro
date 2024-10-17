namespace PrefeituraCachoeiro.Dominio.Entidades
{
    public class ContratosEntidade : EntidadeBase
    {
        public int IdContrato { get; set; }
        public int IdProjeto { get; set; }
        public ProjetoEntidade Projeto { get; set; }
        public DateTime DataContrato { get; set; }
        public string? NumeroContrato { get; set; }
        public decimal? ValorTotalPrevisto { get; set; }
        public decimal? ValorTotalSolicitado { get; set; }
        public decimal? ValorTotalMedido { get; set; }
        public decimal? ValorSaldoRestante { get; set; }
        public List<ItemsContratoEntidade> Items { get; set; }
        public List<MedicoesProjetoEntidade> MedicoesProjeto { get; set; }

        public ContratosEntidade(): base()
        {

        }

        public ContratosEntidade(int idProjeto, DateTime dataContrato, string numeroContrato,
            decimal valorTotalPrevisto, decimal valorTotalSolicitado,
            decimal valorTotalMedido, decimal valorSaldoRestante): base()
        {
            this.IdProjeto = idProjeto;
            this.DataContrato = dataContrato;
            this.NumeroContrato = numeroContrato;
            this.ValorTotalPrevisto = valorTotalPrevisto;
            this.ValorTotalSolicitado= valorTotalSolicitado;
            this.ValorTotalMedido = valorTotalMedido;
            this.ValorSaldoRestante =   valorSaldoRestante;
        }
    }
}