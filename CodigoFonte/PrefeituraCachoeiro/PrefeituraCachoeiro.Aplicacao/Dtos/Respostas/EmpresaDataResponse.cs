using System.Diagnostics.CodeAnalysis;

namespace PrefeituraCachoeiro.Aplicacao.Dtos.Respostas
{
    [ExcludeFromCodeCoverage]
    public class EmpresaDataResponse
    {
        public List<EmpresaResponse>? Data { get; set; }
        public int TotalRegisters { get; set; }
    }
}