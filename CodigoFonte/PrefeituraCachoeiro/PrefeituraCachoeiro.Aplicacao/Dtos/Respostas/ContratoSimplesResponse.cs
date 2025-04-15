using System.Diagnostics.CodeAnalysis;

namespace PrefeituraCachoeiro.Aplicacao.Dtos.Respostas
{
    [ExcludeFromCodeCoverage]
    public class ContratoSimplesResponse
    {
        public int IdContrato { get; set; }
        public DateTime DataContrato { get; set; }
        public string? NumeroContrato { get; set; }
        public decimal? ValorTotalPrevisto { get; set; }
        public decimal? ValorTotalSolicitado { get; set; }
        public decimal? ValorTotalMedido { get; set; }
        public decimal? ValorSaldoRestante { get; set; }
        //remover public List<ItemsContratoSimplesResponse> Items { get; set; }
        public int? EmpresaId { get; set; }
        //public EmpresaResponse Empresa { get; set; }
        public decimal? Valor { get; set; }
        public int? TipoContratacao { get; set; }
        public string Gerente { get; set; }
        public DateTime? DataTermino { get; set; }
        public DateTime? DataInicio { get; set; }
        public int? PrefeituraId { get; set; }
        //public PrefeituraResponse Prefeitura { get; set; }
        public int? Aditivo { get; set; }
        public List<string> Arquivos { get; set; }
        public string TipoAditivo { get; set; }
        public DateTime? DataAssinaturaAditivo { get; set; }
        public DateTime? DataValidadeAditivo { get; set; }
        public DateTime? DataTerminoAtualizada { get; set; }
        public decimal? ValorAtualContrato { get; set; }
    }
}