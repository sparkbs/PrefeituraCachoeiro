using System.Diagnostics.CodeAnalysis;

namespace PrefeituraCachoeiro.Aplicacao.Dtos.Respostas
{
    [ExcludeFromCodeCoverage]
    public class DeletarMedicaoResponse
    {
        public string Mensagem { get; set; } = null!;
    }
}