namespace PrefeituraCachoeiro.Aplicacao.Dtos.Respostas
{
    public class RegistrarDocumentosContratoResponse
    {
        public List<IdDocumentoContratoRegistradoResponse> Ids { get; set; }
        public bool IsSucesso { get; set; }
        public string MensagemErro { get; set; }

        public RegistrarDocumentosContratoResponse() : this(true, string.Empty)
        {
            this.Ids = new List<IdDocumentoContratoRegistradoResponse>();
        }

        public RegistrarDocumentosContratoResponse(bool isSucesso, string mensagemErro)
        {
            IsSucesso = isSucesso;
            MensagemErro = mensagemErro;
        }
    }
}