using System.Diagnostics.CodeAnalysis;

namespace PrefeituraCachoeiro.Aplicacao.Dtos.Requisicoes
{
    [ExcludeFromCodeCoverage]
    public class AtualizarEmpresaRequest : BaseEmpresaRequest
    {
        public int EmpresaId { get; set; }
    }
}