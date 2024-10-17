using System.Diagnostics.CodeAnalysis;

namespace PrefeituraCachoeiro.Aplicacao.Dtos.Respostas
{
    [ExcludeFromCodeCoverage]
    public class GruposResponse
    {
        public int IdGrupo { get; set; }
        public string? Nome { get; set; }
    }
}