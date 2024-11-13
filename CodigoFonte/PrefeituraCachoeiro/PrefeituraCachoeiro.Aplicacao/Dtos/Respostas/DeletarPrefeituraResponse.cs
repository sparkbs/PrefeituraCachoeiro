using System.Diagnostics.CodeAnalysis;

namespace PrefeituraCachoeiro.Aplicacao.Dtos.Respostas
{
    [ExcludeFromCodeCoverage]
    public class DeletarPrefeituraResponse
    {
        public string Mensagem { get; set; } = null!;

        public DeletarPrefeituraResponse(string mensagem)
        {
            Mensagem = mensagem;
        }   
    }
}