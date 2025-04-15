namespace PrefeituraCachoeiro.Aplicacao.Dtos.Respostas
{
    public class IdDocumentoRegistradoResponse
    {
        public int Id { get; set; }
        public string ArquivoMedicao { get; set; }
        public string Arquivo { get; set; }

        public IdDocumentoRegistradoResponse()
        {

        }

        public IdDocumentoRegistradoResponse(int id, string arquivoMedicao)
        {
            Id = id;
            ArquivoMedicao = arquivoMedicao;
        }
    }
}
