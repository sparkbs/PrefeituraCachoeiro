using System.Diagnostics.CodeAnalysis;

namespace PrefeituraCachoeiro.Aplicacao.Dtos.Requisicoes
{
    [ExcludeFromCodeCoverage]
    public class CriarBuscarPermissaoPorGruposRequest
    {
        public int GrupoId { get; set; }
        public int TipoPermissaoId { get; set; }
    }
}