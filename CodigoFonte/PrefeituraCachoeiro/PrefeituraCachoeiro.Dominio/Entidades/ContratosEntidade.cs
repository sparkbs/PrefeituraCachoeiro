namespace PrefeituraCachoeiro.Dominio.Entidades
{
    public class ContratosEntidade : EntidadeBase
    {
        public int IdContrato { get; set; }
        public DateTime DataContrato { get; set; }
        public string? NumeroContrato { get; set; }
        public decimal? ValorTotalPrevisto { get; set; }
        public decimal? ValorTotalSolicitado { get; set; }
        public decimal? ValorTotalMedido { get; set; }
        public decimal? ValorSaldoRestante { get; set; }
        public List<ItemsContratoEntidade> Items { get; set; }
        public List<MedicoesProjetoEntidade> MedicoesProjeto { get; set; }
        public int? EmpresaId { get; set; }
        public EmpresaEntidade Empresa { get; set; }
        public decimal? Valor { get; set; }
        public int? TipoContratacao { get; set; }
        public string Gerente { get; set; }
        public DateTime? DataTermino { get; set; }
        public DateTime? DataInicio { get; set; }
        public int? PrefeituraId { get; set; }
        public PrefeituraEntidade Prefeitura { get; set; }
        public List<ContratosProjetosEntidade> Projetos { get; set; }
        public int? Aditivo { get; set; }
        public List<ArquivosContratosEntidade> ArquivosContratos { get; set; }
        public string TipoAditivo { get; set; }
        public DateTime? DataAssinaturaAditivo { get; set; }
        public DateTime? DataValidadeAditivo { get; set; }
        public int? IdTemplate { get; set; }

        public ContratosEntidade(): base()
        {

        }

        public ContratosEntidade(DateTime dataContrato, string numeroContrato,
            decimal valorTotalPrevisto, decimal valorTotalSolicitado,
            decimal valorTotalMedido, decimal valorSaldoRestante): base()
        {
            this.DataContrato = dataContrato;
            this.NumeroContrato = numeroContrato;
            this.ValorTotalPrevisto = valorTotalPrevisto;
            this.ValorTotalSolicitado= valorTotalSolicitado;
            this.ValorTotalMedido = valorTotalMedido;
            this.ValorSaldoRestante =   valorSaldoRestante;
        }
    }
}