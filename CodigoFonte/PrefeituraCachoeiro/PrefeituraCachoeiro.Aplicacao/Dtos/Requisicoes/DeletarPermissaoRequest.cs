using System.Diagnostics.CodeAnalysis;

namespace PrefeituraCachoeiro.Aplicacao.Dtos.Requisicoes
{
    [ExcludeFromCodeCoverage]
    public class DeletarPermissaoRequest
    {
        public int TipoPermissaoId { get; set; }
        public int GrupoId { get; set; }
    }
}