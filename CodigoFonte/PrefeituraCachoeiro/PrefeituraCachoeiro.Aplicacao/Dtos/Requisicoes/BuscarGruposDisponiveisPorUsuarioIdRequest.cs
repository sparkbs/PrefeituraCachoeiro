using System.Diagnostics.CodeAnalysis;

namespace PrefeituraCachoeiro.Aplicacao.Dtos.Requisicoes
{
    [ExcludeFromCodeCoverage]
    public class BuscarGruposDisponiveisPorUsuarioIdRequest
    {
        public int UsuarioId { get; set; }
    }
}