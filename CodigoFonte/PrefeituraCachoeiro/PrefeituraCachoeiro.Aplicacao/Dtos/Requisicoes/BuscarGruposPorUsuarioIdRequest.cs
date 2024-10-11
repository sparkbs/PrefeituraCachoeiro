using System.Diagnostics.CodeAnalysis;

namespace PrefeituraCachoeiro.Aplicacao.Dtos.Requisicoes
{
    [ExcludeFromCodeCoverage]
    public class BuscarGruposPorUsuarioIdRequest
    {
        public int UsuarioId { get; set; }
    }
}