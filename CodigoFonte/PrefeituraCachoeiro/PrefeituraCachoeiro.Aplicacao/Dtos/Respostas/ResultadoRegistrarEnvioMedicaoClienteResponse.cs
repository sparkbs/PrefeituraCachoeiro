using System.Diagnostics.CodeAnalysis;

namespace PrefeituraCachoeiro.Aplicacao.Dtos.Respostas
{
    [ExcludeFromCodeCoverage]
    public class ResultadoRegistrarEnvioMedicaoClienteResponse : RegistrarMedicaoResponse
    {
        public ResultadoRegistrarEnvioMedicaoClienteResponse() : base()
        {

        }

        public ResultadoRegistrarEnvioMedicaoClienteResponse(bool isSucesso, string mensagemErro)
            : base(isSucesso, mensagemErro)
        {

        }
    }
}