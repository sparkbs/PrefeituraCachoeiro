using System.Diagnostics.CodeAnalysis;

namespace PrefeituraCachoeiro.Aplicacao.Dtos.Requisicoes
{
    [ExcludeFromCodeCoverage]
    public class AtualizarGrupoRequest
    {
        public int Id { get; set; }
        public string Nome { get; set; }
    }
}