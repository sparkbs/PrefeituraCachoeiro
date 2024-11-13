using System.Diagnostics.CodeAnalysis;

namespace PrefeituraCachoeiro.Aplicacao.Dtos.Requisicoes
{
    [ExcludeFromCodeCoverage]
    public class AtualizarMedicoesProjetoRequest: BaseMedicoesProjetoRequest
    {
        public int IdMedicoesProjeto { get; set; }
    }
}