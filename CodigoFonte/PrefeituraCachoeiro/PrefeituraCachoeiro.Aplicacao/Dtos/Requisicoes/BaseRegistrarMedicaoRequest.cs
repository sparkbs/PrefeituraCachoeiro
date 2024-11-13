using System.Diagnostics.CodeAnalysis;

namespace PrefeituraCachoeiro.Aplicacao.Dtos.Requisicoes
{
    [ExcludeFromCodeCoverage]
    public abstract class BaseRegistrarMedicaoRequest
    {
        public int IdMedicoesProjeto { get; set; }
        public DateTime DataRegistro { get; set; }
        public string? Resumo { get; set; }
    }
}