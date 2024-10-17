using System.Diagnostics.CodeAnalysis;

namespace PrefeituraCachoeiro.Aplicacao.Dtos.Respostas
{
    [ExcludeFromCodeCoverage]
    public class UsuariosResponse
    {
        public int IdUsuario { get; set; }
        public string? Login { get; set; }
        public string? Nome { get; set; }
    }
}