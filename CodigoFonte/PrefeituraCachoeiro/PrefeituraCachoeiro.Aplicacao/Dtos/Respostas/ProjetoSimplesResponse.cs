using System.Diagnostics.CodeAnalysis;

namespace PrefeituraCachoeiro.Aplicacao.Dtos.Respostas
{
    [ExcludeFromCodeCoverage]
    public class ProjetoSimplesResponse
    {
        public int IdProjeto { get; set; }
        public string? NomeProjeto { get; set; }
        public List<ContratoSimplesResponse> Contratos { get; set; }
    }
}
