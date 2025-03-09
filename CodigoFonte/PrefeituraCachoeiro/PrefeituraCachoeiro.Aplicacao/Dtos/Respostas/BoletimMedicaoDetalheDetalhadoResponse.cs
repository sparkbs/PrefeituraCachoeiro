using System.Diagnostics.CodeAnalysis;

namespace PrefeituraCachoeiro.Aplicacao.Dtos.Respostas
{
    [ExcludeFromCodeCoverage]
    public class BoletimMedicaoDetalheDetalhadoResponse
    {
        public string Numero { get; set; }
        public string CodigoAta { get; set; }
        public string Descricao { get; set; }
        public int Quantidade { get; set; }
        public QuantidadeResponse QuantidadeResponse { get; set; }
        public string Unidade { get; set; }
        public decimal? PrecoSemBdi { get; set; }
        public decimal? Bdi { get; set; }
        public decimal? PrecoComBdi { get; set; }
        public decimal? ValorTotal { get; set; }
    }
}