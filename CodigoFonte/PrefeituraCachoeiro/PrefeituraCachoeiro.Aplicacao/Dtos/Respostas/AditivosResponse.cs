using System.Diagnostics.CodeAnalysis;

namespace PrefeituraCachoeiro.Aplicacao.Dtos.Respostas
{
    [ExcludeFromCodeCoverage]
    public class AditivosResponse
    {
        public int IdAditivo { get; set; }
        public int ContratoId { get; set; }
        public DateTime DataAssinatura { get; set; }
        public DateTime DataValidade { get; set; }
        public string TipoAditivo { get; set; }
    }
}