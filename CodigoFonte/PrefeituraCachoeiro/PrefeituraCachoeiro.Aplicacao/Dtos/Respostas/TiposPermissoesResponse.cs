using System.Diagnostics.CodeAnalysis;

namespace PrefeituraCachoeiro.Aplicacao.Dtos.Respostas
{
    [ExcludeFromCodeCoverage]
    public class TiposPermissoesResponse
    {
        public int IdTipoPermissao { get; set; }
        public string? Nome { get; set; }
    }
}