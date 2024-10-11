using System.Diagnostics.CodeAnalysis;

namespace PrefeituraCachoeiro.Aplicacao.Dtos.Respostas
{
    [ExcludeFromCodeCoverage]
    public class UsuariosDataResponse
    {
        public List<UsuariosResponse>? Data { get; set; }
        public int TotalRegisters { get; set; }
    }
}