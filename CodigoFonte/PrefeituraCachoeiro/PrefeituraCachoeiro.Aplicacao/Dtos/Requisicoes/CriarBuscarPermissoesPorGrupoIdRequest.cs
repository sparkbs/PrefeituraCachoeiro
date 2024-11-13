using System.Diagnostics.CodeAnalysis;

namespace PrefeituraCachoeiro.Aplicacao.Dtos.Requisicoes
{
    [ExcludeFromCodeCoverage]
    public class CriarBuscarPermissoesPorGrupoIdRequest
    {
        public int GrupoId { get; set; }
    }
}