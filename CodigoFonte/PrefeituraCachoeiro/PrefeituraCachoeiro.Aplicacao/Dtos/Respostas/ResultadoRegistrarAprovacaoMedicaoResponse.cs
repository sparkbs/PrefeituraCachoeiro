using System.Diagnostics.CodeAnalysis;

namespace PrefeituraCachoeiro.Aplicacao.Dtos.Respostas
{
    [ExcludeFromCodeCoverage]
    public class ResultadoRegistrarAprovacaoMedicaoResponse: RegistrarMedicaoResponse

    {
        public ResultadoRegistrarAprovacaoMedicaoResponse() : base()
        {

        }

        public ResultadoRegistrarAprovacaoMedicaoResponse(bool isSucesso, string mensagemErro)
            : base(isSucesso, mensagemErro)
        {

        }
    }
}
