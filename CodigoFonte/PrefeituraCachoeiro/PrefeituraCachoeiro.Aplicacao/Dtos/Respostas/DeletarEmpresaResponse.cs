using System.Diagnostics.CodeAnalysis;

namespace PrefeituraCachoeiro.Aplicacao.Dtos.Respostas
{
    [ExcludeFromCodeCoverage]
    public class DeletarEmpresaResponse
    {
        public string Mensagem { get; set; } = null!;

        public DeletarEmpresaResponse(string mensagem)
        {
            Mensagem = mensagem;
        }
    }
}