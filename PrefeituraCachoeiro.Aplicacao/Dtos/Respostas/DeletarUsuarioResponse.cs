using System.Diagnostics.CodeAnalysis;

namespace PrefeituraCachoeiro.Aplicacao.Dtos.Respostas
{
    [ExcludeFromCodeCoverage]
    public class DeletarUsuarioResponse
    {
        public string Mensagem { get; set; } = null!;
    }
}