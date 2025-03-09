namespace PrefeituraCachoeiro.Aplicacao.Dtos.Respostas
{
    public class RegistrarDocumentosMedicaoResponse
    {
        public List<IdDocumentoRegistradoResponse> Ids { get; set; }
        public bool IsSucesso { get; set; }
        public string MensagemErro { get; set; }

        public RegistrarDocumentosMedicaoResponse(): this(true, string.Empty)
        {
            this.Ids = new List<IdDocumentoRegistradoResponse>();
        }

        public RegistrarDocumentosMedicaoResponse(bool isSucesso, string mensagemErro)
        {
            IsSucesso = isSucesso;
            MensagemErro = mensagemErro;
        }
    }
}