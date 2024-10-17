using System.Diagnostics.CodeAnalysis;

namespace PrefeituraCachoeiro.Aplicacao.Dtos.Requisicoes
{
    [ExcludeFromCodeCoverage]
    public class DeletarUsuarioGrupoRequest
    {
        public int UsuarioId { get; set; }
        public int GrupoId { get; set; }
    }
}