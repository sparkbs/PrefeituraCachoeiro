namespace PrefeituraCachoeiro.Aplicacao.Dtos.Respostas
{
    public class CriarArquivosMedicoesProjetoResponse
    {
        public bool IsSucesso { get; set; }
        public string MensagemErro { get; set; }

        public CriarArquivosMedicoesProjetoResponse(): this(true, string.Empty)
        {

        }

        public CriarArquivosMedicoesProjetoResponse(bool isSucesso, string mensagemErro)
        {
            IsSucesso = isSucesso;
            MensagemErro = mensagemErro;
        }
    }
}