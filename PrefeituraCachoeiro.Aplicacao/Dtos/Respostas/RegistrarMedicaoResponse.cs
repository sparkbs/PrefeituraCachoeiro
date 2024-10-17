using System.Diagnostics.CodeAnalysis;

namespace PrefeituraCachoeiro.Aplicacao.Dtos.Respostas
{
    [ExcludeFromCodeCoverage]
    public abstract class RegistrarMedicaoResponse
    {
        public bool IsSucesso { get; set; }
        public string MensagemErro { get; set; }

        public RegistrarMedicaoResponse(): this(true, string.Empty)
        {

        }

        public RegistrarMedicaoResponse(bool isSucesso, string mensagemErro)
        {
            IsSucesso = isSucesso;
            MensagemErro = mensagemErro;
        }
    }
}