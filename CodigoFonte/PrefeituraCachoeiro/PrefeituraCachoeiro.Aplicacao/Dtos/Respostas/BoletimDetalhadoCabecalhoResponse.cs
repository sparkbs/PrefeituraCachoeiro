using System.Diagnostics.CodeAnalysis;

namespace PrefeituraCachoeiro.Aplicacao.Dtos.Respostas
{
    [ExcludeFromCodeCoverage]
    public class BoletimDetalhadoCabecalhoResponse
    {
        public string NomePrefeitura { get; set; }
        public string NomeUnidade { get; set; }
        public string TipoBoletimEmissao { get; set; }
        public string ResumoBoletim { get; set; }
        public string DescontoFiscalizacao { get; set; }
        public decimal Bdi01 { get; set; }
        public string Bdi02 { get; set; }
        public string NomeBoletim { get; set; }
        public decimal Bdi { get; set; }
        public string LogoTipoImg { get; set; }
    }
}