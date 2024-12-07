using System.Diagnostics.CodeAnalysis;

namespace PrefeituraCachoeiro.Aplicacao.Dtos.Respostas
{
    [ExcludeFromCodeCoverage]
    public class ContratosResponse
    {
        public int IdContrato { get; set; }
        public List<ProjetoResponse> Projetos { get; set; }
        public DateTime DataContrato { get; set; }
        public string? NumeroContrato { get; set; }
        public decimal? ValorTotalPrevisto { get; set; }
        public decimal? ValorTotalSolicitado { get; set; }
        public decimal? ValorTotalMedido { get; set; }
        public decimal? ValorSaldoRestante { get; set; }
        public IEnumerable<ItemsContratoResponse> Items { get; set; }
        public int? EmpresaId { get; set; }
        public EmpresaResponse Empresa { get; set; }
        public decimal Valor { get; set; }
        public int TipoContratacao { get; set; }
        public string Gerente { get; set; }
        public DateTime? DataTermino { get; set; }
        public DateTime? DataInicio { get; set; }
        public int? PrefeituraId { get; set; }
        public PrefeituraResponse Prefeitura { get; set; }
    }
}