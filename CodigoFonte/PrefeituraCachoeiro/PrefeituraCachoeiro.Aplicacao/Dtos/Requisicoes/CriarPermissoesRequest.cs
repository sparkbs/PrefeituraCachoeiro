using System.Diagnostics.CodeAnalysis;

namespace PrefeituraCachoeiro.Aplicacao.Dtos.Requisicoes
{
    [ExcludeFromCodeCoverage]
    public class CriarPermissoesRequest
    {
        public int TipoPermissaoId { get; set; }
        public int GrupoId { get; set; }
    }
}