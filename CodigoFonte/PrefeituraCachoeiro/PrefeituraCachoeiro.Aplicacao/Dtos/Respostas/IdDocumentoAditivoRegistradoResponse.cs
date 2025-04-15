namespace PrefeituraCachoeiro.Aplicacao.Dtos.Respostas
{
    public class IdDocumentoAditivoRegistradoResponse
    {
        public int Id { get; set; }
        public string ArquivoAditivo { get; set; }
        public string Arquivo { get; set; }

        public IdDocumentoAditivoRegistradoResponse()
        {

        }

        public IdDocumentoAditivoRegistradoResponse(int id, string arquivoAditivo)
        {
            Id = id;
            ArquivoAditivo = arquivoAditivo;
        }
    }
}