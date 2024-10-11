using System.Diagnostics.CodeAnalysis;

namespace PrefeituraCachoeiro.Aplicacao.Dtos.Requisicoes
{
    [ExcludeFromCodeCoverage]
    public class AtualizarUsuarioRequest
    {
        public int Id { get; set; }
        public string? Login { get; set; }
        public string? Nome { get; set; }
        public string? Senha { get; set; }
    }
}