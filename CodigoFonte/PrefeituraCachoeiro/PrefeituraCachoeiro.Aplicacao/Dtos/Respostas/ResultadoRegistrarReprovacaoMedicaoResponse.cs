using System.Diagnostics.CodeAnalysis;

namespace PrefeituraCachoeiro.Aplicacao.Dtos.Respostas
{
    [ExcludeFromCodeCoverage]
    public class ResultadoRegistrarReprovacaoMedicaoResponse: RegistrarMedicaoResponse
    {
        public ResultadoRegistrarReprovacaoMedicaoResponse() : base()
        {

        }

        public ResultadoRegistrarReprovacaoMedicaoResponse(bool isSucesso, string mensagemErro)
            : base(isSucesso, mensagemErro)
        {

        }
    }
}