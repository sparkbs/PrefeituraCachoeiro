namespace PrefeituraCachoeiro.Aplicacao.Dtos.Respostas
{
    public class RegistrarDocumentosAditivoResponse
    {
        public List<IdDocumentoAditivoRegistradoResponse> Ids { get; set; }
        public bool IsSucesso { get; set; }
        public string MensagemErro { get; set; }

        public RegistrarDocumentosAditivoResponse() : this(true, string.Empty)
        {
            this.Ids = new List<IdDocumentoAditivoRegistradoResponse>();
        }

        public RegistrarDocumentosAditivoResponse(bool isSucesso, string mensagemErro)
        {
            IsSucesso = isSucesso;
            MensagemErro = mensagemErro;
        }
    }
}