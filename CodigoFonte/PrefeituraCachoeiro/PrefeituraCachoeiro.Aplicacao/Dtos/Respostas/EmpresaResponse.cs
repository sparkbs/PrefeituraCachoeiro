using System.Diagnostics.CodeAnalysis;

namespace PrefeituraCachoeiro.Aplicacao.Dtos.Respostas
{
    [ExcludeFromCodeCoverage]
    public class EmpresaResponse
    {
        public int EmpresaId { get; set; }
        public string Nome { get; set; }
        public string Logo { get; set; }
    }
}