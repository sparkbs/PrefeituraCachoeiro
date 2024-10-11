using System.Diagnostics.CodeAnalysis;

namespace PrefeituraCachoeiro.Aplicacao.Dtos.Respostas
{
    [ExcludeFromCodeCoverage]
    public class ProjetoResponse
    {
        public int IdProjeto { get; set; }
        public string? NomeProjeto { get; set; }
    }
}